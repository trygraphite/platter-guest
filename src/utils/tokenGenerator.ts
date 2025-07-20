// utils/tokenGenerator.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique token for user session (Edge-compatible)
 * @param key - Base key for token generation
 * @param length - Length of generated token (default: 36)
 * @returns Unique token string (Promise)
 */
export async function uniqueRandom(key: string, length: number = 36): Promise<string> {
  // Generate components for uniqueness
  const timestamp = Date.now().toString();
  const randomChars = Array.from({ length: 10 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('')
  const uuid = uuidv4()

  // Combine components
  const baseString = `${key}${timestamp}${randomChars}${uuid}`;

  // Hash with Web Crypto API (SHA-256)
  const encoder = new TextEncoder();
  const data = encoder.encode(baseString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Adjust to requested length
  if (length <= hashHex.length) {
    return hashHex.slice(0, length)
  } else {
    // Pad with random chars if length > hash length
    const paddingLength = length - hashHex.length;
    const padding = Array.from({ length: paddingLength }, () =>
      Math.random().toString(36).charAt(2)
    ).join('')
    return hashHex + padding
  }
}

/**
 * Generate a user token based on request information (Edge-compatible)
 * @param userAgent - User agent string from request headers
 * @param ip - IP address from request
 * @param length - Token length (default: 36)
 * @returns Generated user token (Promise)
 */
export async function generateUserToken(userAgent: string = 'unknown', ip: string = 'unknown', length: number = 36): Promise<string> {
  const tokenKey = `${userAgent}-${ip}`;
  return uniqueRandom(tokenKey, length);
}