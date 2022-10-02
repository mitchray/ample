<script>
    import { tick } from "svelte";
    import { ShowArtistType } from "../../stores/status";

    async function handleArtistType() {
        await tick();
        let newValue = $ShowArtistType;
        localStorage.setItem('ShowArtistType', JSON.stringify(newValue));
        ShowArtistType.set(newValue);
    }
</script>

<div class="container">
    Showing

    <select bind:value={$ShowArtistType} on:change={handleArtistType}>
        <option value="all" selected={$ShowArtistType === "all"}>all artists</option>
        <option value="album_artist" selected={$ShowArtistType === "album_artist"}>album artists</option>
    </select>
</div>

<style>
    .container {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }
</style>