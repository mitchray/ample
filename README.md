## *Ample*: A simple web browser client for [Ampache](https://ampache.org/) 
Built with [Svelte](https://svelte.dev/) & [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

<img src="https://user-images.githubusercontent.com/5735900/210019624-4e60d4b4-624c-42bb-ab45-1c3d244e66a6.jpg" width=800 alt="Ample screenshot" />

## Demo
[View demo](https://demo.ampache.dev/ample/) (might not be the latest version)
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
  - Alternate song versions (acoustic, live, demo etc)
  - Missing volume gain tags
  - Missing song rating
  - Missing/untimestamped song lyrics
- Same powerful Advanced Search as Ampache
- Compare an artist's collection with MusicBrainz recordings (if the artist has an MBID associated with it)
- Skip songs below a specified rating when adding to queue
- 'Unrated' dashboard + Multi-rater
- Search albums by date range

## Requirements
- Ampache 5+
- A modern web browser (Chrome/Edge 88+, Firefox 78+, Safari 14+)
- Apache for a small .htaccess URL rewrite, or [NGINX](https://github.com/mitchray/ample/wiki/NGINX-rewrite)

## Installing
- Either grab a prebuilt [release](https://github.com/mitchray/ample/releases)
  - Copy the ```ample``` folder into your Ampache ```public``` folder (or just the Ampache directory if using the 'squashed' version)
  - Done!
- or build from Git repository (see Developing)

## Accessing
- Add ```/ample``` to your Ampache server address. e.g ```yourampache.com/ample``` or ```localhost/ampache/ample```

## Developing
- Clone the Ample repository and from the ample directory ```cd ample```
- Install packages ```npm install```
- Change the ```DEV detectedURL``` in ```src/stores/server.js``` to your desired Ampache server
- For development and hot reloading ```npm run dev```
- For building ```npm run build```

Additional console logging can be enabled by setting ```debugMode true``` in ```src/stores/server.js```
