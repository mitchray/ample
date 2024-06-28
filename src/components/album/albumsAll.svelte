<script>
    import { User, API } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import {
        albumsPreset,
        remotePaginationDefaults,
        normalizeResponse,
    } from "~/components/lister/columns.js";
    import MassRater from "~/components/lister/massRater.svelte";

    let tabulator = null;
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <MassRater bind:tabulator type="album" />
    </div>

    <Tabulator
        bind:tabulator
        columns={albumsPreset}
        options={{
            ...remotePaginationDefaults,
            ajaxConfig: {
                mode: "cors",
                method: "GET", //set request type to Position
                headers: {
                    Authorization: "Bearer " + $User.token, //set specific content type
                },
            },
            ajaxURLGenerator: function (url, config, params) {
                if (params.size === true) {
                    params.size = 0;
                }

                return $API.rawURL("albums", {
                    sort: "basename,ASC",
                    limit: params.size,
                    offset: (params.page - 1) * params.size,
                });
            },
            ajaxResponse: function (url, params, response) {
                return normalizeResponse("album", url, params, response);
            },
            persistenceID: "albums",
        }}
    ></Tabulator>
</div>
