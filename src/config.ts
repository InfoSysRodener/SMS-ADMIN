// Base URL for SMS API - uses environment variable or falls back to default
export const API_BASE_URL =
  import.meta.env.VITE_SMS_BASE_URL || 'https://api.pingg.co'
