

<div align="center">
  <img src="https://papers.floppa.hair/mcstatuspinger/mcblock.png"  width="600" border="0px"/>
</div>

<h3><code style="color : yellowgreen">A modern, small, performant, zero dependency TypeScript library specifically made for fast pinging and status-getting of Minecraft servers. (1.7+)</code></h3>
<hr>


### Features

- Server Ping
- Server MOTD
- Server Thumbnail
- Server Version
- Player Count
- Player List


### Built with

- TypeScript
- Native libraries

## Getting started


### Installation

```bat
npm install minecraftstatuspinger
```

### Example
```typescript
import mc from "minecraftstatuspinger";

let result = await mc.lookup({ host: "mc.hypixel.net" })

console.log(result);
```

<details>
<summary><h4>Advanced example!</h4></summary>
<br>

```typescript
import mc from "minecraftstatuspinger";

let result = await mc.lookup({
    host: "mc.hypixel.net",
    port: 25565,
    ping: true,
    timeout: 10000,
    throwOnParseError: false,
    disableSRV: false,
    disableJSONParse: false
})

console.log(result);
```

</details>

## Docs

<img src="https://papers.floppa.hair/mcstatuspinger/pleasestar.png" width="350">

* <b id="lookupOptions">.lookup(): </b>*`((options: ServerStatusOptions) => Promise<ServerStatus>)`*
  * **options:** ServerStatusOptions
    * <b>`host:`</b> string
      > Either an IP, or a hostname of the server. (alias: hostname)
    * <b>`port?:`</b> number <i> `default: 25565`</i>
      > Port of the server. Any port other than 25565 disables SRV lookup.
    * <b>`timeout?:`</b> number <i>`default: 10000`</i>
      > Timeout of when an error is thrown after no response. Default is 10 seconds.
    * <b>`ping?:`</b> boolean <i>`default: true`</i>
      > Whether to send a payload at the end to get the latency of the server. If false, the `latency` field will be null.
    * <b>`throwOnParseError?:`</b> boolean <i>`default: true`</i>
      > Whether to throw an error if the status packet fails to parse the status field. The `statusRaw` field is always    included.
    * <b>`disableSrv?:`</b> boolean <i>`default: false`</i>
      > Whether to force skip SRV lookups. Useful when only pinging IP addresses and not hostnames.
    * <b>`disableJSONParse?:`</b> boolean <i>`default: false`</i>
      > Whether to skip JSON parsing. Useful if you only want the raw text response. If true, the `status` field to be undefined.
  * ServerStatus
    * <b>`latency?:`</b> number
      > The time it takes to send and receive a payload from the server. Will be null if `ping` option is false.
    * <b>`status?:`</b> DynamicObject
      > Parsed status response from the sever. Will be null if the status fails to parse, or if disableJSONParse is true. <a  href="https://github.com/woodendoors7/MinecraftStatusPinger/blob/main/responseExample.md">Example of a valid Status Response.</a>
    * <b>`statusRaw:`</b> string
      > Raw status response in the form of a string. Useful when `status` fails to parse.

* <b id="setDnsOptions">.setDnsServers(): `((serverArray: string[]) => Promise<boolean>)`</b>
  > It wraps the `dns.setServers` function, ueful when you want to look up the SRV records with different DNS servers. <br>
    The first IP in the array is always the main DNS server, others are backup servers. <br><br>
    Pass in a parameter which is an array of hostnames or IP addresses of DNS servers. It will either return true, or throw an error. 
  
  
  Usage:
  ```js
    // For example:
    mc.setDnsServers(["9.9.9.9", "1.1.1.1", "8.8.8.8"])
    // (Quad9, Cloudflare, Google)
    // Cloudflare is the fastest for DNS queries in most of the world.
  ```
  If you never changed the DNS settings of your computer, the default DNS server will be your ISP's.<br>
  <code style="color : darkorange">❗ I recommend changing your default DNS servers if you're doing thousands of lookups, for better performance.</code><br>

### Contact

If you have some questions, you can message me through Discord - woodendoors7

### Acknowledgements

[TINY Readme](https://gist.github.com/noperator/4eba8fae61a23dc6cb1fa8fbb9122d45)


### To-do

- [x] Do SRV lookups
- [ ] Support versions less than 1.7.
- [ ] Support Bedrock


### License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
