import { create as createIpfs } from 'ipfs-core'
import { Server, IPFSService } from 'ipfs-message-port-server'

const main = async () => {
    // start listening to all the incoming connections (browsing contexts that
    // which run new SharedWorker...)
    // Note: It is important to start listening before we do any await to ensure
    // that connections aren't missed while awaiting.
    // eslint-disable-next-line no-restricted-globals
    const connections = listen(self, 'connect')

    // Start an IPFS node & create server that will expose it's API to all clients
    // over message channel.
    const ipfs = await createIpfs({
        repo: 'ipfs-worker',
        config: {
            Addresses: {
                Swarm: [],
            },
        },
    }) //note that webrtc is not supported in workers!
    const _ipfsId = await ipfs.id()
    console.log('ipfs node as worker (v%s) is running [id: %s]', _ipfsId.agentVersion, _ipfsId.id);

    const service = new IPFSService(ipfs)
    const server = new Server(service)

    // connect every queued and future connection to the server.
    for await (const event of connections) {
        const port = event.ports[0]
        if (port) {
            server.connect(port)
        }
    }  
}

/**
 * Creates an AsyncIterable<Event> for all the events on the given `target` for
 * the given event `type`. It is like `target.addEventListener(type, listener, options)`
 * but instead of passing listener you get `AsyncIterable<Event>` instead.
 * @param {EventTarget} target
 * @param {string} type
 * @param {AddEventListenerOptions} options
 */
const listen = function (target, type, options) {
    const events = []
    let resume
    let ready = new Promise(resolve => (resume = resolve))

    const write = event => {
        events.push(event)
        resume()
    }
    const read = async () => {
        await ready
        ready = new Promise(resolve => (resume = resolve))
        return events.splice(0)
    }

    const reader = async function * () {
        try {
            while (true) {
                yield * await read()
            }
        } finally {
            target.removeEventListener(type, write, options)
        }
    }

    target.addEventListener(type, write, options)
    return reader()
}

main()