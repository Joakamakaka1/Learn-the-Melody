/**
 * @file track-detail-card.tsx
 * @description Main display component for a track's information, including metadata, genres, and actions.
 */

import React from "react";
import { Track, SongGenres } from "@/lib/types";
import { HyperText } from "@/components/ui/hyper-text";
import { GenreBadge } from "./genre-badge";

interface TrackDetailCardProps {
  track: Track;
  genres: SongGenres;
  loadingGenres: boolean;
  onFetchGenres: (id: string) => void;
  formatDuration: (ms: number) => string;
}

export const TrackDetailCard: React.FC<TrackDetailCardProps> = ({
  track,
  genres,
  loadingGenres,
  onFetchGenres,
  formatDuration,
}) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 flex flex-col gap-8 border border-zinc-100 dark:border-zinc-800 transition-all duration-300">
      <div className="flex flex-col gap-8">
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          {track.album.images.length > 0 && (
            <img
              src={track.album.images[0].url}
              alt={track.album.name}
              className="w-48 h-48 lg:w-64 lg:h-64 rounded-2xl shadow-xl object-cover"
            />
          )}

          <div className="flex flex-col gap-2 min-w-0">
            <h2 className="text-3xl lg:text-4xl font-mono font-bold text-black dark:text-white leading-tight">
              <HyperText key={track.id} animateOnHover={false} duration={1500}>
                {track.name}
              </HyperText>
            </h2>
            <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 font-medium">
              {track.artists.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && ", "}
                  <a
                    href={a.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    <HyperText
                      as="span"
                      animateOnHover={false}
                      duration={1500}
                      className="text-xl"
                    >
                      {a.name}
                    </HyperText>
                  </a>
                </span>
              ))}
            </p>
            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                {track.album.release_date.split("-")[0]}
              </span>
              {track.explicit && (
                <span className="border border-zinc-300 dark:border-zinc-600 px-2 py-0.5 rounded text-xs tracking-widest uppercase">
                  Explicit
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4 bg-white dark:bg-zinc-800 p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
            <span className="text-zinc-500 dark:text-zinc-400">Album</span>
            <a
              href={track.album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-black dark:text-white hover:underline truncate max-w-50 text-right"
            >
              <HyperText
                key={track.id}
                as="span"
                animateOnHover={false}
                duration={1500}
                className="text-lg"
              >
                {track.album.name}
              </HyperText>
            </a>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
            <span className="text-zinc-500 dark:text-zinc-400">Duración</span>
            <span className="font-medium text-black dark:text-white font-mono">
              {formatDuration(track.duration_ms)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 dark:text-zinc-400">
              Popularidad
            </span>
            <div className="items-center gap-3 hidden sm:flex">
              <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${track.popularity}%` }}
                />
              </div>
              <span className="text-sm font-medium text-black dark:text-white">
                {track.popularity}%
              </span>
            </div>
          </div>
          {genres.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 dark:text-zinc-400">Géneros</span>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <GenreBadge key={genre} genre={genre} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex gap-4">
        <button
          onClick={() => onFetchGenres(track.id)}
          disabled={loadingGenres}
          className="flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loadingGenres ? "Cargando..." : "Obtener Géneros"}
        </button>
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-transform shadow-lg"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.223.367-.71.485-1.077.262-2.723-1.664-6.148-2.043-10.19-.115-.42.096-.922-.114-1.018-.535-.096-.421.114-.922.535-1.018 4.48-2.14 8.285-1.705 11.411.205.367.222.484.71.262 1.077zm1.474-3.258c-.28.455-.87.601-1.325.322-3.116-1.914-7.864-2.47-11.55-.25-.515.293-1.18.118-1.472-.396-.293-.515-.118-1.18.396-1.472 4.197-2.52 9.444-1.9 13.028.3 1.325.28 1.474.87 1.325.322zM19.112 11.01c-3.738-2.221-9.897-2.427-13.46-.226-.575.347-1.325.161-1.67-.412-.347-.575-.16-1.325.412-1.67 4.11-2.43 10.912-2.188 15.228.375.518.307.69 1.002.383 1.52-.308.517-1.002.69-1.52.383h.007z" />
          </svg>{" "}
          Abrir en Spotify
        </a>
      </div>
    </div>
  );
};
