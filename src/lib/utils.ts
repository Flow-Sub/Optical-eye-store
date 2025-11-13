import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures a URL has a protocol (https://)
 * Handles various cases:
 * - Already has http:// or https:// → returns as-is
 * - Missing protocol → adds https://
 * - Empty/null/undefined → returns empty string
 * 
 * @param url - The URL to normalize
 * @returns Normalized URL with protocol
 */
export function ensureUrlProtocol(url: string | null | undefined): string {
  // Handle empty/null/undefined
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  const trimmedUrl = url.trim();

  // Already has protocol - return as-is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Add https:// protocol
  return `https://${trimmedUrl}`;
}

/**
 * Normalizes an array of image URLs
 * Filters out empty values and ensures all URLs have protocols
 * 
 * @param urls - Array of URLs to normalize
 * @returns Array of normalized URLs
 */
export function normalizeImageUrls(urls: (string | null | undefined)[] | null | undefined): string[] {
  if (!urls || !Array.isArray(urls)) {
    return [];
  }

  return urls
    .map(url => ensureUrlProtocol(url))
    .filter(url => url.length > 0); // Remove empty strings
}