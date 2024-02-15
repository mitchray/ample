<script>
    import { getContext } from "svelte";
    import { TableDefault } from "./columns.js";

    export let contextKey;

    const { loadedOptions, state, _options } = getContext(contextKey);

    let debug = false;
</script>

{#if debug}
    <table>
        <thead>
            <tr>
                <th></th>
                <th>Table defaults</th>
                <th>Localstorage</th>
                <th>Passed props</th>
                <th>Final/current</th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td>rowSizing</td>
                <td>{TableDefault.rowSizing}</td>
                <td>{$loadedOptions.rowSizing}</td>
                <td>{$_options.rowSizing}</td>
                <td>{$state.rowSizing}</td>
            </tr>

            <tr>
                <td>showArt</td>
                <td>{TableDefault.showArt}</td>
                <td>{$loadedOptions.showArt}</td>
                <td>{$_options.showArt}</td>
                <td>{$state.showArt}</td>
            </tr>

            <tr>
                <td>currentlySortingCol</td>
                <td>{TableDefault.currentlySortingCol}</td>
                <td>{$loadedOptions.currentlySortingCol}</td>
                <td>{$_options.currentlySortingCol}</td>
                <td>{$state.currentlySortingCol}</td>
            </tr>

            <tr>
                <td>canSort</td>
                <td>{TableDefault.canSort}</td>
                <td>{$loadedOptions.canSort}</td>
                <td>{$_options.canSort}</td>
                <td>{$state.canSort}</td>
            </tr>

            <tr>
                <td>sortBy</td>
                <td>{TableDefault.sortBy}</td>
                <td>{$loadedOptions.sortBy}</td>
                <td>{$_options.sortBy}</td>
                <td>{$state.sortBy}</td>
            </tr>

            <tr>
                <td>sortDirection</td>
                <td>{TableDefault.sortDirection}</td>
                <td>{$loadedOptions.sortDirection}</td>
                <td>{$_options.sortDirection}</td>
                <td>{$state.sortDirection}</td>
            </tr>

            <tr>
                <td>columnOrder</td>
                <td>{TableDefault.columnOrder?.join(",")}</td>
                <td>{$loadedOptions.columnOrder?.join(",")}</td>
                <td>{$_options.columnOrder?.join(",")}</td>
                <td>{$state.columnOrder?.join(",")}</td>
            </tr>

            <tr>
                <td>hiddenColumns</td>
                <td>{TableDefault.hiddenColumns?.join(",")}</td>
                <td>{$loadedOptions.hiddenColumns?.join(",")}</td>
                <td>{$_options.hiddenColumns?.join(",")}</td>
                <td>{$state.hiddenColumns?.join(",")}</td>
            </tr>
        </tbody>
    </table>
{/if}
