<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import Menu from '../components/menu.svelte';
    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import Actions from "../components/action/actions.svelte";

    import SVGPlay from "/src/images/play.svg";
    import SVGQueue from "/src/images/playlist_add.svg";
    import SVGPlayNext from "/src/images/menu_open.svg";
    import SVGShuffle from "/src/images/shuffle.svg";
    import SVGMore from "/src/images/more-hori.svg";
    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGPopular from "/src/images/trending_up.svg";
    import SVGSongs from "/src/images/songs.svg";
    import SVGSimilar from "/src/images/people.svg";
    import SVGArticle from "/src/images/article.svg";

    let isVisible = false;
    let menuAnchor;

    let currentTab;
    let data = {};

    let tabItems = [
        { label: "General", value: "general" },
        { label: "Menus", value: "menus" },
        { label: "Actions", value: "actions" },
    ];

    let title = $_('text.test');
    $PageTitle = title;

    function toggleMenu() {
        isVisible = !isVisible;
    }

    onMount(async () => {
        data.playlist = await $API.playlist({ filter: 26 });
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div style="margin: 2rem 0;">
    <Tabs bind:activeTabValue={currentTab} bind:items={tabItems} class="tabs" id="test">
        {#each tabItems as tab}
            {#if tab.loaded === true}
                {#if tab.value === 'general'}
                    <Tab id="general" class="tab-general" bind:activeTabValue={currentTab}>
                        <h2>Form elements</h2>
                        <div class="forms">
                            <label>
                                <input type="checkbox" />
                                Check me
                            </label>

                            <label>
                                <input type="checkbox" class="switch">
                                Switch!
                            </label>

                            <label>
                                <input type="radio" value="1" name="radioTest" />
                                This
                            </label>

                            <label>
                                <input type="radio" value="2" name="radioTest" />
                                That
                            </label>

                            <input type="text" placeholder="Example" />

                            <button>Button</button>

                            <select>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>

                            <select>
                                <optgroup label="Fruit">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </optgroup>

                                <optgroup label="Vegetables">
                                    <option value="4">Four</option>
                                    <option value="5">Five</option>
                                    <option value="6">Six</option>
                                </optgroup>
                            </select>

                            <hr>

                            <label>
                                <input type="checkbox" disabled />
                                Check me
                            </label>

                            <label>
                                <input type="checkbox" class="switch" disabled>
                                Switch!
                            </label>

                            <label>
                                <input type="radio" value="1" name="radioTest" disabled />
                                This
                            </label>

                            <label>
                                <input type="radio" value="2" name="radioTest" disabled />
                                That
                            </label>

                            <input type="text" placeholder="Example" disabled />

                            <button disabled>Button</button>

                            <select disabled>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>

                            <select disabled>
                                <optgroup label="Fruit">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </optgroup>

                                <optgroup label="Vegetables">
                                    <option value="4">Four</option>
                                    <option value="5">Five</option>
                                    <option value="6">Six</option>
                                </optgroup>
                            </select>
                        </div>

                        <section style="margin: 4rem 0;">
                            <h2>Buttons</h2>
                            <h4>Plain</h4>
                            <button class="button button--regular">Regular</button>
                            <button class="button button--danger">Danger</button>
                            <button class="button button--warning">Warning</button>
                            <button class="button button--primary">Primary</button>
                            <button class="button button--secondary">Secondary</button>
                            <button class="button button--tertiary">Tertiary</button>
                            <hr>
                            <h4>With icons</h4>
                            <button class="button button--regular"><SVGShuffle /> Regular with icon</button>
                            <button class="button button--danger"><SVGShuffle /> Danger with icon</button>
                            <button class="button button--warning"><SVGShuffle /> Warning with icon</button>
                            <button class="button button--primary"><SVGShuffle /> Primary with icon</button>
                            <button class="button button--secondary"><SVGShuffle /> Secondary with icon</button>
                            <button class="button button--tertiary"><SVGShuffle /> Tertiary</button>
                            <hr>
                            <h4>Icons only</h4>
                            <button class="icon-button button--regular"><SVGPlay style="transform: scale(1.2);" /></button>
                            <button class="icon-button button--regular"><SVGShuffle /></button>
                            <button class="icon-button button--danger"><SVGShuffle /></button>
                            <button class="icon-button button--warning"><SVGShuffle /></button>
                            <button class="icon-button button--primary"><SVGShuffle /></button>
                            <button class="icon-button button--secondary"><SVGShuffle /></button>
                            <button class="icon-button button--tertiary"><SVGShuffle /></button>
                            <button class="icon-button"><SVGPlay /></button>
                            <button class="icon-button"><SVGShuffle /></button>
                            <hr>
                            <h4>Small icons</h4>
                            <button class="icon-button button--regular button--mini"><SVGPlay /></button>
                            <button class="icon-button button--regular button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <button class="icon-button button--danger button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <button class="icon-button button--warning button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <button class="icon-button button--primary button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <button class="icon-button button--secondary button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <button class="icon-button button--tertiary button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <button class="icon-button button--mini"><SVGPlay /></button>
                            <button class="icon-button button--mini"><SVGShuffle style="transform: scale(0.85);" /></button>
                            <hr>
                            <h4>Disabled</h4>
                            <button class="button button--regular" disabled>Regular</button>
                            <button class="button button--danger" disabled>Danger</button>
                            <button class="button button--warning" disabled>Warning</button>
                            <button class="button button--primary" disabled>Primary</button>
                            <button class="button button--secondary" disabled>Secondary</button>
                            <button class="button button--tertiary" disabled>Secondary</button>
                            <hr>
                        </section>
                    </Tab>
                {/if}

                {#if tab.value === 'actions'}
                    <Tab id="actions" class="tab-actions" bind:activeTabValue={currentTab}>
                        <h2>Actions</h2>

                        <h4>Full</h4>
                        <Actions mode="fullButtons" type="album" id={4399} />

                        <hr>

                        <h4>Mini</h4>
                        <Actions mode="miniButtons" type="album" id={4399} />

                        <hr>

                        <h4>Menu</h4>
                        <Actions mode="menu" type="album" id={4399} />
                    </Tab>
                {/if}

                {#if tab.value === 'menus'}
                    <Tab id="menus" class="tab-actions" bind:activeTabValue={currentTab}>
                        <h2>Menus</h2>
                        <div style="padding: 100px;">
                            <select bind:value={menuAnchor}>
                                <option value="left-top">left-top</option>
                                <option value="left-center">left-center</option>
                                <option value="left-bottom" selected>left-bottom</option>

                                <option value="top-left">top-left</option>
                                <option value="top-center">top-center</option>
                                <option value="top-right">top-right</option>

                                <option value="right-top">right-top</option>
                                <option value="right-center">right-center</option>
                                <option value="right-bottom">right-bottom</option>

                                <option value="bottom-left">bottom-left</option>
                                <option value="bottom-center">bottom-center</option>
                                <option value="bottom-right">bottom-right</option>
                            </select>

                            <button id="testToggleMenu" on:click={toggleMenu}>Menu {menuAnchor}</button>
                        </div>

                        {#if isVisible}
                            <Menu anchor="{menuAnchor}" toggleSelector={"#testToggleMenu"} bind:isVisible>
                                <div class="panel-content">
                                    <ul style="margin: 0;">
                                        <li>One</li>
                                        <li>Two is longer so we can test stuff</li>
                                        <li>Three</li>
                                    </ul>
                                </div>
                            </Menu>
                        {/if}
                    </Tab>
                {/if}
            {/if}
        {/each}
    </Tabs>
</div>



<style>
    hr {
        margin: 1rem 0;
        opacity: 0.2;
    }

    :global(.tab-general .forms) > * {
        margin-inline-end: 1em;
    }
</style>