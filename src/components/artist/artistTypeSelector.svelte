<script>
    import { tick } from "svelte";
    import { ShowArtistType } from "../../stores/status";

    async function handleSkipBelowRating() {
        await tick();
        let newValue = $ShowArtistType;
        localStorage.setItem('ShowArtistType', JSON.stringify(newValue));
        ShowArtistType.set(newValue);
        console.debug($ShowArtistType);
    }
</script>

<div class="container">
    Showing

    <select bind:value={$ShowArtistType} on:change={handleSkipBelowRating}>
        <option value="all" selected={$ShowArtistType === "all"}>all</option>
        <option value="album_artist" selected={$ShowArtistType === "album_artist"}>album</option>
    </select>

    artists
</div>

<style>
    .container {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }
</style>