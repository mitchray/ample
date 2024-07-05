<script>
    import { _ } from "svelte-i18n";
    import Portal from "~/components/portal.svelte";
    import { API, PageTitle, User } from "~/stores/state.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { playlistsPreset } from "~/components/lister/columns.js";

    let drawerEdit;
    let tabulator = null;

    let title = $_("text.playlists");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["playlists"],
        queryFn: async () => {
            let result = await $API.playlists({ hide_search: 1 });

            if (result.error) {
                errorHandler("getting playlists", result.error);
                return [];
            }

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
        {#key $query.dataUpdatedAt || 0}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <MassRater bind:tabulator type="playlist" />
                </div>

                <Tabulator
                    bind:tabulator
                    bind:data={playlists}
                    columns={playlistsPreset}
                    options={{ id: "playlists", persistenceID: "playlists" }}
                ></Tabulator>
            </div>
        {/key}
    {/if}
{/if}

<style>
    .new-playlist-button {
        margin-block-end: var(--spacing-xxl);
        justify-self: start;
    }
</style>
