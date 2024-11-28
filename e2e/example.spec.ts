import { test, expect } from "@playwright/test";

test("is logged in", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home/);
});

test('sidebar toggles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'person_outline Artists' })).not.toBeVisible();
    await page.getByText('library_music').click();
    await expect(page.getByRole('link', { name: 'person_outline Artists' })).toBeVisible();
    await page.getByText('library_music').click();
    await expect(page.getByRole('link', { name: 'person_outline Artists' })).not.toBeVisible();
  });