[![GitHub Link badge](https://badgen.net/badge/icon/GitHub?icon=github&label&color=010409)](https://github.com/woodendoors7/minecraftstatuspinger)
[![NPM link badge](https://badgen.net/badge/icon/NPM?icon=JS&label&color=a00a0b)](https://www.npmjs.com/package/minecraftstatuspinger)
[![JSR link badge](https://badgen.net/badge/color/JSR/?label=&color=d2a404)](https://jsr.io/@minecraft/minecraftstatuspinger)
[![Web link badge](https://badgen.net/badge/icon/Web?icon=JS&label)](https://pinger.floppa.hair)


<div align="center">
  <img src="https://papers.floppa.hair/mcstatuspinger/mcblock.png" alt="big MinecraftStatusPinger logo" width="600" border="0px"/>
</div>
<h3><code style="color: yellowgreen">A modern, small, fast, performant, zero dependency TypeScript library made for pinging and getting status of Minecraft servers.</code></h3>

<hr>

![NPM Version](https://badgen.net/npm/v/minecraftstatuspinger)
![TS Types](https://badgen.net/npm/types/minecraftstatuspinger)
![License](https://badgen.net/npm/license/minecraftstatuspinger)
![NPM Downloads](https://badgen.net/npm/dy/minecraftstatuspinger/?color=00a600)
![Maintained?](https://badgen.net/static/Maintained%3F/Yes!/00a600)

### What can this be used for?

- Getting server **Latency (ping)**
- Getting server **MOTD**
- Downloading server **Thumbnail (favicon)**
- Viewing Server **Version**
- Fetching **Player Count** and **Playerlist**

**And in general, checking the status of Minecraft servers!**
## Getting started
### Requirements
- NodeJS, Deno or Bun (used to run JavaScript code)
- NPM/JSR (used to install JavaScript packages)

### Installation
```bat
npm install minecraftstatuspinger
```

### Basic Example
```typescript
import mc from "minecraftstatuspinger";

let result = await mc.lookup({ host: "mc.hypixel.net" });
console.log(result);
``` 

<details open>
<summary><h3>Advanced Example</h3></summary>

```typescript
import mc from "minecraftstatuspinger";
//OR
const mc = require("minecraftstatuspinger");

let result = await mc.lookup({
    host: "mc.hypixel.net",  // A hostname, or an IP of your server. 
    port: 25565,             // Port of the server.
    ping: true,              // Whether to get the latency of the server, or skip that part.
    protocolVersion: 769,    // Minecraft version - 769 is 1.21.4
    timeout: 10000,          // Time in milliseconds to wait for a response before throwing an error.
    throwOnParseError: true, // Whether to throw an error if parsing of the status response fails.
    SRVLookup: true,         // Whether to do a SRV lookup before doing a normal lookup.
    JSONParse: true          // Whether to skip parsing the JSON response entirely.
});

console.log(result);
```

</details>

## Docs

<img src="https://papers.floppa.hair/mcstatuspinger/pleasestar.png" alt="emoji holding a heart, pleading to star the repository" width="350">

* <b id="lookupOptions">.lookup(): </b>*`((options: ServerStatusOptions) => Promise<ServerStatus>)`*
  * **options:** ServerStatusOptions
    * <b>`host:`</b> string
      > An IP address or hostname of the server. (alias: hostname)
    * <b>`port?:`</b> number <i> `default: 25565`</i>
      > Port of the server. SRV lookup is disabled when using ports other than 25565.
    * <b>`timeout?:`</b> number <i>`default: 10000`</i>
      > The time (in milliseconds) to wait for a response before throwing an error if the transaction isn’t completed. (Default: 10 seconds)
    * <b>`ping?:`</b> boolean <i>`default: true`</i>
      > Whether to send a payload at the end to measure the server latency. If false, the `latency` field will be null.
    * <b>`protocolVersion?:`</b> number <i>`default: 769`</i>
      > The protocol version sent to the server to simulate different Minecraft client versions. Refer to the [Protocol Version Numbers](https://wiki.vg/Protocol_version_numbers) for details. It is recommended to set this explicitly, as it will be updated periodically through minor version bumps. The default is 769 (Minecraft 1.21.4).
    * <b>`throwOnParseError?:`</b> boolean <i>`default: true`</i>
      > If true, an error will be thrown when the the status field fails to parse. The raw status response is always provided in the `statusRaw` field.
    * <b>`SRVLookup?:`</b> boolean <i>`default: true`</i>
      > Whether to perform a SRV lookup on the provided hostname. Set to `false` to skip the lookup, which is useful when you're only looking for basic DNS records. It is automatically disabled when you define a port different from 25565.
    * <b>`JSONParse?:`</b> boolean <i>`default: true`</i>
      > Whether to parse the JSON `status` field. Useful to disable when you only need the raw plaintext response. If false, the `status` field will be null.
  * ServerStatus
    * <b>`latency?:`</b> number
      > The time it takes to receive back a response after sending a small payload to a server, in milliseconds. Will be null if the `ping` option is false.
    * <b>`status?:`</b> DynamicObject
      > Parsed status response from the server. This field will be null if parsing fails or if `JSONParse` is false. <a href="https://pinger.floppa.hair/responses/">Example of a valid Status Response.</a>
    * <b>`statusRaw:`</b> string
      > Plaintext status response in the form of JSON. Useful when `status` fails to parse.

* <b id="setDnsOptions">.setDnsServers(): `((serverArray: string[]) => Promise<boolean>)`</b>
  > Wraps the `dns.setServers` function, useful for quicker lookups through different DNS servers. <br>
    The first IP in the array will always be used first, others will be tried if the first one is unreachable. <br><br>
    Accepts an array of hostnames or IP addresses of DNS servers. It will either return true, or throw an error, otherwise, it uses the default DNS servers of your computer.<br><br>
    ❗ Changing the default DNS servers is recommended, if you're doing tons of lookups at once.
    
  

  Usage:
  ```js
    // For example:
    mc.setDnsServers(["9.9.9.9", "1.1.1.1", "8.8.8.8"])
    // (Quad9, Cloudflare, Google)
    // Note: Cloudflare is typically the fastest for DNS queries.
  ```


<hr>

### Changelog
  
   **[View Changelog](https://pinger.floppa.hair/changelog/)**,
  Latest version: <b><i><code>v1.2.2</code></i></b>



### Contact

If you have some questions, you can message me through Discord - **woodendoors7**

### Acknowledgements

[TINY Readme](https://gist.github.com/noperator/4eba8fae61a23dc6cb1fa8fbb9122d45)


### To-do
- [x] Do SRV lookups
- [ ] Parse MOTDs 
- [ ] Support versions less than 1.7. 
- [ ] Support Bedrock

(I plan to add these over summer!)

### License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
