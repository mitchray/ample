<script>
    import { API, PageTitle } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Theme from "~/views/user-preferences/_theme.svelte";
    import { replace } from "svelte-spa-router";

    let { params = {} } = $props();

    let title = $_("text.preferences");
    $PageTitle = title;

    // Preferences that are actually in use by Ample
    const amplePreferenceNames = new Set(["ajax_load"]);
    let rawPreferences = $state([]);
    let showAmpleOnly = $state(false);

    const filteredPrefsByCategory = $derived.by(() => {
        const list = showAmpleOnly
            ? rawPreferences.filter((pref) =>
                  amplePreferenceNames.has(pref.name),
              )
            : rawPreferences;
        const byCategory = new Map();
        for (const pref of list) {
            const category = pref.category ?? null;
            if (!byCategory.has(category)) byCategory.set(category, []);
            byCategory.get(category).push(pref);
        }
        return byCategory;
    });

    function changeTab(e) {
        replace(`#/user-preferences/${e.detail.name}`);
    }

    function getPrefsBySubcategory(category) {
        const prefs = filteredPrefsByCategory.get(category) || [];
        const subcategoryMap = new Map();
        prefs.forEach((pref) => {
            const subcategory = pref.subcategory || null;
            if (!subcategoryMap.has(subcategory)) {
                subcategoryMap.set(subcategory, []);
            }
            subcategoryMap.get(subcategory).push(pref);
        });
        return subcategoryMap;
    }

    // default to interface tab
    $effect(() => {
        if (!params.section) replace(`#/user-preferences/interface`);
    });

    $effect(async () => {
        const userPrefs = await $API.userPreferences();
        rawPreferences = userPrefs?.preference ?? [];
    });
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<div class="filters-bar">
    <sl-switch
        checked={showAmpleOnly}
        onsl-change={(event) => (showAmpleOnly = event.target.checked)}
    >
        Ample-specific preferences only
    </sl-switch>
</div>

<sl-tab-group onsl-tab-show={changeTab}>
    {#each Array.from(filteredPrefsByCategory.keys()) as category}
        <sl-tab
            slot="nav"
            panel={category}
            active={category === params.section}
        >
            {#if category === "api"}
                API
            {:else}
                {category}
            {/if}
        </sl-tab>
    {/each}

    {#each Array.from(filteredPrefsByCategory.keys()) as category}
        <sl-tab-panel name={category}>
            {#each Array.from(getPrefsBySubcategory(category).keys()) as subcategory}
                <section>
                    <h2 class="subcategory-title">
                        {subcategory === "api" ? "API" : subcategory}
                    </h2>
                    {#each getPrefsBySubcategory(category).get(subcategory) || [] as pref}
                        <div class="preference">
                            <!-- <label>{pref.name}</label> -->
                            {#if pref.type === "boolean"}
                                <sl-checkbox
                                    checked={pref.value}
                                    disabled={!pref.has_access || null}
                                >
                                    {pref.description}
                                </sl-checkbox>
                            {:else if pref.type === "string"}
                                <sl-input
                                    value={pref.value}
                                    label={pref.description}
                                    disabled={!pref.has_access || null}
                                ></sl-input>
                            {:else if pref.type === "integer"}
                                <sl-input
                                    type="number"
                                    value={pref.value}
                                    label={pref.description}
                                    disabled={!pref.has_access || null}
                                ></sl-input>
                            {:else if pref.type === "special"}
                                <sl-select
                                    value={pref.value}
                                    label={pref.description}
                                    disabled={!pref.has_access || null}
                                >
                                    {#if pref.values}
                                        {#each pref.values as optionValue}
                                            <sl-option value={optionValue}>
                                                {optionValue}
                                            </sl-option>
                                        {/each}
                                    {/if}
                                </sl-select>
                            {/if}
                        </div>
                    {/each}
                </section>
            {/each}
        </sl-tab-panel>
    {/each}
</sl-tab-group>

<style>
    sl-tab-group::part(nav) {
        text-transform: capitalize;
    }

    .subcategory-title {
        text-transform: capitalize;
        padding-block-end: var(--spacing-sm);
    }

    section {
        padding-block-end: var(--spacing-xl);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .filters-bar {
        margin-block-end: var(--spacing-lg);
        overflow-y: visible;
    }

    sl-input,
    sl-select {
        padding-block: var(--spacing-md);
    }
</style>
