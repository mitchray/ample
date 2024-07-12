## _Ample_: A web browser client for [Ampache](https://ampache.org/) v6+

<img src="https://github.com/mitchray/ample/assets/5735900/194c98a2-db2b-4f6c-be3b-92c80342436a" width=800 alt="Ample screenshot" />

## Demo

[View demo](https://ample-player.vercel.app)

## Installing

1. Download Ample
   - Either from a prebuilt [release](https://github.com/mitchray/ample/releases)
   - or compile yourself from Git repository (see [Developing](#developing))
2. Place it anywhere on your server
   - If you want to keep it close to your Ampache install, copy the `ample` folder into your Ampache `public` folder, then you can access by adding `/ample` to your Ampache server address e.g. `yourampache.com/ample`
   - Otherwise, you can put it anywhere you like (even on a different server from Ampache, just be mindful that the remote Ampache server will need [configuring](https://github.com/mitchray/ample/wiki/Connecting-to-a-remote-Ampache-server-(CORS))
3. Set up the [config file](#config-file)

## Translations

Edit or add new languages via [Inlang Fink](https://inlang.com/editor/github.com/mitchray/ample)

## Config file

| Key             | Description                                                                         |
|-----------------|-------------------------------------------------------------------------------------|
| ampacheURL      | Full URL to the Ampache server                                                      |
| guestUserAPIKey | Login with this user's API key (use lowest Guest level permissions, this is public) |
| loginMessage    | Will be displayed on the login screen                                               |
| logo            | Use custom image on the login screen (full URL or relative path to Ample folder)    |

Example
```
{
  "ampacheURL": "https://example.com", 
  "guestUserAPIKey": "123456789", 
  "loginMessage": "There's no place like 127.0.0.1", 
  "logo": "./config/logo.svg", 
}
```

## Developing

- Clone the Ample repository and from the ample directory `cd ample`
- Install packages `npm install`
- For development and hot reloading `npm run dev`
- For building `npm run build`, and see the contents of `dist`

Additional console logging can be enabled by setting `debugMode true` in `src/stores/state.js`