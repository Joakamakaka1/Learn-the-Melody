import axios, { AxiosError } from "axios";
import api, { handleApiError } from "@/lib/api";
import { SpotifySearchResponse } from "@/lib/types";

/**
 * Busca contenido en Spotify utilizando el proxy endpoint.
 * El endpoint busca tracks, artistas, álbumes, etc.
 *
 * @param query Nombre del track, artista, álbum, etc. a buscar
 * @returns Promesa con la respuesta de búsqueda de Spotify
 */
export const searchTracks = async (
  query: string
): Promise<SpotifySearchResponse> => {
  try {
    const response = await api.get<SpotifySearchResponse>("/tracks", {
      params: {
        q: query,
        include_external: "audio",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[API] Axios Error details:", {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request,
      });
    }
    handleApiError(error as AxiosError);
    throw error;
  }
};
