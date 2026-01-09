/**
 * @file genre-service.ts
 * @description Service for fetching track genres with an in-memory caching layer.
 */

import api from "@/lib/api";
import { SongGenres } from "@/lib/types";

// Simple in-memory cache
const genreCache = new Map<string, SongGenres>();

/**
 * Fetches genres for a specific track ID with caching.
 * @param id The Spotify track ID.
 * @returns A promise with the genres.
 */
export const fetchGenres = async (id: string): Promise<SongGenres> => {
  const cacheKey = `genres:${id}`;

  if (genreCache.has(cacheKey)) {
    console.log(`[Cache Hit] for genres of track: ${id}`);
    return genreCache.get(cacheKey)!;
  }

  const response = await api.get<SongGenres>(
    `ee27c448-0cd6-469a-9a89-1d27dcd4ef87/track_id/${id}`
  );

  genreCache.set(cacheKey, response.data);
  return response.data;
};
