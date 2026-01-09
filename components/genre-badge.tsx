/**
 * @file genre-badge.tsx
 * @description Presentational component for displaying a music genre with specific styling.
 */

import React from "react";

interface GenreBadgeProps {
  genre: string;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({ genre }) => {
  return (
    <span className="bg-zinc-100 dark:bg-zinc-700/50 border border-transparent dark:border-zinc-600 px-3 py-1 rounded-full text-xs font-medium text-black dark:text-zinc-200 capitalize">
      {genre}
    </span>
  );
};
