# Ample
A web browser music client for [Ampache](https://ampache.org/), built with [Svelte](https://svelte.dev/) & [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

<img src="https://user-images.githubusercontent.com/5735900/131240725-3287abc0-2d49-4e10-b8f9-42d082355f6c.jpg" height=353 alt="Ample screenshot" />

## Features
#### MusicBrainz Compare
- Compare artist tracks with [MusicBrainz](https://musicbrainz.org/) recordings, if the MBID tag is present

#### Smartlist autoplay
- If enabled, the queue will be topped up with additional songs from the selected smartlist 

#### Dark & light mode with adaptive interface colors
- Artist & album images influence the colors of the interface

#### Volume normalization & night mode
- Will apply any ReplayGain or EBU R 128 gain if tags are present
- Night mode boosts quieter parts of songs

#### Search albums by date range

#### 'Unrated' dashboard + mass assign
- Chip away at critiquing your library with a random selection of unrated artists, albums and songs

## Requirements
- ECMAScript 2015 (ES6) capable web browser
- Ampache 5+
- Apache for a small .htaccess URL rewrite, or BYO nginx/alternative equivalent (share if you do!)

## Installing
If using a pre-built release, copy the ```ample``` folder into your Ampache ```public``` folder, done!

If using a development build, I recommend creating a symbolic link within your Ampache public folder, otherwise if you have CORS configured on your server you can override the ```detectedURL``` in ```src/stores/server.js```

- To access the Ample client add ```/ample``` to your Ampache server address. e.g ```yourampache.com/ample```

## Developing
- Clone the Ample repository and from the ample directory ```cd ample```
- Install packages ```npm install```
- For development and hot reloading ```npm run dev```
- For building ```npm run build```

Additional console logging can be enabled by setting ```debugMode true``` in ```src/stores/server.js```

