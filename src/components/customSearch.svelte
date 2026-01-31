<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, User } from "~/stores/state";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { untrack } from "svelte";

    let {
        loading = $bindable(),
        loadedTime = $bindable(),
        results = $bindable(),
        selectedObjectType = $bindable(),
        useSettings = null,
        immediateSearch = false,
    } = $props();

    let loaded = $state(false);
    let rows = $state([]);
    let groupedFieldsToShow = {};
    let rowCounter = $state(0);
    let containerBind = $state();
    let rawSearchRules = $state([]);

    // set defaults
    let settings = $state({
        type: "song",
        limit: "500",
        random: false,
        operator: "and",
    });

    function parseParams() {
        if (useSettings) {
            // override default settings with any params
            settings = { ...settings, ...useSettings };

            let joined = Object.keys(settings).join(",");
            let foundRules = joined.match(/rule_\d+(?=,)/gi);

            if (foundRules) {
                foundRules.forEach((element) => {
                    // test to see if all items are present
                    if (
                        settings[`${element}_operator`] !== undefined &&
                        settings[`${element}_input`] !== undefined
                    ) {
                        let newField = settings[`${element}`];

                        let newRow = {
                            id: parseInt(element.match(/\d+/)),
                            field: newField,
                            operator: settings[`${element}_operator`],
                            input: settings[`${element}_input`],
                        };

                        newRow.operatorType = getOperatorType(newField);

                        rows = [...rows, newRow];
                    }
                });
            }
        }
    }

    function addNewRow() {
        // use title or name if they exist
        const titleEntry = rawSearchRules.find(
            (item) => item.name === "title" || item.name === "name",
        );

        // fallback to first item
        let firstItem = titleEntry
            ? titleEntry
            : Array.from(groupedFieldsToShow.entries())[0][1][0];

        let newRow = {
            id: rowCounter,
            field: firstItem.name,
            operator: "0",
            input: "",
            type: firstItem.type,
            widget: firstItem.widget,
        };

        rows = [...rows, newRow];
    }

    async function getSearchRules() {
        loaded = false;

        let result = await $API.searchRules({
            filter: settings.type,
        });

        if (!result.rule || result.rule.length === 0) {
            console.debug("no rules returned");
        }

        rawSearchRules = result.rule;

        // filter out 'None' until clarified
        rawSearchRules = rawSearchRules.filter((item) => item.name !== "none");

        const groups = new Map();

        for (const item of rawSearchRules) {
            const key = item.title;

            if (!groups.has(key)) {
                groups.set(key, []);
            }

            groups.get(key).push(item);
        }

        // alphabetize each group
        groups.forEach((group) => {
            group.sort(function (obj1, obj2) {
                return obj1.label.localeCompare(obj2.label);
            });
        });

        groupedFieldsToShow = groups;
        //console.debug("groupedFieldsToShow", groupedFieldsToShow);

        loaded = true;
    }

    function removeRow(row) {
        rows = rows.filter((item) => item.id !== row.id);
    }

    function clearAll() {
        rows = [];
        results = [];
    }

    function setField(row, event) {
        // reset operator
        row.operator = "0";

        row.field = event.target.value;

        // set type
        row.type = rawSearchRules.find((item) => item.name === row.field).type;

        // set widget
        row.widget = rawSearchRules.find(
            (item) => item.name === row.field,
        ).widget;

        if (row.widget[0] === "select") {
            row.widget[1] = Object.entries(row.widget[1]).map(
                ([value, label]) => ({
                    value: Number(value),
                    label,
                }),
            );
        }

        // console.debug("row", row);

        return row;
    }

    async function search() {
        // check for invalid inputs
        if (containerBind?.querySelectorAll("*:invalid").length > 0) {
            return;
        }

        let response;
        results = [];
        loading = true;
        loadedTime = null;

        // transform rows into simple array for API call
        let simpleRows = rows.map((row) => [
            row.field,
            row.operator,
            row.input,
        ]);

        response = await $API.advancedSearch({
            type: settings.type,
            limit: settings.limit,
            random: settings.random ? 1 : 0,
            operator: settings.operator,
            rules: simpleRows,
        });

        switch (settings.type) {
            case "song":
                results = response.song;
                break;
            case "album":
                results = response.album;
                break;
            case "artist":
            case "song_artist":
            case "album_artist":
                results = response.artist;
                break;
            case "playlist":
                results = response.playlist;
                break;
            case "label":
                results = response.label;
                break;
            case "genre":
                results = response.genre;
                break;
            case "user":
                results = response.user;
                break;
            default:
                break;
        }

        if (response.error) {
            errorHandler("advanced search", response.error);
        }

        loadedTime = new Date();
        loading = false;
    }

    $effect.pre(() => {
        if ($User.isLoggedIn) {
            untrack(async () => {
                parseParams();

                if (immediateSearch) {
                    await search();
                }
            });
        }
    });

    // reset everything if object type changes
    $effect(() => {
        if (settings.type) {
            selectedObjectType = settings.type;
            getSearchRules();
        }
    });
    // auto-add a row if all are removed
    $effect(() => {
        if (loaded && rows.length < 1) {
            addNewRow();
        }
    });
    // get highest existing id, or start at 1
    $effect(() => {
        rowCounter = rows.length ? Math.max(...rows.map((t) => t.id)) + 1 : 1;
    });
