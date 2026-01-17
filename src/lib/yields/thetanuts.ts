/**
 * Thetanuts Options Vault APY Fetching
 * Fetches APY data from Thetanuts Finance vaults
 */

import { YieldData, BASELINE_APYS, DEMO_APYS, USE_DEMO_MODE } from './types';

// Thetanuts API endpoint (mainnet)
const THETANUTS_API_BASE = 'https://api.thetanuts.finance/v2';

interface ThetanutsVaultData {
  vault: string;
  apy: number;
  tvl: number;
  utilizationRate: number;
}

/**
 * Fetch current APY from Thetanuts options vault
 * In demo mode, returns fixed values for predictable rebalance opportunities
 */
export async function fetchThetanutsAPY(): Promise<YieldData> {
  // Demo mode: skip API and return mock data directly
  if (USE_DEMO_MODE) {
    return getMockThetanutsAPY();
  }

  try {
    // In production, this would fetch from Thetanuts API
    // For hackathon, we simulate realistic APY fluctuations
    const response = await fetchThetanutsVaultData();

    return {
      apy: response.apy,
      timestamp: Date.now(),
      source: 'api',
    };
  } catch (error) {
    console.warn('[Thetanuts] API fetch failed, using mock data:', error);
    return getMockThetanutsAPY();
  }
}

/**
 * Fetch vault data from Thetanuts API
 */
async function fetchThetanutsVaultData(): Promise<ThetanutsVaultData> {
  // Thetanuts doesn't have IDRX vaults yet, so we simulate
  // In a real implementation, you'd call their API:
  // const response = await fetch(`${THETANUTS_API_BASE}/vaults/idrx-covered-call`);

  // Simulate API response with realistic fluctuations
  const baseApy = BASELINE_APYS.thetanuts;
  const volatility = 0.15; // 15% volatility
  const randomFactor = 1 + (Math.random() - 0.5) * 2 * volatility;

  return {
    vault: 'IDRX-COVERED-CALL',
    apy: Number((baseApy * randomFactor).toFixed(2)),
    tvl: 1_000_000, // $1M TVL
    utilizationRate: 0.85,
  };
}

/**
 * Get mock APY data for testing/demo purposes
 * In demo mode, returns fixed APY to guarantee rebalance opportunities
 */
export function getMockThetanutsAPY(): YieldData {
  // Demo mode: return fixed APY for predictable rebalance suggestions
  if (USE_DEMO_MODE) {
    return {
      apy: DEMO_APYS.thetanuts,
      timestamp: Date.now(),
      source: 'mock',
    };
  }

  // Non-demo: Use time-based seed for consistent but varying results
  const hourSeed = Math.floor(Date.now() / (1000 * 60 * 60));
  const pseudoRandom = Math.sin(hourSeed * 12.9898) * 43758.5453;
  const normalizedRandom = pseudoRandom - Math.floor(pseudoRandom);

  // APY varies between 6-10% (base 8% +/- 25%)
  const baseApy = BASELINE_APYS.thetanuts;
  const variance = baseApy * 0.25;
  const apy = baseApy + (normalizedRandom - 0.5) * 2 * variance;

  return {
    apy: Number(apy.toFixed(2)),
    timestamp: Date.now(),
    source: 'mock',
  };
}

/**
 * Calculate estimated daily yield for a given principal
 * @param principal Amount in IDRX (with 2 decimals)
 * @param apy Annual percentage yield
 * @returns Daily yield in IDRX
 */
export function calculateDailyYield(principal: number, apy: number): number {
  const dailyRate = apy / 100 / 365;
  return principal * dailyRate;
}

/**
 * Calculate estimated monthly yield for a given principal
 * @param principal Amount in IDRX (with 2 decimals)
 * @param apy Annual percentage yield
 * @returns Monthly yield in IDRX
 */
export function calculateMonthlyYield(principal: number, apy: number): number {
  const monthlyRate = apy / 100 / 12;
  return principal * monthlyRate;
}
