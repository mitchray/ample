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
    Artist Mode:
    <select bind:value={$ShowArtistType} on:change={handleArtistType}>
        <option value="all" selected={$ShowArtistType === "all"}>All artists</option>
        <option value="album_artist" selected={$ShowArtistType === "album_artist"}>Album artists</option>
    </select>
</div>

<style>
    .container {
        position: absolute;
        right: 0;
        top: 0;
    }
</style>