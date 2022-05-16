export const domain = window.location.host;
export const origin = window.location.origin;

export const BACKEND_ADDR = new URL(`${origin}/api`).href
console.log('BACKEND_ADDR', BACKEND_ADDR);
