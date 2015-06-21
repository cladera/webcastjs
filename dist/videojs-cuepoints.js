(function() {
  videojs.plugin('cuepoints', function(options) {
    if (options == null) {
      options = {};
    }
    this.cuepoints = {};
    this.destroyCuepoint = function(id) {
      this.off('timeupdate', this.cuepoints[id].handler);
      return delete this.cuepoints[id];
    };
    this.destroyCuepoints = function() {
      var cuepoint, data, _ref;
      _ref = this.cuepoints;
      for (cuepoint in _ref) {
        data = _ref[cuepoint];
        this.destroyCuepoint(data.id);
      }
      return this.cuepoints = {};
    };
    this.activateCuepoint = function(id) {
      return this.on('timeupdate', this.cuepoints[id].handler);
    };
    this.listCuepoints = function() {
      return this.cuepoints;
    };
    this.seekCuepoint = function(id) {
      return this.currentTime(this.cuepoints[id].start);
    };
    return this.addCuepoint = function(options) {
      if (options == null) {
        options = {};
      }
      this.cuepoints[options.id] = options;
      this.cuepoints[options.id].fired = false;
      this.cuepoints[options.id].handler = function() {
        if (this.currentTime() >= this.cuepoints[options.id].start && this.currentTime() < this.cuepoints[options.id].end) {
          if (this.cuepoints[options.id].fired) {
            return;
          }
          this.cuepoints[options.id].fired = true;
          return this.cuepoints[options.id].onStart();
        } else {
          if (!this.cuepoints[options.id].fired) {
            return;
          }
          this.cuepoints[options.id].fired = false;
          return this.cuepoints[options.id].onEnd();
        }
      };
      return this.activateCuepoint(options.id);
    };
  });

}).call(this);
