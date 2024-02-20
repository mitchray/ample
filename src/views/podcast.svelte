<script>
    import { _ } from "svelte-i18n";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { podcastEpisodesPreset } from "~/components/lister/columns.js";
    import Rating from "~/components/rating.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Lister from "~/components/lister/lister.svelte";
    import Art from "~/components/art.svelte";

    export let params = {};

    let episodes = [];

    $: query = createQuery({
        queryKey: ["podcast", params.id],
        queryFn: async () => {
            let result = await $API.podcast({
                filter: params.id,
                include: true,
            });

            if (result.error) {
                console.error("Ample error getting podcast:", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: podcast = $query.data || {};

    // grab discs once we load the album
    $: $query.data, processData();

    async function processData() {
        if (!$query.data?.id) return;

        episodes = [];
        episodes = await $API.podcastEpisodes({ filter: params.id, limit: 10 });

        console.debug(episodes, "episodes");
    }
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if !$query.data.id}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#key $query.data.id}
            <h1>{podcast.name}</h1>
            <p>{@html podcast.description}</p>
            <Rating type="podcast" data={podcast} />
            <Art size="large" data={podcast} type="podcast" radius="8px" />
            <Actions
                type="podcast"
                displayMode="fullButtons"
                item={podcast}
                showShuffle={true}
            />

            <sl-button
                on:click={() => {
                    $API.updatePodcast({ filter: podcast.id });
                }}
            >
                Sync latest episodes
            </sl-button>

            {#if episodes.length > 0}
                <Lister
                    id="Podcast"
                    data={episodes}
                    columns={podcastEpisodesPreset}
                    type="song"
                    actionData={{
                        disable: true,
                    }}
                    options={{
                        showArt: false,
                    }}
                />
            {/if}
        {/key}
    {/if}
{/if}
