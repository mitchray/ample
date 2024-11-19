<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { liveStreamsPreset } from "~/components/lister/columns.js";

    let query = $derived(
        createQuery({
            queryKey: ["liveStreams"],
            queryFn: async () => {
                let result = await $API.liveStreams();

                if (result.error) {
                    errorHandler("getting artist", result.error);
                    return [];
                }

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let liveStreams = $derived($query.data || {});

    let title = $_("text.radio");
    $PageTitle = title;

    let tabulator = $state(null);
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
        <div class="lister-tabulator">
            <Tabulator
                bind:tabulator
                data={liveStreams}
                columns={liveStreamsPreset}
                options={{ persistenceID: "livestreams" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
