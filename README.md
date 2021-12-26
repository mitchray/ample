# Ample
A web browser music client for [Ampache](https://ampache.org/), built with [Svelte](https://svelte.dev/) & [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

<img src="https://user-images.githubusercontent.com/5735900/139383996-fe6bbefa-1153-4d05-81ee-69875ffbfb26.jpg" width=603 alt="Ample screenshot" />

## Features
- Available on the [wiki](https://github.com/mitchray/ample/wiki/Features)

## Requirements
- Ampache 5+
- A modern desktop web browser
- Apache for a small .htaccess URL rewrite, or [NGINX](https://github.com/mitchray/ample/wiki/NGINX-rewrite)

## Installing
- Prebuilt release: Copy the ```ample``` folder into your Ampache ```public``` folder, done!
- Git branch: I recommend creating a symbolic link within your Ampache public folder, otherwise if you have CORS configured on your server you can override the ```detectedURL``` in ```src/stores/server.js```

- To access the Ample client add ```/ample``` to your Ampache server address. e.g ```yourampache.com/ample```

## Developing
- Clone the Ample repository and from the ample directory ```cd ample```
- Install packages ```npm install```
- For development and hot reloading ```npm run dev```
- For building ```npm run build```

Additional console logging can be enabled by setting ```debugMode true``` in ```src/stores/server.js```

