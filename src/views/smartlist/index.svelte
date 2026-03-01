<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import { errorHandler } from "~/logic/helper.js";
    import { createQuery } from "@tanstack/svelte-query";
    import QueryError from "~/components/QueryError.svelte";
    import ItemListShell from "~/components/ItemListShell.svelte";
    import Items from "~/views/smartlist/_items.svelte";

    let { params = {} } = $props();

    const query = createQuery(() => ({
        queryKey: ["playlist", params.id],
        queryFn: async () => {
            const response = await $API.playlist({ filter: params.id });

            if (response.error) {
                errorHandler("getting smartlist core", response.error);
                return [];
            }

            return response;
        },
        enabled: $User.isLoggedIn,
    }));

    let smartlist = $derived(query.data || {});

    let smartlistForItems = $derived(
        query.data?.id ? smartlist : { id: params.id },
    );

    $effect(() => {
        $PageTitle = smartlist?.name || $_("text.smartlist");
    });
</script>

<QueryError {query} />

{#if query.isSuccess && query.data.id}
    {#key query.data.id}
        <ItemListShell data={smartlist} type="smartlist">
            <Items playlist={smartlistForItems} />
        </ItemListShell>
    {/key}
{/if}
