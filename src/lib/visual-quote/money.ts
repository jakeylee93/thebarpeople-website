// Money for the visual quote builder.
//
// Every amount is a whole number of pence. Prices are never stored or added as
// floating-point pounds, and nothing here rounds: if a calculation would leave
// a fraction of a penny we throw, because no rounding rule has been confirmed.

export type Pence = number;

export function isPence(value: unknown): value is Pence {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function assertPence(value: number, what: string): Pence {
  if (!isPence(value)) {
    throw new Error(`${what} must be a whole, non-negative number of pence (got ${String(value)})`);
  }
  return value;
}

/**
 * Exact cost of an hourly rate over a number of minutes.
 * £28/h over 15-minute steps always lands on whole pence (700p per quarter
 * hour). Anything that would not is refused rather than silently rounded.
 */
export function rateForMinutes(ratePerHour: Pence, minutes: number): Pence {
  assertPence(ratePerHour, 'Hourly rate');
  if (!Number.isSafeInteger(minutes) || minutes < 0) {
    throw new Error(`Minutes must be a whole, non-negative number (got ${String(minutes)})`);
  }
  const numerator = ratePerHour * minutes;
  if (numerator % 60 !== 0) {
    throw new Error(
      `${formatPence(ratePerHour)}/h for ${minutes} min is not a whole number of pence; no rounding rule is confirmed`,
    );
  }
  return numerator / 60;
}

export function multiplyPence(amount: Pence, quantity: number): Pence {
  assertPence(amount, 'Amount');
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new Error(`Quantity must be a whole, non-negative number (got ${String(quantity)})`);
  }
  return assertPence(amount * quantity, 'Line total');
}

export function sumPence(values: readonly Pence[]): Pence {
  let total = 0;
  for (const value of values) total += assertPence(value, 'Amount');
  return assertPence(total, 'Total');
}

/** "£1,234.50" — built from integers so display never drifts from the maths. */
export function formatPence(amount: Pence): string {
  assertPence(amount, 'Amount');
  const pounds = Math.floor(amount / 100);
  const pence = amount % 100;
  return `£${pounds.toLocaleString('en-GB')}.${String(pence).padStart(2, '0')}`;
}

/** "£336" for whole pounds, otherwise "£336.50" — for compact totals. */
export function formatPenceCompact(amount: Pence): string {
  return amount % 100 === 0 ? formatPence(amount).slice(0, -3) : formatPence(amount);
}
