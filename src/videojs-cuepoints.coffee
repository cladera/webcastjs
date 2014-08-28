videojs.plugin 'cuepoints', (options = {}) ->
  @cuepoints = {}

  # destroys a single cuepoint
  @destroyCuepoint = (id) ->
    @off 'timeupdate', @cuepoints[id].handler
    delete @cuepoints[id]

  # destroys all cuepoints
  @destroyCuepoints = ->
    for cuepoint, data of @cuepoints
      @destroyCuepoint data.id
    @cuepoints = {}

  # activates a cuepoint
  @activateCuepoint = (id) ->
    @on 'timeupdate', @cuepoints[id].handler

  # lists all cuepoints
  @listCuepoints = () ->
    @cuepoints

  # seeks to the start time of a cuepoint
  @seekCuepoint = (id) ->
    @currentTime @cuepoints[id].start

  # creates a cuepoint
  @addCuepoint = (options = {}) ->
    @cuepoints[options.id] = options
    @cuepoints[options.id].fired = false;
    @cuepoints[options.id].handler = ->
      if @currentTime() >= @cuepoints[options.id].start and @currentTime() < @cuepoints[options.id].end
        return if @cuepoints[options.id].fired
        @cuepoints[options.id].fired = true
        @cuepoints[options.id].onStart()
      else 
        return unless @cuepoints[options.id].fired
        @cuepoints[options.id].fired = false
        @cuepoints[options.id].onEnd()

    @activateCuepoint options.id 
