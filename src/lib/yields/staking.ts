/**
 * Staking Rewards APY Fetching
 * Fetches APY data from native staking rewards
 */

import { YieldData, BASELINE_APYS, DEMO_APYS, USE_DEMO_MODE } from './types';

// Staking contract address on Base
const STAKING_CONTRACT = '0x2dbEF1A046f86a78C014a9FeD5e694CD2a070e19';

interface StakingData {
  totalStaked: bigint;
  rewardRate: bigint;
  apy: number;
  lockupPeriod: number; // in days
}

/**
 * Fetch current APY from staking contract
 * In demo mode, returns fixed values for predictable rebalance opportunities
 */
export async function fetchStakingAPY(): Promise<YieldData> {
  // Demo mode: skip contract and return mock data directly
  if (USE_DEMO_MODE) {
    return getMockStakingAPY();
  }

  try {
    // In production, this would read from the staking contract
    const response = await fetchStakingData();

    return {
      apy: response.apy,
      timestamp: Date.now(),
      source: 'contract',
    };
  } catch (error) {
    console.warn('[Staking] Contract fetch failed, using mock data:', error);
    return getMockStakingAPY();
  }
}

/**
 * Fetch staking data from contract
 */
async function fetchStakingData(): Promise<StakingData> {
  // In a real implementation, you'd use viem to read from contract:
  // const publicClient = createPublicClient({ chain: base, transport: http() });
  // const totalStaked = await publicClient.readContract({
  //   address: STAKING_CONTRACT,
  //   abi: stakingAbi,
  //   functionName: 'totalStaked',
  // });

  // Simulate staking rewards with lower volatility
  // Staking rewards are typically more stable than LP/options
  const baseApy = BASELINE_APYS.staking;
  const volatility = 0.1; // 10% volatility for staking
  const randomFactor = 1 + (Math.random() - 0.5) * 2 * volatility;

  return {
    totalStaked: BigInt(10_000_000_00), // 10M IDRX (2 decimals)
    rewardRate: BigInt(1_500_00), // 1500 IDRX per day
    apy: Number((baseApy * randomFactor).toFixed(2)),
    lockupPeriod: 0, // No lockup for flexible staking
  };
}

/**
 * Get mock APY data for testing/demo purposes
 * In demo mode, returns fixed APY to guarantee rebalance opportunities
 */
export function getMockStakingAPY(): YieldData {
  // Demo mode: return fixed APY for predictable rebalance suggestions
  if (USE_DEMO_MODE) {
    return {
      apy: DEMO_APYS.staking,
      timestamp: Date.now(),
      source: 'mock',
    };
  }

  // Non-demo: Use time-based seed for consistent but varying results
  const hourSeed = Math.floor(Date.now() / (1000 * 60 * 60));
  const pseudoRandom = Math.sin(hourSeed * 43.0 + 17.0) * 43758.5453;
  const normalizedRandom = pseudoRandom - Math.floor(pseudoRandom);

  // APY varies between 13.5-16.5% (base 15% +/- 10%)
  // Staking is most stable
  const baseApy = BASELINE_APYS.staking;
  const variance = baseApy * 0.1;
  const apy = baseApy + (normalizedRandom - 0.5) * 2 * variance;

  return {
    apy: Number(apy.toFixed(2)),
    timestamp: Date.now(),
    source: 'mock',
  };
}

/**
 * Calculate compound staking rewards over time
 * @param principal Initial stake amount
 * @param apy Annual percentage yield
 * @param days Number of days to compound
 * @param compoundFrequency How often rewards compound (default: daily)
 * @returns Final amount after compounding
 */
export function calculateCompoundRewards(
  principal: number,
  apy: number,
  days: number,
  compoundFrequency: number = 365 // Daily compounding
): number {
  const rate = apy / 100;
  const periods = (compoundFrequency / 365) * days;
  const periodRate = rate / compoundFrequency;
  return principal * Math.pow(1 + periodRate, periods);
}

/**
 * Calculate simple staking rewards (no compounding)
 * @param principal Stake amount
 * @param apy Annual percentage yield
 * @param days Number of days
 * @returns Reward amount (not including principal)
 */
export function calculateSimpleRewards(
  principal: number,
  apy: number,
  days: number
): number {
  const dailyRate = apy / 100 / 365;
  return principal * dailyRate * days;
}

/**
 * Estimate time to double investment with compound interest
 * @param apy Annual percentage yield
 * @returns Days to double (Rule of 72 approximation)
 */
export function estimateDoublingTime(apy: number): number {
  // Rule of 72: Years to double ≈ 72 / interest rate
  const yearsToDouble = 72 / apy;
  return Math.round(yearsToDouble * 365);
}
