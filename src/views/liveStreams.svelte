<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "svelte-i18n";
    import { liveStreamsPreset } from "~/components/lister/columns.js";
    import Lister from "~/components/lister/lister.svelte";

    $: query = createQuery({
        queryKey: ["liveStreams"],
        queryFn: async () => {
            let result = await $API.liveStreams();

            if (result.error) {
                console.error("Ample error getting artist:", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: liveStreams = $query.data || {};

    let title = $_("text.radio");
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
    {#if liveStreams.length < 1}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Lister
            id="LiveStreams"
            data={liveStreams}
            columns={liveStreamsPreset}
            type="live_stream"
            virtualList={true}
            actionData={{
                disable: true,
            }}
            options={{
                showArt: false,
            }}
        />
    {/if}
{/if}
