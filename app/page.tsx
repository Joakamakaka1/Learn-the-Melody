/**
 * @file page.tsx
 * @description Main application entry point for 'Learn the Melody'. Orchestrates the search and detail display logic.
 */

"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { fetchGenres } from "@/lib/services/genre-service";
import { SongGenres } from "@/lib/types";
import { useState } from "react";
import { useTrackSearch } from "@/hooks/use-track-search";
import { SearchInput } from "@/components/search-input";
import { TrackDetailCard } from "@/components/track-detail-card";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "spotify" | "youtube"
  >("spotify");
  const [genres, setGenres] = useState<SongGenres>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);

  // Custom hook for search logic
  const {
    query,
    setQuery,
    results,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSearch,
    selectTrack,
  } = useTrackSearch();

  // Helper for duration formatting
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handleFetchGenres = async (id: string) => {
    setLoadingGenres(true);
    try {
      const data = await fetchGenres(id);
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoadingGenres(false);
    }
  };

  const currentTrack = results?.[0];

  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-50 dark:bg-black transition-colors">
      <header className="w-full flex justify-end p-6 lg:px-16">
        <AnimatedThemeToggler />
      </header>

      <main className="flex-1 flex w-full flex-col lg:flex-row items-center justify-center gap-8 py-10 px-6 lg:px-16 overflow-y-auto">
        {/* Contenido izquierdo (Buscador) */}
        <div className="flex flex-col items-center justify-center gap-12 flex-1 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="font-mono text-4xl lg:text-6xl font-bold tracking-tighter text-black dark:text-zinc-50">
              Learn the Melody
            </h1>
            <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
              Descubre los detalles de tus canciones favoritas.
            </p>
          </div>

          <SearchInput
            query={query}
            setQuery={setQuery}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSearch={handleSearch}
            onSelectSuggestion={selectTrack}
          />

          <div className="flex gap-4 w-full max-w-lg justify-center">
            <button
              onClick={() => setSelectedPlatform("spotify")}
              className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 ${
                selectedPlatform === "spotify"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105 cursor-pointer"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              }`}
            >
              Spotify
            </button>
            <button
              disabled
              onClick={() => setSelectedPlatform("youtube")}
              className="flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
            >
              Youtube
            </button>
          </div>
        </div>

        {/* Contenido derecho (Resultados Detallados) */}
        <div className="flex-1 w-full max-w-2xl">
          {currentTrack ? (
            <TrackDetailCard
              track={currentTrack}
              genres={genres}
              loadingGenres={loadingGenres}
              onFetchGenres={handleFetchGenres}
              formatDuration={formatDuration}
            />
          ) : (
            <div className="h-100 lg:h-150 w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center gap-4 transition-all">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Sin resultados seleccionados
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                  Busca una canción y selecciónala para ver todos sus detalles
                  aquí.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
