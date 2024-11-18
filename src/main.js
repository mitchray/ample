import App from "./App.svelte";
import { mount } from "svelte";

let app = mount(App, {
    target: document.getElementById("app"),
});

export default app;
