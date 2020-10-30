
type Callback<T> = (error: Error, result?: T) => void;

declare module 'ipfs' {
    import { EventEmitter } from "events";
    export function create(options: any): Ipfs;
    export function create(): Ipfs;

    export class Ipfs extends EventEmitter {
        constructor(options: any);

        types: Ipfs.Types;

        init(options: Ipfs.InitOptions, callback: Callback<boolean>): void;
        init(callback: Callback<boolean>): void;

        preStart(callback: Callback<any>): void;
        start(callback?: Callback<any>): void;
        stop(callback?: (error?: Error) => void): void;
        isOnline(): boolean;

        version(options: any, callback: (error: Error, version: Ipfs.Version) => void): void;
        version(options: any): Promise<Ipfs.Version>;
        version(callback: (error: Error, version: Ipfs.Version) => void): void;
        version(): Promise<Ipfs.Version>;

        id(options: any, callback: (error: Error, version: Ipfs.Id) => void): void;
        id(options: any): Promise<Ipfs.Id>;
        id(callback: (error: Error, version: Ipfs.Id) => void): void;
        id(): Promise<Ipfs.Id>;

        repo: Ipfs.RepoAPI;
        bootstrap: any;
        config: any;
        block: any;
        object: Ipfs.ObjectAPI;
        dag: Ipfs.DagAPI;
        libp2p: any;
        swarm: Ipfs.SwarmAPI;
        files: Ipfs.FilesAPI;
        bitswap: any;

        ping(callback: (error: Error) => void): void;
        ping(): Promise<void>;

        pubsub: any;
        dht: any;
        pin: any;

        // Top level Files API
    
        add(data: Ipfs.FileContent | Ipfs.FileObject, options?: Ipfs.FileApiAddOptions): AsyncIterable<UnixFSEntry>;
        //since 0.48:
        //add(data: Ipfs.FileContent | Ipfs.FileObject, options?: Ipfs.FileApiAddOptions): Promise<Ipfs.UnixFSEntry>;
        //addAll(source: Ipfs.FileContent | Ipfs.FileObject, options?: Ipfs.FileApiAddOptions): AsyncIterable<Ipfs.UnixFSEntry>;

        cat(ipfsPath: string | Ipfs.CID, options?: {
            offset?: number;
            length?: number;
            timeout?: number;
            signal?: AbortSignal;
        }): AsyncIterable<Buffer>;

        get(ipfsPath: string | Ipfs.CID, options: any): AsyncIterable<Ipfs.UnixFSEntryWithContent>;
        
        ls(ipfsPath: string | Ipfs.CID): AsyncIterable<Ipfs.UnixFSLsResult>;
        
    }

    namespace Ipfs {

        export type DagHashAlg = string | 'sha2-256' | 'sha3-512';

        export interface Mtime {
            secs: number;
            nsecs?: number;
        }

        export type UnixTime = Date | Mtime | number[];

        export interface Options {
            init?: boolean;
            start?: boolean;
            EXPERIMENTAL?: any;
            repo?: string;
            config?: any;
        }

        export interface InitOptions {
            emptyRepo?: boolean;
            bits?: number;
            log?: Function;
        }

        export interface Multiaddr {
            
            toString: () => string;
        }

        export type Multihash = any | string;
        export type CID = any;

        export interface Types {
            Buffer: any;
            PeerId: any;
            PeerInfo: any;
            multiaddr: Multiaddr;
            multihash: Multihash;
            CID: CID;
        }

        export interface Version {
            version: string;
            repo: string;
            commit: string;
        }

        export interface Id {
            id: string;
            protocolVersion: string;
            publicKey: string;
            addresses: Multiaddr[];
            agentVersion: string;
        }

        export interface RepoAPI {
            init(bits: number, empty: boolean, callback: Callback<any>): void;

            version(options: any, callback: Callback<any>): void;
            version(callback: Callback<any>): void;

            gc(): void;
            path(): string;
        }

        export type FileContent = Uint8Array | Blob | String | Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>
        
