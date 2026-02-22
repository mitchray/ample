<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    let section = $derived(params.section || "artists");

    const sectionComponents = {
        artists: () => import("~/views/genre/artists.svelte"),
        albums: () => import("~/views/genre/albums.svelte"),
        songs: () => import("~/views/genre/songs.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.artists(),
    );

    // default to artists tab
    $effect(() => {
        if (!params.section) replace(`#/genre/${params.id}/artists`);
    });

    function changeTab(e) {
        replace(`#/genre/${params.id}/${e.detail.name}`);
    }

    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];

    const query = createQuery(() => ({
        queryKey: ["genre", params.id],
        queryFn: async () => {
            let result = await $API.genre({ filter: params.id });

            if (result.error) {
                errorHandler("getting genre", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let genre = $derived(query.data || {});

    $effect(() => {
        $PageTitle = genre?.name || $_("text.genre");
    });
</script>

<QueryError {query} />

{#if query.isSuccess && query.data.id}
    {#key query.data.id}
        <div class="page-header">
            <h1 class="page-title">
                <MaterialSymbol name="label" />
                {genre.name}
            </h1>
        </div>

        <sl-tab-group onsl-tab-show={changeTab}>
            {#each tabs as tab}
                <sl-tab
                    slot="nav"
                    panel={tab.id}
                    active={tab.id === section}
                >
                    {tab.label}
                </sl-tab>
            {/each}

            <div class="tab-content">
                {#await childComponent() then module}
                    {@const Child = module.default}
                    <Visibility>
                        <Child id={genre.id} />
                    </Visibility>
                {/await}
            </div>
        </sl-tab-group>
    {/key}
{/if}
