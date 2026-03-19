import { randomInt } from 'crypto';

export function getRandomInt(): string {
  let max = randomInt(1, 9999);
  return Math.floor(Math.random() * max).toString();
}
