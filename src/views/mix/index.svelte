<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import { errorHandler } from "~/logic/helper.js";
    import { createQuery } from "@tanstack/svelte-query";
    import QueryError from "~/components/QueryError.svelte";
    import ItemListShell from "~/components/ItemListShell.svelte";
    import Items from "~/views/mix/_items.svelte";

    let { params = {} } = $props();

    const query = createQuery(() => ({
        queryKey: ["playlist", params.id],
        queryFn: async () => {
            const response = await $API.artist({ filter: params.id });

            if (response.error) {
                errorHandler("getting mix core", response.error);
                return [];
            }

            return response;
        },
        enabled: $User.isLoggedIn,
    }));

    let mix = $derived(query.data || {});

    let mixForItems = $derived(
        query.data?.id ? mix : { id: params.id },
    );

    $effect(() => {
        $PageTitle = mix?.name || $_("text.mix");
    });
</script>

<QueryError {query} />

{#if query.isSuccess && query.data.id}
    {#key query.data.id}
        <ItemListShell data={mix} type="mix" showMeta={false} showRating={false}>
            <Items playlist={mixForItems} />
        </ItemListShell>
    {/key}
{/if}
