# Changelog

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
