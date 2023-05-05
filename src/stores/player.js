import { readable, writable, derived } from 'svelte/store';
import { SidebarIsOpen, SidebarIsPinned, QueueIsOpen, QueueIsPinned } from './status';
import Player from '../logic/player'

export let ampleVersion = readable("1.1.0");

export let MediaPlayer = writable(new Player);

export let SiteInnerBind = writable();
export let SiteContentBind = writable();
export let SiteSidebarBind = writable();
export let SiteQueueBind   = writable();

export let SiteMainSpace = derived(
    [
        SiteContentBind,
        SiteSidebarBind,
        SiteQueueBind,
        SidebarIsOpen,
        SidebarIsPinned,
        QueueIsOpen,
        QueueIsPinned
    ],
    ([
         $SiteContentBind,
         $SiteSidebarBind,
         $SiteQueueBind,
         $SidebarIsOpen,
         $SidebarIsPinned,
         $QueueIsOpen,
         $QueueIsPinned
     ]) => {
        let finalObject = {};

        if ($SiteContentBind && $SiteSidebarBind && $SiteQueueBind) {
            finalObject.ready = true;
        }

        if (finalObject.ready) {
            let sidebarLeftOffset = 0;
            let sidebarWidthOffset = 0;
            let queueWidthOffset = 0;

            if ($SidebarIsOpen) {
                sidebarLeftOffset += $SiteSidebarBind.clientWidth + 1; // account for 1px border
                sidebarWidthOffset += $SiteSidebarBind.clientWidth + 1; // account for 1px border
            }

            if ($SidebarIsPinned) {
                sidebarWidthOffset -= $SiteSidebarBind.clientWidth + 1; // account for 1px border
            }

            if ($QueueIsOpen) {
                queueWidthOffset += $SiteQueueBind.clientWidth + 1; // account for 1px border
            }

            if ($QueueIsPinned) {
                queueWidthOffset -= $SiteQueueBind.clientWidth + 1; // account for 1px border
            }

            finalObject.height = $SiteContentBind.clientHeight;
            finalObject.width  = $SiteContentBind.clientWidth - sidebarWidthOffset - queueWidthOffset;
            finalObject.top    = $SiteContentBind.getBoundingClientRect().top;
            finalObject.left   = sidebarLeftOffset;
        }

        return finalObject;
    }
)
