<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User, PageTitle } from "~/stores/state.js";
    import { _ } from "svelte-i18n";
    import { podcastsPreset } from "~/components/lister/columns.js";
    import Lister from "~/components/lister/lister.svelte";
    import { Saved } from "~/stores/settings.js";

    $: query = createQuery({
        queryKey: ["podcasts"],
        initialData: async () => {
            await $Saved.getItem("podcasts");
        },
        queryFn: async () => {
            let result = await $API.podcasts();

            if (result.error) {
                console.error("Ample error getting podcasts:", result.error);
                return [];
            }

            await $Saved.setItem("podcasts", result);

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: podcasts = $query.data || {};

    let title = $_("text.podcasts");
    $PageTitle = title;
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if podcasts.length < 1}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Lister
            id="Podcasts"
            data={podcasts}
            columns={podcastsPreset}
            type="podcasts"
            virtualList={true}
            actionData={{
                disable: true,
            }}
        />
    {/if}
{/if}
