// Base URL for SMS API - uses environment variable or falls back to default
export const API_BASE_URL =
  import.meta.env.VITE_SMS_BASE_URL || 'http://47.129.223.178:5000'
