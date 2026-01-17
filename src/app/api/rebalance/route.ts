import { NextRequest, NextResponse } from 'next/server';
import { fetchAllYields, getMockYields, compareYields, getPreviousYields } from '@/lib/yields';
import {
  analyzeRebalance,
  shouldCheckRebalance,
  generateRebalanceCTA,
  generateSuggestionExplanation,
  formatSuggestionForChat,
  filterDismissedSuggestions,
  DEFAULT_REBALANCE_CONFIG,
} from '@/lib/rebalance';
import type { CurrentAllocation, RebalanceAnalysis, RebalanceConfig } from '@/lib/rebalance';
import type { RiskLevel } from '@/lib/ai/types';

interface RebalanceRequest {
  allocation: CurrentAllocation;
  totalValue: number;
  riskProfile?: RiskLevel;
  config?: Partial<RebalanceConfig>;
}

interface RebalanceResponse {
  success: boolean;
  analysis?: RebalanceAnalysis;
  cta?: {
    headline: string;
    subtext: string;
    urgency: 'low' | 'medium' | 'high';
  };
  chatMessage?: string;
  error?: string;
}

/**
 * POST /api/rebalance
 * Analyze current allocation and generate rebalance suggestions
 *
 * Body:
 * - allocation: { options: number, lp: number, staking: number } (percentages 0-100)
 * - totalValue: number (total portfolio value in IDRX)
 * - riskProfile?: 'conservative' | 'balanced' | 'aggressive' (default: 'balanced')
 * - config?: Partial<RebalanceConfig> (optional custom config)
 */
export async function POST(request: NextRequest): Promise<NextResponse<RebalanceResponse>> {
  try {
    const body = (await request.json()) as RebalanceRequest;
    const { allocation, totalValue, riskProfile = 'balanced', config } = body;

    // Validate allocation
    if (
      !allocation ||
      typeof allocation.options !== 'number' ||
      typeof allocation.lp !== 'number' ||
      typeof allocation.staking !== 'number'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid allocation. Must include options, lp, and staking percentages.',
        },
        { status: 400 }
      );
    }

    // Validate percentages sum to ~100
    const sum = allocation.options + allocation.lp + allocation.staking;
    if (Math.abs(sum - 100) > 1) {
      return NextResponse.json(
        {
          success: false,
          error: `Allocation must sum to 100. Current sum: ${sum}`,
        },
        { status: 400 }
      );
    }

    // Validate totalValue
    if (typeof totalValue !== 'number' || totalValue <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid totalValue. Must be a positive number.',
        },
        { status: 400 }
      );
    }

    // Validate risk profile
    if (!['conservative', 'balanced', 'aggressive'].includes(riskProfile)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid riskProfile. Must be conservative, balanced, or aggressive.',
        },
        { status: 400 }
      );
    }

    // Fetch current yields
    let yields;
    try {
      const snapshot = await fetchAllYields();
      yields = snapshot.yields;
    } catch {
      console.warn('[Rebalance API] Yield fetch failed, using mock data');
      const snapshot = getMockYields();
      yields = snapshot.yields;
    }

    // Analyze rebalance opportunity
    const fullConfig: RebalanceConfig = {
      ...DEFAULT_REBALANCE_CONFIG,
      riskProfile,
      ...config,
    };

    let analysis = analyzeRebalance(allocation, yields, totalValue, fullConfig);

    // Filter out previously dismissed suggestions
    analysis = {
      ...analysis,
      suggestions: filterDismissedSuggestions(analysis.suggestions),
    };

    // Update shouldRebalance if all suggestions were dismissed
    if (analysis.suggestions.length === 0 && analysis.shouldRebalance) {
      analysis = {
        ...analysis,
        shouldRebalance: false,
        primaryReason: 'All suggestions have been dismissed. Check back later for new opportunities.',
      };
    }

    // Generate CTA for UI
    const cta = generateRebalanceCTA(analysis);

    // Generate chat message for AI integration
    const chatMessage = formatSuggestionForChat(analysis);

    return NextResponse.json({
      success: true,
      analysis,
      cta,
      chatMessage,
    });
  } catch (error) {
    console.error('Rebalance API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rebalance
 * Check if rebalance should be considered based on yield changes
 *
 * Query params:
 * - threshold: Minimum APY change to trigger (default: 2.0)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const thresholdParam = searchParams.get('threshold');
    const threshold = thresholdParam ? parseFloat(thresholdParam) : 2.0;

    // Fetch current yields with comparison
    let yields;
    try {
      const snapshot = await fetchAllYields(true); // Force refresh
      yields = snapshot.yields;
    } catch {
      console.warn('[Rebalance API] Yield fetch failed, using mock data');
      const snapshot = getMockYields();
      yields = snapshot.yields;
    }

    // Get previous yields for comparison
    const previousYields = getPreviousYields();

    // Compare yields
    const comparison = compareYields(yields, previousYields, threshold);

    // Determine if user should check rebalance
    const { shouldCheck, reason } = shouldCheckRebalance(comparison, threshold);

    return NextResponse.json({
      success: true,
      shouldCheck,
      reason,
      comparison: {
        hasSignificantChange: comparison.hasSignificantChange,
        mostSignificantChange: comparison.mostSignificantChange,
        timestamp: comparison.timestamp,
      },
      currentYields: {
        thetanuts: yields.thetanuts.apy,
        aerodrome: yields.aerodrome.apy,
        staking: yields.staking.apy,
      },
    });
  } catch (error) {
    console.error('Rebalance check API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check rebalance status' },
      { status: 500 }
    );
  }
}
