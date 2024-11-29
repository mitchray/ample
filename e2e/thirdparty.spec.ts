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
        page.getByRole("heading", { name: 'Exploring "Taylor Swift"' }),
    ).toBeVisible();
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

test("musicbrainz artist", async ({ page }) => {
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

test("bing artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.bing.com/search?q=%22Taylor%20Swift%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" - Search/);
});

test("duckduckgo artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.duckduckgo.com/?q=%22Taylor%20Swift%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" at DuckDuckGo/);
});

test("google artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.google.com/search?q=%22Taylor%20Swift%22", {
        waitUntil: "commit",
    });
    await expect(page).toHaveTitle(/"Taylor Swift" - Google Search/);
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

test("apple music artist", async ({ page }) => {
    test.slow();
    await page.goto("https://music.apple.com/search?term=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await expect(
        page.getByRole("link", { name: "Taylor Swift · Artist" }),
    ).toBeVisible();
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

test("hdtracks artist", async ({ page }) => {
    test.slow();
    await page.goto("https://www.hdtracks.com/#/search?q=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await page.getByText("search Search for Taylor Swift").click();
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

test("youtube artist", async ({ page }) => {
    test.slow();
    await page.goto("https://music.youtube.com/search?q=Taylor%20Swift", {
        waitUntil: "commit",
    });
    await page.goto("https://music.youtube.com/search?q=Taylor+Swift");
    await expect(
        page
            .locator("#search-page yt-formatted-string")
            .filter({ hasText: /^Taylor Swift$/ })
            .getByRole("link"),
    ).toBeVisible();
});

test("tidal artist - NEEDS LOGIN", async ({ page }) => {});
