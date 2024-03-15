<script>
    import { _ } from "svelte-i18n";
    import { replace } from "svelte-spa-router";
    import { User, PageTitle } from "~/stores/state.js";
    import { Saved } from "~/stores/settings.js";
    import ArtistsAll from "~/components/artist/artistsAll.svelte";
    import ArtistsSidebar from "~/components/artist/artistsSidebar.svelte";
    import Newest from "./newest.svelte";
    import Random from "./random.svelte";
    import { createQuery } from "@tanstack/svelte-query";

    export let params = {};

    // default to the newest tab
    $: {
        if (!params.section) replace(`#/artists/newest`);
    }

    // List of tab items with labels and values.
    let tabs = [
        { id: "newest", label: $_("text.recentlyUpdated") },
        { id: "random", label: $_("text.random") },
        { id: "all", label: $_("text.all") },
    ];

    function changeTab(e) {
        replace(`#/artists/${e.detail.name}`);
    }

    let title = $_("text.artists");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["groupedArtists"],
        queryFn: async () => {
            return await $Saved.getItem("groupedArtists");
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: groupedArtists = $query.data || [];
</script>

<div class="artists-page-container">
    <div class="sidebar">
        <div class="sidebar-inner">
            {#if $query.isLoading}
                <p>{$_("text.loading")}</p>
            {:else if $query.isError}
                <p>Error: {$query.error.message}</p>
            {:else if $query.isSuccess}
                <ArtistsSidebar artists={groupedArtists} />
            {/if}
        </div>
    </div>

    <div class="main">
        <div class="main-inner">
            <div class="page-header">
                <h1 class="page-title">{title}</h1>
            </div>

            <sl-tab-group on:sl-tab-show={changeTab}>
                {#each tabs as tab}
                    <sl-tab
                        slot="nav"
                        panel={tab.id}
                        active={tab.id === params.section}
                    >
                        {tab.label}
                    </sl-tab>
                {/each}

                <sl-tab-panel name="newest">
                    <Newest />
                </sl-tab-panel>

                <sl-tab-panel name="random">
                    <Random />
                </sl-tab-panel>

                <sl-tab-panel name="all">
                    <ArtistsAll type="artist" />
                </sl-tab-panel>
            </sl-tab-group>
        </div>
    </div>
</div>

{@html `<style>
    /* override for this page only */
    .site-content-inner {
        padding: 0;
    }
</style>`}

<style>
    .artists-page-container {
        display: grid;
        grid-template-columns: 1fr;
        overflow: hidden;
        grid-column: full;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
    }

    .sidebar,
    .main {
        position: relative;
    }

    .sidebar-inner,
    .main-inner {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow: auto;
    }

    .sidebar {
        display: none;
        /*border-inline-end: 1px solid var(--color-outline-variant);*/
        background-color: var(--color-surface-container-lowest);
    }

    .sidebar-inner {
        padding: var(--spacing-md) 0;
    }

    .main-inner {
        padding: var(--spacing-xxl);
    }

    @container site-content-inner (min-width: 900px) {
        .artists-page-container {
            grid-template-columns: 200px 1fr !important;
        }

        .sidebar {
            display: block !important;
        }
    }
</style>
