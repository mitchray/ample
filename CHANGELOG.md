# Changelog

## [0.40.1] - 2022-08-01
### Fixed
- Rolled back Svelte version as Quick Search became glitchy

## [0.40.0] - 2022-08-01
### Requires at least Ampache 5.4.1

### Added
- Lyrics panel, supporting timestamped lyrics if present. New button near the volume slider.
  - Notification for missing lyrics
  - Notification for lyrics present, but not timestamped
- Use quotation marks in Quick Search to perform an exact search, e.g. "Rain" will not show results like *Brain* or *Acid Rain*
- "Fancy" search from Quick Search, to narrow down results. One or more of *artist*, *album* or *title/song*
  - e.g. *artist:trivium album:dragon*
  - If *song* or *title* is present at all, search results will be for songs. E.g. artist:trivium song:fire
  - Otherwise if *album* is present, search results will be for albums. E.g. artist:trivium album:dragon
  - Finally, if only *artist* is present, search results will be for artists. E.g. artist:trivium

### Changed
- Notifications are all disabled by default now
- Releases featuring an artist (but not by that artist) are separated from that artists releases, denoted by " (appearance)" in the release type

### Fixed
- Favicon should be back now

## [0.39.0] - 2022-05-26
### Added
- Notification system! (enabled by default, specific types can be disabled Notifications > Settings)

### Changed
- Advanced search fields are now responsive

### Fixed
- Waveform colours weren't updating after browser back/forward
- Cross-origin playback from the demo server
- Support Ampache installations which are in a subdirectory (e.g. yoursite.com/ampache)

## [0.38.0] - 2022-05-22
### Added
- Save Lister limits for each type (Artist/Album/Song etc)
- Find alternate versions of currently playing song (instead of exact title matching)

### Changed
- Don't clear queue when end of list is reached and repeat is not enabled
- Remove lister table striping (seeing if I miss it)
- Moved Smartlist refresh button out of the playlist name

### Fixed
- Songs less than 1 minute were missing the leading zero (e.g. :43)
- Some items were causing layout shifts while loading
- Pull the latest metadata for currently playing song to make sure ratings etc are in sync
- Attempt to play next song in queue if there is an error loading

## [0.37.0] - 2022-05-18
### Added
- Dynamic style for genre cards

### Changed
- Changed genre page to use tabs, instead of Artists/Albums/Songs being separate pages

### Fixed
- Lister background color glitched sometimes when switching from List to Grid

## [0.36.0] - 2022-05-15
### Added
- Remember Lister column selections
- Option to View Lister in grid layout
- Genre pagination
- Genre grid layout
- Play songs from genre (based on artist genre)

## [0.35.0] - 2022-05-13
### Recommend clearing browser cache after install to get latest CSS changes

### Added
- Sticky columns in Lister will have a 'hovered' style when covering other columns
- Save volume setting

### Changed
- Going back to Roboto font, but the fancy variable version this time
- Reorganised most page layouts into a tab format; showing more items by default
- Tabs are loaded on demand, which should improve performance
- Moved "Unrated > Mass Assign" to its own "Multi-rater" page
- Changed "Favorites" order in sidebar as the following pages all have the same layout

### Fixed
- Checkbox would squish when Lister is overflowing
- Sidebar mini mode scrolls now on small screens (hover labels disabled for now)
- Album card images would collapse during load

## [0.34.0] - 2022-04-27
### Requires at least Ampache 5.3.1

### Added
- Ability to toggle lister columns (resets each time but will save in future release)
- New lister columns
  - Songs: Plays, Quality, Size
  - Albums: Length, Type
  - Artists: Length
- Advanced search updates
  - "My Rating (song)" for albums and artists
  - "My Rating (album)" for artists
  - "Song Count" for albums and artists
  - "Album Count" for artists
  - "Song Artist" for albums
  - "Played by Me (Artist)" for albums
  - "Recently added" for albums
- A "Duplicates found" link will appear next to the search bar if the currently playing song matches another of the (exact) same title by that artist. Planning on expanding into other 'health checks'.

### Changed
- Unrated -> Mass Assign will show results automatically
- Date and number columns don't need to be resizable

### Fixed
- Close the search results if an image is clicked

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
