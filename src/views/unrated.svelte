<script>
    import CustomSearch from '../components/customSearch.svelte';
    import CustomSearchResults from '../components/customSearchResults.svelte';
    import Tabs from "../components/tabs.svelte";
    import CardList from '../components/cardList.svelte';
    import MassRater from '../components/massRater.svelte';

    import SVGRandom from "../../public/images/random.svg";
    import SVGStarFull from "../../public/images/star_full.svg";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Random",      value: "random", icon: SVGRandom },
        { label: "Mass assign", value: "mass",   icon: SVGStarFull },
    ];

    let currentTab;
    let loadedTime;
    let loading;
    let results = [];
    let type = "song";
</script>

<h1>Unrated</h1>

<Tabs bind:activeTabValue={currentTab} items={tabItems}>
    <div class="random" style="display: {currentTab === 'random' ? 'block' : 'none'}">
        <CardList type="artist" dataProvider={"unratedArtists"} limit=6 refresh=true heading="Artists" />

        <CardList type="album" dataProvider={"unratedAlbums"} limit=6 refresh=true heading="Albums" />

        <CardList type="song" dataProvider={"unratedSongs"} limit=9 refresh=true heading="Songs" />
    </div>

    <div class="batch" style="display: {currentTab === 'mass' ? 'block' : 'none'}">
        <CustomSearch bind:results bind:loadedTime bind:loading bind:selectedObjectType={type} />
        <MassRater bind:items={results} bind:type bind:loadedTime />
        <CustomSearchResults bind:results bind:loadedTime bind:loading bind:type showCheckboxes={true} />
    </div>
</Tabs>



<style>

</style>
