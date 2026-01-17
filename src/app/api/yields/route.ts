import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAllYields,
  getMockYields,
  compareYields,
  getPreviousYields,
  calculateWeightedAPY,
  findOptimalAllocation,
  calculateRebalanceGain,
  STRATEGY_NAMES,
  BASELINE_APYS,
} from '@/lib/yields';
import type { StrategyYields, YieldSnapshot, YieldComparison } from '@/lib/yields';

interface YieldsResponse {
  success: boolean;
  yields?: StrategyYields;
  timestamp?: number;
  comparison?: YieldComparison;
  weightedAPY?: number;
  suggestions?: {
    optimalAllocation?: { thetanuts: number; aerodrome: number; staking: number };
    potentialGain?: number;
    riskProfile?: string;
  };
  error?: string;
}

/**
 * GET /api/yields
 * Get current yields for all strategies with optional comparison and suggestions
 *
 * Query params:
 * - refresh: Force refresh yields (skip cache)
 * - compare: Include comparison with previous yields
 * - allocation: Current allocation as JSON (for weighted APY calculation)
 * - riskProfile: Risk profile for optimal allocation suggestion
 */
export async function GET(request: NextRequest): Promise<NextResponse<YieldsResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const includeComparison = searchParams.get('compare') === 'true';
    const allocationParam = searchParams.get('allocation');
    const riskProfile = searchParams.get('riskProfile') as 'conservative' | 'balanced' | 'aggressive' | null;

    // Fetch yields (from cache or fresh)
    let snapshot: YieldSnapshot;
    try {
      snapshot = await fetchAllYields(forceRefresh);
    } catch {
      // Fall back to mock data if fetching fails
      console.warn('[Yields API] Fetch failed, using mock data');
      snapshot = getMockYields();
    }

    const response: YieldsResponse = {
      success: true,
      yields: snapshot.yields,
      timestamp: snapshot.timestamp,
    };

    // Include comparison if requested
    if (includeComparison) {
      const previousYields = getPreviousYields();
      response.comparison = compareYields(snapshot.yields, previousYields);
    }

    // Calculate weighted APY if allocation provided
    if (allocationParam) {
      try {
        const allocation = JSON.parse(allocationParam);
        if (
          typeof allocation.thetanuts === 'number' &&
          typeof allocation.aerodrome === 'number' &&
          typeof allocation.staking === 'number'
        ) {
          response.weightedAPY = calculateWeightedAPY(snapshot.yields, {
            thetanuts: allocation.thetanuts,
            aerodrome: allocation.aerodrome,
            staking: allocation.staking,
          });

          // Include optimization suggestions if risk profile provided
          if (riskProfile && ['conservative', 'balanced', 'aggressive'].includes(riskProfile)) {
            const optimalAllocation = findOptimalAllocation(snapshot.yields, riskProfile);
            const potentialGain = calculateRebalanceGain(
              snapshot.yields,
              allocation,
              optimalAllocation
            );

            // Only suggest rebalance if gain is meaningful (> 0.5%)
            if (potentialGain > 0.5) {
              response.suggestions = {
                optimalAllocation,
                potentialGain,
                riskProfile,
              };
            }
          }
        }
      } catch {
        console.warn('[Yields API] Invalid allocation parameter');
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Yields API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch yields' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/yields
 * Manually set mock yield data (for testing/demo purposes)
 *
 * Body:
 * - thetanuts: number (APY)
 * - aerodrome: number (APY)
 * - staking: number (APY)
 */
export async function POST(request: NextRequest): Promise<NextResponse<YieldsResponse>> {
  try {
    const body = await request.json();
    const { thetanuts, aerodrome, staking } = body;

    // Validate input
    if (
      typeof thetanuts !== 'number' ||
      typeof aerodrome !== 'number' ||
      typeof staking !== 'number'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid yields. All values must be numbers.',
        },
        { status: 400 }
      );
    }

    // Validate APY ranges (reasonable bounds)
    if (thetanuts < 0 || thetanuts > 100 || aerodrome < 0 || aerodrome > 100 || staking < 0 || staking > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'APY values must be between 0 and 100',
        },
        { status: 400 }
      );
    }

    // Create mock yields snapshot
    const timestamp = Date.now();
    const yields: StrategyYields = {
      thetanuts: { apy: thetanuts, timestamp, source: 'mock' },
      aerodrome: { apy: aerodrome, timestamp, source: 'mock' },
      staking: { apy: staking, timestamp, source: 'mock' },
    };

    return NextResponse.json({
      success: true,
      yields,
      timestamp,
    });
  } catch (error) {
    console.error('Yields POST error:', error);

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
