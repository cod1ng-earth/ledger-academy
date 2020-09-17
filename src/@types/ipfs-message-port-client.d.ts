declare module 'ipfs-message-port-client' {
    class ClientTransport{}

    export default class IPFSClient {
        constructor(transport: ClientTransport);
        dag: DAGCLient;
        files: FilesClient;
        block: BlockClient;
        static attach(self: IPFSClient, port: MessagePort): void;
        static detached(): IPFSClient;
        static from(port: MessagePort): IPFSClient;

        add(input: any, options?: object);        
        addAll(input: any, options?: object);
        cat(inputPath: string|any, options?: object): AsyncIterator;
    }
}