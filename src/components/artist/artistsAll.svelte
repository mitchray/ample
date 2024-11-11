<script>
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import {
        artistsPreset,
        normalizeResponse,
        remotePaginationDefaults,
    } from "~/components/lister/columns.js";

    /** @type {'artist'|'album_artist'} */
    export let type;

    let tabulator = null;
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <MassRater bind:tabulator type="artist" />
    </div>

    <Tabulator
        bind:tabulator
        columns={artistsPreset}
        options={{
            ...remotePaginationDefaults,
            ajaxConfig: {
                mode: "cors",
                method: "GET",
                headers: {
                    Authorization: "Bearer " + $User.token,
                },
            },
            ajaxURLGenerator: function (url, config, params) {
                if (params.size === true) {
                    params.size = 0;
                }

                return $API.rawURL("artists", {
                    album_artist: type === "album_artist" ? 1 : 0,
                    sort: "basename,ASC",
                    limit: params.size,
                    offset: (params.page - 1) * params.size,
                });
            },
            ajaxResponse: function (url, params, response) {
                return normalizeResponse("artist", url, params, response);
            },
            persistenceID: "artists",
        }}
    ></Tabulator>
</div>
