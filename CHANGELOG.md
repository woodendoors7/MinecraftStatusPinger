# Changelog!
[<h2>v1.1.1</h2>](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.1)
- 🛠️ Fixed a bug which prevented users from `.catch`-ing errors thrown from the `.lookup` function. Any errors that cannot be caught in minecraftstatuspinger should be reported to [issues](https://github.com/woodendoors7/MinecraftStatusPinger/issues).

- 🛠️ Fixed a bug where the custom DNS lookup wouldn't properly deliver the DNS data to the `createConnection` socket, resulting from `createConnection` asking for either all IPs (array) or just the first one (object) which I needed to return differently.

[<h2>v1.1.0</h2>](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.0)

 - 🟢 Added lookup option `disableJSONParse` to completely skip parsing JSON.
  - ⚙️ Renamed primary lookup option `hostname` to `host`, `hostname` stays as an alias.