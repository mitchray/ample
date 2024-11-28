import { test, expect } from "@playwright/test";

test("is logged in", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home/);
});
