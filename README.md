



<div align="center">
  <img src="mcblock.png"  width="600" border="0px"/>
</div>


<h3>The best, small, very performant, zero dependency, TypeScript library specifically aimed for pinging Minecraft servers. (1.7+)</h3>
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

```bash
npm install minecraftstatuspinger
```

### Example
```typescript
import mc from "minecraftstatuspinger";

let result = await mc.lookup({
    hostname: "mc.hypixel.net",
    port: 25565,
    ping: true,
    timeout: 10000,
    throwOnParseError: false,
    disableSRV: false
})

console.log(result);
```
## Docs
* <b>.lookup(): `((options: ServerStatusOptions) => Promise<ServerStatus>)`</b>
  * Options
    * <b>`hostname:`</b> string
      > Either an IP, or a hostname of the server.
    * <b>`port?:`</b> number <i> `default: 25565`</i>
      > Port of the server. Any port other than 25565 disables SRV lookup.
    * <b>`timeout?:`</b> number <i>`default: 10000`</i>
      > Timeout of when an error is thrown after no response. Default is 10 seconds.
    * <b>`ping?:`</b> boolean <i>`default: true`</i>
      > Whether to send a payload at the end to get the latency of the server. 
    * <b>`throwOnParseError?:`</b> boolean <i>`default: true`</i>
      > Whether to throw an error if the status packet fails to parse the status field. The `statusRaw` field is always    included.
    * <b>`disableSrv?:`</b> boolean <i>`default: false`</i>
      > Whether to force skip SRV lookups. Useful when only pinging IP addresses and not hostnames.
  * ServerStatus
    * <b>`latency?:`</b> number
      > The time it takes to send and receive a payload from the server. Will be null if `ping` option is false
    * <b>`status?:`</b> JSON
      > Parsed status response from the sever. Will be null if the status fails to parse. <a href="https://wiki.vg/Server_List_Ping">Example of a valid Status Response.</a>
    * <b>`statusRaw:`</b> string
      > Raw status response in the form of a string. Useful when `status` fails to parse.

* <b>.setDnsServers(): ((serverArray: string[]) => Promise<boolean>)</b>
  > It wraps the `dns.setServers` function, ueful when you want to look up the SRV records with different DNS servers.<br> The default servers are:<br>
   `["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]` <br>
   (Cloudflare, Google, Cloudflare Alt, Google Alt). <br>
   Pass in a parameter which is an array of hostnames or IP addresses of DNS servers. It will either return true, or throw an error. 

### Troubleshooting

Or FAQs, if that's more appropriate.

## Back matter



### Acknowledgements

Thanks to all who helped inspire this template.

### See also

- [A simple README.md template](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)
- [A template to make good README.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
- [A sample README for all your GitHub projects](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
- [A simple README.md template to kickstart projects](https://github.com/me-and-company/readme-template)

### To-do

- [ ] Still need to do this
- [ ] ~~Decided not to do this~~
- [x] Done!

### License

This project is licensed under the [MIT License](LICENSE.md).
