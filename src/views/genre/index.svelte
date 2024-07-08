<script>
    import { _ } from "svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import GenreByType from "~/components/genre/genreByType.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { createQuery } from "@tanstack/svelte-query";
    import Visibility from "~/components/visibility.svelte";

    export let params = {};

    // default to artists tab
    $: {
        if (!params.section) replace(`#/genre/${params.id}/artists`);
    }

    function changeTab(e) {
        replace(`#/genre/${params.id}/${e.detail.name}`);
    }

    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];

    $: query = createQuery({
        queryKey: ["genre", params.id],
        queryFn: async () => {
            let result = await $API.genre({ filter: params.id });

            if (result.error) {
                errorHandler("getting genre", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: genre = $query.data || {};

    $: $PageTitle = genre?.name || $_("text.genre");
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if !$query.data.id}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#key $query.data.id}
            <div class="page-header">
                <h1 class="page-title">
                    <MaterialSymbol name="label" />
                    {genre.name}
                </h1>
            </div>

            <sl-tab-group on:sl-tab-show={changeTab}>
                {#each tabs as tab}
                    <sl-tab
                        slot="nav"
                        panel={tab.id}
                        active={tab.id === params.section}
                    >
                        {tab.label}
                    </sl-tab>
                {/each}

                <sl-tab-panel name="artists">
                    <Visibility>
                        <GenreByType id={genre.id} type="artist" />
                    </Visibility>
                </sl-tab-panel>

                <sl-tab-panel name="albums">
                    <Visibility>
                        <GenreByType id={genre.id} type="album" />
                    </Visibility>
                </sl-tab-panel>

                <sl-tab-panel name="songs">
                    <Visibility>
                        <GenreByType id={genre.id} type="song" />
                    </Visibility>
                </sl-tab-panel>
            </sl-tab-group>
        {/key}
    {/if}
{/if}
