<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../stores/api";

    export let items = [];
    export let type;
    export let loadedTime;

    let newRating = 3;

    function handleApply() {
        items.forEach((item, index) => {
            if (item.selected === true) {
                $API.rate({ type: type, id: item.id, rating: newRating });
                items[index].rating = newRating;
            }
        });

        items = items;
        loadedTime = new Date();
    }

    function handleRating(e) {
        newRating = parseInt(e.target.value);
    }
</script>


<div class="container">
    <button type="button" class="button button--primary" on:click={handleApply}>{$_('text.apply')}</button>

    <label>
        <select on:change={handleRating}>
            <option value="0" selected={newRating === 0}>0</option>
            <option value="1" selected={newRating === 1}>1</option>
            <option value="2" selected={newRating === 2}>2</option>
            <option value="3" selected={newRating === 3}>3</option>
            <option value="4" selected={newRating === 4}>4</option>
            <option value="5" selected={newRating === 5}>5</option>
        </select>
    </label>
</div>


<style>
    .container {
        background-color: var(--color-interface);
        padding: var(--spacing-lg);
        display: inline-block;
        border-radius: 10px;
        margin-bottom: var(--spacing-lg);
    }
</style>