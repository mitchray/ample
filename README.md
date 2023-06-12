## *Ample*: A simple music client for [Ampache](https://ampache.org/) 
Built with [Svelte](https://svelte.dev/) & [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

<img src="https://github.com/mitchray/ample/assets/5735900/e2564e30-d7af-4fc8-b2e1-bbff93a3356e" width=800 alt="Ample screenshot" />

## Setting expectations
- Ample is made for my own requirements, but have shared it publicly in case others also find it useful. That means:
  - I'm the sole user of my Ampache server, so it's largely untested with multiple users
  - Transcoding is untested as I don't use it
  - It is designed to be a zero-config drop-in companion to Ampache, not a complete replacement
- It is feature complete as of v2; energy will be focused on expanding the Ampache API for future clients

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

## Requirements
- [Ampache](https://ampache.org/) 6+
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
