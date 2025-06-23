'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, optimism, baseSepolia } from 'wagmi/chains';

const projectId = 'YOUR_PROJECT_ID'; // Get this from WalletConnect Cloud

// Wagmi config
export const config = getDefaultConfig({
  appName: 'NeXchange',
  projectId,
  chains: [mainnet, optimism, baseSepolia],
});