<script>
    // Courtesy of https://dev.to/dan_1s/visibility-detection-using-svelte-2e96
    import { onMount } from "svelte";

    /** @type {{top?: number, bottom?: number, left?: number, right?: number, percentThreshold?: number, steps?: number, children?: import('svelte').Snippet<[any]>}} */
    let {
        top = 0,
        bottom = 500,
        left = 0,
        right = 0,
        percentThreshold = 0,
        steps = 100,
        children,
    } = $props();

    let element = $state();
    let percent = $state();
    let observer;
    let unobserve = $state(() => {});
    let intersectionObserverSupport = false;

    function intersectPercent(entries) {
        entries.forEach((entry) => {
            percent = Math.round(Math.ceil(entry.intersectionRatio * 100));
        });
    }

    function stepsToThreshold(steps) {
        return [...Array(steps).keys()].map((n) => n / steps);
    }

    onMount(() => {
        intersectionObserverSupport =
            "IntersectionObserver" in window &&
            "IntersectionObserverEntry" in window &&
            "intersectionRatio" in window.IntersectionObserverEntry.prototype;

        const options = {
            root: document.querySelector(".site-content-inner"),
            rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
            threshold: stepsToThreshold(steps),
        };

        if (intersectionObserverSupport) {
            observer = new IntersectionObserver(intersectPercent, options);
            observer.observe(element);
            unobserve = () => observer.unobserve(element);
        }

        return unobserve;
    });
</script>

<div bind:this={element} class="indicator"></div>

{#if percent > percentThreshold}
    <div class="dummy" use:unobserve>
        {@render children?.({ percent })}
    </div>
{/if}

<style>
    .indicator {
        display: inline;
    }

    .dummy {
        display: contents;
    }
</style>
