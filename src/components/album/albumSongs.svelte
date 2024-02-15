<script>
    import { fade } from "svelte/transition";
    import { createQuery } from "@tanstack/svelte-query";
    import Lister from "~/components/lister/lister.svelte";
    import { User } from "~/stores/state.js";
    import { getAlbumDisks } from "~/logic/album.js";

    export let id;

    $: query = createQuery({
        queryKey: ["albumSongs", id],
        queryFn: async () => {
            return await getAlbumDisks(id);
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: disks = $query.data || {};
</script>

{#if $query.isLoading}
    <sl-spinner style="font-size: 2rem;"></sl-spinner>
    <div class="temp"></div>
{:else if $query.isSuccess}
    {#each disks as [disk, songs]}
        {#if disks.length > 1}
            <h3>Disc {disk}</h3>
        {/if}

        <section in:fade>
            <Lister
                data={songs}
                type="song"
                zone="album-contents"
                actionData={{
                    disable: disks.length < 2,
                    type: "album",
                    id: disk,
                    displayMode: "miniButtons",
                    showShuffle: songs.length > 1,
                    data: Object.create({ songs: songs }),
                }}
                options={{
                    showArt: false,
                }}
            />
        </section>
    {/each}
{/if}

<style>
    .temp {
        height: 500px;
    }

    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }
</style>
