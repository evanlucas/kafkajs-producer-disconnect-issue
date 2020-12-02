# kafkajs-producer-disconnect-issue

This repository is to serve a reproducible example of an issue where
the kafkajs producer gets a severed connection from a Kafka server
and does not emit a `disconnect` event or attempt to reconnect.

To reproduce this issue, first spin up the kafka and zookeeper instances:

```
$ docker-compose -f compose/docker-compose.yml up
```

This will be terminal 1.

***

Then, in another terminal, start the node script:

```
$ npm i
$ node index.js
```

This will be terminal 2.

***

Then, in another terminal, stop the kafka container:

```
$ docker stop compose_kafka_1
```

This will be terminal 3.

***

Terminal 2 should show logs similar to the following:

```
{"level":"DEBUG","timestamp":"2020-12-02T14:19:28.634Z","logger":"kafkajs","message":"[Connection] Kafka server has closed connection","broker":"localhost:9092","clientId":"kafkajs"}
{"level":"DEBUG","timestamp":"2020-12-02T14:19:28.634Z","logger":"kafkajs","message":"[Connection] disconnecting...","broker":"localhost:9092","clientId":"kafkajs"}
{"level":"DEBUG","timestamp":"2020-12-02T14:19:28.635Z","logger":"kafkajs","message":"[Connection] disconnected","broker":"localhost:9092","clientId":"kafkajs"}
```

The producer connection is severed by the kafka server.

Next, restart the kafka container by running the following in terminal 3:

```
$ docker start compose_kafka_1
```

I would expect the producer to reconnect, but it does nothing and is in a state
where we are not able to know that it has been disconnected.

