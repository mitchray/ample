/**
 * Batching constants for progressive Ampache API loading.
 * Optimized for fast playback: first batch is minimal so Play Now / Add to Queue starts almost instantly.
 */

/** First batch size – fast initial display */
export const INITIAL_PAGE_SIZE = 20;

/** First batch size – fast initial playback */
export const INITIAL_PLAYBACK_SIZE = 5;

/** Subsequent batch size for background loading */
export const BACKGROUND_PAGE_SIZE = 150;
