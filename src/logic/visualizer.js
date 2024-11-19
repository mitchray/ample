import butterchurnPresets from "butterchurn-presets";

export function getCuratedVisualizerPresets() {
    let presets = butterchurnPresets.getPresets();
    // TODO note for v3, use butterchurnPresets directly

    const pairs = Object.entries(presets);
    const sortedPairs = pairs.sort(([k1], [k2]) =>
        k1.toLowerCase().localeCompare(k2.toLowerCase()),
    );
    presets = Object.fromEntries(sortedPairs);

    let toKeep = [
        "$$$ Royal - Mashup (197)",
        "$$$ Royal - Mashup (220)",
        "$$$ Royal - Mashup (431)",
        "_Mig_049",
        "_Mig_085",
        "Aderrasi - Songflower (Moss Posy)",
        "Aderrasi - Storm of the Eye (Thunder) - mash0000 - quasi pseudo meta concentrics",
        "fiShbRaiN + Flexi - witchcraft 2.0",
        "Flexi - area 51",
        "Flexi - infused with the spiral",
        "flexi - mom, why the sky looks different today",
        "Flexi, martin + geiss - dedicated to the sherwin maxawow",
        "Geiss - Reaction Diffusion 2",
        "martin - angel flight",
        "martin - bombyx mori",
        "martin - disco mix 4",
        "Rovastar + Loadus + Geiss - FractalDrop (Triple Mix)",
        "Rovastar - Oozing Resistance",
        "TonyMilkdrop - Magellan's Nebula [Flexi - you enter first + multiverse]",
        "Unchained & Rovastar - Wormhole Pillars (Hall of Shadows mix)",
    ];

    return Object.fromEntries(
        Object.entries(presets).filter(([key]) => toKeep.includes(key)),
    );
}
