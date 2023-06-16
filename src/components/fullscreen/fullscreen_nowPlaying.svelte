<script>
    import { CurrentMedia } from "../../stores/status";

    import Rating from '../rating.svelte';
    import PlayerSeekBar from '../player/player_seekBar.svelte';
    import PlayerPrimaryControls from '../player/player_primaryControls.svelte';
    import PlayerTimeCurrent from '../player/player_timeCurrent.svelte';
    import PlayerTimeEnd from '../player/player_timeEnd.svelte';
    import PlayerArtwork from '../player/player_artwork.svelte';
    import PlayerCurrentDetails from '../player/player_currentDetails.svelte';
</script>

<div class="container">
    <div class="fullscreen__art">
        <PlayerArtwork/>
    </div>

    <div class="fullscreen__rating">
        {#if $CurrentMedia}
            <Rating type="song" id="{$CurrentMedia.id}" flag="{$CurrentMedia.flag}" rating="{$CurrentMedia.rating}" averageRating="{$CurrentMedia.averageRating}" />
        {:else}
            <Rating />
        {/if}
    </div>

    <div class="fullscreen__seek">
        <div class="fullscreen__seekbar">
            <PlayerSeekBar />
        </div>

        <div class="fullscreen__times">
            <div class="fullscreen__timeCurrent">
                <PlayerTimeCurrent/>
            </div>

            <div class="fullscreen__timeEnd">
                <PlayerTimeEnd/>
            </div>
        </div>
    </div>

    <div class="fullscreen__details">
        <PlayerCurrentDetails/>
    </div>

    <div class="fullscreen__controls">
        <PlayerPrimaryControls/>
    </div>
</div>

<style>
    .container {
        display: grid;
        grid-template-areas:
            "artwork"
            "rating"
            "seek"
            "details"
            "controls"
        ;
        grid-template-columns: 1fr;
        grid-template-rows: 2fr min-content min-content 1fr min-content;
        gap: var(--spacing-lg);
        height: 100%;
    }

    .container:before {
        content: '';
        background-color: var(--color-highlight);
        mask-image: linear-gradient(
                to bottom,
                hsl(0, 0%, 0%) 0%,
                hsla(0, 0%, 0%, 0.738) 19%,
                hsla(0, 0%, 0%, 0.541) 34%,
                hsla(0, 0%, 0%, 0.382) 47%,
                hsla(0, 0%, 0%, 0.278) 56.5%,
                hsla(0, 0%, 0%, 0.194) 65%,
                hsla(0, 0%, 0%, 0.126) 73%,
                hsla(0, 0%, 0%, 0.075) 80.2%,
                hsla(0, 0%, 0%, 0.042) 86.1%,
                hsla(0, 0%, 0%, 0.021) 91%,
                hsla(0, 0%, 0%, 0.008) 95.2%,
                hsla(0, 0%, 0%, 0.002) 98.2%,
                hsla(0, 0%, 0%, 0) 100%
        );
        position: absolute;
        inset-block-end: 0;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        pointer-events: none;
        z-index: -1;
        opacity: 0.2;
    }

    .fullscreen__art {
        grid-area: artwork;
        position: relative;
    }

    .fullscreen__art :global(img) {
        box-shadow: var(--shadow-xxl);
        position: absolute;
        inset-inline-start: 50%;
        transform: translateX(-50%);
        inset-block-end: 0;
        max-width: 100%;
        max-height: 100%;
        padding: var(--spacing-lg);
        padding-block-end: 0;
        box-sizing: border-box;
        clip-path: inset(var(--spacing-lg) var(--spacing-lg) 0% var(--spacing-lg) round 3%);
    }

    .fullscreen__rating {
        grid-area: rating;
        display: flex;
        justify-content: center;
    }

    .fullscreen__seek {
        grid-area: seek;
    }

    .fullscreen__seekbar {
        width: 100%;
        margin-block-end: var(--spacing-md);
    }

    .fullscreen__times {
        grid-area: times;
        display: flex;
        justify-content: space-between;
        padding-inline-start: var(--spacing-md);
        padding-inline-end: var(--spacing-md);
    }

    .fullscreen__details {
        grid-area: details;
        text-align: center;
        overflow: hidden;
        padding-inline-start: var(--spacing-md);
        padding-inline-end: var(--spacing-md);
    }

    .fullscreen__controls {
        grid-area: controls;
        transform: scale(1.5);
    }

    .fullscreen__controls :global(.primary-controls) {
        gap: var(--spacing-lg);
    }
</style>