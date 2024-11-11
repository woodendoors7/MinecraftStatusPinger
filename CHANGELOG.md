# Changelog!


<h2>v1.2.0</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.2.0)

- ⚙️ Changed `disableSrv` and `disableJSONParse` to `SRVLookup` and `JSONParse` respectively, changing their default values to true. 
- ⚙️ Bumped the default protocol version from `764` (1.20.2) to `767` (1.21.1)
- 🛠️ Changed uncompiled `.js` imports to `.ts`, making it work with Deno.
- 🛠️ Added jsr.json file
- 🛠️ Fixed SRV lookups not being prevented when port wasn't set 25565/was an IP
- ➖ Removed (previously disfunctional) soft block on localhost addresses when looking up SRV. Code will initiate a SRV lookup with any localhost address, unless disabled with `SRVLookup`.
 
<h2>v1.1.5</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.5)

- 🛠️ Fixed latency being returned as `null` instead of zero.


<h2>v1.1.4</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.4)

- 🟢 Added lookup option `protocolVersion` to send requests as different Minecraft versions.

<h2>v1.1.3</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.3)

- 🛠️ Fixed  [Issue #1](https://github.com/woodendoors7/MinecraftStatusPinger/issues/1) of not being able to catch errors, by rejecting network errors instead of throwing them. 

<h2>v1.1.2</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.2)

- 🛠️ Changed imports to prefix with `node:` so this package can be used with [Deno](https://deno.com/). 
- ⚙️ Standardized quotes from single quotes to double quotes.

<h2>v1.1.1</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.1)

- 🛠️ Fixed a bug which prevented users from `.catch`-ing errors thrown from the `.lookup` function. Any errors that cannot be caught in minecraftstatuspinger should be reported to [issues](https://github.com/woodendoors7/MinecraftStatusPinger/issues).

- 🛠️ Fixed a bug where the custom DNS lookup wouldn't properly deliver the DNS data to the `createConnection` socket, resulting from `createConnection` asking for either all IPs (array) or just the first one (object) which I needed to return differently.

<h2>v1.1.0</h2>

[NPM](https://www.npmjs.com/package/minecraftstatuspinger/v/1.1.0)

 - 🟢 Added lookup option `disableJSONParse` to completely skip parsing JSON.
 - ⚙️ Renamed primary lookup option `hostname` to `host`, `hostname` stays as an alias.

[all versions](https://www.npmjs.com/package/minecraftstatuspinger?activeTab=versions)
