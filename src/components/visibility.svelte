<script>
    // Courtesy of https://dev.to/dan_1s/visibility-detection-using-svelte-2e96
    import { onMount } from "svelte";

    export let top = 0;
    export let bottom = 500;
    export let left = 0;
    export let right = 0;

    export let steps = 100;

    let element;
    let percent;
    let observer;
    let unobserve = () => {};
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

<div class="indicator" bind:this={element}></div>

<slot {percent} {unobserve} />

<style>
    .indicator {
        display: inline;
    }
</style>
