// Check Next.js environment
const { loadEnvConfig } = require('@next/env');

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

console.log('NODE_ENV via process.env:', process.env.NODE_ENV || 'not set');
console.log('NODE_ENV via Next.js:', process.env.NEXT_PUBLIC_NODE_ENV || 'not set in Next.js');
console.log('Is development:', process.env.NODE_ENV !== 'production');
console.log('Is production:', process.env.NODE_ENV === 'production');
