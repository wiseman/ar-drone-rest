var arDrone = require('../node-ar-drone');
var restify = require('restify');

var drone = null;
var server = restify.createServer();

function start() {
  drone = arDrone.createClient();
  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}


exports.start = start;



function takeoff(req, res, next) {
  drone.takeoff();
  res.send('OK');
}
server.get('/takeoff', takeoff);

function land(req, res, next) {
  drone.land();
  res.send('OK');
}
server.get('/land', land);

function up(req, res, next) {
  drone.up(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/up/:speed', up);

function down(req, res, next) {
  drone.down(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/down/:speed', down);

function clockwise(req, res, next) {
  drone.clockwise(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/clockwise/:speed', clockwise);

function counterclockwise(req, res, next) {
  drone.counterClockwise(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/counterclockwise/:speed', counterclockwise);

function front(req, res, next) {
  drone.front(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/front/:speed', front);

function back(req, res, next) {
  drone.back(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/back/:speed', back);

function left(req, res, next) {
  drone.back(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/left/:speed', left);

function right(req, res, next) {
  drone.back(parseFloat(req.params.speed));
  res.send('OK');
}
server.get('/right/:speed', right);

function stop(req, res, next) {
  drone.stop();
  res.send('OK');
}
server.get('/stop', stop);

function clearEmergency(req, res, next) {
  drone.disableEmergency();
  res.send('OK');
}
server.get('/clearEmergency', clearEmergency);


