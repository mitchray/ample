import { test, expect } from "@playwright/test";

test("bandsintown artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.bandsintown.com/Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/Taylor Swift/);
    await expect(
        page.getByRole("heading", { name: "Taylor SwiftVerified" }),
    ).toBeVisible();
});

test("discogs artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.discogs.com/search/?q=%22Taylor%20Swift%22&type=artist",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Taylor Swift/);
    await expect(
        page.locator(".menu-item.current").filter({ hasText: "Artist" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: 'Exploring "Taylor Swift"' }),
    ).toBeVisible();
});

test("discogs album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.discogs.com/search/?q=%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22+%22Taylor%20Swift%22&type=release",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Taylor Swift/);
    await expect(
        page.locator(".menu-item.current").filter({ hasText: "Release" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", {
            name: 'Exploring "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY" "Taylor Swift"',
        }),
    ).toBeVisible();
});

test("discogs track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.discogs.com/search/?type=all&artist=Taylor%20Swift&track=Anti-Hero",
        {
            waitUntil: "commit",
        },
    );
    await expect(
        page.locator(".menu-item.current").filter({ hasText: "All" }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Anti-Hero', exact: true }).first()).toBeVisible();
});

test("genius artist", async ({ page }) => {
    test.slow();
    await page.goto("https://genius.com/artists/Taylor-Swift", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/Taylor Swift/);
    await expect(
        page.getByRole("heading", { name: "About “Taylor Swift”" }),
    ).toBeVisible();
});

test("genius album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://genius.com/albums/Taylor-Swift/THE-TORTURED-POETS-DEPARTMENT-THE-ANTHOLOGY",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(
        /Taylor Swift - THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY/,
    );
    await expect(page.getByRole('heading', { name: 'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY', exact: true })).toBeVisible();
});

test("genius track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://genius.com/Taylor-Swift-Anti-Hero-lyrics",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(
        /Taylor Swift – Anti-Hero/,
    );
    await expect(page.getByRole('heading', { name: 'Anti-Hero', exact: true })).toBeVisible();
});

test("lastfm artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.last.fm/search/artists?q=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/Artist Search/);
    await expect(
        page.locator(
            ".secondary-nav-item--artists .secondary-nav-item-link--active",
        ),
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "Taylor Swift", exact: true }),
    ).toBeVisible();
});

test("lastfm album", async ({ page }) => {
    test.slow();
    await page.goto("https://www.last.fm/search/albums?q=THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY+Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/Album Search/);
    await expect(
        page.locator(
            ".secondary-nav-item--albums .secondary-nav-item-link--active",
        ),
    ).toBeVisible();
    await expect(page.getByText('THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY Taylor Swift', { exact: true })).toBeVisible();
});

test("lastfm track", async ({ page }) => {
    test.slow();
    await page.goto("https://www.last.fm/search/tracks?q=Anti-Hero+Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/Track Search/);
    await expect(
        page.locator(
            ".secondary-nav-item--tracks .secondary-nav-item-link--active",
        ),
    ).toBeVisible();
    await expect(page.getByText('Anti-Hero', { exact: true }).first()).toBeVisible();
});

test("musicbrainz artist by MBID", async ({ page }) => {
    test.slow();

    await page.goto(
        "https://musicbrainz.org/artist/20244d07-534f-4eff-b4d4-930878889970",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Taylor Swift/);
    await expect(
        page.getByRole("heading", { name: "Taylor Swift" }).getByRole("link"),
    ).toBeVisible();
});

test("musicbrainz album by MBID", async ({ page }) => {
    test.slow();

    await page.goto(
        "https://musicbrainz.org/release/7b601946-adbe-4cc8-b517-a72a59185547",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY/);
    await expect(
        page.getByRole("heading", { name: "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY" }).getByRole("link"),
    ).toBeVisible();
});

test("musicbrainz track by MBID", async ({ page }) => {
    test.slow();

    await page.goto(
        "https://musicbrainz.org/recording/9b2bf6fa-5229-4544-9d86-1fdbdc2ef348",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Recording “Anti‐Hero”/);
    await expect(page.getByRole('heading', { name: 'Anti‐Hero (Dolby Atmos mix)' }).getByRole('link')).toBeVisible();
});

test("setlistfm artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.setlist.fm/search?query=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(
        page.getByRole("heading", { name: "More from Taylor Swift" }),
    ).toBeVisible();
});

test("songkick artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.songkick.com/search?query=Taylor%20Swift&type=artists",
        {
            waitUntil: "commit",
        },
    );
    await expect(
        page.getByRole("link", { name: "Taylor Swift", exact: true }),
    ).toBeVisible();
});

