<script>
    import { _ } from "svelte-i18n";
    import { getAlbumDisks } from "~/logic/album.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Disk from "~/views/album/_disk.svelte";

    let { albumID } = $props();

    let query = $derived(
        createQuery({
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
        }),
    );

    // alias of returned data
    let disks = $derived($query.data || {});
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
                <Disk {disks} {disk} {tracks} {albumID} />
            </section>
        {/each}
    {/if}
{/if}

<style>
    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }
</style>
