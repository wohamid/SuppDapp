export const domain = window.location.host;
export const origin = window.location.origin;

// export const BACKEND_ADDR = `${origin}/api`;
export const BACKEND_ADDR = new URL(process.env.BACKEND_HOST).href
console.log('BACKEND_ADDR', BACKEND_ADDR);