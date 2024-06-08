<script>
    import { User, Server } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";
    import MassRater from "~/components/lister/massRater.svelte";

    let tabulator = null;
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <MassRater bind:tabulator />
    </div>

    <Tabulator
        bind:tabulator
        columns={albumsPreset}
        options={{
            pagination: true, //enable pagination
            paginationMode: "remote", //enable remote pagination
            paginationCounter: "rows",
            paginationInitialPage: 1,
            paginationButtonCount: 9,
            paginationSize: 100,
            paginationSizeSelector: [10, 25, 50, 100, 200, true],
            ajaxURL: "not used, see ajaxURLGenerator",
            ajaxConfig: {
                mode: "cors",
                method: "GET", //set request type to Position
                headers: {
                    //Authorization: "Bearer " + $User.token, //set specific content type
                },
            },
            ajaxURLGenerator: function (url, config, params) {
                if (params.size === true) {
                    params.size = 0;
                }

                let request =
                    $Server.url +
                    "/server/json.server.php" +
                    "?action=albums" +
                    "&sort=basename,ASC" +
                    "&limit=" +
                    params.size +
                    "&offset=" +
                    (params.page - 1) * params.size +
                    "&auth=" +
                    $User.token;

                //console.debug(request);

                return request;
            },
            ajaxResponse: function (url, params, response) {
                // rename 'album' to 'data'
                delete Object.assign(response, { ["data"]: response["album"] })[
                    "album"
                ];

                // convert value of total_count to last_page
                response.last_page = Math.ceil(
                    response.total_count / params.size,
                );

                // rename 'total_count' to 'last_row'
                delete Object.assign(response, {
                    ["last_row"]: response["total_count"],
                })["total_count"];

                return response; //return the response data to tabulator
            },
            persistenceID: "albums",
        }}
    ></Tabulator>
</div>
