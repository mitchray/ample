<script>
    import { _ } from "svelte-i18n";
    import Portal from "~/components/portal.svelte";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { Saved } from "~/stores/settings.js";
    import Lister from "~/components/lister/lister.svelte";
    import { playlistsPreset } from "~/components/lister/columns.js";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let drawerEdit;

    let title = $_("text.playlists");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["playlists"],
        initialData: async () => {
            await $Saved.getItem("playlists");
        },
        queryFn: async () => {
            let result = await $API.playlists({ hide_search: 1 });

            if (result.error) {
                errorHandler("getting playlists", result.error);
                return [];
            }

            await $Saved.setItem("playlists", result);

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: playlists = $query.data || {};
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<sl-button
    class="new-playlist-button"
    on:click={() => drawerEdit.show()}
    variant="primary"
>
    {$_("text.playlistNew")}
</sl-button>

<Portal>
    <DrawerEdit bind:this={drawerEdit} isNew={true} />
</Portal>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if playlists?.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Lister
            id="Playlists"
            bind:data={playlists}
            type="playlist"
            columns={playlistsPreset}
            virtualList={true}
            actionData={{
                disable: true,
            }}
        />
    {/if}
{/if}

<style>
    .new-playlist-button {
        margin-block-end: var(--spacing-xxl);
        justify-self: start;
    }
</style>
