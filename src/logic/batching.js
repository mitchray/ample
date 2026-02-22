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

/**
 * Creates options for TanStack createInfiniteQuery with offset-based pagination.
 * All pages use INITIAL_PAGE_SIZE for the first page and BACKGROUND_PAGE_SIZE for the rest.
 *
 * @param {Object} options
 * @param {unknown[]} options.queryKey - Query key array for the infinite query
 * @param {(offset: number, limit: number) => Promise<{ items: unknown[], total_count: number }>} options.fetchPage - Fetches one page; must return { items, total_count }
 * @param {boolean} [options.enabled] - Whether the query is enabled
 * @param {boolean} [options.noMorePages] - If true, getNextPageParam always returns undefined (single-page load, e.g. playlist mix)
 * @returns {Object} Options to pass to createInfiniteQuery
 *
 * In components, derive items with: query.data?.pages.flatMap(p => p.items) ?? []
 * Auto fetch next page: $effect(() => { if (items && query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage(); })
 */
export function createOffsetInfiniteQueryOptions({
	queryKey,
	fetchPage,
	enabled,
	noMorePages = false,
}) {
	return {
		queryKey,
		initialPageParam: 0,
		getNextPageParam(lastPage, _allPages, lastPageParam) {
			if (noMorePages) return undefined;
			const total = lastPage?.total_count;
			const limitUsed =
				lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
			const next = lastPageParam + limitUsed;
			if (total != null) return next < total ? next : undefined;
			// fallback when total_count missing (e.g. shares)
			return lastPage?.items?.length >= limitUsed ? next : undefined;
		},
		queryFn: async ({ pageParam }) => {
			const limit =
				pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
			return await fetchPage(pageParam, limit);
		},
		...(enabled !== undefined && { enabled }),
	};
}
