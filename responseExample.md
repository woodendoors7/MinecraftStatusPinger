# Minecraft server status response example
These are some examples of what a Minecraft server can respond with, if you request if you ping it. There are various variations due to changes in Minecraft's code over the years.

**Example 1:** Hypixel
* Version is any from 1.8 - 1.20, represented by the / wildcard.
```json
{
    "version": {
        "name": "Requires MC 1.8 / 1.20",
        "protocol": 762
    },
    "players": {
        "max": 100,
        "online": 5,
        "sample": []
    },
    "description": "§aHypixel Network §c[1.8-1.20]\n" +
      "§6§lDOUBLE COINS + EXP §7- §e§lSUMMER EVENT",
    "favicon": "data:image/png;base64,<data>",
}
```

**Example 2:**

* Version is now only one, 1.19.4
* Includes a sample of players on the server.
* Description is now an object, and the actual description is in "text".
* Includes two new properties about chat moderation.
```json
{
    "version": {
        "name": "1.19.4",
        "protocol": 762
    },
    "players": {
        "max": 100,
        "online": 5,
        "sample": [
            {
                "name": "woodendoors7",
                "id": "220cb038-b54c-423e-9d12-b845f64dee70"
            }
        ]
    },
    "description": {
        "text": "Hello world"
    },
    "favicon": "data:image/png;base64,<data>",
    "enforcesSecureChat": true,
    "previewsChat": true
}
```

**Example 3:**
* Now, instead of a single version, it lists the name of a proxy, and multiple versions that are wildcarded with an x, which is valid, and parsed my Minecraft.
* No sample of players is provided.
* The styling of the motd is now defined as an array of objects, instead of with $.
* no enforcesSecureChat and previewChats is defined, since this is an older version of a server.
```json
{
    "version": {
        "name": "Waterfall 1.8.x, 1.9.x, 1.10.x, 1.11.x, 1.12.x, 1.13.x, 1.14.x, 1.15.x, 1.16.x, 1.17.x, 1.18.x",
        "protocol": 762
    },
    "players": {
        "max": 100,
        "online": 5
    },
    "description": {
        "text": "",
        "extra": [ { "color": "dark_blue", "text": "This is a cool MOTD!" }]
    },
    "favicon": "data:image/png;base64,<data>",
    "enforcesSecureChat": true,
    "previewsChat": true
}
```