test("wikipedia artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://en.wikipedia.org/wiki/Special:Search?search=%22Taylor%20Swift%22&go=Go",
        {
            waitUntil: "commit",
        },
    );

    await expect(
        page.getByRole("heading", { name: "Taylor Swift" }).locator("span"),
    ).toBeVisible();
});

test("wikipedia album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://en.wikipedia.org/wiki/Special:Search?search=%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22&go=Go",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByRole('heading', { name: 'The Tortured Poets Department' })).toBeVisible();
});

test("wikipedia track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://en.wikipedia.org/wiki/Special:Search?search=%22Anti-Hero%22&go=Go",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByRole('heading', { name: 'Antihero' })).toBeVisible();
});

test("bing artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.bing.com/search?q=%22Taylor%20Swift%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" - Search/);
});

test("bing album", async ({ page }) => {
    test.slow();
    await page.goto("https://www.bing.com/search?q=%22Taylor%20Swift%22+%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY" - Search/);
});

test("bing track", async ({ page }) => {
    test.slow();
    await page.goto("https://www.bing.com/search?q=%22Taylor%20Swift%22+%22Anti-Hero%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" "Anti-Hero" - Search/);
});

test("duckduckgo artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.duckduckgo.com/?q=%22Taylor%20Swift%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" at DuckDuckGo/);
});

test("duckduckgo album", async ({ page }) => {
    test.slow();
    await page.goto("https://www.duckduckgo.com/?q=%22Taylor%20Swift%22+%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY" at DuckDuckGo/);
});

test("duckduckgo track", async ({ page }) => {
    test.slow();
    await page.goto("https://www.duckduckgo.com/?q=%22Taylor%20Swift%22+%22Anti-Hero%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" "Anti-Hero" at DuckDuckGo/);
});

test("google artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.google.com/search?q=%22Taylor%20Swift%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" - Google Search/);
});

test("google album", async ({ page }) => {
    test.slow();
    await page.goto("https://www.google.com/search?q=%22Taylor%20Swift%22+%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY" - Google Search/);
});

test("google track", async ({ page }) => {
    test.slow();
    await page.goto("https://www.google.com/search?q=%22Taylor%20Swift%22+%22Anti-Hero%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" "Anti-Hero" - Google Search/);
});

test("amazon artist", async ({ page }) => {
    test.slow();
    await page.goto("https://music.amazon.com/search/Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(
        page
            .locator("music-horizontal-item")
            .filter({ hasText: "ArtistTaylor Swift" })
            .getByRole("link"),
    ).toBeVisible();
});

test("amazon album", async ({ page }) => {
    test.slow();
    await page.goto("https://music.amazon.com/search/THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%20Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page.locator('music-horizontal-item').filter({ hasText: 'albumTHE TORTURED POETS' })).toBeVisible();
});

test("amazon track", async ({ page }) => {
    test.slow();
    await page.goto("https://music.amazon.com/search/Anti-Hero%20Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page.locator('music-horizontal-item').filter({ hasText: 'songAnti-Hero' })).toBeVisible();
});

test("apple music artist", async ({ page }) => {
    test.slow();
    await page.goto("https://music.apple.com/search?term=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(
        page.getByRole("link", { name: "Taylor Swift · Artist" }),
    ).toBeVisible();
});

test("apple music album", async ({ page }) => {
    test.slow();
    await page.goto("https://music.apple.com/search?term=THE%2BTORTURED%2BPOETS%2BDEPARTMENT%3A%2BTaylor%2BSwift", {
        waitUntil: "commit",
    });
    await expect(page.getByRole('link', { name: 'Explicit, THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY, Taylor Swift' })).toBeVisible();
});

test("apple music track", async ({ page }) => {
    test.slow();
    await page.goto("https://music.apple.com/search?term=Anti-Hero%20Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page.getByRole('link', { name: 'Anti-Hero · Song · Taylor' })).toBeVisible();
});

test("bandcamp artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://bandcamp.com/search?q=Taylor%20Swift&item_type=b",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Search: Taylor Swift/);
    await expect(page.locator("#filter-b")).toHaveClass(/filter-link--active/);
});

test("bandcamp album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://bandcamp.com/search?q=THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY&item_type=a",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Search: THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY/);
    await expect(page.locator("#filter-a")).toHaveClass(/filter-link--active/);
});

test("bandcamp track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://bandcamp.com/search?q=Anti-Hero&item_type=t",
        {
            waitUntil: "commit",
        },
    );
    await expect(page).toHaveTitle(/Search: Anti-Hero/);
    await expect(page.locator("#filter-t")).toHaveClass(/filter-link--active/);
});

