var arDrone = require('ar-drone');
var restify = require('restify');

var drone = arDrone.createClient();
var server = restify.createServer({
  'name': 'ar-drone-rest'
});

function start() {
  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

module.exports = {
  start: start
};


// FIXME: dirty hack.

var navDataHook = null;

function setNavDataHook(hook) {
  if (navDataHook) {
    drone.removeListener('navdata', navDataHook);
    navDataHook = null;
  }
  if (hook) {
    drone.on('navdata', hook);
    navDataHook = hook;
  }
}



/**
 * Simple (two-dimensional) odometry tracker.  Uses the translation
 * estimate from navdata.demo.drone.camera.translation, which
 * supposedly uses data from all onboard sensors (see
 * https://projects.ardrone.org/boards/1/topics/show/1302).
 * @param {object} drone The drone client.
 * @constructor
 */
var Odometry = function(drone) {
  this.drone = drone;
  this.start_x = null;
  this.start_y = null;
  this.x = null;
  this.y = null;
  this.hook = null;
};


/**
 * Starts odometry.
 */
Odometry.prototype.start = function() {
  if (this.hook) {
    this.stop();
  }
  this.start_x = null;
  this.start_y = null;
  this.x = null;
  this.y = null;
  this.drone.config('general:navdata_demo', 'FALSE');
  var self = this;
  this.hook = function(navData) {
    self.handleNavData_(navData);
  };
  this.drone.on('navdata', this.hook);
};


/**
 * Stops odometry.
 */
Odometry.prototype.stop = function() {
  this.drone.config('general:navdata_demo', 'TRUE');
  this.drone.removeListener('navdata', this.hook);
};


/**
 * Handles navdata events.
 * @param {Object} navData Nav data event.
 * @private
 */
Odometry.prototype.handleNavData_ = function(navData) {
  if (navData.demo) {
    var translation = navData.demo.drone.camera.translation;
    if (this.start_x === null || this.start_y === null) {
      this.start_x = translation.x;
      this.start_y = translation.y;
    } else {
      this.x = translation.x;
      this.y = translation.y;
    }
  }
};


/**
 * Computes distance traveled.
 * @return {number} Distance.
 */
Odometry.prototype.distance = function() {
  if (this.start_x !== null & this.start_y !== null &&
      this.x !== null && this.y !== null) {
    var dx = this.x - this.start_x;
    var dy = this.y - this.start_y;
    return Math.sqrt(dx * dx + dy * dy);
  } else {
    return 0.0;
  }
};


var odometry = new Odometry(drone);


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
  var animation = req.params.animation;
  var duration = parseInt(req.params.duration, 10);
  drone.animate(animation, duration);
}
server.get('/v1/animate/:animation/:duration', animate);


/*
 * Stops all motion once the vehicle has traveled |distance_mm|
 * millimeters.
 *
 * FIXME: Should this block until the distance has been hit?
 */
function stopAfter(req, res, next) {
  var distance_mm = parseFloat(req.params.distance_mm);
  odometry.start();
  setNavDataHook(function(navData) {
    var distance = odometry.distance();
    console.log('distance: ' + distance);
    if (distance > distance_mm) {
      drone.stop();
      setNavDataHook(null);
      odometry.stop();
    }
  });
  res.send('OK');
}
server.get('/v1/stopAfter/:distance_mm', stopAfter);

