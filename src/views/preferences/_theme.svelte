<script>
    import { _ } from "svelte-i18n";
    import ThemePreview from "~/components/theme/themePreview.svelte";
    import { Theme } from "~/stores/settings.js";

    function parseHue(cssHSL) {
        const match = cssHSL.match(/hsl\((\d+),/);
        return match && match[1] ? parseInt(match[1], 10) : null;
    }

    function setHue(e, name) {
        let theVal = parseHue(e.target.getFormattedValue("hsl"));

        // for the swatch preview
        e.target.style.setProperty("--the-hue", theVal);

        // actual theme color
        $Theme = { ...$Theme, [name]: theVal };
    }
</script>

<div>
    <sl-color-picker
        class="hue-only"
        format="hsl"
        onsl-input={(e) => {
            setHue(e, "hueBackground");
        }}
        style="--the-hue: {$Theme.hueBackground};"
        value="hsl(--the-hue, 70%, 50%)"
    ></sl-color-picker>
    {$_("text.colorBackground")}

    <sl-switch
        checked={$Theme.isGray}
        onsl-change={(e) => {
            $Theme = { ...$Theme, isGray: e.target.checked };
        }}
    >
        {$_("text.colorGray")}
    </sl-switch>
</div>

<div>
    <sl-color-picker
        class="hue-only"
        format="hsl"
        onsl-input={(e) => {
            setHue(e, "hue1");
        }}
        style="--the-hue: {$Theme.hue1};"
        value="hsl(var(--the-hue), 70%, 50%)"
    ></sl-color-picker>
    {$_("text.colorAccent1")}
</div>

<div>
    <sl-color-picker
        class="hue-only"
        format="hsl"
        onsl-input={(e) => {
            setHue(e, "hue2");
        }}
        style="--the-hue: {$Theme.hue2};"
        value="hsl(var(--the-hue), 70%, 50%)"
    ></sl-color-picker>
    {$_("text.colorAccent2")}
</div>

<div>
    <sl-color-picker
        onsl-input={(e) => {
            $Theme = { ...$Theme, colorWave: e.target.value };
        }}
        value={$Theme.colorWave}
    ></sl-color-picker>
    {$_("text.colorWaveform")}
</div>

<sl-divider></sl-divider>

<h2 class="heading">Presets</h2>

<!-- wave base oklch(65% 0.17 HUE) -->

<div class="presets">
    <ThemePreview
        colors={{
            wave: "#ff9d00",
            hue1: 60,
            hue2: 60,
            hueBackground: 60,
        }}
        isGray={true}
        name="Orange Crush"
    />

    <ThemePreview
        colors={{
            wave: "hsl(207, 88%, 54%)",
            hue1: 250,
            hue2: 250,
            hueBackground: 250,
        }}
        isGray={true}
        name="Blue Monday"
    />

    <ThemePreview
        colors={{
            wave: "hsl(108, 49%, 44%)",
            hue1: 140,
            hue2: 100,
            hueBackground: 140,
        }}
        isGray={true}
        name="Green Onions"
    />

    <ThemePreview
        colors={{
            wave: "hsl(5, 94%, 58%)",
            hue1: 30,
            hue2: 30,
            hueBackground: 30,
        }}
        isGray={true}
        name="99 Red Balloons"
    />

    <ThemePreview
        colors={{
            wave: "hsl(166, 100%, 33%)",
            hue1: 170,
            hue2: 350,
            hueBackground: 290,
        }}
        isGray={false}
        name="Bubble Pop Electric"
    />

    <ThemePreview
        colors={{
            wave: "hsl(33, 100%, 41%)",
            hue1: 60,
            hue2: 120,
            hueBackground: 140,
        }}
        isGray={false}
        name="Little Green Men"
    />

    <ThemePreview
        colors={{
            wave: "hsl(253, 100%, 72%)",
            hue1: 320,
            hue2: 320,
            hueBackground: 290,
        }}
        isGray={false}
        name="Purple Haze"
    />

    <ThemePreview
        colors={{
            wave: "hsl(186, 100%, 35%)",
            hue1: 240,
            hue2: 210,
            hueBackground: 250,
        }}
        isGray={false}
        name="Da Ba Dee Da Ba Di"
    />
</div>

<style>
    sl-color-picker.hue-only::part(swatches),
    sl-color-picker.hue-only::part(grid),
    sl-color-picker.hue-only::part(opacity-slider),
    sl-color-picker.hue-only::part(input),
    sl-color-picker.hue-only::part(eye-dropper-button),
    sl-color-picker.hue-only::part(preview),
    sl-color-picker.hue-only::part(format-button) {
        display: none;
    }

    sl-color-picker.hue-only::part(base) {
        background-color: transparent;
        border: 0;
        height: 36px;
        overflow: hidden;
    }

    sl-color-picker.hue-only::part(trigger) {
        color: oklch(60% 0.2 var(--the-hue)) !important;
    }

    /* have to remap into OKLCH hue scale */
    sl-color-picker.hue-only::part(hue-slider) {
        background-image: linear-gradient(
            to right,
            oklch(50% 0.2 0) 0%,
            oklch(60% 0.2 30) 8.33%,
            oklch(70% 0.2 60) 16.67%,
            oklch(80% 0.2 90) 25%,
            oklch(70% 0.2 120) 33.33%,
            oklch(70% 0.2 150) 41.67%,
            oklch(70% 0.2 180) 50%,
            oklch(70% 0.2 210) 58.33%,
            oklch(60% 0.2 240) 66.67%,
            oklch(50% 0.2 270) 75%,
            oklch(50% 0.2 300) 83.33%,
            oklch(60% 0.2 330) 91.67%,
            oklch(70% 0.2 0) 100%
        );
    }

    .presets {
        display: grid;
        gap: var(--spacing-xxxl) var(--spacing-xxl);
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .heading {
        margin-block-end: var(--spacing-lg);
    }
</style>
