<script>
    import MusicbrainzScan from "~/components/musicbrainzScan.svelte";

    let { artist } = $props();
</script>

<MusicbrainzScan data={artist} />
