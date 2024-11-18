<script>
    import MusicbrainzScan from "~/components/musicbrainzScan.svelte";

    /** @type {{artist: any}} */
    let { artist } = $props();
</script>

<MusicbrainzScan data={artist} />
