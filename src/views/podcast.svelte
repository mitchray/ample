<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import Rating from "~/components/rating/rating.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Art from "~/components/art.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { podcastEpisodesPreset } from "~/components/lister/columns.js";

    let { params = {} } = $props();

    let episodes = $state([]);
    let tabulator = $state(null);

    async function processData() {
        if (!query.data?.id) return;

        episodes = [];
        episodes = await $API.podcastEpisodes({ filter: params.id, limit: 10 });

        console.debug(episodes, "episodes");
    }

    const query = createQuery(() => ({
        queryKey: ["podcast", params.id],
        queryFn: async () => {
            let result = await $API.podcast({
                filter: params.id,
                include: true,
            });

            if (result.error) {
                errorHandler("getting podcast", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));
    // alias of returned data
    let podcast = $derived(query.data || {});

    $effect(() => {
        $PageTitle = podcast?.name || $_("text.podcast");
    });

    // grab discs once we load the album
    $effect(() => {
        (query.data, processData());
    });
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if !query.data.id}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#key query.data.id}
            <h1>{podcast.name}</h1>
            <p>{@html podcast.description}</p>
            <Rating type="podcast" data={podcast} />
            <Art size="large" data={podcast} type="podcast" radius="8px" />
            <Actions
                type="podcast"
                displayMode="fullButtons"
                items={[podcast]}
                showShuffle={true}
            />

            <sl-button
                onclick={() => {
                    $API.updatePodcast({ filter: podcast.id });
                }}
            >
                Sync latest episodes
            </sl-button>

            {#if episodes.length > 0}
                <div class="lister-tabulator">
                    <Tabulator
                        bind:tabulator
                        data={episodes}
                        columns={podcastEpisodesPreset}
                        type="podcast_episodes"
                        options={{ persistenceID: "podcast" }}
                    ></Tabulator>
                </div>
            {/if}
        {/key}
    {/if}
{/if}