        export interface FileObject {
            path?: string
            content?: FileContent
            mode?: number | string
            mtime?: UnixTime
        }

        interface UnixFSEntryBase {
            path: string,
            mode: number,
            mtime: Mtime
        }
        export interface UnixFSEntryWithContent extends UnixFSEntryBase {    
            content: AsyncIterable<Uint8Array>,
        }
        export interface UnixFSEntry extends UnixFSEntryBase{
            cid: CID,
            size: number
        }
        export interface UnixFSLsResult extends UnixFSEntry {
            depth: number;
            name: string;
            type: 'file' | 'dir'
        }

        export interface FileApiAddOptions {
            chunker?: string | 'size-262144' | 'rabin';
            cidVersion?: number;
            enableShardingExperiment?: boolean;
            hashAlg?: DagHashAlg;
            onlyHash?: boolean;
            pin?: boolean;
            progress?: any;
            rawLeaves?: boolean;
            shardSplitThreshold?: number;
            trickle?: boolean;
            wrapWithDirectory?: boolean;
            timeout?: number;
            signal?: AbortSignal;
        }

        export interface IpfsFile {
            path: string;
            cid: CID;
            hash: string;
            size: number;
            content?: FileContent;
        }
        export interface IIPFSFileApiAddReturnEntry {
            path: string;
            cid: CID;
            mode: number;
            mtime: Mtime;
            size: number;
        }

        export interface IpfsFileInfo {
            path: string;
            hash: string;
            size: number;
            name: string;
            depth: number;
            type: 'file' | 'dir' | string;
        }

        export type FileStream = Iterable<FileContent|FileObject> | AsyncIterable<FileContent|FileObject> | ReadableStream<FileContent|FileObject>

        export interface FilesAPI {
            cp: any;
            flush: any;
            ls: any;
            lsReadableStream: any;
            lsPullStream: any;
            mkdir: any;
            mv: any;
            read: any;
            readPullStream: any;
            readReadableStream: any;
            rm: any;
            stat: any;
            write: any;
        }

        export interface PeersOptions {
            v?: boolean;
            verbose?: boolean;
        }

        export type PeerId = any;

        export interface PeerInfo {
            id: string;
            addrs: Multiaddr[];
        }

        export interface Peer {
            addr: Multiaddr;
            peer: string;
        }

        export interface SwarmAPI {
            peers(options: PeersOptions, callback: Callback<Peer[]>): void;
            peers(options: PeersOptions): Promise<Peer[]>;
            peers(callback: Callback<Peer[]>): void;
            peers(): Promise<Peer[]>;

            addrs(callback: Callback<PeerInfo[]>): void;
            addrs(): Promise<PeerInfo[]>;

            localAddrs(callback: Callback<Multiaddr[]>): void;
            localAddrs(): Promise<Multiaddr[]>;

            connect(maddr: Multiaddr | string, callback: Callback<any>): void;
            connect(maddr: Multiaddr | string): Promise<any>;

            disconnect(maddr: Multiaddr | string, callback: Callback<any>): void;
            disconnect(maddr: Multiaddr | string): Promise<any>;

            filters(callback: Callback<void>): never;
        }

        export type DAGNode = any;
        export type DAGLink = any;
        export type DAGLinkRef = DAGLink | any;
        export type Obj = BufferSource | any;

        export interface ObjectStat {
            Hash: Multihash;
            NumLinks: number;
            BlockSize: number;
            LinksSize: number;
            DataSize: number;
            CumulativeSize: number;
        }

        export interface PutObjectOptions {
            enc?: any;
        }

        export interface GetObjectOptions {
            enc?: any;
        }

        export interface ObjectPatchAPI {
            addLink(multihash: Multihash, link: DAGLink, options: GetObjectOptions, callback: Callback<any>): void;
            addLink(multihash: Multihash, link: DAGLink, options: GetObjectOptions): Promise<any>;
            addLink(multihash: Multihash, link: DAGLink, callback: Callback<any>): void;
            addLink(multihash: Multihash, link: DAGLink): Promise<any>;

