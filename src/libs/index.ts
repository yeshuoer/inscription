export const log = console.log.bind(console, '🚗')

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// export const host = process.env.