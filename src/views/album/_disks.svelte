<script>
    import { _ } from "svelte-i18n";
    import { getAlbumDisks } from "~/logic/album.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { albumPreset } from "~/components/lister/columns.js";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";

    export let albumID;

    let tabulator = null;

    $: query = createQuery({
        queryKey: ["albumDisks", albumID],
        queryFn: async () => {
            let result = await getAlbumDisks(albumID);

            if (result.error) {
                errorHandler("getting album disks", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: disks = $query.data || {};
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if disks.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else if disks.length > 0}
        {#each disks as [disk, tracks]}
            <section>
                {#if disks.length > 1}
                    <h3 class="disk-title">Disc {disk}</h3>
                {/if}

                <div class="lister-tabulator">
                    <div class="lister-tabulator__actions">
                        {#if disks.length > 1}
                            <Actions
                                type="album"
                                id={albumID}
                                displayMode="fullButtons"
                                showShuffle={tracks.length > 1}
                                data={{ songs: tracks }}
                            />
                        {/if}
                        <MassRater bind:tabulator type="song" />
                    </div>

                    <Tabulator
                        bind:tabulator
                        data={tracks}
                        columns={albumPreset}
                        options={{
                            persistenceID: "album",
                        }}
                    ></Tabulator>
                </div>
            </section>
        {/each}
    {/if}
{/if}

<style>
    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }

    .disk-title {
        margin-block-end: var(--spacing-md);
    }
</style>
