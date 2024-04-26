<script>
    import { _ } from "svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import Lister from "~/components/lister/lister.svelte";
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { Saved } from "~/stores/settings.js";
    import { errorHandler } from "~/logic/helper.js";

    let title = $_("text.smartlists");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["smartlists"],
        initialData: async () => {
            await $Saved.getItem("smartlists");
        },
        queryFn: async () => {
            let result = await $API.smartlists();

            if (result.error) {
                errorHandler("getting smartlists", result.error);
                return [];
            }

            await $Saved.setItem("smartlists", result);

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: smartlists = $query.data || {};
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if smartlists.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Lister
            id="Smartlists"
            data={smartlists}
            columns={smartlistsPreset}
            type="smartlist"
            virtualList={true}
            actionData={{
                disable: true,
            }}
        />
    {/if}
{/if}
