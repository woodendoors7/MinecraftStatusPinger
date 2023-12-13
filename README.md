

<div align="center">
  <img src="https://papers.floppa.hair/mcstatuspinger/mcblock.png" alt="big MinecraftStatusPinger logo" width="600" border="0px"/>
</div>
<h3><code style="color: yellowgreen">A modern, small, fast, performant, zero dependency TypeScript library made for pinging and getting status of Minecraft servers.</code></h3>

<hr>

### What can this be used for?

- Getting server **Latency (ping)**
- Getting server **MOTD**
- Downloading server **Thumbnail (favicon)**
- Viewing Server **Version**
- Fetching **Player Count** and **Playerlist**

**And in general, checking the status of Minecraft servers!**
## Getting started
### Requirements
- NodeJS or Deno (used to run JavaScript code)
- NPM (used to install Node packages)

### Installation
```bat
npm install minecraftstatuspinger
```

### Basic Example
```typescript
import mc from "minecraftstatuspinger";

let result = await mc.lookup({ host: "mc.hypixel.net" })
console.log(result);
```

<details>
<summary><h3>Advanced Example</h3></summary>
<br>

```typescript
import mc from "minecraftstatuspinger";

let result = await mc.lookup({
    host: "mc.hypixel.net",
    port: 25565,
    ping: true,
    protocolVersion: 764,
    timeout: 10000,
    throwOnParseError: true,
    disableSRV: false,
    disableJSONParse: false
})

console.log(result);
```

</details>

## Docs

<img src="https://papers.floppa.hair/mcstatuspinger/pleasestar.png" alt="emoji holding a heart, pleading to star the repository" width="350">

* <b id="lookupOptions">.lookup(): </b>*`((options: ServerStatusOptions) => Promise<ServerStatus>)`*
  * **options:** ServerStatusOptions
    * <b>`host:`</b> string
      > Either an IP, or a hostname of the server. (alias: hostname)
    * <b>`port?:`</b> number <i> `default: 25565`</i>
      > Port of the server. SRV lookup is disabled when using ports other than 25565.
    * <b>`timeout?:`</b> number <i>`default: 10000`</i>
      > How long until an error is thrown if the transaction still hasn't finished. Default is 10 seconds.
    * <b>`ping?:`</b> boolean <i>`default: true`</i>
      > Whether to send a payload at the end to measure the server latency. If false, the `latency` field will be null.
    * <b>`protocolVersion?:`</b> number <i>`default: 764`</i>
      > Protocol version to send to the server to simulate different Minecraft client versions. Here, you can see the [Protocol Version Numbers](https://wiki.vg/Protocol_version_numbers). The current default protocol version is for 1.20.2 (764) and will be irregularly updated to newer versions.
    * <b>`throwOnParseError?:`</b> boolean <i>`default: true`</i>
      > Whether to throw an error if the status packet fails to parse the status field. The `statusRaw` field is always included.
    * <b>`disableSrv?:`</b> boolean <i>`default: false`</i>
      > Whether to force skip SRV lookups. Useful when only pinging IP addresses and not hostnames (domains).
    * <b>`disableJSONParse?:`</b> boolean <i>`default: false`</i>
      > Whether to skip JSON parsing. Useful if you only want a raw plaintext response. If true, the `status` field will be undefined.
  * ServerStatus
    * <b>`latency?:`</b> number
      > The time it takes to receive back a response after sending a small payload to a server, in milliseconds. Will be null if the `ping` option is false.
    * <b>`status?:`</b> DynamicObject
      > Parsed status response from the server. Will be null if the status fails to parse, or if disableJSONParse is true. <a href="https://pinger.floppa.hair/responses/">Example of a valid Status Response.</a>
    * <b>`statusRaw:`</b> string
      > Plaintext status response in the form of JSON. Useful when `status` fails to parse.

* <b id="setDnsOptions">.setDnsServers(): `((serverArray: string[]) => Promise<boolean>)`</b>
  > It wraps the `dns.setServers` function, useful for looking up SRV records through different DNS servers. <br>
    The first IP in the array will always be used first, others will be tried if the first one is unreachable. <br><br>
    Accepts an array of hostnames or IP addresses of DNS servers. It will either return true, or throw an error. 
  
  
  Usage:
  ```js
    // For example:
    mc.setDnsServers(["9.9.9.9", "1.1.1.1", "8.8.8.8"])
    // (Quad9, Cloudflare, Google)
    // Cloudflare is usually the fastest for DNS queries.
  ```
  If you never changed the DNS settings of your computer, the default DNS server will be your ISP's.<br>
  <code style="color : darkorange">❗ I recommend changing your default DNS servers if you're doing thousands of lookups, such as for mass scanning.</code><br>

### Changelog
  
   **[View Changelog](https://pinger.floppa.hair/changelog/)**,
  Latest version: <b><i><code>v1.1.5</code></i></b>



### Contact

If you have some questions, you can message me through Discord - **woodendoors7**

### Acknowledgements

[TINY Readme](https://gist.github.com/noperator/4eba8fae61a23dc6cb1fa8fbb9122d45)


### To-do

- [x] Do SRV lookups
- [ ] Support versions less than 1.7.
- [ ] Support Bedrock


### License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
