import Root from "./Root.svelte";
import { mount } from "svelte";

let app = mount(Root, {
    target: document.getElementById("app"),
});

export default app;
