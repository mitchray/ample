import { test, expect } from "@playwright/test";

test("is logged in", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home/);
});

test("sidebar toggles", async ({ page }) => {
    await page.goto("/");

    let artistsLink = page.getByRole("link", {
        name: "person_outline Artists",
    });
    let libraryHeading = page.getByText("library_music");

    await expect(artistsLink).not.toBeVisible();
    await libraryHeading.click();
    await expect(artistsLink).toBeVisible();
    await libraryHeading.click();
    await expect(artistsLink).not.toBeVisible();
});

test("queue toggles", async ({ page }) => {
    await page.goto("/");

    let heading = page.getByRole("heading", { name: "Queue" });
    let button = page.locator("#queue-button");

    await expect(heading).toBeVisible();
    await button.click();
    await expect(heading).not.toBeVisible();
    await button.click();
    await expect(heading).toBeVisible();
});
