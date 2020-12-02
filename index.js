'use strict'

const {Kafka, logLevel} = require('kafkajs')
const client = new Kafka({
  brokers: [
    'localhost:9092'
  ]
, logLevel: logLevel.DEBUG
})

const producer = client.producer()

producer.on(producer.events.CONNECT, () => {
  console.log('connect')
})

// This event doesn't actually get emitted when the socket
// disconnects. It is only emitted when producer.disconnect()
// is called and successfully disconnects.
producer.on(producer.events.DISCONNECT, (...args) => {
  console.log('on disconnect', args)
})

async function main() {
  await producer.connect()
  console.log('connected')
}

main()

// Use this just to hold the event loop open.
// Otherwise, the script will exit since all handles are closed
// (once the net.Socket end event is emitted).
setInterval(() => {}, 5000)
