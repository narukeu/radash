import { iterate } from './array'

/**
 * Generates a random number between min and max
 */
export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Draw a random item from a list. Returns
 * null if the list is empty
 */
export const draw = <T>(array: readonly T[]): T | null => {
  const max = array.length
  if (max === 0) {
    return null
  }
  const index = random(0, max - 1)
  return array[index]
}

export const shuffle = <T>(array: readonly T[]): T[] => {
  return array
    .map(a => ({ rand: Math.random(), value: a }))
    .sort((a, b) => a.rand - b.rand)
    .map(a => a.value)
}

export const uid = (length: number, specials: string = '') => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + specials
  return iterate(
    length,
    acc => {
      return acc + characters.charAt(random(0, characters.length - 1))
    },
    ''
  )
}

export const jitter = (delay: number, factor = 0.2): number => {
  if (!Number.isFinite(delay) || delay < 0) return 0
  if (!Number.isFinite(factor) || factor < 0) factor = 0
  const jitter = delay * factor * random(-1, 1)
  return Math.max(0, delay + jitter)
}
