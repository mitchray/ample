<script>
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { API, PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import GenreByType from "~/components/genre/genreByType.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let params = {};

    let genre;

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

    onMount(async () => {
        genre = await $API.genre({ filter: params.id });

        if (genre.error) {
            console.error("Ample error getting genre:", genre.error);
        }
    });

    $: $PageTitle = genre?.name || $_("text.genre");
</script>

{#if genre?.id}
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
            <GenreByType id={genre.id} type="artist" />
        </sl-tab-panel>

        <sl-tab-panel name="albums">
            <GenreByType id={genre.id} type="album" />
        </sl-tab-panel>

        <sl-tab-panel name="songs">
            <GenreByType id={genre.id} type="song" />
        </sl-tab-panel>
    </sl-tab-group>
{:else}
    <p>{$_("text.loading")}</p>
{/if}
