"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { HyperText } from "@/components/ui/hyper-text";
import { searchTracks } from "@/hooks/fetchTracks";
import { SpotifySearchResponse, Track } from "@/lib/types";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "spotify" | "youtube"
  >("spotify");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifySearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Track[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const data = await searchTracks(query);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Format milliseconds to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handleSearch = async () => {
    if (!query) return;
    setShowSuggestions(false);
    try {
      const data = await searchTracks(query);
      setResults(data);
      setQuery(""); // Clear input after search
    } catch (error) {
      console.error("Error searching tracks:", error);
    }
  };

  const handleSelectSuggestion = (track: Track) => {
    setResults([track]);
    setQuery(""); // Clear input after selection
    setShowSuggestions(false);
  };

  const currentTrack = results?.[0]; // Get the first result to display details

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

          <div className="flex flex-col gap-4 w-full max-w-lg relative">
            <div className="flex gap-4 w-full relative z-20">
              <input
                className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-lg flex-1 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                type="text"
                name="query"
                placeholder="Buscar canción..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                autoComplete="off"
              />
              <button
                onClick={handleSearch}
                className="bg-black dark:bg-white text-white dark:text-black p-4 rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                Buscar
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 max-h-80 overflow-y-auto z-50 divide-y divide-zinc-100 dark:divide-zinc-800">
                {suggestions.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleSelectSuggestion(track)}
                    className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-4 transition-colors"
                  >
                    {track.album.images.length > 0 ? (
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
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

          <div className="flex gap-4 w-full max-w-lg justify-center">
            <button
              onClick={() => setSelectedPlatform("spotify")}
              className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 ${
                selectedPlatform === "spotify"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105 cursor-pointer"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
              }`}
            >
              Spotify
            </button>
            <button
              onClick={() => setSelectedPlatform("youtube")}
              className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 ${
                selectedPlatform === "youtube"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105 cursor-pointer"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
              }`}
            >
              Youtube
            </button>
          </div>
        </div>

        {/* Contenido derecho (Resultados Detallados) */}
        <div className="flex-1 w-full max-w-2xl lg:h-160">
          {currentTrack ? (
            <div className="h-full w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 relative overflow-hidden border border-zinc-100 dark:border-zinc-800">
              {/* Background Blur Effect Removed */}

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                {currentTrack.album.images.length > 0 && (
                  <img
                    src={currentTrack.album.images[0].url}
                    alt={currentTrack.album.name}
                    className="w-48 h-48 lg:w-64 lg:h-64 rounded-2xl shadow-xl object-cover"
                  />
                )}

                <div className="flex flex-col gap-2 min-w-0">
                  <h2 className="text-3xl lg:text-4xl font-mono font-bold text-black dark:text-white leading-tight">
                    <HyperText
                      key={currentTrack.id}
                      animateOnHover={false}
                      duration={1500}
                    >
                      {currentTrack.name}
                    </HyperText>
                  </h2>
                  <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 font-medium">
                    {currentTrack.artists.map((a, i) => (
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
                      {currentTrack.album.release_date.split("-")[0]}
                    </span>
                    {currentTrack.explicit && (
                      <span className="border border-zinc-300 dark:border-zinc-600 px-2 py-0.5 rounded text-xs tracking-widest uppercase">
                        Explicit
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-4 mt-4 bg-white dark:bg-zinc-800 p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 shadow-xl">
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Album
                  </span>
                  <a
                    href={currentTrack.album.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-black dark:text-white hover:underline truncate max-w-50 text-right"
                  >
                    <HyperText
                      key={currentTrack.id}
                      as="span"
                      animateOnHover={false}
                      duration={1500}
                      className="text-lg"
                    >
                      {currentTrack.album.name}
                    </HyperText>
                  </a>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Duración
                  </span>
                  <span className="font-medium text-black dark:text-white font-mono">
                    {formatDuration(currentTrack.duration_ms)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Popularidad
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${currentTrack.popularity}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white">
                      {currentTrack.popularity}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-4 flex gap-3">
                <a
                  href={currentTrack.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
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
