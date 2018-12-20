var FP = (function(w, d, b) {

	var $panel = d.getElementById('fp-panel');
	var $fixed = d.querySelector('.j-panel-fixed-link');

	var $toggler = d.getElementById('fp-debugger-toggle-log');
	var $logger = d.getElementById('fp-debugger-logger');

	function _getCookie(name) {
	    var matches = document.cookie.match(new RegExp(
	        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	    ));
	    return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function _setCookie(name, value, options) {
	    options = options || {};

	    var expires = options.expires;

	    if (typeof expires == "number" && expires) {
	        var d = new Date();
	        d.setTime(d.getTime() + expires * 1000);
	        expires = options.expires = d;
	    }
	    if (expires && expires.toUTCString) {
	        options.expires = expires.toUTCString();
	    }

	    value = encodeURIComponent(value);

	    var updatedCookie = name + "=" + value;

	    for (var propName in options) {
	        updatedCookie += "; " + propName;
	        var propValue = options[propName];
	        if (propValue !== true) {
	            updatedCookie += "=" + propValue;
	        }
	    }

	    document.cookie = updatedCookie;
	}

	function _deleteCookie(name) {
	    _setCookie(name, "", {
	        expires: -1
	    })
	}

	function _clearCache (action, callback)
	{
		var request = pegasus(`${PANEL_API_URL}/${action}`);

		request.then(
		    // success handler
		    function(data, xhr) {
		    	callback.call(this, JSON.stringify(data));
		    },
		    // error handler (optional)
		    function(data, xhr) {
		    	callback.call(this, data);
		    }
		);
	}

	function _fixPanel (toggle)
	{
		if (typeof(toggle) !== 'undefined')
		{
			$fixed.classList.toggle('is-panel-fixed', toggle);
			$panel.classList.toggle('is-panel-absolute', toggle);
		}
		else {
			$fixed.classList.toggle('is-panel-fixed');

			var isAbsolute = $fixed.classList.contains('is-panel-fixed');

			$panel.classList.toggle('is-panel-absolute', isAbsolute);

			_setCookie('FP_absolute_panel', isAbsolute);
		}
	}

	function _notify (message, type)
	{
		console.log(type, ': ', message);
	}

	function _onLoad ()
	{
		if (_getCookie('FP_absolute_panel') == 'true')
		{
			_fixPanel(true);
		}
	}

	function _events ()
	{
    	$toggler.addEventListener('click', function() {
    		$logger.classList.toggle('is-visible');
    	});

    	var $links = d.querySelectorAll('.j-panel-ajax-link');

    	$links.forEach(function($link) {
    		$link.addEventListener('click', function() {
    			var $this = this;

				$this.classList.toggle('is-panel-loaded');

				_clearCache($this.dataset.action, function(response) {
					_notify('clear cache complete');

					setTimeout(function() {
						$this.classList.toggle('is-panel-loaded');
					}, 100);
				});
			});
    	});

    	$fixed.addEventListener('click', function() {
			_fixPanel();
		});
	}

    return {

        init: function() {
        	_onLoad();
        	_events();
        }

    };

})(window, document, document.body);
