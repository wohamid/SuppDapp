export const domain = window.location.host;
export const origin = window.location.origin;

export const BACKEND_ADDR = new URL(origin).href
console.log('BACKEND_ADDR', BACKEND_ADDR);