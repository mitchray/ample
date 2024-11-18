<script>
    import {
        normalizeResponse,
        playlistsPreset,
        remotePaginationDefaults,
    } from "~/components/lister/columns.js";
    import { API, User } from "~/stores/state.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";

    let tabulator = $state(null);
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <MassRater bind:tabulator type="artist" />
    </div>

    <Tabulator
        bind:tabulator
        columns={playlistsPreset}
        options={{
            ...remotePaginationDefaults,
            id: "playlists",
            ajaxConfig: {
                mode: "cors",
                method: "GET",
                headers: {
                    Authorization: "Bearer " + $User.token,
                },
            },
            ajaxURLGenerator: function (url, config, params) {
                if (params.size === true) {
                    params.size = 5000;
                }

                return $API.rawURL("playlists", {
                    hide_search: 1,
                    sort: "name,ASC",
                    limit: params.size,
                    offset: (params.page - 1) * params.size,
                });
            },
            ajaxResponse: function (url, params, response) {
                return normalizeResponse("playlist", url, params, response);
            },
            persistenceID: "playlists",
        }}
    ></Tabulator>
</div>
