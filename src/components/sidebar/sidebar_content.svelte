<script>
    import { _ } from "@rgglez/svelte-i18n";
    import SidebarLink from "~/components/sidebar/sidebar_link.svelte";
    import { userPreference } from "~/logic/preferences.js";

    const sharePreference = userPreference("share");
    let featuresReady = false;
</script>

<div class="container">
    <div class="items">
        <SidebarLink
            activePath="/"
            href="#/"
            icon="home"
            label={$_("text.home")}
        />
        <SidebarLink
            activePath="/advanced-search"
            href="#/advanced-search"
            icon="category_search"
            label={$_("text.advancedSearch")}
        />
    </div>

    <sl-divider></sl-divider>

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

    <sl-divider></sl-divider>

    <div class="items">
        <SidebarLink
            activePath="/playlists?(\/(.*?))?"
            href="#/playlists"
            icon="queue_music"
            label={$_("text.playlists")}
        />
        <SidebarLink
            activePath="/smartlists?(\/(.*?))?"
            href="#/smartlists"
            icon="electric_bolt"
            label={$_("text.smartlists")}
        />
    </div>

    {#if featuresReady}
        <sl-divider></sl-divider>

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
    {/if}

    {#if $sharePreference}
        <sl-divider></sl-divider>

        <div class="items">
            <SidebarLink
                href="#/shares"
                activePath="/shares"
                label={$_("text.shares")}
                icon="share"
            />
        </div>
    {/if}
</div>

<style>
    .container {
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        inset: 0;
        padding-block-start: 50px;
        padding-inline: var(--sidebar-padding-inline);
    }

    :global(.site-sidebar.is-mini) .container {
        padding-block-start: 115px;
    }

    sl-divider {
        --spacing: var(--spacing-sm);
        --color: var(--color-outline-variant);
    }

    .items {
        padding-block-end: var(--spacing-sm);
    }
</style>
