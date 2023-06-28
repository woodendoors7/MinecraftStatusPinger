export class Packet {
    status: PacketStatus = {
        handshakeBaked: false,
        pingSent: false,
        pingBaked: false,
        pingSentTime: null,
    }
    meta: PacketMeta = {
        packetInitialized: false,
        metaCrafted: false,
        fieldsCrafted: false,
        packetID: null,
        dataLength: null,
        fullLength: null,
        metaLength: null,
    }
    dataBuffer = Buffer.alloc(0);
    fieldsBuffer = Buffer.alloc(0);
    crafted: PacketCrafted = {
        data: null,
        latency: null,
    }
}

interface PacketStatus {
    handshakeBaked: boolean,
    pingSent: boolean,
    pingBaked: boolean,
    pingSentTime: number,
}

interface PacketMeta {
    packetInitialized: boolean
    metaCrafted: boolean,
    fieldsCrafted: boolean,
    packetID: number,
    dataLength: number,
    fullLength: number,
    metaLength: number,
}

interface PacketCrafted {
    data: string,
    latency: number
}

export interface ServerStatusOptions {
    hostname: string,
    port?: number
    timeout?: number
    ping?: boolean,
    throwOnParseError?: boolean,
    disableSRV?: boolean
}


export class ServerStatus {
    constructor(statusRaw: string, latency?: number, throwOnParseError?: boolean) {
        try {
            this.status = JSON.parse(statusRaw);
        } catch (err) {
            if (throwOnParseError) throw err
            this.status = null
        }
        this.statusRaw = statusRaw
        if (latency) {
            this.latency = latency
        }
    }
    latency?: number;
    status?: JSON;
    statusRaw: string;
}


