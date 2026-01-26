## _Ample_: A web browser client for [Ampache](https://ampache.org/) v6+

> [!WARNING]
> Main branch frozen while v4 rewrite is underway

Note: This is a personal project, shared as-is in case it’s useful to others. I’m not actively supporting feature requests or troubleshooting issues, but I’ll consider minor pull requests.

<img src="https://github.com/mitchray/ample/assets/5735900/194c98a2-db2b-4f6c-be3b-92c80342436a" width=800 alt="Ample screenshot" />

## Demo

[View demo](https://ample-player.vercel.app)

## Installing

1. Download Ample
    - Either from a prebuilt [release](https://github.com/mitchray/ample/releases)
    - or compile yourself from Git repository (see [Developing](#developing))
2. Place it anywhere on your server
    - Even on a different server from Ampache, just be mindful that the remote Ampache server will need [configuring](<https://github.com/mitchray/ample/wiki/Connecting-to-a-remote-Ampache-server-(CORS)>)
3. Set up the [config file](#config-file)

## Translations

Edit or add new languages via [Inlang Fink](https://inlang.com/editor/github.com/mitchray/ample)

## Config file

Save as `config/ample.json`, must be valid JSON (i.e. no trailing comma on the last item)

| Key             | Type     | Description                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------- |
| ampacheURL      | Required | Full URL to the Ampache server                                                      |
| guestUserAPIKey | Optional | Login with this user's API key (use lowest Guest level permissions, this is public) |
| loginMessage    | Optional | Will be displayed on the login screen                                               |
| logo            | Optional | Use custom image on the login screen (full URL or relative path to Ample folder)    |

Example

```
{
  "ampacheURL": "https://example.com",
  "guestUserAPIKey": "123456789",
  "loginMessage": "There's no place like 127.0.0.1",
  "logo": "./config/logo.svg"
}
```

## Developing

-   Clone the Ample repository and from the ample directory `cd ample`
-   Install packages `npm install`
-   For development and hot reloading `npm run dev`
-   For building `npm run build`, and see the contents of `dist`

Additional console logging can be enabled by setting `debugMode true` in `src/stores/state.js`
