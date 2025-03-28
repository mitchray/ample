<script>
    import { _ } from "svelte-i18n";
    import {
        IsMobile,
        NowPlayingIndex,
        NowPlayingQueue,
        CurrentMedia,
    } from "~/stores/state.js";
    import { showQueueItemAtIndex, updateQueue } from "~/logic/ui.js";
    import { Settings } from "~/stores/settings.js";
    import QueueList from "~/components/queue/queue_list.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import SkipBelowButton from "~/components/queue/queue_skipBelow.svelte";
    import {
        MediaPlayer,
        QueuePanelBind,
        QueueVirtualListBind,
    } from "~/stores/elements.js";
    import { tick, untrack } from "svelte";

    let follow = $state(true);

    async function handleClearPrevious() {
        $NowPlayingQueue.splice(0, $NowPlayingIndex);
        await updateQueue();
        $NowPlayingIndex = 0;
        $QueueVirtualListBind.scrollTop = 0;
    }

    function handleClearQueue() {
        $MediaPlayer.clearQueue();
    }

    function togglePinned() {
        let inverted = !$Settings.QueueIsPinned;
        $Settings.QueueIsPinned = inverted;
    }

    function expandPanel() {
        $QueuePanelBind.position = 100;
    }

    function handleScroll() {
        follow = false;
    }

    function handleFollow() {
        follow = true;
        showQueueItemAtIndex($NowPlayingIndex);
    }

    $effect(() => {
        if ($CurrentMedia?.id) {
            untrack(async () => {
                if (follow) {
                    await tick();
                    await showQueueItemAtIndex($NowPlayingIndex);
                }
            });
        }
    });
</script>

<div class="header panel-header">
    <h4 onclick={() => expandPanel()}>{$_("text.queue")}</h4>

    <sl-button-group>
        <sl-button
            class="show-current"
            onclick={() => handleFollow()}
            size="small"
            title={$_("text.queueShowCurrent")}
        >
            <MaterialSymbol name="footprint" fill={follow} />
        </sl-button>

        <SkipBelowButton />

        <sl-dropdown>
            <sl-button size="small" slot="trigger">
                <MaterialSymbol name="more_horiz" />
            </sl-button>

            <sl-menu>
                {#if !$IsMobile}
                    <sl-menu-item
                        onclick={(e) => {
                            e.stopPropagation();
                            togglePinned();
                        }}
                    >
                        {#if $Settings.QueueIsPinned}
                            {$_("text.queueUnpin")}
                        {:else}
                            {$_("text.queuePin")}
                        {/if}
                    </sl-menu-item>
                {/if}

                <sl-menu-item onclick={handleClearPrevious}>
                    {$_("text.queueClearPrevious")}
                </sl-menu-item>
            </sl-menu>
        </sl-dropdown>
    </sl-button-group>

    <sl-button
        circle
        class="clear-all"
        onclick={handleClearQueue}
        size="small"
        title={$_("text.clearAll")}
        variant="danger"
    >
        <MaterialSymbol name="delete" />
    </sl-button>
</div>

<QueueList queueType="user" {handleScroll} />

<style>
    .clear-all {
        margin-inline-start: auto;
    }

    .show-current :global(.icon) {
        position: relative;
        top: 1px;
    }

    .header h4 {
        cursor: pointer;
    }
</style>
