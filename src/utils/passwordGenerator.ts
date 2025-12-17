export function generatePassword(length = 16): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.?/|~";

  const all = lower + upper + digits + symbols;
  const result: string[] = [];

  const cryptoRandom = (max: number) => {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] % max;
  };

  result.push(lower[cryptoRandom(lower.length)]);
  result.push(upper[cryptoRandom(upper.length)]);
  result.push(digits[cryptoRandom(digits.length)]);
  result.push(symbols[cryptoRandom(symbols.length)]);

  while (result.length < length) {
    result.push(all[cryptoRandom(all.length)]);
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = cryptoRandom(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join("");
}
