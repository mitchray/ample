import { test, expect } from "@playwright/test";

test("homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Home/);
    await expect(
        page.getByRole("heading", { name: "Newest Albums" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "Artist Mixes" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "Recently Played" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "Random Albums" }),
    ).toBeVisible();
});

test("advanced search", async ({ page }) => {
    await page.goto("/#/search");
    await expect(page).toHaveTitle(/Advanced Search/);
    await expect(
        page.getByRole("heading", { name: "Advanced Search" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
});

test("artists", async ({ page }) => {
    await page.goto("/#/artists");
    await expect(page).toHaveTitle(/Artists/);
    await expect(page.getByRole("heading", { name: "Artists" })).toBeVisible();
});

test("album artists", async ({ page }) => {
    await page.goto("/#/album-artists");
    await expect(page).toHaveTitle(/Album Artists/);
    await expect(
        page.getByRole("heading", { name: "Album Artists" }),
    ).toBeVisible();
});

test("albums", async ({ page }) => {
    await page.goto("/#/albums");
    await expect(page).toHaveTitle(/Albums/);
    await expect(page.getByRole("heading", { name: "Albums" })).toBeVisible();
});

test("genres", async ({ page }) => {
    await page.goto("/#/genres");
    await expect(page).toHaveTitle(/Genres/);
    await expect(page.getByRole("heading", { name: "Genres" })).toBeVisible();
});

test("playlists", async ({ page }) => {
    await page.goto("/#/playlists");
    await expect(page).toHaveTitle(/Playlists/);
    await expect(
        page.getByRole("heading", { name: "Playlists" }),
    ).toBeVisible();
});

test("smartlists", async ({ page }) => {
    await page.goto("/#/smartlists");
    await expect(page).toHaveTitle(/Smartlists/);
    await expect(
        page.getByRole("heading", { name: "Smartlists" }),
    ).toBeVisible();
});

test("shares", async ({ page }) => {
    await page.goto("/#/shares");
    await expect(page).toHaveTitle(/Shares/);
    await expect(page.getByRole("heading", { name: "Shares" })).toBeVisible();
});

test("favorites", async ({ page }) => {
    await page.goto("/#/favorites");
    await expect(page).toHaveTitle(/Favorites/);
    await expect(
        page.getByRole("heading", { name: "Favorites" }),
    ).toBeVisible();
});

test("trending", async ({ page }) => {
    await page.goto("/#/trending");
    await expect(page).toHaveTitle(/Trending/);
    await expect(page.getByRole("heading", { name: "Trending" })).toBeVisible();
});

test("top rated", async ({ page }) => {
    await page.goto("/#/top-rated");
    await expect(page).toHaveTitle(/Top Rated/);
    await expect(
        page.getByRole("heading", { name: "Top Rated" }),
    ).toBeVisible();
});

test("forgotten", async ({ page }) => {
    await page.goto("/#/forgotten");
    await expect(page).toHaveTitle(/Forgotten/);
    await expect(
        page.getByRole("heading", { name: "Forgotten" }),
    ).toBeVisible();
});

test("random", async ({ page }) => {
    await page.goto("/#/random");
    await expect(page).toHaveTitle(/Random/);
    await expect(page.getByRole("heading", { name: "Random" })).toBeVisible();
});

test("unrated", async ({ page }) => {
    await page.goto("/#/unrated");
    await expect(page).toHaveTitle(/Unrated/);
    await expect(page.getByRole("heading", { name: "Unrated" })).toBeVisible();
});

test("newest", async ({ page }) => {
    await page.goto("/#/newest");
    await expect(page).toHaveTitle(/Newest/);
    await expect(page.getByRole("heading", { name: "Newest" })).toBeVisible();
});
