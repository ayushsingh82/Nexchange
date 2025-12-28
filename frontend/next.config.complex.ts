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
  // Simple webpack config to resolve @signature-derived alias
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    const signatureDerivedPath = path.resolve(process.cwd(), '../signature/derived-address')
    
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ['@signature-derived']: signatureDerivedPath,
    }
    
    // Add signature directory to module resolution
    if (!config.resolve.modules) {
      config.resolve.modules = []
    }
    config.resolve.modules.push(signatureDerivedPath)
    
    return config
  },
  transpilePackages: [
    'signature/derived-address'
  ]
};

export default nextConfig;
