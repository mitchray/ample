import { IsMobile, SidebarIsOpen } from "../stores/status.js";
import { get} from "svelte/store";

/**
 * Close sidebar
 */
export const closeSidebar = async () => {
    if (get(IsMobile)) {
        let status = false;
        localStorage.setItem('SidebarIsOpen', JSON.stringify(status));
        SidebarIsOpen.set(status);
    }
}