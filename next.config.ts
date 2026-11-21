import type {NextConfig} from 'next';

// Static export: the app is fully client-side and prerendered, which lets it
// run from file:// inside Electron (and be hosted on any static host).
const nextConfig: NextConfig = {
  output: 'export',
  // Relative asset paths so the bundle works under file:// (Electron).
  assetPrefix: './',
};

export default nextConfig;
