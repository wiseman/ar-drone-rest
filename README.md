ar-drone-rest
=============

ar-drone-rest is a node.js REST (not really) server for controlling
the AR.Drone 2.0.  It is not well tested.

Uses https://github.com/felixge/node-ar-drone to talk to the drone.


Running the server
-------------------

Get the code and install it:

```
$ git clone git://github.com/wiseman/ar-drone-rest.git
$ cd ar-drone-rest
$ npm install
```

Connect to your drone's wifi network, then start the server:

```
$ npm start
```


API
---

See `lib/server.js` for details, but here are a few basic methods:

Take off:

```
$ curl 'http://localhost:8080/v1/takeoff
```

Land:

```
$ curl 'http://localhost:8080/v1/land
```

Move forward slowly:

```
$ curl 'http://localhost:8080/v1/front/0.1
```

Move backward at maximum speed:

```
$ curl 'http://localhost:8080/v1/front/1.0
```

Ascend slowly:

```
$ curl 'http://localhost:8080/v1/up/0.1
```

Descend slowly:

```
$ curl 'http://localhost:8080/v1/down/0.1
```

Spin clockwise:

```
$ curl 'http://localhost:8080/v1/clockwise/0.1
```

Spin counter-clockwise:

```
$ curl 'http://localhost:8080/v1/counterclockwise/0.1
```

Stop all movement:

```
$ curl 'http://localhost:8080/v1/stop
```

Clear the emergency bit (for example the drone crashed, went to
safe-mode and the LEDs are showing red):

```
$ curl 'http://localhost:8080/v1/disableEmergency
```
