export const LEGAL_VERSION = "2026-08-15";

const LEGAL_STORAGE_KEY = "commentscopeLegalAccepted";

export function hasAcceptedLegalTerms() {
  return localStorage.getItem(LEGAL_STORAGE_KEY) === LEGAL_VERSION;
}

export function saveLegalAcceptance() {
  localStorage.setItem(LEGAL_STORAGE_KEY, LEGAL_VERSION);
}
