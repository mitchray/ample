import { test as setup, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "auth.json");

setup("authenticate", async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto("/");
    await expect(page.getByTestId("sidebar-button")).not.toBeVisible();
    await page.getByRole("tab", { name: "apikey" }).click();
    await page.getByRole("textbox", { name: "apikey_input" }).click();
    await page.keyboard.type(process.env.E2E_AMPACHE_APIKEY);
    await page.getByTestId("apikey_login").click();
    await expect(page.getByTestId("sidebar")).toBeVisible();

    await page.context().storageState({ path: authFile });
});