</script>

<div bind:this={containerBind} class="container">
    <div class="options">
        <div class="type">
            <sl-select
                label={$_("text.searchFor")}
                onsl-change={(e) => {
                    settings.type = e.target.value;
                    clearAll();
                }}
                value={settings.type}
            >
                <sl-option value="song">{$_("text.songs")}</sl-option>
                <sl-option value="album">{$_("text.albums")}</sl-option>
                <sl-option value="artist">{$_("text.artists")}</sl-option>
                <sl-option value="song_artist">
                    {$_("text.songArtists")}
                </sl-option>
                <sl-option value="album_artist">
                    {$_("text.albumArtists")}
                </sl-option>
                <sl-option value="playlist">{$_("text.playlists")}</sl-option>
                <!--<sl-option value="label">{$_("text.labels")}</sl-option>-->
                <sl-option value="genre">{$_("text.genres")}</sl-option>
                <!--<sl-option value="user">{$_("text.users")}</sl-option>-->
            </sl-select>
        </div>

        <div class="maximum">
            <sl-select
                label={$_("text.limit")}
                onsl-change={(e) => {
                    settings.limit = e.target.value;
                }}
                value={settings.limit}
            >
                <sl-option value="0">{$_("text.unlimited")}</sl-option>
                <sl-option value="1">1</sl-option>
                <sl-option value="5">5</sl-option>
                <sl-option value="10">10</sl-option>
                <sl-option value="25">25</sl-option>
                <sl-option value="50">50</sl-option>
                <sl-option value="100">100</sl-option>
                <sl-option value="250">250</sl-option>
                <sl-option value="500">500</sl-option>
            </sl-select>
        </div>

        <div class="random">
            <sl-switch
                onsl-change={(e) => (settings.random = e.target.checked)}
            >
                {$_("text.random")}
            </sl-switch>
        </div>

        <div class="match">
            <sl-switch
                checked
                onsl-change={(e) => {
                    settings.operator = e.target.checked ? "and" : "or";
                }}
            >
                {$_("text.matchAllRules")}
            </sl-switch>
        </div>
    </div>

    <sl-divider></sl-divider>

    <div class="rules">
        {#each rows as row, i (row.id)}
            <div class="row">
                <sl-select
                    value={row.field}
                    onsl-change={(e) => {
                        rows[i] = setField(row, e);
                    }}
                >
                    {#each [...groupedFieldsToShow] as [key, value]}
                        {#if key.length > 0}
                            <sl-divider></sl-divider>
                            <small>{$_(key)}</small>
                            {#each value as field}
                                <sl-option value={field.name}>
                                    {$_(field.label)}
                                </sl-option>
                            {/each}
                        {:else}
                            {#each value as field}
                                <sl-option value={field.name}>
                                    {$_(field.label)}
                                </sl-option>
                            {/each}
                        {/if}
                    {/each}
                </sl-select>

                <!-- operators -->

                {#if row.type === "text"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchContains")}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchContainsNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="2">
                            {$_("text.searchStartsWith")}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.searchEndsWith")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="4">{$_("text.searchIs")}</sl-option>
                        <sl-option value="5">
                            {$_("text.searchIsNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="6">
                            {$_("text.searchSoundsLike")}
                        </sl-option>
                        <sl-option value="7">
                            {$_("text.searchSoundsLikeNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="8">
                            {$_("text.searchMatchRegex")}
                        </sl-option>
                        <sl-option value="9">
                            {$_("text.searchMatchRegexNot")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.type === "numeric"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchGreaterThanEqual")}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchLessThanEqual")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="2">
                            {$_("text.searchEquals")}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.searchEqualsNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="4">
                            {$_("text.searchGreaterThan")}
                        </sl-option>
                        <sl-option value="5">
                            {$_("text.searchLessThan")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.type === "date"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchBefore")}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchAfter")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.type === "days"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchBeforeXDays", {
                                values: { x: "(x)" },
                            })}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchAfterXDays", {
                                values: { x: "(x)" },
                            })}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.type === "user_numeric"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchHasLoved")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="1">
                            {$_("text.searchStars", { values: { count: 5 } })}
                        </sl-option>
                        <sl-option value="2">
                            {$_("text.searchStars", { values: { count: 4 } })}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.searchStars", { values: { count: 3 } })}
                        </sl-option>
                        <sl-option value="4">
                            {$_("text.searchStars", { values: { count: 2 } })}
                        </sl-option>
                        <sl-option value="5">
                            {$_("text.searchStars", { values: { count: 1 } })}
                        </sl-option>
                        <sl-option value="6">
                            {$_("text.searchNotRated")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.type.includes("recent_")}
                    <label style="text-align: end;">
                        <input
                            name="banana"
                            type="radio"
                            value="0"
                            checked
                            readonly
                            hidden
                        />
                        {$_("text.limit")}
                    </label>
                {/if}

                {#if row.type === "is_true"}
                    <label>
                        <input
                            name="apple"
                            type="radio"
                            value="0"
                            checked
                            readonly
                            hidden
                        />
                        {$_("text.searchTrue")}
                    </label>
                {/if}

                <!--
                {#if row.operatorType === "boolean_true"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">{$_("text.searchTrue")}</sl-option>
                        <sl-option value="1">
                            {$_("text.searchFalse")}
                        </sl-option>
                    </sl-select>
                {/if}
                -->

                {#if row.type.includes("boolean_")}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">{$_("text.searchIs")}</sl-option>
                        <sl-option value="1">
                            {$_("text.searchIsNot")}
                        </sl-option>
                    </sl-select>
                {/if}

                <!-- inputs -->

                {#if row.widget?.[0] === "input"}
                    {#if row.widget?.[1] === "text"}
                        <sl-input
                            type="text"
                            onsl-change={(e) => (row.input = e.target.value)}
                            required
                        ></sl-input>
                    {/if}

                    {#if row.widget?.[1] === "number"}
                        <sl-input
                            type="number"
                            onsl-change={(e) => (row.input = e.target.value)}
                            required
                        ></sl-input>
                    {/if}

                    {#if row.widget?.[1] === "datetime-local"}
                        <sl-input
                            type="datetime-local"
                            onsl-change={(e) => (row.input = e.target.value)}
                            required
                        ></sl-input>
                    {/if}

                    {#if row.widget?.[1] === "hidden"}
                        <span>
                            <input type="hidden" bind:value={row.input} />
                        </span>
                    {/if}
                {/if}

                {#if row.widget?.[0] === "select"}
                    <sl-select
                        value={row.input}
                        required
                        onsl-change={(e) => {
                            row.input = e.target.value;
                        }}
                    >
                        {#each row.widget?.[1] as item}
                            <sl-option value={item.value}>
                                {item.label}
                            </sl-option>
                        {/each}
                    </sl-select>
                {/if}

                <!-- remove row -->
                <sl-button
                    variant="danger"
                    circle
                    onclick={() => {
                        removeRow(row);
                    }}
                >
                    <MaterialSymbol name="close" />
                </sl-button>
            </div>
        {/each}

        <sl-button onclick={addNewRow} variant="primary">
            <MaterialSymbol name="add" slot="prefix" />
            {$_("text.searchAddRule")}
        </sl-button>
    </div>

    <sl-divider></sl-divider>

    <div class="actions">
        <sl-button onclick={search} variant="primary">
            {$_("text.search")}
        </sl-button>
    </div>
</div>

<style>
    .container {
        container-name: custom-search-wrapper;
        container-type: inline-size;
        margin-block-end: var(--spacing-xxl);
        overflow-y: visible; /* prevent selects from being cut off */
    }

    .rules {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: var(--spacing-xl);
    }

    .row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: end;
        width: 100%;
    }

    label {
        align-self: center;
    }

    .row > :global(*:not(button)) {
        width: 100%;
    }

    .options {
        display: flex;
        gap: var(--spacing-lg) var(--spacing-xl);
        align-items: end;
        flex-wrap: wrap;
        white-space: nowrap;
    }

    sl-switch {
        margin-block-end: var(--spacing-md);
    }

    @container custom-search-wrapper (min-width: 700px) {
        .rules {
            display: grid;
            grid-template-columns: repeat(4, auto);
            width: fit-content;
            gap: var(--spacing-md);
        }

        .row {
            display: contents;
        }
    }

    .container :global(*:invalid) {
        outline: 2px solid var(--swatch-red-500);
    }
</style>
