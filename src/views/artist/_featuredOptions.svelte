<script>
    import { _ } from "svelte-i18n";
    import {
        PlaySongsByOtherArtists,
        Saved,
        ShowSongsByOtherArtists,
    } from "~/stores/settings.js";

    function handleShowSongs(e) {
        let val = e.target.value;
        $ShowSongsByOtherArtists = val;
        $Saved.setItem("ShowSongsByOtherArtists", val);
    }

    function handlePlaySongs(e) {
        let val = e.target.value;
        $PlaySongsByOtherArtists = val;
        $Saved.setItem("PlaySongsByOtherArtists", val);
    }
</script>

<sl-dropdown style="position: relative; z-index: 2000;">
    <sl-button caret size="small" slot="trigger">
        {$_("text.options")}
    </sl-button>

    <sl-card>
        <sl-radio-group
            label="Display of songs by other artists"
            name="display"
            on:sl-change={(e) => {
                handleShowSongs(e);
            }}
            value={$ShowSongsByOtherArtists}
        >
            <sl-radio-button value="show">Show</sl-radio-button>
            <sl-radio-button value="highlight">
                Highlight this artist
            </sl-radio-button>
            <sl-radio-button value="hide">Hide</sl-radio-button>
        </sl-radio-group>

        <sl-divider></sl-divider>

        <sl-radio-group
            label="Playback of songs by other artists"
            name="playback"
            on:sl-change={(e) => {
                handlePlaySongs(e);
            }}
            value={$PlaySongsByOtherArtists}
        >
            <sl-radio-button value="include">Include</sl-radio-button>
            <sl-radio-button value="exclude">Skip</sl-radio-button>
        </sl-radio-group>
    </sl-card>
</sl-dropdown>

{#if $ShowSongsByOtherArtists === "hide"}
    <sl-badge variant="neutral">Hiding songs by other artists</sl-badge>
{/if}

{#if $PlaySongsByOtherArtists === "exclude"}
    <sl-badge variant="neutral">Skipping songs by other artists</sl-badge>
{/if}
