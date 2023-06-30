## *Ample*: A simple music client for [Ampache](https://ampache.org/) 
Built with [Svelte](https://svelte.dev/) & [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

<img src="https://github.com/mitchray/ample/assets/5735900/e2564e30-d7af-4fc8-b2e1-bbff93a3356e" width=800 alt="Ample screenshot" />

## Setting expectations
- No more features are being added, in order to focus on the next generation of Ampache 💪
- Largely untested with multiple users
- Transcoding is untested as I don't use it
- It is designed to be a front-end companion to an existing Ampache server, not a complete replacement

## Demo
[View demo](https://demo.ampache.dev/ample/)
- User ```demo``` 
- Password ```demodemo```

## Features
- Smartlist autoplay when nearing end of the queue
- Dark & light mode with adaptive interface colors
- Fade out/in on pause/resume/next/previous
- Media keys support
- Volume normalization (ReplayGain & EBU R128)
- Night/headphone mode to boost quieter parts of songs
- Toggleable notifications for
  - Alternate song versions (radio edit, acoustic, live, demo etc)
  - Missing volume gain tags
  - Missing song rating
  - Missing/untimestamped song lyrics
- Same powerful Advanced Search as Ampache
- Compare an artist's collection with MusicBrainz recordings (if the artist has an MBID associated with it)
- Skip songs below a specified rating when adding to queue
- 'Unrated' dashboard + Multi-rater

## Translations
Edit or add new languages via [Inlang](https://inlang.com/editor/github.com/mitchray/ample)

## Requirements
- [Ampache](https://ampache.org/) 6+
- A modern web browser (Chrome/Edge 88+, Firefox 78+, Safari 14+)

## Installing
- Easy mode (recommended)
  - Grab a prebuilt [release](https://github.com/mitchray/ample/releases)
  - Copy the ```ample``` folder into your Ampache server ```public``` folder
  - Access by adding ```/ample``` to your Ampache server address e.g. ```yourampache.com/ample``` or ```localhost/ampache/ample```
- Hard mode
  - Grab a prebuilt [release](https://github.com/mitchray/ample/releases) or build yourself from Git repository (see Developing)
  - Put it anywhere you like, but you will have to deal with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin) if it is on a different domain/subdomain from the Ampache server you are connecting to.
- Enter the URL of the Ampache server you wish to connect to on the login screen 
  - Alternatively add the URL to ```ample.json``` to hardcode it (rename ```ample.json.dist``` & use the full URL with no trailing slash i.e. ```https://yourampache.com```)

## Developing
- Clone the Ample repository and from the ample directory ```cd ample```
- Install packages ```npm install```
- For development and hot reloading ```npm run dev```
- For building ```npm run build```, and see the contents of ```dist```

Additional console logging can be enabled by setting ```debugMode true``` in ```src/stores/server.js```