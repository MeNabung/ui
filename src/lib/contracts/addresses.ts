import { base } from "wagmi/chains";

/**
 * Contract addresses for MeNabung protocol on Base mainnet
 */

export const IDRX_ADDRESS =
  "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22" as const;

// Deployed contract addresses on Base mainnet
export const CONTRACT_ADDRESSES = {
  [base.id]: {
    idrx: IDRX_ADDRESS,
    vault: "0x2c1374170f8E05AE8714aC8b93202bA86F43914b" as const,
    thetanutsAdapter: "0xF0C472b359A8F25404FBF906B5bfD87E676466b5" as const,
    aerodromeAdapter: "0x18c115CaAD5656b45162D4314c653374F0e61916" as const,
    stakingAdapter: "0x63f98bCE063cd74f5fbd4944Eb259f8c18F0026E" as const,
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

export function getContractAddress(
  chainId: number,
  contract: keyof (typeof CONTRACT_ADDRESSES)[typeof base.id]
): `0x${string}` {
  const addresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses[contract];
}

export function isContractDeployed(chainId: number): boolean {
  return chainId in CONTRACT_ADDRESSES;
}
