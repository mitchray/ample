<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import { createQuery } from "@tanstack/svelte-query";
    import { push } from "svelte-spa-router";
    import { addAlert } from "~/logic/alert.js";
    import { errorHandler } from "~/logic/helper.js";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import DrawerDelete from "~/components/action/drawers/drawerPlaylistDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import QueryError from "~/components/QueryError.svelte";
    import ItemListShell from "~/components/ItemListShell.svelte";
    import Items from "~/views/playlist/_items.svelte";

    let { params = {} } = $props();

    let drawerEdit = $state(),
        drawerDelete = $state();

    const query = createQuery(() => ({
        queryKey: ["playlist", params.id],
        queryFn: async () => {
            const response = await $API.playlist({ filter: params.id });

            if (response.error) {
                addAlert({
                    title: $_("text.noItemsFound"),
                    style: "info",
                });
                await push(`/playlists/`);

                errorHandler("getting playlist core", response.error);
            }

            return response;
        },
        enabled: $User.isLoggedIn,
    }));

    let playlist = $derived(query.data || {});

    let playlistForItems = $derived(
        query.data?.id ? playlist : { id: params.id },
    );

    $effect(() => {
        $PageTitle = playlist?.name || $_("text.playlist");
    });
</script>

<QueryError {query} />

{#if query.isSuccess && query.data.id}
    {#key query.data.id}
        <ItemListShell data={playlist} type="playlist">
            {#snippet actions()}
                {#if playlist.has_access}
                    <sl-button
                        variant="primary"
                        onclick={() => drawerEdit.show()}
                        title={$_("text.edit")}
                    >
                        <MaterialSymbol name="edit" slot="prefix" />
                        {$_("text.edit")}
                    </sl-button>

                    <sl-button
                        variant="neutral"
                        onclick={() => drawerDelete.show()}
                        title={$_("text.delete")}
                    >
                        <MaterialSymbol name="delete" slot="prefix" />
                        {$_("text.delete")}
                    </sl-button>
                {/if}
            {/snippet}

            <Items playlist={playlistForItems} />
        </ItemListShell>
    {/key}
{/if}

{#if query.isSuccess && query.data.id}
    <Portal>
        <DrawerEdit bind:this={drawerEdit} {playlist} />
    </Portal>

    <Portal>
        <DrawerDelete bind:this={drawerDelete} {playlist} />
    </Portal>
{/if}