            rmLink(multihash: Multihash, linkRef: DAGLinkRef, options: GetObjectOptions, callback: Callback<any>): void;
            rmLink(multihash: Multihash, linkRef: DAGLinkRef, options: GetObjectOptions): Promise<any>;
            rmLink(multihash: Multihash, linkRef: DAGLinkRef, callback: Callback<any>): void;
            rmLink(multihash: Multihash, linkRef: DAGLinkRef): Promise<any>;

            appendData(multihash: Multihash, data: any, options: GetObjectOptions, callback: Callback<any>): void;
            appendData(multihash: Multihash, data: any, options: GetObjectOptions): Promise<any>;
            appendData(multihash: Multihash, data: any, callback: Callback<any>): void;
            appendData(multihash: Multihash, data: any): Promise<any>;

            setData(multihash: Multihash, data: any, options: GetObjectOptions, callback: Callback<any>): void;
            setData(multihash: Multihash, data: any, options: GetObjectOptions): Promise<any>;
            setData(multihash: Multihash, data: any, callback: Callback<any>): void;
            setData(multihash: Multihash, data: any): Promise<any>;
        }

        export interface ObjectAPI {
            "new"(template: 'unixfs-dir', callback: Callback<DAGNode>): void;
            "new"(callback: Callback<DAGNode>): void;
            "new"(): Promise<DAGNode>;

            put(obj: Obj, options: PutObjectOptions, callback: Callback<any>): void;
            put(obj: Obj, options: PutObjectOptions): Promise<any>;
            put(obj: Obj, callback: Callback<any>): void;
            put(obj: Obj): Promise<any>;

            get(multihash: Multihash, options: GetObjectOptions, callback: Callback<any>): void;
            get(multihash: Multihash, options: GetObjectOptions): Promise<any>;
            get(multihash: Multihash, callback: Callback<any>): void;
            get(multihash: Multihash): Promise<any>;

            data(multihash: Multihash, options: GetObjectOptions, callback: Callback<any>): void;
            data(multihash: Multihash, options: GetObjectOptions): Promise<any>;
            data(multihash: Multihash, callback: Callback<any>): void;
            data(multihash: Multihash): Promise<any>;

            links(multihash: Multihash, options: GetObjectOptions, callback: Callback<DAGLink[]>): void;
            links(multihash: Multihash, options: GetObjectOptions): Promise<DAGLink[]>;
            links(multihash: Multihash, callback: Callback<DAGLink[]>): void;
            links(multihash: Multihash): Promise<DAGLink[]>;

            stat(multihash: Multihash, options: GetObjectOptions, callback: Callback<ObjectStat>): void;
            stat(multihash: Multihash, options: GetObjectOptions): Promise<ObjectStat>;
            stat(multihash: Multihash, callback: Callback<ObjectStat>): void;
            stat(multihash: Multihash): Promise<ObjectStat>;

            patch: ObjectPatchAPI;
        }

        export interface DagAPI {
            put(dagNode: any, options: any, callback: Callback<any>): void;
            put(dagNode: any, options: any): Promise<any>;
            put(dagNode: any): Promise<any>;

            get(cid: string | CID, path: string, options: any, callback: Callback<any>): void;
            get(cid: string | CID, path: string, options: any): Promise<any>;
            get(cid: string | CID, path: string, callback: Callback<any>): void;
            get(cid: string | CID, path: string): Promise<any>;
            get(cid: string | CID, callback: Callback<any>): void;
            get(cid: string | CID): Promise<any>;

            tree(cid: string | CID, path: string, options: any, callback: Callback<any>): void;
            tree(cid: string | CID, path: string, options: any): Promise<any>;
            tree(cid: string | CID, path: string, callback: Callback<any>): void;
            tree(cid: string | CID, path: string): Promise<any>;
            tree(cid: string | CID, options: any, callback: Callback<any>): void;
            tree(cid: string | CID, options: any): Promise<any>;
            tree(cid: string | CID, callback: Callback<any>): void;
            tree(cid: string | CID): Promise<any>;
        }
    }
}
