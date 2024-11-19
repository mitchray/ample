<script>
    import { API, User } from "~/stores/state.js";
    import { _ } from "svelte-i18n";
    import ArtistCard from "~/components/cards/artistCard.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let { artistID } = $props();

    let query = $derived(
        createQuery({
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
        }),
    );

    // alias of returned data
    let artists = $derived($query.data?.artist || {});
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if artists.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="cardlist-grid artist-grid">
            {#each artists as artist}
                {#if artist.name}
                    <ArtistCard data={artist} />
                {/if}
            {/each}
        </div>
    {/if}
{/if}
