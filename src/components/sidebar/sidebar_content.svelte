<script>
    import { _ } from "svelte-i18n";
    import SidebarHeading from "~/components/sidebar/sidebar_heading.svelte";
    import SidebarLink from "~/components/sidebar/sidebar_link.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { Saved } from "~/stores/settings.js";
    import { onMount } from "svelte";

    let savedStatuses = {};

    function handleOpen(event) {
        // filter out any sl-show events from sl-tooltip/other children
        if (event.target === event.currentTarget) {
            let id = event.target.dataset.id;
            savedStatuses[id] = true;
            $Saved.setItem(`SidebarStatuses`, savedStatuses);
        }
    }

    function handleClose(event) {
        // filter out any sl-hide events from sl-tooltip/other children
        if (event.target === event.currentTarget) {
            let id = event.target.dataset.id;
            savedStatuses[id] = false;
            $Saved.setItem(`SidebarStatuses`, savedStatuses);
        }
    }

    onMount(async () => {
        savedStatuses = (await $Saved.getItem(`SidebarStatuses`)) || {};
    });
</script>

<div class="items">
    <SidebarLink href="#/" activePath="/" label={$_("text.home")} icon="home" />
    <SidebarLink
        href="#/search"
        activePath="/search"
        label={$_("text.advancedSearch")}
        icon="search"
    />
</div>

<sl-divider></sl-divider>

<sl-details
    data-id="library"
    open={savedStatuses["library"]}
    on:sl-show={handleOpen}
    on:sl-hide={handleClose}
>
    <div class="title-wrapper" slot="summary">
        <SidebarHeading label={$_("text.library")} icon="library_music" />
    </div>
    <MaterialSymbol name="expand_more" slot="expand-icon" />
    <MaterialSymbol name="expand_less" slot="collapse-icon" />

    <div class="items">
        <SidebarLink
            href="#/artists"
            activePath="/artists?(\/(.*?))?"
            label={$_("text.artists")}
            icon="person_outline"
        />
        <SidebarLink
            href="#/album-artists"
            activePath="/album-artists(\/(.*?))?"
            label={$_("text.albumArtists")}
            icon="artist"
        />
        <SidebarLink
            href="#/albums"
            activePath="/albums?(\/(.*?))?"
            label={$_("text.albums")}
            icon="album"
        />
        <SidebarLink
            href="#/genres"
            activePath="/genres"
            label={$_("text.genres")}
            icon="label"
        />
    </div>
</sl-details>

<sl-divider></sl-divider>

<sl-details
    data-id="playlists"
    open={savedStatuses["playlists"]}
    on:sl-show={handleOpen}
    on:sl-hide={handleClose}
>
    <div class="title-wrapper" slot="summary">
        <SidebarHeading icon="library_books" label="Playlists" />
    </div>
    <MaterialSymbol name="expand_more" slot="expand-icon" />
    <MaterialSymbol name="expand_less" slot="collapse-icon" />

    <div class="items">
        <SidebarLink
            href="#/playlists"
            activePath="/playlists"
            label={$_("text.playlists")}
            icon="queue_music"
        />
        <SidebarLink
            href="#/smartlists"
            activePath="/smartlists"
            label={$_("text.smartlists")}
            icon="electric_bolt"
        />
    </div>
</sl-details>

<sl-divider></sl-divider>

<sl-details
    data-id="dashboards"
    open={savedStatuses["dashboards"]}
    on:sl-show={handleOpen}
    on:sl-hide={handleClose}
>
    <div class="title-wrapper" slot="summary">
        <SidebarHeading icon="dashboard" label={$_("text.dashboards")} />
    </div>
    <MaterialSymbol name="expand_more" slot="expand-icon" />
    <MaterialSymbol name="expand_less" slot="collapse-icon" />

    <div class="items">
        <SidebarLink
            href="#/podcasts"
            activePath="/podcasts"
            label={$_("text.podcasts")}
            icon="podcasts"
        />
        <SidebarLink
            href="#/radio"
            activePath="/radio"
            label={$_("text.radio")}
            icon="radio"
        />
    </div>
</sl-details>

<style>
    sl-details::part(base) {
        background-color: transparent;
        border: 0;
        border-radius: 0;
    }

    sl-details::part(header) {
        padding-block: var(--spacing-sm);
        padding-inline-start: 0;
        padding-inline-end: var(--spacing-md);
        justify-content: space-around;
    }

    sl-details::part(summary-icon) {
        rotate: none; /* Disable the expand/collapse animation */
    }

    sl-details::part(summary) {
        overflow: hidden;
        min-width: 2rem;
    }

    sl-details::part(summary),
    sl-details::part(summary-icon) {
        color: var(--color-secondary);
    }

    sl-details::part(content) {
        padding-block: 0;
        padding-inline: 0;
    }

    .title-wrapper {
        overflow: hidden;
    }

    sl-divider {
        --spacing: var(--spacing-sm);
        --color: var(--color-outline-variant);
    }

    .items {
        padding-block-end: var(--spacing-sm);
    }
</style>
