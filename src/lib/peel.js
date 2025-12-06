(function(win) {
  var PRECISION = 1e2;
  var VENDOR_PREFIXES = ['webkit','moz', ''];
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  var CSS_PREFIX = 'peel-';
  var clipProperty, transformProperty, boxShadowProperty, filterProperty;
  var backgroundGradientSupport;
  var docEl = document.documentElement;
  var style = docEl.style;

  function getCssProperty(name) {
    var prefix, str;
    for (var i = 0; i < VENDOR_PREFIXES.length; i++) {
      prefix = VENDOR_PREFIXES[i];
      str = prefix ? prefix + capitalize(name) : name;
      if (str in style) {
        return str;
      }
    }
  }

  function setCssProperties() {
    clipProperty = getCssProperty('clipPath');
    transformProperty = getCssProperty('transform');
    boxShadowProperty = getCssProperty('boxShadow');
    filterProperty = getCssProperty('filter');
    setBackgroundGradientSupport();
    Peel.supported = !!(clipProperty && transformProperty);
    Peel.effectsSupported = backgroundGradientSupport;
  }

  function setBackgroundGradientSupport() {
    var el = document.createElement('div');
    var style = el.style;
    style.cssText = 'background:linear-gradient(45deg,,white);';
    backgroundGradientSupport = (style.backgroundImage || '').indexOf('gradient') > -1;
  }

  function round(n) {
    return Math.round(n * PRECISION) / PRECISION;
  }

  function clamp(n) {
    return Math.max(0, Math.min(1, n));
  }

  function normalize(n, min, max) {
    return (n - min) / (max - min);
  }

  function distribute(t, mult) {
    return (mult || 1) * 2 * (.5 - Math.abs(t - .5));
  }

  function capitalize(str) {
    return str.slice(0,1).toUpperCase() + str.slice(1);
  }

  function camelize(str) {
    return str.replace(/-(\w)/g, function(a, b) {
      return b.toUpperCase();
    });
  }

  function prefix(str) {
    return CSS_PREFIX + str;
  }

  function setCSSClip(el, clip) {
    el.style[clipProperty] = clip;
  }

  function setTransform(el, t) {
    el.style[transformProperty] = t;
  }

  function setBoxShadow(el, x, y, blur, spread, intensity) {
    el.style[boxShadowProperty] = getShadowCss(x, y, blur, spread, intensity);
  }

  function setDropShadow(el, x, y, blur, intensity) {
    el.style[filterProperty] = 'drop-shadow(' + getShadowCss(x, y, blur, null, intensity) + ')';
  }

  function getShadowCss(x, y, blur, spread, intensity) {
    return round(x) + 'px ' +
      round(y) + 'px ' +
      round(blur) + 'px ' +
      (spread ? round(spread) + 'px ' : '') +
      'rgba(0,0,0,' + round(intensity) + ')';
  }

  function setOpacity(el, t) {
    el.style.opacity = t;
  }

  function setBackgroundGradient(el, rotation, stops) {
    if (!backgroundGradientSupport) return;
    var css;
    if (stops.length === 0) {
      css = 'none';
    } else {
      css = 'linear-gradient(' + round(rotation) + 'deg,' + stops.join(',') + ')';
    }
    el.style.backgroundImage = css;
  }

  function addEvent(el, type, fn) {
    el.addEventListener(type, fn)
  }

  function removeEvent(el, type, fn) {
    el.removeEventListener(type, fn);
  }

  function getEventCoordinates(evt, el) {
    var pos = evt.changedTouches ? evt.changedTouches[0] : evt;
    return {
      'x': pos.clientX - el.offsetLeft + window.scrollX,
      'y': pos.clientY - el.offsetTop + window.scrollY
    }
  }

  function bindWithEvent(fn, scope, arg1, arg2) {
    return function(evt) {
      fn.call(scope, evt, arg1, arg2);
    }
  }

  function getBlackStop(a, pos) {
    return getColorStop(0, 0, 0, a, pos);
  }

  function getWhiteStop(a, pos) {
    return getColorStop(255, 255, 255, a, pos);
  }

  function getColorStop(r, g, b, a, pos) {
    a = round(clamp(a));
    return 'rgba('+ r +','+ g +','+ b +','+ a +') ' + round(pos * 100) + '%';
  }

  function getElement(obj, node) {
    if (typeof obj === 'string') {
      obj = (node || document).querySelector(obj);
    }
    return obj;
  }

  function createElement(parent, className) {
    var el = document.createElement('div');
    addClass(el, className);
    parent.appendChild(el);
    return el;
  }

  function removeClass(el, str) {
    el.classList.remove(str);
  }

  function addClass(el, str) {
    el.classList.add(str);
  }

  function getZIndex(el) {
    return el.style.zIndex;
  }

  function setZIndex(el, index) {
    el.style.zIndex = index;
  }

  function createSVGElement(tag, parent, attributes) {
    parent = parent || docEl;
    var el = document.createElementNS(SVG_NAMESPACE, tag);
    parent.appendChild(el);
    for (var key in attributes) {
      if (!attributes.hasOwnProperty(key)) continue;
      setSVGAttribute(el, key, attributes[key]);
    }
    return el;
  }

  function setSVGAttribute(el, key, value) {
    el.setAttributeNS(null, key, value);
  }

  function Peel (el, opt) {
    this.setOptions(opt);
    this.el = getElement(el, docEl);
    this.constraints = [];
    this.events = [];
    this.setupLayers();
    this.setupDimensions();
    this.setCorner(this.getOption('corner'));
    this.setMode(this.getOption('mode'));
    this.init();
  }

  Peel.Corners = {
    TOP_LEFT: 0x0,
    TOP_RIGHT: 0x1,
    BOTTOM_LEFT: 0x2,
    BOTTOM_RIGHT: 0x3
  }

  Peel.Defaults = {
    'topShadow': true,
    'topShadowBlur': 5,
    'topShadowAlpha': .5,
    'topShadowOffsetX': 0,
    'topShadowOffsetY': 1,
    'topShadowCreatesShape': true,
    'backReflection': false,
    'backReflectionSize': .02,
    'backReflectionOffset': 0,
    'backReflectionAlpha': .15,
    'backReflectionDistribute': true,
    'backShadow': true,
    'backShadowSize': .04,
    'backShadowOffset': 0,
    'backShadowAlpha': .1,
    'backShadowDistribute': true,
    'bottomShadow': true,
    'bottomShadowSize': 1.5,
    'bottomShadowOffset': 0,
    'bottomShadowDarkAlpha': .7,
    'bottomShadowLightAlpha': .1,
    'bottomShadowDistribute': true,
    'setPeelOnInit': true,
    'clippingBoxScale': 4,
    'flipConstraintOffset': 5,
    'dragPreventsDefault': true
  }

  Peel.prototype.setCorner = function() {
    var args = arguments;
    if (args[0] === undefined) {
      args = [Peel.Corners.BOTTOM_RIGHT];
    } else if (args[0].length) {
      args = args[0];
    }
    this.corner = this.getPointOrCorner(args);
  }

  Peel.prototype.setMode = function(mode) {
    if (mode === 'book') {
      this.addPeelConstraint(Peel.Corners.BOTTOM_LEFT);
      this.addPeelConstraint(Peel.Corners.TOP_LEFT);
      this.setOption('backReflection', false);
      this.setOption('backShadowDistribute', false);
      this.setOption('bottomShadowDistribute', false);
    } else if (mode === 'calendar') {
      this.addPeelConstraint(Peel.Corners.TOP_RIGHT);
      this.addPeelConstraint(Peel.Corners.TOP_LEFT);
    }
  }

  Peel.prototype.setPeelPath = function(x1, y1) {
    var args = arguments, p1, p2, c1, c2;
    p1 = new Point(x1, y1);
    if (args.length === 4) {
      p2 = new Point(args[2], args[3]);
      this.path = new LineSegment(p1, p2);
    } else if (args.length === 8) {
      c1 = new Point(args[2], args[3]);
      c2 = new Point(args[4], args[5]);
      p2 = new Point(args[6], args[7]);
      this.path = new BezierCurve(p1, c1, c2, p2);
    }
  }

  Peel.prototype.handleDrag = function(fn, el) {
    this.dragHandler = fn;
    this.setupDragEvents(el);
  }

  Peel.prototype.handlePress = function(fn, el) {
    this.pressHandler = fn;
    this.setupDragEvents(el);
  }

  Peel.prototype.setupDragEvents = function(el) {
    var self = this, isDragging, moveName, endName;
    if (this.dragEventsSetup) {
      return;
    }
    el = el || this.el;

    function dragStart (touch, evt) {
      if (self.getOption('dragPreventsDefault')) {
        evt.preventDefault();
      }
      moveName = touch ? 'touchmove' : 'mousemove';
      endName = touch ? 'touchend' : 'mouseup';
      addEvent(docEl, moveName, dragMove);
      addEvent(docEl, endName, dragEnd);
      isDragging = false;
    }

    function dragMove (evt) {
      if (self.dragHandler) {
        callHandler(self.dragHandler, evt);
      }
      isDragging = true;
    }

    function dragEnd(evt) {
      if (!isDragging && self.pressHandler) {
        callHandler(self.pressHandler, evt);
      }
      removeEvent(docEl, moveName, dragMove);
      removeEvent(docEl, endName, dragEnd);
    }

    function callHandler(fn, evt) {
      var coords = getEventCoordinates(evt, self.el);
      fn.call(self, evt, coords.x, coords.y);
    }

    this.addEvent(el, 'mousedown', dragStart.bind(this, false));
    this.addEvent(el, 'touchstart', dragStart.bind(this, true));
    this.dragEventsSetup = true;
  }

  Peel.prototype.removeEvents = function() {
    this.events.forEach(function(e, i) {
      removeEvent(e.el, e.type, e.handler);
    });
    this.events = [];
  }

  Peel.prototype.setTimeAlongPath = function(t) {
    t = clamp(t);
    var point = this.path.getPointForTime(t);
    this.timeAlongPath = t;
    this.setPeelPosition(point.x, point.y);
  }

  Peel.prototype.setFadeThreshold = function(n) {
    this.fadeThreshold = n;
  }

  Peel.prototype.setPeelPosition = function() {
    var pos = this.getPointOrCorner(arguments);
    pos = this.getConstrainedPeelPosition(pos);
    if (!pos) {
      return;
    }
    this.peelLineSegment = this.getPeelLineSegment(pos);
    this.peelLineRotation = this.peelLineSegment.getAngle();
    this.setClipping();
    this.setBackTransform(pos);
    this.setEffects();
  }

  Peel.prototype.addPeelConstraint = function() {
    var p = this.getPointOrCorner(arguments);
    var radius = this.corner.subtract(p).getLength();
    this.constraints.push(new Circle(p, radius));
    this.calculateFlipConstraint();
  }

  Peel.prototype.setOption = function(key, value) {
    this.options[key] = value;
  }

  Peel.prototype.getOption = function(key) {
    return this.options[camelize(key)];
  }

  Peel.prototype.getAmountClipped = function() {
    var topArea = this.getTopClipArea();
    var totalArea = this.width * this.height;
    return normalize(topArea, totalArea, 0);
  }

  Peel.prototype.addEvent = function(el, type, fn) {
    addEvent(el, type, fn);
    this.events.push({
      el: el,
      type: type,
      handler: fn
    });
    return fn;
  }

  Peel.prototype.getTopClipArea = function() {
    var top = new Polygon();
    this.elementBox.forEach(function(side) {
      this.distributeLineByPeelLine(side, top);
    }, this);
    return Polygon.getArea(top.getPoints());
  }

  Peel.prototype.calculateFlipConstraint = function() {
    var corner = this.corner, arr = this.constraints.concat();
    this.flipConstraint = arr.sort(function(a, b) {
      var aY = corner.y - a.center.y;
      var bY = corner.y - b.center.y;
      return a - b;
    })[0];
  }

  Peel.prototype.dragStart = function(evt, type, fn) {}

  Peel.prototype.fireHandler = function(evt, fn) {
    var coords = getEventCoordinates(evt, this.el);
    fn.call(this, evt, coords.x, coords.y);
  }

  Peel.prototype.setClipping = function() {
    var top = new Polygon();
    var back = new Polygon();
    this.clippingBox.forEach(function(side) {
      this.distributeLineByPeelLine(side, top, back);
    }, this);
    this.topClip.setPoints(top.getPoints());
    this.backClip.setPoints(back.getPoints());
  }

  Peel.prototype.distributeLineByPeelLine = function(seg, poly1, poly2) {
    var intersect = this.peelLineSegment.getIntersectPoint(seg);
    this.distributePointByPeelLine(seg.p1, poly1, poly2);
    this.distributePointByPeelLine(intersect, poly1, poly2);
  }

  Peel.prototype.distributePointByPeelLine = function(p, poly1, poly2) {
    if (!p) return;
    var d = this.peelLineSegment.getPointDeterminant(p);
    if (d <= 0) {
      poly1.addPoint(p);
    }
    if (d >= 0 && poly2) {
      poly2.addPoint(this.flipPointHorizontally(p));
    }
  }

  Peel.prototype.setOptions = function(opt) {
    var options = opt || {}, defaults = Peel.Defaults;
    for (var key in defaults) {
      if (!defaults.hasOwnProperty(key) || key in options) {
        continue;
      }
      options[key] = defaults[key];
    }
    this.options = options;
  }

  Peel.prototype.findOrCreateLayer = function(id, parent, zIndex) {
    var optId = id + '-element';
    var domId = prefix(id);
    var el = getElement(this.getOption(optId) || '.' + domId, parent);
    if (!el) {
      el = createElement(parent, domId);
    }
    addClass(el, prefix('layer'));
    setZIndex(el, zIndex);
    return el;
  }

  Peel.prototype.getPointOrCorner = function(args) {
    if (args.length === 2) {
      return new Point(args[0], args[1]);
    } else if(typeof args[0] === 'number') {
      return this.getCornerPoint(args[0]);
    }
    return args[0];
  }

  Peel.prototype.getCornerPoint = function(id) {
    var x = +!!(id & 1) * this.width;
    var y = +!!(id & 2) * this.height;
    return new Point(x, y);
  }

  Peel.prototype.getOptionalShape = function() {
    var shapes = ['rect', 'polygon', 'path', 'circle'], found;
    shapes.some(function(type) {
      var attr = this.getOption(type), obj;
      if (attr) {
        obj = {};
        obj.attributes = attr;
        obj.type = type;
        found = obj;
      }
      return found;
    }, this);
    return found;
  }

  Peel.prototype.setupLayers = function() {
    var shape = this.getOptionalShape();
    var topInnerLayer = this.topLayer = this.findOrCreateLayer('top', this.el, 2);
    var backInnerLayer = this.backLayer = this.findOrCreateLayer('back', this.el, 3);
    this.bottomLayer = this.findOrCreateLayer('bottom', this.el, 1);

    if (shape) {
      this.topLayer = this.wrapShapeLayer(this.topLayer, 'top-outer-clip');
      this.backLayer = this.wrapShapeLayer(this.backLayer, 'back-outer-clip');
      this.topShapeClip = new SVGClip(topInnerLayer, shape);
      this.backShapeClip = new SVGClip(backInnerLayer, shape);
      this.bottomShapeClip = new SVGClip(this.bottomLayer, shape);
      if (this.getOption('topShadowCreatesShape')) {
        this.topShadowElement = this.setupDropShadow(shape, topInnerLayer);
      }
    } else {
      this.topShadowElement = this.findOrCreateLayer('top-shadow', topInnerLayer, 1);
    }

    this.topClip = new SVGClip(this.topLayer);
    this.backClip = new SVGClip(this.backLayer);
    this.backShadowElement = this.findOrCreateLayer('back-shadow', backInnerLayer, 1);
    this.backReflectionElement = this.findOrCreateLayer('back-reflection', backInnerLayer, 2);
    this.bottomShadowElement = this.findOrCreateLayer('bottom-shadow', this.bottomLayer, 1);
    this.usesBoxShadow = !shape;
  }

  Peel.prototype.setupDropShadow = function(shape, parent) {
    var svg = createSVGElement('svg', parent, {
      'class': prefix('layer')
    });
    createSVGElement(shape.type, svg, shape.attributes);
    return svg;
  }

  Peel.prototype.wrapShapeLayer = function(el, id) {
    var zIndex = getZIndex(el);
    addClass(el, prefix('shape-layer'));
    var outerLayer = this.findOrCreateLayer(id, this.el, zIndex);
    outerLayer.appendChild(el);
    return outerLayer;
  }

  Peel.prototype.setupDimensions = function() {
    this.width = this.el.offsetWidth;
    this.height = this.el.offsetHeight;
    this.center = new Point(this.width / 2, this.height / 2);
    this.elementBox = this.getScaledBox(1);
    this.clippingBox = this.getScaledBox(this.getOption('clippingBoxScale'));
  }

  Peel.prototype.getScaledBox = function(scale) {
    var brScale = scale;
    var tlScale = scale - 1;
    var tl = new Point(-this.width * tlScale, -this.height * tlScale);
    var tr = new Point( this.width * brScale, -this.height * tlScale);
    var br = new Point( this.width * brScale, this.height * brScale);
    var bl = new Point(-this.width * tlScale, this.height * brScale);
    return [
      new LineSegment(tl, tr),
      new LineSegment(tr, br),
      new LineSegment(br, bl),
      new LineSegment(bl, tl)
    ];
  }

  Peel.prototype.getConstrainedPeelPosition = function(pos) {
    this.constraints.forEach(function(area) {
      var offset = this.getFlipConstraintOffset(area, pos);
      if (offset) {
        area = new Circle(area.center, area.radius - offset);
      }
      pos = area.constrainPoint(pos);
    }, this);
    return pos;
  }

  Peel.prototype.getFlipConstraintOffset = function(area, pos) {
    var offset = this.getOption('flipConstraintOffset');
    if (area === this.flipConstraint && offset) {
      var cornerToCenter = this.corner.subtract(this.center);
      var cornerToConstraint = this.corner.subtract(area.center);
      var baseAngle = cornerToConstraint.getAngle();
      var nCornerToConstraint = cornerToConstraint.rotate(-baseAngle);
      var nPosToConstraint = pos.subtract(area.center).rotate(-baseAngle);
      if (cornerToCenter.x * cornerToCenter.y < 0) {
        nPosToConstraint.y *= -1;
      }
      if (nPosToConstraint.x > 0 && nPosToConstraint.y > 0) {
        return normalize(nPosToConstraint.getAngle(), 45, 0) * offset;
      }
    }
  }

  Peel.prototype.getPeelLineSegment = function(point) {
    var halfToCorner = this.corner.subtract(point).scale(.5);
    var midpoint = point.add(halfToCorner);
    if (halfToCorner.x === 0 && halfToCorner.y === 0) {
      halfToCorner = point.subtract(this.center);
    }
    var l = halfToCorner.getLength()
    var mult = (Math.max(this.width, this.height) / l) * 10;
    var half = halfToCorner.rotate(-90).scale(mult);
    var p1 = midpoint.add(half);
    var p2 = midpoint.subtract(half);
    return new LineSegment(p1, p2);
  }

  Peel.prototype.setBackTransform = function(pos) {
    var mirroredCorner = this.flipPointHorizontally(this.corner);
    var r = (this.peelLineRotation - 90) * 2;
    var t = pos.subtract(mirroredCorner.rotate(r));
    var css = 'translate('+ round(t.x) +'px, '+ round(t.y) +'px) rotate('+ round(r) +'deg)';
    setTransform(this.backLayer, css);
    setTransform(this.topShadowElement, css);
  }

  Peel.prototype.getPeelLineDistance = function() {
    var cornerId, opposingCornerId, corner, opposingCorner;
    if (this.peelLineRotation < 90) {
      cornerId = Peel.Corners.TOP_RIGHT;
      opposingCornerId = Peel.Corners.BOTTOM_LEFT;
    } else if (this.peelLineRotation < 180) {
      cornerId = Peel.Corners.BOTTOM_RIGHT;
      opposingCornerId = Peel.Corners.TOP_LEFT;
    } else if (this.peelLineRotation < 270) {
      cornerId = Peel.Corners.BOTTOM_LEFT;
      opposingCornerId = Peel.Corners.TOP_RIGHT;
    } else if (this.peelLineRotation < 360) {
      cornerId = Peel.Corners.TOP_LEFT;
      opposingCornerId = Peel.Corners.BOTTOM_RIGHT;
    }
    corner = this.getCornerPoint(cornerId);
    opposingCorner = this.getCornerPoint(opposingCornerId);
    var cornerToCorner = new LineSegment(corner, opposingCorner).scale(2);
    var intersect = this.peelLineSegment.getIntersectPoint(cornerToCorner);
    if (!intersect) {
      return 2;
    }
    var distanceToPeelLine = corner.subtract(intersect).getLength();
    var totalDistance = corner.subtract(opposingCorner).getLength();
    return (distanceToPeelLine / totalDistance);
  }

  Peel.prototype.setEffects = function() {
    var t = this.getPeelLineDistance();
    this.setTopShadow(t);
    this.setBackShadow(t);
    this.setBackReflection(t);
    this.setBottomShadow(t);
    this.setFade();
  }

  Peel.prototype.setTopShadow = function(t) {
    if (!this.getOption('topShadow')) {
      return;
    }
    var sBlur = this.getOption('topShadowBlur');
    var sX = this.getOption('topShadowOffsetX');
    var sY = this.getOption('topShadowOffsetY');
    var alpha = this.getOption('topShadowAlpha');
    var sAlpha = this.exponential(t, 5, alpha);
    if (this.usesBoxShadow) {
      setBoxShadow(this.topShadowElement, sX, sY, sBlur, 0, sAlpha);
    } else {
      setDropShadow(this.topShadowElement, sX, sY, sBlur, sAlpha);
    }
  }

  Peel.prototype.distributeOrLinear = function(n, dist, mult) {
    if (dist) {
      return distribute(n, mult);
    } else {
      return n * mult;
    }
  }

  Peel.prototype.exponential = function(n, exp, mult) {
    return mult * clamp(Math.pow(1 + n, exp) - 1);
  }

  Peel.prototype.setBackReflection = function(t) {
    var stops = [];
    if (this.canSetLinearEffect('backReflection', t)) {
      var rDistribute = this.getOption('backReflectionDistribute');
      var rSize = this.getOption('backReflectionSize');
      var rOffset = this.getOption('backReflectionOffset');
      var rAlpha = this.getOption('backReflectionAlpha');
      var reflectionSize = this.distributeOrLinear(t, rDistribute, rSize);
      var rStop = t - rOffset;
      var rMid = rStop - reflectionSize;
      var rStart = rMid - reflectionSize;
      stops.push(getWhiteStop(0, 0));
      stops.push(getWhiteStop(0, rStart));
      stops.push(getWhiteStop(rAlpha, rMid));
      stops.push(getWhiteStop(0, rStop));
    }
    setBackgroundGradient(this.backReflectionElement, 180 - this.peelLineRotation, stops);
  }

  Peel.prototype.setBackShadow = function(t) {
    var stops = [];
    if (this.canSetLinearEffect('backShadow', t)) {
      var sSize = this.getOption('backShadowSize');
      var sOffset = this.getOption('backShadowOffset');
      var sAlpha = this.getOption('backShadowAlpha');
      var sDistribute = this.getOption('backShadowDistribute');
      var shadowSize = this.distributeOrLinear(t, sDistribute, sSize);
      var shadowStop = t - sOffset;
      var shadowMid = shadowStop - shadowSize;
      var shadowStart = shadowMid - shadowSize;
      stops.push(getBlackStop(0, 0));
      stops.push(getBlackStop(0, shadowStart));
      stops.push(getBlackStop(sAlpha, shadowMid));
      stops.push(getBlackStop(sAlpha, shadowStop));
    }
    setBackgroundGradient(this.backShadowElement, 180 - this.peelLineRotation, stops);
  }

  Peel.prototype.setBottomShadow = function(t) {
    var stops = [];
    if (this.canSetLinearEffect('bottomShadow', t)) {
      var sSize = this.getOption('bottomShadowSize');
      var offset = this.getOption('bottomShadowOffset');
      var darkAlpha = this.getOption('bottomShadowDarkAlpha');
      var lightAlpha = this.getOption('bottomShadowLightAlpha');
      var sDistribute = this.getOption('bottomShadowDistribute');
      var darkShadowStart = t - (.025 - offset);
      var midShadowStart = darkShadowStart - (this.distributeOrLinear(t, sDistribute, .03) * sSize) - offset;
      var lightShadowStart = midShadowStart - ((.02 * sSize) - offset);
      stops = [
        getBlackStop(0, 0),
        getBlackStop(0, lightShadowStart),
        getBlackStop(lightAlpha, midShadowStart),
        getBlackStop(lightAlpha, darkShadowStart),
        getBlackStop(darkAlpha, t)
      ];
    }
    setBackgroundGradient(this.bottomShadowElement, this.peelLineRotation + 180, stops);
  }

  Peel.prototype.canSetLinearEffect = function(name, t) {
    return this.getOption(name) && t > 0;
  }

  Peel.prototype.setFade = function() {
    var threshold = this.fadeThreshold, opacity = 1, n;
    if (threshold) {
      if (this.timeAlongPath !== undefined) {
        n = this.timeAlongPath;
      } else {
        n = this.getAmountClipped();
      }
      if (n > threshold) {
        opacity = (1 - n) / (1 - threshold);
      }
      setOpacity(this.topLayer, opacity);
      setOpacity(this.backLayer, opacity);
      setOpacity(this.bottomShadowElement, opacity);
    }
  }

  Peel.prototype.flipPointHorizontally = function(p) {
    return new Point(p.x - ((p.x - this.center.x) * 2), p.y);
  }

  Peel.prototype.init = function() {
    if (this.getOption('setPeelOnInit')) {
      this.setPeelPosition(this.corner);
    }
    addClass(this.el, prefix('ready'));
  }

  function SVGClip (el, shape) {
    this.el = el;
    this.shape = SVGClip.createClipPath(el, shape || {
      'type': 'polygon'
    });
    setTransform(this.el, 'translate(0px,0px)');
  }

  SVGClip.getDefs = function() {
    if (!this.defs) {
      this.svg = createSVGElement('svg', null, {
        'class': prefix('svg-clip-element')
      });
      this.defs = createSVGElement('defs', this.svg);
    }
    return this.defs;
  }

  SVGClip.createClipPath = function(el, obj) {
    var id = SVGClip.getId();
    var clipPath = createSVGElement('clipPath', this.getDefs());
    var svgEl = createSVGElement(obj.type, clipPath, obj.attributes);
    setSVGAttribute(clipPath, 'id', id);
    setCSSClip(el, 'url(#' + id + ')');
    return svgEl;
  }

  SVGClip.getId = function() {
    if (!SVGClip.id) {
      SVGClip.id = 1;
    }
    return 'svg-clip-' + SVGClip.id++;
  }

  SVGClip.prototype.setPoints = function(points) {
    var str = points.map(function(p) {
      return round(p.x) + ',' + round(p.y);
    }).join(' ');
    setSVGAttribute(this.shape, 'points', str);
  }

  function Circle (center, radius) {
    this.center = center;
    this.radius = radius;
  }

  Circle.prototype.containsPoint = function(p) {
    if(this.boundingRectContainsPoint(p)) {
      var dx = this.center.x - p.x;
      var dy = this.center.y - p.y;
      dx *= dx;
      dy *= dy;
      var distanceSquared = dx + dy;
      var radiusSquared = this.radius * this.radius;
      return distanceSquared <= radiusSquared;
    }
    return false;
  }

  Circle.prototype.boundingRectContainsPoint = function(p) {
    return p.x >= this.center.x - this.radius && p.x <= this.center.x + this.radius &&
      p.y >= this.center.y - this.radius && p.y <= this.center.y + this.radius;
  }

  Circle.prototype.constrainPoint = function(p) {
    if (!this.containsPoint(p)) {
      var rotation = p.subtract(this.center).getAngle();
      p = this.center.add(new Point(this.radius, 0).rotate(rotation));
    }
    return p;
  }

  function Polygon() {
    this.points = [];
  }

  Polygon.getArea = function(points) {
    var sum1 = 0, sum2 = 0;
    points.forEach(function(p, i, arr) {
      var next = arr[(i + 1) % arr.length];
      sum1 += (p.x * next.y);
      sum2 += (p.y * next.x);
    });
    return (sum1 - sum2) / 2;
  }

  Polygon.prototype.addPoint = function(point) {
    this.points.push(point);
  }

  Polygon.prototype.getPoints = function() {
    return this.points;
  }

  function BezierCurve (p1, c1, c2, p2) {
    this.p1 = p1;
    this.c1 = c1;
    this.p2 = p2;
    this.c2 = c2;
  }

  BezierCurve.prototype.getPointForTime = function(t) {
    var b0 = Math.pow(1 - t, 3);
    var b1 = 3 * t * Math.pow(1 - t, 2);
    var b2 = 3 * Math.pow(t, 2) * (1 - t);
    var b3 = Math.pow(t, 3);
    var x = (b0 * this.p1.x) + (b1 * this.c1.x) + (b2 * this.c2.x) + (b3 * this.p2.x)
    var y = (b0 * this.p1.y) + (b1 * this.c1.y) + (b2 * this.c2.y) + (b3 * this.p2.y)
    return new Point(x, y);
  }

  function LineSegment (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  LineSegment.EPSILON = 1e-6;

  LineSegment.prototype.getPointForTime = function(t) {
    return this.p1.add(this.getVector().scale(t));
  }

  LineSegment.prototype.scale = function(n) {
    var half = 1 + (n / 2);
    var p1 = this.p1.add(this.p2.subtract(this.p1).scale(n));
    var p2 = this.p2.add(this.p1.subtract(this.p2).scale(n));
    return new LineSegment(p1, p2);
  }

  LineSegment.prototype.getPointDeterminant = function(p) {
    var d = ((p.x - this.p1.x) * (this.p2.y - this.p1.y)) - ((p.y - this.p1.y) * (this.p2.x - this.p1.x));
    if (d > -LineSegment.EPSILON && d < LineSegment.EPSILON) {
      d = 0;
    }
    return d;
  }

  LineSegment.prototype.getIntersectPoint = function(seg2) {
    var seg1 = this;
    function crossProduct(p1, p2) {
      return p1.x * p2.y - p1.y * p2.x;
    }
    var r = seg1.p2.subtract(seg1.p1);
    var s = seg2.p2.subtract(seg2.p1);
    var uNumerator = crossProduct(seg2.p1.subtract(seg1.p1), r);
    var denominator = crossProduct(r, s);
    if (denominator == 0) {
      return null;
    }
    var u = uNumerator / denominator;
    var t = crossProduct(seg2.p1.subtract(seg1.p1), s) / denominator;
    if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
      return seg1.p1.add(r.scale(t));
    }
    return null;
  }

  LineSegment.prototype.getAngle = function() {
    return this.getVector().getAngle();
  }

  LineSegment.prototype.getVector = function() {
    if (!this.vector) {
      this.vector = this.p2.subtract(this.p1);
    }
    return this.vector;
  }

  function Point (x, y) {
    this.x = x;
    this.y = y;
  }

  Point.DEGREES_IN_RADIANS = 180 / Math.PI;

  Point.degToRad = function(deg) {
    return deg / Point.DEGREES_IN_RADIANS;
  };

  Point.radToDeg = function(rad) {
    var deg = rad * Point.DEGREES_IN_RADIANS;
    while(deg < 0) deg += 360;
    return deg;
  };

  Point.vector = function(deg, len) {
    var rad = Point.degToRad(deg);
    return new Point(Math.cos(rad) * len, Math.sin(rad) * len);
  };

  Point.prototype.add = function(p) {
    return new Point(this.x + p.x, this.y + p.y);
  };

  Point.prototype.subtract = function(p) {
    return new Point(this.x - p.x, this.y - p.y);
  };

  Point.prototype.scale = function(n) {
    return new Point(this.x * n, this.y * n);
  };

  Point.prototype.getLength = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  };

  Point.prototype.getAngle = function() {
    return Point.radToDeg(Math.atan2(this.y, this.x));
  };

  Point.prototype.setAngle = function(deg) {
    return Point.vector(deg, this.getLength());
  };

  Point.prototype.rotate = function(deg) {
    return this.setAngle(this.getAngle() + deg);
  };

  setCssProperties();
  win.Peel = Peel;
})(typeof window !== 'undefined' ? window : {});

export default typeof window !== 'undefined' ? window.Peel : null;
