/** @type {import('next').NextConfig} */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dominios = []

dominios.push('modafeminina.blendibox.com.br'); 


const nextConfig = {
	output: 'export',
    reactStrictMode: true,
    images: { remotePatterns: dominios.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
	 unoptimized: true,
   },
   turbopack: {
      resolveExtensions: [ '.ts', '.jsx', '.js', '.jsonl', '.json','.mjs', '.cjs'],
   },
   webpack: (config) => {
      config.resolve.alias['@components'] = path.resolve(__dirname, 'components');
      return config;
   },

}

export default nextConfig;

