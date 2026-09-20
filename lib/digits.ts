import type { FormEvent } from "react";

// Users often type with a Persian keyboard; validation and the API expect English digits.
export function toEnglishDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

// Mobile number as 09xxxxxxxxx: English digits only, and a pasted or
// autofilled +98 / 0098 prefix becomes 0.
export function normalizeMobile(value: string): string {
  const digits = toEnglishDigits(value).replace(/\D/g, "");
  if (/^0098\d{10}$/.test(digits)) return `0${digits.slice(4)}`;
  if (/^98\d{10}$/.test(digits)) return `0${digits.slice(2)}`;
  return digits;
}

export const isMobile = (value: string) => /^09\d{9}$/.test(value);

// onInput for uncontrolled mobile inputs: shows the normalized number while typing.
export function mobileOnInput(event: FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const next = normalizeMobile(input.value).slice(0, 11);
  if (next !== input.value) input.value = next;
}

// onInput for uncontrolled text inputs: converts digits in place, keeping the caret.
export function englishDigitsOnInput(event: FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const next = toEnglishDigits(input.value);
  if (next === input.value) return;
  const { selectionStart, selectionEnd } = input;
  input.value = next;
  input.setSelectionRange(selectionStart, selectionEnd);
}
