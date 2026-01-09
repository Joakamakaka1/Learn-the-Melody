/**
 * @file use-track-search.ts
 * @description Hook that encapsulates the search logic, including query debouncing, suggestions fetching, and track selection.
 */

import { useState, useEffect } from "react";
import { searchTracks } from "@/lib/services/track-service";
import { Track } from "@/lib/types";
import { useDebounce } from "./use-debounce";

/**
 * Hook to manage track search state, including suggestions and performance.
 */
export function useTrackSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[] | null>(null);
  const [suggestions, setSuggestions] = useState<Track[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Suggested search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        try {
          const data = await searchTracks(debouncedQuery);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  /**
   * Executes a manual search based on the current or provided query.
   * @param {string} [optionalQuery] - An optional query to use instead of the current state query.
   */
  const handleSearch = async (optionalQuery?: string) => {
    const searchQuery = optionalQuery || query;
    if (!searchQuery) return;

    setLoading(true);
    setShowSuggestions(false);
    try {
      const data = await searchTracks(searchQuery);
      setResults(data);
      if (!optionalQuery) setQuery(""); // Clear main input after direct search
    } catch (error) {
      console.error("Error searching tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Selects a track from the suggestions, sets it as the primary result, and clears the UI state.
   * @param {Track} track - The track object to select.
   */
  const selectTrack = (track: Track) => {
    setResults([track]);
    setQuery("");
    setShowSuggestions(false);
  };

  return {
    query,
    setQuery,
    results,
    setResults,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    loading,
    handleSearch,
    selectTrack,
  };
}
