<script>
    import { _ } from "svelte-i18n";
    import { createQuery } from "@tanstack/svelte-query";
    import { cloneDeep, groupBy, partition, sortBy } from "lodash-es";
    import { API, User } from "~/stores/state";
    import { Settings } from "~/stores/settings.js";
    import { formatReleaseType } from "~/logic/formatters.js";
    import { userPreference } from "~/logic/preferences.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import RenderReleases from "~/views/artist/_renderReleases.svelte";
    import FeaturedOptions from "~/views/artist/_featuredOptions.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { artistID } = $props();

    const releaseTypesOrder = userPreference("album_release_type_sort") || "";
    let appearances = [];
    let releases = $state([]);
    let finalAppearances = $derived(cloneDeep(appearances));

    async function processData() {
        // sort entire array together
        let sorted = sortBy($query.data, [$Settings.ArtistReleases.sort]);

        if ($Settings.ArtistReleases.sortReversed) {
            sorted.reverse();
        }

        let groupMethod;

        switch ($Settings.ArtistReleases.group) {
            case "name":
                groupMethod = (item) => item.name.charAt(0);
                break;
            case "year":
                groupMethod = (item) => item.year || "";
                break;
            case "decade":
                groupMethod = (item) => Math.floor(item.year / 10) * 10 || "";
                break;
            case "release_type":
                groupMethod = (item) => item.type || "";
                break;
            case "none":
            default:
                groupMethod = false;
                break;
        }

        // group into sections if requested
        let grouped = groupBy(sorted, groupMethod);

        // convert to array
        grouped = Object.entries(grouped).map(([key, value]) => {
            return [key, value];
        });

        // reorder the groups to match the order set in preference
        if ($Settings.ArtistReleases.group === "release_type") {
            let arr = $releaseTypesOrder.split(",");

            grouped.sort(function (a, b) {
                // ensures the order matches preference, with new items appended
                return (
                    (arr.indexOf(a[0].toLowerCase()) + 1 || Number.MAX_VALUE) -
                    (arr.indexOf(b[0].toLowerCase()) + 1 || Number.MAX_VALUE)
                );
            });

            // formatting
            grouped.forEach((type) => (type[0] = formatReleaseType(type[0])));
        }

        releases = grouped;
    }

    let query = $derived(
        createQuery({
            queryKey: ["artistAlbums", artistID],
            queryFn: async () => {
                let result = await $API.artistAlbums({ filter: artistID });

                if (result.error) {
                    errorHandler("getting artist albums", result.error);
                    return [];
                }

                return result;
            },
            enabled: $User.isLoggedIn,
            select: (data) => {
                let divide = partition(
                    data.album,
                    (item) => item.artist?.id === artistID,
                );
                let byArtist = divide[0];
                appearances = divide[1];
                return byArtist;
            },
        }),
    );

    // run processData whenever $query.data or $Settings.ArtistReleases change
    $effect.pre(() => {
        $query.data, processData();
    });

    $effect.pre(() => {
        $Settings.ArtistReleases, processData();
    });

    $effect(() => {
        if (!$Settings.ArtistReleases) {
            $Settings.ArtistReleases.reset(); // svelte-persisted-store reset to initial value
        }
    });
</script>

<sl-dropdown style="position: relative; z-index: 3000; ">
    <sl-button caret slot="trigger">{$_("text.options")}</sl-button>

    <sl-card style="width: 300px;">
        <div class="display-options">
            <sl-select
                label="Display"
                onsl-change={(e) =>
                    ($Settings.ArtistReleases.view = e.target.value)}
                value={$Settings.ArtistReleases.view}
            >
                <MaterialSymbol name="visibility" slot="prefix" />
                <sl-option value="table">Table</sl-option>
                <sl-option value="card-small">Cards (small)</sl-option>
                <sl-option value="card">Cards (large)</sl-option>
                <sl-option value="expanded_columns">Tracks (columns)</sl-option>
                <sl-option value="expanded_table">Tracks (table)</sl-option>
            </sl-select>

            <div class="sort-options">
                <sl-select
                    clearable
                    label="Sort"
                    onsl-change={(e) =>
                        ($Settings.ArtistReleases.sort = e.target.value)}
                    placeholder="None"
                    value={$Settings.ArtistReleases.sort}
                >
                    <MaterialSymbol name="sort" slot="prefix" />
                    <sl-option value="name">Name</sl-option>
                    <sl-option value="artist.name">Artist</sl-option>
                    <sl-option value="rating">Rating</sl-option>
                    <sl-option value="year">Year</sl-option>
                </sl-select>

                <sl-tooltip content="Direction">
                    <sl-button
                        onclick={() =>
                            ($Settings.ArtistReleases.sortReversed =
                                !$Settings.ArtistReleases.sortReversed)}
                    >
                        {#if $Settings.ArtistReleases.sortReversed}
                            <MaterialSymbol name="arrow_downward" />
                        {:else}
                            <MaterialSymbol name="arrow_upward" />
                        {/if}
                    </sl-button>
                </sl-tooltip>
            </div>

            <sl-select
                clearable
                label="Grouping"
                onsl-change={(e) =>
                    ($Settings.ArtistReleases.group = e.target.value)}
                placeholder="None"
                value={$Settings.ArtistReleases.group}
            >
                <MaterialSymbol name="category" slot="prefix" />
                <sl-option value="name">Name</sl-option>
                <sl-option value="release_type">Release Type</sl-option>
                <sl-option value="year">Year</sl-option>
                <sl-option value="decade">Decade (Year)</sl-option>
            </sl-select>
        </div>
    </sl-card>
</sl-dropdown>

<div class="releases">
    {#if $query.isLoading}
        <p>Loading...</p>
    {:else if $query.isError}
        <p>Error: {$query.error.message}</p>
    {:else if $query.isSuccess}
        {#if releases.length > 0}
            {#each releases as [group, items]}
                <div class="release-group">
                    {#if releases.length > 0 && group !== "undefined"}
                        <h3 class="group-title">{group}</h3>
                    {/if}

                    <RenderReleases
                        view={$Settings.ArtistReleases.view}
                        {items}
                    />
                </div>
            {/each}
        {/if}

        {#if finalAppearances.length > 0}
            <div class="release-group appearances">
                <h3 class="group-title appearances">
                    <span class="appearances-text">Appears On</span>

                    <FeaturedOptions />
                </h3>

                <RenderReleases
                    view={$Settings.ArtistReleases.view}
                    items={finalAppearances}
                    filterToArtistID={artistID}
                />
            </div>
        {/if}

        {#if !releases && !finalAppearances}
            <p>No items found</p>
        {/if}
    {/if}
</div>

<style>
    .releases {
        margin-block-start: var(--spacing-lg);
        justify-self: unset; /* let children be full width */
        overflow: hidden; /* tables won't overflow otherwise */
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xxxl);
    }

    .release-group {
        display: flex;
        flex-direction: column;
    }

    .group-title {
        margin-block-end: var(--spacing-lg);
        padding-block-end: var(--spacing-md);
        border-block-end: 1px solid var(--color-outline-variant);
    }

    .group-title.appearances {
        display: flex;
        gap: var(--spacing-md);
        flex-shrink: 0;
        align-items: center;
    }

    .display-options {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
        max-width: 280px;
    }

    .sort-options {
        display: flex;
        gap: var(--spacing-lg);
        align-items: end;
    }

    .appearances-text {
        flex-shrink: 0;
    }
</style>
