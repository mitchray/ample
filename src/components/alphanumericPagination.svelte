<script>
    export let selectedChar;
    export let searchValue;

    let options = '#abcdefghijklmnopqrstuvwxyz';
    let expanded = [...options];
    let items = new Map();

    for (let i = 0; i < expanded.length; i++) {
        if (expanded[i] === "#") {
            items.set(expanded[i], '([[:digit:]]|[[:space:]])');
        } else {
            items.set(expanded[i], expanded[i]);
        }
    }

    let params = (new URL(document.location)).searchParams;

    // Load from URL otherwise set defaults
    let charID = params.get('filter') || '';

    $: selectedChar = charID;
    $: searchValue = charID.replaceAll("#", "([[:digit:]]|[[:space:]])");

    function clear() {
        let url = new URL(window.location);
        url.searchParams.delete('filter');
        charID = '';
        window.history.replaceState({}, '', url);
    }

    function handleSelection(e) {
        let url = new URL(window.location);
        let charSelected = e.target.dataset.char_id;
        charID = charSelected;
        url.searchParams.set('filter', charSelected);
        window.history.replaceState({}, '', url);
    }
</script>

<div class="container pagination">
    <button class="button button--regular all" on:click={clear}>
        All
    </button>

    <ul class="row">
        {#each [...items] as [id, chars]}
            <li>
                <button
                    on:click={handleSelection}
                    data-char_id={id}
                    class="button"
                    class:active={id === selectedChar}
                >
                    {id}
                </button>
            </li>
        {/each}
    </ul>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        margin-bottom: var(--spacing-lg);
    }

    .row {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }

    li {
        display: inline-block;
    }

    ul {
        margin: 0;
    }

    button {
        display: inline-flex;
        height: 30px;
        align-content: center;
        justify-content: center;
        text-transform: uppercase;
    }

    .all {
        margin-right: var(--spacing-lg);
    }

    .row button {
        width: 30px;
    }
</style>