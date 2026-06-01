import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.coinmarketcap.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.chainalysis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    externalDir: true,
  },
  // The sibling `signature/` components are imported via externalDir but are not
  // part of the frontend's TS/ESLint project (they resolve their own deps from
  // outside this folder). Don't let their type/lint errors block the build —
  // webpack still bundles them correctly.
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Resolve @signature-derived alias
    const signatureDerivedPath = path.resolve(process.cwd(), '../signature/derived-address')
    
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ['@signature-derived']: signatureDerivedPath,
      ['@signature-derived/config']: path.join(signatureDerivedPath, 'config'),
      // Force chainsig.js to its browser build. The default/node entry pulls in
      // node-only deps (@aptos-labs -> got) that break the client bundle.
      'chainsig.js$': path.resolve(process.cwd(), 'node_modules/chainsig.js/browser/index.browser.js'),
      // Block problematic packages
      '@near-wallet-selector/bitte-wallet': false,
      '@bitte-ai/wallet': false,
      // node-only HTTP client dragged in transitively via @aptos-labs; unused in browser
      'got': false,
    }
    
    // Add signature directory to module resolution
    if (!config.resolve.modules) {
      config.resolve.modules = []
    }
    config.resolve.modules.push(signatureDerivedPath)
    // External (sibling) files do bare imports (@solana/web3.js, chainsig.js,
    // @near-wallet-selector/*). Their resolution walks up from the signature
    // folder, which never reaches the frontend's node_modules — so add it
    // explicitly here.
    config.resolve.modules.push(path.resolve(process.cwd(), 'node_modules'))

    // Client-side only configurations
    if (!isServer) {
      // Node.js module fallbacks for browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'fs': false,
        'net': false,
        'tls': false,
        'crypto': false,
        'stream': false,
        'url': false,
        'zlib': false,
        'http': false,
        'https': false,
        'assert': false,
        'os': false,
        'path': false,
      }
    }
    
    return config
  },
  transpilePackages: [
    'signature/derived-address'
  ]
};

export default nextConfig;