test("deezer artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.deezer.com/search/%22Taylor%20Swift%22/artist",
        {
            waitUntil: "commit",
        },
    );
    await expect(
        page.locator("li.active").filter({ hasText: "Artists" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(
        page.getByRole("link", { name: "Taylor Swift", exact: true }),
    ).toBeVisible();
});

test("deezer album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.deezer.com/search/%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22%20%22Taylor%20Swift%22/album",
        {
            waitUntil: "commit",
        },
    );
    await expect(
        page.locator("li.active").filter({ hasText: "Albums" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('link', { name: 'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY' }).first()).toBeVisible();
});

test("deezer track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.deezer.com/search/%22Anti-Hero%22%20%22Taylor%20Swift%22/track",
        {
            waitUntil: "commit",
        },
    );
    await expect(
        page.locator("li.active").filter({ hasText: "Tracks" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('link', { name: 'Anti-Hero' }).first()).toBeVisible();
});

test("hdtracks artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.hdtracks.com/#/search?q=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(page.getByText("search Search for Taylor Swift")).toBeVisible();
});

test("hdtracks album", async ({ page }) => {
    test.slow();
    await page.goto("https://www.hdtracks.com/#/search?q=THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY", {
        waitUntil: "commit",
    });
    await expect(page.getByText("search Search for THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY")).toBeVisible();
});

test("hdtracks track", async ({ page }) => {
    test.slow();
    await page.goto("https://www.hdtracks.com/#/search?q=Anti-Hero", {
        waitUntil: "commit",
    });
    await expect(page.getByText("search Search for Anti-Hero")).toBeVisible();
});

test("qobuz artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.qobuz.com/us-en/search/artists/Taylor%20Swift",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByText('Results for "Taylor Swift"')).toBeVisible();
    await expect(
        page
            .locator(".tab-container .tab-item.selected")
            .filter({ hasText: "Artists" }),
    ).toBeVisible();
});

test("qobuz album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.qobuz.com/us-en/search/albums/THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByText('Results for "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY"')).toBeVisible();
    await expect(
        page
            .locator(".tab-container .tab-item.selected")
            .filter({ hasText: "Albums" }),
    ).toBeVisible();
});

test("qobuz track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://www.qobuz.com/us-en/search/tracks/Anti-Hero",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByText('Results for "Anti-Hero"')).toBeVisible();
    await expect(
        page
            .locator(".tab-container .tab-item.selected")
            .filter({ hasText: "Tracks" }),
    ).toBeVisible();
});

test("spotify artist", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://open.spotify.com/search/%22Taylor%20Swift%22/artists",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByRole("checkbox", { name: "Artists" })).toBeChecked();
});

test("spotify album", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://open.spotify.com/search/%22THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY%22%20artist:%22Taylor%20Swift%22/albums",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByRole("checkbox", { name: "Albums" })).toBeChecked();
});

test("spotify track", async ({ page }) => {
    test.slow();
    await page.goto(
        "https://open.spotify.com/search/%22Anti-Hero%22%20artist:%22Taylor%20Swift%22/tracks",
        {
            waitUntil: "commit",
        },
    );
    await expect(page.getByRole("checkbox", { name: "Songs" })).toBeChecked();
});

test("youtube artist", async ({ page }) => {
    test.slow();
    await page.goto("https://music.youtube.com/search?q=Taylor%20Swift", {
        waitUntil: "load",
    });
    await expect(
        page
            .locator("#search-page yt-formatted-string")
            .filter({ hasText: /^Taylor Swift$/ })
            .getByRole("link"),
    ).toBeVisible();
});

test("youtube album", async ({ page }) => {
    test.slow();
    await page.goto("https://music.youtube.com/search?q=THE%20TORTURED%20POETS%20DEPARTMENT%3A%20THE%20ANTHOLOGY", {
        waitUntil: "load",
    });
    await expect(
        page
            .locator("#search-page yt-formatted-string")
            .filter({ hasText: /^THE TORTURED POETS DEPARTMENT$/ })
            .getByRole("link"),
    ).toBeVisible();
});

test("youtube track", async ({ page }) => {
    test.slow();
    await page.goto("https://music.youtube.com/search?q=Anti-Hero", {
        waitUntil: "load",
    });
    await page.goto('https://music.youtube.com/search?q=Anti-Hero');
    await expect(page.getByRole('link', { name: 'Anti-Hero', exact: true }).first()).toBeVisible();
});

test("tidal artist - NEEDS LOGIN", async ({ page }) => {});
test("tidal album - NEEDS LOGIN", async ({ page }) => {});
test("tidal track - NEEDS LOGIN", async ({ page }) => {});