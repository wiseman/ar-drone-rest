var arDrone = require('ar-drone');
var restify = require('restify');

var drone = null;
var server = restify.createServer({
  'name': 'ar-drone-rest'
});

function start() {
  drone = arDrone.createClient();
  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

module.exports = {
  start: start
};


function takeoff(req, res, next) {
  drone.takeoff();
  res.send('OK');
}
server.get('/v1/takeoff', takeoff);

function land(req, res, next) {
  drone.land();
  res.send('OK');
}
server.get('/v1/land', land);

function up(req, res, next) {
  drone.up(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/up/:speed', up);

function down(req, res, next) {
  drone.down(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/down/:speed', down);

function clockwise(req, res, next) {
  drone.clockwise(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/clockwise/:speed', clockwise);

function counterclockwise(req, res, next) {
  drone.counterClockwise(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/counterclockwise/:speed', counterclockwise);

function front(req, res, next) {
  drone.front(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/front/:speed', front);

function back(req, res, next) {
  drone.back(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/back/:speed', back);

function left(req, res, next) {
  drone.back(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/left/:speed', left);

function right(req, res, next) {
  drone.back(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/v1/right/:speed', right);

function stop(req, res, next) {
  drone.stop();
  res.send('OK');
}
server.get('/v1/stop', stop);

function disableEmergency(req, res, next) {
  drone.disableEmergency();
  res.send('OK');
}
server.get('/v1/disableEmergency', disableEmergency);

function animate(req, res, next) {
  drone.animate(req.params.animation, parseInt(req.params.duration, 10));
}
server.get('/v1/animate/:animation/:duration', animate);
