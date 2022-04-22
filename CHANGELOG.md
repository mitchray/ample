# Changelog

## [0.33.0] - 2022-04-22
### Requires at least Ampache 5.2.1

Just catching up on updates from Ampache

### Added
- Album and artist objects for playlist and playlist_name in advanced search
- no_tag (genre) in advanced search

### Changed
- De-emphasised genre tags (didn't feel that the purple was working) 

## [0.32.0] - 2022-04-06
### Fixed
- Could not scroll queue using touch devices

### Changed
- Reorder queue items by dragging the cover art
- A few colour tweaks here and there

## [0.31.0] - 2022-01-23
### Fixed
- Lister column resize handles and checkboxes were not visible in dark mode

### Changed
- Updated layout for playlists

## [0.30.0] - 2022-01-21
### Changed
- New visual style for many items
- Overhauled color system

## [0.22.0] - 2021-12-27
### Added
- Basic media keys ([mediasession](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)) support in [browsers which have it](https://caniuse.com/mdn-api_mediasession)

### Changed
- Album actions (play, shuffle etc) now always visible instead of revealed on hover
- Album/artist images are now links

## [0.21.0] - 2021-12-03
### Changed
- Search results won't show categories with zero results
- Revised table display
    - Predefined column widths instead of autofit (still resizable), with horizontal scrolling
    - Name and actions (play, shuffle etc) always visible
    - Larger artwork
    - Double-click any column resizer bar to reset all columns to default widths
    
### Removed
- Virtual tables (where only visible rows are present in the DOM)

## [0.20.0] - 2021-11-23
### Changed
- Specify desired API version instead of getting it from handshake

## [0.19.0] - 2021-11-18
### Requires at least Ampache 5.1.1

Some big under the hood changes; should scale better with large collections

### Changed
- Paginate All Artists/Albums instead of preloading everything (the 5.1.1 requirement )
- Light/dark mode toggle now available on login; and removed motion effect from login page
- Theme improvements, many for light mode specifically

### Fixed
- Albums by date was not displaying properly

### Removed
- Sidebar slideout with all artists/albums; not happy with the performance due to needing all items to be loaded, but might return one day

## [0.18.0] - 2021-11-03
### Added
- Fade out on manual pause/next/previous; fade in on manual resume

### Fixed
- Wrap genres list when many exist
- Escape the MusicBrainz Compare regex input
- Queue wasn't being cleared properly, causing duplicate waveforms

## [0.17.0] - 2021-11-01
### Added
- Recently Played on homepage will auto-refresh once song changes
- Unrated->Mass Assign now has unrated song options preset

### Fixed
- Albums/artists not loading

## [0.16.0] - 2021-10-29
### Added
- Toggle to switch between slim and expanded sidebar modes
- Added an interface header to house the search field and miscellanea from sidebar

### Changed
- Moved queue list into a dedicated panel which can be hidden
- "Clear all" button will leave currently playing song if others exist, click again to remove it
- Clicking "Now Playing" will take you to currently playing song, instead of having a separate dedicated button

## [0.15.0] - 2021-10-26
### Added
- Show seekbar current time on hover

### Changed
- Tighter display of cards

### Removed
- Removed custom album/artist images, used improved core Ampache placeholder image instead

## [0.14.0] - 2021-10-09
### Fixed
- Improved performance of the seekbar (CSS transform instead of updating width)
- Queue item menus now hooked up to Actions component

### Changed
- Make player queue stand out against background

## [0.13.0] - 2021-10-04
### Fixed
- The current song indicator broke layout when song artist was shown

### Changed
- New visual style for album hover
- New images for artists/albums with no artwork
- Third party links for albums/artist now shown as a single menu

## [0.12.0] - 2021-09-24
### Fixed
- Date selector dimensions needed adjustment after new design
- Chrome/Webkit had a glitchy background in the player

### Added
- Currently playing song indicator in lists and album view

### Changed
- Lister component refactored for easier updates going forward
- Lister table columns can now be resized
- Cleaner design of lister

## [0.11.0] - 2021-09-09
### Changed
- Styling for form/input elements
- Adjust categories of some optgroups in advanced search
- Show average ratings after heart icon to maintain alignment

## [0.10.0] - 2021-09-03
### Added
- Toggleable option to skip songs below a specified rating when playing/adding to queue
- Added an 'Ampache' option to the album/artist data menu, to open items in Ampache

### Changed
- Users, catalogs, playlists & smartlists dropdowns in advanced search use live data instead of placeholders

## [0.9.0] - 2021-08-31
### Added
- Add advanced search link to sidebar

### Changed
- Mass assign ratings (Insights > Unrated > Mass assign) now uses the advanced search to find items

## [0.8.0] - 2021-08-29
- Initial public release
