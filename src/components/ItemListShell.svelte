<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Art from "~/components/art.svelte";
    import Badge from "~/components/badge.svelte";
    import Privacy from "~/components/privacy.svelte";
    import Rating from "~/components/rating/rating.svelte";

    let {
        data = {},
        type,
        showMeta = true,
        showRating = true,
        actions,
        children,
    } = $props();
</script>

<div class="page-wrapper">
    <div class="details-container">
        <div class="details">
            <div class="cover-rating">
                <div class="art-container">
                    <Art size="large" {data} {type} radius="6px" />
                </div>

                {#if showRating}
                    <div class="rating">
                        <Rating type="playlist" {data} />
                    </div>
                {/if}
            </div>

            <div class="info">
                <div class="name">
                    <div class="type">
                        <Badge text={$_(`text.${type}`)} />
                    </div>

                    <h1 class="title">
                        {data.name}
                    </h1>
                </div>

                {#if showMeta}
                    <div class="meta-container">
                        <div class="meta-entry">
                            <span class="meta-field">
                                {$_("text.items")}
                            </span>
                            <span class="meta-value">
                                {data.items}
                            </span>
                        </div>

                        <div class="meta-entry">
                            <span class="meta-field">
                                {$_("text.owner")}
                            </span>
                            <span class="meta-value">
                                {data.owner}
                            </span>
                        </div>

                        <div class="meta-entry">
                            <span class="meta-field">
                                {$_("text.type")}
                            </span>
                            <span class="meta-value">
                                <Privacy type={data.type} />
                            </span>
                        </div>
                    </div>
                {/if}

                {#if actions}
                    <div class="playlist-actions">
                        {@render actions()}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="songs-container">
        <div class="songs">
            {@render children?.()}
        </div>
    </div>
</div>

<style>
    .page-wrapper {
        display: grid;
        gap: var(--spacing-xxl);
        overflow: initial; /* let the art glow through */
    }

    .details-container {
        container-name: playlist-details-wrapper;
        container-type: inline-size;
    }

    .cover-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .art-container {
        width: 100%;
        max-width: 240px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        font-size: 0;
        margin-block-end: var(--spacing-lg);
    }

    :global(.sl-theme-dark) .art-container {
        filter: url(#blur-and-scale);
    }

    .info {
        display: flex;
        gap: var(--spacing-xl);
        flex-direction: column;
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        font-weight: 300;
        display: flex;
    }

    .playlist-actions {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-sm);
    }

    .type {
        --roboto-opsz: 32;
        display: flex;
        font-size: 14px;
        font-weight: 300;
        text-transform: uppercase;
        align-items: center;
    }

    .songs-container {
        overflow-y: hidden; /* prevent Tabulator from growing horizontally */
    }

    @container playlist-details-wrapper (min-width: 500px) {
        .details {
            display: flex;
            gap: var(--spacing-xl);
            margin-block-end: 0;
            padding: unset;
        }

        .details {
            background-color: unset;
            box-shadow: unset;
        }

        .title {
            justify-content: left;
        }

        .art-container {
            width: 180px;
        }

        .type {
            justify-content: start;
        }
    }

    @container playlist-details-wrapper (min-width: 800px) {
        .title {
            font-size: 40px;
            font-weight: 200;
        }

        .art-container {
            width: 240px;
        }
    }
</style>
