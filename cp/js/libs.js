'use strict';

/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.2
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2013-11-25
 * @link    http://jscolor.com
 */

var jscolor = {

	dir: '/' + ADMIN_DIR + '/images/jscolor/', // location of jscolor directory (leave empty to autodetect)
	bindClass: 'jscolor', // class name
	binding: true, // automatic binding via <input class="...">
	preloading: true, // use image preloading?

	install: function install() {
		this.init();
	},

	init: function init() {
		if (jscolor.binding) {
			jscolor.bind();
		}
		if (jscolor.preloading) {
			jscolor.preload();
		}
	},

	getDir: function getDir() {
		if (!jscolor.dir) {
			var detected = jscolor.detectDir();
			jscolor.dir = detected !== false ? detected : 'jscolor/';
		}
		return jscolor.dir;
	},

	detectDir: function detectDir() {
		var base = location.href;

		var e = document.getElementsByTagName('base');
		for (var i = 0; i < e.length; i += 1) {
			if (e[i].href) {
				base = e[i].href;
			}
		}

		var e = document.getElementsByTagName('script');
		for (var i = 0; i < e.length; i += 1) {
			if (e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
				var src = new jscolor.URI(e[i].src);
				var srcAbs = src.toAbsolute(base);
				srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
				srcAbs.query = null;
				srcAbs.fragment = null;
				return srcAbs.toString();
			}
		}
		return false;
	},

	bind: function bind() {
		var matchClass = new RegExp('(^|\\s)(' + jscolor.bindClass + ')\\s*(\\{[^}]*\\})?', 'i');
		var e = document.getElementsByTagName('input');
		for (var i = 0; i < e.length; i += 1) {
			var m;
			if (!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if (m[3]) {
					try {
						prop = new Function('return (' + m[3] + ')')();
					} catch (eInvalidProp) {}
				}
				e[i].color = new jscolor.color(e[i], prop);
			}
		}
	},

	preload: function preload() {
		for (var fn in jscolor.imgRequire) {
			if (jscolor.imgRequire.hasOwnProperty(fn)) {
				jscolor.loadImage(fn);
			}
		}
	},

	images: {
		pad: [181, 101],
		sld: [16, 101],
		cross: [15, 15],
		arrow: [7, 11]
	},

	imgRequire: {},
	imgLoaded: {},

	requireImage: function requireImage(filename) {
		jscolor.imgRequire[filename] = true;
	},

	loadImage: function loadImage(filename) {
		if (!jscolor.imgLoaded[filename]) {
			jscolor.imgLoaded[filename] = new Image();
			jscolor.imgLoaded[filename].src = jscolor.getDir() + filename;
		}
	},

	fetchElement: function fetchElement(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	},

	addEvent: function addEvent(el, evnt, func) {
		if (el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + evnt, func);
		}
	},

	fireEvent: function fireEvent(el, evnt) {
		if (!el) {
			return;
		}
		if (document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if (document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on' + evnt, ev);
		} else if (el['on' + evnt]) {
			// alternatively use the traditional event model (IE5)
			el['on' + evnt]();
		}
	},

	getElementPos: function getElementPos(e) {
		var e1 = e,
		    e2 = e;
		var x = 0,
		    y = 0;
		if (e1.offsetParent) {
			do {
				x += e1.offsetLeft;
				y += e1.offsetTop;
			} while (e1 = e1.offsetParent);
		}
		while ((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
			x -= e2.scrollLeft;
			y -= e2.scrollTop;
		}
		return [x, y];
	},

	getElementSize: function getElementSize(e) {
		return [e.offsetWidth, e.offsetHeight];
	},

	getRelMousePos: function getRelMousePos(e) {
		var x = 0,
		    y = 0;
		if (!e) {
			e = window.event;
		}
		if (typeof e.offsetX === 'number') {
			x = e.offsetX;
			y = e.offsetY;
		} else if (typeof e.layerX === 'number') {
			x = e.layerX;
			y = e.layerY;
		}
		return { x: x, y: y };
	},

	getViewPos: function getViewPos() {
		if (typeof window.pageYOffset === 'number') {
			return [window.pageXOffset, window.pageYOffset];
		} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop];
		} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		} else {
			return [0, 0];
		}
	},

	getViewSize: function getViewSize() {
		if (typeof window.innerWidth === 'number') {
			return [window.innerWidth, window.innerHeight];
		} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight];
		} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		} else {
			return [0, 0];
		}
	},

	URI: function URI(uri) {
		// See RFC3986

		this.scheme = null;
		this.authority = null;
		this.path = '';
		this.query = null;
		this.fragment = null;

		this.parse = function (uri) {
			var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = m[3] ? m[2] : null;
			this.authority = m[5] ? m[6] : null;
			this.path = m[7];
			this.query = m[9] ? m[10] : null;
			this.fragment = m[12] ? m[13] : null;
			return this;
		};

		this.toString = function () {
			var result = '';
			if (this.scheme !== null) {
				result = result + this.scheme + ':';
			}
			if (this.authority !== null) {
				result = result + '//' + this.authority;
			}
			if (this.path !== null) {
				result = result + this.path;
			}
			if (this.query !== null) {
				result = result + '?' + this.query;
			}
			if (this.fragment !== null) {
				result = result + '#' + this.fragment;
			}
			return result;
		};

		this.toAbsolute = function (base) {
			var base = new jscolor.URI(base);
			var r = this;
			var t = new jscolor.URI();

			if (base.scheme === null) {
				return false;
			}

			if (r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
				r.scheme = null;
			}

			if (r.scheme !== null) {
				t.scheme = r.scheme;
				t.authority = r.authority;
				t.path = removeDotSegments(r.path);
				t.query = r.query;
			} else {
				if (r.authority !== null) {
					t.authority = r.authority;
					t.path = removeDotSegments(r.path);
					t.query = r.query;
				} else {
					if (r.path === '') {
						t.path = base.path;
						if (r.query !== null) {
							t.query = r.query;
						} else {
							t.query = base.query;
						}
					} else {
						if (r.path.substr(0, 1) === '/') {
							t.path = removeDotSegments(r.path);
						} else {
							if (base.authority !== null && base.path === '') {
								t.path = '/' + r.path;
							} else {
								t.path = base.path.replace(/[^\/]+$/, '') + r.path;
							}
							t.path = removeDotSegments(t.path);
						}
						t.query = r.query;
					}
					t.authority = base.authority;
				}
				t.scheme = base.scheme;
			}
			t.fragment = r.fragment;

			return t;
		};

		function removeDotSegments(path) {
			var out = '';
			while (path) {
				if (path.substr(0, 3) === '../' || path.substr(0, 2) === './') {
					path = path.replace(/^\.+/, '').substr(1);
				} else if (path.substr(0, 3) === '/./' || path === '/.') {
					path = '/' + path.substr(3);
				} else if (path.substr(0, 4) === '/../' || path === '/..') {
					path = '/' + path.substr(4);
					out = out.replace(/\/?[^\/]*$/, '');
				} else if (path === '.' || path === '..') {
					path = '';
				} else {
					var rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					out = out + rm;
				}
			}
			return out;
		}

		if (uri) {
			this.parse(uri);
		}
	},

	//
	// Usage example:
	// var myColor = new jscolor.color(myInputElement)
	//

	color: function color(target, prop) {

		this.required = true; // refuse empty values?
		this.adjust = true; // adjust value to uniform notation?
		this.hash = false; // prefix color with # symbol?
		this.caps = true; // uppercase?
		this.slider = true; // show the value/saturation slider?
		this.valueElement = target; // value holder
		this.styleElement = target; // where to reflect current color
		this.onImmediateChange = null; // onchange callback (can be either string or function)
		this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
		this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1
		this.minH = 0; // read-only  0-6
		this.maxH = 6; // read-only  0-6
		this.minS = 0; // read-only  0-1
		this.maxS = 1; // read-only  0-1
		this.minV = 0; // read-only  0-1
		this.maxV = 1; // read-only  0-1

		this.pickerOnfocus = true; // display picker on focus?
		this.pickerMode = 'HSV'; // HSV | HVS
		this.pickerPosition = 'bottom'; // left | right | top | bottom
		this.pickerSmartPosition = true; // automatically adjust picker position when necessary
		this.pickerButtonHeight = 20; // px
		this.pickerClosable = false;
		this.pickerCloseText = 'Close';
		this.pickerButtonColor = 'ButtonText'; // px
		this.pickerFace = 10; // px
		this.pickerFaceColor = 'ThreeDFace'; // CSS color
		this.pickerBorder = 1; // px
		this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
		this.pickerInset = 1; // px
		this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
		this.pickerZIndex = 10000;

		for (var p in prop) {
			if (prop.hasOwnProperty(p)) {
				this[p] = prop[p];
			}
		}

		this.hidePicker = function () {
			if (isPickerOwner()) {
				removePicker();
			}
		};

		this.showPicker = function () {
			if (!isPickerOwner()) {
				var tp = jscolor.getElementPos(target); // target pos
				var ts = jscolor.getElementSize(target); // target size
				var vp = jscolor.getViewPos(); // view pos
				var vs = jscolor.getViewSize(); // view size
				var ps = getPickerDims(this); // picker size
				var a, b, c;
				switch (this.pickerPosition.toLowerCase()) {
					case 'left':
						a = 1;b = 0;c = -1;break;
					case 'right':
						a = 1;b = 0;c = 1;break;
					case 'top':
						a = 0;b = 1;c = -1;break;
					default:
						a = 0;b = 1;c = 1;break;
				}
				var l = (ts[b] + ps[b]) / 2;

				// picker pos
				if (!this.pickerSmartPosition) {
					var pp = [tp[a], tp[b] + ts[b] - l + l * c];
				} else {
					var pp = [-vp[a] + tp[a] + ps[a] > vs[a] ? -vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a] : tp[a], -vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ? -vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c];
				}
				drawPicker(pp[a], pp[b]);
			}
		};

		this.importColor = function () {
			if (!valueElement) {
				this.exportColor();
			} else {
				if (!this.adjust) {
					if (!this.fromString(valueElement.value, leaveValue)) {
						styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
						styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
						styleElement.style.color = styleElement.jscStyle.color;
						this.exportColor(leaveValue | leaveStyle);
					}
				} else if (!this.required && /^\s*$/.test(valueElement.value)) {
					valueElement.value = '';
					styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
					styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
					styleElement.style.color = styleElement.jscStyle.color;
					this.exportColor(leaveValue | leaveStyle);
				} else if (this.fromString(valueElement.value)) {
					// OK
				} else {
					this.exportColor();
				}
			}
		};

		this.exportColor = function (flags) {
			if (!(flags & leaveValue) && valueElement) {
				var value = this.toString();
				if (this.caps) {
					value = value.toUpperCase();
				}
				if (this.hash) {
					value = '#' + value;
				}
				valueElement.value = value;
			}
			if (!(flags & leaveStyle) && styleElement) {
				styleElement.style.backgroundImage = "none";
				styleElement.style.backgroundColor = '#' + this.toString();
				styleElement.style.color = 0.213 * this.rgb[0] + 0.715 * this.rgb[1] + 0.072 * this.rgb[2] < 0.5 ? '#FFF' : '#000';
			}
			if (!(flags & leavePad) && isPickerOwner()) {
				redrawPad();
			}
			if (!(flags & leaveSld) && isPickerOwner()) {
				redrawSld();
			}
		};

		this.fromHSV = function (h, s, v, flags) {
			// null = don't change
			if (h !== null) {
				h = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, h));
			}
			if (s !== null) {
				s = Math.max(0.0, this.minS, Math.min(1.0, this.maxS, s));
			}
			if (v !== null) {
				v = Math.max(0.0, this.minV, Math.min(1.0, this.maxV, v));
			}

			this.rgb = HSV_RGB(h === null ? this.hsv[0] : this.hsv[0] = h, s === null ? this.hsv[1] : this.hsv[1] = s, v === null ? this.hsv[2] : this.hsv[2] = v);

			this.exportColor(flags);
		};

		this.fromRGB = function (r, g, b, flags) {
			// null = don't change
			if (r !== null) {
				r = Math.max(0.0, Math.min(1.0, r));
			}
			if (g !== null) {
				g = Math.max(0.0, Math.min(1.0, g));
			}
			if (b !== null) {
				b = Math.max(0.0, Math.min(1.0, b));
			}

			var hsv = RGB_HSV(r === null ? this.rgb[0] : r, g === null ? this.rgb[1] : g, b === null ? this.rgb[2] : b);
			if (hsv[0] !== null) {
				this.hsv[0] = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, hsv[0]));
			}
			if (hsv[2] !== 0) {
				this.hsv[1] = hsv[1] === null ? null : Math.max(0.0, this.minS, Math.min(1.0, this.maxS, hsv[1]));
			}
			this.hsv[2] = hsv[2] === null ? null : Math.max(0.0, this.minV, Math.min(1.0, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
			this.rgb[0] = rgb[0];
			this.rgb[1] = rgb[1];
			this.rgb[2] = rgb[2];

			this.exportColor(flags);
		};

		this.fromString = function (hex, flags) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if (!m) {
				return false;
			} else {
				if (m[1].length === 6) {
					// 6-char notation
					this.fromRGB(parseInt(m[1].substr(0, 2), 16) / 255, parseInt(m[1].substr(2, 2), 16) / 255, parseInt(m[1].substr(4, 2), 16) / 255, flags);
				} else {
					// 3-char notation
					this.fromRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16) / 255, parseInt(m[1].charAt(1) + m[1].charAt(1), 16) / 255, parseInt(m[1].charAt(2) + m[1].charAt(2), 16) / 255, flags);
				}
				return true;
			}
		};

		this.toString = function () {
			return (0x100 | Math.round(255 * this.rgb[0])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[1])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[2])).toString(16).substr(1);
		};

		function RGB_HSV(r, g, b) {
			var n = Math.min(Math.min(r, g), b);
			var v = Math.max(Math.max(r, g), b);
			var m = v - n;
			if (m === 0) {
				return [null, 0, v];
			}
			var h = r === n ? 3 + (b - g) / m : g === n ? 5 + (r - b) / m : 1 + (g - r) / m;
			return [h === 6 ? 0 : h, m / v, v];
		}

		function HSV_RGB(h, s, v) {
			if (h === null) {
				return [v, v, v];
			}
			var i = Math.floor(h);
			var f = i % 2 ? h - i : 1 - (h - i);
			var m = v * (1 - s);
			var n = v * (1 - s * f);
			switch (i) {
				case 6:
				case 0:
					return [v, n, m];
				case 1:
					return [n, v, m];
				case 2:
					return [m, v, n];
				case 3:
					return [m, n, v];
				case 4:
					return [n, m, v];
				case 5:
					return [v, m, n];
			}
		}

		function removePicker() {
			jscolor.picker.owner.styleElement.parentNode.removeChild(jscolor.picker.boxB);
			delete jscolor.picker.owner;
		}

		function drawPicker(x, y) {
			if (!jscolor.picker) {
				jscolor.picker = {
					box: document.createElement('div'),
					boxB: document.createElement('div'),
					pad: document.createElement('div'),
					padB: document.createElement('div'),
					padM: document.createElement('div'),
					sld: document.createElement('div'),
					sldB: document.createElement('div'),
					sldM: document.createElement('div'),
					btn: document.createElement('div'),
					btnS: document.createElement('span'),
					btnT: document.createTextNode(THIS.pickerCloseText)
				};
				for (var i = 0, segSize = 4; i < jscolor.images.sld[1]; i += segSize) {
					var seg = document.createElement('div');
					seg.style.height = segSize + 'px';
					seg.style.fontSize = '1px';
					seg.style.lineHeight = '0';
					jscolor.picker.sld.appendChild(seg);
				}
				jscolor.picker.sldB.appendChild(jscolor.picker.sld);
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);
				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
				jscolor.picker.btn.appendChild(jscolor.picker.btnS);
				jscolor.picker.box.appendChild(jscolor.picker.btn);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
			}

			var p = jscolor.picker;

			// controls interaction
			p.box.onmouseup = p.box.onmouseout = function () {
				target.focus();
			};
			p.box.onmousedown = function () {
				abortBlur = true;
			};
			p.box.onmousemove = function (e) {
				if (holdPad || holdSld) {
					holdPad && setPad(e);
					holdSld && setSld(e);
					if (document.selection) {
						document.selection.empty();
					} else if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					dispatchImmediateChange();
				}
			};
			if ('ontouchstart' in window) {
				// if touch device
				var handle_touchmove = function handle_touchmove(e) {
					var event = {
						'offsetX': e.touches[0].pageX - touchOffset.X,
						'offsetY': e.touches[0].pageY - touchOffset.Y
					};
					if (holdPad || holdSld) {
						holdPad && setPad(event);
						holdSld && setSld(event);
						dispatchImmediateChange();
					}
					e.stopPropagation(); // prevent move "view" on broswer
					e.preventDefault(); // prevent Default - Android Fix (else android generated only 1-2 touchmove events)
				};
				p.box.removeEventListener('touchmove', handle_touchmove, false);
				p.box.addEventListener('touchmove', handle_touchmove, false);
			}
			p.padM.onmouseup = p.padM.onmouseout = function () {
				if (holdPad) {
					holdPad = false;jscolor.fireEvent(valueElement, 'change');
				}
			};
			p.padM.onmousedown = function (e) {
				// if the slider is at the bottom, move it up
				switch (modeID) {
					case 0:
						if (THIS.hsv[2] === 0) {
							THIS.fromHSV(null, null, 1.0);
						};break;
					case 1:
						if (THIS.hsv[1] === 0) {
							THIS.fromHSV(null, 1.0, null);
						};break;
				}
				holdSld = false;
				holdPad = true;
				setPad(e);
				dispatchImmediateChange();
			};
			if ('ontouchstart' in window) {
				p.padM.addEventListener('touchstart', function (e) {
					touchOffset = {
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX': e.touches[0].pageX - touchOffset.X,
						'offsetY': e.touches[0].pageY - touchOffset.Y
					});
				});
			}
			p.sldM.onmouseup = p.sldM.onmouseout = function () {
				if (holdSld) {
					holdSld = false;jscolor.fireEvent(valueElement, 'change');
				}
			};
			p.sldM.onmousedown = function (e) {
				holdPad = false;
				holdSld = true;
				setSld(e);
				dispatchImmediateChange();
			};
			if ('ontouchstart' in window) {
				p.sldM.addEventListener('touchstart', function (e) {
					touchOffset = {
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX': e.touches[0].pageX - touchOffset.X,
						'offsetY': e.touches[0].pageY - touchOffset.Y
					});
				});
			}

			// picker
			var dims = getPickerDims(THIS);
			p.box.style.width = dims[0] + 'px';
			p.box.style.height = dims[1] + 'px';

			// picker border
			p.boxB.style.position = 'absolute';
			p.boxB.style.clear = 'both';
			p.boxB.style.left = '0px';
			p.boxB.style.top = '100%';
			p.boxB.style.marginTop = '2px';
			p.boxB.style.zIndex = THIS.pickerZIndex;
			p.boxB.style.border = THIS.pickerBorder + 'px solid';
			p.boxB.style.borderColor = THIS.pickerBorderColor;
			p.boxB.style.background = THIS.pickerFaceColor;

			// pad image
			p.pad.style.width = jscolor.images.pad[0] + 'px';
			p.pad.style.height = jscolor.images.pad[1] + 'px';

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.pickerFace + 'px';
			p.padB.style.top = '10px';
			p.padB.style.border = THIS.pickerInset + 'px solid';
			p.padB.style.borderColor = THIS.pickerInsetColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = '0';
			p.padM.style.top = '0';
			p.padM.style.width = THIS.pickerFace + 2 * THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
			p.padM.style.height = p.box.style.height;
			p.padM.style.cursor = 'crosshair';

			// slider image
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = jscolor.images.sld[0] + 'px';
			p.sld.style.height = jscolor.images.sld[1] + 'px';

			// slider border
			p.sldB.style.display = THIS.slider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.right = THIS.pickerFace + 'px';
			p.sldB.style.top = THIS.pickerFace + 'px';
			p.sldB.style.border = THIS.pickerInset + 'px solid';
			p.sldB.style.borderColor = THIS.pickerInsetColor;

			// slider mouse area
			p.sldM.style.display = THIS.slider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.right = '0';
			p.sldM.style.top = '0';
			p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2 * THIS.pickerInset + 'px';
			p.sldM.style.height = p.box.style.height;
			try {
				p.sldM.style.cursor = 'pointer';
			} catch (eOldIE) {
				p.sldM.style.cursor = 'hand';
			}

			// "close" button
			function setBtnBorder() {
				var insetColors = THIS.pickerInsetColor.split(/\s+/);
				var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = pickerOutsetColor;
			}
			p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
			p.btn.style.position = 'absolute';
			p.btn.style.left = THIS.pickerFace + 'px';
			p.btn.style.bottom = THIS.pickerFace + 'px';
			p.btn.style.padding = '0 15px';
			p.btn.style.height = '18px';
			p.btn.style.border = THIS.pickerInset + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.pickerButtonColor;
			p.btn.style.font = '12px sans-serif';
			p.btn.style.textAlign = 'center';
			try {
				p.btn.style.cursor = 'pointer';
			} catch (eOldIE) {
				p.btn.style.cursor = 'hand';
			}
			p.btn.onmousedown = function () {
				THIS.hidePicker();
			};
			p.btnS.style.lineHeight = p.btn.style.height;

			// load images in optimal order
			switch (modeID) {
				case 0:
					var padImg = 'hs.png';break;
				case 1:
					var padImg = 'hv.png';break;
			}
			p.padM.style.backgroundImage = "url('" + jscolor.getDir() + "cross.gif')";
			p.padM.style.backgroundRepeat = "no-repeat";
			p.sldM.style.backgroundImage = "url('" + jscolor.getDir() + "arrow.gif')";
			p.sldM.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundImage = "url('" + jscolor.getDir() + padImg + "')";
			p.pad.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundPosition = "0 0";

			// place pointers
			redrawPad();
			redrawSld();

			jscolor.picker.owner = THIS;

			jscolor.picker.owner.styleElement.parentNode.appendChild(p.boxB);
			// document.getElementsByTagName('body')[0].appendChild(p.boxB);
		}

		function getPickerDims(o) {
			var dims = [2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[0] + (o.slider ? 2 * o.pickerInset + 2 * jscolor.images.arrow[0] + jscolor.images.sld[0] : 0), o.pickerClosable ? 4 * o.pickerInset + 3 * o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight : 2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[1]];
			return dims;
		}

		function redrawPad() {
			// redraw the pad pointer
			switch (modeID) {
				case 0:
					var yComponent = 1;break;
				case 1:
					var yComponent = 2;break;
			}
			var x = Math.round(THIS.hsv[0] / 6 * (jscolor.images.pad[0] - 1));
			var y = Math.round((1 - THIS.hsv[yComponent]) * (jscolor.images.pad[1] - 1));
			jscolor.picker.padM.style.backgroundPosition = THIS.pickerFace + THIS.pickerInset + x - Math.floor(jscolor.images.cross[0] / 2) + 'px ' + (THIS.pickerFace + THIS.pickerInset + y - Math.floor(jscolor.images.cross[1] / 2)) + 'px';

			// redraw the slider image
			var seg = jscolor.picker.sld.childNodes;

			switch (modeID) {
				case 0:
					var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
					for (var i = 0; i < seg.length; i += 1) {
						seg[i].style.backgroundColor = 'rgb(' + rgb[0] * (1 - i / seg.length) * 100 + '%,' + rgb[1] * (1 - i / seg.length) * 100 + '%,' + rgb[2] * (1 - i / seg.length) * 100 + '%)';
					}
					break;
				case 1:
					var rgb,
					    s,
					    c = [THIS.hsv[2], 0, 0];
					var i = Math.floor(THIS.hsv[0]);
					var f = i % 2 ? THIS.hsv[0] - i : 1 - (THIS.hsv[0] - i);
					switch (i) {
						case 6:
						case 0:
							rgb = [0, 1, 2];break;
						case 1:
							rgb = [1, 0, 2];break;
						case 2:
							rgb = [2, 0, 1];break;
						case 3:
							rgb = [2, 1, 0];break;
						case 4:
							rgb = [1, 2, 0];break;
						case 5:
							rgb = [0, 2, 1];break;
					}
					for (var i = 0; i < seg.length; i += 1) {
						s = 1 - 1 / (seg.length - 1) * i;
						c[1] = c[0] * (1 - s * f);
						c[2] = c[0] * (1 - s);
						seg[i].style.backgroundColor = 'rgb(' + c[rgb[0]] * 100 + '%,' + c[rgb[1]] * 100 + '%,' + c[rgb[2]] * 100 + '%)';
					}
					break;
			}
		}

		function redrawSld() {
			// redraw the slider pointer
			switch (modeID) {
				case 0:
					var yComponent = 2;break;
				case 1:
					var yComponent = 1;break;
			}
			var y = Math.round((1 - THIS.hsv[yComponent]) * (jscolor.images.sld[1] - 1));
			jscolor.picker.sldM.style.backgroundPosition = '0 ' + (THIS.pickerFace + THIS.pickerInset + y - Math.floor(jscolor.images.arrow[1] / 2)) + 'px';
		}

		function isPickerOwner() {
			return jscolor.picker && jscolor.picker.owner === THIS;
		}

		function blurTarget() {
			if (valueElement === target) {
				THIS.importColor();
			}
			if (THIS.pickerOnfocus) {
				THIS.hidePicker();
			}
		}

		function blurValue() {
			if (valueElement !== target) {
				THIS.importColor();
			}
		}

		function setPad(e) {
			var mpos = jscolor.getRelMousePos(e);
			var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch (modeID) {
				case 0:
					THIS.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), 1 - y / (jscolor.images.pad[1] - 1), null, leaveSld);break;
				case 1:
					THIS.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), null, 1 - y / (jscolor.images.pad[1] - 1), leaveSld);break;
			}
		}

		function setSld(e) {
			var mpos = jscolor.getRelMousePos(e);
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch (modeID) {
				case 0:
					THIS.fromHSV(null, null, 1 - y / (jscolor.images.sld[1] - 1), leavePad);break;
				case 1:
					THIS.fromHSV(null, 1 - y / (jscolor.images.sld[1] - 1), null, leavePad);break;
			}
		}

		function dispatchImmediateChange() {
			if (THIS.onImmediateChange) {
				var callback;
				if (typeof THIS.onImmediateChange === 'string') {
					callback = new Function(THIS.onImmediateChange);
				} else {
					callback = THIS.onImmediateChange;
				}
				callback.call(THIS);
			}
		}

		var THIS = this;
		var modeID = this.pickerMode.toLowerCase() === 'hvs' ? 1 : 0;
		var abortBlur = false;
		var valueElement = jscolor.fetchElement(this.valueElement),
		    styleElement = jscolor.fetchElement(this.styleElement);
		var holdPad = false,
		    holdSld = false,
		    touchOffset = {};
		var leaveValue = 1 << 0,
		    leaveStyle = 1 << 1,
		    leavePad = 1 << 2,
		    leaveSld = 1 << 3;

		// target
		jscolor.addEvent(target, 'focus', function () {
			if (THIS.pickerOnfocus) {
				THIS.showPicker();
			}
		});
		jscolor.addEvent(target, 'blur', function () {
			if (!abortBlur) {
				window.setTimeout(function () {
					abortBlur || blurTarget();abortBlur = false;
				}, 0);
			} else {
				abortBlur = false;
			}
		});

		// valueElement
		if (valueElement) {
			var updateField = function updateField() {
				THIS.fromString(valueElement.value, leaveValue);
				dispatchImmediateChange();
			};
			jscolor.addEvent(valueElement, 'keyup', updateField);
			jscolor.addEvent(valueElement, 'input', updateField);
			jscolor.addEvent(valueElement, 'blur', blurValue);
			valueElement.setAttribute('autocomplete', 'off');
		}

		// styleElement
		if (styleElement) {
			styleElement.jscStyle = {
				backgroundImage: styleElement.style.backgroundImage,
				backgroundColor: styleElement.style.backgroundColor,
				color: styleElement.style.color
			};
		}

		// require images
		switch (modeID) {
			case 0:
				jscolor.requireImage('hs.png');break;
			case 1:
				jscolor.requireImage('hv.png');break;
		}
		jscolor.requireImage('cross.gif');
		jscolor.requireImage('arrow.gif');

		this.importColor();
	}

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9qc2NvbG9yLmpzIl0sIm5hbWVzIjpbImpzY29sb3IiLCJkaXIiLCJBRE1JTl9ESVIiLCJiaW5kQ2xhc3MiLCJiaW5kaW5nIiwicHJlbG9hZGluZyIsImluc3RhbGwiLCJpbml0IiwiYmluZCIsInByZWxvYWQiLCJnZXREaXIiLCJkZXRlY3RlZCIsImRldGVjdERpciIsImJhc2UiLCJsb2NhdGlvbiIsImhyZWYiLCJlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImkiLCJsZW5ndGgiLCJzcmMiLCJ0ZXN0IiwiVVJJIiwic3JjQWJzIiwidG9BYnNvbHV0ZSIsInBhdGgiLCJyZXBsYWNlIiwicXVlcnkiLCJmcmFnbWVudCIsInRvU3RyaW5nIiwibWF0Y2hDbGFzcyIsIlJlZ0V4cCIsIm0iLCJjb2xvciIsImNsYXNzTmFtZSIsIm1hdGNoIiwicHJvcCIsIkZ1bmN0aW9uIiwiZUludmFsaWRQcm9wIiwiZm4iLCJpbWdSZXF1aXJlIiwiaGFzT3duUHJvcGVydHkiLCJsb2FkSW1hZ2UiLCJpbWFnZXMiLCJwYWQiLCJzbGQiLCJjcm9zcyIsImFycm93IiwiaW1nTG9hZGVkIiwicmVxdWlyZUltYWdlIiwiZmlsZW5hbWUiLCJJbWFnZSIsImZldGNoRWxlbWVudCIsIm1peGVkIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudCIsImVsIiwiZXZudCIsImZ1bmMiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJmaXJlRXZlbnQiLCJjcmVhdGVFdmVudCIsImV2IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwiZ2V0RWxlbWVudFBvcyIsImUxIiwiZTIiLCJ4IiwieSIsIm9mZnNldFBhcmVudCIsIm9mZnNldExlZnQiLCJvZmZzZXRUb3AiLCJwYXJlbnROb2RlIiwibm9kZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNjcm9sbExlZnQiLCJzY3JvbGxUb3AiLCJnZXRFbGVtZW50U2l6ZSIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZ2V0UmVsTW91c2VQb3MiLCJ3aW5kb3ciLCJldmVudCIsIm9mZnNldFgiLCJvZmZzZXRZIiwibGF5ZXJYIiwibGF5ZXJZIiwiZ2V0Vmlld1BvcyIsInBhZ2VZT2Zmc2V0IiwicGFnZVhPZmZzZXQiLCJib2R5IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0Vmlld1NpemUiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsInVyaSIsInNjaGVtZSIsImF1dGhvcml0eSIsInBhcnNlIiwicmVzdWx0IiwiciIsInQiLCJ0b0xvd2VyQ2FzZSIsInJlbW92ZURvdFNlZ21lbnRzIiwic3Vic3RyIiwib3V0Iiwicm0iLCJ0YXJnZXQiLCJyZXF1aXJlZCIsImFkanVzdCIsImhhc2giLCJjYXBzIiwic2xpZGVyIiwidmFsdWVFbGVtZW50Iiwic3R5bGVFbGVtZW50Iiwib25JbW1lZGlhdGVDaGFuZ2UiLCJoc3YiLCJyZ2IiLCJtaW5IIiwibWF4SCIsIm1pblMiLCJtYXhTIiwibWluViIsIm1heFYiLCJwaWNrZXJPbmZvY3VzIiwicGlja2VyTW9kZSIsInBpY2tlclBvc2l0aW9uIiwicGlja2VyU21hcnRQb3NpdGlvbiIsInBpY2tlckJ1dHRvbkhlaWdodCIsInBpY2tlckNsb3NhYmxlIiwicGlja2VyQ2xvc2VUZXh0IiwicGlja2VyQnV0dG9uQ29sb3IiLCJwaWNrZXJGYWNlIiwicGlja2VyRmFjZUNvbG9yIiwicGlja2VyQm9yZGVyIiwicGlja2VyQm9yZGVyQ29sb3IiLCJwaWNrZXJJbnNldCIsInBpY2tlckluc2V0Q29sb3IiLCJwaWNrZXJaSW5kZXgiLCJwIiwiaGlkZVBpY2tlciIsImlzUGlja2VyT3duZXIiLCJyZW1vdmVQaWNrZXIiLCJzaG93UGlja2VyIiwidHAiLCJ0cyIsInZwIiwidnMiLCJwcyIsImdldFBpY2tlckRpbXMiLCJhIiwiYiIsImMiLCJsIiwicHAiLCJkcmF3UGlja2VyIiwiaW1wb3J0Q29sb3IiLCJleHBvcnRDb2xvciIsImZyb21TdHJpbmciLCJ2YWx1ZSIsImxlYXZlVmFsdWUiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImpzY1N0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwibGVhdmVTdHlsZSIsImZsYWdzIiwibGVhdmVQYWQiLCJyZWRyYXdQYWQiLCJsZWF2ZVNsZCIsInJlZHJhd1NsZCIsImZyb21IU1YiLCJoIiwicyIsInYiLCJNYXRoIiwibWF4IiwibWluIiwiSFNWX1JHQiIsImZyb21SR0IiLCJnIiwiUkdCX0hTViIsImhleCIsInBhcnNlSW50IiwiY2hhckF0Iiwicm91bmQiLCJuIiwiZmxvb3IiLCJmIiwicGlja2VyIiwib3duZXIiLCJyZW1vdmVDaGlsZCIsImJveEIiLCJib3giLCJjcmVhdGVFbGVtZW50IiwicGFkQiIsInBhZE0iLCJzbGRCIiwic2xkTSIsImJ0biIsImJ0blMiLCJidG5UIiwiY3JlYXRlVGV4dE5vZGUiLCJUSElTIiwic2VnU2l6ZSIsInNlZyIsImhlaWdodCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsImFwcGVuZENoaWxkIiwib25tb3VzZXVwIiwib25tb3VzZW91dCIsImZvY3VzIiwib25tb3VzZWRvd24iLCJhYm9ydEJsdXIiLCJvbm1vdXNlbW92ZSIsImhvbGRQYWQiLCJob2xkU2xkIiwic2V0UGFkIiwic2V0U2xkIiwic2VsZWN0aW9uIiwiZW1wdHkiLCJnZXRTZWxlY3Rpb24iLCJyZW1vdmVBbGxSYW5nZXMiLCJkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSIsImhhbmRsZV90b3VjaG1vdmUiLCJ0b3VjaGVzIiwicGFnZVgiLCJ0b3VjaE9mZnNldCIsIlgiLCJwYWdlWSIsIlkiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtb2RlSUQiLCJkaW1zIiwid2lkdGgiLCJwb3NpdGlvbiIsImNsZWFyIiwibGVmdCIsInRvcCIsIm1hcmdpblRvcCIsInpJbmRleCIsImJvcmRlciIsImJvcmRlckNvbG9yIiwiYmFja2dyb3VuZCIsImN1cnNvciIsIm92ZXJmbG93IiwiZGlzcGxheSIsInJpZ2h0IiwiZU9sZElFIiwic2V0QnRuQm9yZGVyIiwiaW5zZXRDb2xvcnMiLCJzcGxpdCIsInBpY2tlck91dHNldENvbG9yIiwiYm90dG9tIiwicGFkZGluZyIsImZvbnQiLCJ0ZXh0QWxpZ24iLCJwYWRJbWciLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFBvc2l0aW9uIiwibyIsInlDb21wb25lbnQiLCJjaGlsZE5vZGVzIiwiYmx1clRhcmdldCIsImJsdXJWYWx1ZSIsIm1wb3MiLCJjYWxsYmFjayIsImNhbGwiLCJzZXRUaW1lb3V0IiwidXBkYXRlRmllbGQiLCJzZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7O0FBV0EsSUFBSUEsVUFBVTs7QUFFYkMsWUFBVUMsU0FBVixxQkFGYSxFQUUwQjtBQUN2Q0MsWUFBWSxTQUhDLEVBR1U7QUFDdkJDLFVBQVUsSUFKRyxFQUlHO0FBQ2hCQyxhQUFhLElBTEEsRUFLTTs7QUFFbkJDLFVBQVUsbUJBQVc7QUFDcEIsT0FBS0MsSUFBTDtBQUNBLEVBVFk7O0FBV2JBLE9BQU8sZ0JBQVc7QUFDakIsTUFBR1AsUUFBUUksT0FBWCxFQUFvQjtBQUNuQkosV0FBUVEsSUFBUjtBQUNBO0FBQ0QsTUFBR1IsUUFBUUssVUFBWCxFQUF1QjtBQUN0QkwsV0FBUVMsT0FBUjtBQUNBO0FBQ0QsRUFsQlk7O0FBcUJiQyxTQUFTLGtCQUFXO0FBQ25CLE1BQUcsQ0FBQ1YsUUFBUUMsR0FBWixFQUFpQjtBQUNoQixPQUFJVSxXQUFXWCxRQUFRWSxTQUFSLEVBQWY7QUFDQVosV0FBUUMsR0FBUixHQUFjVSxhQUFXLEtBQVgsR0FBbUJBLFFBQW5CLEdBQThCLFVBQTVDO0FBQ0E7QUFDRCxTQUFPWCxRQUFRQyxHQUFmO0FBQ0EsRUEzQlk7O0FBOEJiVyxZQUFZLHFCQUFXO0FBQ3RCLE1BQUlDLE9BQU9DLFNBQVNDLElBQXBCOztBQUVBLE1BQUlDLElBQUlD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XG4gKiBqc2NvbG9yLCBKYXZhU2NyaXB0IENvbG9yIFBpY2tlclxyXG4gKlxyXG4gKiBAdmVyc2lvbiAxLjQuMlxyXG4gKiBAbGljZW5zZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UsIGh0dHA6Ly93d3cuZ251Lm9yZy9jb3B5bGVmdC9sZXNzZXIuaHRtbFxyXG4gKiBAYXV0aG9yICBKYW4gT2R2YXJrbywgaHR0cDovL29kdmFya28uY3pcclxuICogQGNyZWF0ZWQgMjAwOC0wNi0xNVxyXG4gKiBAdXBkYXRlZCAyMDEzLTExLTI1XHJcbiAqIEBsaW5rICAgIGh0dHA6Ly9qc2NvbG9yLmNvbVxyXG4gKi9cclxuXHJcbnZhciBqc2NvbG9yID0ge1xyXG5cclxuXHRkaXIgOiBgLyR7QURNSU5fRElSfS9pbWFnZXMvanNjb2xvci9gLCAvLyBsb2NhdGlvbiBvZiBqc2NvbG9yIGRpcmVjdG9yeSAobGVhdmUgZW1wdHkgdG8gYXV0b2RldGVjdClcclxuXHRiaW5kQ2xhc3MgOiAnanNjb2xvcicsIC8vIGNsYXNzIG5hbWVcclxuXHRiaW5kaW5nIDogdHJ1ZSwgLy8gYXV0b21hdGljIGJpbmRpbmcgdmlhIDxpbnB1dCBjbGFzcz1cIi4uLlwiPlxyXG5cdHByZWxvYWRpbmcgOiB0cnVlLCAvLyB1c2UgaW1hZ2UgcHJlbG9hZGluZz9cclxuXHJcblx0aW5zdGFsbCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fSxcclxuXHJcblx0aW5pdCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoanNjb2xvci5iaW5kaW5nKSB7XHJcblx0XHRcdGpzY29sb3IuYmluZCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYoanNjb2xvci5wcmVsb2FkaW5nKSB7XHJcblx0XHRcdGpzY29sb3IucHJlbG9hZCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRnZXREaXIgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCFqc2NvbG9yLmRpcikge1xyXG5cdFx0XHR2YXIgZGV0ZWN0ZWQgPSBqc2NvbG9yLmRldGVjdERpcigpO1xyXG5cdFx0XHRqc2NvbG9yLmRpciA9IGRldGVjdGVkIT09ZmFsc2UgPyBkZXRlY3RlZCA6ICdqc2NvbG9yLyc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ganNjb2xvci5kaXI7XHJcblx0fSxcclxuXHJcblxyXG5cdGRldGVjdERpciA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGJhc2UgPSBsb2NhdGlvbi5ocmVmO1xyXG5cclxuXHRcdHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKTtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGUubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdGlmKGVbaV0uaHJlZikgeyBiYXNlID0gZVtpXS5ocmVmOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxlLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRpZihlW2ldLnNyYyAmJiAvKF58XFwvKWpzY29sb3JcXC5qcyhbPyNdLiopPyQvaS50ZXN0KGVbaV0uc3JjKSkge1xyXG5cdFx0XHRcdHZhciBzcmMgPSBuZXcganNjb2xvci5VUkkoZVtpXS5zcmMpO1xyXG5cdFx0XHRcdHZhciBzcmNBYnMgPSBzcmMudG9BYnNvbHV0ZShiYXNlKTtcclxuXHRcdFx0XHRzcmNBYnMucGF0aCA9IHNyY0Ficy5wYXRoLnJlcGxhY2UoL1teXFwvXSskLywgJycpOyAvLyByZW1vdmUgZmlsZW5hbWVcclxuXHRcdFx0XHRzcmNBYnMucXVlcnkgPSBudWxsO1xyXG5cdFx0XHRcdHNyY0Ficy5mcmFnbWVudCA9IG51bGw7XHJcblx0XHRcdFx0cmV0dXJuIHNyY0Ficy50b1N0cmluZygpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblxyXG5cdGJpbmQgOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYXRjaENsYXNzID0gbmV3IFJlZ0V4cCgnKF58XFxcXHMpKCcranNjb2xvci5iaW5kQ2xhc3MrJylcXFxccyooXFxcXHtbXn1dKlxcXFx9KT8nLCAnaScpO1xyXG5cdFx0dmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKTtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGUubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdHZhciBtO1xyXG5cdFx0XHRpZighZVtpXS5jb2xvciAmJiBlW2ldLmNsYXNzTmFtZSAmJiAobSA9IGVbaV0uY2xhc3NOYW1lLm1hdGNoKG1hdGNoQ2xhc3MpKSkge1xyXG5cdFx0XHRcdHZhciBwcm9wID0ge307XHJcblx0XHRcdFx0aWYobVszXSkge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0cHJvcCA9IChuZXcgRnVuY3Rpb24gKCdyZXR1cm4gKCcgKyBtWzNdICsgJyknKSkoKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2goZUludmFsaWRQcm9wKSB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlW2ldLmNvbG9yID0gbmV3IGpzY29sb3IuY29sb3IoZVtpXSwgcHJvcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0cHJlbG9hZCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Zm9yKHZhciBmbiBpbiBqc2NvbG9yLmltZ1JlcXVpcmUpIHtcclxuXHRcdFx0aWYoanNjb2xvci5pbWdSZXF1aXJlLmhhc093blByb3BlcnR5KGZuKSkge1xyXG5cdFx0XHRcdGpzY29sb3IubG9hZEltYWdlKGZuKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRpbWFnZXMgOiB7XHJcblx0XHRwYWQgOiBbIDE4MSwgMTAxIF0sXHJcblx0XHRzbGQgOiBbIDE2LCAxMDEgXSxcclxuXHRcdGNyb3NzIDogWyAxNSwgMTUgXSxcclxuXHRcdGFycm93IDogWyA3LCAxMSBdXHJcblx0fSxcclxuXHJcblxyXG5cdGltZ1JlcXVpcmUgOiB7fSxcclxuXHRpbWdMb2FkZWQgOiB7fSxcclxuXHJcblxyXG5cdHJlcXVpcmVJbWFnZSA6IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcblx0XHRqc2NvbG9yLmltZ1JlcXVpcmVbZmlsZW5hbWVdID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHJcblx0bG9hZEltYWdlIDogZnVuY3Rpb24oZmlsZW5hbWUpIHtcclxuXHRcdGlmKCFqc2NvbG9yLmltZ0xvYWRlZFtmaWxlbmFtZV0pIHtcclxuXHRcdFx0anNjb2xvci5pbWdMb2FkZWRbZmlsZW5hbWVdID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGpzY29sb3IuaW1nTG9hZGVkW2ZpbGVuYW1lXS5zcmMgPSBqc2NvbG9yLmdldERpcigpK2ZpbGVuYW1lO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRmZXRjaEVsZW1lbnQgOiBmdW5jdGlvbihtaXhlZCkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiBtaXhlZCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtaXhlZCkgOiBtaXhlZDtcclxuXHR9LFxyXG5cclxuXHJcblx0YWRkRXZlbnQgOiBmdW5jdGlvbihlbCwgZXZudCwgZnVuYykge1xyXG5cdFx0aWYoZWwuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGV2bnQsIGZ1bmMsIGZhbHNlKTtcclxuXHRcdH0gZWxzZSBpZihlbC5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHRlbC5hdHRhY2hFdmVudCgnb24nK2V2bnQsIGZ1bmMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRmaXJlRXZlbnQgOiBmdW5jdGlvbihlbCwgZXZudCkge1xyXG5cdFx0aWYoIWVsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XHJcblx0XHRcdHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XHJcblx0XHRcdGV2LmluaXRFdmVudChldm50LCB0cnVlLCB0cnVlKTtcclxuXHRcdFx0ZWwuZGlzcGF0Y2hFdmVudChldik7XHJcblx0XHR9IGVsc2UgaWYoZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QpIHtcclxuXHRcdFx0dmFyIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcclxuXHRcdFx0ZWwuZmlyZUV2ZW50KCdvbicrZXZudCwgZXYpO1xyXG5cdFx0fSBlbHNlIGlmKGVsWydvbicrZXZudF0pIHsgLy8gYWx0ZXJuYXRpdmVseSB1c2UgdGhlIHRyYWRpdGlvbmFsIGV2ZW50IG1vZGVsIChJRTUpXHJcblx0XHRcdGVsWydvbicrZXZudF0oKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0RWxlbWVudFBvcyA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBlMT1lLCBlMj1lO1xyXG5cdFx0dmFyIHg9MCwgeT0wO1xyXG5cdFx0aWYoZTEub2Zmc2V0UGFyZW50KSB7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHR4ICs9IGUxLm9mZnNldExlZnQ7XHJcblx0XHRcdFx0eSArPSBlMS5vZmZzZXRUb3A7XHJcblx0XHRcdH0gd2hpbGUoZTEgPSBlMS5vZmZzZXRQYXJlbnQpO1xyXG5cdFx0fVxyXG5cdFx0d2hpbGUoKGUyID0gZTIucGFyZW50Tm9kZSkgJiYgZTIubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPT0gJ0JPRFknKSB7XHJcblx0XHRcdHggLT0gZTIuc2Nyb2xsTGVmdDtcclxuXHRcdFx0eSAtPSBlMi5zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gW3gsIHldO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRFbGVtZW50U2l6ZSA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHJldHVybiBbZS5vZmZzZXRXaWR0aCwgZS5vZmZzZXRIZWlnaHRdO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRSZWxNb3VzZVBvcyA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciB4ID0gMCwgeSA9IDA7XHJcblx0XHRpZiAoIWUpIHsgZSA9IHdpbmRvdy5ldmVudDsgfVxyXG5cdFx0aWYgKHR5cGVvZiBlLm9mZnNldFggPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHggPSBlLm9mZnNldFg7XHJcblx0XHRcdHkgPSBlLm9mZnNldFk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBlLmxheWVyWCA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0eCA9IGUubGF5ZXJYO1xyXG5cdFx0XHR5ID0gZS5sYXllclk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4geyB4OiB4LCB5OiB5IH07XHJcblx0fSxcclxuXHJcblxyXG5cdGdldFZpZXdQb3MgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cucGFnZVlPZmZzZXQgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHJldHVybiBbd2luZG93LnBhZ2VYT2Zmc2V0LCB3aW5kb3cucGFnZVlPZmZzZXRdO1xyXG5cdFx0fSBlbHNlIGlmKGRvY3VtZW50LmJvZHkgJiYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkpIHtcclxuXHRcdFx0cmV0dXJuIFtkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXTtcclxuXHRcdH0gZWxzZSBpZihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApKSB7XHJcblx0XHRcdHJldHVybiBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFswLCAwXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0Vmlld1NpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cuaW5uZXJXaWR0aCA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cmV0dXJuIFt3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0XTtcclxuXHRcdH0gZWxzZSBpZihkb2N1bWVudC5ib2R5ICYmIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSkge1xyXG5cdFx0XHRyZXR1cm4gW2RvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XTtcclxuXHRcdH0gZWxzZSBpZihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSkge1xyXG5cdFx0XHRyZXR1cm4gW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodF07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gWzAsIDBdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRVUkkgOiBmdW5jdGlvbih1cmkpIHsgLy8gU2VlIFJGQzM5ODZcclxuXHJcblx0XHR0aGlzLnNjaGVtZSA9IG51bGw7XHJcblx0XHR0aGlzLmF1dGhvcml0eSA9IG51bGw7XHJcblx0XHR0aGlzLnBhdGggPSAnJztcclxuXHRcdHRoaXMucXVlcnkgPSBudWxsO1xyXG5cdFx0dGhpcy5mcmFnbWVudCA9IG51bGw7XHJcblxyXG5cdFx0dGhpcy5wYXJzZSA9IGZ1bmN0aW9uKHVyaSkge1xyXG5cdFx0XHR2YXIgbSA9IHVyaS5tYXRjaCgvXigoW0EtWmEtel1bMC05QS1aYS16Ky4tXSopKDopKT8oKFxcL1xcLykoW15cXC8/I10qKSk/KFtePyNdKikoKFxcPykoW14jXSopKT8oKCMpKC4qKSk/Lyk7XHJcblx0XHRcdHRoaXMuc2NoZW1lID0gbVszXSA/IG1bMl0gOiBudWxsO1xyXG5cdFx0XHR0aGlzLmF1dGhvcml0eSA9IG1bNV0gPyBtWzZdIDogbnVsbDtcclxuXHRcdFx0dGhpcy5wYXRoID0gbVs3XTtcclxuXHRcdFx0dGhpcy5xdWVyeSA9IG1bOV0gPyBtWzEwXSA6IG51bGw7XHJcblx0XHRcdHRoaXMuZnJhZ21lbnQgPSBtWzEyXSA/IG1bMTNdIDogbnVsbDtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xyXG5cdFx0XHRpZih0aGlzLnNjaGVtZSAhPT0gbnVsbCkgeyByZXN1bHQgPSByZXN1bHQgKyB0aGlzLnNjaGVtZSArICc6JzsgfVxyXG5cdFx0XHRpZih0aGlzLmF1dGhvcml0eSAhPT0gbnVsbCkgeyByZXN1bHQgPSByZXN1bHQgKyAnLy8nICsgdGhpcy5hdXRob3JpdHk7IH1cclxuXHRcdFx0aWYodGhpcy5wYXRoICE9PSBudWxsKSB7IHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucGF0aDsgfVxyXG5cdFx0XHRpZih0aGlzLnF1ZXJ5ICE9PSBudWxsKSB7IHJlc3VsdCA9IHJlc3VsdCArICc/JyArIHRoaXMucXVlcnk7IH1cclxuXHRcdFx0aWYodGhpcy5mcmFnbWVudCAhPT0gbnVsbCkgeyByZXN1bHQgPSByZXN1bHQgKyAnIycgKyB0aGlzLmZyYWdtZW50OyB9XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMudG9BYnNvbHV0ZSA9IGZ1bmN0aW9uKGJhc2UpIHtcclxuXHRcdFx0dmFyIGJhc2UgPSBuZXcganNjb2xvci5VUkkoYmFzZSk7XHJcblx0XHRcdHZhciByID0gdGhpcztcclxuXHRcdFx0dmFyIHQgPSBuZXcganNjb2xvci5VUkk7XHJcblxyXG5cdFx0XHRpZihiYXNlLnNjaGVtZSA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHRcdGlmKHIuc2NoZW1lICE9PSBudWxsICYmIHIuc2NoZW1lLnRvTG93ZXJDYXNlKCkgPT09IGJhc2Uuc2NoZW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRyLnNjaGVtZSA9IG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHIuc2NoZW1lICE9PSBudWxsKSB7XHJcblx0XHRcdFx0dC5zY2hlbWUgPSByLnNjaGVtZTtcclxuXHRcdFx0XHR0LmF1dGhvcml0eSA9IHIuYXV0aG9yaXR5O1xyXG5cdFx0XHRcdHQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHIucGF0aCk7XHJcblx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoci5hdXRob3JpdHkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHQuYXV0aG9yaXR5ID0gci5hdXRob3JpdHk7XHJcblx0XHRcdFx0XHR0LnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyLnBhdGgpO1xyXG5cdFx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKHIucGF0aCA9PT0gJycpIHtcclxuXHRcdFx0XHRcdFx0dC5wYXRoID0gYmFzZS5wYXRoO1xyXG5cdFx0XHRcdFx0XHRpZihyLnF1ZXJ5ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dC5xdWVyeSA9IGJhc2UucXVlcnk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmKHIucGF0aC5zdWJzdHIoMCwxKSA9PT0gJy8nKSB7XHJcblx0XHRcdFx0XHRcdFx0dC5wYXRoID0gcmVtb3ZlRG90U2VnbWVudHMoci5wYXRoKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZihiYXNlLmF1dGhvcml0eSAhPT0gbnVsbCAmJiBiYXNlLnBhdGggPT09ICcnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0LnBhdGggPSAnLycrci5wYXRoO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0LnBhdGggPSBiYXNlLnBhdGgucmVwbGFjZSgvW15cXC9dKyQvLCcnKStyLnBhdGg7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHQucGF0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0LmF1dGhvcml0eSA9IGJhc2UuYXV0aG9yaXR5O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0LnNjaGVtZSA9IGJhc2Uuc2NoZW1lO1xyXG5cdFx0XHR9XHJcblx0XHRcdHQuZnJhZ21lbnQgPSByLmZyYWdtZW50O1xyXG5cclxuXHRcdFx0cmV0dXJuIHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpIHtcclxuXHRcdFx0dmFyIG91dCA9ICcnO1xyXG5cdFx0XHR3aGlsZShwYXRoKSB7XHJcblx0XHRcdFx0aWYocGF0aC5zdWJzdHIoMCwzKT09PScuLi8nIHx8IHBhdGguc3Vic3RyKDAsMik9PT0nLi8nKSB7XHJcblx0XHRcdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwuKy8sJycpLnN1YnN0cigxKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYocGF0aC5zdWJzdHIoMCwzKT09PScvLi8nIHx8IHBhdGg9PT0nLy4nKSB7XHJcblx0XHRcdFx0XHRwYXRoID0gJy8nK3BhdGguc3Vic3RyKDMpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihwYXRoLnN1YnN0cigwLDQpPT09Jy8uLi8nIHx8IHBhdGg9PT0nLy4uJykge1xyXG5cdFx0XHRcdFx0cGF0aCA9ICcvJytwYXRoLnN1YnN0cig0KTtcclxuXHRcdFx0XHRcdG91dCA9IG91dC5yZXBsYWNlKC9cXC8/W15cXC9dKiQvLCAnJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKHBhdGg9PT0nLicgfHwgcGF0aD09PScuLicpIHtcclxuXHRcdFx0XHRcdHBhdGggPSAnJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHJtID0gcGF0aC5tYXRjaCgvXlxcLz9bXlxcL10qLylbMF07XHJcblx0XHRcdFx0XHRwYXRoID0gcGF0aC5zdWJzdHIocm0ubGVuZ3RoKTtcclxuXHRcdFx0XHRcdG91dCA9IG91dCArIHJtO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gb3V0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKHVyaSkge1xyXG5cdFx0XHR0aGlzLnBhcnNlKHVyaSk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cclxuXHQvL1xyXG5cdC8vIFVzYWdlIGV4YW1wbGU6XHJcblx0Ly8gdmFyIG15Q29sb3IgPSBuZXcganNjb2xvci5jb2xvcihteUlucHV0RWxlbWVudClcclxuXHQvL1xyXG5cclxuXHRjb2xvciA6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcCkge1xyXG5cclxuXHJcblx0XHR0aGlzLnJlcXVpcmVkID0gdHJ1ZTsgLy8gcmVmdXNlIGVtcHR5IHZhbHVlcz9cclxuXHRcdHRoaXMuYWRqdXN0ID0gdHJ1ZTsgLy8gYWRqdXN0IHZhbHVlIHRvIHVuaWZvcm0gbm90YXRpb24/XHJcblx0XHR0aGlzLmhhc2ggPSBmYWxzZTsgLy8gcHJlZml4IGNvbG9yIHdpdGggIyBzeW1ib2w/XHJcblx0XHR0aGlzLmNhcHMgPSB0cnVlOyAvLyB1cHBlcmNhc2U/XHJcblx0XHR0aGlzLnNsaWRlciA9IHRydWU7IC8vIHNob3cgdGhlIHZhbHVlL3NhdHVyYXRpb24gc2xpZGVyP1xyXG5cdFx0dGhpcy52YWx1ZUVsZW1lbnQgPSB0YXJnZXQ7IC8vIHZhbHVlIGhvbGRlclxyXG5cdFx0dGhpcy5zdHlsZUVsZW1lbnQgPSB0YXJnZXQ7IC8vIHdoZXJlIHRvIHJlZmxlY3QgY3VycmVudCBjb2xvclxyXG5cdFx0dGhpcy5vbkltbWVkaWF0ZUNoYW5nZSA9IG51bGw7IC8vIG9uY2hhbmdlIGNhbGxiYWNrIChjYW4gYmUgZWl0aGVyIHN0cmluZyBvciBmdW5jdGlvbilcclxuXHRcdHRoaXMuaHN2ID0gWzAsIDAsIDFdOyAvLyByZWFkLW9ubHkgIDAtNiwgMC0xLCAwLTFcclxuXHRcdHRoaXMucmdiID0gWzEsIDEsIDFdOyAvLyByZWFkLW9ubHkgIDAtMSwgMC0xLCAwLTFcclxuXHRcdHRoaXMubWluSCA9IDA7IC8vIHJlYWQtb25seSAgMC02XHJcblx0XHR0aGlzLm1heEggPSA2OyAvLyByZWFkLW9ubHkgIDAtNlxyXG5cdFx0dGhpcy5taW5TID0gMDsgLy8gcmVhZC1vbmx5ICAwLTFcclxuXHRcdHRoaXMubWF4UyA9IDE7IC8vIHJlYWQtb25seSAgMC0xXHJcblx0XHR0aGlzLm1pblYgPSAwOyAvLyByZWFkLW9ubHkgIDAtMVxyXG5cdFx0dGhpcy5tYXhWID0gMTsgLy8gcmVhZC1vbmx5ICAwLTFcclxuXHJcblx0XHR0aGlzLnBpY2tlck9uZm9jdXMgPSB0cnVlOyAvLyBkaXNwbGF5IHBpY2tlciBvbiBmb2N1cz9cclxuXHRcdHRoaXMucGlja2VyTW9kZSA9ICdIU1YnOyAvLyBIU1YgfCBIVlNcclxuXHRcdHRoaXMucGlja2VyUG9zaXRpb24gPSAnYm90dG9tJzsgLy8gbGVmdCB8IHJpZ2h0IHwgdG9wIHwgYm90dG9tXHJcblx0XHR0aGlzLnBpY2tlclNtYXJ0UG9zaXRpb24gPSB0cnVlOyAvLyBhdXRvbWF0aWNhbGx5IGFkanVzdCBwaWNrZXIgcG9zaXRpb24gd2hlbiBuZWNlc3NhcnlcclxuXHRcdHRoaXMucGlja2VyQnV0dG9uSGVpZ2h0ID0gMjA7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckNsb3NhYmxlID0gZmFsc2U7XHJcblx0XHR0aGlzLnBpY2tlckNsb3NlVGV4dCA9ICdDbG9zZSc7XHJcblx0XHR0aGlzLnBpY2tlckJ1dHRvbkNvbG9yID0gJ0J1dHRvblRleHQnOyAvLyBweFxyXG5cdFx0dGhpcy5waWNrZXJGYWNlID0gMTA7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckZhY2VDb2xvciA9ICdUaHJlZURGYWNlJzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBpY2tlckJvcmRlciA9IDE7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckJvcmRlckNvbG9yID0gJ1RocmVlREhpZ2hsaWdodCBUaHJlZURTaGFkb3cgVGhyZWVEU2hhZG93IFRocmVlREhpZ2hsaWdodCc7IC8vIENTUyBjb2xvclxyXG5cdFx0dGhpcy5waWNrZXJJbnNldCA9IDE7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckluc2V0Q29sb3IgPSAnVGhyZWVEU2hhZG93IFRocmVlREhpZ2hsaWdodCBUaHJlZURIaWdobGlnaHQgVGhyZWVEU2hhZG93JzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBpY2tlclpJbmRleCA9IDEwMDAwO1xyXG5cclxuXHJcblx0XHRmb3IodmFyIHAgaW4gcHJvcCkge1xyXG5cdFx0XHRpZihwcm9wLmhhc093blByb3BlcnR5KHApKSB7XHJcblx0XHRcdFx0dGhpc1twXSA9IHByb3BbcF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dGhpcy5oaWRlUGlja2VyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHJlbW92ZVBpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnNob3dQaWNrZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIWlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHZhciB0cCA9IGpzY29sb3IuZ2V0RWxlbWVudFBvcyh0YXJnZXQpOyAvLyB0YXJnZXQgcG9zXHJcblx0XHRcdFx0dmFyIHRzID0ganNjb2xvci5nZXRFbGVtZW50U2l6ZSh0YXJnZXQpOyAvLyB0YXJnZXQgc2l6ZVxyXG5cdFx0XHRcdHZhciB2cCA9IGpzY29sb3IuZ2V0Vmlld1BvcygpOyAvLyB2aWV3IHBvc1xyXG5cdFx0XHRcdHZhciB2cyA9IGpzY29sb3IuZ2V0Vmlld1NpemUoKTsgLy8gdmlldyBzaXplXHJcblx0XHRcdFx0dmFyIHBzID0gZ2V0UGlja2VyRGltcyh0aGlzKTsgLy8gcGlja2VyIHNpemVcclxuXHRcdFx0XHR2YXIgYSwgYiwgYztcclxuXHRcdFx0XHRzd2l0Y2godGhpcy5waWNrZXJQb3NpdGlvbi50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsZWZ0JzogYT0xOyBiPTA7IGM9LTE7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOmE9MTsgYj0wOyBjPTE7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAndG9wJzogIGE9MDsgYj0xOyBjPS0xOyBicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6ICAgICBhPTA7IGI9MTsgYz0xOyBicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGwgPSAodHNbYl0rcHNbYl0pLzI7XHJcblxyXG5cdFx0XHRcdC8vIHBpY2tlciBwb3NcclxuXHRcdFx0XHRpZiAoIXRoaXMucGlja2VyU21hcnRQb3NpdGlvbikge1xyXG5cdFx0XHRcdFx0dmFyIHBwID0gW1xyXG5cdFx0XHRcdFx0XHR0cFthXSxcclxuXHRcdFx0XHRcdFx0dHBbYl0rdHNbYl0tbCtsKmNcclxuXHRcdFx0XHRcdF07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwcCA9IFtcclxuXHRcdFx0XHRcdFx0LXZwW2FdK3RwW2FdK3BzW2FdID4gdnNbYV0gP1xyXG5cdFx0XHRcdFx0XHRcdCgtdnBbYV0rdHBbYV0rdHNbYV0vMiA+IHZzW2FdLzIgJiYgdHBbYV0rdHNbYV0tcHNbYV0gPj0gMCA/IHRwW2FdK3RzW2FdLXBzW2FdIDogdHBbYV0pIDpcclxuXHRcdFx0XHRcdFx0XHR0cFthXSxcclxuXHRcdFx0XHRcdFx0LXZwW2JdK3RwW2JdK3RzW2JdK3BzW2JdLWwrbCpjID4gdnNbYl0gP1xyXG5cdFx0XHRcdFx0XHRcdCgtdnBbYl0rdHBbYl0rdHNbYl0vMiA+IHZzW2JdLzIgJiYgdHBbYl0rdHNbYl0tbC1sKmMgPj0gMCA/IHRwW2JdK3RzW2JdLWwtbCpjIDogdHBbYl0rdHNbYl0tbCtsKmMpIDpcclxuXHRcdFx0XHRcdFx0XHQodHBbYl0rdHNbYl0tbCtsKmMgPj0gMCA/IHRwW2JdK3RzW2JdLWwrbCpjIDogdHBbYl0rdHNbYl0tbC1sKmMpXHJcblx0XHRcdFx0XHRdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkcmF3UGlja2VyKHBwW2FdLCBwcFtiXSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuaW1wb3J0Q29sb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIXZhbHVlRWxlbWVudCkge1xyXG5cdFx0XHRcdHRoaXMuZXhwb3J0Q29sb3IoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZighdGhpcy5hZGp1c3QpIHtcclxuXHRcdFx0XHRcdGlmKCF0aGlzLmZyb21TdHJpbmcodmFsdWVFbGVtZW50LnZhbHVlLCBsZWF2ZVZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRzdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gc3R5bGVFbGVtZW50LmpzY1N0eWxlLmJhY2tncm91bmRJbWFnZTtcclxuXHRcdFx0XHRcdFx0c3R5bGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHN0eWxlRWxlbWVudC5qc2NTdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XHJcblx0XHRcdFx0XHRcdHN0eWxlRWxlbWVudC5zdHlsZS5jb2xvciA9IHN0eWxlRWxlbWVudC5qc2NTdHlsZS5jb2xvcjtcclxuXHRcdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcihsZWF2ZVZhbHVlIHwgbGVhdmVTdHlsZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmKCF0aGlzLnJlcXVpcmVkICYmIC9eXFxzKiQvLnRlc3QodmFsdWVFbGVtZW50LnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0dmFsdWVFbGVtZW50LnZhbHVlID0gJyc7XHJcblx0XHRcdFx0XHRzdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gc3R5bGVFbGVtZW50LmpzY1N0eWxlLmJhY2tncm91bmRJbWFnZTtcclxuXHRcdFx0XHRcdHN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBzdHlsZUVsZW1lbnQuanNjU3R5bGUuYmFja2dyb3VuZENvbG9yO1xyXG5cdFx0XHRcdFx0c3R5bGVFbGVtZW50LnN0eWxlLmNvbG9yID0gc3R5bGVFbGVtZW50LmpzY1N0eWxlLmNvbG9yO1xyXG5cdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcihsZWF2ZVZhbHVlIHwgbGVhdmVTdHlsZSk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZih0aGlzLmZyb21TdHJpbmcodmFsdWVFbGVtZW50LnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0Ly8gT0tcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5leHBvcnRDb2xvciA9IGZ1bmN0aW9uKGZsYWdzKSB7XHJcblx0XHRcdGlmKCEoZmxhZ3MgJiBsZWF2ZVZhbHVlKSAmJiB2YWx1ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSB0aGlzLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0aWYodGhpcy5jYXBzKSB7IHZhbHVlID0gdmFsdWUudG9VcHBlckNhc2UoKTsgfVxyXG5cdFx0XHRcdGlmKHRoaXMuaGFzaCkgeyB2YWx1ZSA9ICcjJyt2YWx1ZTsgfVxyXG5cdFx0XHRcdHZhbHVlRWxlbWVudC52YWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCEoZmxhZ3MgJiBsZWF2ZVN0eWxlKSAmJiBzdHlsZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRzdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJub25lXCI7XHJcblx0XHRcdFx0c3R5bGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XHJcblx0XHRcdFx0XHQnIycrdGhpcy50b1N0cmluZygpO1xyXG5cdFx0XHRcdHN0eWxlRWxlbWVudC5zdHlsZS5jb2xvciA9XHJcblx0XHRcdFx0XHQwLjIxMyAqIHRoaXMucmdiWzBdICtcclxuXHRcdFx0XHRcdDAuNzE1ICogdGhpcy5yZ2JbMV0gK1xyXG5cdFx0XHRcdFx0MC4wNzIgKiB0aGlzLnJnYlsyXVxyXG5cdFx0XHRcdFx0PCAwLjUgPyAnI0ZGRicgOiAnIzAwMCc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIShmbGFncyAmIGxlYXZlUGFkKSAmJiBpc1BpY2tlck93bmVyKCkpIHtcclxuXHRcdFx0XHRyZWRyYXdQYWQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighKGZsYWdzICYgbGVhdmVTbGQpICYmIGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHJlZHJhd1NsZCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmZyb21IU1YgPSBmdW5jdGlvbihoLCBzLCB2LCBmbGFncykgeyAvLyBudWxsID0gZG9uJ3QgY2hhbmdlXHJcblx0XHRcdGlmKGggIT09IG51bGwpIHsgaCA9IE1hdGgubWF4KDAuMCwgdGhpcy5taW5ILCBNYXRoLm1pbig2LjAsIHRoaXMubWF4SCwgaCkpOyB9XHJcblx0XHRcdGlmKHMgIT09IG51bGwpIHsgcyA9IE1hdGgubWF4KDAuMCwgdGhpcy5taW5TLCBNYXRoLm1pbigxLjAsIHRoaXMubWF4UywgcykpOyB9XHJcblx0XHRcdGlmKHYgIT09IG51bGwpIHsgdiA9IE1hdGgubWF4KDAuMCwgdGhpcy5taW5WLCBNYXRoLm1pbigxLjAsIHRoaXMubWF4ViwgdikpOyB9XHJcblxyXG5cdFx0XHR0aGlzLnJnYiA9IEhTVl9SR0IoXHJcblx0XHRcdFx0aD09PW51bGwgPyB0aGlzLmhzdlswXSA6ICh0aGlzLmhzdlswXT1oKSxcclxuXHRcdFx0XHRzPT09bnVsbCA/IHRoaXMuaHN2WzFdIDogKHRoaXMuaHN2WzFdPXMpLFxyXG5cdFx0XHRcdHY9PT1udWxsID8gdGhpcy5oc3ZbMl0gOiAodGhpcy5oc3ZbMl09dilcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdHRoaXMuZXhwb3J0Q29sb3IoZmxhZ3MpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5mcm9tUkdCID0gZnVuY3Rpb24ociwgZywgYiwgZmxhZ3MpIHsgLy8gbnVsbCA9IGRvbid0IGNoYW5nZVxyXG5cdFx0XHRpZihyICE9PSBudWxsKSB7IHIgPSBNYXRoLm1heCgwLjAsIE1hdGgubWluKDEuMCwgcikpOyB9XHJcblx0XHRcdGlmKGcgIT09IG51bGwpIHsgZyA9IE1hdGgubWF4KDAuMCwgTWF0aC5taW4oMS4wLCBnKSk7IH1cclxuXHRcdFx0aWYoYiAhPT0gbnVsbCkgeyBiID0gTWF0aC5tYXgoMC4wLCBNYXRoLm1pbigxLjAsIGIpKTsgfVxyXG5cclxuXHRcdFx0dmFyIGhzdiA9IFJHQl9IU1YoXHJcblx0XHRcdFx0cj09PW51bGwgPyB0aGlzLnJnYlswXSA6IHIsXHJcblx0XHRcdFx0Zz09PW51bGwgPyB0aGlzLnJnYlsxXSA6IGcsXHJcblx0XHRcdFx0Yj09PW51bGwgPyB0aGlzLnJnYlsyXSA6IGJcclxuXHRcdFx0KTtcclxuXHRcdFx0aWYoaHN2WzBdICE9PSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5oc3ZbMF0gPSBNYXRoLm1heCgwLjAsIHRoaXMubWluSCwgTWF0aC5taW4oNi4wLCB0aGlzLm1heEgsIGhzdlswXSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGhzdlsyXSAhPT0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaHN2WzFdID0gaHN2WzFdPT09bnVsbCA/IG51bGwgOiBNYXRoLm1heCgwLjAsIHRoaXMubWluUywgTWF0aC5taW4oMS4wLCB0aGlzLm1heFMsIGhzdlsxXSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuaHN2WzJdID0gaHN2WzJdPT09bnVsbCA/IG51bGwgOiBNYXRoLm1heCgwLjAsIHRoaXMubWluViwgTWF0aC5taW4oMS4wLCB0aGlzLm1heFYsIGhzdlsyXSkpO1xyXG5cclxuXHRcdFx0Ly8gdXBkYXRlIFJHQiBhY2NvcmRpbmcgdG8gZmluYWwgSFNWLCBhcyBzb21lIHZhbHVlcyBtaWdodCBiZSB0cmltbWVkXHJcblx0XHRcdHZhciByZ2IgPSBIU1ZfUkdCKHRoaXMuaHN2WzBdLCB0aGlzLmhzdlsxXSwgdGhpcy5oc3ZbMl0pO1xyXG5cdFx0XHR0aGlzLnJnYlswXSA9IHJnYlswXTtcclxuXHRcdFx0dGhpcy5yZ2JbMV0gPSByZ2JbMV07XHJcblx0XHRcdHRoaXMucmdiWzJdID0gcmdiWzJdO1xyXG5cclxuXHRcdFx0dGhpcy5leHBvcnRDb2xvcihmbGFncyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmZyb21TdHJpbmcgPSBmdW5jdGlvbihoZXgsIGZsYWdzKSB7XHJcblx0XHRcdHZhciBtID0gaGV4Lm1hdGNoKC9eXFxXKihbMC05QS1GXXszfShbMC05QS1GXXszfSk/KVxcVyokL2kpO1xyXG5cdFx0XHRpZighbSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZihtWzFdLmxlbmd0aCA9PT0gNikgeyAvLyA2LWNoYXIgbm90YXRpb25cclxuXHRcdFx0XHRcdHRoaXMuZnJvbVJHQihcclxuXHRcdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5zdWJzdHIoMCwyKSwxNikgLyAyNTUsXHJcblx0XHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uc3Vic3RyKDIsMiksMTYpIC8gMjU1LFxyXG5cdFx0XHRcdFx0XHRwYXJzZUludChtWzFdLnN1YnN0cig0LDIpLDE2KSAvIDI1NSxcclxuXHRcdFx0XHRcdFx0ZmxhZ3NcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fSBlbHNlIHsgLy8gMy1jaGFyIG5vdGF0aW9uXHJcblx0XHRcdFx0XHR0aGlzLmZyb21SR0IoXHJcblx0XHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uY2hhckF0KDApK21bMV0uY2hhckF0KDApLDE2KSAvIDI1NSxcclxuXHRcdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5jaGFyQXQoMSkrbVsxXS5jaGFyQXQoMSksMTYpIC8gMjU1LFxyXG5cdFx0XHRcdFx0XHRwYXJzZUludChtWzFdLmNoYXJBdCgyKSttWzFdLmNoYXJBdCgyKSwxNikgLyAyNTUsXHJcblx0XHRcdFx0XHRcdGZsYWdzXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdCgweDEwMCB8IE1hdGgucm91bmQoMjU1KnRoaXMucmdiWzBdKSkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSArXHJcblx0XHRcdFx0KDB4MTAwIHwgTWF0aC5yb3VuZCgyNTUqdGhpcy5yZ2JbMV0pKS50b1N0cmluZygxNikuc3Vic3RyKDEpICtcclxuXHRcdFx0XHQoMHgxMDAgfCBNYXRoLnJvdW5kKDI1NSp0aGlzLnJnYlsyXSkpLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSlcclxuXHRcdFx0KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIFJHQl9IU1YociwgZywgYikge1xyXG5cdFx0XHR2YXIgbiA9IE1hdGgubWluKE1hdGgubWluKHIsZyksYik7XHJcblx0XHRcdHZhciB2ID0gTWF0aC5tYXgoTWF0aC5tYXgocixnKSxiKTtcclxuXHRcdFx0dmFyIG0gPSB2IC0gbjtcclxuXHRcdFx0aWYobSA9PT0gMCkgeyByZXR1cm4gWyBudWxsLCAwLCB2IF07IH1cclxuXHRcdFx0dmFyIGggPSByPT09biA/IDMrKGItZykvbSA6IChnPT09biA/IDUrKHItYikvbSA6IDErKGctcikvbSk7XHJcblx0XHRcdHJldHVybiBbIGg9PT02PzA6aCwgbS92LCB2IF07XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIEhTVl9SR0IoaCwgcywgdikge1xyXG5cdFx0XHRpZihoID09PSBudWxsKSB7IHJldHVybiBbIHYsIHYsIHYgXTsgfVxyXG5cdFx0XHR2YXIgaSA9IE1hdGguZmxvb3IoaCk7XHJcblx0XHRcdHZhciBmID0gaSUyID8gaC1pIDogMS0oaC1pKTtcclxuXHRcdFx0dmFyIG0gPSB2ICogKDEgLSBzKTtcclxuXHRcdFx0dmFyIG4gPSB2ICogKDEgLSBzKmYpO1xyXG5cdFx0XHRzd2l0Y2goaSkge1xyXG5cdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRjYXNlIDA6IHJldHVybiBbdixuLG1dO1xyXG5cdFx0XHRcdGNhc2UgMTogcmV0dXJuIFtuLHYsbV07XHJcblx0XHRcdFx0Y2FzZSAyOiByZXR1cm4gW20sdixuXTtcclxuXHRcdFx0XHRjYXNlIDM6IHJldHVybiBbbSxuLHZdO1xyXG5cdFx0XHRcdGNhc2UgNDogcmV0dXJuIFtuLG0sdl07XHJcblx0XHRcdFx0Y2FzZSA1OiByZXR1cm4gW3YsbSxuXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiByZW1vdmVQaWNrZXIoKSB7XHJcblx0XHRcdGpzY29sb3IucGlja2VyLm93bmVyLnN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGpzY29sb3IucGlja2VyLmJveEIpO1xyXG5cdFx0XHRkZWxldGUganNjb2xvci5waWNrZXIub3duZXI7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGRyYXdQaWNrZXIoeCwgeSkge1xyXG5cdFx0XHRpZighanNjb2xvci5waWNrZXIpIHtcclxuXHRcdFx0XHRqc2NvbG9yLnBpY2tlciA9IHtcclxuXHRcdFx0XHRcdGJveCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0Ym94QiA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0cGFkIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRwYWRCIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRwYWRNIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRzbGQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdHNsZEIgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdHNsZE0gOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdGJ0biA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0YnRuUyA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcclxuXHRcdFx0XHRcdGJ0blQgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShUSElTLnBpY2tlckNsb3NlVGV4dClcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGZvcih2YXIgaT0wLHNlZ1NpemU9NDsgaTxqc2NvbG9yLmltYWdlcy5zbGRbMV07IGkrPXNlZ1NpemUpIHtcclxuXHRcdFx0XHRcdHZhciBzZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHRcdHNlZy5zdHlsZS5oZWlnaHQgPSBzZWdTaXplKydweCc7XHJcblx0XHRcdFx0XHRzZWcuc3R5bGUuZm9udFNpemUgPSAnMXB4JztcclxuXHRcdFx0XHRcdHNlZy5zdHlsZS5saW5lSGVpZ2h0ID0gJzAnO1xyXG5cdFx0XHRcdFx0anNjb2xvci5waWNrZXIuc2xkLmFwcGVuZENoaWxkKHNlZyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLnNsZEIuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuc2xkKTtcclxuXHRcdFx0XHRqc2NvbG9yLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuc2xkQik7XHJcblx0XHRcdFx0anNjb2xvci5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzY29sb3IucGlja2VyLnNsZE0pO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLnBhZEIuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIucGFkKTtcclxuXHRcdFx0XHRqc2NvbG9yLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIucGFkQik7XHJcblx0XHRcdFx0anNjb2xvci5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzY29sb3IucGlja2VyLnBhZE0pO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLmJ0blMuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuYnRuVCk7XHJcblx0XHRcdFx0anNjb2xvci5waWNrZXIuYnRuLmFwcGVuZENoaWxkKGpzY29sb3IucGlja2VyLmJ0blMpO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLmJveC5hcHBlbmRDaGlsZChqc2NvbG9yLnBpY2tlci5idG4pO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLmJveEIuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuYm94KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHAgPSBqc2NvbG9yLnBpY2tlcjtcclxuXHJcblx0XHRcdC8vIGNvbnRyb2xzIGludGVyYWN0aW9uXHJcblx0XHRcdHAuYm94Lm9ubW91c2V1cCA9XHJcblx0XHRcdHAuYm94Lm9ubW91c2VvdXQgPSBmdW5jdGlvbigpIHsgdGFyZ2V0LmZvY3VzKCk7IH07XHJcblx0XHRcdHAuYm94Lm9ubW91c2Vkb3duID0gZnVuY3Rpb24oKSB7IGFib3J0Qmx1cj10cnVlOyB9O1xyXG5cdFx0XHRwLmJveC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAoaG9sZFBhZCB8fCBob2xkU2xkKSB7XHJcblx0XHRcdFx0XHRob2xkUGFkICYmIHNldFBhZChlKTtcclxuXHRcdFx0XHRcdGhvbGRTbGQgJiYgc2V0U2xkKGUpO1xyXG5cdFx0XHRcdFx0aWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7IC8vIGlmIHRvdWNoIGRldmljZVxyXG5cdFx0XHRcdHZhciBoYW5kbGVfdG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50PXtcclxuXHRcdFx0XHRcdFx0J29mZnNldFgnOiBlLnRvdWNoZXNbMF0ucGFnZVgtdG91Y2hPZmZzZXQuWCxcclxuXHRcdFx0XHRcdFx0J29mZnNldFknOiBlLnRvdWNoZXNbMF0ucGFnZVktdG91Y2hPZmZzZXQuWVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGlmIChob2xkUGFkIHx8IGhvbGRTbGQpIHtcclxuXHRcdFx0XHRcdFx0aG9sZFBhZCAmJiBzZXRQYWQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRob2xkU2xkICYmIHNldFNsZChldmVudCk7XHJcblx0XHRcdFx0XHRcdGRpc3BhdGNoSW1tZWRpYXRlQ2hhbmdlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBwcmV2ZW50IG1vdmUgXCJ2aWV3XCIgb24gYnJvc3dlclxyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IERlZmF1bHQgLSBBbmRyb2lkIEZpeCAoZWxzZSBhbmRyb2lkIGdlbmVyYXRlZCBvbmx5IDEtMiB0b3VjaG1vdmUgZXZlbnRzKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cC5ib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlX3RvdWNobW92ZSwgZmFsc2UpXHJcblx0XHRcdFx0cC5ib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlX3RvdWNobW92ZSwgZmFsc2UpXHJcblx0XHRcdH1cclxuXHRcdFx0cC5wYWRNLm9ubW91c2V1cCA9XHJcblx0XHRcdHAucGFkTS5vbm1vdXNlb3V0ID0gZnVuY3Rpb24oKSB7IGlmKGhvbGRQYWQpIHsgaG9sZFBhZD1mYWxzZTsganNjb2xvci5maXJlRXZlbnQodmFsdWVFbGVtZW50LCdjaGFuZ2UnKTsgfSB9O1xyXG5cdFx0XHRwLnBhZE0ub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0Ly8gaWYgdGhlIHNsaWRlciBpcyBhdCB0aGUgYm90dG9tLCBtb3ZlIGl0IHVwXHJcblx0XHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdFx0Y2FzZSAwOiBpZiAoVEhJUy5oc3ZbMl0gPT09IDApIHsgVEhJUy5mcm9tSFNWKG51bGwsIG51bGwsIDEuMCk7IH07IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAxOiBpZiAoVEhJUy5oc3ZbMV0gPT09IDApIHsgVEhJUy5mcm9tSFNWKG51bGwsIDEuMCwgbnVsbCk7IH07IGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRob2xkU2xkPWZhbHNlO1xyXG5cdFx0XHRcdGhvbGRQYWQ9dHJ1ZTtcclxuXHRcdFx0XHRzZXRQYWQoZSk7XHJcblx0XHRcdFx0ZGlzcGF0Y2hJbW1lZGlhdGVDaGFuZ2UoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XHJcblx0XHRcdFx0cC5wYWRNLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHR0b3VjaE9mZnNldD17XHJcblx0XHRcdFx0XHRcdCdYJzogZS50YXJnZXQub2Zmc2V0UGFyZW50Lm9mZnNldExlZnQsXHJcblx0XHRcdFx0XHRcdCdZJzogZS50YXJnZXQub2Zmc2V0UGFyZW50Lm9mZnNldFRvcFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHRoaXMub25tb3VzZWRvd24oe1xyXG5cdFx0XHRcdFx0XHQnb2Zmc2V0WCc6ZS50b3VjaGVzWzBdLnBhZ2VYLXRvdWNoT2Zmc2V0LlgsXHJcblx0XHRcdFx0XHRcdCdvZmZzZXRZJzplLnRvdWNoZXNbMF0ucGFnZVktdG91Y2hPZmZzZXQuWVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cC5zbGRNLm9ubW91c2V1cCA9XHJcblx0XHRcdHAuc2xkTS5vbm1vdXNlb3V0ID0gZnVuY3Rpb24oKSB7IGlmKGhvbGRTbGQpIHsgaG9sZFNsZD1mYWxzZTsganNjb2xvci5maXJlRXZlbnQodmFsdWVFbGVtZW50LCdjaGFuZ2UnKTsgfSB9O1xyXG5cdFx0XHRwLnNsZE0ub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0aG9sZFBhZD1mYWxzZTtcclxuXHRcdFx0XHRob2xkU2xkPXRydWU7XHJcblx0XHRcdFx0c2V0U2xkKGUpO1xyXG5cdFx0XHRcdGRpc3BhdGNoSW1tZWRpYXRlQ2hhbmdlKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdGlmKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xyXG5cdFx0XHRcdHAuc2xkTS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0dG91Y2hPZmZzZXQ9e1xyXG5cdFx0XHRcdFx0XHQnWCc6IGUudGFyZ2V0Lm9mZnNldFBhcmVudC5vZmZzZXRMZWZ0LFxyXG5cdFx0XHRcdFx0XHQnWSc6IGUudGFyZ2V0Lm9mZnNldFBhcmVudC5vZmZzZXRUb3BcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR0aGlzLm9ubW91c2Vkb3duKHtcclxuXHRcdFx0XHRcdFx0J29mZnNldFgnOmUudG91Y2hlc1swXS5wYWdlWC10b3VjaE9mZnNldC5YLFxyXG5cdFx0XHRcdFx0XHQnb2Zmc2V0WSc6ZS50b3VjaGVzWzBdLnBhZ2VZLXRvdWNoT2Zmc2V0LllcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBwaWNrZXJcclxuXHRcdFx0dmFyIGRpbXMgPSBnZXRQaWNrZXJEaW1zKFRISVMpO1xyXG5cdFx0XHRwLmJveC5zdHlsZS53aWR0aCA9IGRpbXNbMF0gKyAncHgnO1xyXG5cdFx0XHRwLmJveC5zdHlsZS5oZWlnaHQgPSBkaW1zWzFdICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHBpY2tlciBib3JkZXJcclxuXHRcdFx0cC5ib3hCLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5ib3hCLnN0eWxlLmNsZWFyID0gJ2JvdGgnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUudG9wID0gJzEwMCUnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUubWFyZ2luVG9wID0gJzJweCc7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS56SW5kZXggPSBUSElTLnBpY2tlclpJbmRleDtcclxuXHRcdFx0cC5ib3hCLnN0eWxlLmJvcmRlciA9IFRISVMucGlja2VyQm9yZGVyKydweCBzb2xpZCc7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMucGlja2VyQm9yZGVyQ29sb3I7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS5iYWNrZ3JvdW5kID0gVEhJUy5waWNrZXJGYWNlQ29sb3I7XHJcblxyXG5cdFx0XHQvLyBwYWQgaW1hZ2VcclxuXHRcdFx0cC5wYWQuc3R5bGUud2lkdGggPSBqc2NvbG9yLmltYWdlcy5wYWRbMF0rJ3B4JztcclxuXHRcdFx0cC5wYWQuc3R5bGUuaGVpZ2h0ID0ganNjb2xvci5pbWFnZXMucGFkWzFdKydweCc7XHJcblxyXG5cdFx0XHQvLyBwYWQgYm9yZGVyXHJcblx0XHRcdHAucGFkQi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5sZWZ0ID0gVEhJUy5waWNrZXJGYWNlKydweCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS50b3AgPSAnMTBweCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5ib3JkZXIgPSBUSElTLnBpY2tlckluc2V0KydweCBzb2xpZCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMucGlja2VySW5zZXRDb2xvcjtcclxuXHJcblx0XHRcdC8vIHBhZCBtb3VzZSBhcmVhXHJcblx0XHRcdHAucGFkTS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5sZWZ0ID0gJzAnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUudG9wID0gJzAnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUud2lkdGggPSBUSElTLnBpY2tlckZhY2UgKyAyKlRISVMucGlja2VySW5zZXQgKyBqc2NvbG9yLmltYWdlcy5wYWRbMF0gKyBqc2NvbG9yLmltYWdlcy5hcnJvd1swXSArICdweCc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5oZWlnaHQgPSBwLmJveC5zdHlsZS5oZWlnaHQ7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJztcclxuXHJcblx0XHRcdC8vIHNsaWRlciBpbWFnZVxyXG5cdFx0XHRwLnNsZC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cdFx0XHRwLnNsZC5zdHlsZS53aWR0aCA9IGpzY29sb3IuaW1hZ2VzLnNsZFswXSsncHgnO1xyXG5cdFx0XHRwLnNsZC5zdHlsZS5oZWlnaHQgPSBqc2NvbG9yLmltYWdlcy5zbGRbMV0rJ3B4JztcclxuXHJcblx0XHRcdC8vIHNsaWRlciBib3JkZXJcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmRpc3BsYXkgPSBUSElTLnNsaWRlciA/ICdibG9jaycgOiAnbm9uZSc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5yaWdodCA9IFRISVMucGlja2VyRmFjZSsncHgnO1xyXG5cdFx0XHRwLnNsZEIuc3R5bGUudG9wID0gVEhJUy5waWNrZXJGYWNlKydweCc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5ib3JkZXIgPSBUSElTLnBpY2tlckluc2V0KydweCBzb2xpZCc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMucGlja2VySW5zZXRDb2xvcjtcclxuXHJcblx0XHRcdC8vIHNsaWRlciBtb3VzZSBhcmVhXHJcblx0XHRcdHAuc2xkTS5zdHlsZS5kaXNwbGF5ID0gVEhJUy5zbGlkZXIgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUucmlnaHQgPSAnMCc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS50b3AgPSAnMCc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS53aWR0aCA9IGpzY29sb3IuaW1hZ2VzLnNsZFswXSArIGpzY29sb3IuaW1hZ2VzLmFycm93WzBdICsgVEhJUy5waWNrZXJGYWNlICsgMipUSElTLnBpY2tlckluc2V0ICsgJ3B4JztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmhlaWdodCA9IHAuYm94LnN0eWxlLmhlaWdodDtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRwLnNsZE0uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG5cdFx0XHR9IGNhdGNoKGVPbGRJRSkge1xyXG5cdFx0XHRcdHAuc2xkTS5zdHlsZS5jdXJzb3IgPSAnaGFuZCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFwiY2xvc2VcIiBidXR0b25cclxuXHRcdFx0ZnVuY3Rpb24gc2V0QnRuQm9yZGVyKCkge1xyXG5cdFx0XHRcdHZhciBpbnNldENvbG9ycyA9IFRISVMucGlja2VySW5zZXRDb2xvci5zcGxpdCgvXFxzKy8pO1xyXG5cdFx0XHRcdHZhciBwaWNrZXJPdXRzZXRDb2xvciA9IGluc2V0Q29sb3JzLmxlbmd0aCA8IDIgPyBpbnNldENvbG9yc1swXSA6IGluc2V0Q29sb3JzWzFdICsgJyAnICsgaW5zZXRDb2xvcnNbMF0gKyAnICcgKyBpbnNldENvbG9yc1swXSArICcgJyArIGluc2V0Q29sb3JzWzFdO1xyXG5cdFx0XHRcdHAuYnRuLnN0eWxlLmJvcmRlckNvbG9yID0gcGlja2VyT3V0c2V0Q29sb3I7XHJcblx0XHRcdH1cclxuXHRcdFx0cC5idG4uc3R5bGUuZGlzcGxheSA9IFRISVMucGlja2VyQ2xvc2FibGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmxlZnQgPSBUSElTLnBpY2tlckZhY2UgKyAncHgnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5ib3R0b20gPSBUSElTLnBpY2tlckZhY2UgKyAncHgnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5wYWRkaW5nID0gJzAgMTVweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmhlaWdodCA9ICcxOHB4JztcclxuXHRcdFx0cC5idG4uc3R5bGUuYm9yZGVyID0gVEhJUy5waWNrZXJJbnNldCArICdweCBzb2xpZCc7XHJcblx0XHRcdHNldEJ0bkJvcmRlcigpO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5jb2xvciA9IFRISVMucGlja2VyQnV0dG9uQ29sb3I7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmZvbnQgPSAnMTJweCBzYW5zLXNlcmlmJztcclxuXHRcdFx0cC5idG4uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cC5idG4uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG5cdFx0XHR9IGNhdGNoKGVPbGRJRSkge1xyXG5cdFx0XHRcdHAuYnRuLnN0eWxlLmN1cnNvciA9ICdoYW5kJztcclxuXHRcdFx0fVxyXG5cdFx0XHRwLmJ0bi5vbm1vdXNlZG93biA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUSElTLmhpZGVQaWNrZXIoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0cC5idG5TLnN0eWxlLmxpbmVIZWlnaHQgPSBwLmJ0bi5zdHlsZS5oZWlnaHQ7XHJcblxyXG5cdFx0XHQvLyBsb2FkIGltYWdlcyBpbiBvcHRpbWFsIG9yZGVyXHJcblx0XHRcdHN3aXRjaChtb2RlSUQpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHZhciBwYWRJbWcgPSAnaHMucG5nJzsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB2YXIgcGFkSW1nID0gJ2h2LnBuZyc7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHAucGFkTS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnXCIranNjb2xvci5nZXREaXIoKStcImNyb3NzLmdpZicpXCI7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gXCJuby1yZXBlYXRcIjtcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCdcIitqc2NvbG9yLmdldERpcigpK1wiYXJyb3cuZ2lmJylcIjtcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSBcIm5vLXJlcGVhdFwiO1xyXG5cdFx0XHRwLnBhZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnXCIranNjb2xvci5nZXREaXIoKStwYWRJbWcrXCInKVwiO1xyXG5cdFx0XHRwLnBhZC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gXCJuby1yZXBlYXRcIjtcclxuXHRcdFx0cC5wYWQuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gXCIwIDBcIjtcclxuXHJcblx0XHRcdC8vIHBsYWNlIHBvaW50ZXJzXHJcblx0XHRcdHJlZHJhd1BhZCgpO1xyXG5cdFx0XHRyZWRyYXdTbGQoKTtcclxuXHJcblx0XHRcdGpzY29sb3IucGlja2VyLm93bmVyID0gVEhJUztcclxuXHJcblx0XHRcdGpzY29sb3IucGlja2VyLm93bmVyLnN0eWxlRWxlbWVudC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHAuYm94Qik7XHJcblx0XHRcdC8vIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQocC5ib3hCKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBnZXRQaWNrZXJEaW1zKG8pIHtcclxuXHRcdFx0dmFyIGRpbXMgPSBbXHJcblx0XHRcdFx0MipvLnBpY2tlckluc2V0ICsgMipvLnBpY2tlckZhY2UgKyBqc2NvbG9yLmltYWdlcy5wYWRbMF0gK1xyXG5cdFx0XHRcdFx0KG8uc2xpZGVyID8gMipvLnBpY2tlckluc2V0ICsgMipqc2NvbG9yLmltYWdlcy5hcnJvd1swXSArIGpzY29sb3IuaW1hZ2VzLnNsZFswXSA6IDApLFxyXG5cdFx0XHRcdG8ucGlja2VyQ2xvc2FibGUgP1xyXG5cdFx0XHRcdFx0NCpvLnBpY2tlckluc2V0ICsgMypvLnBpY2tlckZhY2UgKyBqc2NvbG9yLmltYWdlcy5wYWRbMV0gKyBvLnBpY2tlckJ1dHRvbkhlaWdodCA6XHJcblx0XHRcdFx0XHQyKm8ucGlja2VySW5zZXQgKyAyKm8ucGlja2VyRmFjZSArIGpzY29sb3IuaW1hZ2VzLnBhZFsxXVxyXG5cdFx0XHRdO1xyXG5cdFx0XHRyZXR1cm4gZGltcztcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVkcmF3UGFkKCkge1xyXG5cdFx0XHQvLyByZWRyYXcgdGhlIHBhZCBwb2ludGVyXHJcblx0XHRcdHN3aXRjaChtb2RlSUQpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHZhciB5Q29tcG9uZW50ID0gMTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB2YXIgeUNvbXBvbmVudCA9IDI7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB4ID0gTWF0aC5yb3VuZCgoVEhJUy5oc3ZbMF0vNikgKiAoanNjb2xvci5pbWFnZXMucGFkWzBdLTEpKTtcclxuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCgxLVRISVMuaHN2W3lDb21wb25lbnRdKSAqIChqc2NvbG9yLmltYWdlcy5wYWRbMV0tMSkpO1xyXG5cdFx0XHRqc2NvbG9yLnBpY2tlci5wYWRNLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9XHJcblx0XHRcdFx0KFRISVMucGlja2VyRmFjZStUSElTLnBpY2tlckluc2V0K3ggLSBNYXRoLmZsb29yKGpzY29sb3IuaW1hZ2VzLmNyb3NzWzBdLzIpKSArICdweCAnICtcclxuXHRcdFx0XHQoVEhJUy5waWNrZXJGYWNlK1RISVMucGlja2VySW5zZXQreSAtIE1hdGguZmxvb3IoanNjb2xvci5pbWFnZXMuY3Jvc3NbMV0vMikpICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgc2xpZGVyIGltYWdlXHJcblx0XHRcdHZhciBzZWcgPSBqc2NvbG9yLnBpY2tlci5zbGQuY2hpbGROb2RlcztcclxuXHJcblx0XHRcdHN3aXRjaChtb2RlSUQpIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHR2YXIgcmdiID0gSFNWX1JHQihUSElTLmhzdlswXSwgVEhJUy5oc3ZbMV0sIDEpO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8c2VnLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRcdFx0XHRzZWdbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYignK1xyXG5cdFx0XHRcdFx0XHRcdChyZ2JbMF0qKDEtaS9zZWcubGVuZ3RoKSoxMDApKyclLCcrXHJcblx0XHRcdFx0XHRcdFx0KHJnYlsxXSooMS1pL3NlZy5sZW5ndGgpKjEwMCkrJyUsJytcclxuXHRcdFx0XHRcdFx0XHQocmdiWzJdKigxLWkvc2VnLmxlbmd0aCkqMTAwKSsnJSknO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0dmFyIHJnYiwgcywgYyA9IFsgVEhJUy5oc3ZbMl0sIDAsIDAgXTtcclxuXHRcdFx0XHRcdHZhciBpID0gTWF0aC5mbG9vcihUSElTLmhzdlswXSk7XHJcblx0XHRcdFx0XHR2YXIgZiA9IGklMiA/IFRISVMuaHN2WzBdLWkgOiAxLShUSElTLmhzdlswXS1pKTtcclxuXHRcdFx0XHRcdHN3aXRjaChpKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRcdFx0Y2FzZSAwOiByZ2I9WzAsMSwyXTsgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMTogcmdiPVsxLDAsMl07IGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDI6IHJnYj1bMiwwLDFdOyBicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAzOiByZ2I9WzIsMSwwXTsgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgNDogcmdiPVsxLDIsMF07IGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDU6IHJnYj1bMCwyLDFdOyBicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvcih2YXIgaT0wOyBpPHNlZy5sZW5ndGg7IGkrPTEpIHtcclxuXHRcdFx0XHRcdFx0cyA9IDEgLSAxLyhzZWcubGVuZ3RoLTEpKmk7XHJcblx0XHRcdFx0XHRcdGNbMV0gPSBjWzBdICogKDEgLSBzKmYpO1xyXG5cdFx0XHRcdFx0XHRjWzJdID0gY1swXSAqICgxIC0gcyk7XHJcblx0XHRcdFx0XHRcdHNlZ1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKCcrXHJcblx0XHRcdFx0XHRcdFx0KGNbcmdiWzBdXSoxMDApKyclLCcrXHJcblx0XHRcdFx0XHRcdFx0KGNbcmdiWzFdXSoxMDApKyclLCcrXHJcblx0XHRcdFx0XHRcdFx0KGNbcmdiWzJdXSoxMDApKyclKSc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiByZWRyYXdTbGQoKSB7XHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgc2xpZGVyIHBvaW50ZXJcclxuXHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdGNhc2UgMDogdmFyIHlDb21wb25lbnQgPSAyOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHZhciB5Q29tcG9uZW50ID0gMTsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCgxLVRISVMuaHN2W3lDb21wb25lbnRdKSAqIChqc2NvbG9yLmltYWdlcy5zbGRbMV0tMSkpO1xyXG5cdFx0XHRqc2NvbG9yLnBpY2tlci5zbGRNLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9XHJcblx0XHRcdFx0JzAgJyArIChUSElTLnBpY2tlckZhY2UrVEhJUy5waWNrZXJJbnNldCt5IC0gTWF0aC5mbG9vcihqc2NvbG9yLmltYWdlcy5hcnJvd1sxXS8yKSkgKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpc1BpY2tlck93bmVyKCkge1xyXG5cdFx0XHRyZXR1cm4ganNjb2xvci5waWNrZXIgJiYganNjb2xvci5waWNrZXIub3duZXIgPT09IFRISVM7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGJsdXJUYXJnZXQoKSB7XHJcblx0XHRcdGlmKHZhbHVlRWxlbWVudCA9PT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0VEhJUy5pbXBvcnRDb2xvcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFRISVMucGlja2VyT25mb2N1cykge1xyXG5cdFx0XHRcdFRISVMuaGlkZVBpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGJsdXJWYWx1ZSgpIHtcclxuXHRcdFx0aWYodmFsdWVFbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRUSElTLmltcG9ydENvbG9yKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gc2V0UGFkKGUpIHtcclxuXHRcdFx0dmFyIG1wb3MgPSBqc2NvbG9yLmdldFJlbE1vdXNlUG9zKGUpO1xyXG5cdFx0XHR2YXIgeCA9IG1wb3MueCAtIFRISVMucGlja2VyRmFjZSAtIFRISVMucGlja2VySW5zZXQ7XHJcblx0XHRcdHZhciB5ID0gbXBvcy55IC0gVEhJUy5waWNrZXJGYWNlIC0gVEhJUy5waWNrZXJJbnNldDtcclxuXHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdGNhc2UgMDogVEhJUy5mcm9tSFNWKHgqKDYvKGpzY29sb3IuaW1hZ2VzLnBhZFswXS0xKSksIDEgLSB5Lyhqc2NvbG9yLmltYWdlcy5wYWRbMV0tMSksIG51bGwsIGxlYXZlU2xkKTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiBUSElTLmZyb21IU1YoeCooNi8oanNjb2xvci5pbWFnZXMucGFkWzBdLTEpKSwgbnVsbCwgMSAtIHkvKGpzY29sb3IuaW1hZ2VzLnBhZFsxXS0xKSwgbGVhdmVTbGQpOyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBzZXRTbGQoZSkge1xyXG5cdFx0XHR2YXIgbXBvcyA9IGpzY29sb3IuZ2V0UmVsTW91c2VQb3MoZSk7XHJcblx0XHRcdHZhciB5ID0gbXBvcy55IC0gVEhJUy5waWNrZXJGYWNlIC0gVEhJUy5waWNrZXJJbnNldDtcclxuXHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdGNhc2UgMDogVEhJUy5mcm9tSFNWKG51bGwsIG51bGwsIDEgLSB5Lyhqc2NvbG9yLmltYWdlcy5zbGRbMV0tMSksIGxlYXZlUGFkKTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiBUSElTLmZyb21IU1YobnVsbCwgMSAtIHkvKGpzY29sb3IuaW1hZ2VzLnNsZFsxXS0xKSwgbnVsbCwgbGVhdmVQYWQpOyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSgpIHtcclxuXHRcdFx0aWYgKFRISVMub25JbW1lZGlhdGVDaGFuZ2UpIHtcclxuXHRcdFx0XHR2YXIgY2FsbGJhY2s7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBUSElTLm9uSW1tZWRpYXRlQ2hhbmdlID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24gKFRISVMub25JbW1lZGlhdGVDaGFuZ2UpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayA9IFRISVMub25JbW1lZGlhdGVDaGFuZ2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoVEhJUyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dmFyIFRISVMgPSB0aGlzO1xyXG5cdFx0dmFyIG1vZGVJRCA9IHRoaXMucGlja2VyTW9kZS50b0xvd2VyQ2FzZSgpPT09J2h2cycgPyAxIDogMDtcclxuXHRcdHZhciBhYm9ydEJsdXIgPSBmYWxzZTtcclxuXHRcdHZhclxyXG5cdFx0XHR2YWx1ZUVsZW1lbnQgPSBqc2NvbG9yLmZldGNoRWxlbWVudCh0aGlzLnZhbHVlRWxlbWVudCksXHJcblx0XHRcdHN0eWxlRWxlbWVudCA9IGpzY29sb3IuZmV0Y2hFbGVtZW50KHRoaXMuc3R5bGVFbGVtZW50KTtcclxuXHRcdHZhclxyXG5cdFx0XHRob2xkUGFkID0gZmFsc2UsXHJcblx0XHRcdGhvbGRTbGQgPSBmYWxzZSxcclxuXHRcdFx0dG91Y2hPZmZzZXQgPSB7fTtcclxuXHRcdHZhclxyXG5cdFx0XHRsZWF2ZVZhbHVlID0gMTw8MCxcclxuXHRcdFx0bGVhdmVTdHlsZSA9IDE8PDEsXHJcblx0XHRcdGxlYXZlUGFkID0gMTw8MixcclxuXHRcdFx0bGVhdmVTbGQgPSAxPDwzO1xyXG5cclxuXHRcdC8vIHRhcmdldFxyXG5cdFx0anNjb2xvci5hZGRFdmVudCh0YXJnZXQsICdmb2N1cycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZihUSElTLnBpY2tlck9uZm9jdXMpIHsgVEhJUy5zaG93UGlja2VyKCk7IH1cclxuXHRcdH0pO1xyXG5cdFx0anNjb2xvci5hZGRFdmVudCh0YXJnZXQsICdibHVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCFhYm9ydEJsdXIpIHtcclxuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpeyBhYm9ydEJsdXIgfHwgYmx1clRhcmdldCgpOyBhYm9ydEJsdXI9ZmFsc2U7IH0sIDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFib3J0Qmx1ciA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyB2YWx1ZUVsZW1lbnRcclxuXHRcdGlmKHZhbHVlRWxlbWVudCkge1xyXG5cdFx0XHR2YXIgdXBkYXRlRmllbGQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRUSElTLmZyb21TdHJpbmcodmFsdWVFbGVtZW50LnZhbHVlLCBsZWF2ZVZhbHVlKTtcclxuXHRcdFx0XHRkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRqc2NvbG9yLmFkZEV2ZW50KHZhbHVlRWxlbWVudCwgJ2tleXVwJywgdXBkYXRlRmllbGQpO1xyXG5cdFx0XHRqc2NvbG9yLmFkZEV2ZW50KHZhbHVlRWxlbWVudCwgJ2lucHV0JywgdXBkYXRlRmllbGQpO1xyXG5cdFx0XHRqc2NvbG9yLmFkZEV2ZW50KHZhbHVlRWxlbWVudCwgJ2JsdXInLCBibHVyVmFsdWUpO1xyXG5cdFx0XHR2YWx1ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc3R5bGVFbGVtZW50XHJcblx0XHRpZihzdHlsZUVsZW1lbnQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmpzY1N0eWxlID0ge1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZSA6IHN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UsXHJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yIDogc3R5bGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvcixcclxuXHRcdFx0XHRjb2xvciA6IHN0eWxlRWxlbWVudC5zdHlsZS5jb2xvclxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHJlcXVpcmUgaW1hZ2VzXHJcblx0XHRzd2l0Y2gobW9kZUlEKSB7XHJcblx0XHRcdGNhc2UgMDoganNjb2xvci5yZXF1aXJlSW1hZ2UoJ2hzLnBuZycpOyBicmVhaztcclxuXHRcdFx0Y2FzZSAxOiBqc2NvbG9yLnJlcXVpcmVJbWFnZSgnaHYucG5nJyk7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0anNjb2xvci5yZXF1aXJlSW1hZ2UoJ2Nyb3NzLmdpZicpO1xyXG5cdFx0anNjb2xvci5yZXF1aXJlSW1hZ2UoJ2Fycm93LmdpZicpO1xyXG5cclxuXHRcdHRoaXMuaW1wb3J0Q29sb3IoKTtcclxuXHR9XHJcblxyXG59O1xyXG4iXX0=

'use strict';

var getSettings = {
    merge: function merge(a1, a2) {
        return Object.assign({}, a1, a2);
    },
    trix: function trix(combine) {
        return this.merge(combine, {
            smartyVersion: 3,
            continueComments: "Enter"
        });
    },
    quill: function quill(combine) {
        var toolbarOptions = [['code-block'], [{ 'font': [] }], [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown

        ['bold', 'italic', 'underline', 'strike'], // toggled buttons

        ['blockquote'], [{ 'header': 1 }, { 'header': 2 }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
        [{ 'direction': 'rtl' }], // text direction

        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme

        [{ 'align': [] }], ['clean'] // remove formatting button
        ];

        return this.merge(combine, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow',
            placeholder: 'Содержимое блока...'
        });
    },
    froala: function froala(combine) {
        return this.merge(combine, {
            language: 'ru',
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            pluginsEnabled: null
        });
    },
    Ckeditor5: function Ckeditor5(combine) {
        return this.merge(combine, {});
    },
    imperavi: function imperavi(combine) {
        $.Redactor.prototype.underline = function () {
            return {
                init: function init() {
                    var button = this.button.addAfter('italic', 'underline', 'U');
                    this.button.addCallback(button, this.underline.format);
                    // Set icon
                    this.button.setIcon(button, '<i class="re-icon-underline"></i>');
                },
                format: function format() {
                    this.inline.format('u');
                }
            };
        };

        return this.merge(combine, {
            lang: 'ru',

            air: false,

            minHeight: 70,

            maxHeight: 850,

            fixed: true,

            visual: true,

            toolbarFixed: true,

            toolbarOverflow: true,

            toolbarFixedTopOffset: 0,

            removeComments: false,

            overrideStyles: false,

            removeNewlines: true,

            animation: false,

            structure: true,

            fullpage: false,

            convertDivs: false,

            codemirror: false,

            tabAsSpaces: 4,

            imageFloatMargin: '15px',

            placeholder: 'Содержимое блока...',

            removeEmpty: ['strong', 'em', 'span', 'p', 'div', 'i', 'b'],

            replaceStyles: [['font-weight:\s?bold', "strong"], ['font-weight:\s?700', "strong"], ['font-style:\s?italic', "em"], ['text-decoration:\s?underline', "u"]],

            replaceTags: {
                'b': 'strong',
                'big': 'strong',
                'i': 'em',
                'strike': 'del'
            },

            plugins: [
            // 'clips',
            // 'pagebreak',
            // 'codemirror',
            'source', 'table', 'video', 'underline', 'alignment', 'filemanager', 'limiter', 'fontcolor', 'fontsize', 'fontfamily', 'properties', 'textexpander', 'textdirection', 'imagemanager', 'definedlinks', 'counter', 'inlinestyle', 'fullscreen'],

            formatting: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

            formattingAdd: {
                "red-p-add": {
                    title: 'Red Block Add',
                    args: ['p', 'class', 'red-styled']
                },
                "red-p-remove": {
                    title: 'Red Block Remove',
                    args: ['p', 'class', 'red-styled', 'remove']
                },
                "blue-header": {
                    title: 'Blue Header',
                    args: ['h3', 'class', 'blue-styled', 'toggle']
                },
                "add-attr": {
                    title: 'Set attributes',
                    args: ['p', { 'data-toggle': 'modal', 'class': 'red-styled' }, 'toggle']
                }
            },

            fileUpload: '/apps/upload/file_upload.php',
            imageUpload: '/apps/upload/image_upload.php',
            clipboardUploadUrl: '/apps/upload/clipboard.php'
        });
    },
    summernote: function summernote(combine) {
        // var element = document.querySelector("trix-editor")
        // element.editor  // is a Trix.Editor instance

        return this.merge(combine, {
            smartyVersion: 3,
            continueComments: "Enter"
        });

        // $('#summernote').summernote({
        //     lang: 'ru-RU'
        //     height: 300,                 // set editor height
        //     minHeight: null,             // set minimum height of editor
        //     maxHeight: null,             // set maximum height of editor
        //     focus: true                  // set focus to editable area after initializing summernote
        // });
    },
    codemirror: function codemirror(combine) {
        return this.merge(combine, {
            gutters: ["note-gutter", "CodeMirror-linenumbers"],
            tabSize: 4,
            indentUnit: 4,
            lineNumbers: true,
            lineWrapping: true,
            tabMode: "indent",
            autofocus: false,
            smartIndent: false,
            enterMode: "keep",
            smartyVersion: 3,
            continueComments: "Enter"
        });
    },
    tinymce: function tinymce(combine) {
        return this.merge(combine, {
            height: 70,
            plugins: ["advlist autolink autosave link image lists charmap preview hr anchor pagebreak", "searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking", "table contextmenu directionality textcolor textcolor colorpicker textpattern"],
            menubar: false,
            fullpage: false,
            relative_urls: false,
            remove_script_host: false,
            toolbar_items_size: 'small',
            toolbar1: "code | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect fontselect fontsizeselect",
            toolbar2: "searchreplace | bullist numlist | outdent indent blockquote | link unlink anchor image media | preview | forecolor backcolor",
            toolbar3: "table | hr removeformat | charmap | fullscreen | ltr rtl | visualchars visualblocks nonbreaking pagebreak",
            content_css: ['/apps/wysiwyg/tinymce/codepen.min.css']
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJnZXRTZXR0aW5ncyIsIm1lcmdlIiwiYTEiLCJhMiIsIk9iamVjdCIsImFzc2lnbiIsInRyaXgiLCJjb21iaW5lIiwic21hcnR5VmVyc2lvbiIsImNvbnRpbnVlQ29tbWVudHMiLCJxdWlsbCIsInRvb2xiYXJPcHRpb25zIiwibW9kdWxlcyIsInRvb2xiYXIiLCJ0aGVtZSIsInBsYWNlaG9sZGVyIiwiZnJvYWxhIiwibGFuZ3VhZ2UiLCJ0b29sYmFyQnV0dG9ucyIsInBsdWdpbnNFbmFibGVkIiwiQ2tlZGl0b3I1IiwiaW1wZXJhdmkiLCIkIiwiUmVkYWN0b3IiLCJwcm90b3R5cGUiLCJ1bmRlcmxpbmUiLCJpbml0IiwiYnV0dG9uIiwiYWRkQWZ0ZXIiLCJhZGRDYWxsYmFjayIsImZvcm1hdCIsInNldEljb24iLCJpbmxpbmUiLCJsYW5nIiwiYWlyIiwibWluSGVpZ2h0IiwibWF4SGVpZ2h0IiwiZml4ZWQiLCJ2aXN1YWwiLCJ0b29sYmFyRml4ZWQiLCJ0b29sYmFyT3ZlcmZsb3ciLCJ0b29sYmFyRml4ZWRUb3BPZmZzZXQiLCJyZW1vdmVDb21tZW50cyIsIm92ZXJyaWRlU3R5bGVzIiwicmVtb3ZlTmV3bGluZXMiLCJhbmltYXRpb24iLCJzdHJ1Y3R1cmUiLCJmdWxscGFnZSIsImNvbnZlcnREaXZzIiwiY29kZW1pcnJvciIsInRhYkFzU3BhY2VzIiwiaW1hZ2VGbG9hdE1hcmdpbiIsInJlbW92ZUVtcHR5IiwicmVwbGFjZVN0eWxlcyIsInJlcGxhY2VUYWdzIiwicGx1Z2lucyIsImZvcm1hdHRpbmciLCJmb3JtYXR0aW5nQWRkIiwidGl0bGUiLCJhcmdzIiwiZmlsZVVwbG9hZCIsImltYWdlVXBsb2FkIiwiY2xpcGJvYXJkVXBsb2FkVXJsIiwic3VtbWVybm90ZSIsImd1dHRlcnMiLCJ0YWJTaXplIiwiaW5kZW50VW5pdCIsImxpbmVOdW1iZXJzIiwibGluZVdyYXBwaW5nIiwidGFiTW9kZSIsImF1dG9mb2N1cyIsInNtYXJ0SW5kZW50IiwiZW50ZXJNb2RlIiwidGlueW1jZSIsImhlaWdodCIsIm1lbnViYXIiLCJyZWxhdGl2ZV91cmxzIiwicmVtb3ZlX3NjcmlwdF9ob3N0IiwidG9vbGJhcl9pdGVtc19zaXplIiwidG9vbGJhcjEiLCJ0b29sYmFyMiIsInRvb2xiYXIzIiwiY29udGVudF9jc3MiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsY0FBYztBQUNoQkMsU0FEZ0IsaUJBQ1RDLEVBRFMsRUFDTEMsRUFESyxFQUNEO0FBQ1gsZUFBT0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILEVBQWxCLEVBQXNCQyxFQUF0QixDQUFQO0FBQ0gsS0FIZTtBQUtoQkcsUUFMZ0IsZ0JBS1ZDLE9BTFUsRUFLRDtBQUNYLGVBQU8sS0FBS04sS0FBTCxDQUFXTSxPQUFYLEVBQW9CO0FBQ3ZCQywyQkFBaUIsQ0FETTtBQUV2QkMsOEJBQWtCO0FBRkssU0FBcEIsQ0FBUDtBQUlILEtBVmU7QUFZaEJDLFNBWmdCLGlCQVlUSCxPQVpTLEVBWUE7QUFDWixZQUFNSSxpQkFBaUIsQ0FDbkIsQ0FBQyxZQUFELENBRG1CLEVBR25CLENBQUMsRUFBRSxRQUFRLEVBQVYsRUFBRCxDQUhtQixFQUtuQixDQUFDLEVBQUUsUUFBUSxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLE9BQWpCLEVBQTBCLE1BQTFCLENBQVYsRUFBRCxDQUxtQixFQUsrQjs7QUFFbEQsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixXQUFuQixFQUFnQyxRQUFoQyxDQVBtQixFQU8rQjs7QUFFbEQsU0FBQyxZQUFELENBVG1CLEVBV25CLENBQUMsRUFBRSxVQUFVLENBQVosRUFBRCxFQUFrQixFQUFFLFVBQVUsQ0FBWixFQUFsQixDQVhtQixFQWFuQixDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLEtBQW5CLENBQVosRUFBRCxDQWJtQixFQWVuQixDQUFD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Q3ZCeUQscUJBQVMsQ0FBQyxhQUFELEVBQWdCLHdCQUFoQixDQURjO0FBRXZCQyxxQkFBUyxDQUZjO0FBR3ZCQyx3QkFBWSxDQUhXO0FBSXZCQyx5QkFBYSxJQUpVO0FBS3ZCQywwQkFBYyxJQUxTO0FBTXZCQyxxQkFBUyxRQU5jO0FBT3ZCQyx1QkFBVyxLQVBZO0FBUXZCQyx5QkFBYSxLQVJVO0FBU3ZCQyx1QkFBVyxNQVRZO0FBVXZCaEUsMkJBQWlCLENBVk07QUFXdkJDLDhCQUFrQjtBQVhLLFNBQXBCLENBQVA7QUFhSCxLQTNOZTtBQTZOaEJnRSxXQTdOZ0IsbUJBNk5QbEUsT0E3Tk8sRUE2TkU7QUFDZCxlQUFPLEtBQUtOLEtBQUwsQ0FBV00sT0FBWCxFQUFvQjtBQUN2Qm1FLG9CQUFRLEVBRGU7QUFFdkJuQixxQkFBUyxDQUNMLGdGQURLLEVBRUwsb0ZBRkssRUFHTCw4RUFISyxDQUZjO0FBT3ZCb0IscUJBQVMsS0FQYztBQVF2QjVCLHNCQUFVLEtBUmE7QUFTdkI2QiwyQkFBZSxLQVRRO0FBVXZCQyxnQ0FBb0IsS0FWRztBQVd2QkMsZ0NBQW9CLE9BWEc7QUFZdkJDLHNCQUFVLG9JQVphO0FBYXZCQyxzQkFBVSw4SEFiYTtBQWN2QkMsc0JBQVUsMkdBZGE7QUFldkJDLHlCQUFhLENBQ1QsdUNBRFM7QUFmVSxTQUFwQixDQUFQO0FBbUJIO0FBalBlLENBQXBCIiwiZmlsZSI6Il9zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldFNldHRpbmdzID0ge1xuICAgIG1lcmdlIChhMSwgYTIpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGExLCBhMik7XG4gICAgfSxcblxuICAgIHRyaXggKGNvbWJpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2UoY29tYmluZSwge1xuICAgICAgICAgICAgc21hcnR5VmVyc2lvbiAgOiAzLFxuICAgICAgICAgICAgY29udGludWVDb21tZW50czogXCJFbnRlclwiXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBxdWlsbCAoY29tYmluZSkge1xuICAgICAgICBjb25zdCB0b29sYmFyT3B0aW9ucyA9IFtcbiAgICAgICAgICAgIFsnY29kZS1ibG9jayddLFxuXG4gICAgICAgICAgICBbeyAnZm9udCc6IFtdIH1dLFxuXG4gICAgICAgICAgICBbeyAnc2l6ZSc6IFsnc21hbGwnLCBmYWxzZSwgJ2xhcmdlJywgJ2h1Z2UnXSB9XSwgIC8vIGN1c3RvbSBkcm9wZG93blxuXG4gICAgICAgICAgICBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2UnXSwgICAgICAgIC8vIHRvZ2dsZWQgYnV0dG9uc1xuXG4gICAgICAgICAgICBbJ2Jsb2NrcXVvdGUnXSxcblxuICAgICAgICAgICAgW3sgJ2hlYWRlcic6IDEgfSwgeyAnaGVhZGVyJzogMiB9XSxcblxuICAgICAgICAgICAgW3sgJ2hlYWRlcic6IFsxLCAyLCAzLCA0LCA1LCA2LCBmYWxzZV0gfV0sXG5cbiAgICAgICAgICAgIFt7ICdsaXN0JzogJ29yZGVyZWQnfSwgeyAnbGlzdCc6ICdidWxsZXQnIH1dLFxuICAgICAgICAgICAgW3sgJ3NjcmlwdCc6ICdzdWInfSwgeyAnc2NyaXB0JzogJ3N1cGVyJyB9XSwgICAgICAvLyBzdXBlcnNjcmlwdC9zdWJzY3JpcHRcbiAgICAgICAgICAgIFt7ICdpbmRlbnQnOiAnLTEnfSwgeyAnaW5kZW50JzogJysxJyB9XSwgICAgICAgICAgLy8gb3V0ZGVudC9pbmRlbnRcbiAgICAgICAgICAgIFt7ICdkaXJlY3Rpb24nOiAncnRsJyB9XSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGV4dCBkaXJlY3Rpb25cblxuICAgICAgICAgICAgW3sgJ2NvbG9yJzogW10gfSwgeyAnYmFja2dyb3VuZCc6IFtdIH1dLCAgICAgICAgICAvLyBkcm9wZG93biB3aXRoIGRlZmF1bHRzIGZyb20gdGhlbWVcblxuICAgICAgICAgICAgW3sgJ2FsaWduJzogW10gfV0sXG5cbiAgICAgICAgICAgIFsnY2xlYW4nXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGZvcm1hdHRpbmcgYnV0dG9uXG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2UoY29tYmluZSwge1xuICAgICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgICAgIHRvb2xiYXI6IHRvb2xiYXJPcHRpb25zXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhlbWU6ICdzbm93JyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn0KHQvtC00LXRgNC20LjQvNC+0LUg0LHQu9C+0LrQsC4uLidcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGZyb2FsYSAoY29tYmluZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7XG4gICAgICAgICAgICBsYW5ndWFnZTogJ3J1JyxcbiAgICAgICAgICAgIHRvb2xiYXJCdXR0b25zOiBbJ2Z1bGxzY3JlZW4nLCAnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3Vic2NyaXB0JywgJ3N1cGVyc2NyaXB0JywgJ3wnLCAnZm9udEZhbWlseScsICdmb250U2l6ZScsICdjb2xvcicsICdpbmxpbmVTdHlsZScsICdwYXJhZ3JhcGhTdHlsZScsICd8JywgJ3BhcmFncmFwaEZvcm1hdCcsICdhbGlnbicsICdmb3JtYXRPTCcsICdmb3JtYXRVTCcsICdvdXRkZW50JywgJ2luZGVudCcsICdxdW90ZScsICctJywgJ2luc2VydExpbmsnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0VmlkZW8nLCAnaW5zZXJ0RmlsZScsICdpbnNlcnRUYWJsZScsICd8JywgJ2Vtb3RpY29ucycsICdzcGVjaWFsQ2hhcmFjdGVycycsICdpbnNlcnRIUicsICdzZWxlY3RBbGwnLCAnY2xlYXJGb3JtYXR0aW5nJywgJ3wnLCAncHJpbnQnLCAnc3BlbGxDaGVja2VyJywgJ2hlbHAnLCAnaHRtbCcsICd8JywgJ3VuZG8nLCAncmVkbyddLFxuICAgICAgICAgICAgcGx1Z2luc0VuYWJsZWQ6IG51bGxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIENrZWRpdG9yNSAoY29tYmluZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7fSk7XG4gICAgfSxcblxuICAgIGltcGVyYXZpIChjb21iaW5lKSB7XG4gICAgICAgICQuUmVkYWN0b3IucHJvdG90eXBlLnVuZGVybGluZSA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gdGhpcy5idXR0b24uYWRkQWZ0ZXIoJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnVScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5hZGRDYWxsYmFjayhidXR0b24sIHRoaXMudW5kZXJsaW5lLmZvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBpY29uXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEljb24oYnV0dG9uLCAnPGkgY2xhc3M9XCJyZS1pY29uLXVuZGVybGluZVwiPjwvaT4nKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZvcm1hdDogZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmxpbmUuZm9ybWF0KCd1Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7XG4gICAgICAgICAgICBsYW5nOiAncnUnLFxuXG4gICAgICAgICAgICBhaXI6IGZhbHNlLFxuXG4gICAgICAgICAgICBtaW5IZWlnaHQ6IDcwLFxuXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IDg1MCxcblxuICAgICAgICAgICAgZml4ZWQ6IHRydWUsXG5cbiAgICAgICAgICAgIHZpc3VhbDogdHJ1ZSxcblxuICAgICAgICAgICAgdG9vbGJhckZpeGVkOiB0cnVlLFxuXG4gICAgICAgICAgICB0b29sYmFyT3ZlcmZsb3c6IHRydWUsXG5cbiAgICAgICAgICAgIHRvb2xiYXJGaXhlZFRvcE9mZnNldDogMCxcblxuICAgICAgICAgICAgcmVtb3ZlQ29tbWVudHM6IGZhbHNlLFxuXG4gICAgICAgICAgICBvdmVycmlkZVN0eWxlczogZmFsc2UsXG5cbiAgICAgICAgICAgIHJlbW92ZU5ld2xpbmVzOiB0cnVlLFxuXG4gICAgICAgICAgICBhbmltYXRpb246IGZhbHNlLFxuXG4gICAgICAgICAgICBzdHJ1Y3R1cmU6IHRydWUsXG5cbiAgICAgICAgICAgIGZ1bGxwYWdlOiBmYWxzZSxcblxuICAgICAgICAgICAgY29udmVydERpdnM6IGZhbHNlLFxuXG4gICAgICAgICAgICBjb2RlbWlycm9yOiBmYWxzZSxcblxuICAgICAgICAgICAgdGFiQXNTcGFjZXM6IDQsXG5cbiAgICAgICAgICAgIGltYWdlRmxvYXRNYXJnaW46ICcxNXB4JyxcblxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICfQodC+0LTQtdGA0LbQuNC80L7QtSDQsdC70L7QutCwLi4uJyxcblxuICAgICAgICAgICAgcmVtb3ZlRW1wdHk6IFsnc3Ryb25nJywgJ2VtJywgJ3NwYW4nLCAncCcsICdkaXYnLCAnaScsICdiJ10sXG5cbiAgICAgICAgICAgIHJlcGxhY2VTdHlsZXM6IFtcbiAgICAgICAgICAgICAgICBbJ2ZvbnQtd2VpZ2h0Olxccz9ib2xkJywgXCJzdHJvbmdcIl0sXG4gICAgICAgICAgICAgICAgWydmb250LXdlaWdodDpcXHM/NzAwJywgXCJzdHJvbmdcIl0sXG4gICAgICAgICAgICAgICAgWydmb250LXN0eWxlOlxccz9pdGFsaWMnLCBcImVtXCJdLFxuICAgICAgICAgICAgICAgIFsndGV4dC1kZWNvcmF0aW9uOlxccz91bmRlcmxpbmUnLCBcInVcIl1cbiAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgIHJlcGxhY2VUYWdzOiB7XG4gICAgICAgICAgICAgICAgJ2InOiAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAnYmlnJzogJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgJ2knOiAnZW0nLFxuICAgICAgICAgICAgICAgICdzdHJpa2UnOiAnZGVsJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIC8vICdjbGlwcycsXG4gICAgICAgICAgICAgICAgLy8gJ3BhZ2VicmVhaycsXG4gICAgICAgICAgICAgICAgLy8gJ2NvZGVtaXJyb3InLFxuICAgICAgICAgICAgICAgICdzb3VyY2UnLFxuICAgICAgICAgICAgICAgICd0YWJsZScsXG4gICAgICAgICAgICAgICAgJ3ZpZGVvJyxcbiAgICAgICAgICAgICAgICAndW5kZXJsaW5lJyxcbiAgICAgICAgICAgICAgICAnYWxpZ25tZW50JyxcbiAgICAgICAgICAgICAgICAnZmlsZW1hbmFnZXInLFxuICAgICAgICAgICAgICAgICdsaW1pdGVyJyxcbiAgICAgICAgICAgICAgICAnZm9udGNvbG9yJyxcbiAgICAgICAgICAgICAgICAnZm9udHNpemUnLFxuICAgICAgICAgICAgICAgICdmb250ZmFtaWx5JyxcbiAgICAgICAgICAgICAgICAncHJvcGVydGllcycsXG4gICAgICAgICAgICAgICAgJ3RleHRleHBhbmRlcicsXG4gICAgICAgICAgICAgICAgJ3RleHRkaXJlY3Rpb24nLFxuICAgICAgICAgICAgICAgICdpbWFnZW1hbmFnZXInLFxuICAgICAgICAgICAgICAgICdkZWZpbmVkbGlua3MnLFxuICAgICAgICAgICAgICAgICdjb3VudGVyJyxcbiAgICAgICAgICAgICAgICAnaW5saW5lc3R5bGUnLFxuICAgICAgICAgICAgICAgICdmdWxsc2NyZWVuJ1xuICAgICAgICAgICAgXSxcblxuICAgICAgICAgICAgZm9ybWF0dGluZzogWydwJywgJ2Jsb2NrcXVvdGUnLCAncHJlJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG5cbiAgICAgICAgICAgIGZvcm1hdHRpbmdBZGQ6IHtcbiAgICAgICAgICAgICAgICBcInJlZC1wLWFkZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVkIEJsb2NrIEFkZCcsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFsncCcsICdjbGFzcycsICdyZWQtc3R5bGVkJ11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwicmVkLXAtcmVtb3ZlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZWQgQmxvY2sgUmVtb3ZlJyxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogWydwJywgJ2NsYXNzJywgJ3JlZC1zdHlsZWQnLCAncmVtb3ZlJ11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiYmx1ZS1oZWFkZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JsdWUgSGVhZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogWydoMycsICdjbGFzcycsICdibHVlLXN0eWxlZCcsICd0b2dnbGUnXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJhZGQtYXR0clwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2V0IGF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbJ3AnLCB7ICdkYXRhLXRvZ2dsZSc6ICdtb2RhbCcsICdjbGFzcyc6ICdyZWQtc3R5bGVkJyB9LCAndG9nZ2xlJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBmaWxlVXBsb2FkOiAnL2FwcHMvdXBsb2FkL2ZpbGVfdXBsb2FkLnBocCcsXG4gICAgICAgICAgICBpbWFnZVVwbG9hZDogJy9hcHBzL3VwbG9hZC9pbWFnZV91cGxvYWQucGhwJyxcbiAgICAgICAgICAgIGNsaXBib2FyZFVwbG9hZFVybDogJy9hcHBzL3VwbG9hZC9jbGlwYm9hcmQucGhwJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc3VtbWVybm90ZSAoY29tYmluZSkge1xuICAgICAgICAvLyB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0cml4LWVkaXRvclwiKVxuICAgICAgICAvLyBlbGVtZW50LmVkaXRvciAgLy8gaXMgYSBUcml4LkVkaXRvciBpbnN0YW5jZVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKGNvbWJpbmUsIHtcbiAgICAgICAgICAgIHNtYXJ0eVZlcnNpb24gIDogMyxcbiAgICAgICAgICAgIGNvbnRpbnVlQ29tbWVudHM6IFwiRW50ZXJcIlxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAkKCcjc3VtbWVybm90ZScpLnN1bW1lcm5vdGUoe1xuICAgICAgICAvLyAgICAgbGFuZzogJ3J1LVJVJ1xuICAgICAgICAvLyAgICAgaGVpZ2h0OiAzMDAsICAgICAgICAgICAgICAgICAvLyBzZXQgZWRpdG9yIGhlaWdodFxuICAgICAgICAvLyAgICAgbWluSGVpZ2h0OiBudWxsLCAgICAgICAgICAgICAvLyBzZXQgbWluaW11bSBoZWlnaHQgb2YgZWRpdG9yXG4gICAgICAgIC8vICAgICBtYXhIZWlnaHQ6IG51bGwsICAgICAgICAgICAgIC8vIHNldCBtYXhpbXVtIGhlaWdodCBvZiBlZGl0b3JcbiAgICAgICAgLy8gICAgIGZvY3VzOiB0cnVlICAgICAgICAgICAgICAgICAgLy8gc2V0IGZvY3VzIHRvIGVkaXRhYmxlIGFyZWEgYWZ0ZXIgaW5pdGlhbGl6aW5nIHN1bW1lcm5vdGVcbiAgICAgICAgLy8gfSk7XG4gICAgfSxcblxuICAgIGNvZGVtaXJyb3IgKGNvbWJpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2UoY29tYmluZSwge1xuICAgICAgICAgICAgZ3V0dGVyczogW1wibm90ZS1ndXR0ZXJcIiwgXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCJdLFxuICAgICAgICAgICAgdGFiU2l6ZTogNCxcbiAgICAgICAgICAgIGluZGVudFVuaXQ6IDQsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHRhYk1vZGU6IFwiaW5kZW50XCIsXG4gICAgICAgICAgICBhdXRvZm9jdXM6IGZhbHNlLFxuICAgICAgICAgICAgc21hcnRJbmRlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgZW50ZXJNb2RlOiBcImtlZXBcIixcbiAgICAgICAgICAgIHNtYXJ0eVZlcnNpb24gIDogMyxcbiAgICAgICAgICAgIGNvbnRpbnVlQ29tbWVudHM6IFwiRW50ZXJcIlxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdGlueW1jZSAoY29tYmluZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7XG4gICAgICAgICAgICBoZWlnaHQ6IDcwLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIFwiYWR2bGlzdCBhdXRvbGluayBhdXRvc2F2ZSBsaW5rIGltYWdlIGxpc3RzIGNoYXJtYXAgcHJldmlldyBociBhbmNob3IgcGFnZWJyZWFrXCIsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hyZXBsYWNlIHdvcmRjb3VudCB2aXN1YWxibG9ja3MgdmlzdWFsY2hhcnMgY29kZSBmdWxsc2NyZWVuIG1lZGlhIG5vbmJyZWFraW5nXCIsXG4gICAgICAgICAgICAgICAgXCJ0YWJsZSBjb250ZXh0bWVudSBkaXJlY3Rpb25hbGl0eSB0ZXh0Y29sb3IgdGV4dGNvbG9yIGNvbG9ycGlja2VyIHRleHRwYXR0ZXJuXCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBtZW51YmFyOiBmYWxzZSxcbiAgICAgICAgICAgIGZ1bGxwYWdlOiBmYWxzZSxcbiAgICAgICAgICAgIHJlbGF0aXZlX3VybHM6IGZhbHNlLFxuICAgICAgICAgICAgcmVtb3ZlX3NjcmlwdF9ob3N0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2xiYXJfaXRlbXNfc2l6ZTogJ3NtYWxsJyxcbiAgICAgICAgICAgIHRvb2xiYXIxOiBcImNvZGUgfCBib2xkIGl0YWxpYyB1bmRlcmxpbmUgc3RyaWtldGhyb3VnaCB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IHN0eWxlc2VsZWN0IGZvbnRzZWxlY3QgZm9udHNpemVzZWxlY3RcIixcbiAgICAgICAgICAgIHRvb2xiYXIyOiBcInNlYXJjaHJlcGxhY2UgfCBidWxsaXN0IG51bWxpc3QgfCBvdXRkZW50IGluZGVudCBibG9ja3F1b3RlIHwgbGluayB1bmxpbmsgYW5jaG9yIGltYWdlIG1lZGlhIHwgcHJldmlldyB8IGZvcmVjb2xvciBiYWNrY29sb3JcIixcbiAgICAgICAgICAgIHRvb2xiYXIzOiBcInRhYmxlIHwgaHIgcmVtb3ZlZm9ybWF0IHwgY2hhcm1hcCB8IGZ1bGxzY3JlZW4gfCBsdHIgcnRsIHwgdmlzdWFsY2hhcnMgdmlzdWFsYmxvY2tzIG5vbmJyZWFraW5nIHBhZ2VicmVha1wiLFxuICAgICAgICAgICAgY29udGVudF9jc3M6IFtcbiAgICAgICAgICAgICAgICAnL2FwcHMvd3lzaXd5Zy90aW55bWNlL2NvZGVwZW4ubWluLmNzcydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19

'use strict';

var cmp = function cmp(a, b) {
	if (typeof a === 'number' && typeof b === 'number') {
		return a > b ? 1 : a < b ? -1 : 0;
	}
	a = asciifold(String(a || ''));
	b = asciifold(String(b || ''));
	if (a > b) return 1;
	if (b > a) return -1;
	return 0;
};

var extend = function extend(a, b) {
	var i, n, k, object;
	for (i = 1, n = arguments.length; i < n; i++) {
		object = arguments[i];
		if (!object) continue;
		for (k in object) {
			if (object.hasOwnProperty(k)) {
				a[k] = object[k];
			}
		}
	}
	return a;
};

var trim = function trim(str) {
	return (str + '').replace(/^\s+|\s+$|/g, '');
};

var escape_regex = function escape_regex(str) {
	return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
};

var is_array = Array.isArray || $ && $.isArray || function (object) {
	return Object.prototype.toString.call(object) === '[object Array]';
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl91dGlsaXRpZXMuanMiXSwibmFtZXMiOlsiY21wIiwiYSIsImIiLCJhc2NpaWZvbGQiLCJTdHJpbmciLCJleHRlbmQiLCJpIiwibiIsImsiLCJvYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJoYXNPd25Qcm9wZXJ0eSIsInRyaW0iLCJzdHIiLCJyZXBsYWNlIiwiZXNjYXBlX3JlZ2V4IiwiaXNfYXJyYXkiLCJBcnJheSIsImlzQXJyYXkiLCIkIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIl0sIm1hcHBpbmdzIjoiOztBQUNDLElBQUlBLE1BQU0sU0FBTkEsR0FBTSxDQUFTQyxDQUFULEVBQVlDLENBQVosRUFBZTtBQUN4QixLQUFJLE9BQU9ELENBQVAsS0FBYSxRQUFiLElBQXlCLE9BQU9DLENBQVAsS0FBYSxRQUExQyxFQUFvRDtBQUNuRCxTQUFPRCxJQUFJQyxDQUFKLEdBQVEsQ0FBUixHQUFhRCxJQUFJQyxDQUFKLEdBQVEsQ0FBQyxDQUFULEdBQWEsQ0FBakM7QUFDQTtBQUNERCxLQUFJRSxVQUFVQyxPQUFPSCxLQUFLLEVBQVosQ0FBVixDQUFKO0FBQ0FDLEtBQUlDLFVBQVVDLE9BQU9GLEtBQUssRUFBWixDQUFWLENBQUo7QUFDQSxLQUFJRCxJQUFJQyxDQUFSLEVBQVcsT0FBTyxDQUFQO0FBQ1gsS0FBSUEsSUFBSUQsQ0FBUixFQUFXLE9BQU8sQ0FBQyxDQUFSO0FBQ1gsUUFBTyxDQUFQO0FBQ0EsQ0FURDs7QUFXQSxJQUFJSSxTQUFTLFNBQVRBLE1BQVMsQ0FBU0osQ0FBVCxFQUFZQyxDQUFaLEVBQWU7QUFDM0IsS0FBSUksQ0FBSixFQUFPQyxDQUFQLEVBQVVDLENBQVYsRUFBYUMsTUFBYjtBQUNBLE1BQUtILElBQUksQ0FBSixFQUFPQyxJQUFJRyxVQUFVQyxNQUExQixFQUFrQ0wsSUFBSUMsQ0FBdEMsRUFBeUNELEdBQXpDLEVBQThDO0FBQzdDRyxXQUFTQyxVQUFVSixDQUFWLENBQVQ7QUFDQSxNQUFJLENBQUNHLE1BQUwsRUFBYTtBQUNiLE9BQUtELENBQUwsSUFBVUMsTUFBVixFQUFrQjtBQUNqQixPQUFJQSxPQUFPRyxjQUFQLENBQXNCSixDQUF0QixDQUFKLEVBQThCO0FBQzdCUCxNQUFFTyxDQUFGLElBQU9DLE9BQU9ELENBQVAsQ0FBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNELFFBQU9QLENBQVA7QUFDQSxDQVpEOztBQWNBLElBQUlZLE9BQU8sU0FBUEEsSUFBTyxDQUFTQyxHQUFULEVBQWM7QUFDeEIsUUFBTyxDQUFDQSxNQUFNLEVBQVAsRUFBV0MsT0FBWCxDQUFtQixhQUFuQixFQUFrQyxFQUFsQyxDQUFQO0FBQ0EsQ0FGRDs7QUFJQSxJQUFJQyxlQUFlLFNBQWZBLFlBQWUsQ0FBU0YsR0FBVCxFQUFjO0FBQ2hDLFFBQU8sQ0FBQ0EsTUFBTSxFQUFQLEVBQVdDLE9BQVgsQ0FBbUIsd0JBQW5CLEVBQTZDLE1BQTdDLENBQVA7QUFDQSxDQUZEOztBQUlBLElBQUlFLFdBQVdDLE1BQU1DLE9BQU4sSUFBa0JDLEtBQUtBLEVBQUVELE9BQXpCLElBQXFDLFVBQVNWLE1BQVQsRUFBaUI7QUFDcEUsUUFBT1ksT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCZixNQUEvQixNQUEyQyxnQkFBbEQ7QUFDQSxDQUZEIiwiZmlsZSI6Il91dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblx0dmFyIGNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT09ICdudW1iZXInICYmIHR5cGVvZiBiID09PSAnbnVtYmVyJykge1xuXHRcdFx0cmV0dXJuIGEgPiBiID8gMSA6IChhIDwgYiA/IC0xIDogMCk7XG5cdFx0fVxuXHRcdGEgPSBhc2NpaWZvbGQoU3RyaW5nKGEgfHwgJycpKTtcblx0XHRiID0gYXNjaWlmb2xkKFN0cmluZyhiIHx8ICcnKSk7XG5cdFx0aWYgKGEgPiBiKSByZXR1cm4gMTtcblx0XHRpZiAoYiA+IGEpIHJldHVybiAtMTtcblx0XHRyZXR1cm4gMDtcblx0fTtcblxuXHR2YXIgZXh0ZW5kID0gZnVuY3Rpb24oYSwgYikge1xuXHRcdHZhciBpLCBuLCBrLCBvYmplY3Q7XG5cdFx0Zm9yIChpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdG9iamVjdCA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghb2JqZWN0KSBjb250aW51ZTtcblx0XHRcdGZvciAoayBpbiBvYmplY3QpIHtcblx0XHRcdFx0aWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdGFba10gPSBvYmplY3Rba107XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGE7XG5cdH07XG5cblx0dmFyIHRyaW0gPSBmdW5jdGlvbihzdHIpIHtcblx0XHRyZXR1cm4gKHN0ciArICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJHwvZywgJycpO1xuXHR9O1xuXG5cdHZhciBlc2NhcGVfcmVnZXggPSBmdW5jdGlvbihzdHIpIHtcblx0XHRyZXR1cm4gKHN0ciArICcnKS5yZXBsYWNlKC8oWy4/KiteJFtcXF1cXFxcKCl7fXwtXSkvZywgJ1xcXFwkMScpO1xuXHR9O1xuXG5cdHZhciBpc19hcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgKCQgJiYgJC5pc0FycmF5KSB8fCBmdW5jdGlvbihvYmplY3QpIHtcblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH07XG4iXX0=

'use strict';

(function ($) {
    'use strict';

    $.browser = {};
    $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyb3dzZXIuanMiXSwibmFtZXMiOlsiJCIsImJyb3dzZXIiLCJtb3ppbGxhIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwid2Via2l0Iiwib3BlcmEiLCJtc2llIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFDLFdBQVNBLENBQVQsRUFBWTtBQUNUOztBQUVBQSxNQUFFQyxPQUFGLEdBQVksRUFBWjtBQUNBRCxNQUFFQyxPQUFGLENBQVVDLE9BQVYsR0FBb0IsVUFBVUMsSUFBVixDQUFlQyxVQUFVQyxTQUFWLENBQW9CQyxXQUFwQixFQUFmLEtBQXFELENBQUMsU0FBU0gsSUFBVCxDQUFjQyxVQUFVQyxTQUFWLENBQW9CQyxXQUFwQixFQUFkLENBQTFFO0FBQ0FOLE1BQUVDLE9BQUYsQ0FBVU0sTUFBVixHQUFtQixTQUFTSixJQUFULENBQWNDLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEVBQWQsQ0FBbkI7QUFDQU4sTUFBRUMsT0FBRixDQUFVTyxLQUFWLEdBQWtCLFFBQVFMLElBQVIsQ0FBYUMsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsRUFBYixDQUFsQjtBQUNBTixNQUFFQyxPQUFGLENBQVVRLElBQVYsR0FBaUIsT0FBT04sSUFBUCxDQUFZQyxVQUFVQyxTQUFWLENBQW9CQyxXQUFwQixFQUFaLENBQWpCO0FBRUgsQ0FUQSxFQVNDSSxNQVRELENBQUQiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgJC5icm93c2VyID0ge307XG4gICAgJC5icm93c2VyLm1vemlsbGEgPSAvbW96aWxsYS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmICEvd2Via2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG4gICAgJC5icm93c2VyLndlYmtpdCA9IC93ZWJraXQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICAkLmJyb3dzZXIub3BlcmEgPSAvb3BlcmEvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICAkLmJyb3dzZXIubXNpZSA9IC9tc2llLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG5cbn0oalF1ZXJ5KSk7Il19

'use strict';

function declOfNum(n, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    n = Math.abs(n);
    return [n, titles[n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]]].join(' ');
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY2xvZm51bS5qcyJdLCJuYW1lcyI6WyJkZWNsT2ZOdW0iLCJuIiwidGl0bGVzIiwiY2FzZXMiLCJNYXRoIiwiYWJzIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxTQUFULENBQW1CQyxDQUFuQixFQUFzQkMsTUFBdEIsRUFBOEI7QUFDMUIsUUFBTUMsUUFBUSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLENBQWQ7QUFDQUYsUUFBSUcsS0FBS0MsR0FBTCxDQUFTSixDQUFULENBQUo7QUFDQSxXQUFPLENBQUNBLENBQUQsRUFBSUMsT0FBUUQsSUFBSSxHQUFKLEdBQVUsQ0FBVixJQUFlQSxJQUFJLEdBQUosR0FBVSxFQUExQixHQUFnQyxDQUFoQyxHQUFvQ0UsTUFBT0YsSUFBSSxFQUFKLEdBQVMsQ0FBVixHQUFlQSxJQUFJLEVBQW5CLEdBQXdCLENBQTlCLENBQTNDLENBQUosRUFBa0ZLLElBQWxGLENBQXVGLEdBQXZGLENBQVA7QUFDSCIsImZpbGUiOiJkZWNsb2ZudW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBkZWNsT2ZOdW0obiwgdGl0bGVzKSB7XG4gICAgY29uc3QgY2FzZXMgPSBbMiwgMCwgMSwgMSwgMSwgMl07XG4gICAgbiA9IE1hdGguYWJzKG4pO1xuICAgIHJldHVybiBbbiwgdGl0bGVzWyhuICUgMTAwID4gNCAmJiBuICUgMTAwIDwgMjApID8gMiA6IGNhc2VzWyhuICUgMTAgPCA1KSA/IG4gJSAxMCA6IDVdXV0uam9pbignICcpO1xufSJdfQ==

'use strict';

function saving(id, content) {
    $.ajax({
        url: '/' + ADMIN_DIR + '/save/',
        type: 'post',
        data: {
            id: id,
            cont: content,
            pathname: location.pathname
        },
        dataType: 'JSON',
        success: function success(response) {
            if (response == 1) {
                alert("Данные удачно сохранены.");
            } else {
                alert("Ошибка, данные небыли сохранены.");
            }
        }
    });
}

function isFullScreen(cm) {
    return (/\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className)
    );
}

function winHeight() {
    return window.innerHeight || (document.documentElement || document.body).clientHeight;
}

function setFullScreen(cm, full) {
    var wrap = cm.getWrapperElement(),
        scroll = cm.getScrollerElement();
    if (full) {
        wrap.className += " CodeMirror-fullscreen";
        scroll.style.height = winHeight() + "px";
        document.documentElement.style.overflow = "hidden";
    } else {
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
        scroll.style.height = "";
        document.documentElement.style.overflow = "";
    }
    cm.refresh();
}

var _editor = {
    codemirror: function codemirror(id, mode) {
        var object = document.getElementById(id);

        if (mode == 'xml') {
            mode = {
                name: "xml",
                alignCDATA: true
            };
        }

        if (mode == 'sql') {
            mode = 'text/x-mariadb';
            if (window.location.href.indexOf('mime=') > -1) {
                mode = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
            }
        }

        CodeMirror.fromTextArea(object, getSettings.codemirror({
            mode: mode,
            extraKeys: {
                "Ctrl-S": function CtrlS(cm) {
                    saving();
                    return false;
                },
                "Cmd-S": function CmdS(cm) {
                    saving();
                    return false;
                },
                "Ctrl-Q": "toggleComment",
                "Cmd-Q": "toggleComment"
            }
        }));
    },
    init: function init(id, type, mode) {
        if (typeof this[type] !== 'undefined') {
            this[type](id, mode);
        }
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRvci5qcyJdLCJuYW1lcyI6WyJzYXZpbmciLCJpZCIsImNvbnRlbnQiLCIkIiwiYWpheCIsInVybCIsIkFETUlOX0RJUiIsInR5cGUiLCJkYXRhIiwiY29udCIsInBhdGhuYW1lIiwibG9jYXRpb24iLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImFsZXJ0IiwiaXNGdWxsU2NyZWVuIiwiY20iLCJ0ZXN0IiwiZ2V0V3JhcHBlckVsZW1lbnQiLCJjbGFzc05hbWUiLCJ3aW5IZWlnaHQiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsaWVudEhlaWdodCIsInNldEZ1bGxTY3JlZW4iLCJmdWxsIiwid3JhcCIsInNjcm9sbCIsImdldFNjcm9sbGVyRWxlbWVudCIsInN0eWxlIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJyZXBsYWNlIiwicmVmcmVzaCIsIl9lZGl0b3IiLCJjb2RlbWlycm9yIiwibW9kZSIsIm9iamVjdCIsImdldEVsZW1lbnRCeUlkIiwibmFtZSIsImFsaWduQ0RBVEEiLCJocmVmIiwiaW5kZXhPZiIsInN1YnN0ciIsIkNvZGVNaXJyb3IiLCJmcm9tVGV4dEFyZWEiLCJnZXRTZXR0aW5ncyIsImV4dHJhS2V5cyIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsTUFBVCxDQUFnQkMsRUFBaEIsRUFBb0JDLE9BQXBCLEVBQ0E7QUFDSUMsTUFBRUMsSUFBRixDQUFPO0FBQ0hDLGFBQUssTUFBTUMsU0FBTixHQUFrQixRQURwQjtBQUVIQyxjQUFNLE1BRkg7QUFHSEMsY0FBTTtBQUNGUCxnQkFBSUEsRUFERjtBQUVGUSxrQkFBTVAsT0FGSjtBQUdGUSxzQkFBVUMsU0FBU0Q7QUFIakIsU0FISDtBQVFIRSxrQkFBVSxNQVJQO0FBU0hDLGlCQUFTLGlCQUFTQyxRQUFULEVBQ1Q7QUFDSSxnQkFBSUEsWUFBWSxDQUFoQixFQUFtQjtBQUNmQyxzQkFBTSwwQkFBTjtBQUNILGFBRkQsTUFFTztBQUNIQSxzQkFBTSxrQ0FBTjtBQUNIO0FBQ0o7QUFoQkUsS0FBUDtBQWtCSDs7QUFFRCxTQUFTQyxZQUFULENBQXNCQyxFQUF0QixFQUEwQjtBQUN0QixXQUFPLDZCQUE0QkMsSUFBNUIsQ0FBaUNELEdBQUdFLGlCQUFILEdBQXVCQyxTQUF4RDtBQUFQO0FBQ0g7O0FBRUQsU0FBU0MsU0FBVCxHQUFxQjtBQUNqQixXQUFPQyxPQUFPQyxXQUFQLElBQXNCLENBQUNDLFNBQVNDLGVBQVQsSUFBNEJELFNBQVNFLElBQXRDLEVBQTRDQyxZQUF6RTtBQUNIOztBQUVELFNBQVNDLGFBQVQsQ0FBdUJYLEVBQXZCLEVBQTJCWSxJQUEzQixFQUFpQztBQUM3QixRQUFJQyxPQUFPYixHQUFHRSxpQkFBSCxFQUFYO0FBQUEsUUFBbUNZLFNBQVNkLEdBQUdlLGtCQUFILEVBQTVDO0FBQ0EsUUFBSUgsSUFBSixFQUNBO0FBQ0lDLGFBQUtWLFNBQUwsSUFBa0Isd0JBQWxCO0FBQ0FXLGVBQU9FLEtBQVAsQ0FBYUMsTUFBYixHQUFzQmIsY0FBYyxJQUFwQztBQUNBRyxpQkFBU0MsZUFBVCxDQUF5QlEsS0FBekIsQ0FBK0JFLFFBQS9CLEdBQTBDLFFBQTFDO0FBQ0gsS0FMRCxNQU9BO0FBQ0lMLGFBQUtWLFNBQUwsR0FBaUJVLEtBQUtWLFNBQUwsQ0FBZWdCLE9BQWYsQ0FBdUIsd0JBQXZCLEVBQWlELEVBQWpELENBQWpCO0FBQ0FMLGVBQU9FLEtBQVAsQ0FBYUMsTUFBYixHQUFzQixFQUF0QjtBQUNBVixpQkFBU0MsZUFBVCxDQUF5QlEsS0FBekIsQ0FBK0JFLFFBQS9CLEdBQTBDLEVBQTFDO0FBQ0g7QUFDRGxCLE9BQUdvQixPQUFIO0FBQ0g7O0FBRUQsSUFBSUMsVUFBVTtBQUNWQyxnQkFBWSxvQkFBU3RDLEVBQVQsRUFBYXVDLElBQWIsRUFDWjtBQUNJLFlBQUlDLFNBQVNqQixTQUFTa0IsY0FBVCxDQUF3QnpDLEVBQXhCLENBQWI7O0FBRUEsWUFBSXVDLFFBQVEsS0FBWixFQUNBO0FBQ0lBLG1CQUFPO0FBQ0hHLHNCQUFNLEtBREg7QUFFSEMsNEJBQVk7QUFGVCxhQUFQO0FBSUg7O0FBRUQsWUFBSUosUUFBUSxLQUFaLEVBQ0E7QUFDSUEsbUJBQU8sZ0JBQVA7QUFDQSxnQkFBSWxCLE9BQU9YLFFBQVAsQ0FBZ0JrQyxJQUFoQixDQUFxQkMsT0FBckIsQ0FBNkIsT0FBN0IsSUFBd0MsQ0FBQyxDQUE3QyxFQUNBO0FBQ0lOLHVCQUFPbEIsT0FBT1gsUUFBUCxDQUFnQmtDLElBQWhCLENBQXFCRSxNQUFyQixDQUE0QnpCLE9BQU9YLFFBQVAsQ0FBZ0JrQyxJQUFoQixDQUFxQkMsT0FBckIsQ0FBNkIsT0FBN0IsSUFBd0MsQ0FBcEUsQ0FBUDtBQUNIO0FBQ0o7O0FBRURFLG1CQUFXQyxZQUFYLENBQXdCUixNQUF4QixFQUFnQ1MsWUFBWVgsVUFBWixDQUF1QjtBQUNuREMsa0JBQU1BLElBRDZDO0FBRW5EVyx1QkFBVztBQUNQLDBCQUFVLGVBQVNsQyxFQUFULEVBQWE7QUFDbkJqQjtBQUNBLDJCQUFPLEtBQVA7QUFDSCxpQkFKTTtBQUtQLHlCQUFTLGNBQVNpQixFQUFULEVBQWE7QUFDbEJqQjtBQUNBLDJCQUFPLEtBQVA7QUFDSCxpQkFSTTtBQVNQLDBCQUFVLGVBVEg7QUFVUCx5QkFBUztBQVZGO0FBRndDLFNBQXZCLENBQWhDO0FBZUgsS0FyQ1M7QUFzQ1ZvRCxVQUFNLGNBQVNuRCxFQUFULEVBQWFNLElBQWIsRUFBbUJpQyxJQUFuQixFQUNOO0FBQ0ksWUFBSSxPQUFPLEtBQUtqQyxJQUFMLENBQVAsS0FBdUIsV0FBM0IsRUFDQTtBQUNJLGlCQUFLQSxJQUFMLEVBQVdOLEVBQVgsRUFBZXVDLElBQWY7QUFDSDtBQUNKO0FBNUNTLENBQWQiLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2F2aW5nKGlkLCBjb250ZW50KVxue1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy9zYXZlLycsXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgY29udDogY29udGVudCxcbiAgICAgICAgICAgIHBhdGhuYW1lOiBsb2NhdGlvbi5wYXRobmFtZVxuICAgICAgICB9LFxuICAgICAgICBkYXRhVHlwZTogJ0pTT04nLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IDEpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcItCU0LDQvdC90YvQtSDRg9C00LDRh9C90L4g0YHQvtGF0YDQsNC90LXQvdGLLlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAsINC00LDQvdC90YvQtSDQvdC10LHRi9C70Lgg0YHQvtGF0YDQsNC90LXQvdGLLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpc0Z1bGxTY3JlZW4oY20pIHtcbiAgICByZXR1cm4gL1xcYkNvZGVNaXJyb3ItZnVsbHNjcmVlblxcYi8udGVzdChjbS5nZXRXcmFwcGVyRWxlbWVudCgpLmNsYXNzTmFtZSk7XG59XG5cbmZ1bmN0aW9uIHdpbkhlaWdodCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0IHx8IChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keSkuY2xpZW50SGVpZ2h0O1xufVxuXG5mdW5jdGlvbiBzZXRGdWxsU2NyZWVuKGNtLCBmdWxsKSB7XG4gICAgdmFyIHdyYXAgPSBjbS5nZXRXcmFwcGVyRWxlbWVudCgpLCBzY3JvbGwgPSBjbS5nZXRTY3JvbGxlckVsZW1lbnQoKTtcbiAgICBpZiAoZnVsbClcbiAgICB7XG4gICAgICAgIHdyYXAuY2xhc3NOYW1lICs9IFwiIENvZGVNaXJyb3ItZnVsbHNjcmVlblwiO1xuICAgICAgICBzY3JvbGwuc3R5bGUuaGVpZ2h0ID0gd2luSGVpZ2h0KCkgKyBcInB4XCI7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHdyYXAuY2xhc3NOYW1lID0gd3JhcC5jbGFzc05hbWUucmVwbGFjZShcIiBDb2RlTWlycm9yLWZ1bGxzY3JlZW5cIiwgXCJcIik7XG4gICAgICAgIHNjcm9sbC5zdHlsZS5oZWlnaHQgPSBcIlwiO1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xuICAgIH1cbiAgICBjbS5yZWZyZXNoKCk7XG59XG5cbnZhciBfZWRpdG9yID0ge1xuICAgIGNvZGVtaXJyb3I6IGZ1bmN0aW9uKGlkLCBtb2RlKVxuICAgIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICAgICBpZiAobW9kZSA9PSAneG1sJylcbiAgICAgICAge1xuICAgICAgICAgICAgbW9kZSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInhtbFwiLFxuICAgICAgICAgICAgICAgIGFsaWduQ0RBVEE6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSA9PSAnc3FsJylcbiAgICAgICAge1xuICAgICAgICAgICAgbW9kZSA9ICd0ZXh0L3gtbWFyaWFkYic7XG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignbWltZT0nKSA+IC0xKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1vZGUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignbWltZT0nKSArIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEob2JqZWN0LCBnZXRTZXR0aW5ncy5jb2RlbWlycm9yKHtcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICBleHRyYUtleXM6IHtcbiAgICAgICAgICAgICAgICBcIkN0cmwtU1wiOiBmdW5jdGlvbihjbSkge1xuICAgICAgICAgICAgICAgICAgICBzYXZpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJDbWQtU1wiOiBmdW5jdGlvbihjbSkge1xuICAgICAgICAgICAgICAgICAgICBzYXZpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJDdHJsLVFcIjogXCJ0b2dnbGVDb21tZW50XCIsXG4gICAgICAgICAgICAgICAgXCJDbWQtUVwiOiBcInRvZ2dsZUNvbW1lbnRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbihpZCwgdHlwZSwgbW9kZSlcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YodGhpc1t0eXBlXSkgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzW3R5cGVdKGlkLCBtb2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn07Il19

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var d = document;

var css = function css(element, style) {
    for (var prop in style) {
        element.style[prop] = style[prop];
    }
};

var animate = function animate(opts, callback) {
    var start = new Date();
    var timer = setInterval(function () {
        var progress = (new Date() - start) / opts.duration;
        if (progress > 1) progress = 1;
        opts.step(progress);
        if (progress == 1) {
            if (callback) {
                callback.apply();
            }
            clearInterval(timer);
        }
    }, opts.delay || 20);

    return {
        stop: function stop() {
            clearInterval(timer);
        }
    };
};

var addClass = function addClass(element, classname) {
    var cn = element.className;
    if (cn.indexOf(classname) != -1) {
        return;
    }
    if (cn != '') {
        classname = ' ' + classname;
    }
    element.className = cn + classname;
};

var removeClass = function removeClass(element, classname) {
    var cn = element.className;
    var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
    cn = cn.replace(rxp, '');
    element.className = cn;
};

function is_string(mixed_var) {
    return typeof mixed_var == 'string';
}

function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var mapConteiner = function mapConteiner(type, mapid) {
    if (type === 'google') {
        googleMaps(mapid);
    } else if (type === 'yandex') {
        yandexMaps(mapid);
    }
};

function checkAll(element) {
    var checked = $(element).prop('checked');
    $('.check-all-spy').prop('checked', checked);
}

function yandexMaps(mapid) {
    var map = {
        link: null,
        mapid: 'map-conteiner-' + mapid,
        place: 'krasnodar',
        type: 'yandex#map', // 'yandex#map' 'yandex#satellite' 'yandex#hybrid' 'yandex#publicMap' 'yandex#publicMapHybrid'
        city: {
            'krasnodar': [45.09471716593029, 39.01589900000001],
            'moscow': [55.76, 37.64]
        },
        getBaloon: function getBaloon(coord) {
            return new ymaps.Placemark(coord, {}, {
                draggable: true
                //,
                //iconImageHref: '/images/myIcon.gif',
                //iconImageSize: [30, 42],
                //iconImageOffset: [-3, -42]
            });
        },
        draw: function draw(ymaps) {
            map.link = new ymaps.Map(this.mapid, {
                center: map.city[this.place],
                zoom: 12,
                type: map.type
            });

            map.link.controls.add('smallZoomControl', { right: 10, top: 15 }).add(new ymaps.control.ScaleLine()).add('searchControl', { left: 20, top: 20 });

            var dragBalloon = this.getBaloon(map.city[this.place]);

            map.link.events.add('click', function (e) {
                map.link.geoObjects.remove(dragBalloon);

                dragBalloon = map.getBaloon(e.get('coordPosition'));
                map.link.geoObjects.add(dragBalloon);

                map.setCoord(e.get('coordPosition'));
            });

            map.link.geoObjects.add(dragBalloon).events.add('dragend', function (e) {
                var object = e.get('target');
                var coords = object.geometry.getCoordinates();
                object.properties.set('balloonContent', coords);

                map.setCoord(coords);
            });
        },
        add: function add() {
            if (arguments.length == 1) {
                map.link.geoObjects.add(new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: arguments[0]
                    }
                }));
            } else {
                var collection = new ymaps.GeoObjectCollection();
                for (var i = 0; i < arguments.length; i++) {
                    collection.add(new ymaps.Placemark(arguments[i]));
                }
                map.link.geoObjects.add(collection);
            }
        }
    };

    ymaps.ready(function () {
        map.draw(ymaps);
    });
}

function googleMaps(mapid) {
    var map = new google.maps.Map(d.getElementById('map-conteiner-' + mapid), {
        zoom: 14,
        zoomControl: !1,
        panControl: !1,
        scrollwheel: !1,
        navigationControl: !1,
        mapTypeControl: !1,
        scaleControl: !1,
        draggable: !0,
        disableDoubleClickZoom: !0,
        center: new google.maps.LatLng(45.053548, 39.016056)
    });
}

var datepicker = function datepicker() {
    var _this = this;

    var $calendar = $('.calendar');

    $calendar.each(function (id, item) {
        var $closest = $(item).closest('.calendar');
        var $element = $closest.find('.calendar-input');
        var disabled = $element.is(':disabled');
        var timestamp = $element.data('timestamp') || false;
        var d_format = timestamp !== false ? 'DD.MM.YYYY' : $element.data('format') || 'DD.MM.YYYY';

        d_format = d_format.toLowerCase();

        if (!disabled) {
            $element.prop('date', '');
            $element.data('format', d_format);

            var $calendarItem = $element.datepicker({
                format: d_format,
                // todayBtn: true,
                autoclose: true,
                container: $closest,
                language: ADMIN_LOCALE
            });

            $calendarItem.on('changeDate', function (ev) {
                var result = $(_this).data('date');

                if (timestamp !== false) {
                    result = new Date(result).getTime() / 1000;
                }

                $element.val($calendarItem.datepicker('getFormattedDate'));
            });

            if ($closest.find('.input-group-addon')) {
                $closest.find('.input-group-addon').on('click', function () {
                    $calendarItem.datepicker('show');
                });
            }
        }
    });
};

function selectize(selector) {
    var $selector = null;

    selector = selector || 'select';

    if (is_string(selector)) {
        $selector = $(selector);
    } else if (is_object(selector)) {
        $selector = selector;
    }

    var options = {
        width: "100%",
        allow_single_deselect: true,
        no_results_text: 'Не найдено!',
        disable_search_threshold: 10
    };

    $selector.each(function () {
        var $select = $(this);
        var placeholder = $select.attr('placeholder');

        if (placeholder) {
            var isMultiple = $select.prop('multiple');

            if (isMultiple) {
                options.placeholder_text_multiple = placeholder;
            } else {
                options.placeholder_text_single = placeholder;
            }
        }

        $select.chosen(options);
    });
}

function changeRow(element) {
    var checked = $(element).prop('checked');

    if (checked) {
        $(element).closest('tr').find('td').addClass('ch');
    } else {
        $(element).closest('tr').find('td').removeClass('ch');
    }
}

function toggle_small_photo(id) {
    $("#" + id).toggle();
}

function removeSection(element, e, id, _self_) {
    e.preventDefault();
    if (confirm('Вы действительно хотите удалить?')) {
        id = parseInt(id);

        var x,
            section = [],
            tmp = $(element).val().split(',');
        for (x in tmp) {
            if (tmp[x] !== '' && parseInt(tmp[x]) !== id) {
                section.push(parseInt(tmp[x]));
            }
        }

        $(_self_).remove();
        $(element).val(section.length > 1 ? section.join(',') : section);
    }
    return false;
}

function slider(id, type, value, min, max, orientation) {
    var element = '#' + id;
    var slider = document.getElementById(id);

    orientation = !orientation ? 'horizontal' : orientation;

    min = min || 0;
    max = max || 100;

    var values = value,
        connect = 'lower',
        behaviour = 'tap-drag';

    if (type == 'range') {
        behaviour = 'tap-drag';
        connect = true;
        values = [value[0], value[1]];
    }

    noUiSlider.create(slider, {
        step: 1,
        animate: false,
        orientation: orientation,
        start: values,
        connect: connect,
        behaviour: behaviour,
        range: {
            'min': min,
            'max': max
        },
        format: wNumb({
            decimals: 0
        })
    });

    var handles = {
        'range': {
            0: 'min',
            1: 'max'
        },
        'slider': {
            0: 'value'
        }
    };

    slider.noUiSlider.on('update', function (values, handle) {
        $(element + '-' + handles[type][handle]).val(values[handle]);
    });
}

function metaCounter() {
    $('.count-number').on('keyup', function () {
        var $block = $(this).closest('.count-number-block'),
            $counter = $block.find('.count-number-block-count'),
            recomend = parseInt($counter.data('recomend')) || '';

        $counter.html($(this).val().length + (recomend !== '' ? '/' + recomend : ''));

        if (recomend !== '' && $(this).val().length > recomend) {
            $counter.addClass('unlim');
        } else if ($counter.hasClass('unlim')) {
            $counter.removeClass('unlim');
        }
    });
}

function seoCrowl() {
    $("input[name='changefreq']").on('change', function () {
        if ($.trim($(this).val()) == 'fixed') {
            $('#changefreq_fixed').removeClass('hidden');
        } else {
            $('#changefreq_fixed').addClass('hidden');
        }
    });

    $("input[name='priority']").on('change', function () {
        if ($.trim($(this).val()) == 'fixed') {
            $('#priority_fixed').removeClass('hidden');
        } else {
            $('#priority_fixed').addClass('hidden');
        }
    });
}

function toggle_item(e, element, id, elclass) {
    e.preventDefault();
    $("#" + id).toggle();
    var $icon = $(element).find('.zmdi');

    if ($icon.hasClass(elclass[0])) {
        $icon.removeClass(elclass[0]);
        $icon.addClass(elclass[1]);
    } else {
        $icon.removeClass(elclass[1]);
        $icon.addClass(elclass[0]);
    }
}

function switch_type_fields(obj) {
    if (obj.checked === true) {
        $("#case2").hide();
        $("#case2 input").attr({ "disabled": true });
        $("#case1").show();
        $("#case1 input").attr({ "disabled": false });
    } else {
        $("#case1").hide();
        $("#case1 input").attr({ "disabled": true });
        $("#case2").show();
        $("#case2 input").attr({ "disabled": false });
    }
}

function show_tr(obj) {
    var val = $(obj).val();

    if (val == 10 || val == 11 || val == 12) $("#to_list").show();else $("#to_list").hide();
}

function translate_key(element) {
    $(element).val(generatePassword(random(14, 24), false, /\w/));

    // $(element).val(PassGenJS.getPassword({
    //     symbols: 0,
    //     letters: random(14, 24),
    //     numbers: 0,
    //     lettersUpper: 0
    // }));
}

function secret(element, length) {
    $(element).val(generatePassword(12, false));

    // $(element).val(PassGenJS.getPassword({
    //     symbols: 0,
    //     letters: random(2, 4),
    //     numbers: random(2, 4),
    //     lettersUpper: random(3, 7)
    // }));
}

function random(min, max) {
    min = min || 0;
    max = max || 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function token(length) {
    length = length || 8;

    var secret = '',
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (i = 1; i < length; i++) {
        var c = Math.floor(Math.random() * chars.length + 1);
        secret += chars.charAt(c);
    }

    return secret;
}

function del_list_fields(id) {
    if (cp.dialog("Вы дейсвительно хотите удалить поле?")) {
        $("#tr" + id).remove();
        /*
        $.post( "/" + ADMIN_DIR + "/ajax/lists/",
             {
                 action: "remove",
                 id: id
             },
             function(data)
             {
                 $("#tr"+id).remove();
             } ,
             "json"
         )
         */
    }
    return false;
}

function add_list_fields() {
    field_counter++;
    str = '<tr id="tr' + field_counter + '">';
    str += '<td><input type="hidden" name="field_id[' + field_counter + ']" value="0" \/>';
    str += '<input type="text" name="field_name[' + field_counter + ']" class="bord padd ness" \/><\/td>';
    str += '<td><input type="text" name="field_sys_name[' + field_counter + ']" class="bord padd ness" \/><\/td>';
    str += '<td><select name="field_type[' + field_counter + ']" class="field_type ness" id="' + field_counter + '" onchange="select_type(this);">';
    $.each(arr_field_type, function (k, v) {
        if (k * 1) str += '<option value="' + k + '">' + v + '<\/option>';
    });
    str += '<\/select><\/td>';
    str += '<td class="addition"><\/td>';
    str += '<td><input type="text" name="f_ord[' + field_counter + ']" value="' + field_counter + '0" class="bord padd w60px r" \/><\/td>';
    str += '<td style="text-align:center"><input type="checkbox" name="in_list[' + field_counter + ']" \/><\/td>';
    str += '<td class="actions c"><a href="#" class="ctr_a ctr_del margin" title="Удалить" onclick="del_list_fields(' + field_counter + ');return false;"><\/a><\/td>';
    str += '<\/tr>';

    $("#add_btn").before(str);
}

function add_list_fields_list() {
    field_counter++;

    var str = ['<tr id="tr' + field_counter + '">', '<td>', '<input type="hidden" name="field_id[' + field_counter + ']" value="0">', '<input name="var[' + field_counter + ']" placeholder="Например: Краснодарский край">', '</td>', '<td><input name="value[' + field_counter + ']" placeholder="Например: 23"></td>', '<td><label class="controll"><input type="checkbox" class="controll__input" value="' + field_counter + '" name="default[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td><input name="ord[' + field_counter + ']" value="' + field_counter + '0" class="ord integer reducing-trigger"></td>', '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_list_fields(' + field_counter + ');return false;"></a></td>', '</tr>'].join('');

    $("#add_btn").before(str);
}

function del_fields(numb) {
    field_counter--;
    $("#tr" + numb).remove();
}

function add_fields() {
    field_counter++;
    var select = '',
        k = '';

    for (k in arr_field_type) {
        if (typeof arr_field_type[k] == 'string') {
            select += '<option value="' + k + '">' + arr_field_type[k] + '</option>';
        }
    }

    var str = ['<tr id="tr' + field_counter + '">', '<td class="va_t"><input name="f_name[' + field_counter + ']" class="ness"></td>', '<td class="va_t"><input name="f_sys_name[' + field_counter + ']" class="ness"></td>', '<td class="va_t"><select name="f_type[' + field_counter + ']" class="f_type ness" data-placeholder="Тип поля" id="fieldtype_' + field_counter + '" onchange="select_type(this)">', select, '</select></td>', '<td class="addition va_t">' + get_addition('input', field_counter) + '</td>', '<td class="va_t"><input name="f_ord[' + field_counter + ']" value="' + field_counter + '0"></td>', '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_in_list[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_index[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_unique[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_fields(' + field_counter + ');return false;"></a></td>', '</tr>'].join('');

    $("#add_btn").before(str);

    selectize('#fieldtype_' + field_counter);
}

function add_fields_list() {
    field_counter++;

    str = ['<tr id="tr' + field_counter + '">', '<td><input name="var[' + field_counter + ']"></td>', '<td><input name="value[' + field_counter + ']"></td>', '<td><input type="checkbox" name="default[' + field_counter + ']"></td>', '<td><input name="ord[' + field_counter + ']" value="' + field_counter + '0"></td>', '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_fields(' + field_counter + ');return false;"></a></td>', '</tr>'].join('\n');

    $("#add_btn").before(str);
}

function select_type(obj) {
    var row_numd = 1 * $(obj).attr("id").split('_')[1],
        append_obj = $("#tr" + row_numd + " .addition"),
        str = get_addition(obj.value.split(':')[0], row_numd);

    $(append_obj).empty().append(str || '');

    selectize();
}

function get_addition(type, index) {
    var tmp = [],
        str = [];

    if (['input', 'cost', 'int', 'hidden', 'document', 'timestamp', 'email', 'list', 'autocomplete', 'select', 'treeselect', 'float', 'system', 'multiselect', 'datetime'].indexOf(type) >= 0) {
        str = ['<div class="group">', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="25"><span class="group__item__style"></span><span class="group__item__text">25%</span></label>', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="50"><span class="group__item__style"></span><span class="group__item__text">50%</span></label>', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="75"><span class="group__item__style"></span><span class="group__item__text">75%</span></label>', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="100" checked><span class="group__item__style"></span><span class="group__item__text">100%</span></label>', '</div>'];

        if (['list', 'autocomplete', 'select', 'treeselect', 'radio', 'multiselect', 'checkbox', 'system'].indexOf(type) >= 0) {
            str.push('<div class="cb mb10"></div>');
        }
    }

    if (type == 'hidden') {
        str.push('<input value="" name="f_hidden_default[' + index + ']" placeholder="Значение по умолчанию">');
    }

    if (type == 'system') {
        str.push('<input value="" name="f_binding[' + index + ']" placeholder="Например поле (title)">');
    }

    if (type == 'date') {
        tmp = ['<div class="help-cover">', '<input name="f_date_format[' + index + ']" value="DD.MM.YYYY" placeholder="Формат даты">', '<div class="tooltip tooltip-down">', 'D — день,<br>', 'M — месяц (без нуля впереди)<br>', 'DD, MM — день и месяц с нулём впереди для значений от 1 до 9<br>', 'YY — 2-символьное обозначение года<br>', 'YYYY — 4-символьное обозначение года (год пишется полностью)', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (['file', 'image'].indexOf(type) >= 0) {
        tmp = ['<div class="option-group option-combo">', '<label><input type="radio" name="f_file_count[' + index + ']" value="0"><span class="option">Один файл</span></label>', '<label><input type="radio" name="f_file_count[' + index + ']" value="1" checked><span class="option">Много файлов</span></label>', '</div>'];

        if (type == 'image') {
            tmp.push('<div class="cb mb10"></div>');
        }

        str.push(tmp.join('\n'));
    }

    if (['gallery', 'image'].indexOf(type) >= 0 && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.image !== 'undefined') {
        var tmp0 = [],
            tmp1 = [],
            tmp2 = [],
            x,
            checked = '';
        tmp0 = ['<div class="js-size-list">', '<table class="table-simple">', '<col><col><col><col width="57"><col width="20">', '<thead>', '<tr>', '<td class="h">Префикс</td>', '<td class="h">Ширина</td>', '<td class="h">Высота</td>', '<td class="h">Метод</td>', '<td class="h"></td>', '</tr>', '</thead>', '<tbody>'];

        tmp1 = template('tpl_image_row', {
            index: 0,
            button: true,
            iteration: index
        });

        tmp2 = ['</tbody>', '</table>', '<a href="#" class="add-size js-add-size" data-iteration="{$smarty.foreach.i.iteration}"><i class="icon icon-plus-square"></i> Добавить размер</a>', '</div>'];

        str.push(tmp0.join('\n'));
        str.push(tmp1);
        str.push(tmp2.join('\n'));
    }

    if (['embedded'].indexOf(type) >= 0) {
        if (!is_undefined(MODULE_LIST)) {
            var select = '',
                m;

            for (m in MODULE_LIST) {
                select += '<option value="' + m + '">' + MODULE_LIST[m].name + '</option>';
            }
        }

        tmp = ['<div class="j-select-wrapper">', '<div class="mb5">', '<select name="f_module[' + index + ']" data-placeholder="Выбрать модуль" class="j-select-choosen">', '<option value="0">---</option>', select, '</select>', '</div>', '<div class="clearfix j-select-container">', '<select name="f_fields[' + index + '][]" multiple data-placeholder="Выбрать" disabled></select>', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (['list', 'section', 'autocomplete', 'select', 'treeselect', 'radio', 'checkbox', 'multiselect'].indexOf(type) >= 0) {
        tmp = ['<div class="cb clearfix">', '<label class="controll"><input type="checkbox" class="controll__input" value="1" onchange="switch_types(this)" name="f_use_table_list[' + index + ']"><span class="controll__visible controll__visible_checkbox"></span><span class="controll__text">привязать к `#__mdd_lists`</span></label>', '<div class="case case0">', '<input name="f_table_name[' + index + ']" value="" class="mb5" placeholder="Название таблицы (#_news)">', '<input name="f_table_field[' + index + ']" value="" placeholder="Поле (title)">', '</div>', '<div class="case case1 hidden">', '<input name="f_table_list[' + index + ']" disabled placeholder="BIND списка" value="">', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (['range', 'slider'].indexOf(type) >= 0) {
        tmp = ['<div class="-col">', '<div class="-left">', '<input name="f_range[' + index + '][min]" value="" placeholder="Min" class="integer">', '</div>', '<div class="-right">', '<input name="f_range[' + index + '][max]" value="" placeholder="Max" class="integer">', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (type == 'editor' && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.editor !== 'undefined') {
        tmp = [];
        tmp.push('<div class="option-group option-combo">');

        var x,
            checked = '';

        for (x in CONFIGURE.editor) {
            checked = '';

            if (typeof CONFIGURE.editor[x]['default'] !== 'undefined' && CONFIGURE.editor[x]['default'] == 1) {
                checked = ' checked';
            }

            tmp.push('<label><input type="radio" name="f_editor[' + index + ']" value="' + CONFIGURE.editor[x]['system'] + '" ' + checked + '><span class="option">' + CONFIGURE.editor[x]['name'] + '</span></label>');
        }

        tmp.push('</div>');

        if (typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.editor_mode !== 'undefined') {
            tmp.push('<div class="cb mb10"></div>');

            tmp.push('<div class="option-group">');
            for (x in CONFIGURE.editor_mode) {
                tmp.push('<label><input type="radio" name="f_editor_mode[' + index + ']" value="' + CONFIGURE.editor_mode[x] + '"><span class="option">' + CONFIGURE.editor_mode[x] + '</span></label>');
            }

            tmp.push('</div>');
        }

        str.push(tmp.join('\n'));
    }

    if (type == 'redactor' && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.redactor !== 'undefined') {
        tmp = [];
        tmp.push('<div class="group">');

        var x,
            checked = '';

        for (x in CONFIGURE.redactor) {
            if (typeof CONFIGURE.redactor[x]['name'] !== 'undefined' && typeof CONFIGURE.redactor[x]['system'] !== 'undefined') {
                checked = '';

                if (typeof CONFIGURE.redactor[x]['default'] !== 'undefined' && CONFIGURE.redactor[x]['default'] == 1) {
                    checked = ' checked';
                }

                tmp.push('<label class="group__item"><input type="radio" class="group__item__rb" name="f_redactor[' + index + ']" value="' + CONFIGURE.redactor[x]['system'] + '"' + checked + '><span class="group__item__style"></span><span class="group__item__text">' + CONFIGURE.redactor[x]['name'] + '</span></label>');
            }
        }

        tmp.push('</div>');

        str.push(tmp.join('\n'));
    }

    return str.join('\n');
}

function switch_types(obj) {
    p_obj = $(obj).closest('td');
    if (obj.checked) {
        $(".case1", p_obj).show();
        $(".case1 input", p_obj).attr({ "disabled": false });
        $(".case0", p_obj).hide();
        $(".case0 input", p_obj).attr({ "disabled": true });
    } else {
        $(".case0", p_obj).show();
        $(".case0 input", p_obj).attr({ "disabled": false });
        $(".case1", p_obj).hide();
        $(".case1 input", p_obj).attr({ "disabled": true });
    }
}

function humanSize(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }

    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' Гб';
    }

    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' Мб';
    }

    if (bytes >= 1024) {
        return (bytes / 1000).toFixed(2) + ' Кб';
    }

    return bytes + ' б';
}

function addExtendet() {
    $.post("/" + ADMIN_DIR + "/ajax/vote/", {
        action: $("#action").attr("value"),
        id: $("#id").attr("value"),
        title: $("#title").attr("value"),
        ord: $("#ord").attr("value"),
        visible: $("#VoteAddQuestions input:radio[name=visible]:checked").val()
    }, onAjaxSuccessAdd);
    function onAjaxSuccessAdd(data) {
        //
        var vis;
        if ($("#VoteAddQuestions input:radio[name=visible]:checked").val() == 1) vis = "Да";else vis = "Нет";

        var inner = '<tr id="tr_' + data + '">';
        inner += '<td>';
        inner += '<input name="parent_id_' + data + '" id="parent_id_' + data + '" value="2" type="hidden">';
        inner += '<input name="id_' + data + '" id="id_' + data + '" value="' + data + '" type="hidden">';
        inner += '<div id="title_' + data + '"><b>' + $("#title").attr("value") + '</b></div>';
        inner += '<div id="title_i_' + data + '" style="display: none;">';
        inner += '<input name="title_' + data + '" value="' + $("#title").attr("value") + '" class="bord padd w100" id="title_input_' + data + '" type="text">';
        inner += '<p align="right">';
        inner += '<a href="javascript:;" onclick="saveExtendet(\'' + data + '\');">Сохранить</a> | ';
        inner += '<a href="javascript:;" onclick="cancelExtendet(\'' + data + '\');">Отмена</a> ';
        inner += '</p>';
        inner += '</div>';
        inner += '</td>';
        inner += '<td>';
        inner += '<div id="ord_' + data + '"><b>' + $("#ord").attr("value") + '</b></div>';
        inner += '<div id="ord_i_' + data + '" style="display: none;">';
        inner += '<input name="ord_' + data + '" value="' + $("#ord").attr("value") + '" style="width: 100%;" class="bord padd w100" id="ord_input_' + data + '" type="text">';
        inner += '</div>';
        inner += '</td>';

        inner += '<td align="center">';
        inner += '<div id="visible_' + data + '"><b>' + vis + '</b></div>';
        inner += '<div id="visible_i_' + data + '" style="display: none;">';
        inner += '<input name="visible_' + data + '" value="1" checked="checked" onclick="$(\'#vis_' + data + '\').val(\'1\');" id="visible_input_' + data + '_1" type="radio">Да &nbsp;&nbsp;';
        inner += '<input name="visible_' + data + '" value="0" onclick="$(\'#vis_' + data + '\').val(\'0\');" id="visible_input_' + data + '_0" type="radio">Нет';
        inner += '<input name="vis_' + data + '" id="vis_' + data + '" value="" type="hidden">';
        inner += '</div>';
        inner += '</td>';
        inner += '<td>';
        inner += '<a href="#" class="icon icon-edit" onclick="editExtendet(\'' + data + '\')"></a>';
        inner += '<a href="#" class="icon icon-delete remove-trigger" onClick="delExtendet(\'' + data + '\')"></a>';
        inner += '</td>';
        inner += '</tr>';

        //  INSERT NEW FIELD
        $(inner).insertBefore("#ajax_add_form");

        //  RESET FORMS ELEMENTS
        $("#title").attr({ value: "" });
        $("#ord").attr({ value: "" });

        //  HIDE FORM
        $("#ajax_add_form").hide();
    }
}
function saveExtendet(id) {
    $.post("/" + ADMIN_DIR + "/ajax/vote/", {
        action: "update",
        id: $("#id_" + id).attr("value"),
        parent_id: $("#parent_id_" + id).attr("value"),
        title: $("#title_input_" + id).attr("value"),
        ord: $("#ord_input_" + id).attr("value"),
        visible: $("#VoteAddQuestions input:radio[name=visible_" + id + "]:checked").val()
    }, onAjaxSuccessSave);
    function onAjaxSuccessSave(data) {
        var vis;
        if ($("#vis_" + id).val() == 1) vis = "Да";else vis = "Нет";
        $("#title_" + id).html("<b>" + $("#title_input_" + id).attr("value") + "</b>");
        $("#ord_" + id).html($("#ord_input_" + id).attr("value"));
        $("#visible_" + id).html(vis);

        $("#title_" + id).show();
        $("#ord_" + id).show();
        $("#visible_" + id).show();
        $("#title_i_" + id).hide();
        $("#ord_i_" + id).hide();
        $("#visible_i_" + id).hide();
    }
}
//
function editExtendet(id) {
    $("#title_" + id).hide();
    $("#ord_" + id).hide();
    $("#visible_" + id).hide();
    $("#title_i_" + id).show();
    $("#ord_i_" + id).show();
    $("#visible_i_" + id).show();
}
//
function delExtendet(id) {
    if (cp.dialog("Вы действительно хотите удалить запись?")) {
        $.post("/" + ADMIN_DIR + "/ajax/vote/", {
            action: "del",
            id: $("#id_" + id).val()
        }, onAjaxSuccessDel);
    }
}
function onAjaxSuccessDel(data) {
    $("#tr_" + data).remove();
}
//
function cancelExtendet(id) {
    $("#title_" + id).show();
    $("#ord_" + id).show();
    $("#visible_" + id).show();
    $("#title_i_" + id).hide();
    $("#ord_i_" + id).hide();
    $("#visible_i_" + id).hide();
}

function onAjaxSuccess(data) {
    alert(data);
}

function editTitle(id, title) {
    if (typeof title == 'undefined') {
        var title = $('#ftitle_' + id).text();
    }

    var name = prompt('Введите новое имя', title);

    if (name != '' && name != title && name !== null) {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/filename',
            type: "post",
            data: {
                id: id,
                name: name
            },
            dataType: 'JSON',
            success: function success(response) {
                if (response.status === true) {
                    $('#ftitle_' + id).html(name);
                }
            }
        });
    }

    return false;
}

function editVisible(id, visible) {
    visible = visible == 1 ? 0 : 1;

    $.ajax({
        url: '/' + ADMIN_DIR + '/meta/filevisible',
        type: "post",
        data: {
            id: id,
            visible: visible
        },
        dataType: 'JSON',
        success: function success(response) {
            if (response.status === true) {
                $('#fvisible_' + id).removeClass('icon-eye icon-eye-off');

                if (visible == 1) {
                    $('#fvisible_' + id).addClass('icon-eye');
                } else {
                    $('#fvisible_' + id).addClass('icon-eye-off');
                }
            }
        }
    });

    return false;
}

function editOrd(id, ord) {
    var neword = prompt('Порядок', ord);

    if (!neword) return false;

    if (neword != '' && neword != ord) {
        $.post('/' + ADMIN_DIR + '/ajax/meta/', { action: "newfileord", neword: neword, id: id }, function (data) {
            if (data == 1) {
                $('#ordfile_' + id).html(neword);
            }
        });
    }
    return false;
}

function ajax_vis_toggle(obj, id, mod_id) {
    $(obj).append('<i class="loading"></i>');

    $.post('/' + ADMIN_DIR + '/ajax/structure/', { act: "toggle_visible", mod_id: mod_id, id: id }, function (data) {
        if (data == 1) {
            $(obj).toggleClass("icon-eye").toggleClass("icon-eye-off").html('');
        }
    });

    return !1;
}

function show_tooltips(id) {
    $("#" + id).toggle();
}

function my_uncheck() {
    $(".access").each(function () {
        $(this).attr({ checked: '' });
    });
}

function CheckAndSubmit(id) {
    var flag = true;
    $("#" + id + " .ness").each(function () {
        if ($(this).val() == "") {
            $(this).focus().addClass("error");
            flag = false;
            return false;
        } else {
            $(this).removeClass("error");
        }
    });
    if (flag) $("#" + id).submit();else return false;
}

function setSort(obj, cookie_name) {
    value = $(obj).val();
    setCookie(cookie_name, value);
    location.href = location.href;
}

function form_submit(id, param) {
    if (param == "save") $("#" + id).submit();
    if (param == "apply") $("#" + id).submit();else $("#" + id).submit();
}

function openwin(img, w, h, title) {
    if (hwnd != null) hwnd.close();
    hwnd = window.open(img, "", "toolbar=no , location=no , directories=no , resizable=no , width=" + w + " , height=" + h);
    hwnd.document.open();
    hwnd.document.write("<html>");
    hwnd.document.write("<head>");
    hwnd.document.write("<title>" + title + "</title>");
    hwnd.document.write("</head>");
    hwnd.document.write("<body bgcolor=#ffffff bottommargin=0 leftmargin=0 marginheight=0 marginwidth=0 rightmargin=0 topmargin=0 style='border:0px;'>");
    hwnd.document.write("<table align=center width=100% height=100% cellspacing=0 cellpadding=0 border=0>");
    hwnd.document.write("<tr><td><img src='" + img + "' border=0></td></tr>");
    hwnd.document.write("</table></body></html>");
    hwnd.document.close();
}

function openwin_text(url, w, h) {
    window.open(url, "", "toolbar=no , location=no , directories=no , resizable=no , scrollbars=no , width=" + w + " , height=" + h);
}

function ltrim(str) {
    for (var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++) {}
    return str.substring(k, str.length);
}

function rtrim(str) {
    for (var j = str.length - 1; j >= 0 && isWhitespace(str.charAt(j)); j--) {}
    return str.substring(0, j + 1);
}

function trim(str) {
    str = str.replace(/\s{2,}/g, ' ');
    return ltrim(rtrim(str));
}

function isWhitespace(charToCheck) {
    var whitespaceChars = " \t\n\r\f";
    return whitespaceChars.indexOf(charToCheck) != -1;
}

function transliterate(string, url) {
    string = trim(string.toLowerCase());

    if (string != '') {
        var _char_map;

        var char_map = {},
            test = [],
            result = '',
            x;

        char_map = (_char_map = {
            // Latin
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o',
            'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th',
            'ÿ': 'y',

            // Greek
            'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
            'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
            'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
            'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
            'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',

            // Turkish
            'ş': 's', 'ı': 'i' }, _defineProperty(_char_map, '\xE7', 'c'), _defineProperty(_char_map, '\xFC', 'u'), _defineProperty(_char_map, '\xF6', 'o'), _defineProperty(_char_map, 'ğ', 'g'), _defineProperty(_char_map, 'а', 'a'), _defineProperty(_char_map, 'б', 'b'), _defineProperty(_char_map, 'в', 'v'), _defineProperty(_char_map, 'г', 'g'), _defineProperty(_char_map, 'д', 'd'), _defineProperty(_char_map, 'е', 'e'), _defineProperty(_char_map, 'ё', 'yo'), _defineProperty(_char_map, 'ж', 'zh'), _defineProperty(_char_map, 'з', 'z'), _defineProperty(_char_map, 'и', 'i'), _defineProperty(_char_map, 'й', 'j'), _defineProperty(_char_map, 'к', 'k'), _defineProperty(_char_map, 'л', 'l'), _defineProperty(_char_map, 'м', 'm'), _defineProperty(_char_map, 'н', 'n'), _defineProperty(_char_map, 'о', 'o'), _defineProperty(_char_map, 'п', 'p'), _defineProperty(_char_map, 'р', 'r'), _defineProperty(_char_map, 'с', 's'), _defineProperty(_char_map, 'т', 't'), _defineProperty(_char_map, 'у', 'u'), _defineProperty(_char_map, 'ф', 'f'), _defineProperty(_char_map, 'х', 'h'), _defineProperty(_char_map, 'ц', 'c'), _defineProperty(_char_map, 'ч', 'ch'), _defineProperty(_char_map, 'ш', 'sh'), _defineProperty(_char_map, 'щ', 'sch'), _defineProperty(_char_map, 'ъ', ''), _defineProperty(_char_map, 'ы', 'y'), _defineProperty(_char_map, 'ь', ''), _defineProperty(_char_map, 'э', 'e'), _defineProperty(_char_map, 'ю', 'yu'), _defineProperty(_char_map, 'я', 'ya'), _defineProperty(_char_map, 'є', 'ye'), _defineProperty(_char_map, 'і', 'i'), _defineProperty(_char_map, 'ї', 'yi'), _defineProperty(_char_map, 'ґ', 'g'), _defineProperty(_char_map, 'č', 'c'), _defineProperty(_char_map, 'ď', 'd'), _defineProperty(_char_map, 'ě', 'e'), _defineProperty(_char_map, 'ň', 'n'), _defineProperty(_char_map, 'ř', 'r'), _defineProperty(_char_map, 'š', 's'), _defineProperty(_char_map, 'ť', 't'), _defineProperty(_char_map, 'ů', 'u'), _defineProperty(_char_map, 'ž', 'z'), _defineProperty(_char_map, 'ą', 'a'), _defineProperty(_char_map, 'ć', 'c'), _defineProperty(_char_map, 'ę', 'e'), _defineProperty(_char_map, 'ł', 'l'), _defineProperty(_char_map, 'ń', 'n'), _defineProperty(_char_map, '\xF3', 'o'), _defineProperty(_char_map, 'ś', 's'), _defineProperty(_char_map, 'ź', 'z'), _defineProperty(_char_map, 'ż', 'z'), _defineProperty(_char_map, 'ā', 'a'), _defineProperty(_char_map, '\u010D', 'c'), _defineProperty(_char_map, 'ē', 'e'), _defineProperty(_char_map, 'ģ', 'g'), _defineProperty(_char_map, 'ī', 'i'), _defineProperty(_char_map, 'ķ', 'k'), _defineProperty(_char_map, 'ļ', 'l'), _defineProperty(_char_map, 'ņ', 'n'), _defineProperty(_char_map, '\u0161', 's'), _defineProperty(_char_map, 'ū', 'u'), _defineProperty(_char_map, '\u017E', 'z'), _char_map);

        // Очищаем от лишних символов

        result = string.replace(/[^a-zа-я0-9]/gi, '-');

        if (url == 'cyrillic') {
            result = encodeURI(unescape(unescape(result)));
        } else if (url == 'translate') {
            for (x in char_map) {
                result = result.replace(RegExp(x, 'g'), char_map[x]);
            }
            // result = result.replace(RegExp(x, 'g'), char_map[x]);
        } else {
            for (x in char_map) {
                result = result.replace(RegExp(x, 'g'), char_map[x]);
            }
        }

        // Очищаем от лишних дефисов

        test = result.split('');

        if (test[0] == '-') {
            result = result.slice(1);
        }

        if (test[test.length - 1] == '-') {
            result = result.slice(0, -1);
        }

        string = result;
    }

    return redouble(string);
}

function binding(name, element) {
    $('body').on('keyup blur keypress', 'input[name="' + name + '"]', function () {
        if (this.value !== '') {
            var $input = $('input[name="' + element + '"]');
            if (!$input.prop('readonly')) {
                $input.val(transliterate(this.value, URL_TRANSLATE));
            }
        }
    });
}

function redouble(string) {
    string = string.replace('__', '_');
    string = string.replace('_-_', '_');
    string = string.replace('--', '-');

    if (string.indexOf('__') > -1) {
        return redouble(string);
    }

    if (string.substr(0, 1) == '_' && string.length > 1) {
        string = string.substr(1, string.length);
    }

    return string;
}

function ajax_toggle_group(obj, id) {
    var visible = 0;

    if ($(obj).hasClass('icon-eye-off')) {
        visible = 1;
    } else {
        visible = 0;
    }

    $(obj).append('<i class="loading"></i>');

    $.post('/' + ADMIN_DIR + '/ajax/modules/', { action: "devisible", id: id, visible: visible }, function (data) {
        if (data == 1) {
            if ($(obj).hasClass('icon-eye-off')) {
                $(obj).removeClass('icon-eye-off').addClass('icon-eye').html('');
            } else {
                $(obj).removeClass('icon-eye').addClass('icon-eye-off').html('');
            }
        }
    });

    return false;
}

function toggle_menu(obj, id) {
    $(obj).toggleClass("minus").toggleClass("plus").parent();
    $("#item" + id).toggle();
}

function toggle_small_photo(id) {
    $("#" + id).toggle();
}

function hideField(id) {
    title = $("#docs_" + id + " .title_in").val();
    ord = $("#docs_" + id + " .ord_in").val();

    $("#docs_" + id + " .title_f").empty().append(title);
    $("#docs_" + id + " .ord_f").empty().append(ord);
    $("#docs_" + id + " .but_save").hide();
    $("#docs_" + id + " .ctr_edit").show();
}

function EditDocs(id) {
    $("#docs_" + id + " .but_save").show();
    $("#docs_" + id + " .ctr_edit").hide();

    curr_value = $("#docs_" + id + " .title_f").text();
    $("#docs_" + id + " .title_f").empty().append("<input type='text' value='" + curr_value + "' name='title' class='bord padd w100 title_in' />");
    curr_value = $("#docs_" + id + " .ord_f").text();
    $("#docs_" + id + " .ord_f").empty().append("<input type='text' value='" + curr_value + "' name='ord' class='bord padd w20 ord_in' />");

    $("#docs_" + id + " .title_in").focus();
    return false;
}

function SaveDocs(id) {
    title = $("#docs_" + id + " .title_in").val();
    ord = $("#docs_" + id + " .ord_in").val();

    if (!title) {
        alert("Пустое имя документа");
        hideField(id);
    }

    $.post('/' + ADMIN_DIR + '/ajax/document/', {
        id: "document_edit",
        docsid: id,
        title: title,
        ord: ord
    }, function (data) {
        alert('Данные обновлены');
        hideField(id);
    });
    return false;
}

function DelDocs(id) {
    if (cp.dialog('Вы действительно хотите удалить?')) {
        $.post('/' + ADMIN_DIR + '/ajax/document/', {
            id: "document_del",
            docsid: id
        }, function (data) {
            if (data > 0) {
                $("#docs_" + id).hide();
            } else alert('ошибка обновления');
        });
    }
    return false;
}

function page_update(item_id) {
    $.post('/' + ADMIN_DIR + '/ajax/document/', {
        id: "update", post_id: item_id
    }, function (data) {
        var json = eval("(" + data + ")");
        parseMsg(json, "file_docs");
    });
    return false;
}

function parseMsg(msg, obj) {
    $("#" + obj + " .uploadfiles").empty();
    $("#" + obj + " input:file").attr({ "value": "" });

    str = '<table style="margin-bottom:10px;width:80%"><tr>\n<td class="h w100">Документ</td>\n<td class="h">Размер</td>\n<td class="h">Удалить</td></tr>\n';
    var i = 0;
    $.each(msg, function (k, v) {
        if (i % 2 != 0) odd = "odd ";else odd = "";
        str += '<tr>\n<td class="' + odd + '"><a href="' + v.sys_name + '" title="" target="_blank">' + v.title + '</a></td>\n';
        str += '<td class="' + odd + 'r"> ' + v.size + '</td>\n';
        str += '<td class="actions"><a href="#" onclick="return Module.ajaxFileDelete(' + v.id + ',\'' + obj + '\');" class="ctr_a ctr_del margin" title="Удалить" onclick="return confirm(\'Вы действительно хотите удалить?\')"></a></td>\n</tr>\n';
        i++;
    });
    str += '</table>';
    $("#" + obj + " .uploadfiles").append(str);
}

function ajaxFileDocsUpload(docs_group_id) {}

function screening(str) {
    var reg = /"/g;
    var result = str.replace(reg, "&quot;");

    return result;
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOlsiZCIsImRvY3VtZW50IiwiY3NzIiwiZWxlbWVudCIsInN0eWxlIiwicHJvcCIsImFuaW1hdGUiLCJvcHRzIiwiY2FsbGJhY2siLCJzdGFydCIsIkRhdGUiLCJ0aW1lciIsInNldEludGVydmFsIiwicHJvZ3Jlc3MiLCJkdXJhdGlvbiIsInN0ZXAiLCJhcHBseSIsImNsZWFySW50ZXJ2YWwiLCJkZWxheSIsInN0b3AiLCJhZGRDbGFzcyIsImNsYXNzbmFtZSIsImNuIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwicnhwIiwiUmVnRXhwIiwicmVwbGFjZSIsImlzX3N0cmluZyIsIm1peGVkX3ZhciIsImlzX251bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJtYXBDb250ZWluZXIiLCJ0eXBlIiwibWFwaWQiLCJnb29nbGVNYXBzIiwieWFuZGV4TWFwcyIsImNoZWNrQWxsIiwiY2hlY2tlZCIsIiQiLCJtYXAiLCJsaW5rIiwicGxhY2UiLCJjaXR5IiwiZ2V0QmFsb29uIiwiY29vcmQiLCJ5bWFwcyIsIlBsYWNlbWFyayIsImRyYWdnYWJsZSIsImRyYXciLCJNYXAiLCJjZW50ZXIiLCJ6b29tIiwiY29udHJvbHMiLCJhZGQiLCJyaWdodCIsInRvcCIsImNvbnRyb2wiLCJTY2FsZUxpbmUiLCJsZWZ0IiwiZHJhZ0JhbGxvb24iLCJldmVudHMiLCJlIiwiZ2VvT2JqZWN0cyIsInJlbW92ZSIsImdldCIsInNldENvb3JkIiwib2JqZWN0IiwiY29vcmRzIiwiZ2VvbWV0cnkiLCJnZXRDb29yZGluYXRlcyIsInByb3BlcnRpZXMiLCJzZXQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJHZW9PYmplY3QiLCJjb29yZGluYXRlcyIsImNvbGxlY3Rpb24iLCJHZW9PYmplY3RDb2xsZWN0aW9uIiwiaSIsInJlYWR5IiwiZ29vZ2xlIiwibWFwcyIsImdldEVsZW1lbnRCeUlkIiwiem9vbUNvbnRyb2wiLCJwYW5Db250cm9sIiwic2Nyb2xsd2hlZWwiLCJuYXZpZ2F0aW9uQ29udHJvbCIsIm1hcFR5cGVDb250cm9sIiwic2NhbGVDb250cm9sIiwiZGlzYWJsZURvdWJsZUNsaWNrWm9vbSIsIkxhdExuZyIsImRhdGVwaWNrZXIiLCIkY2FsZW5kYXIiLCJlYWNoIiwiaWQiLCJpdGVtIiwiJGNsb3Nlc3QiLCJjbG9zZXN0IiwiJGVsZW1lbnQiLCJmaW5kIiwiZGlzYWJsZWQiLCJpcyIsInRpbWVzdGFtcCIsImRhdGEiLCJkX2Zvcm1hdCIsInRvTG93ZXJDYXNlIiwiJGNhbGVuZGFySXRlbSIsImZvcm1hdCIsImF1dG9jbG9zZSIsImNvbnRhaW5lciIsImxhbmd1YWdlIiwiQURNSU5fTE9DQUxFIiwib24iLCJldiIsInJlc3VsdCIsImdldFRpbWUiLCJ2YWwiLCJzZWxlY3RpemUiLCJzZWxlY3RvciIsIiRzZWxlY3RvciIsImlzX29iamVjdCIsIm9wdGlvbnMiLCJ3aWR0aCIsImFsbG93X3NpbmdsZV9kZXNlbGVjdCIsIm5vX3Jlc3VsdHNfdGV4dCIsImRpc2FibGVfc2VhcmNoX3RocmVzaG9sZCIsIiRzZWxlY3QiLCJwbGFjZWhvbGRlciIsImF0dHIiLCJpc011bHRpcGxlIiwicGxhY2Vob2xkZXJfdGV4dF9tdWx0aXBsZSIsInBsYWNlaG9sZGVyX3RleHRfc2luZ2xlIiwiY2hvc2VuIiwiY2hhbmdlUm93IiwidG9nZ2xlX3NtYWxsX3Bob3RvIiwidG9nZ2xlIiwicmVtb3ZlU2VjdGlvbiIsIl9zZWxmXyIsInByZXZlbnREZWZhdWx0IiwiY29uZmlybSIsInBhcnNlSW50IiwieCIsInNlY3Rpb24iLCJ0bXAiLCJzcGxpdCIsInB1c2giLCJqb2luIiwic2xpZGVyIiwidmFsdWUiLCJtaW4iLCJtYXgiLCJvcmllbnRhdGlvbiIsInZhbHVlcyIsImNvbm5lY3QiLCJiZWhhdmlvdXIiLCJub1VpU2xpZGVyIiwiY3JlYXRlIiwicmFuZ2UiLCJ3TnVtYiIsImRlY2ltYWxzIiwiaGFuZGxlcyIsImhhbmRsZSIsIm1ldGFDb3VudGVyIiwiJGJsb2NrIiwiJGNvdW50ZXIiLCJyZWNvbWVuZCIsImh0bWwiLCJoYXNDbGFzcyIsInNlb0Nyb3dsIiwidHJpbSIsInRvZ2dsZV9pdGVtIiwiZWxjbGFzcyIsIiRpY29uIiwic3dpdGNoX3R5cGVfZmllbGRzIiwib2JqIiwiaGlkZSIsInNob3ciLCJzaG93X3RyIiwidHJhbnNsYXRlX2tleSIsImdlbmVyYXRlUGFzc3dvcmQiLCJyYW5kb20iLCJzZWNyZXQiLCJNYXRoIiwiZmxvb3IiLCJ0b2tlbiIsImNoYXJzIiwiYyIsImNoYXJBdCIsImRlbF9saXN0X2ZpZWxkcyIsImNwIiwiZGlhbG9nIiwiYWRkX2xpc3RfZmllbGRzIiwiZmllbGRfY291bnRlciIsInN0ciIsImFycl9maWVsZF90eXBlIiwiayIsInYiLCJiZWZvcmUiLCJhZGRfbGlzdF9maWVsZHNfbGlzdCIsImRlbF9maWVsZHMiLCJudW1iIiwiYWRkX2ZpZWxkcyIsInNlbGVjdCIsImdldF9hZGRpdGlvbiIsImFkZF9maWVsZHNfbGlzdCIsInNlbGVjdF90eXBlIiwicm93X251bWQiLCJhcHBlbmRfb2JqIiwiZW1wdHkiLCJhcHBlbmQiLCJpbmRleCIsIkNPTkZJR1VSRSIsImltYWdlIiwidG1wMCIsInRtcDEiLCJ0bXAyIiwidGVtcGxhdGUiLCJidXR0b24iLCJpdGVyYXRpb24iLCJpc191bmRlZmluZWQiLCJNT0RVTEVfTElTVCIsIm0iLCJuYW1lIiwiZWRpdG9yIiwiZWRpdG9yX21vZGUiLCJyZWRhY3RvciIsInN3aXRjaF90eXBlcyIsInBfb2JqIiwiaHVtYW5TaXplIiwiYnl0ZXMiLCJ0b0ZpeGVkIiwiYWRkRXh0ZW5kZXQiLCJwb3N0IiwiQURNSU5fRElSIiwiYWN0aW9uIiwidGl0bGUiLCJvcmQiLCJ2aXNpYmxlIiwib25BamF4U3VjY2Vzc0FkZCIsInZpcyIsImlubmVyIiwiaW5zZXJ0QmVmb3JlIiwic2F2ZUV4dGVuZGV0IiwicGFyZW50X2lkIiwib25BamF4U3VjY2Vzc1NhdmUiLCJlZGl0RXh0ZW5kZXQiLCJkZWxFeHRlbmRldCIsIm9uQWpheFN1Y2Nlc3NEZWwiLCJjYW5jZWxFeHRlbmRldCIsIm9uQWpheFN1Y2Nlc3MiLCJhbGVydCIsImVkaXRUaXRsZSIsInRleHQiLCJwcm9tcHQiLCJhamF4IiwidXJsIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJlZGl0VmlzaWJsZSIsImVkaXRPcmQiLCJuZXdvcmQiLCJhamF4X3Zpc190b2dnbGUiLCJtb2RfaWQiLCJhY3QiLCJ0b2dnbGVDbGFzcyIsInNob3dfdG9vbHRpcHMiLCJteV91bmNoZWNrIiwiQ2hlY2tBbmRTdWJtaXQiLCJmbGFnIiwiZm9jdXMiLCJzdWJtaXQiLCJzZXRTb3J0IiwiY29va2llX25hbWUiLCJzZXRDb29raWUiLCJsb2NhdGlvbiIsImhyZWYiLCJmb3JtX3N1Ym1pdCIsInBhcmFtIiwib3BlbndpbiIsImltZyIsInciLCJoIiwiaHduZCIsImNsb3NlIiwid2luZG93Iiwib3BlbiIsIndyaXRlIiwib3Blbndpbl90ZXh0IiwibHRyaW0iLCJpc1doaXRlc3BhY2UiLCJzdWJzdHJpbmciLCJydHJpbSIsImoiLCJjaGFyVG9DaGVjayIsIndoaXRlc3BhY2VDaGFycyIsInRyYW5zbGl0ZXJhdGUiLCJzdHJpbmciLCJjaGFyX21hcCIsInRlc3QiLCJlbmNvZGVVUkkiLCJ1bmVzY2FwZSIsInNsaWNlIiwicmVkb3VibGUiLCJiaW5kaW5nIiwiJGlucHV0IiwiVVJMX1RSQU5TTEFURSIsInN1YnN0ciIsImFqYXhfdG9nZ2xlX2dyb3VwIiwidG9nZ2xlX21lbnUiLCJwYXJlbnQiLCJoaWRlRmllbGQiLCJFZGl0RG9jcyIsImN1cnJfdmFsdWUiLCJTYXZlRG9jcyIsImRvY3NpZCIsIkRlbERvY3MiLCJwYWdlX3VwZGF0ZSIsIml0ZW1faWQiLCJwb3N0X2lkIiwianNvbiIsImV2YWwiLCJwYXJzZU1zZyIsIm1zZyIsIm9kZCIsInN5c19uYW1lIiwic2l6ZSIsImFqYXhGaWxlRG9jc1VwbG9hZCIsImRv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SCxJQUFJLENBQVI7QUFDQXhDLE1BQUV1RCxJQUFGLENBQVF1TyxHQUFSLEVBQWEsVUFBU2pJLENBQVQsRUFBV0MsQ0FBWCxFQUFjO0FBQ3ZCLFlBQUt0SCxJQUFJLENBQUosSUFBUyxDQUFkLEVBQWtCdVAsTUFBTSxNQUFOLENBQWxCLEtBQ0tBLE1BQU0sRUFBTjtBQUNMcEksZUFBTyxzQkFBc0JvSSxHQUF0QixHQUE0QixhQUE1QixHQUE0Q2pJLEVBQUVrSSxRQUE5QyxHQUF5RCw2QkFBekQsR0FBeUZsSSxFQUFFdUMsS0FBM0YsR0FBbUcsYUFBMUc7QUFDQTFDLGVBQU8sZ0JBQWdCb0ksR0FBaEIsR0FBc0IsTUFBdEIsR0FBK0JqSSxFQUFFbUksSUFBakMsR0FBd0MsU0FBL0M7QUFDQXRJLGVBQU8sMkVBQTJFRyxFQUFFdEcsRUFBN0UsR0FBa0YsS0FBbEYsR0FBMEZnRixHQUExRixHQUFnRyxzSUFBdkc7QUFDQWhHO0FBQ0gsS0FQRDtBQVFBbUgsV0FBTyxVQUFQO0FBQ0EzSixNQUFFLE1BQUl3SSxHQUFKLEdBQVEsZUFBVixFQUEyQm1DLE1BQTNCLENBQWtDaEIsR0FBbEM7QUFDSDs7QUFFRCxTQUFTdUksa0JBQVQsQ0FBNEJDLGFBQTVCLEVBQTBDLENBRXpDOztBQUVELFNBQVNDLFNBQVQsQ0FBb0J6SSxHQUFwQixFQUEwQjtBQUN0QixRQUFJMEksTUFBSSxJQUFSO0FBQ0EsUUFBSXpOLFNBQU8rRSxJQUFJMUssT0FBSixDQUFZb1QsR0FBWixFQUFpQixRQUFqQixDQUFYOztBQUVBLFdBQU96TixNQUFQO0FBQ0giLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBkID0gZG9jdW1lbnQ7XG5cbnZhciBjc3MgPSBmdW5jdGlvbihlbGVtZW50LCBzdHlsZSkge1xuICAgIGZvciAodmFyIHByb3AgaW4gc3R5bGUpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHN0eWxlW3Byb3BdO1xuICAgIH1cbn1cblxudmFyIGFuaW1hdGUgPSBmdW5jdGlvbihvcHRzLCBjYWxsYmFjaykge1xuICAgIHZhciBzdGFydCA9IG5ldyBEYXRlO1xuICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSAobmV3IERhdGUgLSBzdGFydCkgLyBvcHRzLmR1cmF0aW9uO1xuICAgICAgICBpZiAocHJvZ3Jlc3MgPiAxKSBwcm9ncmVzcyA9IDE7XG4gICAgICAgIG9wdHMuc3RlcChwcm9ncmVzcyk7XG4gICAgICAgIGlmIChwcm9ncmVzcyA9PSAxKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIH1cbiAgICB9LCBvcHRzLmRlbGF5IHx8IDIwKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG52YXIgYWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtZW50LCBjbGFzc25hbWUpIHtcbiAgICB2YXIgY24gPSBlbGVtZW50LmNsYXNzTmFtZTtcbiAgICBpZihjbi5pbmRleE9mKGNsYXNzbmFtZSkgIT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihjbiAhPSAnJykge1xuICAgICAgICBjbGFzc25hbWUgPSAnICcrY2xhc3NuYW1lO1xuICAgIH1cbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNuK2NsYXNzbmFtZTtcbn1cblxudmFyIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NuYW1lKSB7XG4gICAgdmFyIGNuID0gZWxlbWVudC5jbGFzc05hbWU7XG4gICAgdmFyIHJ4cCA9IG5ldyBSZWdFeHAoXCJcXFxccz9cXFxcYlwiK2NsYXNzbmFtZStcIlxcXFxiXCIsIFwiZ1wiKTtcbiAgICBjbiA9IGNuLnJlcGxhY2UocnhwLCAnJyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbjtcbn1cblxuZnVuY3Rpb24gaXNfc3RyaW5nKCBtaXhlZF92YXIgKXtcbiAgICByZXR1cm4gKHR5cGVvZiggbWl4ZWRfdmFyICkgPT0gJ3N0cmluZycpO1xufVxuXG5cbmZ1bmN0aW9uIGlzX251bWVyaWMobikge1xuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG59XG5cbnZhciBtYXBDb250ZWluZXIgPSBmdW5jdGlvbiggdHlwZSwgbWFwaWQgKVxue1xuICAgIGlmICggdHlwZSA9PT0gJ2dvb2dsZScgKVxuICAgIHtcbiAgICAgICAgZ29vZ2xlTWFwcyggbWFwaWQgKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIHR5cGUgPT09ICd5YW5kZXgnIClcbiAgICB7XG4gICAgICAgIHlhbmRleE1hcHMoIG1hcGlkICk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0FsbChlbGVtZW50KVxue1xuICAgIHZhciBjaGVja2VkID0gJChlbGVtZW50KS5wcm9wKCdjaGVja2VkJyk7XG4gICAgJCgnLmNoZWNrLWFsbC1zcHknKS5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG59XG5cbmZ1bmN0aW9uIHlhbmRleE1hcHMoIG1hcGlkIClcbntcbiAgICB2YXIgbWFwID0ge1xuICAgICAgICBsaW5rOiBudWxsLFxuICAgICAgICBtYXBpZDogJ21hcC1jb250ZWluZXItJyArIG1hcGlkLFxuICAgICAgICBwbGFjZTogJ2tyYXNub2RhcicsXG4gICAgICAgIHR5cGU6ICd5YW5kZXgjbWFwJywgLy8gJ3lhbmRleCNtYXAnICd5YW5kZXgjc2F0ZWxsaXRlJyAneWFuZGV4I2h5YnJpZCcgJ3lhbmRleCNwdWJsaWNNYXAnICd5YW5kZXgjcHVibGljTWFwSHlicmlkJ1xuICAgICAgICBjaXR5OiB7XG4gICAgICAgICAgICAna3Jhc25vZGFyJzogWzQ1LjA5NDcxNzE2NTkzMDI5LCAzOS4wMTU4OTkwMDAwMDAwMV0sXG4gICAgICAgICAgICAnbW9zY293JzogWzU1Ljc2LCAzNy42NF0sXG4gICAgICAgIH0sXG4gICAgICAgIGdldEJhbG9vbjogZnVuY3Rpb24oIGNvb3JkIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyB5bWFwcy5QbGFjZW1hcmsoIGNvb3JkLCB7fSwge1xuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIC8vLFxuICAgICAgICAgICAgICAgIC8vaWNvbkltYWdlSHJlZjogJy9pbWFnZXMvbXlJY29uLmdpZicsXG4gICAgICAgICAgICAgICAgLy9pY29uSW1hZ2VTaXplOiBbMzAsIDQyXSxcbiAgICAgICAgICAgICAgICAvL2ljb25JbWFnZU9mZnNldDogWy0zLCAtNDJdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZHJhdzogZnVuY3Rpb24oIHltYXBzIClcbiAgICAgICAge1xuICAgICAgICAgICAgbWFwLmxpbmsgPSBuZXcgeW1hcHMuTWFwKHRoaXMubWFwaWQsIHtcbiAgICAgICAgICAgICAgICBjZW50ZXI6IG1hcC5jaXR5WyB0aGlzLnBsYWNlIF0sXG4gICAgICAgICAgICAgICAgem9vbTogMTIsXG4gICAgICAgICAgICAgICAgdHlwZTogbWFwLnR5cGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYXAubGluay5jb250cm9sc1xuICAgICAgICAgICAgICAgIC5hZGQoJ3NtYWxsWm9vbUNvbnRyb2wnLCB7IHJpZ2h0OiAxMCwgdG9wOiAxNSB9KVxuICAgICAgICAgICAgICAgIC5hZGQobmV3IHltYXBzLmNvbnRyb2wuU2NhbGVMaW5lKCkpXG4gICAgICAgICAgICAgICAgLmFkZCgnc2VhcmNoQ29udHJvbCcsIHsgbGVmdDogMjAsIHRvcDogMjAgfSk7XG5cbiAgICAgICAgICAgIHZhciBkcmFnQmFsbG9vbiA9IHRoaXMuZ2V0QmFsb29uKCBtYXAuY2l0eVsgdGhpcy5wbGFjZSBdICk7XG5cbiAgICAgICAgICAgIG1hcC5saW5rLmV2ZW50cy5hZGQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBtYXAubGluay5nZW9PYmplY3RzLnJlbW92ZSggZHJhZ0JhbGxvb24gKTtcblxuICAgICAgICAgICAgICAgIGRyYWdCYWxsb29uID0gbWFwLmdldEJhbG9vbiggZS5nZXQoJ2Nvb3JkUG9zaXRpb24nKSApO1xuICAgICAgICAgICAgICAgIG1hcC5saW5rLmdlb09iamVjdHMuYWRkKCBkcmFnQmFsbG9vbiApO1xuXG4gICAgICAgICAgICAgICAgbWFwLnNldENvb3JkKCBlLmdldCgnY29vcmRQb3NpdGlvbicpICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFwLmxpbmsuZ2VvT2JqZWN0cy5hZGQoIGRyYWdCYWxsb29uICkuZXZlbnRzLmFkZCgnZHJhZ2VuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gZS5nZXQoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgIHZhciBjb29yZHMgPSBvYmplY3QuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKTtcbiAgICAgICAgICAgICAgICBvYmplY3QucHJvcGVydGllcy5zZXQoJ2JhbGxvb25Db250ZW50JywgY29vcmRzKTtcblxuICAgICAgICAgICAgICAgIG1hcC5zZXRDb29yZCggY29vcmRzICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuICAgICAgICAgICAgICAgIG1hcC5saW5rLmdlb09iamVjdHMuYWRkKFxuICAgICAgICAgICAgICAgICAgICBuZXcgeW1hcHMuR2VvT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2ludFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBhcmd1bWVudHNbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBuZXcgeW1hcHMuR2VvT2JqZWN0Q29sbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpPGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmFkZChuZXcgeW1hcHMuUGxhY2VtYXJrKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXAubGluay5nZW9PYmplY3RzLmFkZChjb2xsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB5bWFwcy5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICBtYXAuZHJhdyggeW1hcHMgKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ29vZ2xlTWFwcyggbWFwaWQgKVxue1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGQuZ2V0RWxlbWVudEJ5SWQoICdtYXAtY29udGVpbmVyLScgKyBtYXBpZCApLCB7XG4gICAgICAgIHpvb206IDE0LFxuICAgICAgICB6b29tQ29udHJvbDogITEsXG4gICAgICAgIHBhbkNvbnRyb2w6ICExLFxuICAgICAgICBzY3JvbGx3aGVlbDogITEsXG4gICAgICAgIG5hdmlnYXRpb25Db250cm9sOiAhMSxcbiAgICAgICAgbWFwVHlwZUNvbnRyb2w6ICExLFxuICAgICAgICBzY2FsZUNvbnRyb2w6ICExLFxuICAgICAgICBkcmFnZ2FibGU6ICEwLFxuICAgICAgICBkaXNhYmxlRG91YmxlQ2xpY2tab29tOiAhMCxcbiAgICAgICAgY2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQ1LjA1MzU0OCwzOS4wMTYwNTYpXG4gICAgfSk7XG59XG5cbnZhciBkYXRlcGlja2VyID0gZnVuY3Rpb24oKVxue1xuICAgIGNvbnN0ICRjYWxlbmRhciA9ICQoJy5jYWxlbmRhcicpO1xuXG4gICAgJGNhbGVuZGFyLmVhY2goKGlkLCBpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0ICRjbG9zZXN0ID0gJChpdGVtKS5jbG9zZXN0KCcuY2FsZW5kYXInKTtcbiAgICAgICAgY29uc3QgJGVsZW1lbnQgPSAkY2xvc2VzdC5maW5kKCcuY2FsZW5kYXItaW5wdXQnKTtcbiAgICAgICAgY29uc3QgZGlzYWJsZWQgPSAkZWxlbWVudC5pcygnOmRpc2FibGVkJyk7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9ICRlbGVtZW50LmRhdGEoJ3RpbWVzdGFtcCcpIHx8IGZhbHNlO1xuICAgICAgICBsZXQgZF9mb3JtYXQgPSAodGltZXN0YW1wICE9PSBmYWxzZSkgPyAnREQuTU0uWVlZWScgOiAkZWxlbWVudC5kYXRhKCdmb3JtYXQnKSB8fCAnREQuTU0uWVlZWSc7XG5cbiAgICAgICAgZF9mb3JtYXQgPSBkX2Zvcm1hdC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICRlbGVtZW50LnByb3AoJ2RhdGUnLCAnJyk7XG4gICAgICAgICAgICAkZWxlbWVudC5kYXRhKCdmb3JtYXQnLCBkX2Zvcm1hdCk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRjYWxlbmRhckl0ZW0gPSAkZWxlbWVudC5kYXRlcGlja2VyKHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IGRfZm9ybWF0LFxuICAgICAgICAgICAgICAgIC8vIHRvZGF5QnRuOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF1dG9jbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICRjbG9zZXN0LFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiBBRE1JTl9MT0NBTEVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkY2FsZW5kYXJJdGVtLm9uKCdjaGFuZ2VEYXRlJywgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICQodGhpcykuZGF0YSgnZGF0ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRpbWVzdGFtcCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gKG5ldyBEYXRlKHJlc3VsdCkpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQudmFsKFxuICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXJJdGVtLmRhdGVwaWNrZXIoJ2dldEZvcm1hdHRlZERhdGUnKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCRjbG9zZXN0LmZpbmQoJy5pbnB1dC1ncm91cC1hZGRvbicpKSB7XG4gICAgICAgICAgICAgICAgJGNsb3Nlc3QuZmluZCgnLmlucHV0LWdyb3VwLWFkZG9uJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXJJdGVtLmRhdGVwaWNrZXIoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2VsZWN0aXplKHNlbGVjdG9yKVxue1xuICAgIHZhciAkc2VsZWN0b3IgPSBudWxsO1xuXG4gICAgc2VsZWN0b3IgPSBzZWxlY3RvciB8fCAnc2VsZWN0JztcblxuICAgIGlmIChpc19zdHJpbmcoc2VsZWN0b3IpKVxuICAgIHtcbiAgICAgICAgJHNlbGVjdG9yID0gJChzZWxlY3Rvcik7XG4gICAgfVxuICAgIGVsc2UgaWYoaXNfb2JqZWN0KHNlbGVjdG9yKSlcbiAgICB7XG4gICAgICAgICRzZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgYWxsb3dfc2luZ2xlX2Rlc2VsZWN0OiB0cnVlLFxuICAgICAgICBub19yZXN1bHRzX3RleHQ6ICfQndC1INC90LDQudC00LXQvdC+IScsXG4gICAgICAgIGRpc2FibGVfc2VhcmNoX3RocmVzaG9sZDogMTBcbiAgICB9O1xuXG4gICAgJHNlbGVjdG9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0ICRzZWxlY3QgPSAkKHRoaXMpO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9ICRzZWxlY3QuYXR0cigncGxhY2Vob2xkZXInKTtcblxuICAgICAgICBpZiAocGxhY2Vob2xkZXIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTXVsdGlwbGUgPSAkc2VsZWN0LnByb3AoJ211bHRpcGxlJyk7XG5cbiAgICAgICAgICAgIGlmIChpc011bHRpcGxlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2Vob2xkZXJfdGV4dF9tdWx0aXBsZSA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2Vob2xkZXJfdGV4dF9zaW5nbGUgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzZWxlY3QuY2hvc2VuKG9wdGlvbnMpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VSb3coZWxlbWVudClcbntcbiAgICB2YXIgY2hlY2tlZCA9ICQoZWxlbWVudCkucHJvcCgnY2hlY2tlZCcpO1xuXG4gICAgaWYoY2hlY2tlZClcbiAgICB7XG4gICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgndHInKS5maW5kKCd0ZCcpLmFkZENsYXNzKCdjaCcpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJ3RyJykuZmluZCgndGQnKS5yZW1vdmVDbGFzcygnY2gnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZV9zbWFsbF9waG90byhpZClcbntcbiAgICAkKFwiI1wiK2lkKS50b2dnbGUoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU2VjdGlvbihlbGVtZW50LCBlLCBpZCwgX3NlbGZfKVxue1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoY29uZmlybSgn0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Yw/JykpXG4gICAge1xuICAgICAgICBpZCA9IHBhcnNlSW50KGlkKTtcblxuICAgICAgICB2YXIgeCwgc2VjdGlvbiA9IFtdLCB0bXAgPSAkKGVsZW1lbnQpLnZhbCgpLnNwbGl0KCcsJyk7XG4gICAgICAgIGZvcih4IGluIHRtcClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRtcFt4XSAhPT0gJycgJiYgcGFyc2VJbnQodG1wW3hdKSAhPT0gaWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VjdGlvbi5wdXNoKHBhcnNlSW50KHRtcFt4XSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJChfc2VsZl8pLnJlbW92ZSgpO1xuICAgICAgICAkKGVsZW1lbnQpLnZhbCggKHNlY3Rpb24ubGVuZ3RoID4gMSA/IHNlY3Rpb24uam9pbignLCcpIDogc2VjdGlvbikgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzbGlkZXIoaWQsIHR5cGUsIHZhbHVlLCBtaW4sIG1heCwgb3JpZW50YXRpb24pXG57XG4gICAgY29uc3QgZWxlbWVudCA9ICcjJyArIGlkO1xuICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgIG9yaWVudGF0aW9uID0gIW9yaWVudGF0aW9uID8gJ2hvcml6b250YWwnIDogb3JpZW50YXRpb247XG5cbiAgICBtaW4gPSBtaW4gfHwgMDtcbiAgICBtYXggPSBtYXggfHwgMTAwO1xuXG4gICAgdmFyIHZhbHVlcyA9IHZhbHVlLCBjb25uZWN0ID0gJ2xvd2VyJywgYmVoYXZpb3VyID0gJ3RhcC1kcmFnJztcblxuICAgIGlmICh0eXBlID09ICdyYW5nZScpXG4gICAge1xuICAgICAgICBiZWhhdmlvdXIgPSAndGFwLWRyYWcnO1xuICAgICAgICBjb25uZWN0ID0gdHJ1ZTtcbiAgICAgICAgdmFsdWVzID0gWyB2YWx1ZVswXSAsIHZhbHVlWzFdIF07XG4gICAgfVxuXG4gICAgbm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyLCB7XG4gICAgICAgIHN0ZXA6IDEsXG4gICAgICAgIGFuaW1hdGU6IGZhbHNlLFxuICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb24sXG4gICAgICAgIHN0YXJ0OiB2YWx1ZXMsXG4gICAgICAgIGNvbm5lY3Q6IGNvbm5lY3QsXG4gICAgICAgIGJlaGF2aW91cjogYmVoYXZpb3VyLFxuICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgJ21pbic6IG1pbixcbiAgICAgICAgICAgICdtYXgnOiBtYXhcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0OiB3TnVtYih7XG4gICAgICAgICAgICBkZWNpbWFsczogMFxuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgY29uc3QgaGFuZGxlcyA9IHtcbiAgICAgICAgJ3JhbmdlJzoge1xuICAgICAgICAgICAgMDogJ21pbicsXG4gICAgICAgICAgICAxOiAnbWF4J1xuICAgICAgICB9LFxuICAgICAgICAnc2xpZGVyJzoge1xuICAgICAgICAgICAgMDogJ3ZhbHVlJ1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSl7XG4gICAgICAgICQoYCR7ZWxlbWVudH0tJHtoYW5kbGVzW3R5cGVdW2hhbmRsZV19YCkudmFsKHZhbHVlc1toYW5kbGVdKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbWV0YUNvdW50ZXIoKVxue1xuICAgICQoJy5jb3VudC1udW1iZXInKS5vbigna2V5dXAnLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgJGJsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcuY291bnQtbnVtYmVyLWJsb2NrJyksXG4gICAgICAgICAgICAkY291bnRlciA9ICRibG9jay5maW5kKCcuY291bnQtbnVtYmVyLWJsb2NrLWNvdW50JyksXG4gICAgICAgICAgICByZWNvbWVuZCA9IHBhcnNlSW50KCRjb3VudGVyLmRhdGEoJ3JlY29tZW5kJykpIHx8ICcnO1xuXG4gICAgICAgICRjb3VudGVyLmh0bWwoJCh0aGlzKS52YWwoKS5sZW5ndGggKyAocmVjb21lbmQgIT09ICcnID8gJy8nICsgcmVjb21lbmQgOiAnJykpO1xuXG4gICAgICAgIGlmIChyZWNvbWVuZCAhPT0gJycgJiYgJCh0aGlzKS52YWwoKS5sZW5ndGggPiByZWNvbWVuZClcbiAgICAgICAge1xuICAgICAgICAgICAkY291bnRlci5hZGRDbGFzcygndW5saW0nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgkY291bnRlci5oYXNDbGFzcygndW5saW0nKSlcbiAgICAgICAge1xuICAgICAgICAgICAgJGNvdW50ZXIucmVtb3ZlQ2xhc3MoJ3VubGltJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2VvQ3Jvd2woKVxue1xuICAgICQoXCJpbnB1dFtuYW1lPSdjaGFuZ2VmcmVxJ11cIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKSA9PSAnZml4ZWQnKVxuICAgICAgICB7XG4gICAgICAgICAgICAkKCcjY2hhbmdlZnJlcV9maXhlZCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgICQoJyNjaGFuZ2VmcmVxX2ZpeGVkJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiaW5wdXRbbmFtZT0ncHJpb3JpdHknXVwiKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJC50cmltKCQodGhpcykudmFsKCkpID09ICdmaXhlZCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgICQoJyNwcmlvcml0eV9maXhlZCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgICQoJyNwcmlvcml0eV9maXhlZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVfaXRlbShlLCBlbGVtZW50LCBpZCwgZWxjbGFzcylcbntcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJChcIiNcIitpZCkudG9nZ2xlKCk7XG4gICAgdmFyICRpY29uID0gJChlbGVtZW50KS5maW5kKCcuem1kaScpO1xuXG4gICAgaWYgKCRpY29uLmhhc0NsYXNzKGVsY2xhc3NbMF0pKVxuICAgIHtcbiAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3MoZWxjbGFzc1swXSk7XG4gICAgICAgICRpY29uLmFkZENsYXNzKGVsY2xhc3NbMV0pO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcyhlbGNsYXNzWzFdKTtcbiAgICAgICAgJGljb24uYWRkQ2xhc3MoZWxjbGFzc1swXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hfdHlwZV9maWVsZHMob2JqKVxue1xuICAgIGlmICggb2JqLmNoZWNrZWQgPT09IHRydWUgKVxuICAgIHtcbiAgICAgICAgJChcIiNjYXNlMlwiKS5oaWRlKCk7XG4gICAgICAgICQoXCIjY2FzZTIgaW5wdXRcIikuYXR0cih7XCJkaXNhYmxlZFwiOiB0cnVlfSk7XG4gICAgICAgICQoXCIjY2FzZTFcIikuc2hvdygpO1xuICAgICAgICAkKFwiI2Nhc2UxIGlucHV0XCIpLmF0dHIoe1wiZGlzYWJsZWRcIjogZmFsc2V9KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgJChcIiNjYXNlMVwiKS5oaWRlKCk7XG4gICAgICAgICQoXCIjY2FzZTEgaW5wdXRcIikuYXR0cih7XCJkaXNhYmxlZFwiOiB0cnVlfSk7XG4gICAgICAgICQoXCIjY2FzZTJcIikuc2hvdygpO1xuICAgICAgICAkKFwiI2Nhc2UyIGlucHV0XCIpLmF0dHIoe1wiZGlzYWJsZWRcIjogZmFsc2V9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNob3dfdHIob2JqKVxue1xuICAgIHZhciB2YWwgPSAkKG9iaikudmFsKCk7XG5cbiAgICBpZiAodmFsID09IDEwIHx8IHZhbCA9PSAxMSB8fCB2YWwgPT0gMTIpXG4gICAgICAgICQoXCIjdG9fbGlzdFwiKS5zaG93KCk7XG4gICAgZWxzZVxuICAgICAgICAkKFwiI3RvX2xpc3RcIikuaGlkZSgpO1xufVxuXG5mdW5jdGlvbiB0cmFuc2xhdGVfa2V5KCBlbGVtZW50IClcbntcbiAgICAkKGVsZW1lbnQpLnZhbChnZW5lcmF0ZVBhc3N3b3JkKHJhbmRvbSgxNCwgMjQpLCBmYWxzZSwgL1xcdy8pKTtcblxuICAgIC8vICQoZWxlbWVudCkudmFsKFBhc3NHZW5KUy5nZXRQYXNzd29yZCh7XG4gICAgLy8gICAgIHN5bWJvbHM6IDAsXG4gICAgLy8gICAgIGxldHRlcnM6IHJhbmRvbSgxNCwgMjQpLFxuICAgIC8vICAgICBudW1iZXJzOiAwLFxuICAgIC8vICAgICBsZXR0ZXJzVXBwZXI6IDBcbiAgICAvLyB9KSk7XG59XG5cbmZ1bmN0aW9uIHNlY3JldCggZWxlbWVudCwgbGVuZ3RoIClcbntcbiAgICAkKGVsZW1lbnQpLnZhbChnZW5lcmF0ZVBhc3N3b3JkKDEyLCBmYWxzZSkpO1xuXG4gICAgLy8gJChlbGVtZW50KS52YWwoUGFzc0dlbkpTLmdldFBhc3N3b3JkKHtcbiAgICAvLyAgICAgc3ltYm9sczogMCxcbiAgICAvLyAgICAgbGV0dGVyczogcmFuZG9tKDIsIDQpLFxuICAgIC8vICAgICBudW1iZXJzOiByYW5kb20oMiwgNCksXG4gICAgLy8gICAgIGxldHRlcnNVcHBlcjogcmFuZG9tKDMsIDcpXG4gICAgLy8gfSkpO1xufVxuXG5mdW5jdGlvbiByYW5kb20obWluLCBtYXgpXG57XG4gICAgbWluID0gbWluIHx8IDA7XG4gICAgbWF4ID0gbWF4IHx8IDEwMDtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCBtYXggLSBtaW4gKyAxICkpICsgbWluO1xufVxuXG5cbmZ1bmN0aW9uIHRva2VuKCBsZW5ndGggKVxue1xuICAgIGxlbmd0aCA9IGxlbmd0aCB8fCA4O1xuXG4gICAgdmFyIHNlY3JldCA9ICcnLCBjaGFycyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OSc7XG5cbiAgICBmb3IoIGk9MTsgaTxsZW5ndGg7IGkrKyApXG4gICAge1xuICAgICAgICB2YXIgYyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpjaGFycy5sZW5ndGggKyAxKTtcbiAgICAgICAgc2VjcmV0ICs9IGNoYXJzLmNoYXJBdChjKVxuICAgIH1cblxuICAgIHJldHVybiBzZWNyZXQ7XG59XG5cbmZ1bmN0aW9uIGRlbF9saXN0X2ZpZWxkcyhpZClcbntcbiAgICBpZiAoY3AuZGlhbG9nKFwi0JLRiyDQtNC10LnRgdCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINC/0L7Qu9C1P1wiKSl7XG4gICAgICAgJChcIiN0clwiK2lkKS5yZW1vdmUoKTtcbiAgICAgICAvKlxuICAgICAgICQucG9zdCggXCIvXCIgKyBBRE1JTl9ESVIgKyBcIi9hamF4L2xpc3RzL1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoXCIjdHJcIitpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9ICxcbiAgICAgICAgICAgIFwianNvblwiXG4gICAgICAgIClcbiAgICAgICAgKi9cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBhZGRfbGlzdF9maWVsZHMoKVxue1xuICAgIGZpZWxkX2NvdW50ZXIrKztcbiAgICBzdHIgPSAnPHRyIGlkPVwidHInICsgZmllbGRfY291bnRlciArICdcIj4nO1xuICAgIHN0ciArPSAnPHRkPjxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImZpZWxkX2lkWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiB2YWx1ZT1cIjBcIiBcXC8+JztcbiAgICBzdHIgKz0gJzxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmaWVsZF9uYW1lWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiBjbGFzcz1cImJvcmQgcGFkZCBuZXNzXCIgXFwvPjxcXC90ZD4nO1xuICAgIHN0ciArPSAnPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmaWVsZF9zeXNfbmFtZVsnICsgZmllbGRfY291bnRlciArICddXCIgY2xhc3M9XCJib3JkIHBhZGQgbmVzc1wiIFxcLz48XFwvdGQ+JztcbiAgICBzdHIgKz0gJzx0ZD48c2VsZWN0IG5hbWU9XCJmaWVsZF90eXBlWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiBjbGFzcz1cImZpZWxkX3R5cGUgbmVzc1wiIGlkPVwiJyArIGZpZWxkX2NvdW50ZXIgKyAnXCIgb25jaGFuZ2U9XCJzZWxlY3RfdHlwZSh0aGlzKTtcIj4nO1xuICAgICQuZWFjaChhcnJfZmllbGRfdHlwZSxmdW5jdGlvbihrLHYpe1xuICAgICAgICBpZiAoayoxKSBzdHIgKz0gJzxvcHRpb24gdmFsdWU9XCInICsgayArICdcIj4nICsgdiArICc8XFwvb3B0aW9uPidcbiAgICB9KTtcbiAgICBzdHIgKz0gJzxcXC9zZWxlY3Q+PFxcL3RkPic7XG4gICAgc3RyICs9ICc8dGQgY2xhc3M9XCJhZGRpdGlvblwiPjxcXC90ZD4nO1xuICAgIHN0ciArPSAnPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJmX29yZFsnICsgZmllbGRfY291bnRlciArICddXCIgdmFsdWU9XCInICsgZmllbGRfY291bnRlciArICcwXCIgY2xhc3M9XCJib3JkIHBhZGQgdzYwcHggclwiIFxcLz48XFwvdGQ+JztcbiAgICBzdHIgKz0gJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJpbl9saXN0WycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiBcXC8+PFxcL3RkPic7XG4gICAgc3RyICs9ICc8dGQgY2xhc3M9XCJhY3Rpb25zIGNcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiY3RyX2EgY3RyX2RlbCBtYXJnaW5cIiB0aXRsZT1cItCj0LTQsNC70LjRgtGMXCIgb25jbGljaz1cImRlbF9saXN0X2ZpZWxkcygnICsgZmllbGRfY291bnRlciArICcpO3JldHVybiBmYWxzZTtcIj48XFwvYT48XFwvdGQ+JztcbiAgICBzdHIgKz0gJzxcXC90cj4nO1xuXG4gICAgJChcIiNhZGRfYnRuXCIpLmJlZm9yZShzdHIpO1xufVxuXG5mdW5jdGlvbiBhZGRfbGlzdF9maWVsZHNfbGlzdCgpXG57XG4gICAgZmllbGRfY291bnRlcisrO1xuXG4gICAgdmFyIHN0ciA9IFtcbiAgICAgICAgJzx0ciBpZD1cInRyJyArIGZpZWxkX2NvdW50ZXIgKyAnXCI+JyxcbiAgICAgICAgJzx0ZD4nLFxuICAgICAgICAnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZmllbGRfaWRbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIHZhbHVlPVwiMFwiPicsXG4gICAgICAgICc8aW5wdXQgbmFtZT1cInZhclsnICsgZmllbGRfY291bnRlciArICddXCIgcGxhY2Vob2xkZXI9XCLQndCw0L/RgNC40LzQtdGAOiDQmtGA0LDRgdC90L7QtNCw0YDRgdC60LjQuSDQutGA0LDQuVwiPicsXG4gICAgICAgICc8L3RkPicsXG4gICAgICAgICc8dGQ+PGlucHV0IG5hbWU9XCJ2YWx1ZVsnICsgZmllbGRfY291bnRlciArICddXCIgcGxhY2Vob2xkZXI9XCLQndCw0L/RgNC40LzQtdGAOiAyM1wiPjwvdGQ+JyxcbiAgICAgICAgJzx0ZD48bGFiZWwgY2xhc3M9XCJjb250cm9sbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNvbnRyb2xsX19pbnB1dFwiIHZhbHVlPVwiJyArIGZpZWxkX2NvdW50ZXIgKyAnXCIgbmFtZT1cImRlZmF1bHRbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiPjxzcGFuIGNsYXNzPVwiY29udHJvbGxfX3Zpc2libGUgY29udHJvbGxfX3Zpc2libGVfY2hlY2tib3hcIj48L3NwYW4+PC9sYWJlbD48L3RkPicsXG4gICAgICAgICc8dGQ+PGlucHV0IG5hbWU9XCJvcmRbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIHZhbHVlPVwiJyArIGZpZWxkX2NvdW50ZXIgKyAnMFwiIGNsYXNzPVwib3JkIGludGVnZXIgcmVkdWNpbmctdHJpZ2dlclwiPjwvdGQ+JyxcbiAgICAgICAgJzx0ZCBjbGFzcz1cInRhY1wiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJpY29uIGljb24tZGVsZXRlIHJlbW92ZS10cmlnZ2VyXCIgdGl0bGU9XCLQo9C00LDQu9C40YLRjFwiIG9uY2xpY2s9XCJkZWxfbGlzdF9maWVsZHMoJyArIGZpZWxkX2NvdW50ZXIgKyAnKTtyZXR1cm4gZmFsc2U7XCI+PC9hPjwvdGQ+JyxcbiAgICAgICAgJzwvdHI+J1xuICAgIF0uam9pbiggJycgKTtcblxuICAgICQoXCIjYWRkX2J0blwiKS5iZWZvcmUoc3RyKTtcbn1cblxuZnVuY3Rpb24gZGVsX2ZpZWxkcyhudW1iKVxue1xuICAgIGZpZWxkX2NvdW50ZXItLTtcbiAgICAkKFwiI3RyXCIrbnVtYikucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIGFkZF9maWVsZHMoKVxue1xuICAgIGZpZWxkX2NvdW50ZXIrKztcbiAgICB2YXIgc2VsZWN0ID0gJycsIGsgPSAnJztcblxuICAgIGZvciAoIGsgaW4gYXJyX2ZpZWxkX3R5cGUgKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcnJfZmllbGRfdHlwZVtrXSA9PSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZWN0ICs9ICc8b3B0aW9uIHZhbHVlPVwiJyArIGsgKyAnXCI+JyArIGFycl9maWVsZF90eXBlW2tdICsgJzwvb3B0aW9uPic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RyID0gW1xuICAgICAgICAnPHRyIGlkPVwidHInICsgZmllbGRfY291bnRlciArICdcIj4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidmFfdFwiPjxpbnB1dCBuYW1lPVwiZl9uYW1lWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiBjbGFzcz1cIm5lc3NcIj48L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJ2YV90XCI+PGlucHV0IG5hbWU9XCJmX3N5c19uYW1lWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiBjbGFzcz1cIm5lc3NcIj48L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJ2YV90XCI+PHNlbGVjdCBuYW1lPVwiZl90eXBlWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiBjbGFzcz1cImZfdHlwZSBuZXNzXCIgZGF0YS1wbGFjZWhvbGRlcj1cItCi0LjQvyDQv9C+0LvRj1wiIGlkPVwiZmllbGR0eXBlXycgKyBmaWVsZF9jb3VudGVyICsgJ1wiIG9uY2hhbmdlPVwic2VsZWN0X3R5cGUodGhpcylcIj4nLFxuICAgICAgICBzZWxlY3QsXG4gICAgICAgICc8L3NlbGVjdD48L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJhZGRpdGlvbiB2YV90XCI+JyArIGdldF9hZGRpdGlvbignaW5wdXQnLCBmaWVsZF9jb3VudGVyKSArICc8L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJ2YV90XCI+PGlucHV0IG5hbWU9XCJmX29yZFsnICsgZmllbGRfY291bnRlciArICddXCIgdmFsdWU9XCInICsgZmllbGRfY291bnRlciArICcwXCI+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidmFfbSB0YWNcIj48bGFiZWwgY2xhc3M9XCJjb250cm9sbCBjb250cm9sbF9zaW5nbGVcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjb250cm9sbF9faW5wdXRcIiB2YWx1ZT1cIjFcIiBuYW1lPVwiZl9pbl9saXN0WycgKyBmaWVsZF9jb3VudGVyICsgJ11cIj48c3BhbiBjbGFzcz1cImNvbnRyb2xsX192aXNpYmxlIGNvbnRyb2xsX192aXNpYmxlX2NoZWNrYm94XCI+PC9zcGFuPjwvbGFiZWw+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidmFfbSB0YWNcIj48bGFiZWwgY2xhc3M9XCJjb250cm9sbCBjb250cm9sbF9zaW5nbGVcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjb250cm9sbF9faW5wdXRcIiB2YWx1ZT1cIjFcIiBuYW1lPVwiZl9pbmRleFsnICsgZmllbGRfY291bnRlciArICddXCI+PHNwYW4gY2xhc3M9XCJjb250cm9sbF9fdmlzaWJsZSBjb250cm9sbF9fdmlzaWJsZV9jaGVja2JveFwiPjwvc3Bhbj48L2xhYmVsPjwvdGQ+JyxcbiAgICAgICAgJzx0ZCBjbGFzcz1cInZhX20gdGFjXCI+PGxhYmVsIGNsYXNzPVwiY29udHJvbGwgY29udHJvbGxfc2luZ2xlXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY29udHJvbGxfX2lucHV0XCIgdmFsdWU9XCIxXCIgbmFtZT1cImZfdW5pcXVlWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIj48c3BhbiBjbGFzcz1cImNvbnRyb2xsX192aXNpYmxlIGNvbnRyb2xsX192aXNpYmxlX2NoZWNrYm94XCI+PC9zcGFuPjwvbGFiZWw+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidGFjXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImljb24gaWNvbi1kZWxldGUgcmVtb3ZlLXRyaWdnZXJcIiB0aXRsZT1cItCj0LTQsNC70LjRgtGMXCIgb25jbGljaz1cImRlbF9maWVsZHMoJyArIGZpZWxkX2NvdW50ZXIgKyAnKTtyZXR1cm4gZmFsc2U7XCI+PC9hPjwvdGQ+JyxcbiAgICAgICAgJzwvdHI+J1xuICAgIF0uam9pbignJyk7XG5cbiAgICAkKFwiI2FkZF9idG5cIikuYmVmb3JlKHN0cik7XG5cbiAgICBzZWxlY3RpemUoICcjZmllbGR0eXBlXycgKyBmaWVsZF9jb3VudGVyICk7XG59XG5cbmZ1bmN0aW9uIGFkZF9maWVsZHNfbGlzdCgpXG57XG4gICAgZmllbGRfY291bnRlcisrO1xuXG4gICAgc3RyID0gW1xuICAgICAgICAnPHRyIGlkPVwidHInICsgZmllbGRfY291bnRlciArICdcIj4nLFxuICAgICAgICAnPHRkPjxpbnB1dCBuYW1lPVwidmFyWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIj48L3RkPicsXG4gICAgICAgICc8dGQ+PGlucHV0IG5hbWU9XCJ2YWx1ZVsnICsgZmllbGRfY291bnRlciArICddXCI+PC90ZD4nLFxuICAgICAgICAnPHRkPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiZGVmYXVsdFsnICsgZmllbGRfY291bnRlciArICddXCI+PC90ZD4nLFxuICAgICAgICAnPHRkPjxpbnB1dCBuYW1lPVwib3JkWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiB2YWx1ZT1cIicgKyBmaWVsZF9jb3VudGVyICsgJzBcIj48L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJ0YWNcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiaWNvbiBpY29uLWRlbGV0ZSByZW1vdmUtdHJpZ2dlclwiIHRpdGxlPVwi0KPQtNCw0LvQuNGC0YxcIiBvbmNsaWNrPVwiZGVsX2ZpZWxkcygnICsgZmllbGRfY291bnRlciArICcpO3JldHVybiBmYWxzZTtcIj48L2E+PC90ZD4nLFxuICAgICAgICAnPC90cj4nXG4gICAgXS5qb2luKCdcXG4nKTtcblxuICAgICQoXCIjYWRkX2J0blwiKS5iZWZvcmUoc3RyKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0X3R5cGUoIG9iaiApXG57XG4gICAgdmFyIHJvd19udW1kID0gMSAqICggJChvYmopLmF0dHIoXCJpZFwiKS5zcGxpdCgnXycpWzFdICksXG4gICAgICAgIGFwcGVuZF9vYmogPSAkKFwiI3RyXCIrcm93X251bWQrXCIgLmFkZGl0aW9uXCIpLFxuICAgICAgICBzdHIgPSBnZXRfYWRkaXRpb24oIG9iai52YWx1ZS5zcGxpdCgnOicpWzBdLCByb3dfbnVtZCApO1xuXG4gICAgJCggYXBwZW5kX29iaiApLmVtcHR5KCkuYXBwZW5kKCBzdHIgfHwgJycgKTtcblxuICAgIHNlbGVjdGl6ZSgpO1xufVxuXG5mdW5jdGlvbiBnZXRfYWRkaXRpb24oIHR5cGUsIGluZGV4IClcbntcbiAgICB2YXIgdG1wID0gW10sIHN0ciA9IFtdO1xuXG4gICAgaWYgKCBbICdpbnB1dCcsICdjb3N0JywgJ2ludCcsICdoaWRkZW4nLCAnZG9jdW1lbnQnLCAndGltZXN0YW1wJywgJ2VtYWlsJywgJ2xpc3QnLCAnYXV0b2NvbXBsZXRlJywgJ3NlbGVjdCcsICd0cmVlc2VsZWN0JywgJ2Zsb2F0JywgJ3N5c3RlbScsICdtdWx0aXNlbGVjdCcsICdkYXRldGltZScgXS5pbmRleE9mKCB0eXBlICkgPj0gMCApXG4gICAge1xuICAgICAgICBzdHIgPSBbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImdyb3VwXCI+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiZ3JvdXBfX2l0ZW1cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCJncm91cF9faXRlbV9fcmJcIiBuYW1lPVwiZl93aWR0aFsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiMjVcIj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX19zdHlsZVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX190ZXh0XCI+MjUlPC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiZ3JvdXBfX2l0ZW1cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCJncm91cF9faXRlbV9fcmJcIiBuYW1lPVwiZl93aWR0aFsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiNTBcIj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX19zdHlsZVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX190ZXh0XCI+NTAlPC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiZ3JvdXBfX2l0ZW1cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCJncm91cF9faXRlbV9fcmJcIiBuYW1lPVwiZl93aWR0aFsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiNzVcIj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX19zdHlsZVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX190ZXh0XCI+NzUlPC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiZ3JvdXBfX2l0ZW1cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCJncm91cF9faXRlbV9fcmJcIiBuYW1lPVwiZl93aWR0aFsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiMTAwXCIgY2hlY2tlZD48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX19zdHlsZVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX190ZXh0XCI+MTAwJTwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICBdO1xuXG4gICAgICAgIGlmICggWyAnbGlzdCcsICdhdXRvY29tcGxldGUnLCAnc2VsZWN0JywgJ3RyZWVzZWxlY3QnLCAncmFkaW8nLCAnbXVsdGlzZWxlY3QnLCAnY2hlY2tib3gnLCAnc3lzdGVtJyBdLmluZGV4T2YoIHR5cGUgKSA+PSAwIClcbiAgICAgICAge1xuICAgICAgICAgICBzdHIucHVzaCggJzxkaXYgY2xhc3M9XCJjYiBtYjEwXCI+PC9kaXY+JyApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlID09ICdoaWRkZW4nIClcbiAgICB7XG4gICAgICAgIHN0ci5wdXNoKCAnPGlucHV0IHZhbHVlPVwiXCIgbmFtZT1cImZfaGlkZGVuX2RlZmF1bHRbJyArIGluZGV4ICsgJ11cIiBwbGFjZWhvbGRlcj1cItCX0L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cIj4nICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlID09ICdzeXN0ZW0nIClcbiAgICB7XG4gICAgICAgIHN0ci5wdXNoKCAnPGlucHV0IHZhbHVlPVwiXCIgbmFtZT1cImZfYmluZGluZ1snICsgaW5kZXggKyAnXVwiIHBsYWNlaG9sZGVyPVwi0J3QsNC/0YDQuNC80LXRgCDQv9C+0LvQtSAodGl0bGUpXCI+JyApO1xuICAgIH1cblxuICAgIGlmICggdHlwZSA9PSAnZGF0ZScgKVxuICAgIHtcbiAgICAgICAgdG1wID0gW1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJoZWxwLWNvdmVyXCI+JyxcbiAgICAgICAgICAgICAgICAnPGlucHV0IG5hbWU9XCJmX2RhdGVfZm9ybWF0WycgKyBpbmRleCArICddXCIgdmFsdWU9XCJERC5NTS5ZWVlZXCIgcGxhY2Vob2xkZXI9XCLQpNC+0YDQvNCw0YIg0LTQsNGC0YtcIj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcCB0b29sdGlwLWRvd25cIj4nLFxuICAgICAgICAgICAgICAgICAgICAnRCDigJQg0LTQtdC90YwsPGJyPicsXG4gICAgICAgICAgICAgICAgICAgICdNIOKAlCDQvNC10YHRj9GGICjQsdC10Lcg0L3Rg9C70Y8g0LLQv9C10YDQtdC00LgpPGJyPicsXG4gICAgICAgICAgICAgICAgICAgICdERCwgTU0g4oCUINC00LXQvdGMINC4INC80LXRgdGP0YYg0YEg0L3Rg9C70ZHQvCDQstC/0LXRgNC10LTQuCDQtNC70Y8g0LfQvdCw0YfQtdC90LjQuSDQvtGCIDEg0LTQviA5PGJyPicsXG4gICAgICAgICAgICAgICAgICAgICdZWSDigJQgMi3RgdC40LzQstC+0LvRjNC90L7QtSDQvtCx0L7Qt9C90LDRh9C10L3QuNC1INCz0L7QtNCwPGJyPicsXG4gICAgICAgICAgICAgICAgICAgICdZWVlZIOKAlCA0LdGB0LjQvNCy0L7Qu9GM0L3QvtC1INC+0LHQvtC30L3QsNGH0LXQvdC40LUg0LPQvtC00LAgKNCz0L7QtCDQv9C40YjQtdGC0YHRjyDQv9C+0LvQvdC+0YHRgtGM0Y4pJyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIF07XG5cbiAgICAgICAgc3RyLnB1c2goIHRtcC5qb2luKCdcXG4nKSApO1xuICAgIH1cblxuICAgIGlmICggWyAnZmlsZScsICdpbWFnZScgXS5pbmRleE9mKCB0eXBlICkgPj0gMCApXG4gICAge1xuICAgICAgICB0bXAgPSBbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm9wdGlvbi1ncm91cCBvcHRpb24tY29tYm9cIj4nLFxuICAgICAgICAgICAgICAgICc8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJmX2ZpbGVfY291bnRbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIjBcIj48c3BhbiBjbGFzcz1cIm9wdGlvblwiPtCe0LTQuNC9INGE0LDQudC7PC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZl9maWxlX2NvdW50WycgKyBpbmRleCArICddXCIgdmFsdWU9XCIxXCIgY2hlY2tlZD48c3BhbiBjbGFzcz1cIm9wdGlvblwiPtCc0L3QvtCz0L4g0YTQsNC50LvQvtCyPC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKCB0eXBlID09ICdpbWFnZScgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0bXAucHVzaCggJzxkaXYgY2xhc3M9XCJjYiBtYjEwXCI+PC9kaXY+JyApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyLnB1c2goIHRtcC5qb2luKCdcXG4nKSApO1xuICAgIH1cblxuICAgIGlmICggWyAnZ2FsbGVyeScsICdpbWFnZScgXS5pbmRleE9mKCB0eXBlICkgPj0gMCAmJiB0eXBlb2YgQ09ORklHVVJFICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQ09ORklHVVJFLmltYWdlICE9PSAndW5kZWZpbmVkJyApXG4gICAge1xuICAgICAgICB2YXIgdG1wMCA9IFtdLCB0bXAxID0gW10sIHRtcDIgPSBbXSwgeCwgY2hlY2tlZCA9ICcnO1xuICAgICAgICB0bXAwID0gW1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJqcy1zaXplLWxpc3RcIj4nLFxuICAgICAgICAgICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlLXNpbXBsZVwiPicsXG4gICAgICAgICAgICAgICAgJzxjb2w+PGNvbD48Y29sPjxjb2wgd2lkdGg9XCI1N1wiPjxjb2wgd2lkdGg9XCIyMFwiPicsXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPHRyPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiaFwiPtCf0YDQtdGE0LjQutGBPC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImhcIj7QqNC40YDQuNC90LA8L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiaFwiPtCS0YvRgdC+0YLQsDwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJoXCI+0JzQtdGC0L7QtDwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJoXCI+PC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAnPC90cj4nLFxuICAgICAgICAgICAgICAgICc8L3RoZWFkPicsXG4gICAgICAgICAgICAgICAgJzx0Ym9keT4nXG4gICAgICAgIF07XG5cbiAgICAgICAgdG1wMSA9IHRlbXBsYXRlKCd0cGxfaW1hZ2Vfcm93Jywge1xuICAgICAgICAgICAgaW5kZXg6IDAsXG4gICAgICAgICAgICBidXR0b246IHRydWUsXG4gICAgICAgICAgICBpdGVyYXRpb246IGluZGV4XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRtcDIgPSBbXG4gICAgICAgICAgICAnPC90Ym9keT4nLFxuICAgICAgICAgICAgJzwvdGFibGU+JyxcbiAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYWRkLXNpemUganMtYWRkLXNpemVcIiBkYXRhLWl0ZXJhdGlvbj1cInskc21hcnR5LmZvcmVhY2guaS5pdGVyYXRpb259XCI+PGkgY2xhc3M9XCJpY29uIGljb24tcGx1cy1zcXVhcmVcIj48L2k+INCU0L7QsdCw0LLQuNGC0Ywg0YDQsNC30LzQtdGAPC9hPicsXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICBdO1xuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAwLmpvaW4oJ1xcbicpICk7XG4gICAgICAgIHN0ci5wdXNoKCB0bXAxICk7XG4gICAgICAgIHN0ci5wdXNoKCB0bXAyLmpvaW4oJ1xcbicpICk7XG4gICAgfVxuXG4gICAgaWYgKCBbICdlbWJlZGRlZCcgXS5pbmRleE9mKCB0eXBlICkgPj0gMCApXG4gICAge1xuICAgICAgICBpZiAoIWlzX3VuZGVmaW5lZChNT0RVTEVfTElTVCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSAnJywgbTtcblxuICAgICAgICAgICAgZm9yIChtIGluIE1PRFVMRV9MSVNUKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGVjdCArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyBtICsgJ1wiPicgKyBNT0RVTEVfTElTVFttXS5uYW1lICsgJzwvb3B0aW9uPic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0bXAgPSBbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImotc2VsZWN0LXdyYXBwZXJcIj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWI1XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxzZWxlY3QgbmFtZT1cImZfbW9kdWxlWycgKyBpbmRleCArICddXCIgZGF0YS1wbGFjZWhvbGRlcj1cItCS0YvQsdGA0LDRgtGMINC80L7QtNGD0LvRjFwiIGNsYXNzPVwiai1zZWxlY3QtY2hvb3NlblwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPG9wdGlvbiB2YWx1ZT1cIjBcIj4tLS08L29wdGlvbj4nLCBzZWxlY3QsXG4gICAgICAgICAgICAgICAgICAgICc8L3NlbGVjdD4nLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2xlYXJmaXggai1zZWxlY3QtY29udGFpbmVyXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxzZWxlY3QgbmFtZT1cImZfZmllbGRzWycgKyBpbmRleCArICddW11cIiBtdWx0aXBsZSBkYXRhLXBsYWNlaG9sZGVyPVwi0JLRi9Cx0YDQsNGC0YxcIiBkaXNhYmxlZD48L3NlbGVjdD4nLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgXTtcblxuICAgICAgICBzdHIucHVzaCggdG1wLmpvaW4oJ1xcbicpICk7XG4gICAgfVxuXG4gICAgaWYgKCBbICdsaXN0JywgJ3NlY3Rpb24nLCAnYXV0b2NvbXBsZXRlJywgJ3NlbGVjdCcsICd0cmVlc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ211bHRpc2VsZWN0JyBdLmluZGV4T2YoIHR5cGUgKSA+PSAwIClcbiAgICB7XG4gICAgICAgIHRtcCA9IFtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2IgY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJjb250cm9sbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNvbnRyb2xsX19pbnB1dFwiIHZhbHVlPVwiMVwiIG9uY2hhbmdlPVwic3dpdGNoX3R5cGVzKHRoaXMpXCIgbmFtZT1cImZfdXNlX3RhYmxlX2xpc3RbJyArIGluZGV4ICsgJ11cIj48c3BhbiBjbGFzcz1cImNvbnRyb2xsX192aXNpYmxlIGNvbnRyb2xsX192aXNpYmxlX2NoZWNrYm94XCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwiY29udHJvbGxfX3RleHRcIj7Qv9GA0LjQstGP0LfQsNGC0Ywg0LogYCNfX21kZF9saXN0c2A8L3NwYW4+PC9sYWJlbD4nLFxuXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXNlIGNhc2UwXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBuYW1lPVwiZl90YWJsZV9uYW1lWycgKyBpbmRleCArICddXCIgdmFsdWU9XCJcIiBjbGFzcz1cIm1iNVwiIHBsYWNlaG9sZGVyPVwi0J3QsNC30LLQsNC90LjQtSDRgtCw0LHQu9C40YbRiyAoI19uZXdzKVwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cImZfdGFibGVfZmllbGRbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwi0J/QvtC70LUgKHRpdGxlKVwiPicsXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNhc2UgY2FzZTEgaGlkZGVuXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBuYW1lPVwiZl90YWJsZV9saXN0WycgKyBpbmRleCArICddXCIgZGlzYWJsZWQgcGxhY2Vob2xkZXI9XCJCSU5EINGB0L/QuNGB0LrQsFwiIHZhbHVlPVwiXCI+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIF07XG5cbiAgICAgICAgc3RyLnB1c2goIHRtcC5qb2luKCdcXG4nKSApO1xuICAgIH1cblxuICAgIGlmICggWyAncmFuZ2UnLCAnc2xpZGVyJyBdLmluZGV4T2YoIHR5cGUgKSA+PSAwIClcbiAgICB7XG4gICAgICAgIHRtcCA9IFtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiLWNvbFwiPicsXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCItbGVmdFwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cImZfcmFuZ2VbJyArIGluZGV4ICsgJ11bbWluXVwiIHZhbHVlPVwiXCIgcGxhY2Vob2xkZXI9XCJNaW5cIiBjbGFzcz1cImludGVnZXJcIj4nLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiLXJpZ2h0XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBuYW1lPVwiZl9yYW5nZVsnICsgaW5kZXggKyAnXVttYXhdXCIgdmFsdWU9XCJcIiBwbGFjZWhvbGRlcj1cIk1heFwiIGNsYXNzPVwiaW50ZWdlclwiPicsXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICBdO1xuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAuam9pbignXFxuJykgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGUgPT0gJ2VkaXRvcicgJiYgdHlwZW9mIENPTkZJR1VSRSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENPTkZJR1VSRS5lZGl0b3IgIT09ICd1bmRlZmluZWQnIClcbiAgICB7XG4gICAgICAgIHRtcCA9IFtdO1xuICAgICAgICB0bXAucHVzaCggJzxkaXYgY2xhc3M9XCJvcHRpb24tZ3JvdXAgb3B0aW9uLWNvbWJvXCI+JyApO1xuXG4gICAgICAgIHZhciB4LCBjaGVja2VkID0gJyc7XG5cbiAgICAgICAgZm9yKCB4IGluIENPTkZJR1VSRS5lZGl0b3IgKVxuICAgICAgICB7XG4gICAgICAgICAgICBjaGVja2VkID0gJyc7XG5cbiAgICAgICAgICAgIGlmICggdHlwZW9mIENPTkZJR1VSRS5lZGl0b3JbeF1bJ2RlZmF1bHQnXSAhPT0gJ3VuZGVmaW5lZCcgJiYgQ09ORklHVVJFLmVkaXRvclt4XVsnZGVmYXVsdCddID09IDEgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAnIGNoZWNrZWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0bXAucHVzaCggJzxsYWJlbD48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cImZfZWRpdG9yWycgKyBpbmRleCArICddXCIgdmFsdWU9XCInICsgQ09ORklHVVJFLmVkaXRvclt4XVsnc3lzdGVtJ10gKyAnXCIgJyArIGNoZWNrZWQgKyAnPjxzcGFuIGNsYXNzPVwib3B0aW9uXCI+JyArIENPTkZJR1VSRS5lZGl0b3JbeF1bJ25hbWUnXSArICc8L3NwYW4+PC9sYWJlbD4nICk7XG4gICAgICAgIH1cblxuICAgICAgICB0bXAucHVzaCggJzwvZGl2PicgKTtcblxuXG4gICAgICAgIGlmICggdHlwZW9mIENPTkZJR1VSRSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENPTkZJR1VSRS5lZGl0b3JfbW9kZSAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0bXAucHVzaCggJzxkaXYgY2xhc3M9XCJjYiBtYjEwXCI+PC9kaXY+JyApO1xuXG4gICAgICAgICAgICB0bXAucHVzaCggJzxkaXYgY2xhc3M9XCJvcHRpb24tZ3JvdXBcIj4nICk7XG4gICAgICAgICAgICAgICAgZm9yKCB4IGluIENPTkZJR1VSRS5lZGl0b3JfbW9kZSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0bXAucHVzaCggJzxsYWJlbD48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cImZfZWRpdG9yX21vZGVbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIicgKyBDT05GSUdVUkUuZWRpdG9yX21vZGVbIHggXSArICdcIj48c3BhbiBjbGFzcz1cIm9wdGlvblwiPicgKyBDT05GSUdVUkUuZWRpdG9yX21vZGVbIHggXSArICc8L3NwYW4+PC9sYWJlbD4nICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0bXAucHVzaCggJzwvZGl2PicgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAuam9pbignXFxuJykgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGUgPT0gJ3JlZGFjdG9yJyAmJiB0eXBlb2YgQ09ORklHVVJFICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQ09ORklHVVJFLnJlZGFjdG9yICE9PSAndW5kZWZpbmVkJyApXG4gICAge1xuICAgICAgICB0bXAgPSBbXTtcbiAgICAgICAgdG1wLnB1c2goICc8ZGl2IGNsYXNzPVwiZ3JvdXBcIj4nICk7XG5cbiAgICAgICAgdmFyIHgsIGNoZWNrZWQgPSAnJztcblxuICAgICAgICBmb3IoIHggaW4gQ09ORklHVVJFLnJlZGFjdG9yIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihDT05GSUdVUkUucmVkYWN0b3JbeF1bJ25hbWUnXSkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZihDT05GSUdVUkUucmVkYWN0b3JbeF1bJ3N5c3RlbSddKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2hlY2tlZCA9ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgQ09ORklHVVJFLnJlZGFjdG9yW3hdWydkZWZhdWx0J10gIT09ICd1bmRlZmluZWQnICYmIENPTkZJR1VSRS5yZWRhY3Rvclt4XVsnZGVmYXVsdCddID09IDEgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA9ICcgY2hlY2tlZCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG1wLnB1c2goICc8bGFiZWwgY2xhc3M9XCJncm91cF9faXRlbVwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBjbGFzcz1cImdyb3VwX19pdGVtX19yYlwiIG5hbWU9XCJmX3JlZGFjdG9yWycgKyBpbmRleCArICddXCIgdmFsdWU9XCInICsgQ09ORklHVVJFLnJlZGFjdG9yW3hdWydzeXN0ZW0nXSArICdcIicgKyBjaGVja2VkICsgJz48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX19zdHlsZVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImdyb3VwX19pdGVtX190ZXh0XCI+JyArIENPTkZJR1VSRS5yZWRhY3Rvclt4XVsnbmFtZSddICsgJzwvc3Bhbj48L2xhYmVsPicgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRtcC5wdXNoKCAnPC9kaXY+JyApO1xuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAuam9pbignXFxuJykgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiBzd2l0Y2hfdHlwZXMob2JqKVxue1xuICAgIHBfb2JqID0gJChvYmopLmNsb3Nlc3QoJ3RkJyk7XG4gICAgaWYgKCBvYmouY2hlY2tlZCApXG4gICAge1xuICAgICAgICAkKFwiLmNhc2UxXCIscF9vYmopLnNob3coKTtcbiAgICAgICAgJChcIi5jYXNlMSBpbnB1dFwiLHBfb2JqKS5hdHRyKHtcImRpc2FibGVkXCI6IGZhbHNlfSk7XG4gICAgICAgICQoXCIuY2FzZTBcIixwX29iaikuaGlkZSgpO1xuICAgICAgICAkKFwiLmNhc2UwIGlucHV0XCIscF9vYmopLmF0dHIoe1wiZGlzYWJsZWRcIjogdHJ1ZX0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJChcIi5jYXNlMFwiLHBfb2JqKS5zaG93KCk7XG4gICAgICAgICQoXCIuY2FzZTAgaW5wdXRcIixwX29iaikuYXR0cih7XCJkaXNhYmxlZFwiOiBmYWxzZX0pO1xuICAgICAgICAkKFwiLmNhc2UxXCIscF9vYmopLmhpZGUoKTtcbiAgICAgICAgJChcIi5jYXNlMSBpbnB1dFwiLHBfb2JqKS5hdHRyKHtcImRpc2FibGVkXCI6IHRydWV9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGh1bWFuU2l6ZShieXRlcykge1xuICAgIGlmICh0eXBlb2YgYnl0ZXMgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBpZiAoYnl0ZXMgPj0gMTAwMDAwMDAwMCkge1xuICAgICAgICByZXR1cm4gKGJ5dGVzIC8gMTAwMDAwMDAwMCkudG9GaXhlZCgyKSArICcg0JPQsSc7XG4gICAgfVxuXG4gICAgaWYgKGJ5dGVzID49IDEwMDAwMDApIHtcbiAgICAgICAgcmV0dXJuIChieXRlcyAvIDEwMDAwMDApLnRvRml4ZWQoMikgKyAnINCc0LEnO1xuICAgIH1cblxuICAgIGlmIChieXRlcyA+PSAxMDI0KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIChieXRlcyAvIDEwMDApLnRvRml4ZWQoMikgKyAnINCa0LEnO1xuICAgIH1cblxuICAgIHJldHVybiBieXRlcyArICcg0LEnO1xufVxuXG5mdW5jdGlvbiBhZGRFeHRlbmRldCgpIHtcbiAgICAkLnBvc3QoXG4gICAgICAgIFwiL1wiICsgQURNSU5fRElSICsgXCIvYWpheC92b3RlL1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246ICQoXCIjYWN0aW9uXCIpLmF0dHIoXCJ2YWx1ZVwiKSAgLFxuICAgICAgICAgICAgaWQ6ICQoXCIjaWRcIikuYXR0cihcInZhbHVlXCIpICxcbiAgICAgICAgICAgIHRpdGxlOiAkKFwiI3RpdGxlXCIpLmF0dHIoXCJ2YWx1ZVwiKSAsXG4gICAgICAgICAgICBvcmQ6ICQoXCIjb3JkXCIpLmF0dHIoXCJ2YWx1ZVwiKSAsXG4gICAgICAgICAgICB2aXNpYmxlOiAkKFwiI1ZvdGVBZGRRdWVzdGlvbnMgaW5wdXQ6cmFkaW9bbmFtZT12aXNpYmxlXTpjaGVja2VkXCIpLnZhbCgpXG4gICAgICAgIH0sXG4gICAgICAgIG9uQWpheFN1Y2Nlc3NBZGRcbiAgICApO1xuICAgIGZ1bmN0aW9uIG9uQWpheFN1Y2Nlc3NBZGQoZGF0YSkgeyAvL1xuICAgICAgICB2YXIgdmlzO1xuICAgICAgICBpZiAoICQoXCIjVm90ZUFkZFF1ZXN0aW9ucyBpbnB1dDpyYWRpb1tuYW1lPXZpc2libGVdOmNoZWNrZWRcIikudmFsKCkgPT0gMSApIHZpcyA9IFwi0JTQsFwiO1xuICAgICAgICBlbHNlICB2aXMgPSBcItCd0LXRglwiO1xuXG4gICAgICAgIHZhciBpbm5lciA9ICc8dHIgaWQ9XCJ0cl8nICsgZGF0YSArICdcIj4nO1xuICAgICAgICBpbm5lciArPSAnPHRkPic7XG4gICAgICAgIGlubmVyICs9ICc8aW5wdXQgbmFtZT1cInBhcmVudF9pZF8nICsgZGF0YSArICdcIiBpZD1cInBhcmVudF9pZF8nICsgZGF0YSArICdcIiB2YWx1ZT1cIjJcIiB0eXBlPVwiaGlkZGVuXCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzxpbnB1dCBuYW1lPVwiaWRfJyArIGRhdGEgKyAnXCIgaWQ9XCJpZF8nICsgZGF0YSArICdcIiB2YWx1ZT1cIicgKyBkYXRhICsgJ1wiIHR5cGU9XCJoaWRkZW5cIj4nO1xuICAgICAgICBpbm5lciArPSAnPGRpdiBpZD1cInRpdGxlXycgKyBkYXRhICsgJ1wiPjxiPicgKyAkKFwiI3RpdGxlXCIpLmF0dHIoXCJ2YWx1ZVwiKSArICc8L2I+PC9kaXY+JztcbiAgICAgICAgaW5uZXIgKz0gJzxkaXYgaWQ9XCJ0aXRsZV9pXycgKyBkYXRhICsgJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nO1xuICAgICAgICBpbm5lciArPSAnPGlucHV0IG5hbWU9XCJ0aXRsZV8nICsgZGF0YSArICdcIiB2YWx1ZT1cIicgKyAkKFwiI3RpdGxlXCIpLmF0dHIoXCJ2YWx1ZVwiKSArICdcIiBjbGFzcz1cImJvcmQgcGFkZCB3MTAwXCIgaWQ9XCJ0aXRsZV9pbnB1dF8nICsgZGF0YSArICdcIiB0eXBlPVwidGV4dFwiPic7XG4gICAgICAgIGlubmVyICs9ICc8cCBhbGlnbj1cInJpZ2h0XCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBvbmNsaWNrPVwic2F2ZUV4dGVuZGV0KFxcJycgKyBkYXRhICsgJ1xcJyk7XCI+0KHQvtGF0YDQsNC90LjRgtGMPC9hPiB8ICc7XG4gICAgICAgIGlubmVyICs9ICc8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgb25jbGljaz1cImNhbmNlbEV4dGVuZGV0KFxcJycgKyBkYXRhICsgJ1xcJyk7XCI+0J7RgtC80LXQvdCwPC9hPiAnO1xuICAgICAgICBpbm5lciArPSAnPC9wPic7XG4gICAgICAgIGlubmVyICs9ICc8L2Rpdj4nO1xuICAgICAgICBpbm5lciArPSAnPC90ZD4nO1xuICAgICAgICBpbm5lciArPSAnPHRkPic7XG4gICAgICAgIGlubmVyICs9ICc8ZGl2IGlkPVwib3JkXycgKyBkYXRhICsgJ1wiPjxiPicgKyAkKFwiI29yZFwiKS5hdHRyKFwidmFsdWVcIikgKyAnPC9iPjwvZGl2Pic7XG4gICAgICAgIGlubmVyICs9ICc8ZGl2IGlkPVwib3JkX2lfJyArIGRhdGEgKyAnXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPic7XG4gICAgICAgIGlubmVyICs9ICc8aW5wdXQgbmFtZT1cIm9yZF8nICsgZGF0YSArICdcIiB2YWx1ZT1cIicgKyAkKFwiI29yZFwiKS5hdHRyKFwidmFsdWVcIikgKyAnXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiBjbGFzcz1cImJvcmQgcGFkZCB3MTAwXCIgaWQ9XCJvcmRfaW5wdXRfJyArIGRhdGEgKyAnXCIgdHlwZT1cInRleHRcIj4nO1xuICAgICAgICBpbm5lciArPSAnPC9kaXY+JztcbiAgICAgICAgaW5uZXIgKz0gJzwvdGQ+JztcblxuICAgICAgICBpbm5lciArPSAnPHRkIGFsaWduPVwiY2VudGVyXCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzxkaXYgaWQ9XCJ2aXNpYmxlXycgKyBkYXRhICsgJ1wiPjxiPicgKyB2aXMgKyAnPC9iPjwvZGl2Pic7XG4gICAgICAgIGlubmVyICs9ICc8ZGl2IGlkPVwidmlzaWJsZV9pXycgKyBkYXRhICsgJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nO1xuICAgICAgICBpbm5lciArPSAnPGlucHV0IG5hbWU9XCJ2aXNpYmxlXycgKyBkYXRhICsgJ1wiIHZhbHVlPVwiMVwiIGNoZWNrZWQ9XCJjaGVja2VkXCIgb25jbGljaz1cIiQoXFwnI3Zpc18nICsgZGF0YSArICdcXCcpLnZhbChcXCcxXFwnKTtcIiBpZD1cInZpc2libGVfaW5wdXRfJyArIGRhdGEgKyAnXzFcIiB0eXBlPVwicmFkaW9cIj7QlNCwICZuYnNwOyZuYnNwOyc7XG4gICAgICAgIGlubmVyICs9ICc8aW5wdXQgbmFtZT1cInZpc2libGVfJyArIGRhdGEgKyAnXCIgdmFsdWU9XCIwXCIgb25jbGljaz1cIiQoXFwnI3Zpc18nICsgZGF0YSArICdcXCcpLnZhbChcXCcwXFwnKTtcIiBpZD1cInZpc2libGVfaW5wdXRfJyArIGRhdGEgKyAnXzBcIiB0eXBlPVwicmFkaW9cIj7QndC10YInO1xuICAgICAgICBpbm5lciArPSAnPGlucHV0IG5hbWU9XCJ2aXNfJyArIGRhdGEgKyAnXCIgaWQ9XCJ2aXNfJyArIGRhdGEgKyAnXCIgdmFsdWU9XCJcIiB0eXBlPVwiaGlkZGVuXCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzwvZGl2Pic7XG4gICAgICAgIGlubmVyICs9ICc8L3RkPic7XG4gICAgICAgIGlubmVyICs9ICc8dGQ+JztcbiAgICAgICAgaW5uZXIgKz0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJpY29uIGljb24tZWRpdFwiIG9uY2xpY2s9XCJlZGl0RXh0ZW5kZXQoXFwnJyArIGRhdGEgKyAnXFwnKVwiPjwvYT4nO1xuICAgICAgICBpbm5lciArPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImljb24gaWNvbi1kZWxldGUgcmVtb3ZlLXRyaWdnZXJcIiBvbkNsaWNrPVwiZGVsRXh0ZW5kZXQoXFwnJyArIGRhdGEgKyAnXFwnKVwiPjwvYT4nO1xuICAgICAgICBpbm5lciArPSAnPC90ZD4nO1xuICAgICAgICBpbm5lciArPSAnPC90cj4nO1xuXG4gICAgICAgIC8vICBJTlNFUlQgTkVXIEZJRUxEXG4gICAgICAgICQoaW5uZXIpLmluc2VydEJlZm9yZShcIiNhamF4X2FkZF9mb3JtXCIpO1xuXG4gICAgICAgIC8vICBSRVNFVCBGT1JNUyBFTEVNRU5UU1xuICAgICAgICAkKFwiI3RpdGxlXCIpLmF0dHIoe3ZhbHVlOlwiXCJ9KTtcbiAgICAgICAgJChcIiNvcmRcIikuYXR0cih7dmFsdWU6XCJcIn0pO1xuXG4gICAgICAgIC8vICBISURFIEZPUk1cbiAgICAgICAgJChcIiNhamF4X2FkZF9mb3JtXCIpLmhpZGUoKTtcbiAgICB9XG59XG4gICAgZnVuY3Rpb24gc2F2ZUV4dGVuZGV0KGlkKSB7XG4gICAgJC5wb3N0KFxuICAgICAgICBcIi9cIiArIEFETUlOX0RJUiArIFwiL2FqYXgvdm90ZS9cIixcbiAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uOiBcInVwZGF0ZVwiICxcbiAgICAgICAgICAgIGlkOiAkKFwiI2lkX1wiK2lkKS5hdHRyKFwidmFsdWVcIikgLFxuICAgICAgICAgICAgcGFyZW50X2lkOiAkKFwiI3BhcmVudF9pZF9cIitpZCkuYXR0cihcInZhbHVlXCIpICxcbiAgICAgICAgICAgIHRpdGxlOiAkKFwiI3RpdGxlX2lucHV0X1wiK2lkKS5hdHRyKFwidmFsdWVcIikgLFxuICAgICAgICAgICAgb3JkOiAkKFwiI29yZF9pbnB1dF9cIitpZCkuYXR0cihcInZhbHVlXCIpICxcbiAgICAgICAgICAgIHZpc2libGU6ICQoXCIjVm90ZUFkZFF1ZXN0aW9ucyBpbnB1dDpyYWRpb1tuYW1lPXZpc2libGVfXCIraWQrXCJdOmNoZWNrZWRcIikudmFsKClcbiAgICAgICAgfSxcbiAgICAgICAgb25BamF4U3VjY2Vzc1NhdmVcbiAgICApO1xuICAgIGZ1bmN0aW9uIG9uQWpheFN1Y2Nlc3NTYXZlKGRhdGEpIHtcbiAgICAgICAgdmFyIHZpcztcbiAgICAgICAgaWYgKCAkKFwiI3Zpc19cIitpZCkudmFsKCkgPT0gMSApIHZpcyA9IFwi0JTQsFwiO1xuICAgICAgICBlbHNlICB2aXMgPSBcItCd0LXRglwiO1xuICAgICAgICAkKFwiI3RpdGxlX1wiK2lkKS5odG1sKCBcIjxiPlwiKyQoXCIjdGl0bGVfaW5wdXRfXCIraWQpLmF0dHIoXCJ2YWx1ZVwiKStcIjwvYj5cIiApO1xuICAgICAgICAkKFwiI29yZF9cIitpZCkuaHRtbCggJChcIiNvcmRfaW5wdXRfXCIraWQpLmF0dHIoXCJ2YWx1ZVwiKSApO1xuICAgICAgICAkKFwiI3Zpc2libGVfXCIraWQpLmh0bWwoIHZpcyApO1xuXG4gICAgICAgICQoXCIjdGl0bGVfXCIraWQpLnNob3coKTtcbiAgICAgICAgJChcIiNvcmRfXCIraWQpLnNob3coKTtcbiAgICAgICAgJChcIiN2aXNpYmxlX1wiK2lkKS5zaG93KCk7XG4gICAgICAgICQoXCIjdGl0bGVfaV9cIitpZCkuaGlkZSgpO1xuICAgICAgICAkKFwiI29yZF9pX1wiK2lkKS5oaWRlKCk7XG4gICAgICAgICQoXCIjdmlzaWJsZV9pX1wiK2lkKS5oaWRlKCk7XG4gICAgfVxuXG59XG4vL1xuZnVuY3Rpb24gZWRpdEV4dGVuZGV0KGlkKSB7XG4gICAgJChcIiN0aXRsZV9cIitpZCkuaGlkZSgpO1xuICAgICQoXCIjb3JkX1wiK2lkKS5oaWRlKCk7XG4gICAgJChcIiN2aXNpYmxlX1wiK2lkKS5oaWRlKCk7XG4gICAgJChcIiN0aXRsZV9pX1wiK2lkKS5zaG93KCk7XG4gICAgJChcIiNvcmRfaV9cIitpZCkuc2hvdygpO1xuICAgICQoXCIjdmlzaWJsZV9pX1wiK2lkKS5zaG93KCk7XG59XG4vL1xuZnVuY3Rpb24gZGVsRXh0ZW5kZXQoaWQpIHtcbiAgICBpZiAoY3AuZGlhbG9nKFwi0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0LfQsNC/0LjRgdGMP1wiKSkge1xuICAgICAgICAkLnBvc3QoXG4gICAgICAgICAgICBcIi9cIiArIEFETUlOX0RJUiArIFwiL2FqYXgvdm90ZS9cIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhY3Rpb246IFwiZGVsXCIgLFxuICAgICAgICAgICAgICAgIGlkOiAkKFwiI2lkX1wiK2lkKS52YWwoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uQWpheFN1Y2Nlc3NEZWxcbiAgICAgICAgKTtcbiAgICB9XG59XG5mdW5jdGlvbiBvbkFqYXhTdWNjZXNzRGVsKGRhdGEpe1xuICAgICQoXCIjdHJfXCIrZGF0YSkucmVtb3ZlKCk7XG59XG4vL1xuZnVuY3Rpb24gY2FuY2VsRXh0ZW5kZXQoaWQpIHtcbiAgICAkKFwiI3RpdGxlX1wiK2lkKS5zaG93KCk7XG4gICAgJChcIiNvcmRfXCIraWQpLnNob3coKTtcbiAgICAkKFwiI3Zpc2libGVfXCIraWQpLnNob3coKTtcbiAgICAkKFwiI3RpdGxlX2lfXCIraWQpLmhpZGUoKTtcbiAgICAkKFwiI29yZF9pX1wiK2lkKS5oaWRlKCk7XG4gICAgJChcIiN2aXNpYmxlX2lfXCIraWQpLmhpZGUoKTtcbn1cblxuZnVuY3Rpb24gb25BamF4U3VjY2VzcyhkYXRhKSB7XG4gICAgYWxlcnQoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGVkaXRUaXRsZSggaWQsIHRpdGxlIClcbntcbiAgICBpZiAodHlwZW9mKHRpdGxlKSA9PSAndW5kZWZpbmVkJylcbiAgICB7XG4gICAgICAgIHZhciB0aXRsZSA9ICQoJyNmdGl0bGVfJyArIGlkKS50ZXh0KCk7XG4gICAgfVxuXG4gICAgdmFyIG5hbWUgPSBwcm9tcHQoJ9CS0LLQtdC00LjRgtC1INC90L7QstC+0LUg0LjQvNGPJywgdGl0bGUpO1xuXG4gICAgaWYgKG5hbWUgIT0gJycgJiYgbmFtZSAhPSB0aXRsZSAmJiBuYW1lICE9PSBudWxsKVxuICAgIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy9tZXRhL2ZpbGVuYW1lJyxcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdKU09OJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IHRydWUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCcjZnRpdGxlXycgKyBpZCkuaHRtbCggbmFtZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBlZGl0VmlzaWJsZShpZCwgdmlzaWJsZSlcbntcbiAgICB2aXNpYmxlID0gKHZpc2libGUgPT0gMSA/IDAgOiAxKTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy9tZXRhL2ZpbGV2aXNpYmxlJyxcbiAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIHZpc2libGU6IHZpc2libGVcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6ICdKU09OJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IHRydWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJCgnI2Z2aXNpYmxlXycgKyBpZCkucmVtb3ZlQ2xhc3MoJ2ljb24tZXllIGljb24tZXllLW9mZicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZpc2libGUgPT0gMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmdmlzaWJsZV8nICsgaWQpLmFkZENsYXNzKCdpY29uLWV5ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Z2aXNpYmxlXycgKyBpZCkuYWRkQ2xhc3MoJ2ljb24tZXllLW9mZicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5cdHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZWRpdE9yZCggaWQsIG9yZCApXG57XG5cdGNvbnN0IG5ld29yZCA9IHByb21wdCgn0J/QvtGA0Y/QtNC+0LonLCBvcmQpO1xuXG5cdGlmICghbmV3b3JkKSByZXR1cm4gZmFsc2U7XG5cblx0aWYgKG5ld29yZCAhPSAnJyAmJiBuZXdvcmQgIT0gb3JkKSB7XG5cdFx0JC5wb3N0KCcvJyArIEFETUlOX0RJUiArICcvYWpheC9tZXRhLycsIHsgYWN0aW9uOiBcIm5ld2ZpbGVvcmRcIiwgbmV3b3JkOiBuZXdvcmQsIGlkOiBpZCB9LCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZiAoZGF0YSA9PSAxKSB7XG5cdFx0XHRcdCQoJyNvcmRmaWxlXycgKyBpZCkuaHRtbChuZXdvcmQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gYWpheF92aXNfdG9nZ2xlKG9iaiwgaWQsIG1vZF9pZClcbntcbiAgICAkKG9iaikuYXBwZW5kKCc8aSBjbGFzcz1cImxvYWRpbmdcIj48L2k+Jyk7XG5cblx0JC5wb3N0KCAnLycgKyBBRE1JTl9ESVIgKyAnL2FqYXgvc3RydWN0dXJlLycsIHsgYWN0OiBcInRvZ2dsZV92aXNpYmxlXCIsIG1vZF9pZDogbW9kX2lkLCBpZDogaWQgfSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpZiAoIGRhdGEgPT0gMSApXG4gICAgICAgIHtcbiAgICAgICAgICAgICQob2JqKS50b2dnbGVDbGFzcyhcImljb24tZXllXCIpLnRvZ2dsZUNsYXNzKFwiaWNvbi1leWUtb2ZmXCIpLmh0bWwoJycpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblx0cmV0dXJuICExO1xufVxuXG5mdW5jdGlvbiBzaG93X3Rvb2x0aXBzKGlkKVxue1xuXHQkKFwiI1wiK2lkKS50b2dnbGUoKTtcbn1cblxuZnVuY3Rpb24gbXlfdW5jaGVjaygpe1xuXHQkKFwiLmFjY2Vzc1wiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0JCh0aGlzKS5hdHRyKHtjaGVja2VkOicnfSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBDaGVja0FuZFN1Ym1pdChpZCl7XG4gICAgdmFyIGZsYWcgPSB0cnVlO1xuXHQkKFwiI1wiK2lkK1wiIC5uZXNzXCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRpZiAoICQodGhpcykudmFsKCkgPT0gXCJcIiApIHtcblx0XHRcdCQodGhpcykuZm9jdXMoKS5hZGRDbGFzcyhcImVycm9yXCIpO1xuXHRcdFx0ZmxhZyA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XG5cdFx0fVxuXHR9KTtcblx0aWYgKGZsYWcpXG5cdFx0JChcIiNcIitpZCkuc3VibWl0KCk7XG5cdGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzZXRTb3J0KG9iaixjb29raWVfbmFtZSl7XG5cdHZhbHVlID0gJChvYmopLnZhbCgpO1xuXHRzZXRDb29raWUoY29va2llX25hbWUsdmFsdWUpO1xuXHRsb2NhdGlvbi5ocmVmID0gbG9jYXRpb24uaHJlZjtcbn1cblxuZnVuY3Rpb24gZm9ybV9zdWJtaXQoaWQscGFyYW0pXG57XG5cdGlmIChwYXJhbSA9PSBcInNhdmVcIilcblx0XHQkKFwiI1wiK2lkKS5zdWJtaXQoKTtcblx0aWYgKHBhcmFtID09IFwiYXBwbHlcIilcblx0XHQkKFwiI1wiK2lkKS5zdWJtaXQoKTtcblx0ZWxzZVxuXHRcdCQoXCIjXCIraWQpLnN1Ym1pdCgpO1xufVxuXG5mdW5jdGlvbiBvcGVud2luKCBpbWcgLCB3ICwgaCAsIHRpdGxlIClcbntcblx0aWYgKCBod25kICE9IG51bGwgKVxuXHRod25kLmNsb3NlKCk7XG5cdGh3bmQgPSB3aW5kb3cub3BlbiggaW1nICwgXCJcIiAsIFwidG9vbGJhcj1ubyAsIGxvY2F0aW9uPW5vICwgZGlyZWN0b3JpZXM9bm8gLCByZXNpemFibGU9bm8gLCB3aWR0aD1cIiArIHcgKyBcIiAsIGhlaWdodD1cIiArIGggKTtcblx0aHduZC5kb2N1bWVudC5vcGVuKCk7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8aHRtbD5cIik7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8aGVhZD5cIik7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8dGl0bGU+XCIgKyB0aXRsZSArIFwiPC90aXRsZT5cIik7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8L2hlYWQ+XCIpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPGJvZHkgYmdjb2xvcj0jZmZmZmZmIGJvdHRvbW1hcmdpbj0wIGxlZnRtYXJnaW49MCBtYXJnaW5oZWlnaHQ9MCBtYXJnaW53aWR0aD0wIHJpZ2h0bWFyZ2luPTAgdG9wbWFyZ2luPTAgc3R5bGU9J2JvcmRlcjowcHg7Jz5cIik7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8dGFibGUgYWxpZ249Y2VudGVyIHdpZHRoPTEwMCUgaGVpZ2h0PTEwMCUgY2VsbHNwYWNpbmc9MCBjZWxscGFkZGluZz0wIGJvcmRlcj0wPlwiKTtcblx0aHduZC5kb2N1bWVudC53cml0ZShcIjx0cj48dGQ+PGltZyBzcmM9J1wiICsgaW1nICsgXCInIGJvcmRlcj0wPjwvdGQ+PC90cj5cIik7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8L3RhYmxlPjwvYm9keT48L2h0bWw+XCIpO1xuXHRod25kLmRvY3VtZW50LmNsb3NlKCk7XG59XG5cbmZ1bmN0aW9uIG9wZW53aW5fdGV4dCggdXJsICwgdyAsIGggKVxue1xuXHR3aW5kb3cub3BlbiggdXJsICwgXCJcIiAsIFwidG9vbGJhcj1ubyAsIGxvY2F0aW9uPW5vICwgZGlyZWN0b3JpZXM9bm8gLCByZXNpemFibGU9bm8gLCBzY3JvbGxiYXJzPW5vICwgd2lkdGg9XCIgKyB3ICsgXCIgLCBoZWlnaHQ9XCIgKyBoICk7XG59XG5cbmZ1bmN0aW9uIGx0cmltKHN0cilcbntcblx0Zm9yKHZhciBrID0gMDsgayA8IHN0ci5sZW5ndGggJiYgaXNXaGl0ZXNwYWNlKHN0ci5jaGFyQXQoaykpOyBrKyspO1xuXHRyZXR1cm4gc3RyLnN1YnN0cmluZyhrLCBzdHIubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gcnRyaW0oc3RyKVxue1xuXHRmb3IodmFyIGo9c3RyLmxlbmd0aC0xOyBqPj0wICYmIGlzV2hpdGVzcGFjZShzdHIuY2hhckF0KGopKTsgai0tKTtcblx0cmV0dXJuIHN0ci5zdWJzdHJpbmcoMCxqKzEpO1xufVxuXG5mdW5jdGlvbiB0cmltKHN0cilcbntcblx0c3RyID0gc3RyLnJlcGxhY2UoL1xcc3syLH0vZywnICcpO1xuXHRyZXR1cm4gbHRyaW0ocnRyaW0oc3RyKSk7XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaGFyVG9DaGVjaylcbntcblx0dmFyIHdoaXRlc3BhY2VDaGFycyA9IFwiIFxcdFxcblxcclxcZlwiO1xuXHRyZXR1cm4gKHdoaXRlc3BhY2VDaGFycy5pbmRleE9mKGNoYXJUb0NoZWNrKSAhPSAtMSk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGl0ZXJhdGUoc3RyaW5nLCB1cmwpXG57XG4gICAgc3RyaW5nID0gdHJpbShzdHJpbmcudG9Mb3dlckNhc2UoKSk7XG5cbiAgICBpZiAoc3RyaW5nICE9ICcnKVxuICAgIHtcbiAgICAgICAgdmFyIGNoYXJfbWFwID0ge30sIHRlc3QgPSBbXSwgcmVzdWx0ID0gJycsIHg7XG5cbiAgICAgICAgY2hhcl9tYXAgPSB7XG4gICAgICAgICAgICAvLyBMYXRpblxuICAgICAgICAgICAgJ8OgJzogJ2EnLCAnw6EnOiAnYScsICfDoic6ICdhJywgJ8OjJzogJ2EnLCAnw6QnOiAnYScsICfDpSc6ICdhJywgJ8OmJzogJ2FlJywgJ8OnJzogJ2MnLFxuICAgICAgICAgICAgJ8OoJzogJ2UnLCAnw6knOiAnZScsICfDqic6ICdlJywgJ8OrJzogJ2UnLCAnw6wnOiAnaScsICfDrSc6ICdpJywgJ8OuJzogJ2knLCAnw68nOiAnaScsXG4gICAgICAgICAgICAnw7AnOiAnZCcsICfDsSc6ICduJywgJ8OyJzogJ28nLCAnw7MnOiAnbycsICfDtCc6ICdvJywgJ8O1JzogJ28nLCAnw7YnOiAnbycsICfFkSc6ICdvJyxcbiAgICAgICAgICAgICfDuCc6ICdvJywgJ8O5JzogJ3UnLCAnw7onOiAndScsICfDuyc6ICd1JywgJ8O8JzogJ3UnLCAnxbEnOiAndScsICfDvSc6ICd5JywgJ8O+JzogJ3RoJyxcbiAgICAgICAgICAgICfDvyc6ICd5JyxcblxuICAgICAgICAgICAgLy8gR3JlZWtcbiAgICAgICAgICAgICfOsSc6ICdhJywgJ86yJzogJ2InLCAnzrMnOiAnZycsICfOtCc6ICdkJywgJ861JzogJ2UnLCAnzrYnOiAneicsICfOtyc6ICdoJywgJ864JzogJzgnLFxuICAgICAgICAgICAgJ865JzogJ2knLCAnzronOiAnaycsICfOuyc6ICdsJywgJ868JzogJ20nLCAnzr0nOiAnbicsICfOvic6ICczJywgJ86/JzogJ28nLCAnz4AnOiAncCcsXG4gICAgICAgICAgICAnz4EnOiAncicsICfPgyc6ICdzJywgJ8+EJzogJ3QnLCAnz4UnOiAneScsICfPhic6ICdmJywgJ8+HJzogJ3gnLCAnz4gnOiAncHMnLCAnz4knOiAndycsXG4gICAgICAgICAgICAnzqwnOiAnYScsICfOrSc6ICdlJywgJ86vJzogJ2knLCAnz4wnOiAnbycsICfPjSc6ICd5JywgJ86uJzogJ2gnLCAnz44nOiAndycsICfPgic6ICdzJyxcbiAgICAgICAgICAgICfPiic6ICdpJywgJ86wJzogJ3knLCAnz4snOiAneScsICfOkCc6ICdpJyxcblxuICAgICAgICAgICAgLy8gVHVya2lzaFxuICAgICAgICAgICAgJ8WfJzogJ3MnLCAnxLEnOiAnaScsICfDpyc6ICdjJywgJ8O8JzogJ3UnLCAnw7YnOiAnbycsICfEnyc6ICdnJyxcblxuICAgICAgICAgICAgLy8gUnVzc2lhblxuICAgICAgICAgICAgJ9CwJzogJ2EnLCAn0LEnOiAnYicsICfQsic6ICd2JywgJ9CzJzogJ2cnLCAn0LQnOiAnZCcsICfQtSc6ICdlJywgJ9GRJzogJ3lvJywgJ9C2JzogJ3poJyxcbiAgICAgICAgICAgICfQtyc6ICd6JywgJ9C4JzogJ2knLCAn0LknOiAnaicsICfQuic6ICdrJywgJ9C7JzogJ2wnLCAn0LwnOiAnbScsICfQvSc6ICduJywgJ9C+JzogJ28nLFxuICAgICAgICAgICAgJ9C/JzogJ3AnLCAn0YAnOiAncicsICfRgSc6ICdzJywgJ9GCJzogJ3QnLCAn0YMnOiAndScsICfRhCc6ICdmJywgJ9GFJzogJ2gnLCAn0YYnOiAnYycsXG4gICAgICAgICAgICAn0YcnOiAnY2gnLCAn0YgnOiAnc2gnLCAn0YknOiAnc2NoJywgJ9GKJzogJycsICfRiyc6ICd5JywgJ9GMJzogJycsICfRjSc6ICdlJywgJ9GOJzogJ3l1JyxcbiAgICAgICAgICAgICfRjyc6ICd5YScsXG5cbiAgICAgICAgICAgIC8vIFVrcmFpbmlhblxuICAgICAgICAgICAgJ9GUJzogJ3llJywgJ9GWJzogJ2knLCAn0ZcnOiAneWknLCAn0pEnOiAnZycsXG5cbiAgICAgICAgICAgIC8vIEN6ZWNoXG4gICAgICAgICAgICAnxI0nOiAnYycsICfEjyc6ICdkJywgJ8SbJzogJ2UnLCAnxYgnOiAnbicsICfFmSc6ICdyJywgJ8WhJzogJ3MnLCAnxaUnOiAndCcsICfFryc6ICd1JywgJ8W+JzogJ3onLFxuXG4gICAgICAgICAgICAvLyBQb2xpc2hcbiAgICAgICAgICAgICfEhSc6ICdhJywgJ8SHJzogJ2MnLCAnxJknOiAnZScsICfFgic6ICdsJywgJ8WEJzogJ24nLCAnw7MnOiAnbycsICfFmyc6ICdzJywgJ8W6JzogJ3onLCAnxbwnOiAneicsXG5cbiAgICAgICAgICAgIC8vIExhdHZpYW5cbiAgICAgICAgICAgICfEgSc6ICdhJywgJ8SNJzogJ2MnLCAnxJMnOiAnZScsICfEoyc6ICdnJywgJ8SrJzogJ2knLCAnxLcnOiAnaycsICfEvCc6ICdsJywgJ8WGJzogJ24nLCAnxaEnOiAncycsICfFqyc6ICd1JywgJ8W+JzogJ3onXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8g0J7Rh9C40YnQsNC10Lwg0L7RgiDQu9C40YjQvdC40YUg0YHQuNC80LLQvtC70L7QslxuXG4gICAgICAgIHJlc3VsdCA9IHN0cmluZy5yZXBsYWNlKC9bXmEtetCwLdGPMC05XS9naSwgJy0nKTtcblxuICAgICAgICBpZiAodXJsID09ICdjeXJpbGxpYycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGVuY29kZVVSSSh1bmVzY2FwZSh1bmVzY2FwZShyZXN1bHQpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXJsID09ICd0cmFuc2xhdGUnKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKHggaW4gY2hhcl9tYXApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoUmVnRXhwKHgsICdnJyksIGNoYXJfbWFwW3hdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKFJlZ0V4cCh4LCAnZycpLCBjaGFyX21hcFt4XSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKHggaW4gY2hhcl9tYXApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoUmVnRXhwKHgsICdnJyksIGNoYXJfbWFwW3hdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vINCe0YfQuNGJ0LDQtdC8INC+0YIg0LvQuNGI0L3QuNGFINC00LXRhNC40YHQvtCyXG5cbiAgICAgICAgdGVzdCA9IHJlc3VsdC5zcGxpdCgnJyk7XG5cbiAgICAgICAgaWYgKHRlc3RbMF0gPT0gJy0nKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuc2xpY2UoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVzdFt0ZXN0Lmxlbmd0aCAtIDFdID09ICctJylcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZyA9IHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVkb3VibGUoc3RyaW5nKTtcbn1cblxuZnVuY3Rpb24gYmluZGluZyhuYW1lLCBlbGVtZW50KVxue1xuICAgICQoJ2JvZHknKS5vbigna2V5dXAgYmx1ciBrZXlwcmVzcycsICdpbnB1dFtuYW1lPVwiJyArIG5hbWUgKyAnXCJdJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJCgnaW5wdXRbbmFtZT1cIicgKyBlbGVtZW50ICsgJ1wiXScpO1xuICAgICAgICAgICAgaWYgKCEkaW5wdXQucHJvcCgncmVhZG9ubHknKSkge1xuICAgICAgICAgICAgICAgICRpbnB1dC52YWwodHJhbnNsaXRlcmF0ZSh0aGlzLnZhbHVlLCBVUkxfVFJBTlNMQVRFKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVkb3VibGUoIHN0cmluZyApXG57XG5cdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKCAnX18nLCAnXycgKTtcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSggJ18tXycsICdfJyApO1xuXHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSggJy0tJywgJy0nICk7XG5cblx0aWYgKCBzdHJpbmcuaW5kZXhPZignX18nKSA+IC0xIClcblx0e1xuXHRcdHJldHVybiByZWRvdWJsZSggc3RyaW5nICk7XG5cdH1cblxuXHRpZiAoIHN0cmluZy5zdWJzdHIoMCwxKSA9PSAnXycgJiYgc3RyaW5nLmxlbmd0aCA+IDEgKVxuXHR7XG5cdFx0c3RyaW5nID0gc3RyaW5nLnN1YnN0cigxLCBzdHJpbmcubGVuZ3RoIClcblx0fVxuXG5cdHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGFqYXhfdG9nZ2xlX2dyb3VwKG9iaixpZClcbntcbiAgICB2YXIgdmlzaWJsZSA9IDA7XG5cbiAgICBpZiAoICQob2JqKS5oYXNDbGFzcygnaWNvbi1leWUtb2ZmJykgKVxuICAgIHtcbiAgICAgICAgdmlzaWJsZSA9IDE7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHZpc2libGUgPSAwO1xuICAgIH1cblxuICAgICQob2JqKS5hcHBlbmQoJzxpIGNsYXNzPVwibG9hZGluZ1wiPjwvaT4nKTtcblxuICAgICQucG9zdCgnLycgKyBBRE1JTl9ESVIgKyAnL2FqYXgvbW9kdWxlcy8nLCB7IGFjdGlvbjogXCJkZXZpc2libGVcIiwgaWQ6IGlkLCB2aXNpYmxlOiB2aXNpYmxlIH0sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBpZiAoIGRhdGEgPT0gMSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggJChvYmopLmhhc0NsYXNzKCdpY29uLWV5ZS1vZmYnKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJChvYmopLnJlbW92ZUNsYXNzKCdpY29uLWV5ZS1vZmYnKS5hZGRDbGFzcygnaWNvbi1leWUnKS5odG1sKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQob2JqKS5yZW1vdmVDbGFzcygnaWNvbi1leWUnKS5hZGRDbGFzcygnaWNvbi1leWUtb2ZmJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlX21lbnUob2JqLGlkKVxue1xuXHQkKG9iaikudG9nZ2xlQ2xhc3MoXCJtaW51c1wiKS50b2dnbGVDbGFzcyhcInBsdXNcIikucGFyZW50KCk7XG5cdCQoXCIjaXRlbVwiK2lkKS50b2dnbGUoKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlX3NtYWxsX3Bob3RvKGlkKXtcbiAgICAkKFwiI1wiK2lkKS50b2dnbGUoKTtcbn1cblxuZnVuY3Rpb24gaGlkZUZpZWxkKGlkKXtcbiAgICB0aXRsZSA9ICQoXCIjZG9jc19cIitpZCtcIiAudGl0bGVfaW5cIikudmFsKCk7XG4gICAgb3JkID0gJChcIiNkb2NzX1wiK2lkK1wiIC5vcmRfaW5cIikudmFsKCk7XG5cbiAgICAkKFwiI2RvY3NfXCIraWQrXCIgLnRpdGxlX2ZcIikuZW1wdHkoKS5hcHBlbmQodGl0bGUpO1xuICAgICQoXCIjZG9jc19cIitpZCtcIiAub3JkX2ZcIikuZW1wdHkoKS5hcHBlbmQob3JkKTtcbiAgICAkKFwiI2RvY3NfXCIraWQrXCIgLmJ1dF9zYXZlXCIpLmhpZGUoKTtcbiAgICAkKFwiI2RvY3NfXCIraWQrXCIgLmN0cl9lZGl0XCIpLnNob3coKTtcbn1cblxuZnVuY3Rpb24gRWRpdERvY3MoaWQpe1xuICAgICQoXCIjZG9jc19cIitpZCtcIiAuYnV0X3NhdmVcIikuc2hvdygpO1xuICAgICQoXCIjZG9jc19cIitpZCtcIiAuY3RyX2VkaXRcIikuaGlkZSgpO1xuXG4gICAgY3Vycl92YWx1ZSA9ICQoXCIjZG9jc19cIitpZCtcIiAudGl0bGVfZlwiKS50ZXh0KCk7XG4gICAgJChcIiNkb2NzX1wiK2lkK1wiIC50aXRsZV9mXCIpLmVtcHR5KCkuYXBwZW5kKFwiPGlucHV0IHR5cGU9J3RleHQnIHZhbHVlPSdcIitjdXJyX3ZhbHVlK1wiJyBuYW1lPSd0aXRsZScgY2xhc3M9J2JvcmQgcGFkZCB3MTAwIHRpdGxlX2luJyAvPlwiKTtcbiAgICBjdXJyX3ZhbHVlID0gJChcIiNkb2NzX1wiK2lkK1wiIC5vcmRfZlwiKS50ZXh0KCk7XG4gICAgJChcIiNkb2NzX1wiK2lkK1wiIC5vcmRfZlwiKS5lbXB0eSgpLmFwcGVuZChcIjxpbnB1dCB0eXBlPSd0ZXh0JyB2YWx1ZT0nXCIrY3Vycl92YWx1ZStcIicgbmFtZT0nb3JkJyBjbGFzcz0nYm9yZCBwYWRkIHcyMCBvcmRfaW4nIC8+XCIpO1xuXG4gICAgJChcIiNkb2NzX1wiK2lkK1wiIC50aXRsZV9pblwiKS5mb2N1cygpO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gU2F2ZURvY3MoaWQpe1xuICAgIHRpdGxlID0gJChcIiNkb2NzX1wiK2lkK1wiIC50aXRsZV9pblwiKS52YWwoKTtcbiAgICBvcmQgPSAkKFwiI2RvY3NfXCIraWQrXCIgLm9yZF9pblwiKS52YWwoKTtcblxuICAgIGlmICghdGl0bGUpIHtcbiAgICAgICAgYWxlcnQoXCLQn9GD0YHRgtC+0LUg0LjQvNGPINC00L7QutGD0LzQtdC90YLQsFwiKTtcbiAgICAgICAgaGlkZUZpZWxkKGlkKTtcbiAgICB9XG5cbiAgICAkLnBvc3QoXG4gICAgICAgICcvJyArIEFETUlOX0RJUiArICcvYWpheC9kb2N1bWVudC8nLFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDpcImRvY3VtZW50X2VkaXRcIixcbiAgICAgICAgICAgIGRvY3NpZDppZCxcbiAgICAgICAgICAgIHRpdGxlOnRpdGxlLFxuICAgICAgICAgICAgb3JkOm9yZFxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGFsZXJ0KCfQlNCw0L3QvdGL0LUg0L7QsdC90L7QstC70LXQvdGLJyk7XG4gICAgICAgICAgICBoaWRlRmllbGQoaWQpO1xuICAgICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIERlbERvY3MoaWQpe1xuICAgIGlmIChjcC5kaWFsb2coJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMPycpKXtcbiAgICAgICAgJC5wb3N0KFxuICAgICAgICAgICAgJy8nICsgQURNSU5fRElSICsgJy9hamF4L2RvY3VtZW50LycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6XCJkb2N1bWVudF9kZWxcIixcbiAgICAgICAgICAgICAgICBkb2NzaWQ6aWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YT4wKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjZG9jc19cIitpZCkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGFsZXJ0KCfQvtGI0LjQsdC60LAg0L7QsdC90L7QstC70LXQvdC40Y8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwYWdlX3VwZGF0ZSggaXRlbV9pZCApXG57XG4gICAgJC5wb3N0KCcvJyArIEFETUlOX0RJUiArICcvYWpheC9kb2N1bWVudC8nLFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDpcInVwZGF0ZVwiLCBwb3N0X2lkOml0ZW1faWRcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB2YXIganNvbiA9IGV2YWwoIFwiKFwiICsgZGF0YSArIFwiKVwiICk7XG4gICAgICAgICAgICBwYXJzZU1zZygganNvbiAsIFwiZmlsZV9kb2NzXCIgKTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1zZyhtc2csb2JqKXtcbiAgICAkKFwiI1wiK29iaitcIiAudXBsb2FkZmlsZXNcIikuZW1wdHkoKTtcbiAgICAkKFwiI1wiK29iaitcIiBpbnB1dDpmaWxlXCIpLmF0dHIoe1widmFsdWVcIjpcIlwifSk7XG5cbiAgICBzdHIgPSAnPHRhYmxlIHN0eWxlPVwibWFyZ2luLWJvdHRvbToxMHB4O3dpZHRoOjgwJVwiPjx0cj5cXG48dGQgY2xhc3M9XCJoIHcxMDBcIj7QlNC+0LrRg9C80LXQvdGCPC90ZD5cXG48dGQgY2xhc3M9XCJoXCI+0KDQsNC30LzQtdGAPC90ZD5cXG48dGQgY2xhc3M9XCJoXCI+0KPQtNCw0LvQuNGC0Yw8L3RkPjwvdHI+XFxuJztcbiAgICB2YXIgaSA9IDA7XG4gICAgJC5lYWNoKCBtc2csIGZ1bmN0aW9uKGssdikge1xuICAgICAgICBpZiAoIGkgJSAyICE9IDAgKSBvZGQgPSBcIm9kZCBcIjtcbiAgICAgICAgZWxzZSBvZGQgPSBcIlwiO1xuICAgICAgICBzdHIgKz0gJzx0cj5cXG48dGQgY2xhc3M9XCInICsgb2RkICsgJ1wiPjxhIGhyZWY9XCInICsgdi5zeXNfbmFtZSArICdcIiB0aXRsZT1cIlwiIHRhcmdldD1cIl9ibGFua1wiPicgKyB2LnRpdGxlICsgJzwvYT48L3RkPlxcbic7XG4gICAgICAgIHN0ciArPSAnPHRkIGNsYXNzPVwiJyArIG9kZCArICdyXCI+ICcgKyB2LnNpemUgKyAnPC90ZD5cXG4nO1xuICAgICAgICBzdHIgKz0gJzx0ZCBjbGFzcz1cImFjdGlvbnNcIj48YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJyZXR1cm4gTW9kdWxlLmFqYXhGaWxlRGVsZXRlKCcgKyB2LmlkICsgJyxcXCcnICsgb2JqICsgJ1xcJyk7XCIgY2xhc3M9XCJjdHJfYSBjdHJfZGVsIG1hcmdpblwiIHRpdGxlPVwi0KPQtNCw0LvQuNGC0YxcIiBvbmNsaWNrPVwicmV0dXJuIGNvbmZpcm0oXFwn0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Yw/XFwnKVwiPjwvYT48L3RkPlxcbjwvdHI+XFxuJztcbiAgICAgICAgaSsrO1xuICAgIH0pO1xuICAgIHN0ciArPSAnPC90YWJsZT4nXG4gICAgJChcIiNcIitvYmorXCIgLnVwbG9hZGZpbGVzXCIpLmFwcGVuZChzdHIpO1xufVxuXG5mdW5jdGlvbiBhamF4RmlsZURvY3NVcGxvYWQoZG9jc19ncm91cF9pZCl7XG5cbn1cblxuZnVuY3Rpb24gc2NyZWVuaW5nKCBzdHIgKSB7XG4gICAgdmFyIHJlZz0vXCIvZztcbiAgICB2YXIgcmVzdWx0PXN0ci5yZXBsYWNlKHJlZywgXCImcXVvdDtcIiApO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==

'use strict';

/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
;(function ($, window, document, undefined) {
    var hasTouch = 'ontouchstart' in document;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = function () {
        var el = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    }();

    var defaults = {
        listNodeName: 'ol',
        itemNodeName: 'li',
        rootClass: 'dd',
        listClass: 'dd-list',
        itemClass: 'dd-item',
        dragClass: 'dd-dragel',
        handleClass: 'dd-handle',
        collapsedClass: 'dd-collapsed',
        placeClass: 'dd-placeholder',
        noDragClass: 'dd-nodrag',
        emptyClass: 'dd-empty',
        expandBtnHTML: '<button data-action="expand" type="button" class="dd-button dd-button__expand"></button>',
        collapseBtnHTML: '<button data-action="collapse" type="button" class="dd-button dd-button__collapse"></button>',
        group: 0,
        maxDepth: 5,
        threshold: 20,
        dragStop: null,
        afterExpand: null,
        afterCollapse: null
    };

    function Plugin(element, options) {
        this.w = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function init() {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function (k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function (e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            var onStartEvent = function onStartEvent(e) {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function onMoveEvent(e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function onEndEvent(e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);
        },

        serialize: function serialize() {
            var data,
                depth = 0,
                list = this;
            step = function (_step) {
                function step(_x, _x2) {
                    return _step.apply(this, arguments);
                }

                step.toString = function () {
                    return _step.toString();
                };

                return step;
            }(function (level, depth) {
                var array = [],
                    items = level.children(list.options.itemNodeName);
                items.each(function () {
                    var li = $(this),
                        item = $.extend({}, li.data()),
                        sub = li.children(list.options.listNodeName);
                    if (sub.length) {
                        item.children = step(sub, depth + 1);
                    }
                    array.push(item);
                });
                return array;
            });
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function serialise() {
            return this.serialize();
        },

        reset: function reset() {
            this.mouse = {
                offsetX: 0,
                offsetY: 0,
                startX: 0,
                startY: 0,
                lastX: 0,
                lastY: 0,
                nowX: 0,
                nowY: 0,
                distX: 0,
                distY: 0,
                dirAx: 0,
                dirX: 0,
                dirY: 0,
                lastDirX: 0,
                lastDirY: 0,
                distAxX: 0,
                distAxY: 0
            };
            this.isTouch = false;
            this.moving = false;
            this.dragEl = null;
            this.dragRootEl = null;
            this.dragDepth = 0;
            this.hasNewRoot = false;
            this.pointEl = null;
        },

        expandItem: function expandItem(li) {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();

            if (typeof this.options.afterExpand == 'function') {
                this.options.afterExpand(li);
            }
        },

        collapseItem: function collapseItem(li) {
            var lists = li.children(this.options.listNodeName);

            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }

            if (typeof this.options.afterCollapse == 'function') {
                this.options.afterCollapse(li);
            }
        },

        expandAll: function expandAll() {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.expandItem($(this));
            });
        },

        collapseAll: function collapseAll() {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.collapseItem($(this));
            });
        },

        setParent: function setParent(li) {
            if (li.children(this.options.listNodeName).length) {
                if (!li.find('.dd-button__expand').length) {
                    li.prepend($(this.options.expandBtnHTML));
                }

                if (!li.find('.dd-button__collapse').length) {
                    li.prepend($(this.options.collapseBtnHTML));
                }
            }

            if ($(li[0]).hasClass('dd-collapsed')) {
                li.children('[data-action="collapse"]').hide();
            } else {
                li.children('[data-action="expand"]').hide();
            }
        },

        unsetParent: function unsetParent(li) {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function dragStart(e) {
            var mouse = this.mouse,
                target = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left': e.pageX - mouse.offsetX,
                'top': e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i,
                depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function dragStop(e) {
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();

            if (typeof this.options.dragStop == 'function') {
                this.options.dragStop(el);
            }
        },

        dragMove: function dragMove(e) {
            var list,
                parent,
                prev,
                next,
                depth,
                opt = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left': e.pageX - mouse.offsetX,
                'top': e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX = e.pageX;
            mouse.nowY = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < this.pointEl.offset().top + this.pointEl.height() / 2;
                parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                } else if (before) {
                    this.pointEl.before(this.placeEl);
                } else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function (params) {
        var lists = this,
            retval = this;

        lists.each(function () {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };
})(window.jQuery || window.Zepto, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5lc3RhYmxlLmpzIl0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsImhhc1RvdWNoIiwiaGFzUG9pbnRlckV2ZW50cyIsImVsIiwiY3JlYXRlRWxlbWVudCIsImRvY0VsIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwiYXBwZW5kQ2hpbGQiLCJzdXBwb3J0cyIsImdldENvbXB1dGVkU3R5bGUiLCJyZW1vdmVDaGlsZCIsImRlZmF1bHRzIiwibGlzdE5vZGVOYW1lIiwiaXRlbU5vZGVOYW1lIiwicm9vdENsYXNzIiwibGlzdENsYXNzIiwiaXRlbUNsYXNzIiwiZHJhZ0NsYXNzIiwiaGFuZGxlQ2xhc3MiLCJjb2xsYXBzZWRDbGFzcyIsInBsYWNlQ2xhc3MiLCJub0RyYWdDbGFzcyIsImVtcHR5Q2xhc3MiLCJleHBhbmRCdG5IVE1MIiwiY29sbGFwc2VCdG5IVE1MIiwiZ3JvdXAiLCJtYXhEZXB0aCIsInRocmVzaG9sZCIsImRyYWdTdG9wIiwiYWZ0ZXJFeHBhbmQiLCJhZnRlckNvbGxhcHNlIiwiUGx1Z2luIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJ3IiwiZXh0ZW5kIiwiaW5pdCIsInByb3RvdHlwZSIsImxpc3QiLCJyZXNldCIsImRhdGEiLCJwbGFjZUVsIiwiZWFjaCIsImZpbmQiLCJrIiwic2V0UGFyZW50Iiwib24iLCJlIiwiZHJhZ0VsIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImFjdGlvbiIsIml0ZW0iLCJwYXJlbnQiLCJjb2xsYXBzZUl0ZW0iLCJleHBhbmRJdGVtIiwib25TdGFydEV2ZW50IiwiaGFuZGxlIiwiaGFzQ2xhc3MiLCJjbG9zZXN0IiwibGVuZ3RoIiwiaXNUb3VjaCIsInRlc3QiLCJ0eXBlIiwidG91Y2hlcyIsInByZXZlbnREZWZhdWx0IiwiZHJhZ1N0YXJ0Iiwib25Nb3ZlRXZlbnQiLCJkcmFnTW92ZSIsIm9uRW5kRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic2VyaWFsaXplIiwiZGVwdGgiLCJzdGVwIiwibGV2ZWwiLCJhcnJheSIsIml0ZW1zIiwiY2hpbGRyZW4iLCJsaSIsInN1YiIsInB1c2giLCJmaXJzdCIsInNlcmlhbGlzZSIsIm1vdXNlIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJzdGFydFgiLCJzdGFydFkiLCJsYXN0WCIsImxhc3RZIiwibm93WCIsIm5vd1kiLCJkaXN0WCIsImRpc3RZIiwiZGlyQXgiLCJkaXJYIiwiZGlyWSIsImxhc3REaXJYIiwibGFzdERpclkiLCJkaXN0QXhYIiwiZGlzdEF4WSIsIm1vdmluZyIsImRyYWdSb290RWwiLCJkcmFnRGVwdGgiLCJoYXNOZXdSb290IiwicG9pbnRFbCIsInJlbW92ZUNsYXNzIiwiaGlkZSIsInNob3ciLCJsaXN0cyIsImFkZENsYXNzIiwiZXhwYW5kQWxsIiwiY29sbGFwc2VBbGwiLCJwcmVwZW5kIiwidW5zZXRQYXJlbnQiLCJyZW1vdmUiLCJkcmFnSXRlbSIsImNzcyIsImhlaWdodCIsInBhZ2VYIiwib2Zmc2V0IiwibGVmdCIsInBhZ2VZIiwidG9wIiwid2lkdGgiLCJhZnRlciIsInBhcmVudE5vZGUiLCJhcHBlbmRUbyIsImJvZHkiLCJhcHBlbmQiLCJpIiwicGFyZW50cyIsInJlcGxhY2VXaXRoIiwidHJpZ2dlciIsInByZXYiLCJuZXh0Iiwib3B0IiwibmV3QXgiLCJNYXRoIiwiYWJzIiwibGFzdCIsImlzRW1wdHkiLCJ2aXNpYmlsaXR5IiwiZWxlbWVudEZyb21Qb2ludCIsInNjcm9sbExlZnQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInBvaW50RWxSb290IiwiaXNOZXdSb290IiwiYmVmb3JlIiwiZm4iLCJuZXN0YWJsZSIsInBhcmFtcyIsInJldHZhbCIsInBsdWdpbiIsIkRhdGUiLCJnZXRUaW1lIiwialF1ZXJ5IiwiWmVwdG8iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFJQSxDQUFDLENBQUMsVUFBU0EsQ0FBVCxFQUFZQyxNQUFaLEVBQW9CQyxRQUFwQixFQUE4QkMsU0FBOUIsRUFDRjtBQUNJLFFBQUlDLFdBQVcsa0JBQWtCRixRQUFqQzs7QUFFQTs7Ozs7QUFLQSxRQUFJRyxtQkFBb0IsWUFDeEI7QUFDSSxZQUFJQyxLQUFRSixTQUFTSyxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFBQSxZQUNJQyxRQUFRTixTQUFTTyxlQURyQjtBQUVBLFlBQUksRUFBRSxtQkFBbUJILEdBQUdJLEtBQXhCLENBQUosRUFBb0M7QUFDaEMsbUJBQU8sS0FBUDtBQUNIO0FBQ0RKLFdBQUdJLEtBQUgsQ0FBU0MsYUFBVCxHQUF5QixNQUF6QjtBQUNBTCxXQUFHSSxLQUFILENBQVNDLGFBQVQsR0FBeUIsR0FBekI7QUFDQUgsY0FBTUksV0FBTixDQUFrQk4sRUFBbEI7QUFDQSxZQUFJTyxXQUFXWixPQUFPYSxnQkFBUCxJQUEyQmIsT0FBT2EsZ0JBQVAsQ0FBd0JSLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDSyxhQUFoQyxLQUFrRCxNQUE1RjtBQUNBSCxjQUFNTyxXQUFOLENBQWtCVCxFQUFsQjtBQUNBLGVBQU8sQ0FBQyxDQUFDTyxRQUFUO0FBQ0gsS0Fic0IsRUFBdkI7O0FBZUEsUUFBSUcsV0FBVztBQUNQQyxzQkFBa0IsSUFEWDtBQUVQQyxzQkFBa0IsSUFGWDtBQUdQQyxtQkFBa0IsSUFIWDtBQUlQQyxtQkFBa0IsU0FKWDtBQUtQQyxtQkFBa0IsU0FMWDtBQU1QQyxtQkFBa0IsV0FOWDtBQU9QQyxxQkFBa0IsV0FQWDtBQVFQQyx3QkFBa0IsY0FSWDtBQVNQQyxvQkFBa0IsZ0JBVFg7QUFVUEMscUJBQWtCLFdBVlg7QUFXUEMsb0JBQWtCLFVBWFg7QUFZUEMsdUJBQWtCLDBGQVpYO0FBYVBDLHlCQUFrQiw4RkFiWDtBQWNQQyxlQUFrQixDQWRYO0FBZVBDLGtCQUFrQixDQWZYO0FBZ0JQQyxtQkFBa0IsRUFoQlg7QUFpQlBDLGtCQUFrQixJQWpCWDtBQWtCUEMscUJBQWtCLElBbEJYO0FBbUJQQyx1QkFBa0I7QUFuQlgsS0FBZjs7QUFzQkEsYUFBU0MsTUFBVCxDQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCLEVBQ0E7QUFDSSxhQUFLQyxDQUFMLEdBQVV2QyxFQUFFRSxRQUFGLENBQVY7QUFDQSxhQUFLSSxFQUFMLEdBQVVOLEVBQUVxQyxPQUFGLENBQVY7QUFDQSxhQUFLQyxPQUFMLEdBQWV0QyxFQUFFd0MsTUFBRixDQUFTLEVBQVQsRUFBYXhCLFFBQWIsRUFBdUJzQixPQUF2QixDQUFmO0FBQ0EsYUFBS0csSUFBTDtBQUNIOztBQUVETCxXQUFPTSxTQUFQLEdBQW1COztBQUVmRCxjQUFNLGdCQUNOO0FBQ0ksZ0JBQUlFLE9BQU8sSUFBWDs7QUFFQUEsaUJBQUtDLEtBQUw7O0FBRUFELGlCQUFLckMsRUFBTCxDQUFRdUMsSUFBUixDQUFhLGdCQUFiLEVBQStCLEtBQUtQLE9BQUwsQ0FBYVIsS0FBNUM7O0FBRUFhLGlCQUFLRyxPQUFMLEdBQWU5QyxFQUFFLGlCQUFpQjJDLEtBQUtMLE9BQUwsQ0FBYWIsVUFBOUIsR0FBMkMsS0FBN0MsQ0FBZjs7QUFFQXpCLGNBQUUrQyxJQUFGLENBQU8sS0FBS3pDLEVBQUwsQ0FBUTBDLElBQVIsQ0FBYUwsS0FBS0wsT0FBTCxDQUFhcEIsWUFBMUIsQ0FBUCxFQUFnRCxVQUFTK0IsQ0FBVCxFQUFZM0MsRUFBWixFQUFnQjtBQUM1RHFDLHFCQUFLTyxTQUFMLENBQWVsRCxFQUFFTSxFQUFGLENBQWY7QUFDSCxhQUZEOztBQUlBcUMsaUJBQUtyQyxFQUFMLENBQVE2QyxFQUFSLENBQVcsT0FBWCxFQUFvQixRQUFwQixFQUE4QixVQUFTQyxDQUFULEVBQVk7QUFDdEMsb0JBQUlULEtBQUtVLE1BQVQsRUFBaUI7QUFDYjtBQUNIO0FBQ0Qsb0JBQUlDLFNBQVN0RCxFQUFFb0QsRUFBRUcsYUFBSixDQUFiO0FBQUEsb0JBQ0lDLFNBQVNGLE9BQU9ULElBQVAsQ0FBWSxRQUFaLENBRGI7QUFBQSxvQkFFSVksT0FBU0gsT0FBT0ksTUFBUCxDQUFjZixLQUFLTCxPQUFMLENBQWFwQixZQUEzQixDQUZiO0FBR0Esb0JBQUlzQyxXQUFXLFVBQWYsRUFBMkI7QUFDdkJiLHlCQUFLZ0IsWUFBTCxDQUFrQkYsSUFBbEI7QUFDSDtBQUNELG9CQUFJRCxXQUFXLFFBQWYsRUFBeUI7QUFDckJiLHlCQUFLaUIsVUFBTCxDQUFnQkgsSUFBaEI7QUFDSDtBQUNKLGFBYkQ7O0FBZUEsZ0JBQUlJLGVBQWUsU0FBZkEsWUFBZSxDQUFTVCxDQUFULEVBQ25CO0FBQ0ksb0JBQUlVLFNBQVM5RCxFQUFFb0QsRUFBRUUsTUFBSixDQUFiO0FBQ0Esb0JBQUksQ0FBQ1EsT0FBT0MsUUFBUCxDQUFnQnBCLEtBQUtMLE9BQUwsQ0FBYWYsV0FBN0IsQ0FBTCxFQUFnRDtBQUM1Qyx3QkFBSXVDLE9BQU9FLE9BQVAsQ0FBZSxNQUFNckIsS0FBS0wsT0FBTCxDQUFhWixXQUFsQyxFQUErQ3VDLE1BQW5ELEVBQTJEO0FBQ3ZEO0FBQ0g7QUFDREgsNkJBQVNBLE9BQU9FLE9BQVAsQ0FBZSxNQUFNckIsS0FBS0wsT0FBTCxDQUFhZixXQUFsQyxDQUFUO0FBQ0g7O0FBRUQsb0JBQUksQ0FBQ3VDLE9BQU9HLE1BQVIsSUFBa0J0QixLQUFLVSxNQUEzQixFQUFtQztBQUMvQjtBQUNIOztBQUVEVixxQkFBS3VCLE9BQUwsR0FBZSxTQUFTQyxJQUFULENBQWNmLEVBQUVnQixJQUFoQixDQUFmO0FBQ0Esb0JBQUl6QixLQUFLdUIsT0FBTCxJQUFnQmQsRUFBRWlCLE9BQUYsQ0FBVUosTUFBVixLQUFxQixDQUF6QyxFQUE0QztBQUN4QztBQUNIOztBQUVEYixrQkFBRWtCLGNBQUY7QUFDQTNCLHFCQUFLNEIsU0FBTCxDQUFlbkIsRUFBRWlCLE9BQUYsR0FBWWpCLEVBQUVpQixPQUFGLENBQVUsQ0FBVixDQUFaLEdBQTJCakIsQ0FBMUM7QUFDSCxhQXJCRDs7QUF1QkEsZ0JBQUlvQixjQUFjLFNBQWRBLFdBQWMsQ0FBU3BCLENBQVQsRUFDbEI7QUFDSSxvQkFBSVQsS0FBS1UsTUFBVCxFQUFpQjtBQUNiRCxzQkFBRWtCLGNBQUY7QUFDQTNCLHlCQUFLOEIsUUFBTCxDQUFjckIsRUFBRWlCLE9BQUYsR0FBWWpCLEVBQUVpQixPQUFGLENBQVUsQ0FBVixDQUFaLEdBQTJCakIsQ0FBekM7QUFDSDtBQUNKLGFBTkQ7O0FBUUEsZ0JBQUlzQixhQUFhLFNBQWJBLFVBQWEsQ0FBU3RCLENBQVQsRUFDakI7QUFDSSxvQkFBSVQsS0FBS1UsTUFBVCxFQUFpQjtBQUNiRCxzQkFBRWtCLGNBQUY7QUFDQTNCLHlCQUFLVixRQUFMLENBQWNtQixFQUFFaUIsT0FBRixHQUFZakIsRUFBRWlCLE9BQUYsQ0FBVSxDQUFWLENBQVosR0FBMkJqQixDQUF6QztBQUNIO0FBQ0osYUFORDs7QUFRQSxnQkFBSWhELFFBQUosRUFBYztBQUNWdUMscUJBQUtyQyxFQUFMLENBQVEsQ0FBUixFQUFXcUUsZ0JBQVgsQ0FBNEIsWUFBNUIsRUFBMENkLFlBQTFDLEVBQXdELEtBQXhEO0FBQ0E1RCx1QkFBTzBFLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDSCxXQUFyQyxFQUFrRCxLQUFsRDtBQUNBdkUsdUJBQU8wRSxnQkFBUCxDQUF3QixVQUF4QixFQUFvQ0QsVUFBcEMsRUFBZ0QsS0FBaEQ7QUFDQXpFLHVCQUFPMEUsZ0JBQVAsQ0FBd0IsYUFBeEIsRUFBdUNELFVBQXZDLEVBQW1ELEtBQW5EO0FBQ0g7O0FBRUQvQixpQkFBS3JDLEVBQUwsQ0FBUTZDLEVBQVIsQ0FBVyxXQUFYLEVBQXdCVSxZQUF4QjtBQUNBbEIsaUJBQUtKLENBQUwsQ0FBT1ksRUFBUCxDQUFVLFdBQVYsRUFBdUJxQixXQUF2QjtBQUNBN0IsaUJBQUtKLENBQUwsQ0FBT1ksRUFBUCxDQUFVLFNBQVYsRUFBcUJ1QixVQUFyQjtBQUVILFNBakZjOztBQW1GZkUsbUJBQVcscUJBQ1g7QUFDSSxnQkFBSS9CLElBQUo7QUFBQSxnQkFDSWdDLFFBQVEsQ0FEWjtBQUFBLGdCQUVJbEMsT0FBUSxJQUZaO0FBR0ltQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxjQUFRLFVBQVNDLEtBQVQsRUFBZ0JGLEtBQWhCLEVBQ1I7QUFDSSxvQkFBSUcsUUFBUSxFQUFaO0FBQUEsb0JBQ0lDLFFBQVFGLE1BQU1HLFFBQU4sQ0FBZXZDLEtBQUtMLE9BQUwsQ0FBYXBCLFlBQTVCLENBRFo7QUFFQStELHNCQUFNbEMsSUFBTixDQUFXLFlBQ1g7QUFDSSx3QkFBSW9DLEtBQU9uRixFQUFFLElBQUYsQ0FBWDtBQUFBLHdCQUNJeUQsT0FBT3pELEVBQUV3QyxNQUFGLENBQVMsRUFBVCxFQUFhMkMsR0FBR3RDLElBQUgsRUFBYixDQURYO0FBQUEsd0JBRUl1QyxNQUFPRCxHQUFHRCxRQUFILENBQVl2QyxLQUFLTCxPQUFMLENBQWFyQixZQUF6QixDQUZYO0FBR0Esd0JBQUltRSxJQUFJbkIsTUFBUixFQUFnQjtBQUNaUiw2QkFBS3lCLFFBQUwsR0FBZ0JKLEtBQUtNLEdBQUwsRUFBVVAsUUFBUSxDQUFsQixDQUFoQjtBQUNIO0FBQ0RHLDBCQUFNSyxJQUFOLENBQVc1QixJQUFYO0FBQ0gsaUJBVEQ7QUFVQSx1QkFBT3VCLEtBQVA7QUFDSCxhQWZEO0FBZ0JKbkMsbUJBQU9pQyxLQUFLbkMsS0FBS3JDLEVBQUwsQ0FBUTBDLElBQVIsQ0FBYUwsS0FBS0wsT0FBTCxDQUFhckIsWUFBMUIsRUFBd0NxRSxLQUF4QyxFQUFMLEVBQXNEVCxLQUF0RCxDQUFQO0FBQ0EsbUJBQU9oQyxJQUFQO0FBQ0gsU0ExR2M7O0FBNEdmMEMsbUJBQVcscUJBQ1g7QUFDSSxtQkFBTyxLQUFLWCxTQUFMLEVBQVA7QUFDSCxTQS9HYzs7QUFpSGZoQyxlQUFPLGlCQUNQO0FBQ0ksaUJBQUs0QyxLQUFMLEdBQWE7QUFDVEMseUJBQVksQ0FESDtBQUVUQyx5QkFBWSxDQUZIO0FBR1RDLHdCQUFZLENBSEg7QUFJVEMsd0JBQVksQ0FKSDtBQUtUQyx1QkFBWSxDQUxIO0FBTVRDLHVCQUFZLENBTkg7QUFPVEMsc0JBQVksQ0FQSDtBQVFUQyxzQkFBWSxDQVJIO0FBU1RDLHVCQUFZLENBVEg7QUFVVEMsdUJBQVksQ0FWSDtBQVdUQyx1QkFBWSxDQVhIO0FBWVRDLHNCQUFZLENBWkg7QUFhVEMsc0JBQVksQ0FiSDtBQWNUQywwQkFBWSxDQWRIO0FBZVRDLDBCQUFZLENBZkg7QUFnQlRDLHlCQUFZLENBaEJIO0FBaUJUQyx5QkFBWTtBQWpCSCxhQUFiO0FBbUJBLGlCQUFLdkMsT0FBTCxHQUFrQixLQUFsQjtBQUNBLGlCQUFLd0MsTUFBTCxHQUFrQixLQUFsQjtBQUNBLGlCQUFLckQsTUFBTCxHQUFrQixJQUFsQjtBQUNBLGlCQUFLc0QsVUFBTCxHQUFrQixJQUFsQjtBQUNBLGlCQUFLQyxTQUFMLEdBQWtCLENBQWxCO0FBQ0EsaUJBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxpQkFBS0MsT0FBTCxHQUFrQixJQUFsQjtBQUNILFNBN0ljOztBQStJZmxELG9CQUFZLG9CQUFTdUIsRUFBVCxFQUNaO0FBQ0lBLGVBQUc0QixXQUFILENBQWUsS0FBS3pFLE9BQUwsQ0FBYWQsY0FBNUI7QUFDQTJELGVBQUdELFFBQUgsQ0FBWSx3QkFBWixFQUFzQzhCLElBQXRDO0FBQ0E3QixlQUFHRCxRQUFILENBQVksMEJBQVosRUFBd0MrQixJQUF4QztBQUNBOUIsZUFBR0QsUUFBSCxDQUFZLEtBQUs1QyxPQUFMLENBQWFyQixZQUF6QixFQUF1Q2dHLElBQXZDOztBQUVBLGdCQUFJLE9BQU8sS0FBSzNFLE9BQUwsQ0FBYUosV0FBcEIsSUFBbUMsVUFBdkMsRUFDQTtBQUNJLHFCQUFLSSxPQUFMLENBQWFKLFdBQWIsQ0FBeUJpRCxFQUF6QjtBQUNIO0FBQ0osU0ExSmM7O0FBNEpmeEIsc0JBQWMsc0JBQVN3QixFQUFULEVBQ2Q7QUFDSSxnQkFBSStCLFFBQVEvQixHQUFHRCxRQUFILENBQVksS0FBSzVDLE9BQUwsQ0FBYXJCLFlBQXpCLENBQVo7O0FBRUEsZ0JBQUlpRyxNQUFNakQsTUFBVixFQUFrQjtBQUNka0IsbUJBQUdnQyxRQUFILENBQVksS0FBSzdFLE9BQUwsQ0FBYWQsY0FBekI7QUFDQTJELG1CQUFHRCxRQUFILENBQVksMEJBQVosRUFBd0M4QixJQUF4QztBQUNBN0IsbUJBQUdELFFBQUgsQ0FBWSx3QkFBWixFQUFzQytCLElBQXRDO0FBQ0E5QixtQkFBR0QsUUFBSCxDQUFZLEtBQUs1QyxPQUFMLENBQWFyQixZQUF6QixFQUF1QytGLElBQXZDO0FBQ0g7O0FBRUQsZ0JBQUksT0FBTyxLQUFLMUUsT0FBTCxDQUFhSCxhQUFwQixJQUFxQyxVQUF6QyxFQUNBO0FBQ0kscUJBQUtHLE9BQUwsQ0FBYUgsYUFBYixDQUEyQmdELEVBQTNCO0FBQ0g7QUFDSixTQTNLYzs7QUE2S2ZpQyxtQkFBVyxxQkFDWDtBQUNJLGdCQUFJekUsT0FBTyxJQUFYO0FBQ0FBLGlCQUFLckMsRUFBTCxDQUFRMEMsSUFBUixDQUFhTCxLQUFLTCxPQUFMLENBQWFwQixZQUExQixFQUF3QzZCLElBQXhDLENBQTZDLFlBQVc7QUFDcERKLHFCQUFLaUIsVUFBTCxDQUFnQjVELEVBQUUsSUFBRixDQUFoQjtBQUNILGFBRkQ7QUFHSCxTQW5MYzs7QUFxTGZxSCxxQkFBYSx1QkFDYjtBQUNJLGdCQUFJMUUsT0FBTyxJQUFYO0FBQ0FBLGlCQUFLckMsRUFBTCxDQUFRMEMsSUFBUixDQUFhTCxLQUFLTCxPQUFMLENBQWFwQixZQUExQixFQUF3QzZCLElBQXhDLENBQTZDLFlBQVc7QUFDcERKLHFCQUFLZ0IsWUFBTCxDQUFrQjNELEVBQUUsSUFBRixDQUFsQjtBQUNILGFBRkQ7QUFHSCxTQTNMYzs7QUE2TGZrRCxtQkFBVyxtQkFBU2lDLEVBQVQsRUFDWDtBQUNJLGdCQUFJQSxHQUFHRCxRQUFILENBQVksS0FBSzVDLE9BQUwsQ0FBYXJCLFlBQXpCLEVBQXVDZ0QsTUFBM0MsRUFDQTtBQUNJLG9CQUFJLENBQUNrQixHQUFHbkMsSUFBSCxDQUFRLG9CQUFSLEVBQThCaUIsTUFBbkMsRUFDQTtBQUNJa0IsdUJBQUdtQyxPQUFILENBQVd0SCxFQUFFLEtBQUtzQyxPQUFMLENBQWFWLGFBQWYsQ0FBWDtBQUNIOztBQUVELG9CQUFJLENBQUN1RCxHQUFHbkMsSUFBSCxDQUFRLHNCQUFSLEVBQWdDaUIsTUFBckMsRUFDQTtBQUNJa0IsdUJBQUdtQyxPQUFILENBQVd0SCxFQUFFLEtBQUtzQyxPQUFMLENBQWFULGVBQWYsQ0FBWDtBQUNIO0FBQ0o7O0FBRUQsZ0JBQUk3QixFQUFFbUYsR0FBRyxDQUFILENBQUYsRUFBU3BCLFFBQVQsQ0FBa0IsY0FBbEIsQ0FBSixFQUNBO0FBQ0lvQixtQkFBR0QsUUFBSCxDQUFZLDBCQUFaLEVBQXdDOEIsSUFBeEM7QUFDSCxhQUhELE1BSUs7QUFDRDdCLG1CQUFHRCxRQUFILENBQVksd0JBQVosRUFBc0M4QixJQUF0QztBQUNIO0FBQ0osU0FuTmM7O0FBcU5mTyxxQkFBYSxxQkFBU3BDLEVBQVQsRUFDYjtBQUNJQSxlQUFHNEIsV0FBSCxDQUFlLEtBQUt6RSxPQUFMLENBQWFkLGNBQTVCO0FBQ0EyRCxlQUFHRCxRQUFILENBQVksZUFBWixFQUE2QnNDLE1BQTdCO0FBQ0FyQyxlQUFHRCxRQUFILENBQVksS0FBSzVDLE9BQUwsQ0FBYXJCLFlBQXpCLEVBQXVDdUcsTUFBdkM7QUFDSCxTQTFOYzs7QUE0TmZqRCxtQkFBVyxtQkFBU25CLENBQVQsRUFDWDtBQUNJLGdCQUFJb0MsUUFBVyxLQUFLQSxLQUFwQjtBQUFBLGdCQUNJbEMsU0FBV3RELEVBQUVvRCxFQUFFRSxNQUFKLENBRGY7QUFBQSxnQkFFSW1FLFdBQVduRSxPQUFPVSxPQUFQLENBQWUsS0FBSzFCLE9BQUwsQ0FBYXBCLFlBQTVCLENBRmY7O0FBSUEsaUJBQUs0QixPQUFMLENBQWE0RSxHQUFiLENBQWlCLFFBQWpCLEVBQTJCRCxTQUFTRSxNQUFULEVBQTNCOztBQUVBbkMsa0JBQU1DLE9BQU4sR0FBZ0JyQyxFQUFFcUMsT0FBRixLQUFjdEYsU0FBZCxHQUEwQmlELEVBQUVxQyxPQUE1QixHQUFzQ3JDLEVBQUV3RSxLQUFGLEdBQVV0RSxPQUFPdUUsTUFBUCxHQUFnQkMsSUFBaEY7QUFDQXRDLGtCQUFNRSxPQUFOLEdBQWdCdEMsRUFBRXNDLE9BQUYsS0FBY3ZGLFNBQWQsR0FBMEJpRCxFQUFFc0MsT0FBNUIsR0FBc0N0QyxFQUFFMkUsS0FBRixHQUFVekUsT0FBT3VFLE1BQVAsR0FBZ0JHLEdBQWhGO0FBQ0F4QyxrQkFBTUcsTUFBTixHQUFlSCxNQUFNSyxLQUFOLEdBQWN6QyxFQUFFd0UsS0FBL0I7QUFDQXBDLGtCQUFNSSxNQUFOLEdBQWVKLE1BQU1NLEtBQU4sR0FBYzFDLEVBQUUyRSxLQUEvQjs7QUFFQSxpQkFBS3BCLFVBQUwsR0FBa0IsS0FBS3JHLEVBQXZCOztBQUVBLGlCQUFLK0MsTUFBTCxHQUFjckQsRUFBRUUsU0FBU0ssYUFBVCxDQUF1QixLQUFLK0IsT0FBTCxDQUFhckIsWUFBcEMsQ0FBRixFQUFxRGtHLFFBQXJELENBQThELEtBQUs3RSxPQUFMLENBQWFsQixTQUFiLEdBQXlCLEdBQXpCLEdBQStCLEtBQUtrQixPQUFMLENBQWFoQixTQUExRyxDQUFkO0FBQ0EsaUJBQUsrQixNQUFMLENBQVlxRSxHQUFaLENBQWdCLE9BQWhCLEVBQXlCRCxTQUFTUSxLQUFULEVBQXpCOztBQUVBUixxQkFBU1MsS0FBVCxDQUFlLEtBQUtwRixPQUFwQjtBQUNBMkUscUJBQVMsQ0FBVCxFQUFZVSxVQUFaLENBQXVCcEgsV0FBdkIsQ0FBbUMwRyxTQUFTLENBQVQsQ0FBbkM7QUFDQUEscUJBQVNXLFFBQVQsQ0FBa0IsS0FBSy9FLE1BQXZCOztBQUVBckQsY0FBRUUsU0FBU21JLElBQVgsRUFBaUJDLE1BQWpCLENBQXdCLEtBQUtqRixNQUE3QjtBQUNBLGlCQUFLQSxNQUFMLENBQVlxRSxHQUFaLENBQWdCO0FBQ1osd0JBQVN0RSxFQUFFd0UsS0FBRixHQUFVcEMsTUFBTUMsT0FEYjtBQUVaLHVCQUFTckMsRUFBRTJFLEtBQUYsR0FBVXZDLE1BQU1FO0FBRmIsYUFBaEI7QUFJQTtBQUNBLGdCQUFJNkMsQ0FBSjtBQUFBLGdCQUFPMUQsS0FBUDtBQUFBLGdCQUNJSSxRQUFRLEtBQUs1QixNQUFMLENBQVlMLElBQVosQ0FBaUIsS0FBS1YsT0FBTCxDQUFhcEIsWUFBOUIsQ0FEWjtBQUVBLGlCQUFLcUgsSUFBSSxDQUFULEVBQVlBLElBQUl0RCxNQUFNaEIsTUFBdEIsRUFBOEJzRSxHQUE5QixFQUFtQztBQUMvQjFELHdCQUFRN0UsRUFBRWlGLE1BQU1zRCxDQUFOLENBQUYsRUFBWUMsT0FBWixDQUFvQixLQUFLbEcsT0FBTCxDQUFhckIsWUFBakMsRUFBK0NnRCxNQUF2RDtBQUNBLG9CQUFJWSxRQUFRLEtBQUsrQixTQUFqQixFQUE0QjtBQUN4Qix5QkFBS0EsU0FBTCxHQUFpQi9CLEtBQWpCO0FBQ0g7QUFDSjtBQUNKLFNBaFFjOztBQWtRZjVDLGtCQUFVLGtCQUFTbUIsQ0FBVCxFQUNWO0FBQ0ksZ0JBQUk5QyxLQUFLLEtBQUsrQyxNQUFMLENBQVk2QixRQUFaLENBQXFCLEtBQUs1QyxPQUFMLENBQWFwQixZQUFsQyxFQUFnRG9FLEtBQWhELEVBQVQ7QUFDQWhGLGVBQUcsQ0FBSCxFQUFNNkgsVUFBTixDQUFpQnBILFdBQWpCLENBQTZCVCxHQUFHLENBQUgsQ0FBN0I7QUFDQSxpQkFBS3dDLE9BQUwsQ0FBYTJGLFdBQWIsQ0FBeUJuSSxFQUF6Qjs7QUFFQSxpQkFBSytDLE1BQUwsQ0FBWW1FLE1BQVo7QUFDQSxpQkFBS2xILEVBQUwsQ0FBUW9JLE9BQVIsQ0FBZ0IsUUFBaEI7QUFDQSxnQkFBSSxLQUFLN0IsVUFBVCxFQUFxQjtBQUNqQixxQkFBS0YsVUFBTCxDQUFnQitCLE9BQWhCLENBQXdCLFFBQXhCO0FBQ0g7QUFDRCxpQkFBSzlGLEtBQUw7O0FBRUEsZ0JBQUksT0FBTyxLQUFLTixPQUFMLENBQWFMLFFBQXBCLElBQWdDLFVBQXBDLEVBQ0E7QUFDSSxxQkFBS0ssT0FBTCxDQUFhTCxRQUFiLENBQXNCM0IsRUFBdEI7QUFDSDtBQUVKLFNBcFJjOztBQXNSZm1FLGtCQUFVLGtCQUFTckIsQ0FBVCxFQUNWO0FBQ0ksZ0JBQUlULElBQUo7QUFBQSxnQkFBVWUsTUFBVjtBQUFBLGdCQUFrQmlGLElBQWxCO0FBQUEsZ0JBQXdCQyxJQUF4QjtBQUFBLGdCQUE4Qi9ELEtBQTlCO0FBQUEsZ0JBQ0lnRSxNQUFRLEtBQUt2RyxPQURqQjtBQUFBLGdCQUVJa0QsUUFBUSxLQUFLQSxLQUZqQjs7QUFJQSxpQkFBS25DLE1BQUwsQ0FBWXFFLEdBQVosQ0FBZ0I7QUFDWix3QkFBU3RFLEVBQUV3RSxLQUFGLEdBQVVwQyxNQUFNQyxPQURiO0FBRVosdUJBQVNyQyxFQUFFMkUsS0FBRixHQUFVdkMsTUFBTUU7QUFGYixhQUFoQjs7QUFLQTtBQUNBRixrQkFBTUssS0FBTixHQUFjTCxNQUFNTyxJQUFwQjtBQUNBUCxrQkFBTU0sS0FBTixHQUFjTixNQUFNUSxJQUFwQjtBQUNBO0FBQ0FSLGtCQUFNTyxJQUFOLEdBQWMzQyxFQUFFd0UsS0FBaEI7QUFDQXBDLGtCQUFNUSxJQUFOLEdBQWM1QyxFQUFFMkUsS0FBaEI7QUFDQTtBQUNBdkMsa0JBQU1TLEtBQU4sR0FBY1QsTUFBTU8sSUFBTixHQUFhUCxNQUFNSyxLQUFqQztBQUNBTCxrQkFBTVUsS0FBTixHQUFjVixNQUFNUSxJQUFOLEdBQWFSLE1BQU1NLEtBQWpDO0FBQ0E7QUFDQU4sa0JBQU1jLFFBQU4sR0FBaUJkLE1BQU1ZLElBQXZCO0FBQ0FaLGtCQUFNZSxRQUFOLEdBQWlCZixNQUFNYSxJQUF2QjtBQUNBO0FBQ0FiLGtCQUFNWSxJQUFOLEdBQWFaLE1BQU1TLEtBQU4sS0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBcEIsR0FBd0JULE1BQU1TLEtBQU4sR0FBYyxDQUFkLEdBQWtCLENBQWxCLEdBQXNCLENBQUMsQ0FBNUQ7QUFDQVQsa0JBQU1hLElBQU4sR0FBYWIsTUFBTVUsS0FBTixLQUFnQixDQUFoQixHQUFvQixDQUFwQixHQUF3QlYsTUFBTVUsS0FBTixHQUFjLENBQWQsR0FBa0IsQ0FBbEIsR0FBc0IsQ0FBQyxDQUE1RDtBQUNBO0FBQ0EsZ0JBQUk0QyxRQUFVQyxLQUFLQyxHQUFMLENBQVN4RCxNQUFNUyxLQUFmLElBQXdCOEMsS0FBS0MsR0FBTCxDQUFTeEQsTUFBTVUsS0FBZixDQUF4QixHQUFnRCxDQUFoRCxHQUFvRCxDQUFsRTs7QUFFQTtBQUNBLGdCQUFJLENBQUNWLE1BQU1rQixNQUFYLEVBQW1CO0FBQ2ZsQixzQkFBTVcsS0FBTixHQUFlMkMsS0FBZjtBQUNBdEQsc0JBQU1rQixNQUFOLEdBQWUsSUFBZjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxnQkFBSWxCLE1BQU1XLEtBQU4sS0FBZ0IyQyxLQUFwQixFQUEyQjtBQUN2QnRELHNCQUFNZ0IsT0FBTixHQUFnQixDQUFoQjtBQUNBaEIsc0JBQU1pQixPQUFOLEdBQWdCLENBQWhCO0FBQ0gsYUFIRCxNQUdPO0FBQ0hqQixzQkFBTWdCLE9BQU4sSUFBaUJ1QyxLQUFLQyxHQUFMLENBQVN4RCxNQUFNUyxLQUFmLENBQWpCO0FBQ0Esb0JBQUlULE1BQU1ZLElBQU4sS0FBZSxDQUFmLElBQW9CWixNQUFNWSxJQUFOLEtBQWVaLE1BQU1jLFFBQTdDLEVBQXVEO0FBQ25EZCwwQkFBTWdCLE9BQU4sR0FBZ0IsQ0FBaEI7QUFDSDtBQUNEaEIsc0JBQU1pQixPQUFOLElBQWlCc0MsS0FBS0MsR0FBTCxDQUFTeEQsTUFBTVUsS0FBZixDQUFqQjtBQUNBLG9CQUFJVixNQUFNYSxJQUFOLEtBQWUsQ0FBZixJQUFvQmIsTUFBTWEsSUFBTixLQUFlYixNQUFNZSxRQUE3QyxFQUF1RDtBQUNuRGYsMEJBQU1pQixPQUFOLEdBQWdCLENBQWhCO0FBQ0g7QUFDSjtBQUNEakIsa0JBQU1XLEtBQU4sR0FBYzJDLEtBQWQ7O0FBRUE7OztBQUdBLGdCQUFJdEQsTUFBTVcsS0FBTixJQUFlWCxNQUFNZ0IsT0FBTixJQUFpQnFDLElBQUk3RyxTQUF4QyxFQUFtRDtBQUMvQztBQUNBd0Qsc0JBQU1nQixPQUFOLEdBQWdCLENBQWhCO0FBQ0FtQyx1QkFBTyxLQUFLN0YsT0FBTCxDQUFhNkYsSUFBYixDQUFrQkUsSUFBSTNILFlBQXRCLENBQVA7QUFDQTtBQUNBLG9CQUFJc0UsTUFBTVMsS0FBTixHQUFjLENBQWQsSUFBbUIwQyxLQUFLMUUsTUFBeEIsSUFBa0MsQ0FBQzBFLEtBQUs1RSxRQUFMLENBQWM4RSxJQUFJckgsY0FBbEIsQ0FBdkMsRUFBMEU7QUFDdEU7QUFDQW1CLDJCQUFPZ0csS0FBSzNGLElBQUwsQ0FBVTZGLElBQUk1SCxZQUFkLEVBQTRCZ0ksSUFBNUIsRUFBUDtBQUNBO0FBQ0FwRSw0QkFBUSxLQUFLL0IsT0FBTCxDQUFhMEYsT0FBYixDQUFxQkssSUFBSTVILFlBQXpCLEVBQXVDZ0QsTUFBL0M7QUFDQSx3QkFBSVksUUFBUSxLQUFLK0IsU0FBYixJQUEwQmlDLElBQUk5RyxRQUFsQyxFQUE0QztBQUN4QztBQUNBLDRCQUFJLENBQUNZLEtBQUtzQixNQUFWLEVBQWtCO0FBQ2R0QixtQ0FBTzNDLEVBQUUsTUFBTTZJLElBQUk1SCxZQUFWLEdBQXlCLElBQTNCLEVBQWlDa0csUUFBakMsQ0FBMEMwQixJQUFJekgsU0FBOUMsQ0FBUDtBQUNBdUIsaUNBQUsyRixNQUFMLENBQVksS0FBS3hGLE9BQWpCO0FBQ0E2RixpQ0FBS0wsTUFBTCxDQUFZM0YsSUFBWjtBQUNBLGlDQUFLTyxTQUFMLENBQWV5RixJQUFmO0FBQ0gseUJBTEQsTUFLTztBQUNIO0FBQ0FoRyxtQ0FBT2dHLEtBQUt6RCxRQUFMLENBQWMyRCxJQUFJNUgsWUFBbEIsRUFBZ0NnSSxJQUFoQyxFQUFQO0FBQ0F0RyxpQ0FBSzJGLE1BQUwsQ0FBWSxLQUFLeEYsT0FBakI7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBLG9CQUFJMEMsTUFBTVMsS0FBTixHQUFjLENBQWxCLEVBQXFCO0FBQ2pCO0FBQ0EyQywyQkFBTyxLQUFLOUYsT0FBTCxDQUFhOEYsSUFBYixDQUFrQkMsSUFBSTNILFlBQXRCLENBQVA7QUFDQSx3QkFBSSxDQUFDMEgsS0FBSzNFLE1BQVYsRUFBa0I7QUFDZFAsaUNBQVMsS0FBS1osT0FBTCxDQUFhWSxNQUFiLEVBQVQ7QUFDQSw2QkFBS1osT0FBTCxDQUFha0IsT0FBYixDQUFxQjZFLElBQUkzSCxZQUF6QixFQUF1Q2dILEtBQXZDLENBQTZDLEtBQUtwRixPQUFsRDtBQUNBLDRCQUFJLENBQUNZLE9BQU93QixRQUFQLEdBQWtCakIsTUFBdkIsRUFBK0I7QUFDM0IsaUNBQUtzRCxXQUFMLENBQWlCN0QsT0FBT0EsTUFBUCxFQUFqQjtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUVELGdCQUFJd0YsVUFBVSxLQUFkOztBQUVBO0FBQ0EsZ0JBQUksQ0FBQzdJLGdCQUFMLEVBQXVCO0FBQ25CLHFCQUFLZ0QsTUFBTCxDQUFZLENBQVosRUFBZTNDLEtBQWYsQ0FBcUJ5SSxVQUFyQixHQUFrQyxRQUFsQztBQUNIO0FBQ0QsaUJBQUtyQyxPQUFMLEdBQWU5RyxFQUFFRSxTQUFTa0osZ0JBQVQsQ0FBMEJoRyxFQUFFd0UsS0FBRixHQUFVMUgsU0FBU21JLElBQVQsQ0FBY2dCLFVBQWxELEVBQThEakcsRUFBRTJFLEtBQUYsSUFBVzlILE9BQU9xSixXQUFQLElBQXNCcEosU0FBU08sZUFBVCxDQUF5QjhJLFNBQTFELENBQTlELENBQUYsQ0FBZjtBQUNBLGdCQUFJLENBQUNsSixnQkFBTCxFQUF1QjtBQUNuQixxQkFBS2dELE1BQUwsQ0FBWSxDQUFaLEVBQWUzQyxLQUFmLENBQXFCeUksVUFBckIsR0FBa0MsU0FBbEM7QUFDSDtBQUNELGdCQUFJLEtBQUtyQyxPQUFMLENBQWEvQyxRQUFiLENBQXNCOEUsSUFBSXRILFdBQTFCLENBQUosRUFBNEM7QUFDeEMscUJBQUt1RixPQUFMLEdBQWUsS0FBS0EsT0FBTCxDQUFhcEQsTUFBYixDQUFvQm1GLElBQUkzSCxZQUF4QixDQUFmO0FBQ0g7QUFDRCxnQkFBSSxLQUFLNEYsT0FBTCxDQUFhL0MsUUFBYixDQUFzQjhFLElBQUlsSCxVQUExQixDQUFKLEVBQTJDO0FBQ3ZDdUgsMEJBQVUsSUFBVjtBQUNILGFBRkQsTUFHSyxJQUFJLENBQUMsS0FBS3BDLE9BQUwsQ0FBYTdDLE1BQWQsSUFBd0IsQ0FBQyxLQUFLNkMsT0FBTCxDQUFhL0MsUUFBYixDQUFzQjhFLElBQUl4SCxTQUExQixDQUE3QixFQUFtRTtBQUNwRTtBQUNIOztBQUVEO0FBQ0EsZ0JBQUltSSxjQUFjLEtBQUsxQyxPQUFMLENBQWE5QyxPQUFiLENBQXFCLE1BQU02RSxJQUFJMUgsU0FBL0IsQ0FBbEI7QUFBQSxnQkFDSXNJLFlBQWMsS0FBSzlDLFVBQUwsQ0FBZ0I5RCxJQUFoQixDQUFxQixhQUFyQixNQUF3QzJHLFlBQVkzRyxJQUFaLENBQWlCLGFBQWpCLENBRDFEOztBQUdBOzs7QUFHQSxnQkFBSSxDQUFDMkMsTUFBTVcsS0FBUCxJQUFnQnNELFNBQWhCLElBQTZCUCxPQUFqQyxFQUEwQztBQUN0QztBQUNBLG9CQUFJTyxhQUFhWixJQUFJL0csS0FBSixLQUFjMEgsWUFBWTNHLElBQVosQ0FBaUIsZ0JBQWpCLENBQS9CLEVBQW1FO0FBQy9EO0FBQ0g7QUFDRDtBQUNBZ0Msd0JBQVEsS0FBSytCLFNBQUwsR0FBaUIsQ0FBakIsR0FBcUIsS0FBS0UsT0FBTCxDQUFhMEIsT0FBYixDQUFxQkssSUFBSTVILFlBQXpCLEVBQXVDZ0QsTUFBcEU7QUFDQSxvQkFBSVksUUFBUWdFLElBQUk5RyxRQUFoQixFQUEwQjtBQUN0QjtBQUNIO0FBQ0Qsb0JBQUkySCxTQUFTdEcsRUFBRTJFLEtBQUYsR0FBVyxLQUFLakIsT0FBTCxDQUFhZSxNQUFiLEdBQXNCRyxHQUF0QixHQUE0QixLQUFLbEIsT0FBTCxDQUFhYSxNQUFiLEtBQXdCLENBQTVFO0FBQ0lqRSx5QkFBUyxLQUFLWixPQUFMLENBQWFZLE1BQWIsRUFBVDtBQUNKO0FBQ0Esb0JBQUl3RixPQUFKLEVBQWE7QUFDVHZHLDJCQUFPM0MsRUFBRUUsU0FBU0ssYUFBVCxDQUF1QnNJLElBQUk1SCxZQUEzQixDQUFGLEVBQTRDa0csUUFBNUMsQ0FBcUQwQixJQUFJekgsU0FBekQsQ0FBUDtBQUNBdUIseUJBQUsyRixNQUFMLENBQVksS0FBS3hGLE9BQWpCO0FBQ0EseUJBQUtnRSxPQUFMLENBQWEyQixXQUFiLENBQXlCOUYsSUFBekI7QUFDSCxpQkFKRCxNQUtLLElBQUkrRyxNQUFKLEVBQVk7QUFDYix5QkFBSzVDLE9BQUwsQ0FBYTRDLE1BQWIsQ0FBb0IsS0FBSzVHLE9BQXpCO0FBQ0gsaUJBRkksTUFHQTtBQUNELHlCQUFLZ0UsT0FBTCxDQUFhb0IsS0FBYixDQUFtQixLQUFLcEYsT0FBeEI7QUFDSDtBQUNELG9CQUFJLENBQUNZLE9BQU93QixRQUFQLEdBQWtCakIsTUFBdkIsRUFBK0I7QUFDM0IseUJBQUtzRCxXQUFMLENBQWlCN0QsT0FBT0EsTUFBUCxFQUFqQjtBQUNIO0FBQ0Qsb0JBQUksQ0FBQyxLQUFLaUQsVUFBTCxDQUFnQjNELElBQWhCLENBQXFCNkYsSUFBSTNILFlBQXpCLEVBQXVDK0MsTUFBNUMsRUFBb0Q7QUFDaEQseUJBQUswQyxVQUFMLENBQWdCMkIsTUFBaEIsQ0FBdUIsaUJBQWlCTyxJQUFJbEgsVUFBckIsR0FBa0MsS0FBekQ7QUFDSDtBQUNEO0FBQ0Esb0JBQUk4SCxTQUFKLEVBQWU7QUFDWCx5QkFBSzlDLFVBQUwsR0FBa0I2QyxXQUFsQjtBQUNBLHlCQUFLM0MsVUFBTCxHQUFrQixLQUFLdkcsRUFBTCxDQUFRLENBQVIsTUFBZSxLQUFLcUcsVUFBTCxDQUFnQixDQUFoQixDQUFqQztBQUNIO0FBQ0o7QUFDSjs7QUFsYmMsS0FBbkI7O0FBc2JBM0csTUFBRTJKLEVBQUYsQ0FBS0MsUUFBTCxHQUFnQixVQUFTQyxNQUFULEVBQ2hCO0FBQ0ksWUFBSTNDLFFBQVMsSUFBYjtBQUFBLFlBQ0k0QyxTQUFTLElBRGI7O0FBR0E1QyxjQUFNbkUsSUFBTixDQUFXLFlBQ1g7QUFDSSxnQkFBSWdILFNBQVMvSixFQUFFLElBQUYsRUFBUTZDLElBQVIsQ0FBYSxVQUFiLENBQWI7O0FBRUEsZ0JBQUksQ0FBQ2tILE1BQUwsRUFBYTtBQUNUL0osa0JBQUUsSUFBRixFQUFRNkMsSUFBUixDQUFhLFVBQWIsRUFBeUIsSUFBSVQsTUFBSixDQUFXLElBQVgsRUFBaUJ5SCxNQUFqQixDQUF6QjtBQUNBN0osa0JBQUUsSUFBRixFQUFRNkMsSUFBUixDQUFhLGFBQWIsRUFBNEIsSUFBSW1ILElBQUosR0FBV0MsT0FBWCxFQUE1QjtBQUNILGFBSEQsTUFHTztBQUNILG9CQUFJLE9BQU9KLE1BQVAsS0FBa0IsUUFBbEIsSUFBOEIsT0FBT0UsT0FBT0YsTUFBUCxDQUFQLEtBQTBCLFVBQTVELEVBQXdFO0FBQ3BFQyw2QkFBU0MsT0FBT0YsTUFBUCxHQUFUO0FBQ0g7QUFDSjtBQUNKLFNBWkQ7O0FBY0EsZUFBT0MsVUFBVTVDLEtBQWpCO0FBQ0gsS0FwQkQ7QUFzQkgsQ0FsZ0JBLEVBa2dCRWpILE9BQU9pSyxNQUFQLElBQWlCakssT0FBT2tLLEtBbGdCMUIsRUFrZ0JpQ2xLLE1BbGdCakMsRUFrZ0J5Q0MsUUFsZ0J6QyIsImZpbGUiOiJuZXN0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogTmVzdGFibGUgalF1ZXJ5IFBsdWdpbiAtIENvcHlyaWdodCAoYykgMjAxMiBEYXZpZCBCdXNoZWxsIC0gaHR0cDovL2RidXNoZWxsLmNvbS9cbiAqIER1YWwtbGljZW5zZWQgdW5kZXIgdGhlIEJTRCBvciBNSVQgbGljZW5zZXNcbiAqL1xuOyhmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpXG57XG4gICAgdmFyIGhhc1RvdWNoID0gJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgQ1NTIHBvaW50ZXItZXZlbnRzIHByb3BlcnR5XG4gICAgICogZXZlbnRzIGFyZSBub3JtYWxseSBkaXNhYmxlZCBvbiB0aGUgZHJhZ2dpbmcgZWxlbWVudCB0byBhdm9pZCBjb25mbGljdHNcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vYXVzaS9GZWF0dXJlLWRldGVjdGlvbi10ZWNobmlxdWUtZm9yLXBvaW50ZXItZXZlbnRzL2Jsb2IvbWFzdGVyL21vZGVybml6ci1wb2ludGVyZXZlbnRzLmpzXG4gICAgICovXG4gICAgdmFyIGhhc1BvaW50ZXJFdmVudHMgPSAoZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIGVsICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgaWYgKCEoJ3BvaW50ZXJFdmVudHMnIGluIGVsLnN0eWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgICAgIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAneCc7XG4gICAgICAgIGRvY0VsLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgdmFyIHN1cHBvcnRzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsICcnKS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG4gICAgICAgIGRvY0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgcmV0dXJuICEhc3VwcG9ydHM7XG4gICAgfSkoKTtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGxpc3ROb2RlTmFtZSAgICA6ICdvbCcsXG4gICAgICAgICAgICBpdGVtTm9kZU5hbWUgICAgOiAnbGknLFxuICAgICAgICAgICAgcm9vdENsYXNzICAgICAgIDogJ2RkJyxcbiAgICAgICAgICAgIGxpc3RDbGFzcyAgICAgICA6ICdkZC1saXN0JyxcbiAgICAgICAgICAgIGl0ZW1DbGFzcyAgICAgICA6ICdkZC1pdGVtJyxcbiAgICAgICAgICAgIGRyYWdDbGFzcyAgICAgICA6ICdkZC1kcmFnZWwnLFxuICAgICAgICAgICAgaGFuZGxlQ2xhc3MgICAgIDogJ2RkLWhhbmRsZScsXG4gICAgICAgICAgICBjb2xsYXBzZWRDbGFzcyAgOiAnZGQtY29sbGFwc2VkJyxcbiAgICAgICAgICAgIHBsYWNlQ2xhc3MgICAgICA6ICdkZC1wbGFjZWhvbGRlcicsXG4gICAgICAgICAgICBub0RyYWdDbGFzcyAgICAgOiAnZGQtbm9kcmFnJyxcbiAgICAgICAgICAgIGVtcHR5Q2xhc3MgICAgICA6ICdkZC1lbXB0eScsXG4gICAgICAgICAgICBleHBhbmRCdG5IVE1MICAgOiAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cImV4cGFuZFwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRkLWJ1dHRvbiBkZC1idXR0b25fX2V4cGFuZFwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjb2xsYXBzZUJ0bkhUTUwgOiAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cImNvbGxhcHNlXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZGQtYnV0dG9uIGRkLWJ1dHRvbl9fY29sbGFwc2VcIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZ3JvdXAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgIG1heERlcHRoICAgICAgICA6IDUsXG4gICAgICAgICAgICB0aHJlc2hvbGQgICAgICAgOiAyMCxcbiAgICAgICAgICAgIGRyYWdTdG9wICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBhZnRlckV4cGFuZCAgICAgOiBudWxsLFxuICAgICAgICAgICAgYWZ0ZXJDb2xsYXBzZSAgIDogbnVsbFxuICAgICAgICB9O1xuXG4gICAgZnVuY3Rpb24gUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpXG4gICAge1xuICAgICAgICB0aGlzLncgID0gJChkb2N1bWVudCk7XG4gICAgICAgIHRoaXMuZWwgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBQbHVnaW4ucHJvdG90eXBlID0ge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuXG4gICAgICAgICAgICBsaXN0LnJlc2V0KCk7XG5cbiAgICAgICAgICAgIGxpc3QuZWwuZGF0YSgnbmVzdGFibGUtZ3JvdXAnLCB0aGlzLm9wdGlvbnMuZ3JvdXApO1xuXG4gICAgICAgICAgICBsaXN0LnBsYWNlRWwgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIGxpc3Qub3B0aW9ucy5wbGFjZUNsYXNzICsgJ1wiLz4nKTtcblxuICAgICAgICAgICAgJC5lYWNoKHRoaXMuZWwuZmluZChsaXN0Lm9wdGlvbnMuaXRlbU5vZGVOYW1lKSwgZnVuY3Rpb24oaywgZWwpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNldFBhcmVudCgkKGVsKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGlzdC5lbC5vbignY2xpY2snLCAnYnV0dG9uJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHRhcmdldC5kYXRhKCdhY3Rpb24nKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSAgID0gdGFyZ2V0LnBhcmVudChsaXN0Lm9wdGlvbnMuaXRlbU5vZGVOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnY29sbGFwc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuY29sbGFwc2VJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnZXhwYW5kJykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LmV4cGFuZEl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvblN0YXJ0RXZlbnQgPSBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGUgPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZS5oYXNDbGFzcyhsaXN0Lm9wdGlvbnMuaGFuZGxlQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGUuY2xvc2VzdCgnLicgKyBsaXN0Lm9wdGlvbnMubm9EcmFnQ2xhc3MpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZSA9IGhhbmRsZS5jbG9zZXN0KCcuJyArIGxpc3Qub3B0aW9ucy5oYW5kbGVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFoYW5kbGUubGVuZ3RoIHx8IGxpc3QuZHJhZ0VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsaXN0LmlzVG91Y2ggPSAvXnRvdWNoLy50ZXN0KGUudHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaXNUb3VjaCAmJiBlLnRvdWNoZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGlzdC5kcmFnU3RhcnQoZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb25Nb3ZlRXZlbnQgPSBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuZHJhZ01vdmUoZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG9uRW5kRXZlbnQgPSBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuZHJhZ1N0b3AoZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGhhc1RvdWNoKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5lbFswXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25TdGFydEV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uTW92ZUV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25FbmRFdmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIG9uRW5kRXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5lbC5vbignbW91c2Vkb3duJywgb25TdGFydEV2ZW50KTtcbiAgICAgICAgICAgIGxpc3Qudy5vbignbW91c2Vtb3ZlJywgb25Nb3ZlRXZlbnQpO1xuICAgICAgICAgICAgbGlzdC53Lm9uKCdtb3VzZXVwJywgb25FbmRFdmVudCk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRhdGEsXG4gICAgICAgICAgICAgICAgZGVwdGggPSAwLFxuICAgICAgICAgICAgICAgIGxpc3QgID0gdGhpcztcbiAgICAgICAgICAgICAgICBzdGVwICA9IGZ1bmN0aW9uKGxldmVsLCBkZXB0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IFsgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gbGV2ZWwuY2hpbGRyZW4obGlzdC5vcHRpb25zLml0ZW1Ob2RlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGkgICA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9ICQuZXh0ZW5kKHt9LCBsaS5kYXRhKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YiAgPSBsaS5jaGlsZHJlbihsaXN0Lm9wdGlvbnMubGlzdE5vZGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGlsZHJlbiA9IHN0ZXAoc3ViLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGF0YSA9IHN0ZXAobGlzdC5lbC5maW5kKGxpc3Qub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmZpcnN0KCksIGRlcHRoKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNlcmlhbGlzZTogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxpemUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldDogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlID0ge1xuICAgICAgICAgICAgICAgIG9mZnNldFggICA6IDAsXG4gICAgICAgICAgICAgICAgb2Zmc2V0WSAgIDogMCxcbiAgICAgICAgICAgICAgICBzdGFydFggICAgOiAwLFxuICAgICAgICAgICAgICAgIHN0YXJ0WSAgICA6IDAsXG4gICAgICAgICAgICAgICAgbGFzdFggICAgIDogMCxcbiAgICAgICAgICAgICAgICBsYXN0WSAgICAgOiAwLFxuICAgICAgICAgICAgICAgIG5vd1ggICAgICA6IDAsXG4gICAgICAgICAgICAgICAgbm93WSAgICAgIDogMCxcbiAgICAgICAgICAgICAgICBkaXN0WCAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGRpc3RZICAgICA6IDAsXG4gICAgICAgICAgICAgICAgZGlyQXggICAgIDogMCxcbiAgICAgICAgICAgICAgICBkaXJYICAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGRpclkgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgbGFzdERpclggIDogMCxcbiAgICAgICAgICAgICAgICBsYXN0RGlyWSAgOiAwLFxuICAgICAgICAgICAgICAgIGRpc3RBeFggICA6IDAsXG4gICAgICAgICAgICAgICAgZGlzdEF4WSAgIDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaXNUb3VjaCAgICA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgICAgID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbCAgICAgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kcmFnUm9vdEVsID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0RlcHRoICA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc05ld1Jvb3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRFbCAgICA9IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhwYW5kSXRlbTogZnVuY3Rpb24obGkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jb2xsYXBzZWRDbGFzcyk7XG4gICAgICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiZXhwYW5kXCJdJykuaGlkZSgpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbj1cImNvbGxhcHNlXCJdJykuc2hvdygpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLmxpc3ROb2RlTmFtZSkuc2hvdygpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hZnRlckV4cGFuZCA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hZnRlckV4cGFuZChsaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbihsaSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3RzID0gbGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLmxpc3ROb2RlTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChsaXN0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsaS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKCdbZGF0YS1hY3Rpb249XCJjb2xsYXBzZVwiXScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiZXhwYW5kXCJdJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuYWZ0ZXJDb2xsYXBzZSA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hZnRlckNvbGxhcHNlKGxpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBleHBhbmRBbGw6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgICAgICAgICAgbGlzdC5lbC5maW5kKGxpc3Qub3B0aW9ucy5pdGVtTm9kZU5hbWUpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5leHBhbmRJdGVtKCQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGFwc2VBbGw6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgICAgICAgICAgbGlzdC5lbC5maW5kKGxpc3Qub3B0aW9ucy5pdGVtTm9kZU5hbWUpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5jb2xsYXBzZUl0ZW0oJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uKGxpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAobGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLmxpc3ROb2RlTmFtZSkubGVuZ3RoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghbGkuZmluZCgnLmRkLWJ1dHRvbl9fZXhwYW5kJykubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGkucHJlcGVuZCgkKHRoaXMub3B0aW9ucy5leHBhbmRCdG5IVE1MKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFsaS5maW5kKCcuZGQtYnV0dG9uX19jb2xsYXBzZScpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxpLnByZXBlbmQoJCh0aGlzLm9wdGlvbnMuY29sbGFwc2VCdG5IVE1MKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJChsaVswXSkuaGFzQ2xhc3MoJ2RkLWNvbGxhcHNlZCcpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKCdbZGF0YS1hY3Rpb249XCJjb2xsYXBzZVwiXScpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKCdbZGF0YS1hY3Rpb249XCJleHBhbmRcIl0nKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5zZXRQYXJlbnQ6IGZ1bmN0aW9uKGxpKVxuICAgICAgICB7XG4gICAgICAgICAgICBsaS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbl0nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLnJlbW92ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYWdTdGFydDogZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG1vdXNlICAgID0gdGhpcy5tb3VzZSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgICA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgIGRyYWdJdGVtID0gdGFyZ2V0LmNsb3Nlc3QodGhpcy5vcHRpb25zLml0ZW1Ob2RlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMucGxhY2VFbC5jc3MoJ2hlaWdodCcsIGRyYWdJdGVtLmhlaWdodCgpKTtcblxuICAgICAgICAgICAgbW91c2Uub2Zmc2V0WCA9IGUub2Zmc2V0WCAhPT0gdW5kZWZpbmVkID8gZS5vZmZzZXRYIDogZS5wYWdlWCAtIHRhcmdldC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgICAgbW91c2Uub2Zmc2V0WSA9IGUub2Zmc2V0WSAhPT0gdW5kZWZpbmVkID8gZS5vZmZzZXRZIDogZS5wYWdlWSAtIHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICBtb3VzZS5zdGFydFggPSBtb3VzZS5sYXN0WCA9IGUucGFnZVg7XG4gICAgICAgICAgICBtb3VzZS5zdGFydFkgPSBtb3VzZS5sYXN0WSA9IGUucGFnZVk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ1Jvb3RFbCA9IHRoaXMuZWw7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0VsID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMubGlzdENsYXNzICsgJyAnICsgdGhpcy5vcHRpb25zLmRyYWdDbGFzcyk7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbC5jc3MoJ3dpZHRoJywgZHJhZ0l0ZW0ud2lkdGgoKSk7XG5cbiAgICAgICAgICAgIGRyYWdJdGVtLmFmdGVyKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICBkcmFnSXRlbVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWdJdGVtWzBdKTtcbiAgICAgICAgICAgIGRyYWdJdGVtLmFwcGVuZFRvKHRoaXMuZHJhZ0VsKTtcblxuICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQodGhpcy5kcmFnRWwpO1xuICAgICAgICAgICAgdGhpcy5kcmFnRWwuY3NzKHtcbiAgICAgICAgICAgICAgICAnbGVmdCcgOiBlLnBhZ2VYIC0gbW91c2Uub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAndG9wJyAgOiBlLnBhZ2VZIC0gbW91c2Uub2Zmc2V0WVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0b3RhbCBkZXB0aCBvZiBkcmFnZ2luZyBpdGVtXG4gICAgICAgICAgICB2YXIgaSwgZGVwdGgsXG4gICAgICAgICAgICAgICAgaXRlbXMgPSB0aGlzLmRyYWdFbC5maW5kKHRoaXMub3B0aW9ucy5pdGVtTm9kZU5hbWUpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVwdGggPSAkKGl0ZW1zW2ldKS5wYXJlbnRzKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoZGVwdGggPiB0aGlzLmRyYWdEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdEZXB0aCA9IGRlcHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnU3RvcDogZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5kcmFnRWwuY2hpbGRyZW4odGhpcy5vcHRpb25zLml0ZW1Ob2RlTmFtZSkuZmlyc3QoKTtcbiAgICAgICAgICAgIGVsWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxbMF0pO1xuICAgICAgICAgICAgdGhpcy5wbGFjZUVsLnJlcGxhY2VXaXRoKGVsKTtcblxuICAgICAgICAgICAgdGhpcy5kcmFnRWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmVsLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTmV3Um9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1Jvb3RFbC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZHJhZ1N0b3AgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1N0b3AoZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZHJhZ01vdmU6IGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBsaXN0LCBwYXJlbnQsIHByZXYsIG5leHQsIGRlcHRoLFxuICAgICAgICAgICAgICAgIG9wdCAgID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIG1vdXNlID0gdGhpcy5tb3VzZTtcblxuICAgICAgICAgICAgdGhpcy5kcmFnRWwuY3NzKHtcbiAgICAgICAgICAgICAgICAnbGVmdCcgOiBlLnBhZ2VYIC0gbW91c2Uub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAndG9wJyAgOiBlLnBhZ2VZIC0gbW91c2Uub2Zmc2V0WVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlIHBvc2l0aW9uIGxhc3QgZXZlbnRzXG4gICAgICAgICAgICBtb3VzZS5sYXN0WCA9IG1vdXNlLm5vd1g7XG4gICAgICAgICAgICBtb3VzZS5sYXN0WSA9IG1vdXNlLm5vd1k7XG4gICAgICAgICAgICAvLyBtb3VzZSBwb3NpdGlvbiB0aGlzIGV2ZW50c1xuICAgICAgICAgICAgbW91c2Uubm93WCAgPSBlLnBhZ2VYO1xuICAgICAgICAgICAgbW91c2Uubm93WSAgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgLy8gZGlzdGFuY2UgbW91c2UgbW92ZWQgYmV0d2VlbiBldmVudHNcbiAgICAgICAgICAgIG1vdXNlLmRpc3RYID0gbW91c2Uubm93WCAtIG1vdXNlLmxhc3RYO1xuICAgICAgICAgICAgbW91c2UuZGlzdFkgPSBtb3VzZS5ub3dZIC0gbW91c2UubGFzdFk7XG4gICAgICAgICAgICAvLyBkaXJlY3Rpb24gbW91c2Ugd2FzIG1vdmluZ1xuICAgICAgICAgICAgbW91c2UubGFzdERpclggPSBtb3VzZS5kaXJYO1xuICAgICAgICAgICAgbW91c2UubGFzdERpclkgPSBtb3VzZS5kaXJZO1xuICAgICAgICAgICAgLy8gZGlyZWN0aW9uIG1vdXNlIGlzIG5vdyBtb3ZpbmcgKG9uIGJvdGggYXhpcylcbiAgICAgICAgICAgIG1vdXNlLmRpclggPSBtb3VzZS5kaXN0WCA9PT0gMCA/IDAgOiBtb3VzZS5kaXN0WCA+IDAgPyAxIDogLTE7XG4gICAgICAgICAgICBtb3VzZS5kaXJZID0gbW91c2UuZGlzdFkgPT09IDAgPyAwIDogbW91c2UuZGlzdFkgPiAwID8gMSA6IC0xO1xuICAgICAgICAgICAgLy8gYXhpcyBtb3VzZSBpcyBub3cgbW92aW5nIG9uXG4gICAgICAgICAgICB2YXIgbmV3QXggICA9IE1hdGguYWJzKG1vdXNlLmRpc3RYKSA+IE1hdGguYWJzKG1vdXNlLmRpc3RZKSA/IDEgOiAwO1xuXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIG9uIGZpcnN0IG1vdmVcbiAgICAgICAgICAgIGlmICghbW91c2UubW92aW5nKSB7XG4gICAgICAgICAgICAgICAgbW91c2UuZGlyQXggID0gbmV3QXg7XG4gICAgICAgICAgICAgICAgbW91c2UubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNhbGMgZGlzdGFuY2UgbW92ZWQgb24gdGhpcyBheGlzIChhbmQgZGlyZWN0aW9uKVxuICAgICAgICAgICAgaWYgKG1vdXNlLmRpckF4ICE9PSBuZXdBeCkge1xuICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFggPSAwO1xuICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFkgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhYICs9IE1hdGguYWJzKG1vdXNlLmRpc3RYKTtcbiAgICAgICAgICAgICAgICBpZiAobW91c2UuZGlyWCAhPT0gMCAmJiBtb3VzZS5kaXJYICE9PSBtb3VzZS5sYXN0RGlyWCkge1xuICAgICAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhYID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW91c2UuZGlzdEF4WSArPSBNYXRoLmFicyhtb3VzZS5kaXN0WSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLmRpclkgIT09IDAgJiYgbW91c2UuZGlyWSAhPT0gbW91c2UubGFzdERpclkpIHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2UuZGlzdEF4WSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW91c2UuZGlyQXggPSBuZXdBeDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBtb3ZlIGhvcml6b250YWxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKG1vdXNlLmRpckF4ICYmIG1vdXNlLmRpc3RBeFggPj0gb3B0LnRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IG1vdmUgZGlzdGFuY2Ugb24geC1heGlzIGZvciBuZXcgcGhhc2VcbiAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhYID0gMDtcbiAgICAgICAgICAgICAgICBwcmV2ID0gdGhpcy5wbGFjZUVsLnByZXYob3B0Lml0ZW1Ob2RlTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gaW5jcmVhc2UgaG9yaXpvbnRhbCBsZXZlbCBpZiBwcmV2aW91cyBzaWJsaW5nIGV4aXN0cyBhbmQgaXMgbm90IGNvbGxhcHNlZFxuICAgICAgICAgICAgICAgIGlmIChtb3VzZS5kaXN0WCA+IDAgJiYgcHJldi5sZW5ndGggJiYgIXByZXYuaGFzQ2xhc3Mob3B0LmNvbGxhcHNlZENsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW5ub3QgaW5jcmVhc2UgbGV2ZWwgd2hlbiBpdGVtIGFib3ZlIGlzIGNvbGxhcHNlZFxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gcHJldi5maW5kKG9wdC5saXN0Tm9kZU5hbWUpLmxhc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZGVwdGggbGltaXQgaGFzIHJlYWNoZWRcbiAgICAgICAgICAgICAgICAgICAgZGVwdGggPSB0aGlzLnBsYWNlRWwucGFyZW50cyhvcHQubGlzdE5vZGVOYW1lKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCArIHRoaXMuZHJhZ0RlcHRoIDw9IG9wdC5tYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIG5ldyBzdWItbGV2ZWwgaWYgb25lIGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gJCgnPCcgKyBvcHQubGlzdE5vZGVOYW1lICsgJy8+JykuYWRkQ2xhc3Mob3B0Lmxpc3RDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5hcHBlbmQodGhpcy5wbGFjZUVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LmFwcGVuZChsaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmVudChwcmV2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBhcHBlbmQgdG8gbmV4dCBsZXZlbCB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBwcmV2LmNoaWxkcmVuKG9wdC5saXN0Tm9kZU5hbWUpLmxhc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZCh0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRlY3JlYXNlIGhvcml6b250YWwgbGV2ZWxcbiAgICAgICAgICAgICAgICBpZiAobW91c2UuZGlzdFggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbid0IGRlY3JlYXNlIGEgbGV2ZWwgaWYgYW4gaXRlbSBwcmVjZWVkcyB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHRoaXMucGxhY2VFbC5uZXh0KG9wdC5pdGVtTm9kZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB0aGlzLnBsYWNlRWwucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlRWwuY2xvc2VzdChvcHQuaXRlbU5vZGVOYW1lKS5hZnRlcih0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQuY2hpbGRyZW4oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0UGFyZW50KHBhcmVudC5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpc0VtcHR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgbGlzdCBpdGVtIHVuZGVyIGN1cnNvclxuICAgICAgICAgICAgaWYgKCFoYXNQb2ludGVyRXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnRWxbMF0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wb2ludEVsID0gJChkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsIGUucGFnZVkgLSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApKSk7XG4gICAgICAgICAgICBpZiAoIWhhc1BvaW50ZXJFdmVudHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdFbFswXS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRFbC5oYXNDbGFzcyhvcHQuaGFuZGxlQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludEVsID0gdGhpcy5wb2ludEVsLnBhcmVudChvcHQuaXRlbU5vZGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50RWwuaGFzQ2xhc3Mob3B0LmVtcHR5Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5wb2ludEVsLmxlbmd0aCB8fCAhdGhpcy5wb2ludEVsLmhhc0NsYXNzKG9wdC5pdGVtQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaW5kIHBhcmVudCBsaXN0IG9mIGl0ZW0gdW5kZXIgY3Vyc29yXG4gICAgICAgICAgICB2YXIgcG9pbnRFbFJvb3QgPSB0aGlzLnBvaW50RWwuY2xvc2VzdCgnLicgKyBvcHQucm9vdENsYXNzKSxcbiAgICAgICAgICAgICAgICBpc05ld1Jvb3QgICA9IHRoaXMuZHJhZ1Jvb3RFbC5kYXRhKCduZXN0YWJsZS1pZCcpICE9PSBwb2ludEVsUm9vdC5kYXRhKCduZXN0YWJsZS1pZCcpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIG1vdmUgdmVydGljYWxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCFtb3VzZS5kaXJBeCB8fCBpc05ld1Jvb3QgfHwgaXNFbXB0eSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGdyb3VwcyBtYXRjaCBpZiBkcmFnZ2luZyBvdmVyIG5ldyByb290XG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3Um9vdCAmJiBvcHQuZ3JvdXAgIT09IHBvaW50RWxSb290LmRhdGEoJ25lc3RhYmxlLWdyb3VwJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVjayBkZXB0aCBsaW1pdFxuICAgICAgICAgICAgICAgIGRlcHRoID0gdGhpcy5kcmFnRGVwdGggLSAxICsgdGhpcy5wb2ludEVsLnBhcmVudHMob3B0Lmxpc3ROb2RlTmFtZSkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChkZXB0aCA+IG9wdC5tYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBiZWZvcmUgPSBlLnBhZ2VZIDwgKHRoaXMucG9pbnRFbC5vZmZzZXQoKS50b3AgKyB0aGlzLnBvaW50RWwuaGVpZ2h0KCkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5wbGFjZUVsLnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGVtcHR5IGNyZWF0ZSBuZXcgbGlzdCB0byByZXBsYWNlIGVtcHR5IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHQubGlzdE5vZGVOYW1lKSkuYWRkQ2xhc3Mob3B0Lmxpc3RDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5yZXBsYWNlV2l0aChsaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5iZWZvcmUodGhpcy5wbGFjZUVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5hZnRlcih0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0UGFyZW50KHBhcmVudC5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcmFnUm9vdEVsLmZpbmQob3B0Lml0ZW1Ob2RlTmFtZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1Jvb3RFbC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInICsgb3B0LmVtcHR5Q2xhc3MgKyAnXCIvPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBwYXJlbnQgcm9vdCBsaXN0IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3Um9vdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdSb290RWwgPSBwb2ludEVsUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNOZXdSb290ID0gdGhpcy5lbFswXSAhPT0gdGhpcy5kcmFnUm9vdEVsWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgICQuZm4ubmVzdGFibGUgPSBmdW5jdGlvbihwYXJhbXMpXG4gICAge1xuICAgICAgICB2YXIgbGlzdHMgID0gdGhpcyxcbiAgICAgICAgICAgIHJldHZhbCA9IHRoaXM7XG5cbiAgICAgICAgbGlzdHMuZWFjaChmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSAkKHRoaXMpLmRhdGEoXCJuZXN0YWJsZVwiKTtcblxuICAgICAgICAgICAgaWYgKCFwbHVnaW4pIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoXCJuZXN0YWJsZVwiLCBuZXcgUGx1Z2luKHRoaXMsIHBhcmFtcykpO1xuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YShcIm5lc3RhYmxlLWlkXCIsIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBwbHVnaW5bcGFyYW1zXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR2YWwgPSBwbHVnaW5bcGFyYW1zXSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJldHZhbCB8fCBsaXN0cztcbiAgICB9O1xuXG59KSh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bywgd2luZG93LCBkb2N1bWVudCk7XG4iXX0=

"use strict";

Array.prototype.max = function () {
  return Math.max.apply(null, this);
};
Array.prototype.min = function () {
  return Math.min.apply(null, this);
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb3RvdHlwZS5qcyJdLCJuYW1lcyI6WyJBcnJheSIsInByb3RvdHlwZSIsIm1heCIsIk1hdGgiLCJhcHBseSIsIm1pbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsTUFBTUMsU0FBTixDQUFnQkMsR0FBaEIsR0FBc0IsWUFBVztBQUFFLFNBQU9DLEtBQUtELEdBQUwsQ0FBU0UsS0FBVCxDQUFlLElBQWYsRUFBcUIsSUFBckIsQ0FBUDtBQUFvQyxDQUF2RTtBQUNBSixNQUFNQyxTQUFOLENBQWdCSSxHQUFoQixHQUFzQixZQUFXO0FBQUUsU0FBT0YsS0FBS0UsR0FBTCxDQUFTRCxLQUFULENBQWUsSUFBZixFQUFxQixJQUFyQixDQUFQO0FBQW9DLENBQXZFIiwiZmlsZSI6InByb3RvdHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFycmF5LnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHsgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHRoaXMpOyB9O1xuQXJyYXkucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gTWF0aC5taW4uYXBwbHkobnVsbCwgdGhpcyk7IH07XG4iXX0=

'use strict';

var _redactor = {

    imperavi: function imperavi(id) {
        var element = $(['#', id].join(''))[0];

        $(element).redactor(getSettings.imperavi({
            mode: 'htmlmixed'
        }));
    },

    redactor: function redactor(id) {
        var element = $(['#', id].join(''))[0];

        $(element).redactor(getSettings.redactor());
    },

    quill: function quill(id) {
        // var BackgroundClass = Quill.import('attributors/class/background');
        // var ColorClass = Quill.import('attributors/class/color');
        // var SizeStyle = Quill.import('attributors/style/size');
        // Quill.register(BackgroundClass, true);
        // Quill.register(ColorClass, true);
        // Quill.register(SizeStyle, true);

        var element = $('#' + id + '-container').get(0);

        var editor = new Quill(element, getSettings.quill());

        editor.on('text-change', function () {
            $('#' + id).val(editor.root.innerHTML);
        });
    },

    tinymce: function (_tinymce) {
        function tinymce(_x) {
            return _tinymce.apply(this, arguments);
        }

        tinymce.toString = function () {
            return _tinymce.toString();
        };

        return tinymce;
    }(function (id) {
        tinymce.init(getSettings.tinymce({
            selector: ['#', id].join('')
        }));
    }),

    cleditor: function cleditor(id) {
        $(['#', id].join('')).cleditor();
    },

    froala: function froala(id) {
        $(['#', id].join('')).froalaEditor(getSettings.tinymce({
            heightMin: 200
        }));
    },

    summernote: function summernote(id) {
        $(['#', id].join('')).summernote({
            height: 200,
            tabsize: 2,
            toolbar: true,
            codemirror: {
                theme: 'monokai'
            }
        });
    },

    ckeditor5: function ckeditor5(id) {
        ClassicEditor.create(document.querySelector(['#', id].join('')), {
            // language: 'ru',
            toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', 'blockQuote'],
            alignment: {
                toolbar: ['alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify'],
                options: ['left', 'right', 'center', 'justify']
            },
            fontSize: {
                options: ['tiny', 'small', 'default', 'big', 'huge']
                // options: [ 9, 10, 11, 12, 13, 14, 15 ]
            },
            highlight: {
                options: [{
                    model: 'yellowMarker',
                    class: 'marker-yellow',
                    title: 'Yellow marker',
                    color: 'var(--ck-highlight-marker-yellow)',
                    type: 'marker'
                }, {
                    model: 'greenMarker',
                    class: 'marker-green',
                    title: 'Green marker',
                    color: 'var(--ck-highlight-marker-green)',
                    type: 'marker'
                }, {
                    model: 'pinkMarker',
                    class: 'marker-pink',
                    title: 'Pink marker',
                    color: 'var(--ck-highlight-marker-pink)',
                    type: 'marker'
                }, {
                    model: 'blueMarker',
                    class: 'marker-blue',
                    title: 'Blue marker',
                    color: 'var(--ck-highlight-marker-blue)',
                    type: 'marker'
                }, {
                    model: 'redPen',
                    class: 'pen-red',
                    title: 'Red pen',
                    color: 'var(--ck-highlight-pen-red)',
                    type: 'pen'
                }, {
                    model: 'greenPen',
                    class: 'pen-green',
                    title: 'Green pen',
                    color: 'var(--ck-highlight-pen-green)',
                    type: 'pen'
                }]
            },
            image: {
                toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
                styles: [{ name: 'left', icon: 'left' }, { name: 'center', icon: 'center' }, { name: 'right', icon: 'right' }, { name: 'fullSize', title: 'Full size', icon: 'right', isDefault: true }, { name: 'side', icon: 'left', title: 'My side style', class: 'custom-side-image' }]
            },
            ckfinder: {
                uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
            }
        }).catch(function (error) {
            console.log(error);
        });
    },

    ckeditor: function ckeditor(id) {
        CKEDITOR.config.width = 'auto';
        CKEDITOR.config.height = 600;
        CKEDITOR.disableAutoInline = true;

        // CKEDITOR.replace(id, {
        //     toolbar: [
        //         { name: 'document', items: [ 'Print' ] },
        //         { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
        //         { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
        //         { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting' ] },
        //         { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        //         { name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        //         { name: 'links', items: [ 'Link', 'Unlink' ] },
        //         { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
        //         { name: 'insert', items: [ 'Image', 'Table' ] },
        //         { name: 'tools', items: [ 'Maximize' ] },
        //         { name: 'editing', items: [ 'Scayt' ] }
        //     ],
        //     customConfig: '',
        //     disallowedContent: 'img{width,height,float}',
        //     extraAllowedContent: 'img[width,height,align]',
        //     // extraPlugins: 'tableresize,uploadimage,uploadfile',
        //     extraPlugins: 'tableresize',
        //     height: 800,
        //     contentsCss: [ 'https://cdn.ckeditor.com/4.6.1/full-all/contents.css' ],
        //     bodyClass: 'document-editor',
        //     format_tags: 'p;h1;h2;h3;pre',
        //     removeDialogTabs: 'image:advanced;link:advanced',
        //     stylesSet: [
        //         /* Inline Styles */
        //         { name: 'Marker', element: 'span', attributes: { 'class': 'marker' } },
        //         { name: 'Cited Work', element: 'cite' },
        //         { name: 'Inline Quotation', element: 'q' },
        //         /* Object Styles */
        //         {
        //             name: 'Special Container',
        //             element: 'div',
        //             styles: {
        //                 padding: '5px 10px',
        //                 background: '#eee',
        //                 border: '1px solid #ccc'
        //             }
        //         },
        //         {
        //             name: 'Compact table',
        //             element: 'table',
        //             attributes: {
        //                 cellpadding: '5',
        //                 cellspacing: '0',
        //                 border: '1',
        //                 bordercolor: '#ccc'
        //             },
        //             styles: {
        //                 'border-collapse': 'collapse'
        //             }
        //         },
        //         { name: 'Borderless Table', element: 'table', styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
        //         { name: 'Square Bulleted List', element: 'ul', styles: { 'list-style-type': 'square' } }
        //     ]
        // } );

        CKEDITOR.replace(id, {
            customConfig: '/apps/wysiwyg/ckeditor/config.js'
        });
    },

    wysiwyg: function wysiwyg(id) {
        $(['#', id].join('')).wysiwyg({
            toolbar: 'top', // 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
            hotKeys: {
                'ctrl+b meta+b': 'bold',
                'ctrl+i meta+i': 'italic',
                'ctrl+u meta+u': 'underline',
                'ctrl+z meta+z': 'undo',
                'ctrl+y meta+y meta+shift+z': 'redo'
            }
        });
    },

    init: function init(id, type) {
        if (typeof this[type] !== 'undefined') {
            this[type](id);
        }
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZGFjdG9yLmpzIl0sIm5hbWVzIjpbIl9yZWRhY3RvciIsImltcGVyYXZpIiwiaWQiLCJlbGVtZW50IiwiJCIsImpvaW4iLCJyZWRhY3RvciIsImdldFNldHRpbmdzIiwibW9kZSIsInF1aWxsIiwiZ2V0IiwiZWRpdG9yIiwiUXVpbGwiLCJvbiIsInZhbCIsInJvb3QiLCJpbm5lckhUTUwiLCJ0aW55bWNlIiwiaW5pdCIsInNlbGVjdG9yIiwiY2xlZGl0b3IiLCJmcm9hbGEiLCJmcm9hbGFFZGl0b3IiLCJoZWlnaHRNaW4iLCJzdW1tZXJub3RlIiwiaGVpZ2h0IiwidGFic2l6ZSIsInRvb2xiYXIiLCJjb2RlbWlycm9yIiwidGhlbWUiLCJja2VkaXRvcjUiLCJDbGFzc2ljRWRpdG9yIiwiY3JlYXRlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYWxpZ25tZW50Iiwib3B0aW9ucyIsImZvbnRTaXplIiwiaGlnaGxpZ2h0IiwibW9kZWwiLCJjbGFzcyIsInRpdGxlIiwiY29sb3IiLCJ0eXBlIiwiaW1hZ2UiLCJzdHlsZXMiLCJuYW1lIiwiaWNvbiIsImlzRGVmYXVsdCIsImNrZmluZGVyIiwidXBsb2FkVXJsIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiLCJja2VkaXRvciIsIkNLRURJVE9SIiwiY29uZmlnIiwid2lkdGgiLCJkaXNhYmxlQXV0b0lubGluZSIsInJlcGxhY2UiLCJjdXN0b21Db25maWciLCJ3eXNpd3lnIiwiaG90S2V5cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxZQUFZOztBQUVaQyxjQUFVLGtCQUFTQyxFQUFULEVBQ1Y7QUFDSSxZQUFNQyxVQUFVQyxFQUFFLENBQUMsR0FBRCxFQUFNRixFQUFOLEVBQVVHLElBQVYsQ0FBZSxFQUFmLENBQUYsRUFBc0IsQ0FBdEIsQ0FBaEI7O0FBRUFELFVBQUVELE9BQUYsRUFBV0csUUFBWCxDQUFvQkMsWUFBWU4sUUFBWixDQUFxQjtBQUNyQ08sa0JBQU07QUFEK0IsU0FB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RlcsU0FBOUI7QUFVQSxLQXZPYzs7QUF5T2Y3QyxVQUFNLGNBQVNoQixFQUFULEVBQWF5QyxJQUFiLEVBQ047QUFDQyxZQUFJLE9BQU8sS0FBS0EsSUFBTCxDQUFQLEtBQXVCLFdBQTNCLEVBQ0E7QUFDQyxpQkFBS0EsSUFBTCxFQUFXekMsRUFBWDtBQUNBO0FBQ0Q7QUEvT2MsQ0FBaEIiLCJmaWxlIjoicmVkYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX3JlZGFjdG9yID0ge1xuXG4gICAgaW1wZXJhdmk6IGZ1bmN0aW9uKGlkKVxuICAgIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9ICQoWycjJywgaWRdLmpvaW4oJycpKVswXTtcblxuICAgICAgICAkKGVsZW1lbnQpLnJlZGFjdG9yKGdldFNldHRpbmdzLmltcGVyYXZpKHtcbiAgICAgICAgICAgIG1vZGU6ICdodG1sbWl4ZWQnXG4gICAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgcmVkYWN0b3I6IGZ1bmN0aW9uKGlkKVxuXHR7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSAkKFsnIycsIGlkXS5qb2luKCcnKSlbMF07XG5cbiAgICAgICAgJChlbGVtZW50KS5yZWRhY3RvcihnZXRTZXR0aW5ncy5yZWRhY3RvcigpKTtcblx0fSxcblxuICAgIHF1aWxsOiBmdW5jdGlvbihpZClcbiAgICB7XG4gICAgICAgIC8vIHZhciBCYWNrZ3JvdW5kQ2xhc3MgPSBRdWlsbC5pbXBvcnQoJ2F0dHJpYnV0b3JzL2NsYXNzL2JhY2tncm91bmQnKTtcbiAgICAgICAgLy8gdmFyIENvbG9yQ2xhc3MgPSBRdWlsbC5pbXBvcnQoJ2F0dHJpYnV0b3JzL2NsYXNzL2NvbG9yJyk7XG4gICAgICAgIC8vIHZhciBTaXplU3R5bGUgPSBRdWlsbC5pbXBvcnQoJ2F0dHJpYnV0b3JzL3N0eWxlL3NpemUnKTtcbiAgICAgICAgLy8gUXVpbGwucmVnaXN0ZXIoQmFja2dyb3VuZENsYXNzLCB0cnVlKTtcbiAgICAgICAgLy8gUXVpbGwucmVnaXN0ZXIoQ29sb3JDbGFzcywgdHJ1ZSk7XG4gICAgICAgIC8vIFF1aWxsLnJlZ2lzdGVyKFNpemVTdHlsZSwgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgZWxlbWVudCA9ICQoYCMke2lkfS1jb250YWluZXJgKS5nZXQoMCk7XG5cbiAgICAgICAgY29uc3QgZWRpdG9yID0gbmV3IFF1aWxsKGVsZW1lbnQsIGdldFNldHRpbmdzLnF1aWxsKCkpO1xuXG4gICAgICAgIGVkaXRvci5vbigndGV4dC1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoYCMke2lkfWApLnZhbChlZGl0b3Iucm9vdC5pbm5lckhUTUwpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdGlueW1jZTogZnVuY3Rpb24oaWQpXG4gICAge1xuICAgICAgICB0aW55bWNlLmluaXQoZ2V0U2V0dGluZ3MudGlueW1jZSh7XG4gICAgICAgICAgICBzZWxlY3RvcjogWycjJywgaWRdLmpvaW4oJycpXG4gICAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgY2xlZGl0b3I6IGZ1bmN0aW9uKGlkKVxuICAgIHtcbiAgICAgICAgJChbJyMnLCBpZF0uam9pbignJykpLmNsZWRpdG9yKCk7XG4gICAgfSxcblxuICAgIGZyb2FsYTogZnVuY3Rpb24oaWQpXG4gICAge1xuICAgICAgICAkKFsnIycsIGlkXS5qb2luKCcnKSkuZnJvYWxhRWRpdG9yKGdldFNldHRpbmdzLnRpbnltY2Uoe1xuICAgICAgICAgICAgaGVpZ2h0TWluOiAyMDBcbiAgICAgICAgfSkpO1xuICAgIH0sXG5cbiAgICBzdW1tZXJub3RlOiBmdW5jdGlvbihpZClcbiAgICB7XG4gICAgICAgICQoWycjJywgaWRdLmpvaW4oJycpKS5zdW1tZXJub3RlKHtcbiAgICAgICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICAgICAgdGFic2l6ZTogMixcbiAgICAgICAgICAgIHRvb2xiYXI6IHRydWUsXG4gICAgICAgICAgICBjb2RlbWlycm9yOiB7XG4gICAgICAgICAgICAgICAgdGhlbWU6ICdtb25va2FpJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY2tlZGl0b3I1OiBmdW5jdGlvbihpZClcbiAgICB7XG4gICAgICAgIENsYXNzaWNFZGl0b3IuY3JlYXRlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoWycjJywgaWRdLmpvaW4oJycpKSwge1xuICAgICAgICAgICAgLy8gbGFuZ3VhZ2U6ICdydScsXG4gICAgICAgICAgICB0b29sYmFyOiBbICdoZWFkaW5nJywgJ3wnLCAnYm9sZCcsICdpdGFsaWMnLCAnbGluaycsICd8JywgJ2J1bGxldGVkTGlzdCcsICdudW1iZXJlZExpc3QnLCAnYmxvY2tRdW90ZScgXSxcbiAgICAgICAgICAgIGFsaWdubWVudDoge1xuICAgICAgICAgICAgICAgIHRvb2xiYXI6IFsgJ2FsaWdubWVudDpsZWZ0JywgJ2FsaWdubWVudDpyaWdodCcsICdhbGlnbm1lbnQ6Y2VudGVyJywgJ2FsaWdubWVudDpqdXN0aWZ5JyBdLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IFsgJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJywgJ2p1c3RpZnknIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb250U2l6ZToge1xuICAgICAgICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ3RpbnknLFxuICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAnZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgICAgICdiaWcnLFxuICAgICAgICAgICAgICAgICAgICAnaHVnZSdcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgLy8gb3B0aW9uczogWyA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1IF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaWdobGlnaHQ6IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAneWVsbG93TWFya2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnbWFya2VyLXllbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1llbGxvdyBtYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1jay1oaWdobGlnaHQtbWFya2VyLXllbGxvdyknLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21hcmtlcidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6ICdncmVlbk1hcmtlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ21hcmtlci1ncmVlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0dyZWVuIG1hcmtlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWNrLWhpZ2hsaWdodC1tYXJrZXItZ3JlZW4pJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYXJrZXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAncGlua01hcmtlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ21hcmtlci1waW5rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGluayBtYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1jay1oaWdobGlnaHQtbWFya2VyLXBpbmspJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYXJrZXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAnYmx1ZU1hcmtlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ21hcmtlci1ibHVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmx1ZSBtYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1jay1oaWdobGlnaHQtbWFya2VyLWJsdWUpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYXJrZXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAncmVkUGVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAncGVuLXJlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JlZCBwZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1jay1oaWdobGlnaHQtcGVuLXJlZCknLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BlbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6ICdncmVlblBlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Blbi1ncmVlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0dyZWVuIHBlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWNrLWhpZ2hsaWdodC1wZW4tZ3JlZW4pJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwZW4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICAgICAgICB0b29sYmFyOiBbICdpbWFnZVN0eWxlOmZ1bGwnLCAnaW1hZ2VTdHlsZTpzaWRlJywgJ3wnLCAnaW1hZ2VUZXh0QWx0ZXJuYXRpdmUnIF0sXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2xlZnQnLCBpY29uOiAnbGVmdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnY2VudGVyJywgaWNvbjogJ2NlbnRlcicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAncmlnaHQnLCBpY29uOiAncmlnaHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2Z1bGxTaXplJywgdGl0bGU6ICdGdWxsIHNpemUnLCBpY29uOiAncmlnaHQnLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiAnc2lkZScsIGljb246ICdsZWZ0JywgdGl0bGU6ICdNeSBzaWRlIHN0eWxlJywgY2xhc3M6ICdjdXN0b20tc2lkZS1pbWFnZScgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBja2ZpbmRlcjoge1xuICAgICAgICAgICAgICAgIHVwbG9hZFVybDogJy9ja2ZpbmRlci9jb3JlL2Nvbm5lY3Rvci9waHAvY29ubmVjdG9yLnBocD9jb21tYW5kPVF1aWNrVXBsb2FkJnR5cGU9RmlsZXMmcmVzcG9uc2VUeXBlPWpzb24nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZXJyb3IgKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNrZWRpdG9yOiBmdW5jdGlvbihpZClcblx0e1xuICAgICAgICBDS0VESVRPUi5jb25maWcud2lkdGggPSAnYXV0byc7XG4gICAgICAgIENLRURJVE9SLmNvbmZpZy5oZWlnaHQgPSA2MDA7XG4gICAgICAgIENLRURJVE9SLmRpc2FibGVBdXRvSW5saW5lID0gdHJ1ZTtcblxuICAgICAgICAvLyBDS0VESVRPUi5yZXBsYWNlKGlkLCB7XG4gICAgICAgIC8vICAgICB0b29sYmFyOiBbXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnZG9jdW1lbnQnLCBpdGVtczogWyAnUHJpbnQnIF0gfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdjbGlwYm9hcmQnLCBpdGVtczogWyAnVW5kbycsICdSZWRvJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnc3R5bGVzJywgaXRlbXM6IFsgJ0Zvcm1hdCcsICdGb250JywgJ0ZvbnRTaXplJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnYmFzaWNzdHlsZXMnLCBpdGVtczogWyAnQm9sZCcsICdJdGFsaWMnLCAnVW5kZXJsaW5lJywgJ1N0cmlrZScsICdSZW1vdmVGb3JtYXQnLCAnQ29weUZvcm1hdHRpbmcnIF0gfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdjb2xvcnMnLCBpdGVtczogWyAnVGV4dENvbG9yJywgJ0JHQ29sb3InIF0gfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdhbGlnbicsIGl0ZW1zOiBbICdKdXN0aWZ5TGVmdCcsICdKdXN0aWZ5Q2VudGVyJywgJ0p1c3RpZnlSaWdodCcsICdKdXN0aWZ5QmxvY2snIF0gfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdsaW5rcycsIGl0ZW1zOiBbICdMaW5rJywgJ1VubGluaycgXSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ3BhcmFncmFwaCcsIGl0ZW1zOiBbICdOdW1iZXJlZExpc3QnLCAnQnVsbGV0ZWRMaXN0JywgJy0nLCAnT3V0ZGVudCcsICdJbmRlbnQnLCAnLScsICdCbG9ja3F1b3RlJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnaW5zZXJ0JywgaXRlbXM6IFsgJ0ltYWdlJywgJ1RhYmxlJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAndG9vbHMnLCBpdGVtczogWyAnTWF4aW1pemUnIF0gfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdlZGl0aW5nJywgaXRlbXM6IFsgJ1NjYXl0JyBdIH1cbiAgICAgICAgLy8gICAgIF0sXG4gICAgICAgIC8vICAgICBjdXN0b21Db25maWc6ICcnLFxuICAgICAgICAvLyAgICAgZGlzYWxsb3dlZENvbnRlbnQ6ICdpbWd7d2lkdGgsaGVpZ2h0LGZsb2F0fScsXG4gICAgICAgIC8vICAgICBleHRyYUFsbG93ZWRDb250ZW50OiAnaW1nW3dpZHRoLGhlaWdodCxhbGlnbl0nLFxuICAgICAgICAvLyAgICAgLy8gZXh0cmFQbHVnaW5zOiAndGFibGVyZXNpemUsdXBsb2FkaW1hZ2UsdXBsb2FkZmlsZScsXG4gICAgICAgIC8vICAgICBleHRyYVBsdWdpbnM6ICd0YWJsZXJlc2l6ZScsXG4gICAgICAgIC8vICAgICBoZWlnaHQ6IDgwMCxcbiAgICAgICAgLy8gICAgIGNvbnRlbnRzQ3NzOiBbICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC42LjEvZnVsbC1hbGwvY29udGVudHMuY3NzJyBdLFxuICAgICAgICAvLyAgICAgYm9keUNsYXNzOiAnZG9jdW1lbnQtZWRpdG9yJyxcbiAgICAgICAgLy8gICAgIGZvcm1hdF90YWdzOiAncDtoMTtoMjtoMztwcmUnLFxuICAgICAgICAvLyAgICAgcmVtb3ZlRGlhbG9nVGFiczogJ2ltYWdlOmFkdmFuY2VkO2xpbms6YWR2YW5jZWQnLFxuICAgICAgICAvLyAgICAgc3R5bGVzU2V0OiBbXG4gICAgICAgIC8vICAgICAgICAgLyogSW5saW5lIFN0eWxlcyAqL1xuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ01hcmtlcicsIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyAnY2xhc3MnOiAnbWFya2VyJyB9IH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnQ2l0ZWQgV29yaycsIGVsZW1lbnQ6ICdjaXRlJyB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ0lubGluZSBRdW90YXRpb24nLCBlbGVtZW50OiAncScgfSxcbiAgICAgICAgLy8gICAgICAgICAvKiBPYmplY3QgU3R5bGVzICovXG4gICAgICAgIC8vICAgICAgICAge1xuICAgICAgICAvLyAgICAgICAgICAgICBuYW1lOiAnU3BlY2lhbCBDb250YWluZXInLFxuICAgICAgICAvLyAgICAgICAgICAgICBlbGVtZW50OiAnZGl2JyxcbiAgICAgICAgLy8gICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNXB4IDEwcHgnLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNlZWUnLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjY2MnXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgbmFtZTogJ0NvbXBhY3QgdGFibGUnLFxuICAgICAgICAvLyAgICAgICAgICAgICBlbGVtZW50OiAndGFibGUnLFxuICAgICAgICAvLyAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjZWxscGFkZGluZzogJzUnLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgY2VsbHNwYWNpbmc6ICcwJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJvcmRlcjogJzEnLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgYm9yZGVyY29sb3I6ICcjY2NjJ1xuICAgICAgICAvLyAgICAgICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICdib3JkZXItY29sbGFwc2UnOiAnY29sbGFwc2UnXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ0JvcmRlcmxlc3MgVGFibGUnLCBlbGVtZW50OiAndGFibGUnLCBzdHlsZXM6IHsgJ2JvcmRlci1zdHlsZSc6ICdoaWRkZW4nLCAnYmFja2dyb3VuZC1jb2xvcic6ICcjRTZFNkZBJyB9IH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnU3F1YXJlIEJ1bGxldGVkIExpc3QnLCBlbGVtZW50OiAndWwnLCBzdHlsZXM6IHsgJ2xpc3Qtc3R5bGUtdHlwZSc6ICdzcXVhcmUnIH0gfVxuICAgICAgICAvLyAgICAgXVxuICAgICAgICAvLyB9ICk7XG5cbiAgICAgICAgQ0tFRElUT1IucmVwbGFjZShpZCwge1xuICAgICAgICAgICAgY3VzdG9tQ29uZmlnOiAnL2FwcHMvd3lzaXd5Zy9ja2VkaXRvci9jb25maWcuanMnXG4gICAgICAgIH0pO1xuXHR9LFxuXG4gICAgd3lzaXd5ZzogZnVuY3Rpb24oaWQpXG5cdHtcblx0XHQkKFsnIycsIGlkXS5qb2luKCcnKSkud3lzaXd5Zyh7XG5cdFx0XHR0b29sYmFyOiAndG9wJywgLy8gJ3NlbGVjdGlvbid8J3RvcCd8J3RvcC1zZWxlY3Rpb24nfCdib3R0b20nfCdib3R0b20tc2VsZWN0aW9uJ1xuICAgICAgICAgICAgaG90S2V5czoge1xuICAgICAgICAgICAgICAgICdjdHJsK2IgbWV0YStiJzogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICdjdHJsK2kgbWV0YStpJzogJ2l0YWxpYycsXG4gICAgICAgICAgICAgICAgJ2N0cmwrdSBtZXRhK3UnOiAndW5kZXJsaW5lJyxcbiAgICAgICAgICAgICAgICAnY3RybCt6IG1ldGEreic6ICd1bmRvJyxcbiAgICAgICAgICAgICAgICAnY3RybCt5IG1ldGEreSBtZXRhK3NoaWZ0K3onOiAncmVkbydcbiAgICAgICAgICAgIH1cblx0XHR9KTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbihpZCwgdHlwZSlcblx0e1xuXHRcdGlmICh0eXBlb2YodGhpc1t0eXBlXSkgIT09ICd1bmRlZmluZWQnKVxuXHRcdHtcblx0XHRcdHRoaXNbdHlwZV0oaWQpO1xuXHRcdH1cblx0fVxufTsiXX0=

"use strict";

;(function ($) {
    $.fn.timeoutClass = function (classname, timeout) {
        timeout = timeout || 10;
        var that = this;
        setTimeout(function () {
            $(that).toggleClass(classname);
        }, timeout);
    };
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVvdXQuY2xhc3MuanMiXSwibmFtZXMiOlsiJCIsImZuIiwidGltZW91dENsYXNzIiwiY2xhc3NuYW1lIiwidGltZW91dCIsInRoYXQiLCJzZXRUaW1lb3V0IiwidG9nZ2xlQ2xhc3MiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxDQUFDLFVBQVNBLENBQVQsRUFBVztBQUNUQSxNQUFFQyxFQUFGLENBQUtDLFlBQUwsR0FBb0IsVUFBU0MsU0FBVCxFQUFvQkMsT0FBcEIsRUFBNkI7QUFDN0NBLGtCQUFVQSxXQUFXLEVBQXJCO0FBQ0EsWUFBSUMsT0FBTyxJQUFYO0FBQ0FDLG1CQUFXLFlBQVU7QUFDakJOLGNBQUVLLElBQUYsRUFBUUUsV0FBUixDQUFvQkosU0FBcEI7QUFDSCxTQUZELEVBRUdDLE9BRkg7QUFHSCxLQU5EO0FBT0gsQ0FSQSxFQVFFSSxNQVJGIiwiZmlsZSI6InRpbWVvdXQuY2xhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uKCQpe1xuICAgICQuZm4udGltZW91dENsYXNzID0gZnVuY3Rpb24oY2xhc3NuYW1lLCB0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSB0aW1lb3V0IHx8IDEwO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhhdCkudG9nZ2xlQ2xhc3MoY2xhc3NuYW1lKTtcbiAgICAgICAgfSwgdGltZW91dCk7XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iXX0=

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _addslashes(str) {
  return str.replace('/(["\'\])/g', "\\$1").replace('/\0/g', "\\0");
}
function _stripslashes(str) {
  return str.replace('/\0/g', '0').replace('/\(.)/g', '$1');
}
function clearCookie() {
  var now = new Date();var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);this.setCookie('co' + this.obj, 'cookieValue', yesterday);this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
};
function setCookie(cookieName, cookieValue, expires, path, domain, secure) {
  document.cookie = escape(cookieName) + '=' + escape(cookieValue) + (expires ? '; expires=' + expires.toGMTString() : '') + (path ? '; path=' + path : '') + (domain ? '; domain=' + domain : '') + (secure ? '; secure' : '');
};
function getCookie(cookieName) {
  var cookieValue = '';var posName = document.cookie.indexOf(escape(cookieName) + '=');if (posName != -1) {
    var posValue = posName + (escape(cookieName) + '=').length;var endPos = document.cookie.indexOf(';', posValue);if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));else cookieValue = unescape(document.cookie.substring(posValue));
  }return cookieValue;
};
function __debug(arr, level) {
  var dumped_text = "";if (!level) level = 0;var level_padding = "";for (var j = 0; j < level + 1; j++) {
    level_padding += "    ";
  }if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) == 'object') {
    for (var item in arr) {
      var value = arr[item];if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        dumped_text += level_padding + "'" + item + "' ...\n";dumped_text += dump(value, level + 1);
      } else {
        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
      }
    }
  } else {
    dumped_text = "===>" + arr + "<===(" + (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) + ")";
  }return dumped_text;
}

function serialize(r) {
  var e,
      a,
      n = "",
      t = 0,
      o = function o(r) {
    var e,
        a,
        n,
        t,
        o = typeof r === 'undefined' ? 'undefined' : _typeof(r);if ("object" === o && !r) return "null";if ("object" === o) {
      if (!r.constructor) return "object";(e = (n = r.constructor.toString()).match(/(\w+)\(/)) && (n = e[1].toLowerCase()), t = ["boolean", "number", "string", "array"];for (a in t) {
        if (n === t[a]) {
          o = t[a];break;
        }
      }
    }return o;
  },
      c = o(r);switch (c) {case "function":
      e = "";break;case "boolean":
      e = "b:" + (r ? "1" : "0");break;case "number":
      e = (Math.round(r) === r ? "i" : "d") + ":" + r;break;case "string":
      e = "s:" + function (r) {
        var e = 0,
            a = 0,
            n = r.length,
            t = "";for (a = 0; a < n; a++) {
          e += (t = r.charCodeAt(a)) < 128 ? 1 : t < 2048 ? 2 : 3;
        }return e;
      }(r) + ':"' + r + '"';break;case "array":case "object":
      e = "a";for (a in r) {
        if (r.hasOwnProperty(a)) {
          if ("function" === o(r[a])) continue;n += serialize(a.match(/^[0-9]+$/) ? parseInt(a, 10) : a) + serialize(r[a]), t++;
        }
      }e += ":" + t + ":{" + n + "}";break;case "undefined":default:
      e = "N";}return "object" !== c && "array" !== c && (e += ";"), e;
}
function unserialize(n) {
  function r(n, e) {
    var t,
        u,
        s,
        c,
        l,
        f,
        h,
        d,
        p,
        w,
        g,
        b,
        k,
        v,
        I,
        y,
        E,
        S,
        j = 0,
        m = function m(n) {
      return n;
    };switch (e || (e = 0), t = n.slice(e, e + 1).toLowerCase(), u = e + 2, t) {case "i":
        m = function m(n) {
          return parseInt(n, 10);
        }, j = (p = o(n, u, ";"))[0], d = p[1], u += j + 1;break;case "b":
        m = function m(n) {
          return 0 !== parseInt(n, 10);
        }, j = (p = o(n, u, ";"))[0], d = p[1], u += j + 1;break;case "d":
        m = function m(n) {
          return parseFloat(n);
        }, j = (p = o(n, u, ";"))[0], d = p[1], u += j + 1;break;case "n":
        d = null;break;case "s":
        j = (w = o(n, u, ":"))[0], g = w[1], j = (p = i(n, (u += j + 2) + 1, parseInt(g, 10)))[0], d = p[1], u += j + 2, j !== parseInt(g, 10) && j !== d.length && a("SyntaxError", "String length mismatch");break;case "a":
        for (d = {}, j = (s = o(n, u, ":"))[0], c = s[1], u += j + 2, f = parseInt(c, 10), l = !0, b = 0; b < f; b++) {
          I = (v = r(n, u))[1], k = v[2], E = (y = r(n, u += I))[1], S = y[2], u += E, k !== b && (l = !1), d[k] = S;
        }if (l) {
          for (h = new Array(f), b = 0; b < f; b++) {
            h[b] = d[b];
          }d = h;
        }u += 1;break;default:
        a("SyntaxError", "Unknown / Unhandled data type(s): " + t);}return [t, u - e, m(d)];
  }var e = "undefined" != typeof window ? window : global,
      t = function t(n) {
    for (var r = n.length, e = n.length - 1; e >= 0; e--) {
      var t = n.charCodeAt(e);t > 127 && t <= 2047 ? r++ : t > 2047 && t <= 65535 && (r += 2), t >= 56320 && t <= 57343 && e--;
    }return r - 1;
  },
      a = function a(n, r, t, _a) {
    throw new e[n](r, t, _a);
  },
      o = function o(n, r, e) {
    for (var t = 2, o = [], i = n.slice(r, r + 1); i !== e;) {
      t + r > n.length && a("Error", "Invalid"), o.push(i), i = n.slice(r + (t - 1), r + t), t += 1;
    }return [o.length, o.join("")];
  },
      i = function i(n, r, e) {
    var a, o, i;for (i = [], a = 0; a < e; a++) {
      o = n.slice(r + (a - 1), r + a), i.push(o), e -= t(o);
    }return [i.length, i.join("")];
  };return r(n + "", 0)[2];
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbmRvcnMuanMiXSwibmFtZXMiOlsiX2FkZHNsYXNoZXMiLCJzdHIiLCJyZXBsYWNlIiwiX3N0cmlwc2xhc2hlcyIsImNsZWFyQ29va2llIiwibm93IiwiRGF0ZSIsInllc3RlcmRheSIsImdldFRpbWUiLCJzZXRDb29raWUiLCJvYmoiLCJjb29raWVOYW1lIiwiY29va2llVmFsdWUiLCJleHBpcmVzIiwicGF0aCIsImRvbWFpbiIsInNlY3VyZSIsImRvY3VtZW50IiwiY29va2llIiwiZXNjYXBlIiwidG9HTVRTdHJpbmciLCJnZXRDb29raWUiLCJwb3NOYW1lIiwiaW5kZXhPZiIsInBvc1ZhbHVlIiwibGVuZ3RoIiwiZW5kUG9zIiwidW5lc2NhcGUiLCJzdWJzdHJpbmciLCJfX2RlYnVnIiwiYXJyIiwibGV2ZWwiLCJkdW1wZWRfdGV4dCIsImxldmVsX3BhZGRpbmciLCJqIiwiaXRlbSIsInZhbHVlIiwiZHVtcCIsInNlcmlhbGl6ZSIsInIiLCJlIiwiYSIsIm4iLCJ0IiwibyIsImNvbnN0cnVjdG9yIiwidG9TdHJpbmciLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiYyIsIk1hdGgiLCJyb3VuZCIsImNoYXJDb2RlQXQiLCJoYXNPd25Qcm9wZXJ0eSIsInBhcnNlSW50IiwidW5zZXJpYWxpemUiLCJ1IiwicyIsImwiLCJmIiwiaCIsImQiLCJwIiwidyIsImciLCJiIiwiayIsInYiLCJJIiwieSIsIkUiLCJTIiwibSIsInNsaWNlIiwicGFyc2VGbG9hdCIsImkiLCJBcnJheSIsIndpbmRvdyIsImdsb2JhbCIsInB1c2giLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsU0FBU0EsV0FBVCxDQUFzQkMsR0FBdEIsRUFBMkI7QUFBQyxTQUFPQSxJQUFJQyxPQUFKLENBQVksYUFBWixFQUEyQixNQUEzQixFQUFtQ0EsT0FBbkMsQ0FBMkMsT0FBM0MsRUFBb0QsS0FBcEQsQ0FBUDtBQUFtRTtBQUMvRixTQUFTQyxhQUFULENBQXdCRixHQUF4QixFQUE2QjtB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QztBQUF5Q0csVUFBRUosQ0FBRixHQUFJRyxFQUFFakIsTUFBTixJQUFjZ0IsRUFBRSxPQUFGLEVBQVUsU0FBVixDQUFkLEVBQW1DRyxFQUFFbUMsSUFBRixDQUFPSixDQUFQLENBQW5DLEVBQTZDQSxJQUFFakMsRUFBRStCLEtBQUYsQ0FBUWxDLEtBQUdJLElBQUUsQ0FBTCxDQUFSLEVBQWdCSixJQUFFSSxDQUFsQixDQUEvQyxFQUFvRUEsS0FBRyxDQUF2RTtBQUF6QyxLQUFrSCxPQUFNLENBQUNDLEVBQUVuQixNQUFILEVBQVVtQixFQUFFb0MsSUFBRixDQUFPLEVBQVAsQ0FBVixDQUFOO0FBQTRCLEdBQXhaO0FBQUEsTUFBeVpMLElBQUUsV0FBU2pDLENBQVQsRUFBV0gsQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxRQUFJQyxDQUFKLEVBQU1HLENBQU4sRUFBUStCLENBQVIsQ0FBVSxLQUFJQSxJQUFFLEVBQUYsRUFBS2xDLElBQUUsQ0FBWCxFQUFhQSxJQUFFRCxDQUFmLEVBQWlCQyxHQUFqQjtBQUFxQkcsVUFBRUYsRUFBRStCLEtBQUYsQ0FBUWxDLEtBQUdFLElBQUUsQ0FBTCxDQUFSLEVBQWdCRixJQUFFRSxDQUFsQixDQUFGLEVBQXVCa0MsRUFBRUksSUFBRixDQUFPbkMsQ0FBUCxDQUF2QixFQUFpQ0osS0FBR0csRUFBRUMsQ0FBRixDQUFwQztBQUFyQixLQUE4RCxPQUFNLENBQUMrQixFQUFFbEQsTUFBSCxFQUFVa0QsRUFBRUssSUFBRixDQUFPLEVBQVAsQ0FBVixDQUFOO0FBQTRCLEdBQS9nQixDQUFnaEIsT0FBT3pDLEVBQUVHLElBQUUsRUFBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBQVA7QUFBb0IiLCJmaWxlIjoidmVuZG9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF9hZGRzbGFzaGVzKCBzdHIgKXtyZXR1cm4gc3RyLnJlcGxhY2UoJy8oW1wiXFwnXFxdKS9nJywgXCJcXFxcJDFcIikucmVwbGFjZSgnL1xcMC9nJywgXCJcXFxcMFwiKTt9XG5mdW5jdGlvbiBfc3RyaXBzbGFzaGVzKCBzdHIgKXtyZXR1cm4gc3RyLnJlcGxhY2UoJy9cXDAvZycsICcwJykucmVwbGFjZSgnL1xcKC4pL2cnLCAnJDEnKTt9XG5mdW5jdGlvbiBjbGVhckNvb2tpZSgpe3ZhciBub3cgPSBuZXcgRGF0ZSgpO3ZhciB5ZXN0ZXJkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gMTAwMCAqIDYwICogNjAgKiAyNCk7dGhpcy5zZXRDb29raWUoJ2NvJyArIHRoaXMub2JqLCAnY29va2llVmFsdWUnLCB5ZXN0ZXJkYXkpO3RoaXMuc2V0Q29va2llKCdjcycgKyB0aGlzLm9iaiwgJ2Nvb2tpZVZhbHVlJywgeWVzdGVyZGF5KTt9O1xuZnVuY3Rpb24gc2V0Q29va2llKGNvb2tpZU5hbWUsIGNvb2tpZVZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSl7ZG9jdW1lbnQuY29va2llPWVzY2FwZShjb29raWVOYW1lKSArICc9JyArIGVzY2FwZShjb29raWVWYWx1ZSkrKGV4cGlyZXMgPyAnOyBleHBpcmVzPScgKyBleHBpcmVzLnRvR01UU3RyaW5nKCkgOiAnJykrKHBhdGggPyAnOyBwYXRoPScgKyBwYXRoIDogJycpKyhkb21haW4gPyAnOyBkb21haW49JyArIGRvbWFpbiA6ICcnKSsoc2VjdXJlID8gJzsgc2VjdXJlJyA6ICcnKTt9O1xuZnVuY3Rpb24gZ2V0Q29va2llIChjb29raWVOYW1lKXt2YXIgY29va2llVmFsdWUgPSAnJzt2YXIgcG9zTmFtZSA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGVzY2FwZShjb29raWVOYW1lKSArICc9Jyk7aWYgKHBvc05hbWUgIT0gLTEpIHt2YXIgcG9zVmFsdWUgPSBwb3NOYW1lICsgKGVzY2FwZShjb29raWVOYW1lKSArICc9JykubGVuZ3RoO3ZhciBlbmRQb3MgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZignOycsIHBvc1ZhbHVlKTtpZiAoZW5kUG9zICE9IC0xKSBjb29raWVWYWx1ZSA9IHVuZXNjYXBlKGRvY3VtZW50LmNvb2tpZS5zdWJzdHJpbmcocG9zVmFsdWUsIGVuZFBvcykpO2Vsc2UgY29va2llVmFsdWUgPSB1bmVzY2FwZShkb2N1bWVudC5jb29raWUuc3Vic3RyaW5nKHBvc1ZhbHVlKSk7fXJldHVybiAoY29va2llVmFsdWUpO307XG5mdW5jdGlvbiBfX2RlYnVnKGFycixsZXZlbCkge3ZhciBkdW1wZWRfdGV4dCA9IFwiXCI7aWYgKCFsZXZlbCkgbGV2ZWwgPSAwO3ZhciBsZXZlbF9wYWRkaW5nID0gXCJcIjtmb3IodmFyIGo9MDtqPGxldmVsKzE7aisrKSBsZXZlbF9wYWRkaW5nICs9IFwiICAgIFwiO2lmICh0eXBlb2YoYXJyKSA9PSAnb2JqZWN0JykgeyBmb3IodmFyIGl0ZW0gaW4gYXJyKSB7dmFyIHZhbHVlID0gYXJyW2l0ZW1dO2lmICh0eXBlb2YodmFsdWUpID09ICdvYmplY3QnKSB7IGR1bXBlZF90ZXh0ICs9IGxldmVsX3BhZGRpbmcgKyBcIidcIiArIGl0ZW0gKyBcIicgLi4uXFxuXCI7ZHVtcGVkX3RleHQgKz0gZHVtcCh2YWx1ZSxsZXZlbCsxKTt9IGVsc2Uge2R1bXBlZF90ZXh0ICs9IGxldmVsX3BhZGRpbmcgKyBcIidcIiArIGl0ZW0gKyBcIicgPT4gXFxcIlwiICsgdmFsdWUgKyBcIlxcXCJcXG5cIjt9fX0gZWxzZSB7IGR1bXBlZF90ZXh0ID0gXCI9PT0+XCIrYXJyK1wiPD09PShcIit0eXBlb2YoYXJyKStcIilcIjt9cmV0dXJuIGR1bXBlZF90ZXh0O31cblxuZnVuY3Rpb24gc2VyaWFsaXplKHIpe3ZhciBlLGEsbj1cIlwiLHQ9MCxvPWZ1bmN0aW9uKHIpe3ZhciBlLGEsbix0LG89dHlwZW9mIHI7aWYoXCJvYmplY3RcIj09PW8mJiFyKXJldHVyblwibnVsbFwiO2lmKFwib2JqZWN0XCI9PT1vKXtpZighci5jb25zdHJ1Y3RvcilyZXR1cm5cIm9iamVjdFwiOyhlPShuPXIuY29uc3RydWN0b3IudG9TdHJpbmcoKSkubWF0Y2goLyhcXHcrKVxcKC8pKSYmKG49ZVsxXS50b0xvd2VyQ2FzZSgpKSx0PVtcImJvb2xlYW5cIixcIm51bWJlclwiLFwic3RyaW5nXCIsXCJhcnJheVwiXTtmb3IoYSBpbiB0KWlmKG49PT10W2FdKXtvPXRbYV07YnJlYWt9fXJldHVybiBvfSxjPW8ocik7c3dpdGNoKGMpe2Nhc2VcImZ1bmN0aW9uXCI6ZT1cIlwiO2JyZWFrO2Nhc2VcImJvb2xlYW5cIjplPVwiYjpcIisocj9cIjFcIjpcIjBcIik7YnJlYWs7Y2FzZVwibnVtYmVyXCI6ZT0oTWF0aC5yb3VuZChyKT09PXI/XCJpXCI6XCJkXCIpK1wiOlwiK3I7YnJlYWs7Y2FzZVwic3RyaW5nXCI6ZT1cInM6XCIrZnVuY3Rpb24ocil7dmFyIGU9MCxhPTAsbj1yLmxlbmd0aCx0PVwiXCI7Zm9yKGE9MDthPG47YSsrKWUrPSh0PXIuY2hhckNvZGVBdChhKSk8MTI4PzE6dDwyMDQ4PzI6MztyZXR1cm4gZX0ocikrJzpcIicrcisnXCInO2JyZWFrO2Nhc2VcImFycmF5XCI6Y2FzZVwib2JqZWN0XCI6ZT1cImFcIjtmb3IoYSBpbiByKWlmKHIuaGFzT3duUHJvcGVydHkoYSkpe2lmKFwiZnVuY3Rpb25cIj09PW8oclthXSkpY29udGludWU7bis9c2VyaWFsaXplKGEubWF0Y2goL15bMC05XSskLyk/cGFyc2VJbnQoYSwxMCk6YSkrc2VyaWFsaXplKHJbYV0pLHQrK31lKz1cIjpcIit0K1wiOntcIituK1wifVwiO2JyZWFrO2Nhc2VcInVuZGVmaW5lZFwiOmRlZmF1bHQ6ZT1cIk5cIn1yZXR1cm5cIm9iamVjdFwiIT09YyYmXCJhcnJheVwiIT09YyYmKGUrPVwiO1wiKSxlfVxuZnVuY3Rpb24gdW5zZXJpYWxpemUobil7ZnVuY3Rpb24gcihuLGUpe3ZhciB0LHUscyxjLGwsZixoLGQscCx3LGcsYixrLHYsSSx5LEUsUyxqPTAsbT1mdW5jdGlvbihuKXtyZXR1cm4gbn07c3dpdGNoKGV8fChlPTApLHQ9bi5zbGljZShlLGUrMSkudG9Mb3dlckNhc2UoKSx1PWUrMix0KXtjYXNlXCJpXCI6bT1mdW5jdGlvbihuKXtyZXR1cm4gcGFyc2VJbnQobiwxMCl9LGo9KHA9byhuLHUsXCI7XCIpKVswXSxkPXBbMV0sdSs9aisxO2JyZWFrO2Nhc2VcImJcIjptPWZ1bmN0aW9uKG4pe3JldHVybiAwIT09cGFyc2VJbnQobiwxMCl9LGo9KHA9byhuLHUsXCI7XCIpKVswXSxkPXBbMV0sdSs9aisxO2JyZWFrO2Nhc2VcImRcIjptPWZ1bmN0aW9uKG4pe3JldHVybiBwYXJzZUZsb2F0KG4pfSxqPShwPW8obix1LFwiO1wiKSlbMF0sZD1wWzFdLHUrPWorMTticmVhaztjYXNlXCJuXCI6ZD1udWxsO2JyZWFrO2Nhc2VcInNcIjpqPSh3PW8obix1LFwiOlwiKSlbMF0sZz13WzFdLGo9KHA9aShuLCh1Kz1qKzIpKzEscGFyc2VJbnQoZywxMCkpKVswXSxkPXBbMV0sdSs9aisyLGohPT1wYXJzZUludChnLDEwKSYmaiE9PWQubGVuZ3RoJiZhKFwiU3ludGF4RXJyb3JcIixcIlN0cmluZyBsZW5ndGggbWlzbWF0Y2hcIik7YnJlYWs7Y2FzZVwiYVwiOmZvcihkPXt9LGo9KHM9byhuLHUsXCI6XCIpKVswXSxjPXNbMV0sdSs9aisyLGY9cGFyc2VJbnQoYywxMCksbD0hMCxiPTA7YjxmO2IrKylJPSh2PXIobix1KSlbMV0saz12WzJdLEU9KHk9cihuLHUrPUkpKVsxXSxTPXlbMl0sdSs9RSxrIT09YiYmKGw9ITEpLGRba109UztpZihsKXtmb3IoaD1uZXcgQXJyYXkoZiksYj0wO2I8ZjtiKyspaFtiXT1kW2JdO2Q9aH11Kz0xO2JyZWFrO2RlZmF1bHQ6YShcIlN5bnRheEVycm9yXCIsXCJVbmtub3duIC8gVW5oYW5kbGVkIGRhdGEgdHlwZShzKTogXCIrdCl9cmV0dXJuW3QsdS1lLG0oZCldfXZhciBlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Omdsb2JhbCx0PWZ1bmN0aW9uKG4pe2Zvcih2YXIgcj1uLmxlbmd0aCxlPW4ubGVuZ3RoLTE7ZT49MDtlLS0pe3ZhciB0PW4uY2hhckNvZGVBdChlKTt0PjEyNyYmdDw9MjA0Nz9yKys6dD4yMDQ3JiZ0PD02NTUzNSYmKHIrPTIpLHQ+PTU2MzIwJiZ0PD01NzM0MyYmZS0tfXJldHVybiByLTF9LGE9ZnVuY3Rpb24obixyLHQsYSl7dGhyb3cgbmV3IGVbbl0ocix0LGEpfSxvPWZ1bmN0aW9uKG4scixlKXtmb3IodmFyIHQ9MixvPVtdLGk9bi5zbGljZShyLHIrMSk7aSE9PWU7KXQrcj5uLmxlbmd0aCYmYShcIkVycm9yXCIsXCJJbnZhbGlkXCIpLG8ucHVzaChpKSxpPW4uc2xpY2UocisodC0xKSxyK3QpLHQrPTE7cmV0dXJuW28ubGVuZ3RoLG8uam9pbihcIlwiKV19LGk9ZnVuY3Rpb24obixyLGUpe3ZhciBhLG8saTtmb3IoaT1bXSxhPTA7YTxlO2ErKylvPW4uc2xpY2UocisoYS0xKSxyK2EpLGkucHVzaChvKSxlLT10KG8pO3JldHVybltpLmxlbmd0aCxpLmpvaW4oXCJcIildfTtyZXR1cm4gcihuK1wiXCIsMClbMl19Il19
