/**
 * @file search-input.tsx
 * @description Compound search component that handles text input and displays autocomplete suggestions.
 */

import React from "react";
import { Track } from "@/lib/types";
import Image from "next/image";

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  suggestions: Track[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  onSearch: () => void;
  onSelectSuggestion: (track: Track) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  onSearch,
  onSelectSuggestion,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-lg relative">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full relative z-20">
        <input
          className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-lg flex-1 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
          type="text"
          placeholder="Buscar canción..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          autoComplete="off"
        />
        <button
          onClick={() => onSearch()}
          className="bg-black dark:bg-white text-white dark:text-black p-4 rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          Buscar
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 max-h-80 overflow-y-auto z-50 divide-y divide-zinc-100 dark:divide-zinc-800">
          {suggestions.map((track) => (
            <div
              key={track.id}
              onClick={() => onSelectSuggestion(track)}
              className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-4 transition-colors"
            >
              {track.album.images.length > 0 ? (
                <Image
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs">
                  N/A
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-base text-black dark:text-white truncate">
                  {track.name}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
