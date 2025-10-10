<script>
    import { _ } from "@rgglez/svelte-i18n";
    import SidebarHeading from "~/components/sidebar/sidebar_heading.svelte";
    import SidebarLink from "~/components/sidebar/sidebar_link.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { Settings } from "~/stores/settings.js";
    import { onMount } from "svelte";
    import { userPreference } from "~/logic/preferences.js";

    const sharePreference = userPreference("share");
    let savedStatuses = $state({});
    let featuresReady = false;

    function handleOpen(event) {
        // filter out any sl-show events from sl-tooltip/other children
        if (event.target === event.currentTarget) {
            let id = event.target.dataset.id;
            savedStatuses[id] = true;
            Settings.update((x) => ({
                ...x,
                SidebarStatuses: savedStatuses,
            }));
        }
    }

    function handleClose(event) {
        // filter out any sl-hide events from sl-tooltip/other children
        if (event.target === event.currentTarget) {
            let id = event.target.dataset.id;
            savedStatuses[id] = false;
            Settings.update((x) => ({
                ...x,
                SidebarStatuses: savedStatuses,
            }));
        }
    }

    onMount(async () => {
        savedStatuses = $Settings.SidebarStatuses || {};
    });
</script>

<div class="items">
    <SidebarLink activePath="/" href="#/" icon="home" label={$_("text.home")} />
    <SidebarLink
        activePath="/advanced-search"
        href="#/advanced-search"
        icon="category_search"
        label={$_("text.advancedSearch")}
    />
</div>

<sl-divider></sl-divider>

<sl-details
    data-id="library"
    onsl-hide={handleClose}
    onsl-show={handleOpen}
    open={savedStatuses["library"]}
>
    <div class="title-wrapper" slot="summary">
        <SidebarHeading icon="library_music" label={$_("text.library")} />
    </div>
    <MaterialSymbol name="expand_more" slot="expand-icon" />
    <MaterialSymbol name="expand_less" slot="collapse-icon" />

    <div class="items">
        <SidebarLink
            activePath="/artists?(\/(.*?))?"
            href="#/artists"
            icon="person_outline"
            label={$_("text.artists")}
        />
        <SidebarLink
            activePath="/album-artists(\/(.*?))?"
            href="#/album-artists"
            icon="artist"
            label={$_("text.albumArtists")}
        />
        <SidebarLink
            activePath="/albums?(\/(.*?))?"
            href="#/albums"
            icon="album"
            label={$_("text.albums")}
        />
        <SidebarLink
            activePath="/genres"
            href="#/genres"
            icon="label"
            label={$_("text.genres")}
        />
    </div>
</sl-details>

<sl-divider></sl-divider>

<sl-details
    data-id="playlists"
    onsl-hide={handleClose}
    onsl-show={handleOpen}
    open={savedStatuses["playlists"]}
>
    <div class="title-wrapper" slot="summary">
        <SidebarHeading icon="library_books" label={$_("text.playlists")} />
    </div>
    <MaterialSymbol name="expand_more" slot="expand-icon" />
    <MaterialSymbol name="expand_less" slot="collapse-icon" />

    <div class="items">
        <SidebarLink
            activePath="/playlists"
            href="#/playlists"
            icon="queue_music"
            label={$_("text.playlists")}
        />
        <SidebarLink
            activePath="/smartlists"
            href="#/smartlists"
            icon="electric_bolt"
            label={$_("text.smartlists")}
        />
    </div>
</sl-details>

{#if featuresReady}
    <sl-divider></sl-divider>

    <sl-details
        data-id="dashboards"
        open={savedStatuses["dashboards"]}
        onsl-show={handleOpen}
        onsl-hide={handleClose}
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
{/if}

{#if $sharePreference}
    <sl-divider></sl-divider>

    <sl-details
        data-id="system"
        open={savedStatuses["system"]}
        onsl-show={handleOpen}
        onsl-hide={handleClose}
    >
        <div class="title-wrapper" slot="summary">
            <SidebarHeading icon="settings" label={$_("text.system")} />
        </div>
        <MaterialSymbol name="expand_more" slot="expand-icon" />
        <MaterialSymbol name="expand_less" slot="collapse-icon" />

        <div class="items">
            <SidebarLink
                href="#/shares"
                activePath="/shares"
                label={$_("text.shares")}
                icon="share"
            />
        </div>
    </sl-details>
{/if}

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
