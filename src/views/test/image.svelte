<script>
    import { API } from "~/stores/state.js";
</script>

<h2>Image</h2>

{#await $API.getArt({ type: "album", id: 1935, size: "275x275" })}
    <p>Loading</p>
{:then blob}
    <img src={URL.createObjectURL(blob)} />
{:catch error}
    <p>An error occurred!: {error}</p>
{/await}

{#await $API.getArt({ type: "artist", id: 1540, size: "275x275" })}
    <p>Loading</p>
{:then blob}
    <img src={URL.createObjectURL(blob)} />
{:catch error}
    <p>An error occurred!: {error}</p>
{/await}
