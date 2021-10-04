<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { placeholderArtCheck } from "../logic/helper";

    import SVGAlbumDetailed from "../../public/images/album-detailed.svg";
    import SVGArtistDetailed from "../../public/images/band-detailed.svg";

    export let type;
    export let src;
    export let thumbSize;
    export let width;
    export let height;
    export let alt = "";
    export let className = "";

    let validImage = true;
    let loaded = false;
    let _img;

    onMount(async () => {
        validImage = await placeholderArtCheck(src);

        if (validImage) {
            let newImg = new Image;
            newImg.onload = function() {
                _img.src = this.src;
                loaded = true;
            }

            newImg.src = `${src}&thumb=${thumbSize}`;
        }
    });
</script>

<div class="container" in:fade>
    <img bind:this={_img} class="{className}" class:visible={validImage && loaded} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="{alt}" width="{width}" height="{height}" />

    {#if type === "album"}
        <SVGAlbumDetailed class="{className} defaultCover {(loaded && validImage) ? 'hidden' : ''}" alt="{alt}" width="{width}" height="{height}" />
    {/if}

    {#if type === "artist"}
        <SVGArtistDetailed class="{className} defaultArtist {(loaded && validImage) ? 'hidden' : ''}" alt="{alt}" width="{width}" height="{height}" />
    {/if}
</div>

<style>
    .container {
        line-height: 0;
        position: relative;
    }

    img {
        opacity: 0;
        transition: all 300ms ease;
        top: 0;
        left: 0;
        position: absolute;
    }

    img.visible {
        opacity: 1;
    }

    .container :global(.hidden) {
        visibility: hidden;
    }

    :global(.defaultCover) {
        width: 100%;
        height: 100%;
        background-color: var(--color-background);
        padding: clamp(var(--spacing-sm), 5%, var(--spacing-xl));
    }

    :global(.defaultArtist) {
        width: 100%;
        height: 100%;
        background-color: var(--color-background);
    }

    :global(.defaultCover .label) {
        color: var(--color-highlight);
    }

    :global(.defaultCover .disc) {
        color: hsla(0, 0% , 100%, 0.05);
    }

    :global(.theme-is-light .defaultCover .disc) {
        color: hsla(0, 0% , 0%, 0.2);
    }

    :global(.defaultCover .lines) {
        color: hsla(0, 0% , 100%, 0.2);
    }

    :global(.defaultArtist .flair) {
        color: var(--color-highlight);
    }

    :global(.defaultArtist .circle) {
        color: hsla(0, 0% , 100%, 0.4);
    }

    :global(.theme-is-light .defaultArtist .circle) {
        color: hsla(0, 0% , 0%, 0.4);
    }

    :global(.defaultArtist .people) {
        color: var(--color-background);
    }
</style>