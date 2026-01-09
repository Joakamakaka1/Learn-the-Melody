/**
 * @file track-service.ts
 * @description Service for track-related operations, including search and caching.
 */

import api from "@/lib/api";
import { SpotifySearchResponse } from "@/lib/types";

// Simple in-memory cache
const searchCache = new Map<string, SpotifySearchResponse>();

/**
 * Searches for tracks on Spotify with caching.
 * @param query The search query.
 * @returns A promise with the search response.
 */
export const searchTracks = async (
  query: string
): Promise<SpotifySearchResponse> => {
  const cacheKey = `search:${query.toLowerCase().trim()}`;

  if (searchCache.has(cacheKey)) {
    console.log(`[Cache Hit] for query: ${query}`);
    return searchCache.get(cacheKey)!;
  }

  const response = await api.get<SpotifySearchResponse>("/tracks", {
    params: {
      q: query,
      include_external: "audio",
    },
  });

  searchCache.set(cacheKey, response.data);
  return response.data;
};
