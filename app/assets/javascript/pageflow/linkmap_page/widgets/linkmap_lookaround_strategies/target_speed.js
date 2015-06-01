pageflow.linkmapPage.TargetSpeedStrategy = function(options, name) {
  var speedUp = 10;

  var targetSpeed = 0;
  var speed = 0;
  var realSpeed = 0;

  var stopFactor = 1;
  var isStopping = false;
  var wasStopping = false;

  var activeMargin = 0.4;

  var scrollerPosition = options.scrollerPosition;
  var scrollerMax = options.scrollerMax;

  this.reset = function() {
    targetSpeed = 0;
  };

  this.updateGyro = function(delta) {
    this.updateTargetSpeed(Math.abs(delta) < 8 ? 0 : delta / 90);
  };

  this.updateMouse = function(fraction) {
    var delta = fraction * 2 - 1;
    var onOuterAreas = Math.abs(delta) > 1 - activeMargin;

    this.updateTargetSpeed(onOuterAreas ?
                           (delta - ((1 - activeMargin) * sign(delta))) / activeMargin :
                           0);
  };

  this.updateTargetSpeed = function(value) {
    targetSpeed = value;
  };

  this.getNextScrollDelta = function() {
    convergeSpeed();
    updateStopFactor();
    updateSpeedIfStoppingAborted();

    realSpeed = speed * stopFactor;

    return -realSpeed * speedUp;
  };

  var i = 0;

  function convergeSpeed() {
    if (Math.abs(speed - targetSpeed) > 0.01) {
      var d = Math.abs(targetSpeed) > Math.abs(speed) ? 0.02 : 0.04;
      speed = limit(speed + d * sign(targetSpeed - speed), targetSpeed);
    }
    else {
      speed = targetSpeed;
    }
  }

  function limit(speed, targetSpeed) {
    if (speed > targetSpeed) {
      return Math.max(speed, targetSpeed);
    }
    else {
      return Math.min(speed, targetSpeed);
    }
  }

  function updateStopFactor() {
    isStopping = false;
    stopFactor = 1;

    if (scrollerPosition() < scrollerMax() * 0.8 && targetSpeed >= 0) {
      stopFactor = (scrollerMax() - scrollerPosition()) / (scrollerMax() * 0.2);
      isStopping = true;
    }

    if (scrollerPosition() > scrollerMax() * 0.2 && targetSpeed <= 0) {
      stopFactor = scrollerPosition() / (scrollerMax() * 0.2);
      isStopping = true;
    }

    if (stopFactor > 1) {
      stopFactor = stopFactor;
    }
  }

  function updateSpeedIfStoppingAborted() {
    if (wasStopping && !isStopping) {
      speed = realSpeed;
    }

    wasStopping = isStopping;
  }

  function sign(value) {
    return value > 0 ? 1 : -1;
  }
};
