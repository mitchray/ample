<script>
    import { _ } from "svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import { Saved } from "~/stores/settings.js";
    import { sortGenresByName } from "~/logic/genre";
    import Lister from "~/components/lister/lister.svelte";
    import { genresPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let title = $_("text.genres");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["genres"],
        initialData: async () => {
            await $Saved.getItem("genres");
        },
        queryFn: async () => {
            let result = await $API.genres();

            if (result.error) {
                errorHandler("getting genres", result.error);
                return [];
            }

            result = sortGenresByName(result);

            await $Saved.setItem("genres", result);

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: genres = $query.data || {};
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if genres?.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Lister
            id="Genres"
            data={genres}
            columns={genresPreset}
            type="genre"
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
