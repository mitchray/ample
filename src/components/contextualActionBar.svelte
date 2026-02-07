<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { contextualActions } from "~/stores/contextualActionBar.js";
    import {
        selectedTabulatorRowsFlat,
        getSelectedRows,
        clearAllSelections,
    } from "~/stores/selectedTabulatorRows.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { slide } from "svelte/transition";

    const visibleActions = $derived(
        $contextualActions.filter((a) => a.visible !== false),
    );
    const selectedCount = $derived($selectedTabulatorRowsFlat.length);
    const hasActions = $derived(visibleActions.length > 0 || selectedCount > 0);
    const firstItem = $derived($selectedTabulatorRowsFlat[0] || {});

    const entityType = $derived(firstItem?._tabulatorType || "songs");
    const selectedItems = $derived(
        $selectedTabulatorRowsFlat.filter((r) => r._tabulatorType === entityType),
    );

    const entityToFetchType = {
        songs: "songs",
        albums: "albums",
        artists: "artists",
        playlists: "playlists",
    };
    const fetchType = $derived(entityToFetchType[entityType] ?? "songs");

    const selectionData = $derived({
        getSongs: () =>
            getSelectedRows().filter((r) => r._tabulatorType === "songs"),
        getArtists: () =>
            getSelectedRows().filter((r) => r._tabulatorType === "artists"),
        getAlbums: () =>
            getSelectedRows().filter((r) => r._tabulatorType === "albums"),
        getPlaylists: () =>
            getSelectedRows().filter((r) => r._tabulatorType === "playlists"),
    });

    function handleClick(action) {
        if (!action.disabled && typeof action.onClick === "function") {
            action.onClick();
        }
    }
</script>

{#if hasActions}
    <div class="contextual-action-bar" transition:slide>
        <div class="contextual-action-bar__inner">
            {#if selectedCount > 0}
                <span>{$_("text.selected")}:</span>

                <Actions
                    type={fetchType}
                    items={selectedItems}
                    displayMode="miniButtons"
                    data={selectionData}
                    showShuffle={selectedItems.length >= 2}
                    showPlayFromHere={false}
                />

                <sl-button size="small" onclick={clearAllSelections}>
                    {$_("text.clearAll")}
                </sl-button>

                <sl-divider vertical></sl-divider>
            {/if}
            {#each visibleActions as action (action.id)}
                <sl-button
                    class="contextual-action-bar__btn"
                    variant={action.variant === "primary"
                        ? "primary"
                        : "default"}
                    size="small"
                    disabled={action.disabled === true}
                    loading={action.loading === true}
                    onclick={() => handleClick(action)}
                >
                    {#if action.icon}
                        <MaterialSymbol name={action.icon} slot="prefix" />
                    {/if}
                    {action.label}
                </sl-button>
            {/each}
        </div>
    </div>
{/if}

<style>
    .contextual-action-bar {
        flex-shrink: 0;
        position: sticky;
        top: 0;
        z-index: 2;
        align-content: center;
        padding-inline: var(--spacing-md);
        background: var(--color-surface-container);
        height: 36px;
    }

    .contextual-action-bar__inner {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap;
    }

    .contextual-action-bar__btn {
        flex-shrink: 0;
    }
</style>
