<script>
    import { _ } from "svelte-i18n";
    import { User, PageTitle } from "~/stores/state.js";
    import { Saved } from "~/stores/settings.js";
    import ArtistsAll from "~/components/artist/artistsAll.svelte";
    import ArtistsSidebar from "~/components/artist/artistsSidebar.svelte";
    import { replace } from "svelte-spa-router";
    import Random from "~/views/album-artists/random.svelte";
    import { createQuery } from "@tanstack/svelte-query";

    export let params = {};

    // default to random tab
    $: {
        if (!params.section) replace(`#/album-artists/random`);
    }

    // List of tab items with labels and values.
    let tabs = [
        { id: "random", label: $_("text.random") },
        { id: "all", label: $_("text.all") },
    ];

    function changeTab(e) {
        replace(`#/album-artists/${e.detail.name}`);
    }

    let title = $_("text.albumArtists");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["groupedAlbumArtists"],
        queryFn: async () => {
            return await $Saved.getItem("groupedAlbumArtists");
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: groupedAlbumArtists = $query.data || [];
</script>

<div class="artists-page-container">
    <div class="sidebar">
        <div class="sidebar-inner">
            {#if $query.isLoading}
                <p>{$_("text.loading")}</p>
            {:else if $query.isError}
                <p>Error: {$query.error.message}</p>
            {:else if $query.isSuccess}
                <ArtistsSidebar artists={groupedAlbumArtists} />
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

                <sl-tab-panel name="random">
                    <Random />
                </sl-tab-panel>

                <sl-tab-panel name="all">
                    <ArtistsAll type="album_artist" />
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
        border-inline-end: 1px solid var(--color-outline-variant);
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
