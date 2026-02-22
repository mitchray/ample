<script>
    import { API, User } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import ArtistCard from "~/components/cards/artistCard.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";

    let { artistID } = $props();

    const query = createQuery(() => ({
        queryKey: ["similarArtists", artistID],
        queryFn: async () => {
            let result = $API.getSimilar({
                type: "artist",
                filter: artistID,
                limit: 15,
            });

            if (result.error) {
                errorHandler("getting similar artists", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let artists = $derived(query.data?.artist || {});
</script>

<QueryError {query} />

{#if query.isSuccess && artists.length > 0}
    <div class="cardlist-grid artist-grid">
        {#each artists as artist}
            {#if artist.name}
                <ArtistCard data={artist} />
            {/if}
        {/each}
    </div>
{/if}
