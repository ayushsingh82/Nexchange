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
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Resolve @signature-derived alias
    const signatureDerivedPath = path.resolve(process.cwd(), '../signature/derived-address')
    
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ['@signature-derived']: signatureDerivedPath,
      ['@signature-derived/config']: path.join(signatureDerivedPath, 'config'),
      // Block problematic packages
      '@near-wallet-selector/bitte-wallet': false,
      '@bitte-ai/wallet': false,
    }
    
    // Add signature directory to module resolution
    if (!config.resolve.modules) {
      config.resolve.modules = []
    }
    config.resolve.modules.push(signatureDerivedPath)
    
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
