(function(){
	"use strict";
	/**
	 * PULSE is the window level object to hold all Pulse JavaScript
	 * PULSE.core should only be extended within the pulseJS repo
	 * PULSE.app should be extended on for each project/platform that uses pulseJS
	 * @type {Object}
	 */
	if(!window.PULSE){window.PULSE={};}
	window.PULSE.core = {};
	window.PULSE.app = {};
	window.PULSE.ui = {};

}());

(function(){'use strict';window.PULSE.core.common = {};window.PULSE.core.data = {};window.PULSE.core.date = {};window.PULSE.core.dom = {};window.PULSE.core.event = {};window.PULSE.core.localStorage = {};window.PULSE.core.object = {};window.PULSE.core.style = {};window.PULSE.core.url = {};}());
( function( core ) {

	/**
	 * use handlebars syntax to replace keys in a string with
	 * value from a corresponding map
	 *
	 * @param {string} string string with handlebars {{replacement}} points
	 * @param {object.<string, string>} map key val map of replacement val's
	 */
	core.common.formatString = function( string, map ) {

		if( string && map ) {
			var mapKeys = Object.keys( map );
			for( var t = 0; t < mapKeys.length; t++ ) {
				string = string.replace( '{{' + mapKeys[ t ] + '}}', map[ mapKeys[ t ] ] );
			}
			return string;
		}
		return false;
	};

	/**
	 * Add commas in an integer
	 *
	 * @param {int} num Number to be commafied
	 * @return {String} Commafied number
	 */
	core.common.commafy = function( num )
	{
		return num.toString().replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
			return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
		});
	};

	/**
	 * Create method for making roman numberals out of an integer
	 *
	 * @param {int} num Number to be romonized
	 * @return {String} Romanized number
	 */
	core.common.romanize = function ( num )
	{
		if (isNaN(parseFloat(num)) || !isFinite(num))
			return false;

		var	digits = String(+num).split(""),
			key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
			       "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
			       "","I","II","III","IV","V","VI","VII","VIII","IX"],
			roman = "",
			i = 3;
		while (i--)
			roman = (key[+digits.pop() + (i * 10)] || "") + roman;
		return Array(+digits.join("") + 1).join("M") + roman;
	};

	/**
	 * Create method for converting roman numberals into integers
	 *
	 * @param {String} str Roman numeral number
	 * @return {int} num Number as roman numeral
	 */
	core.common.deromanize = function( strRomanNumeral )
	{
		var	str = strRomanNumeral.toUpperCase(),
			validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
			token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
			key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
			num = 0, m;
		if (!(str && validator.test(str)))
			return false;

		while ((m = token.exec(str)) !== null) {
			num += key[m[0]];
		}

		return num;
	};


} )( PULSE.core );

/*globals PULSE.core */

( function( core ) {

	/**
	 * @namespace core.quicksort.private
	 */

	/**
	 * split the list
	 *
	 * @param {Array} list the list to sort
	 * @param {int} min start index of sort region
	 * @param {int} max end of the sort index
	 * @param {function} compare taking two items return -1 if a < b 0 if a = b and 1 if a > b
	 * @returns {int} index
	 */
	var quicksortSplit = function( list, min, max, compare ) {

		var p = list[ max ];
		var i = min;
		for( var j = min; j < max; j++ ) {
			if( compare( list[ j ], p ) >= 0 ) {

				var tmp = list[ i ];
				list[ i ] = list[ j ];
				list[ j ] = tmp;
				i = i + 1;
			}
		}
		var tmp2 = list[ i ];
		list[ i ] = list[ max ];
		list[ max ] = tmp2;

		return i;

	};

	/**
	 * sort a list quickly, using (naive) pivots,
	 * list will be sorted in place
	 *
	 * @param {Array} list the list to sort
	 * @param {int} min start index of sort region
	 * @param {int} max end of the sort index
	 * @param {function} compare taking two items return -1 if a < b 0 if a = b and 1 if a > b
	 */

	core.common.quicksort = function( list, min, max, compare ) {

		if( min < max ) {
			var split = quicksortSplit( list, min, max, compare );
			core.common.quicksort( list, min, split - 1, compare );
			core.common.quicksort( list, split + 1, max, compare );
		}
	};

} )( PULSE.core );

/*globals PULSE.core */

( function( core ) {
	"use strict";

	/**
	 * @namespace core.getTweetModel.private
	 */

	var markUpLinks = function(string, entities)
	{
	    // to support the old way of doing things, when entities weren't use
	    // to determine links to pages or media and the URL was directly processed
	    // from the tweet text body
	    if (!entities)
	    {
	        string = string.replace(/(https{0,1}:\/\/\S+)/g, '<a target="_blank" href="$1">$1</a>')
	            .replace(/@(\S+)/g, '<a target="_blank" href="http://twitter.com/$1">@$1</a>')
	            .replace(/#(\S+)/g,
	                '<a target="_blank" href="http://twitter.com/#!/search?q=%23$1">#$1</a>');

	        return string;
	    }

	    // extrapolate URLs from the identified entities of the tweet
	    var entitiesArray = [];
		var html;

	    if (entities.urls)
	    {
	        for (var i = 0, iLimit = entities.urls.length; i < iLimit; i++)
	        {
	            var entity = entities.urls[i];

	            html = '<a href="' +
	                entity.url +
	                '" title="' +
	                entity.expanded_url +
	                '" target="_blank">' +
	                entity.display_url +
	                '</a>';

	            entitiesArray.push(
	            {
	                html: html,
	                original: entity.url,
	                start: entity.indices[0],
	                end: entity.indices[1]
	            });
	        }
	    }

	    // extrapolate URLs from the identified entities of the tweet
	    if (entities.media)
	    {
	        for (var j = 0, jLimit = entities.media.length; j < jLimit; j++)
	        {
	            var jEntity = entities.media[j];

	            html = '<a href="' +
	                jEntity.url +
	                '" title="' +
	                jEntity.expanded_url +
	                '" target="_blank">' +
	                jEntity.display_url +
	                '</a>';

	            entitiesArray.push(
	            {
	                html: html,
	                original: jEntity.url,
	                start: jEntity.indices[0],
	                end: jEntity.indices[1]
	            });
	        }
	    }

	    if (entities.user_mentions)
	    {
	        for (var k = 0, kLimit = entities.user_mentions.length; k < kLimit; k++)
	        {
	            var kEntity = entities.user_mentions[k];

	            var url = getUserAccountUrl(kEntity.screen_name);

	            html = '<a href="' +
	                url +
	                '" target="_blank">&#64;' +
	                kEntity.screen_name +
	                '</a>';

	            entitiesArray.push(
	            {
	                html: html,
	                original: '@' + kEntity.screen_name,
	                start: kEntity.indices[0],
	                end: kEntity.indices[1]
	            });
	        }
	    }

	    if (entities.hashtags)
	    {
	        for (var l = 0, lLimit = entities.hashtags.length; l < lLimit; l++)
	        {
	            var lEntity = entities.hashtags[l];

	            html = '<a href="' +
	                getSearchTagUrl(lEntity.text) +
	                '" target="_blank">&#35;' +
	                lEntity.text +
	                '</a>';

	            entitiesArray.push(
	            {
	                html: html,
	                original: '#' + lEntity.text,
	                start: lEntity.indices[0],
	                end: lEntity.indices[1]
	            });
	        }
	    }

	    /**
	     * Since the entities are ordered by type, sort the array by their start indice,
	     * so they are in the order of appearances
	     */
	    entitiesArray.sort(function(a, b)
	    {
	        return a.start - b.start;
	    });

	    // re-do start/end indices for entities
	    // this is a fix accounting for two-byte characters read as ASCII
	    for (var m = 0, mLimit = entitiesArray.length; m < mLimit; m++)
	    {
	        var mEntity = entitiesArray[m];

	        var lowercaseString = string.toLowerCase();
	        var lowercaseOriginal = mEntity.original.toLowerCase();
	        mEntity.start = lowercaseString.search( lowercaseOriginal );
	        mEntity.end = mEntity.start + mEntity.original.length;
	    }

	    /**
	     * The new tweet body, with anchor tags rather than just plain text
	     * @type {String}
	     */
	    var newString = '';

	    /**
	     * Used to determine where in the original tweet body we're last
	     * @type {Number}
	     */
	    var previousIdx = 0;

	    /**
	     * Go through all entities (if any) and replace their plain text version with
	     * their anchor-tag equivalents
	     * @type {Number}
	     */
	    for (var n = 0, nLimit = entitiesArray.length; n < nLimit; n++)
	    {
	        var nEntity = entitiesArray[n];
	        var length = nEntity.start - previousIdx;

	        newString += string.substr(previousIdx, length);
	        newString += nEntity.html;

	        previousIdx = nEntity.end;
	    }

	    /**
	     * At the end, add what's left of the original string
	     */
	    newString += string.substr(previousIdx);

	    return newString;
	};

	var getUserAccountUrl = function( screenName )
	{
		return "http://twitter.com/" + screenName;
	};

	var getSearchTagUrl = function(topic)
	{
	    return "http://twitter.com/search?q=%23" + topic;
	};

	var parseTwitterDate = function( timestamp )
	{
	    var date = new Date( Date.parse( timestamp ) );
	    if  ( K.ie )
	    {
	        date = Date.parse( timestamp.replace(/( \+)/, ' UTC$1' ) );
	    }

	    return date;
	};

	var getPermalink = function(tweet)
	{
	    var userName = tweet.user.screen_name;
	    var userUrl = getUserAccountUrl(userName);

	    return userUrl + "/status/" + tweet.id_str;
	};

	// from http://widgets.twimg.com/j/1/widget.js
	var K = function()
	{
	    var a = navigator.userAgent;
	    return {
	        ie: a.match(/MSIE\s([^;]*)/)
	    };
	}();


	/**
	 * creates tweet model
	 * @param {Object} tweet Raw tweet data from canary
	 * @returns {Object} model Simplified tweet model
	 */
	core.common.getTweetModel = function ( tweet )
	{
		var model = {};

		var userAccountLink = getUserAccountUrl( tweet.user.screen_name );
		var tweetDate = tweet.timestamp_ms ? new Date( parseInt( tweet.timestamp_ms, undefined ) ) : parseTwitterDate( tweet.created_at );
		var photo = '';

		if( tweet.entities && tweet.entities.media )
	    {
	        for( var i = 0, iLimit = tweet.entities.media.length; i < iLimit; i++ )
	        {
	            if( tweet.entities.media[i].type === 'photo' )
	            {
	                photo = tweet.entities.media[i].media_url;
	            }
	        }
	    }

		model = {
	        timestamp: tweet.timestamp_ms,
	        date : tweetDate,
	        id: tweet.id_str,
	        text: markUpLinks( tweet.text ),
	        link: getPermalink( tweet ),
	        photo: photo,
	        user: {
	            id: tweet.user.id_str,
	            name: tweet.user.name,
	            account: tweet.user.screen_name,
	            link: userAccountLink,
	            description: tweet.user.description,
	            avatarUrl: tweet.user.profile_image_url
	        },
	        favorites: tweet.favorite_count,
	        retweets: tweet.retweet_count
	    };

		return model;
	};

} )( PULSE.core );

/*globals PULSE.core */

/**
 * Poll object:
 * @typedef {Object} PollObject
 * @property  {String} url The URL for the data request
 * @property  {String} method Request method "GET", "POST", "PUT"
 * @property  {String} [type] Data type for request - Defaults to "json"
 * @property  {Array.<RequestHeader>} [headers] - Array of request headers
 */

/**
 * Subscriber object:
 * @typedef {Object} SubscriberObject
 * @property  {String} url The URL for the data request
 * @property  {String} method Request method "GET", "POST", "PUT"
 * @property {Function} callback Function to call when data is retrieved
 * @property {Object} target Context in which callback should be called
 * @property {Number} [interval] Interval for polling the data source, in millisecs, if not set data is requested once
 * @property {Boolean} [forceCallback] If true notifies of data on every poll rather than only when data has changed, defaults to false
 * @property  {String} [jsonpCallback] expected method name from jsonp response, if not set defaults to false
 * @property  {Boolean} [constant] If true ensures data is only requested once and all subscribers are notified with the same constant data, if not set defaults to false
 * @property  {String} [type] Data type for request - Defaults to "json"
 * @property  {Array.<RequestHeader>} [headers] - Array of request headers
 */

(function( core ){
	"use strict";

	/**
     * Range of manager utility methods for use across JavaScript builds
     */
    core.data.manager = {};

	core.data.manager = (function(){

		var polls = {};

		/**
		 * Poll constructor to create a Poll object that can hold subscribers and notify them of new data
		 * @param {Object.<PollObject>} config Config options to build a Poll
	 	 * @constructor
		 */
		var Poll = function( config ) {

			var _self = this;
			_self.url = config.url;
			_self.method = config.method;
            _self.target = config.target;
			_self.type = config.type;
			_self.subscribers = [];
			_self.headers = config.headers;
			_self.data = config.data || false;


			var dataChanged = function( data ) {
				var stringIt = function( val ) {
					if( typeof val === "object" ) {
						var stringifiedVal = '';
						for( var key in val ) {
							if( val.hasOwnProperty( key ) && key !== 'fullXhttpResponse' ) {
								stringifiedVal += JSON.stringify( val[ key ] );
							}
						}
						return stringifiedVal;
					}
					return val;
				};
				return stringIt( _self.data ) != stringIt( data );
			};

			var notify = function( data, config ){
				_self.subscribers.map( function( sub ){
					if( !_self.data || sub.forceCallback || dataChanged(data) ){
						sub.callback.call( sub.target, data, sub.config );
					}
				});
				_self.data = data;
			};

			var checkInterval = function(){
				var newInterval = false;
				_self.subscribers.forEach( function( sub ){
					if( !newInterval || sub.interval < newInterval ) {
						newInterval = sub.interval;
					}
				});
				_self.interval = newInterval;
				return newInterval;
			};

			var checkJsonp = function(){
				var result = false;
				_self.subscribers.map( function( sub ){
					if( sub.jsonpCallback ){
						result = sub.jsonpCallback;
					}
				});
				return result;
			};

			var checkConstant = function(){
				var result = false;
				_self.subscribers.map( function( sub ){
					if( sub.constant ){
						result = sub.constant;
					}
				});
				return result;
			};

			var request = function(){
				if( !checkConstant() || !_self.data  ){
					core.data.request( _self.url, _self.method, notify, _self.target, _self.jsonpCallback, _self.data, _self.headers, _self.type );
				}
				else{
					notify( _self.data, config );
				}
			};

			_self.stop = function(){
				if( _self.timer ){
					clearInterval(_self.timer);
				}
			};

			_self.start = function(){
				request();
				var interval = checkInterval();
				if( interval ){
					_self.timer = setInterval( request, interval );
				}
			};

			_self.add = function( sub ) {
				_self.stop();
				_self.subscribers.push( sub );
				_self.jsonpCallback = checkJsonp();
				_self.start();
			};

			_self.remove = function( sub ) {
				_self.stop();
				var index = _self.subscribers.indexOf( sub );
				_self.subscribers.splice( index, 1 );
				if( _self.subscribers.length > 0 ){
					_self.jsonp = checkJsonp();
					_self.start();
				}
				else {
					_self.data = false;
				}
			};
		};

		/**
		 * Subscriber constructor to create a Subscriber object that can be notifid of data updates from a Poll
	 	 * @param {Object.<SubscriberObject>} config Config options to build a Subscriber
	 	 * @param {Object.<PollObject>} config Poll object to subscribe to
		 * @constructor
		 */
		var Subscriber = function( config, poll ) {

			var _self = this;

			_self.config = config;
			_self.callback = config.callback;
			_self.target = config.target;
			_self.interval = config.interval;
			_self.forceCallback = config.forceCallback || false;
			_self.jsonpCallback = config.jsonpCallback || false;
			_self.constant = config.constant || false;
			_self.data = config.data || false;
			_self.headers = config.headers || [];

			_self.stop = function(){
				poll.remove( _self );
			};

			_self.start = function(){
				if( poll.subscribers.indexOf( _self ) < 0 ){
					poll.add( _self );
				}
			};

			_self.request = function(){
				core.data.request( poll.url, "GET", _self.callback, _self.target, _self.jsonpCallback, _self.data, _self.headers, _self.type );
			};
		};



		/**
		 * @param {Object.<SubscriberObject>} config Subscriber object used to add a new subscriber, creates a new Poll if required
		 */
		var Add = function( config ) {

				if( !polls[config.url] ) {
					polls[config.url] = new Poll({
						url: config.url,
                        method: config.method,
						type: config.type,
						headers: config.headers || [],
						data: config.data || false
					});
				}

				var sub = new Subscriber( config, polls[config.url] );

				polls[config.url].add( sub );

				return sub;

		};

		return {
			add: Add
		};

	}());


}( PULSE.core ));

/*globals PULSE.core */

/**
 * Request Header Object:
 * @typedef {Object} RequestHeader
 * @property {String} label - Label for Request Header
 * @property {String} value - Value of Request Header
 */

(function( core ){
	"use strict";

	/**
	 *
	 * @param  {String} url - The URL for the data request
	 * @param  {String} [method] - Request method "GET", "POST", "PUT" - Defaults to "GET"
	 * @param  {Function} callback - Function to pass the request response to
	 * @param  {Object} target - the context in which the callback should be called
	 * @param  {Object} [data] - Data object to pass to the request
	 * @param  {Array.<RequestHeader>} [headers] - Array of request headers
	 * @param  {String} [type] - Data type for request - Defaults to "json"
	 */
	core.data.request = function( url, method, callback, target, jsonpCallback, data, headers, type ){
		var config = {
			url: url,
			method: method || "GET",
			target: target,
			callback: callback,
			data: data || {},
			headers: headers || [],
			type: type || "json"
		};

		var createScriptTag = function( id ){
			var current = document.getElementById( id );
			if( current ){
				current.parentNode.removeChild( current );
			}
			var script = document.createElement( 'script' );
			script.id = id;
			script.src = config.url;
			return script;
		};

		if ( jsonpCallback ){
			var script = createScriptTag( jsonpCallback );
			window[ jsonpCallback ] = function( data )
			{
				config.callback.call( config.target, data, config );
			};
			document.body.appendChild( script );
		}
		else {
			var xhttp = new XMLHttpRequest();
			xhttp.open( config.method, config.url, true );

			var containsContentTypeHeader = false;
			if( config.headers.length ) {
				config.headers.forEach( function( header ) {
					xhttp.setRequestHeader( header.label, header.value );
					if ( header.label === 'Content-Type' && header.value ) {
						containsContentTypeHeader = true;
					}
				} );
			}
			if( !containsContentTypeHeader ) {
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			}

			xhttp.responseType = config.type;
			xhttp.onreadystatechange = function() {
				var response;
				if ( this.readyState === 4 ) {
					if( this.status >= 200 && this.status < 400 ) {
						if (config.type === "json" && (typeof this.response === 'string' || this.response instanceof String)) {
							response = JSON.parse(this.response);
							response.fullXhttpResponse = this;
							config.callback.call( config.target, response, config );
						} else {
							response = this.response;
							response.fullXhttpResponse = this;
							config.callback.call( config.target, response, config );
						}
					}
					else {
						response = {
							fullXhttpResponse: this
						};
						config.callback.call( config.target, response, config );
					}
				}
			};
			if(config.method === "POST") {
				xhttp.send(formattedParams(config.data));
			} else {
				xhttp.data = config.data;
				xhttp.send();
			}
			xhttp = null;
		}
	};

	var formattedParams = function ( params )
	{
		var paramArray = [];
		for ( var key in params )
		{
			if ( params[key] !== undefined )
			{
				paramArray.push( key + '=' + params[key] );
			}
		}
		var formattedParams = "";
		if ( paramArray.length > 0 )
		{
			formattedParams += paramArray.join( '&' );
		}
		return formattedParams;
	};

}( PULSE.core ));

( function( core ) {

    "use strict";

    /**
     * Produces a date object (or undefined) if given a valid ISO date string
     * @param  {String} dateString - ISO date string
     * @return {Date}              - date object or undefined, if string invalid
     */
    core.date.parseString = function( dateString ) {

        if( dateString ){

            var date;

            if ( typeof dateString !== 'string' ) {
                dateString = dateString.toISOString();
            }

            var dateTime = dateString.split('T');
            if ( dateTime.length === 1 ) {
                return new Date( dateTime[0].replace( /\-/g, '/' ) );
            }
            else if ( dateTime.length === 2 ) {
                // we only want to replace the hyphens of date bit (there might be hypens(minus) as in GMT-0200)
                var aDate1 = dateTime[0].replace( /\-/g, '/' );
                var aDate2 = dateTime[1];
                var newDate = aDate1 + ' ' + aDate2;

                date = new Date( newDate );
            }

            if( date && date.getTime() && !isNaN( date.getTime() ) ) {
                return date;
            }
            else {
                date = new Date( dateString );
                if( date && date.getTime() && !isNaN( date.getTime() ) ) {
                    return date;
                }
            }

            return date;
        }
    };

}( PULSE.core ) );

/*globals PULSE.core */

( function( core ) {

	/**
	 * utility method to append an element defined by a string to a
	 * given DOM el. can also append all children from one el to another as
	 * children, similar to jQuery appendTo...
	 *
	 * @param {HTMLElement} element
	 * @param {string} string
	 * @param {boolean} multipleChildren pass true if string consists of more than one
	 * root element that should be appended also to the element
	 * @param {Integer/boolean} returnChild if specified along with multipleChildren ( true ) then will return the
	 * appended element of the nth child of the string, set true to return all children
	 * @returns {HTMLElement} the element that was appended, or the element that was appended to
	 * if multipleChildren is passed as true
	 */

	core.dom.appendDomString = function( element, string, multipleChildren, returnChild) {

        var returnAll = typeof returnChild === "boolean" && returnChild === true;
		var toReturn = returnAll ? [] : false;
		var tempEl = document.createElement( 'div' );
		tempEl.innerHTML = string ;

		if( !multipleChildren ) {
			return element.appendChild( tempEl.children[ 0 ] );
		}

		//length will keep changing as divs are removed and length is
		// re-evaluated, so lets take account of it now !

		var children = tempEl.children.length;

		for( var p = 0; p < children; p++ ) {

			if( returnAll && typeof toReturn === "object" ) {
				toReturn.push( element.appendChild( tempEl.children[ 0 ] ) );
			}

			if( p === returnChild ) {
				toReturn = element.appendChild( tempEl.children[ 0 ] );
			} else if( !returnAll ) {
				element.appendChild( tempEl.children[ 0 ] );
			}

		}

		return toReturn || element;

	};

    /**
	 * utility method to prepend an element defined by a string to a
	 * given DOM el. can also prepend all children from one el to another as
	 * children, similar to jQuery prependTo...
	 *
	 * @param {HTMLElement} element
	 * @param {string} string
	 * @param {boolean} multipleChildren pass true if string consists of more than one
	 * root element that should be appended also to the element
	 * @param {Integer/boolean} returnChild if specified along with multipleChildren ( true ) then will return the
	 * appended element of the nth child of the string, set true to return all children
	 * @returns {HTMLElement} the element that was prepended, or the element that was prepended to
	 * if multipleChildren is passed as true
	 */

 	core.dom.prependDomString = function( element, string, multipleChildren, returnChild) {

        var returnAll = typeof returnChild === "boolean" && returnChild === true;
		var toReturn = returnAll ? [] : false;
		var tempEl = document.createElement( 'div' );
		tempEl.innerHTML = string ;

		if( !multipleChildren ) {
			return element.insertBefore( tempEl.children[ 0 ], element.firstChild );
		}

		//length will keep changing as divs are removed and length is
		// re-evaluated, so lets take account of it now !

		var children = tempEl.children.length;

		for( var p = 0; p < children; p++ ) {

			if( returnAll && typeof toReturn === "object" ) {
				toReturn.push( element.insertBefore( tempEl.children[ 0 ], element.firstChild ) );
			}

			if( p === returnChild ) {
				toReturn = element.insertBefore( tempEl.children[ 0 ], element.firstChild );
			} else if( !returnAll ) {
				element.insertBefore( tempEl.children[ 0 ], element.firstChild );
			}

		}

		return toReturn || element;

 	};

	/**
	 * utility method to check for a whitespace node
	 *
	 * @param {HTMLElement} node Node to check if it is actually whitespace
	 * @returns {Boolean} Is a whitespace node
	 */
	core.dom.isWhitespace = function(node) {
	    return node.nodeType == 3 && /^\s*$/.test(node.data);
	};

	/**
	 * utility method to get nextSiblings from a given element
	 * accepts a filter method to filter the resulting elements
	 *
	 * @param {HTMLElement} el
	 * @param {Function} filter Function to filer each resulting element by - must return a boolean
	 * @returns {Object.<Array>} resulting sibling elements
	 */
	core.dom.getNextSiblings = function(el, filter) {
	    var siblings = [];
	    while ((el= el.nextSibling) !== null) {
	    	if( !core.dom.isWhitespace( el ) ){
		    	if (!filter || filter(el)) siblings.push(el);
		    }
	    }
	    return siblings;
	};

	/**
	 * utility method to get previousSiblings from a given element
	 * accepts a filter method to filter the resulting elements
	 *
	 * @param {HTMLElement} el
	 * @param {Function} filter Function to filer each resulting element by - must return a boolean
	 * @returns {Object.<Array>} resulting sibling elements
	 */
	core.dom.getPreviousSiblings = function(el, filter) {
	    var siblings = [];
	    while ((el = el.previousSibling) !== null) {
	    	if( !core.dom.isWhitespace( el ) ){
	    		if (!filter || filter(el)) siblings.push(el);
	    	}
	    }
	    return siblings;
	};

	/**
	 * Check if child element is in a parent element
	 * @param {HTMLElement} child Child Element
	 * @param {HTMLElement} parent Parent element
	 * @return {Boolean} boolean To check if child is in the parent
	 */
	core.dom.isDescendant = function( child, parent )
	{
		var node = child.parentNode;
	     while (node !== null) {
	         if (node == parent) {
	             return true;
	         }
	         node = node.parentNode;
	     }
	     return false;
	};

	/**
	 * Check if an element is within the current browser viewport
	 * @param  {HTMLElement}  element Element to check
	 * @param  {Boolean}  fullyInView If true checks if element is fully in view
	 * @return {Boolean}  boolean To state whther element is within the viewport
	 */
	core.dom.isElementInView = function ( element, fullyInView ) {
        var pageTop = window.scrollY;
        var pageBottom = pageTop + window.innerHeight;
        var elementTop = element.offsetTop;
        var elementBottom = elementTop + element.offsetHeight;

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    };

    /**
     * Scroll the window to bring an element into view - uses requestAnimationFrame to animate the scroll event
     * @param  {HTMLElement} element The target element to bring into view
     * @param  {Number} offset The value to offset the window scroll from the top of the element (accepts -)
     * @param  {Number} scrollRate Number of pixels to scroll by within each animation frame (set high to jump straight to target)
     */
    core.dom.scrollWindowToElement = function( element, offset, scrollRate ){

    	var targetScroll = element.offsetTop;
    	if( !isNaN( offset ) ){
    		targetScroll += offset;
    	}
    	if( isNaN( scrollRate ) ){
    		scrollRate = 100;
    	}

		var scrolling;
        
        // window.scrollY is undefined in IE <= 11
    	var scrollUp = targetScroll < (window.scrollY || window.pageYOffset);

    	function scrollWindowUp() {
            var scrollY = window.scrollY || window.pageYOffset;
    		var newY = scrollY - scrollRate;
        	if( newY <= targetScroll  ){
    			window.scrollTo( window.scrollX || window.pageXOffset, targetScroll );
        	}
        	else{
    			window.scrollTo( window.scrollX || window.pageXOffset, newY );
        	}
            if( scrollY <= targetScroll ){
                cancelAnimationFrame( scrolling );
            }
            else{
                requestAnimationFrame( scrollWindowUp );
            }
        }
        function scrollWindowDown() {
            var scrollY = window.scrollY || window.pageYOffset;
    		var newY = scrollY + scrollRate;
        	if( newY >= targetScroll  ){
    			window.scrollTo( window.scrollX || window.pageXOffset, targetScroll );
        	}
        	else{
    			window.scrollTo( window.scrollX || window.pageXOffset, newY );
        	}
            if( scrollY >= targetScroll ){
                cancelAnimationFrame( scrolling );
            }
            else{
                requestAnimationFrame( scrollWindowDown );
            }
        }
        if( scrollUp ){
        	scrolling = requestAnimationFrame(scrollWindowUp);
		}
		else{
        	scrolling = requestAnimationFrame(scrollWindowDown);
		}
    };

} )( PULSE.core );

/*globals PULSE.core */

(function( core ){
    "use strict";
    /**
     * Range of local storage utility methods for use across JavaScript builds
     */
    core.localStorage = {};

    /**
    * Set given data in storage with either cookies or localStorage
    * @public
    * @param {string} name Name of storage object
    * @param {string} data Data to store
    * @param {number} [expiry] Number of days before expiry
    * @param {useCookie} [boolean] True if local storage should not be used
    */
    core.localStorage.setStorage = function (name, data, expiry, useCookie) {

        var setCookie = function(){
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiry);
            var c_value = escape(data) + ((expiry === null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = name + "=" + c_value + ";path=/";
        };
        if (useCookie) {
            setCookie();
        }
        else {
            if ('localStorage' in window && window.localStorage !== null) {
                window.localStorage.setItem(name, data);
            }
            else {
                setCookie();
            }
        }
    };
    /**
    * Gets requested data from either cookies or localStorage
    * @public
    * @param {string} name Name of storage object
    * @param {useCookie} [boolean] True if local storage should not be used
    * @return {string} Data retrieved from stored object
    */
    core.localStorage.getStorage = function (name, useCookie) {

        var getCookie = function(){
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == name) {
                    return unescape(y);
                }
            }
        };

        if (useCookie) {
            return getCookie();
        }
        else {
            if ('localStorage' in window && window.localStorage !== null) {
                return window.localStorage.getItem(name);
            }
            else {
                return getCookie();
            }
        }
    };
    /**
    * Removes requested data from  either cookies or localStorage
    * @public
    * @param {string} name Name of storage object
    * @param {useCookie} [boolean] True if local storage should not be used
    */
    core.localStorage.clearStorage = function (name, useCookie) {

        var removeCookie = function(){
            core.localStorage.setStorage(encodeURIComponent(name), '', -1, true);
        };
        if (useCookie) {
            removeCookie();
        }
        else {
            if ('localStorage' in window && window.localStorage !== null) {
                window.localStorage.removeItem(name);
            }
            else {
                removeCookie();
            }
        }
    };

}( PULSE.core ));

/*globals PULSE.core */

( function( core ) {
	"use strict";

	/**
	 * add a callback to handle multiple events to a single element
	 *
	 * @param {object} element el to add listeners to
	 * @param {string[]} events array of event names to listen for
	 * @param {function} fn callback to be applied
	 * @returns {boolean} weather or not the listeners were added
	 */
	core.event.listenForMultiple = function( element, events, fn ) {

		if( element && events && events.length && fn && typeof fn === "function" ) {
			for( var i = 0; i < events.length; i++ ) {
				element.addEventListener( events[ i ], fn );
			}
			return true;
		}
		return false;
	};

} )( PULSE.core );

( function( core ) {
    /**
     * @typedef {OutsideClickSubscriber}
     * @param {DOMElement} element - the main element to listen clicking outside of
     * @param {Function} callback - the function to call if outside click conditions are satisfied
     * @param {DOMElement} preventTriggerOn - optional element to ignore clicks on
     */

    /**
     * List of elements to close if the user clicks outside of their defined boundary
     * @type {Array<OutsideClickSubscriber>}
     */
    var elementsToClose = [];

    /**
     * Function to be executed when the click listener on the document is fired
     * @param {DOMEvent} e - The click event
     */
    var onDocumentClick = function( e ) {

        var el;
        for( var i = 0; i < elementsToClose.length; i++ ) {

            el = elementsToClose[ i ];

            if( el &&
                // ignore clicks on the element itself
                el.element !== e.target &&
                // ignore clicks if the subscriber element contains the element clicked
                ( !el.element || !el.element.contains( e.target ) ) &&
                // ignore clicks on the preventTriggerElem
                e.target !== el.preventTriggerOn &&
                // ignore clicks if the preventTriggerElem contains the element clicked
                ( !el.preventTriggerOn || !el.preventTriggerOn.contains( e.target ) ) &&
                // ignore if there's no callback
                typeof el.callback === 'function' ) {

                el.callback( el.element );
            }
        }
    };

    /*
     * Functionality which closes all open elements on a document click/click outside of the element
     * element specifically needs to be added to the elementsToClose list
     * @class CloseOnOutsideClick
     * @static
     */
    core.event.listenForOutsideClick = {

        /**
         * Adds an element to the elementsToClose list
         * @memberof CloseOnOutsideClick
         *
         * @param {DOMElement} element            - The element
         * @param {Function}   callback           - The callback (gets run on click)
         * @param {DOMElement} preventTriggerElem - Optional element to prevent listening for click on
         */
        addElement: function( element, callback, preventTriggerElem ) {

            if( elementsToClose.length === 0 ) {
                document.addEventListener( 'click', onDocumentClick );
            }

            elementsToClose.push( {
                element: element,
                callback: callback,
                preventTriggerOn: preventTriggerElem
            } );
        },

        /**
         * Removes an element from the elementsToClose list
         * @memberof CloseOnOutsideClick
         *
         * @param {DOMElement} element - The element to remove
         */
        removeElement: function( element ) {

            for( var i = 0; i < elementsToClose.length; i++ ) {
                if ( elementsToClose[ i ] &&
                    elementsToClose[ i ].element === element ) {

                    elementsToClose.splice( i, 1 );
                }
            }

            if( elementsToClose.length === 0 ) {
                document.removeEventListener( 'click', onDocumentClick );
            }

        }
    };

}( PULSE.core ) );

/*globals PULSE.core */

(function( core ){
	"use strict";

	/**
	 * WindowOnScroll handler that extends the window.onscroll listener for multiple methods
	 */
	var WindowOnScroll = function( ){

		var _self = this;
		_self.initialised = false;

		var onscrollTimer;

		_self.notifiers = [];

		_self.add = function( notifier ){
			if( _self.notifiers.indexOf( notifier ) < 0 ){
				_self.notifiers.push( notifier );
			}
			if( !_self.initialised ){
				init();
			}
		};

		_self.remove = function( notifier ){
			var index = _self.notifiers.indexOf( notifier );
			if( index ){
				_self.notifiers.splice( index, 1 );
			}
		};

		var notify = function(){
			_self.notifiers.map( function( notifier ){
				notifier.method( notifier.args );
			} );
		};

		var init = function(){
			window.onscroll = function(){
				notify();
			};
			_self.initialised = true;
		};

	};

	core.event.windowOnScroll = new WindowOnScroll( 100 );

}( PULSE.core ));

/*globals PULSE.core */

(function( core ){
	"use strict";

	/**
	 * windowResize handler that extends the window.resize listener for multiple methods
	 * and debounces the window.onresize event by 100ms
	 * @property {Number} timer Time in millisecs used to debounce the window.onresize event - defaults to 200
	 */
	var WindowResize = function( timer ){

		var _self = this;
		_self.timer = timer || 200;
		_self.initialised = false;

		var resizeTimer;

		_self.notifiers = [];

		_self.add = function( notifier ){
			if( _self.notifiers.indexOf( notifier ) < 0 ){
				_self.notifiers.push( notifier );
			}
			if( !_self.initialised ){
				init();
			}
		};

		_self.remove = function( notifier ){
			var index = _self.notifiers.indexOf( notifier );
			if( index ){
				_self.notifiers.splice( index, 1 );
			}
		};

		var notify = function(){
			_self.notifiers.map( function( notifier ){
				notifier.method( notifier.args );
			} );
		};

		var init = function(){
			window.onresize = function(){
				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( function() {
					notify();
				}, _self.timer );
			};
			_self.initialised = true;
		};


	};

	core.event.windowResize = new WindowResize( 100 );

}( PULSE.core ));

/*globals PULSE.core */

(function( core ){
    "use strict";

    /**
     * Extend an object with another. Pass in at least two objects to merge as arguments; for a
     * deep extend, set the first argument to `true`
     * @public
     * @return {Object} the newly created object
     */
    core.object.extend = function () {

        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function ( obj ) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep &&
                        Object.prototype.toString.call( obj[prop] ) === '[object Object]' ) {
                        extended[prop] = core.object.extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge( obj );
        }

        return extended;
    };

    /**
     * get object by string notation
     *
     * @param {object} o Object
     * @param {object} s String
     */
    core.object.objectByString = function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    };

    /**
     * get object size
     *
     * @param {object} o Object
     * @param {int} size Size of object
     */
    core.object.objectSize = function( o )
    {
        var size = 0, key;
        for ( key in o )
        {
            if ( o.hasOwnProperty( key ) ) size++;
        }
        return size;
    };

    /**
     * check if two objects contain the same data
     *
     * @param {object} o1 Object1
     * @param {object} o2 Object2
     * @return {boolean} true/false Whether objects are the same
     */
    core.object.sameObject = function( o1, o2 )
    {
        if ( core.object.objectSize( o1 ) != core.object.objectSize( o2 ) )
        {
            return false;
        }
        else
        {
            for ( var key in o1 )
            {
                if ( o1[ key ] != o2[ key ] )
                {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * given an object and a path on its keys, traverse this path and return the resulting
     * object / value, with great power comes great re-usability
     *
     * @param {Array<string>} path the list of objects to traverse down
     * @param {object} object the object which will be traversed
     */
    core.object.getNestedItemFromPath = function( path, object ) {

        //no elements in path array the return the object at its root
        if( path.length === 0 ) {
            return object;
        }

        //start with a reference to the root element of the object
        var o = object;

        for( var l = 0; l < path.length; l++ ) {
            o = o[ path[ l ] ];
        }

        return o;
    };

    /**
     * turns an element/node list into an array
     *
     * @param {object} object the nodelist object which will be turned into an array
     */
    core.object.makeArray = function( object ) {
        var arr = [];
        if ( core.object.isArray(object) ) {
            // use object if already an array
            arr = object;
        } else if ( typeof object.length == 'number' ) {
            // convert nodeList to array
            for ( var i = 0; i < object.length; i++ ) {
                arr.push( object[i] );
            }
        } else {
            // array of single index
            arr.push( object );
        }
        return arr;
    };

    /**
     * checks if the given parameter is an Array
     *
     * @param {object} arr the object to check
     */
    core.object.isArray = function( arr ) {
        return Object.prototype.toString.call( arr ) == '[object Array]';
    };

}( PULSE.core ));

/*globals PULSE.core */

(function( core ){
    "use strict";
    /**
     * Range of style utility methods for use across JavaScript builds
     */
    core.style = {};

    /**
     * check a class exists for a dom element
     * @public
     * @param {HTMLElement} el Element to check class
     * @return {string} className name of class to check
     */
    core.style.hasClass = function( el, className ) {
        if (el.classList) {
          return el.classList.contains(className);
        } else {
          return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    /**
     * remove a class from a HTML element
     * @public
     * @param {HTMLElement} el Element to remove class from
     * @return {string} className name of class to remove
     */
    core.style.removeClass = function( el, className ) {
        if (el.classList) {
          el.classList.remove(className);
        } else {
          el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    /**
     * add a class to a HTML element
     * @public
     * @param {HTMLElement} el Element to add class to
     * @return {string} className name of class to add
     */
    core.style.addClass = function( el, className ) {
        if (el.classList) {
          el.classList.add(className);
        } else {
          el.className += ' ' + className;
        }
    };

    /**
     * toggle a class for a HTML element
     * @public
     * @param {HTMLElement} el Element for class to toggle
     * @return {string} className name of class to toggle
     */
    core.style.toggleClass = function( el, className ) {
        if ( core.style.hasClass( el, className ) ) {
            core.style.removeClass( el, className );
        } else {
            core.style.addClass( el, className );
        }
    };

    /**
     * returns a width value including padding, borders and margins for a HTML element
     * @public
     * @param {HTMLElement} el Element to measure
     * @return {integer} outer pixel width of element
     */
    core.style.outerWidth = function( el ) {
        var width = el.offsetWidth;
        var style = el.currentStyle || getComputedStyle( el );

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    };

}( PULSE.core ));

/*globals PULSE.core */

( function( core ) {

	/**
	 * Update a parameter in a url string,
	 * usually so it can be set back using the history api
	 *
	 * @param {string} url the url string
	 * @param {string} parameter the parameter to update
	 * @param {string} newValue the value to update the param to
	 */
	core.url.updateUrlStringParam = function( url, parameter, newValue ) {

		var newParam = parameter + "=" + newValue;

		//does the param actually exist in the url ?
		name = name.replace( /[\[]/, "\\\[" ).replace(/[\]]/, "\\\]");
		//use cap group 0 to identify the leading character
		var regexS = "([\\?&])" + parameter + "=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );

		if( results ) {
			//param already exists in url, replace it
			var preceeding = results[ 1 ]; // ? or &
			var nextVal = ( newValue !== undefined && newValue !== '' ) ? preceeding + newParam : preceeding;
			url = url.replace( results[ 0 ], nextVal );

		} else {
			if ( newValue !== undefined && newValue !== '' )
			{
				//check if url has elready got other parameters
				if( url.indexOf( "?" ) === -1 ) {

					url = url + "?" + newParam;

				} else {

					url = url + "&" + newParam;

				}
			}
		}

		return url;
	};

	/**
	 * Get parameter by name
	 *
	 * @param {string} name Name of parameter to be retrieved
	 * @param {string} url Optional url string
	 * @param {string} Value of parameter
	 */
	core.url.getParameterByName = function( name, url )
	{
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    var param = decodeURIComponent(results[2].replace(/\+/g, " "));
	    if ( param === 'null' )
	    {
	    	param = null;
	    }
	    return param;
	};

	/**
    * Returns the value of a parameter from the current URI
    * @public
    * @param  {String} name - Request method "GET", "POST", "PUT" - Defaults to "GET"
    * @return { } Returns the value of a given parameter from window.location
    */
    core.url.getParam = function (name) {

        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results === null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

	/**
	 * Update url based on parameters
	 *
	 * @param {Object} params Object of parameters to update in the url
	 * @param {Object} config Optional configuration:
	 		- State
	 		- Title
	 		- Url
	 		- Name
	 */
	core.url.setUrlWithParams = function( params, config )
	{
		config = config || {};

		var state = config.state || {};
		var title = config.title || document.title;
		var url = config.url || window.location.href.split('?')[0];
		var name = config.name || 'filter';

		url += core.url.buildQueryString( params, true );

		window.history.pushState(state, title, url );
	};

	/**
	 * Builds a query string from a given map of parameters
	 * @param  {Object}  paramsMap        - The parameters map
	 * @param  {Boolean} includeSeparator - Whether to include the ? before the string or not
	 * @return {String}                   - The query string
	 */
	core.url.buildQueryString = function( paramsMap, includeSeparator ) {

		var paramsArray = [];
	    for( var key in paramsMap ) {
	    	 	// ignore non-map properties
	    	if( paramsMap.hasOwnProperty( key ) &&
	    		// ignore params with undefined values
	    		typeof paramsMap[ key ] !== 'undefined' &&
	    		// ignore param if value is an empty array
	    		( Object.prototype.toString.call( paramsMap[ key ] ) !== '[object Array]' ||
	    			paramsMap[ key ].length ) ) {

	    		var value = [].concat( paramsMap[ key ] ).join( ',' );
	    		var keyValuePair = [ key, encodeURIComponent( value ) ];
	    		paramsArray.push( keyValuePair.join( '=' ) );
	    	}
	    }

	    return paramsArray.length ? ( includeSeparator ? '?' : '' ) + paramsArray.join( '&' ) : '';
	};

} )( PULSE.core );


/*globals PULSE.ui */
( function( ui ) {


	ui.loader = function( element, config ) {
		var _self = this;

		_self.element = element;
		_self.append = config.append;
		_self.init = config.init;
		_self.active = false;
		_self.loaderTemplate = config.loaderTemplate;
		if ( _self.init )
		{
			_self.addLoader();
		}
	};

	ui.loader.prototype.removeLoader = function()
	{
		var _self = this;

		if( _self.element && _self.active ){
			
			if ( _self.loaderDiv )
			{
				_self.element.removeChild( _self.loaderDiv );
			}
			else{
				_self.element.innerHTML = "";			
			}
			_self.active = false;
		}
	};

	ui.loader.prototype.addLoader = function()
	{
		var _self = this;

		var html = Mustache.render( _self.loaderTemplate, {} );

		if ( _self.append )
		{
			_self.loaderDiv = document.createElement( 'div' );
			_self.loaderDiv.innerHTML = html;
			_self.element.insertBefore( _self.loaderDiv, _self.element.firstChild );
		}
		else
		{
			_self.element.innerHTML = html;
		}
		_self.active = true;
	};

} )( PULSE.ui);

/*globals PULSE, PULSE.ui */

(function( ui, core ){
	"use strict";
	/**
	 * Config Object:
	 * @typedef {Object} Config
	 * @property {HTMLElement} [parent] A single parent HTML element - defaults to 'document'
	 * @property {String} [selector] CSS 2.1 selector used to identify modal activators - defaults to '[data-ui-modal]'
	 * @property {String} [openClass] CSS class used to define open modal objects - defaults to 'open'
	 * @property {String} [modalId] ID to be used for the modal wrapper - defaults to 'modalWrap'
	 * @property {String} [closeText] Text to be used for close button/link - defaults to 'close'
	 * @property {Function} [openCallback] Function to be called when modal is opened/updated - receives full modal object
	 * @property {Function} [closeCallback] Function to be called when modal is opened/updated - receives full modal object
	 *
	 * Instance Object:
	 * @typedef {Object} Instance
	 * @property {HTMLElement} activator HTML element that triggers this Instance content to be set in the modal
	 * @property {HTMLElement} content HTML element that is the target content displayed for this instance
	 * @property {Function} show Function used to show the content element for this Instance
	 * @property {String} uiArgs Arguments to be used within callback methods as stringified JSON
	 * /

	/* PRIVATE METHODS */

	/**
	 * @namespace ui.modal.private
	 */

	var setDefaults = function( config ){
		if( !config.parent ){
			config.parent = document;
		}
		if( !config.selector ){
			config.selector = '[data-ui-modal]';
		}		
		if( !config.openClass ){
			config.openClass = 'open';
		}
		if( !config.modalWrapId ){
			config.modalWrapId = 'modalWrap';
		}
		if( !config.modalContentId ){
			config.modalContentId = 'modalContent';
		}
		if( !config.closeText ){
			config.closeText = 'close';		
		}
		config.activators = config.parent.querySelectorAll( config.selector );
		config.instances = [];
		return config;

	};

	var bindInstance = function( instance, _self ){

		instance.activator.addEventListener( 'click', function( e ){
			e.preventDefault();
			_self.setInstance( instance );
			_self.open(instance);
		} );

	};


	var buildModal = function( _self ){

		var currentModal = document.getElementById( _self.config.modalWrapId );

		if( currentModal ){
			_self.config.modal = currentModal;
		}
		else{
			_self.config.modal = document.createElement('div');
			_self.config.modal.id = _self.config.modalWrapId;
			if ( _self.config.modalWrapClass )
			{
				core.style.addClass( _self.config.modal, _self.config.modalWrapClass );
			}
			_self.config.modal.addEventListener( 'click', function(e){
				if (_self.config.modal !== e.target) return;
				_self.close();
			} );

			document.body.insertBefore( _self.config.modal, document.body.firstChild );
		}

		var currentModalContent = _self.config.modal.querySelector( '#' + _self.config.modalContentId );

		if( currentModalContent ){
			_self.config.modalContent = currentModalContent;
		}
		else{
			_self.config.modalContent = document.createElement('div');
			_self.config.modalContent.id = _self.config.modalContentId;

			if ( _self.config.modalContentWrapClass )
			{
				core.style.addClass( _self.config.modalContent, _self.config.modalContentWrapClass );
			}

			_self.config.modal.appendChild(_self.config.modalContent);

			var closeBtn = document.createElement('a');
			core.style.addClass( closeBtn, 'close' );
			closeBtn.setAttribute( 'role', 'button' );
			closeBtn.setAttribute( 'tabindex', 0 );
			closeBtn.textContent = _self.config.closeText;
			closeBtn.addEventListener( 'click', function(){
				_self.close();
			} );

			// Close modal if enter key is pressed when focus on close button
			closeBtn.addEventListener( 'keydown', function( evt ){
				if( evt.which == 13 ){
					_self.close();
				}
			} );		
			_self.config.modalContent.appendChild(closeBtn);			
		}

		_self.config.closeBtn = _self.config.modalContent.querySelector( 'a.close' );

	};

	var buildItems = function( _self ){

		Array.prototype.map.call( _self.config.activators, function( el ){
			var instanceContent = document.querySelectorAll( el.getAttribute('data-ui-modal') );
			var args;
			if( el.getAttribute('data-ui-args') ){
				args = JSON.parse( el.getAttribute('data-ui-args') );
			}
			var instance = {
				activator: el,
				content: instanceContent[0],
				uiArgs: args
			};
			instance.show = function(){
				_self.config.instances.forEach( function( el ){
					core.style.removeClass( el.content, _self.config.openClass );
				} );
				core.style.addClass( instance.content, _self.config.openClass );			
			};
			_self.config.modalContent.appendChild( instance.content );
			_self.config.instances.push( instance );
			bindInstance( instance, _self );
		} );

	};

	var init = function( _self ){

		buildModal( _self );
		buildItems( _self );

	};

	/* PUBLIC OBJECT */

	/**
	 * Constructor for modal object
	 * 
	 * @param {Object.<Config>} [config] Config properties used when consructing a modal
	 * @constructor
	 */	
	ui.modal = function( config ){

		var _self = this;
		_self.config = setDefaults( config || {} );


		// method used to close on escape key event
		_self.escapeClose = function( evt ){
			if( evt.which == 27 ){
				_self.close();
			}
		};

		init( _self );

	};

	/**
	 * Open the modal
	 * @return {Object} Full modal object
	 */
	ui.modal.prototype.open = function(){

		var _self = this;

		// Close modal if escape key is pressed
		document.addEventListener( 'keydown', _self.escapeClose );
		
		core.style.addClass( _self.config.modal, _self.config.openClass );
		if( typeof _self.config.openCallback === 'function' ){
			_self.config.openCallback( _self );
		}
		// Set focus on the close button for accessibility
		// setTimeout is required to force this event to after element paint in browser
		setTimeout(function(){ _self.config.closeBtn.focus(); }, 100);		
		return _self;
	};

	/**
	 * Close the modal
	 * @return {Object} Full modal object
	 */
	ui.modal.prototype.close = function(){

		var _self = this;

		// Remove event listener on escape key
		document.removeEventListener( 'keydown', _self.escapeClose );

		core.style.removeClass( _self.config.modal, _self.config.openClass );
		if( typeof _self.config.closeCallback === 'function' ){
			_self.config.closeCallback( _self );
		}
		return _self;
	};

	/**
	 * Sets the given modal instance as visible within the modal, must be an instance from modal.config.instances
	 *
	 * @param {Object.<Instance>} instance Modal instance to be set
	 * @return {Object} Full modal object
	 */
	ui.modal.prototype.setInstance = function( instance ){

		var _self = this;
		_self.config.current = instance;
		instance.show();
		return _self;

	};

}( PULSE.ui, PULSE.core ));
/*globals PULSE, PULSE.ui, PULSE.core */

(function( ui, core ){
	"use strict";

	/**
	 * MoreNav Object:
	 * @typedef {Object} MoreNav
	 */

	var ENTER_KEY = 13;

	/**
	 * Config Object:
	 * @typedef {Object} Config
	 * @property {String} [moreNavUiSelector] Data attribute selector used to wrap the whole nav element
	 * @property {String} [dataNavIndexSelector] data attribute selector used to index the nav items
	 * @property {HTMLElement} [navWrap] A single wrapping HTML element with all the nav elements
	 * @property {String} [navWrapTag] HTML tag used to wrap more nav items
	 * @property {String} [navItemTag] HTML tag used to build more nav items
	 * @property {String} [moreWrapClass] CSS Class used to wrap the generated more nav
	 * @property {String} [moreToggleClass] CSS Class for the more toggle button
	 * @property {String} [moreDropdownClass] CSS Class for the more dropdown
	 * @property {String} [iconPrefix] sprite calling class e.g. icon, icn
	 * @property {String} [iconClass] sprite name class e.g. chevron-down, caret-down
     * @property {String} [moreLabel] Text used on the more element
     * @property {String} [openClass] CSS class used when the more dropdown is open
	 * @property {String} [hideClass] CSS class used for hiding nav elements
	 * @property {Number} [toleranceWidth] Pixel amount to set as tolerance for adjusting items in more nav
	 * @property {Function} [buildCallback] Function to be called when a nav ui is built - receives full nav object
	 */

	/**
	 * @namespace ui.moreNav.private
	 */

	/* PRIVATE VARIABLES */
	var resizeTimer;

	/* PRIVATE METHODS */

	var setDefaults = function( config ){


		if( !config.dataNavIndexSelector ){
			config.dataNavIndexSelector = 'data-nav-index';
		}
		if( !config.navWrap ){
			config.navWrap = document.querySelector( '[data-ui-more-nav]' );
		}
		if( !config.navWrapTag ){
			config.navWrapTag = 'ul';
		}
		if( !config.navItemTag ){
			config.navItemTag = 'li';
		}

		if( !config.moreWrapClass ){
			config.moreWrapClass = 'more';
		}

		if( !config.moreLabel ){
			config.moreLabel = 'More';
		}

		if( !config.moreToggleClass ){
			config.moreToggleClass = 'moreToggle';
		}
		if( !config.moreDropdownClass ){
			config.moreDropdownClass = 'moreToggleDropdown';
		}

		if( !config.iconPrefix ){
			config.iconPrefix = 'icn';
		}
		if( !config.iconClass ){
			config.iconClass = 'chevron-down';
		}

		if( !config.activeClass ){
			config.activeClass = 'active';
		}
		if( !config.openClass ){
			config.openClass = 'open';
		}
		if( !config.hideClass ){
			config.hideClass = 'hide';
		}
		if( !config.toleranceWidth ){
			config.toleranceWidth = 20;
		}
		config.navs = [];
		return config;

	};


	var buildNavs = function( _self ){

		_self.config.navItemsWrap = _self.config.navWrap.querySelector( _self.config.navWrapTag );

		var navIndex = 0;

		Array.prototype.map.call( _self.config.navItemsWrap.children, function( el ){
			if( el.tagName.toLowerCase() === _self.config.navItemTag.toLowerCase() ){
				el.setAttribute( _self.config.dataNavIndexSelector , navIndex++ );
				_self.config.navs.push( el );
			}
		} );

		createMoreToggle( _self );
		checkAndSetActiveTab(_self);

	};

	var createMoreToggle = function( _self ) {
		_self.moreNavs = {};
		_self.moreNavs.visible = false;

		var moreNav = document.createElement(_self.config.navItemTag);
		core.style.addClass( moreNav, _self.config.moreWrapClass );
		_self.moreNavs.nav = moreNav;

		var moreButton = document.createElement('div');
		moreButton.setAttribute( 'tabindex', 0);
		core.style.addClass( moreButton, _self.config.moreToggleClass );
		moreButton.textContent = _self.config.moreLabel;
		moreButton.addEventListener( 'click', function(){
			toggleMoreDropdown( _self );
		});

		moreButton.addEventListener( 'keypress', function(evt){
			var keyCode = evt.which || evt.keyCode;

			if ( keyCode === ENTER_KEY ) {
				toggleMoreDropdown( _self );
			}
		});
		moreNav.appendChild( moreButton );

		var moreIcon = document.createElement('span');
		core.style.addClass( moreIcon, _self.config.iconPrefix );
		core.style.addClass( moreIcon, _self.config.iconClass );
		moreButton.appendChild( moreIcon );
		_self.moreNavs.button = moreButton;

		var moreDropdown = document.createElement(_self.config.navWrapTag);
		core.style.addClass( moreDropdown, _self.config.moreDropdownClass );
		moreNav.appendChild( moreDropdown );
		_self.moreNavs.dropdown = moreDropdown;

		_self.config.navItemsWrap.appendChild( moreNav );
		moreNav.isMoreNav = true;
		_self.config.navs.push( moreNav );

		_self.moreNavs.wrapWidth = 0; // set to 0 to force check on first run
		checkMoreToggle( _self );

		var windowResizeListener = {
			method: function( args ) {
				checkMoreToggle( args.scope );
			},
			args: {
				scope: _self
			}
		};

		core.event.windowResize.add( windowResizeListener );

	};

	var checkMoreToggle = function( _self ) {
		//Take into consideration the nav items wrapper padding
		var navItemsWrapStyle = getComputedStyle( _self.config.navItemsWrap);
		var navItemsWrapPadding = parseInt(navItemsWrapStyle.paddingLeft) + parseInt(navItemsWrapStyle.paddingRight);
		var wrapWidth = core.style.outerWidth(_self.config.navWrap) - (navItemsWrapPadding + _self.config.toleranceWidth);

		// check to see if the width has changed
		if ( _self.moreNavs.wrapWidth !== wrapWidth ) {

			var widthRemaining = wrapWidth;
			toggleShowMoreNav(_self, true);
			widthRemaining -= core.style.outerWidth(_self.moreNavs.nav);
			toggleShowMoreNav(_self, false);

			_self.config.navs.forEach(function(nav, i) {
				if(!nav.isMoreNav) {
					var navActivatorWidth = 0;
					if(widthRemaining !== -1) {
						//We have to show tab before working out the width
						showNavButton( nav, _self );
						navActivatorWidth =  core.style.outerWidth(nav);
					}
					if ( widthRemaining < navActivatorWidth ) {
						hideNavButton( nav, _self );
						widthRemaining = -1;
					} else {
						widthRemaining -= navActivatorWidth;
					}
				}
			});

			if(widthRemaining === -1){
				toggleShowMoreNav(_self, true);
			}

			checkAndSetActiveTab( _self );

			// update stored width
			_self.moreNavs.wrapWidth = wrapWidth;

		}

	};

	var toggleShowMoreNav = function ( _self, show ) {

		if ( show ) {
			core.style.addClass(_self.config.navItemsWrap, 'showMoreEnabled');
			core.event.listenForOutsideClick.addElement( _self.moreNavs.dropdown, function() {
				toggleMoreDropdown( _self, true );
			}, _self.moreNavs.button );
		} else {
			core.style.removeClass(_self.config.navItemsWrap, 'showMoreEnabled');
			core.event.listenForOutsideClick.removeElement( _self.moreNavs.dropdown );
		}

	};

	var toggleMoreDropdown = function ( _self, forceClose ) {

		if ( forceClose ) {
			core.style.removeClass( _self.moreNavs.nav, _self.config.openClass );
		} else {
			core.style.toggleClass( _self.moreNavs.nav, _self.config.openClass );
		}

	};

	var hideNavButton = function ( nav, _self ) {

		if ( core.style.hasClass( nav, _self.config.hideClass ) ) {
			return;
		}

		if ( !nav.navClone ) {
			nav.navClone = nav.cloneNode( true );
		}

		nav.isHidden = true;
		core.style.addClass( nav, _self.config.hideClass );

		var listItems = _self.moreNavs.dropdown.getElementsByTagName( _self.config.navItemTag );
		if ( listItems.length === 0) {
			_self.moreNavs.dropdown.appendChild( nav.navClone );
		} else {
			for (var i = 0; i < listItems.length; i++) {
				if ( nav.index > listItems[i].getAttribute(_self.config.dataNavIndexSelector) ) {
					_self.moreNavs.dropdown.insertBefore( nav.navClone, listItems[i]);
					return;
				} else if ( i === (listItems.length - 1) ) {
					_self.moreNavs.dropdown.appendChild( nav.navClone );
				}
			}
		}

	};

	var showNavButton = function ( nav, _self ) {

		if ( !core.style.hasClass( nav, _self.config.hideClass ) ) {
			return;
		}

		nav.isHidden = false;
		core.style.removeClass( nav, _self.config.hideClass );
		_self.moreNavs.dropdown.removeChild( nav.navClone);

	};


	var checkAndSetActiveTab = function( _self ){
		var activeInMoreTab = false;
		for (var i = 0; i < _self.moreNavs.dropdown.childNodes.length; i++) {
			if(_self.moreNavs.dropdown.childNodes[i].classList.contains(_self.config.activeClass)){
				activeInMoreTab = true;
				break;
			}
		}
		if(activeInMoreTab) {
			core.style.addClass(_self.moreNavs.dropdown.parentNode, _self.config.activeClass );
		} else {
			core.style.removeClass(_self.moreNavs.dropdown.parentNode, _self.config.activeClass );
		}

	};

	var init = function( _self ){
		buildNavs( _self );
	};

	/* PUBLIC OBJECT */

	/**
	 * Constructor for MoreNav object
	 *
	 * @param {Object.<Config>} [config] Config properties used when consructing a nav
	 * @constructor
	 */
	ui.moreNav = function( config ){

		var _self = this;
		_self.config = setDefaults( config || {} );
		init( _self );
		if( typeof _self.config.buildCallback === 'function' ){
			_self.config.buildCallback( _self );
		}

	};

    /**
     * Will perform the calculations again for showing/hiding elements in the more nav
     */
    ui.moreNav.prototype.reset = function() {
        var _self = this;
        _self.moreNavs.wrapWidth = 0;
        checkMoreToggle( _self );
    };

}( PULSE.ui, PULSE.core ));


/*globals PULSE.ui, PULSE.core */
( function( ui, core ) {


	/**
	 * @namespace ui.pagination.private
	 */

	/**
	 * draw the pagination from the template
	 *
	 * @param {ui.scrollpagination} _self contextual reference to the object that is calling the function
	 */
	var drawPagination = function( _self )
	{
		_self.element.innerHTML = Mustache.render( _self.paginationTemplate, {} );
		_self.previousContainer = _self.element.getElementsByClassName( 'paginationPreviousContainer' )[ 0 ];
		_self.nextContainer = _self.element.getElementsByClassName( 'paginationNextContainer' )[ 0 ];
	};

	/**
	 * set the next/previous listeners for the pagination
	 *
	 * @param {ui.pagination} _self contextual reference to the object that is calling the function
	 */
	var setListeners = function( _self )
	{
		_self.previousContainer.addEventListener( 'click', function( evt ) {
			if ( ! core.style.hasClass( _self.previousContainer, 'inactive' ) )
			{
				_self.pageInfo.page--;
				_self.refreshPagination( _self.config.callback );
			}
		} );

		_self.nextContainer.addEventListener( 'click', function( evt ) {
			if ( ! core.style.hasClass( _self.nextContainer, 'inactive' ) )
			{
				_self.pageInfo.page++;
				_self.refreshPagination( _self.config.callback );
			}
		} );
	};

	/**
	 * create pagination, for requesting more content
	 *
	 * @param {HTMLElement} element Element to hold the pagination
	 * @param {config} config Configuration for the pagination :
	 	- pageInfo : Pagination Object:
	 		- page
	 		- pageSize
	 		- numEntries
	 		- numPages
	 	- callback: Callback when a new page is requested
	 */
	ui.pagination = function( element, config ) {
		var _self = this;

		_self.config = config || {};
		_self.element = element;
		_self.paginationTemplate = config.paginationTemplate;

		drawPagination( _self );
		_self.initPagination( config.pageInfo );

		setListeners( _self );
	};

	ui.pagination.prototype.initPagination = function( pageInfo )
	{
		var _self = this;

		_self.pageInfo = pageInfo || {};
		if ( !_self.pageInfo.page )
		{
			_self.pageInfo.page = 0;
		}

		if ( !_self.pageInfo.pageSize )
		{
			_self.pageInfo.pageSize = 10;
		}

		if ( !_self.pageInfo.numEntries )
		{
			_self.pageInfo.numEntries = 0;
		}

		if ( !_self.pageInfo.numPages && parseInt( _self.pageInfo.numEntries ) > -1 )
		{
			_self.pageInfo.numPages = Math.ceil( parseInt( _self.pageInfo.numEntries ) / parseInt( _self.pageInfo.pageSize ) );
		}
		_self.refreshPagination();
	};

	/**
	 * refresh pagination to calculate whether a button should be inactive or not. Do callback if applicable
	 *
	 * @param {function} callback Optional callback when refreshing pagination
	 */
	ui.pagination.prototype.refreshPagination = function( callback )
	{
		var _self = this;

		if  ( ( _self.pageInfo.numPages !== undefined && ( _self.pageInfo.page >= _self.pageInfo.numPages - 1 || _self.pageInfo.numPages < 1 ) ) || ( _self.pageInfo.numPages === undefined && _self.pageInfo.currentSize < _self.pageInfo.pageSize ) )
		{
			_self.pageInfo.page = ( _self.pageInfo.numPages !== undefined ) ? _self.pageInfo.numPages - 1 : _self.pageInfo.page;
			core.style.addClass( _self.nextContainer, 'inactive' );
		}
		else
		{
			core.style.removeClass( _self.nextContainer, 'inactive' );
		}

		if ( _self.pageInfo.page > 0 )
		{
			core.style.removeClass( _self.previousContainer, 'inactive' );
		}
		else
		{
			_self.pageInfo.page = 0;
			core.style.addClass( _self.previousContainer, 'inactive' );
		}
		if ( callback && _self.config.target )
		{
			callback.call( _self.config.target, _self.pageInfo );
		}
	};

	ui.pagination.prototype.updateCurrentSize = function( size )
	{
		var _self = this;

		_self.pageInfo.currentSize = size;
		_self.refreshPagination();
	};

} )( PULSE.ui, PULSE.core );

/*globals PULSE, PULSE.ui, PULSE.core */

(function( ui, core ){
	"use strict";

	/**
	 * ShareText Object:
	 * @typedef {Object} ShareText
	 */

	/**
	 * Config Object:
	 * @typedef {Object} Config
     * @property {String} [activeClass] CSS class used when the share option is displayed
     * @property {String} [socialService] Data attribute of a social channel
     * @property {boolean} [hideUrl] Flag if the current page URL should also be shared with the selected text - default: true
     * @property {Integer} [delay] delay time in ms of when the social options should appear after selecting text
	 */

	/**
	 * @namespace ui.shareText.private
	 */

	/* PRIVATE METHODS */

	var setDefaults = function( config ) {

		if ( !config.activeClass ) {
			config.activeClass = 'active';
		}
        if (!config.socialService) {
            config.socialService = 'data-social-service';
        }
        if (!config.hideUrl) {
            config.hideUrl = true;
        }
        if (!config.delay) {
            config.delay = 250;
        }

		return config;

	};

	var setEventListeners = function( _self ) {

        _self.contentElement.addEventListener('mousedown', function(e) {
            _self.mouseDown = true;
        });
        _self.contentElement.addEventListener('touchstart', function(e) {
            _self.mouseDown = true;
        });

        document.body.addEventListener('mouseup', function(e) {
            onPointerUp(e, _self);
        });

        document.body.addEventListener('touchend', function(e) {
           if (e.changedTouches.length) {
               onPointerUp(e.changedTouches[0], _self);
           }
        });

        document.body.addEventListener('mousedown', function() {
            closeShareOptions(_self);
        });

        document.body.addEventListener('keydown', function() {
            closeShareOptions(_self);
        });

        if (_self.shareChannels.length) {
            var eventFunc = function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (typeof _self.config.channelSelectionCallback === 'function') {
                    _self.config.channelSelectionCallback( this, _self.selectedText );
                } else {
                    channelSelectionCallback( e, _self );
                }
            };
            var preventAction = function(e) {
                e.preventDefault();
            };

            for (var i = 0; i < _self.shareChannels.length; i++) {
                _self.shareChannels[i].addEventListener('mousedown', eventFunc);
                _self.shareChannels[i].addEventListener('touchstart', eventFunc);
                if (_self.shareChannels[i].getAttribute('prevent-action') !== null) {
                    _self.shareChannels[i].addEventListener('click', preventAction);
                }
            }
        }

	};

    var channelSelectionCallback = function(evt, _self) {
        // handle clicks on individual social clicks
        var clicked = _self.getSocialDataset( evt.currentTarget );
        if ( clicked && clicked.socialService ) {
            ui.socialHelpers[ clicked.socialService ].sharePage( null, false, _self.selectedText, _self.config.hideUrl, evt.currentTarget );
        }
    };

    var onPointerUp = function(e, _self) {
        if (_self.mouseDown) {
            _self.pointer = e;

            setTimeout(function() {
                checkTextSelection(_self);
                _self.mouseDown = false;
            }, _self.config.delay);
        }
    };

    var checkTextSelection = function (_self) {
        _self.selectedText = getSelectedText();

        if (_self.selectedText && _self.selectedText.length) {
            showShareOptions(_self);
        } else {
            closeShareOptions(_self);
        }
    };

    var getSelectedText = function () {

        var text = '';

        if (typeof window.getSelection !== 'undefined') {
            text = window.getSelection().toString();
        } else if (typeof document.selection !== 'undefined' && document.selection.type == 'Text') {
            text = document.selection.createRange().text;
        }

        if (String.prototype.trim) {
            text = text.trim();
        }

        return text;
    };

    var showShareOptions = function(_self) {
        core.style.addClass(_self.shareOptions, _self.config.activeClass);

        var y = _self.pointer.pageY - _self.contentElement.offsetTop;

        _self.shareOptions.style.left = (_self.shareOptions.offsetWidth ? _self.pointer.clientX - (_self.shareOptions.offsetWidth / 2) : _self.pointer.clientX) + 'px';
        _self.shareOptions.style.top = (_self.pointer.clientY + document.body.scrollTop) + 'px';
    };

    var closeShareOptions = function(_self) {
        core.style.removeClass(_self.shareOptions, _self.config.activeClass);
    };

	var init = function( _self ) {
        _self.contentElement = document.querySelector(_self.config.content);
        _self.shareOptions = document.querySelector(_self.config.shareOptions);
        _self.shareChannels = document.querySelectorAll(_self.config.shareChannels);

        if (_self.contentElement && _self.shareOptions) {
    		setEventListeners( _self );
        }
	};

	/* PUBLIC OBJECT */

	/**
	 * Constructor for shareText object
	 *
	 * @param {Object.<Config>} [config] Config properties used when consructing the text share functionality
	 * @constructor
	 */
	ui.shareText = function( config ){

		var _self = this;
		_self.config = setDefaults( config || {} );

		init( _self );

		if ( typeof _self.config.buildCallback === 'function' ) {
			_self.config.buildCallback( _self );
		}

	};

    /**
	 * move up the dom tree to find the element containing the desired data attributes. Do not traverse up past the
	 * widget container. return the data set attribute of the element.
	 *
	 * @param {object} element DOM Element on which to begin the traversal
	 * @returns {object} hash - dataset attribute of the element or fale if no element can be found
	 */
	ui.shareText.prototype.getSocialDataset = function( element ) {
		var _self = this,
            inspecting = element;

		do {
            if (inspecting) {
    			if( inspecting.getAttribute( 'data-social-service' ) ) {
    				return inspecting.dataset;
    			}
    			inspecting = inspecting.parentElement;
            } else {
                break;
            }
		} while ( inspecting !== _self.element );

		return false;
	};

}( PULSE.ui, PULSE.core ));


/*globals PULSE, PULSE.ui*/

( function( ui ) {

	/**
	 * @namespace ui.socialHelpers.private
	 */

	/**
	 * Create a set of basic functionality that social widgets will share
	 * Individual social helpers can be extended with extra functions in ./social-service
	 *
	 * @param {string} serviceName name of the social service, should correlate to an entry
	 * in socialLinks object
	 *
	 * @constructor
	 */
	var socialHelper = function( serviceName ) {

        var _self = this;
		_self.name = serviceName;

		_self.socialLinks = {
			"twitter" : { "shareUrl" : "http://www.twitter.com/intent/tweet?text=" },
			"facebook" : { "shareUrl" : "http://www.facebook.com/sharer/sharer.php?u=" },
			"googleplus" : { "shareUrl" : "http://plus.google.com/share?url=" },
			"whatsapp" : { "shareUrl" : "whatsapp://send?text=" },
			"email" : { }
		};

		_self.defaultWindowConfiguration = {
			"width" : "500",
			"height" : "500",
			"menubar" : 0,
			"location" : 1,
			"resizable" : 0,
			"scrollbars" : 0,
			"status" : 0,
			"titlebar" : 0,
			"toolbar" : 0
		};

	};

	/**
	 * Share a page url or the current page url ( if no url passed ) to the social
	 * media site with which the instance was created
	 *
	 * @param {string} url the url to share on the social media site
	 * @param {string} body optionally provide a text to share
	 * @param {boolean} doNotDisplayUrl flag if a URL should be shown with the shared text
     * @returns {string} url string inclusive of the encoded url
	 */
	socialHelper.prototype.buildShareUrl = function( url, body, service, doNotDisplayUrl ) {

		var _self = this,
            href = url ? url : window.location.href,
            share = doNotDisplayUrl ? '' : href;

		if ( body ) {
			share += " " + body;
		}
        if (service === 'facebook') {
            share = href;
        }

		return _self.socialLinks[ _self.name ].shareUrl + encodeURIComponent( share );
	};

	/**
	 * create s string representation of the configuration object provided so it can be
	 * used in the call to window.open, for example;
	 *
	 * "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
	 *
	 * @param {object} windowConfiguration the configuration object to stringify
	 * @returns {string} comma separated list of configuration parameters
	 */
	socialHelper.prototype.makeWindowConfigurationString = function( windowConfiguration ) {

		if ( windowConfiguration ) {

			var settings = Object.keys( windowConfiguration );
			var configurationString = "";

			for ( c = 0; c < settings.length; c++ ) {

				configurationString += settings[ c ] + '=' + windowConfiguration[ settings[ c ] ];

				if ( c < ( settings.length -1 ) ) {
					configurationString += ',';
				}
			}

			return configurationString;
		}

		return false;
	};

	/**
	 * create a share url for the service with which the instance was created and open a
	 * new window using the parameters provided, or the defaults.
	 *
	 * @param {string} url optionally provide a specific url to link to, otherwise the current window.location
	 * will be used to create a share url link
     * @param {object} windowConfiguration optionally provide a window configuration object
	 * @param {string} body optionally provide a text to share
	 * @param {boolean} doNotDisplayUrl flag if a URL should be shown with the shared text
	 */
	socialHelper.prototype.sharePage = function( url, windowConfiguration, body, doNotDisplayUrl, elem ) {

        var _self = this, link;

        switch (_self.name) {
            case 'email':
                if (elem) {
                    link = 'mailto:?body=' + body;
                    elem.setAttribute('href', link);
                }
                break;
            case 'whatsapp':
                if (elem) {
                    link = _self.socialLinks.whatsapp.shareUrl + body;
                    elem.setAttribute('href', link);
                }
                break;
            default:
                window.open( _self.buildShareUrl( url, body, _self.name, doNotDisplayUrl ), "_blank", _self.makeWindowConfigurationString(
                    windowConfiguration || _self.defaultWindowConfiguration ) );
        }
	};

	/**
	 * keep the social helpers under the ui object
	 *
	 * @type {{twitter: socialHelper, facebook: socialHelper, google: socialHelper}}
	 */
	ui.socialHelpers = {
		"twitter" : new socialHelper( 'twitter' ),
		"facebook" : new socialHelper( 'facebook' ),
        "google" : new socialHelper( 'googleplus' ),
		"email" : new socialHelper( 'email' ),
		"whatsapp" : new socialHelper( 'whatsapp' )
	};

} )( PULSE.ui );

/*globals PULSE, PULSE.ui, PULSE.core */

(function( ui, core ){
	"use strict";

	/**
	 * Tab Object:
	 * @typedef {Object} Tab
	 * @property {String} title Title text for tab activator
	 * @property {HTMLElement} activator HTML element that triggers this Instance content to be set in the modal
	 * @property {HTMLElement} content HTML element that is the target content displayed for this instance
	 * @property {String} uiArgs Arguments to be used within callback methods as stringified JSON
	 */

	/**
	 * Config Object:
	 * @typedef {Object} Config
	 * @property {HTMLElement} [tabItems] A Nodelist/Array of tab content items - defaults to all elements with the attribute '[data-ui-tab]'
	 * @property {String} [builtClass] CSS class applied to wrap object when the tabs are built - defaults to 'tabbed'
	 * @property {String} [activeClass] CSS class used to define active tab objects - defaults to 'active'
	 * @property {HTMLElement} [tabLinkWrap] A single wrapping HTML element - if provided the tab links are placed within this element, else they are placed as the first-child of wrap
	 * @property {String} [tabParam] Query string param used to set default active tab - defaults to 'tab'
	 * @property {Function} [tabCallback] Function to be called when a tab is opened - receives full tab object
	 * @property {Function} [buildCallback] Function to be called when a tab ui is built - receives full tab object
	 */

	/**
	 * @namespace ui.tab.private
	 */

	/* PRIVATE VARIABLES */
	var resizeTimer;

	var ENTER_KEY = 13;

	/* PRIVATE METHODS */

	var setDefaults = function( config ){

		if( !config.tabItems ){
			config.tabItems = document.querySelectorAll( '[data-ui-tab]' );
		}
		if( !config.builtClass ){
			config.builtClass = 'tabbed';
		}
		if ( !config.defaultIndex )
		{
			config.defaultIndex = 0;
		}

		if( !config.activeClass ){
			config.activeClass = 'active';
		}
		if ( !config.disableClass ){
			config.disableClass = 'disabled';
		}
		if( !config.tabParam ){
			config.tabParam = 'tab';
		}
		if( !config.moreToggle ){
			config.moreToggle = false;
		}
		if( !config.moreLabel ){
			config.moreLabel = 'More';
		}
		config.tabs = [];
		return config;

	};


	var buildTabs = function( _self ){

		_self.config.wrap = document.createElement('div');
		_self.config.tabItems[0].parentNode.insertBefore( _self.config.wrap, _self.config.tabItems[0] );

		_self.config.nav = document.createElement('ul');
		_self.config.nav.classList.add('tablist');
		_self.config.nav.setAttribute( 'role', 'tablist' );

		Array.prototype.map.call( _self.config.tabItems, function( el, index ){
			var title = el.getAttribute('data-ui-tab');
			var args;
			if( el.getAttribute('data-ui-args') ){
				args = JSON.parse( el.getAttribute('data-ui-args') );
			}
			var tab = {
				index: index,
				title: title,
				content: el,
				activator: document.createElement('li'),
				uiArgs: args,
				isHidden: false
			};
			tab.title = tab.content.getAttribute('data-ui-tab');
			tab.activator.textContent = tab.title;
			tab.activator.setAttribute( 'role', 'tab' );
			tab.activator.setAttribute( 'tabindex', '0' );
			tab.activator.setAttribute( 'data-tab-index', tab.index );
			tab.activator.addEventListener( 'click', function(){
				setActiveTab( tab, _self );
			});

			tab.activator.addEventListener( 'keyup', function (evt) {
				var keyPressed = evt.which || evt.keyCode;
				if ( keyPressed === ENTER_KEY ) {
					setActiveTab(tab, _self);
				}
			});

			if (_self.config.setTabClass) {
							tab.activator.classList.add(_self.config.setTabClass);
			}

			var customClass = tab.content.getAttribute('data-ui-class');
			if ( customClass )
			{
				tab.activator.classList.add( customClass );
			}

			if ( tab.content.getAttribute('data-ui-disabled') )
			{
				tab.activator.classList.add( _self.config.disableClass );
			}

			_self.config.tabs.push( tab );
			_self.config.wrap.appendChild( tab.content );
			_self.config.nav.appendChild( tab.activator );
		} );

		if ( _self.config.tabs.length - 1 < _self.config.defaultIndex )
		{
			_self.config.defaultIndex = _self.config.tabs.length - 1;
		}

		if( _self.config.tabLinkWrap ){
			_self.config.tabLinkWrap.appendChild( _self.config.nav );
		}
		else {
			var navWrap = document.createElement('nav');
			navWrap.classList.add('tabs');
			navWrap.appendChild( _self.config.nav );
		 	_self.config.wrap.insertBefore( navWrap, _self.config.wrap.firstChild );
		}
		_self.config.wrap.classList.add( _self.config.builtClass );

		if ( _self.config.moreToggle ) {
			createMoreToggle( _self );
		}

	};

	var setActiveTab = function( tab, _self, noCallback ){

		if ( _self.config.current === tab ) {
			return;
		}

		if ( core.style.hasClass( tab.activator, _self.config.disableClass ) )
		{
			return;
		}

		_self.config.tabs.map( function( item ){
			core.style.removeClass( item.content, _self.config.activeClass );
			core.style.removeClass( item.activator, _self.config.activeClass );
			if ( _self.config.moreToggle) {
				if ( item.activatorClone ) {
					core.style.removeClass( item.activatorClone, _self.config.activeClass );
				}
				core.style.removeClass( _self.moreTabs.tab, _self.config.activeClass );
			}
		} );

		core.style.addClass( tab.content, _self.config.activeClass );
		core.style.addClass( tab.activator, _self.config.activeClass );

		if ( _self.config.moreToggle ) {
			toggleMoreDropdown( _self, true );
			if ( tab.activatorClone ) {
				core.style.addClass( tab.activatorClone, _self.config.activeClass );
			}
			if ( _self.moreTabs.visible && tab.isHidden ) {
				core.style.addClass( _self.moreTabs.tab, _self.config.activeClass );
			}
		}

		_self.config.current = tab;
		if( typeof _self.config.tabCallback === 'function' && !noCallback ){
			_self.config.tabCallback( _self );
		}

	};

	var getTabByTitle = function( _self, title )
	{
		var targetTab = _self.config.tabs[ _self.config.defaultIndex ];
		if ( _self.config.tabs.length > 1 )
		{
			for ( var i = 0; i < _self.config.tabs.length; i++ )
			{
				if ( _self.config.tabs[ i ].title === title )
				{
					return _self.config.tabs[ i ];
				}
			}
		}
		return targetTab;
	};

	var getNonDisabledTab = function( _self )
	{
		var i = 0;
		var startIndex = _self.config.defaultIndex;
		while ( i < _self.config.tabs.length )
		{
			if ( startIndex > _self.config.tabs.length - 1 )
			{
				startIndex = 0;
			}
			if ( !core.style.hasClass( _self.config.tabs[ startIndex ].activator, _self.config.disableClass ) )
			{
				return _self.config.tabs[ startIndex ];
			}
			startIndex++;
			i++;
		}
		return _self.config.tabs[ _self.config.defaultIndex ];
	};

	var defaultTab = function( _self, tabTitle ){

		var defaultTabTitle = ( _self.config.defaultTitle ) ? _self.config.defaultTitle : core.url.getParam( _self.config.tabParam );
		var tabParam = tabTitle || defaultTabTitle;
		var targetTab = _self.config.tabs[ _self.config.defaultIndex ];
		if( tabParam ){
			targetTab = getTabByTitle( _self, tabParam );
		}
		if ( core.style.hasClass( targetTab.activator, _self.config.disableClass ) )
		{
			targetTab = getNonDisabledTab( _self );
		}
		setActiveTab( targetTab, _self, true );
		if( typeof _self.config.buildCallback === 'function' ){
			_self.config.buildCallback( _self );
		}

	};

	var createMoreToggle = function( _self ) {
		_self.moreTabs = {};
		_self.moreTabs.visible = false;

		var moreTab = document.createElement('li');
		core.style.addClass( moreTab, 'more' );
		_self.moreTabs.tab = moreTab;

		var moreButton = document.createElement('div');
		core.style.addClass( moreButton, 'moreToggle' );
		moreButton.textContent = _self.config.moreLabel;
		moreButton.addEventListener( 'click', function(){
			toggleMoreDropdown( _self );
		});
		moreTab.appendChild( moreButton );

		var moreIcon = document.createElement('div');
		core.style.addClass( moreIcon, 'icn' );
		core.style.addClass( moreIcon, 'chevron-down' );
		moreButton.appendChild( moreIcon );

		var moreDropdown = document.createElement('ul');
		core.style.addClass( moreDropdown, 'moreToggleDropdown' );
		moreTab.appendChild( moreDropdown );
		_self.moreTabs.dropdown = moreDropdown;

		_self.config.nav.appendChild( moreTab );

		_self.moreTabs.wrapWidth = 0; // set to 0 to force check on first run
		checkMoreToggle( _self );

		var windowResizeListener = {
			method: function( args ) {
				checkMoreToggle( args.scope );
			},
			args: {
				scope: _self
			}
		};

		core.event.windowResize.add( windowResizeListener );

	};

	var checkMoreToggle = function( _self ) {
		var wrapWidth = _self.config.wrap.offsetWidth;

		// check to see if the width has changed
		if ( _self.moreTabs.wrapWidth !== wrapWidth ) {
			// measure total width of all tabs (not including show more tab)
			var totalTabWidths = 0;
			_self.config.tabs.forEach(function(tab) {
				var width = core.style.outerWidth(tab.activator);
				totalTabWidths += width;
				tab.activatorWidth = width;
			});

			// check to see if tabs fit in new wrap width
			if ( wrapWidth <= totalTabWidths ) {
				var widthRemaining = wrapWidth;
				widthRemaining -= core.style.outerWidth(_self.moreTabs.tab);

				_self.moreTabs.visible = true;
				core.style.addClass( _self.config.nav, 'showMoreEnabled');

				_self.config.tabs.forEach(function(tab, i) {
					if ( widthRemaining < tab.activatorWidth ) {
						hideTabButton( tab, _self );
						widthRemaining = -1;
						if ( _self.config.current === tab ) {
							core.style.addClass( _self.moreTabs.tab, _self.config.activeClass );
						}
					} else {
						showTabButton( tab, _self );
						widthRemaining -= tab.activatorWidth;
						if ( _self.config.current === tab ) {
							core.style.removeClass( _self.moreTabs.tab, _self.config.activeClass );
						}
					}
				});
			} else {
				_self.moreTabs.visible = false;
				core.style.removeClass( _self.config.nav, 'showMoreEnabled');

				_self.config.tabs.forEach(function(tab) {
					showTabButton( tab, _self );
				});
			}

			// update stored width
			_self.moreTabs.wrapWidth = wrapWidth;
		}

	};

	var toggleMoreDropdown = function ( _self, forceClose ) {

		if ( forceClose ) {
			core.style.removeClass( _self.moreTabs.tab, 'open' );
		} else {
			core.style.toggleClass( _self.moreTabs.tab, 'open' );
		}

	};

	var hideTabButton = function ( tab, _self ) {

		if ( core.style.hasClass( tab.activator, 'hide' ) ) {
			return;
		}

		if ( !tab.activatorClone ) {
			tab.activatorClone = tab.activator.cloneNode( true );
			tab.activatorClone.addEventListener( 'click', function(){
				setActiveTab( tab, _self );
			});
		}

		tab.isHidden = true;
		core.style.addClass( tab.activator, 'hide' );

		var listItems = _self.moreTabs.dropdown.getElementsByTagName( 'li' );
		if ( listItems.length === 0) {
			_self.moreTabs.dropdown.appendChild( tab.activatorClone );
		} else {
			for (var i = 0; i < listItems.length; i++) {
				if ( tab.index < listItems[i].getAttribute('data-tab-index') ) {
					_self.moreTabs.dropdown.insertBefore( tab.activatorClone, listItems[i]);
					return;
				} else if ( i === (listItems.length - 1) ) {
					_self.moreTabs.dropdown.appendChild( tab.activatorClone );
				}
			}
		}

	};

	var showTabButton = function ( tab, _self ) {

		if ( !core.style.hasClass( tab.activator, 'hide' ) ) {
			return;
		}

		tab.isHidden = false;
		core.style.removeClass( tab.activator, 'hide' );
		_self.moreTabs.dropdown.removeChild( tab.activatorClone );

	};

	var init = function( _self ){

		buildTabs( _self );
		defaultTab( _self );

	};

	var disableTab = function( targetTab, _self ) {
		core.style.addClass( targetTab.activator, _self.config.disableClass );
		if ( core.style.hasClass( targetTab.activator, _self.config.activeClass ) )
		{
			var nonDisabledTab = getNonDisabledTab( _self );
			setActiveTab( nonDisabledTab, _self );
		}
	};

	/* PUBLIC OBJECT */

	/**
	 * Constructor for tab object
	 *
	 * @param {Object.<Config>} [config] Config properties used when consructing a tab
	 * @constructor
	 */
	ui.tab = function( config ){

		if( config.tabItems && config.tabItems.length < 1 ){
			return "no tab items to build";
		}

		var _self = this;
		_self.config = setDefaults( config || {} );
		init( _self );

	};

	/**
	 * Show a tab based on the given index
	 * If no match is found, first tab is set to active
	 * @return {Object} Full tab object
	 */
	ui.tab.prototype.showTabByIndex = function( index ){

		var _self = this;
		var targetTab = _self.config.tabs[index] || _self.config.tabs[0];
		setActiveTab( targetTab, _self );

		return _self;

	};

	/**
	 * Show a tab based on the given title
	 * If no match is found, first tab is set to active
	 * @return {Object} Full tab object
	 */
	ui.tab.prototype.showTabByTitle = function( title ){

		var _self = this;
		defaultTab( _self, title );

		return _self;

	};

	/**
	 * Enable a tab based on the given index
	 * If no match is found, first tab is enabled
	 * @return {Object} Full tab object
	 */
	ui.tab.prototype.enableTabByIndex = function( index ){

		var _self = this;
		var targetTab = _self.config.tabs[index] || _self.config.tabs[0];
		core.style.removeClass( targetTab.activator, _self.config.disableClass );

		return _self;
	};

	/**
	 * Enable a tab based on the given index
	 * If no match is found, first tab is enabled
	 * @return {Object} Full tab object
	 */
	ui.tab.prototype.enableTabByTitle = function( title ){

		var _self = this;
		var targetTab = getTabByTitle( _self, title );
		core.style.removeClass( targetTab.activator, _self.config.disableClass );

		return _self;
	};

	/**
	 * Disable tab based on index
	 * If no match is found, first tab is disabled
	 * @return {Object} Full tab object
	 */
	ui.tab.prototype.disableTabByIndex = function( index ){
		var _self = this;
		var targetTab = _self.config.tabs[index] || _self.config.tabs[0];
		disableTab( targetTab, _self );

		return _self;
	};

	/**
	 * Disable tab based on index
	 * If no match is found, first tab is disabled
	 * @return {Object} Full tab object
	 */
	ui.tab.prototype.disableTabByTitle = function( title ){
		var _self = this;
		var targetTab = getTabByTitle( _self, title );
		disableTab( targetTab, _self );

		return _self;
	};

}( PULSE.ui, PULSE.core ));

(function( ui, core ) {
    "use strict";

    ui.photoGalleries = [];

    /**
    * Config Object:
    * @typedef {Object} Config
    * @property {String} [itemSelector] CSS selector for the gallery items
    * @property {String} [imageSelector] CSS selector for the gallery item photos
    * @property {Array} [instances] Array which contains all instances of galleries - default []
    * @property {Float} [attractionStrength] Physics setting - strength of the attraction power to a position
    * @property {Float} [friction] Physics setting - friction from 0 to 1, where 0 is no friction
    * @property {Integer} [initialIndex] Display item at this index when gallery is created
    * @property {Boolean} [draggable] Is slider draggable on non touch devices - default false
    * @property {Boolean} [resize] Does the gallery resize when browser size changes - default true
    * @property {Boolean} [expandable] Can open image in full screen - default true
    * @property {Object} [thumbnails] Show photo thumbnails - default null
    * @property {Object} [controls] Will contain all control elements (prev, next, expand, ...)
    * @property {Boolean} [singlePhotoViewer] Flag if it's only a gallery for a single photo (e.g. a simple photo modal)
    * @property {Boolean} [keyboardNavigation] Is keyboard navigation of the gallery activated
    *
    * @property {Function} [onGalleryBuilt] Callback event when the gallery has been loaded and built
    * @property {Function} [onFullscreenOpened] Callback event when the fullscreen mode has been opened
    * @property {Function} [onFullscreenClosed] Callback event when the fullscreen mode has been closed
    * @property {Function} [isVisibleEvent] Callback event when the gallery becomes visible in the browser viewport
    * /

    /* PRIVATE METHODS */

    var setDefaults = function( config ){

        var defaults = {
            itemSelector: '.swingSloth__item',
            imageSelector: '.swingSloth__image',
            instances: [],
            attractionStrength: 0.025,
            friction: 0.16,
            initialIndex: 0,
            draggable: false,
            resize: true,
            expandable: true,
            thumbnails: null,
            controls: {},
            singlePhotoViewer: false,
            keyboardNavigation: true,

            // event callbacks
            onGalleryBuilt: function() { },
            onFullscreenOpened: function() { },
            onFullscreenClosed: function() { },
            isVisibleEvent: function() { }
        };

        config.singlePhotoViewer = config.singlePhotoViewer === 'true' ? true : false;

        config = core.object.extend(defaults, config);

        return config;

    };

    var setupGallery = function( _self ){

        // initial properties
        _self.selectedIndex = _self.config.initialIndex;
        _self.sliderPos = 0;
        _self.sliderPosTarget = 0;
        _self.firstItemLoaded = false;
        _self.highestItem = _self.config.maxHeight ? 99999 : 0;
        _self.controls = {};

        // initial physics properties
        _self.velocityX = 0;
        _self.acceleration = 0;
        _self.friction = 1 - _self.config.friction;
        _self.attractStrength = _self.config.attractionStrength;

        // create wrapper, viewport & slider
        createWrapper(_self);
        createViewport(_self);
        createSliderContainer(_self);

        createDrag(_self); // add drag event & functionality
        create(_self); // create gallery content
        createCSSStyles(_self); // add gallery specific css

        if (_self.selectedIndex > 0 && _self.selectedIndex < _self.items.length) {
            // move slide to specified index from config.initialIndex
            _self.moveSlideTo(_self.selectedIndex, 1, true);
        } else {
            _self.selectedIndex = 0;
        }

    };

    var createWrapper = function(_self) {
        _self.wrapper = document.createElement('div');
        _self.wrapper.className = 'swingSloth__wrapper';
    };

    var createViewport = function(_self) {
        _self.viewport = document.createElement('div');
        _self.viewport.className = 'swingSloth__viewport';
        _self.viewport.style.position = 'relative';

        _self.viewport.style.overflow = !_self.config.singlePhotoViewer ? 'hidden' : 'visible';
    };

    var createSliderContainer = function( _self ){
        // slider element does all the positioning
        var slider = document.createElement('div');
        slider.className = 'swingSloth__slider';
        _self.slider = slider;
    };

    /* CSS specificetly needed for gallery */
    var createCSSStyles = function( _self ) {

        if (!document.getElementById('swingsloth__css-styles')) {

            var css = '.swingSloth__wrapper.expanded { position: fixed; width: 100%; height: 100%; max-width: none; top: 0; left: 0; }';
            css += '.swingSloth__viewport { width: 100%; }';
            css += '.swingSloth__wrapper.expanded .bigger-than-viewport img { height: 100%; width: auto; margin: 0 auto; }';

            var style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute('id', 'swingsloth__css-styles');

            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            document.querySelector("head").appendChild(style);

        }

    };

    var createDrag = function(_self) {
        // initialise all drag events
        _self.dragging.initHandlers(_self);
    };

    /* creates the whole gallery content */
    var create = function( _self ) {

        _self.viewport.appendChild( _self.slider );
        _self.wrapper.appendChild( _self.viewport );
        _self.element.insertBefore( _self.wrapper, _self.element.firstChild );
        core.style.addClass(_self.element, 'swingSloth');

        var galleryItems = _self.element.querySelectorAll(_self.config.itemSelector);

        if ( _self.isActive || !galleryItems.length) {
            return;
        }

        _self.isActive = true;

        moveElements( galleryItems, _self.slider );

        reInitiateItems(_self);
        createControls(_self);

        _self.width = _self.viewport.offsetWidth;

        if (_self.config.resize) {
            // add resize event & functionality
            var resize = {
                method: function() {
                    windowResize(_self);
                }
            };
            core.event.windowResize.add(resize);
        }

        setEventListeners(_self);

        // last step, kick off animations!
        _self.animation.animate(_self);

        if (typeof _self.config.onGalleryBuilt === 'function') {
            setTimeout(function(){
                _self.config.onGalleryBuilt();
            }, 0);
        }

    };

    /* move an element into another one */
    var moveElements = function( elems, toElem ) {
        elems = core.object.makeArray( elems );
        while ( elems.length ) {
            toElem.appendChild( elems.shift() );
        }
    };

    var reInitiateItems = function( _self ) {
        _self.items = createItems( _self ); // creates all gallery items
        updateItemSizes(_self);
        positionItems(_self); // positions the items in the slider
        setGallerySize(_self); // sets the gallery size to fit the biggest item

        if (_self.config.created) {
            refreshControls(_self);
        }
    };

    var setEventListeners = function(_self) {
        // scroll event for visibility callback
        window.addEventListener("scroll", isGalleryVisible, false);

        document.onkeydown = checkKeyDownEvent;
    };

    var updateItemSizes = function( _self ) {
        var item, image, content;
        // goes through all gallery items and updates their sizes in the instance
        for ( var i = 0, len = _self.items.length; i < len; i++ ) {
            item = _self.items[i];

            item.width = item.element.offsetWidth;
            item.height = item.element.offsetHeight;
            item.positionX = (i * item.width);

            if (_self.expanded && item.height >= window.innerHeight) {
                core.style.addClass(item.element, 'bigger-than-viewport');
                item.width = item.element.offsetWidth;
                item.height = item.element.offsetHeight;
                item.positionX = (i * item.width);
            } else {
                core.style.removeClass(item.element, 'bigger-than-viewport');
            }

            if (item.height < _self.highestItem) {
                // center image vertically in viewport
                item.element.style.top = '50%';
                if (!_self.config.singlePhotoViewer || (_self.config.singlePhotoViewer && _self.expanded)) {
                    item.element.style.marginTop = -(item.height/2) + 'px';
                } else {
                    item.element.style.marginTop = 0;
                }
            } else {
                item.element.style.top = 0;
                item.element.style.marginTop = 0;
            }
        }
    };

    /* Image load event callback function */
    var itemImageLoaded = function(_self, item) {
        item.height = item.element.offsetHeight;
        item.width = item.element.offsetWidth;
        var higher = _self.config.maxHeight ? (item.height < _self.highestItem) : (item.height > _self.highestItem);

        if (higher) {
            _self.highestItem = item.height;
            setGallerySize(_self);
        }

        if (_self.items) {
            updateItemSizes(_self);
        }
    };

    /* Aligns the content to the viewport when creating the gallery or expanding/closing the modal */
    var alignContent = function(_self, item) {
        if (_self.expanded) {
            var offset = _self.expanded ? window.innerHeight : _self.viewport.offsetHeight,
                spacing = (offset - item.height) / 2;
            item.element.style.marginTop = spacing + 'px';
        }
    };

    /* Creates the gallery items */
    var createItems = function(_self) {
        var itemElems = _self.element.querySelectorAll(_self.config.itemSelector),
            item, items = [], i, len;

        for ( i = 0, len = itemElems.length; i < len; i++ ) {
            item = new _self.Item( itemElems[i], _self, itemImageLoaded);
            items.push( item );
        }

        return items;
    };

    /* Positions the gallery items in the viewport */
    var positionItems = function(_self) {
        var item;
        for ( var i = 0, len = _self.items.length; i < len; i++ ) {
            item = _self.items[i];
            item.positionX = (i * item.width);
            // item.target = item.positionX;
            item.element.style.left = (i * 100) + '%';
        }
    };

    /* Adds controls for gallery navigation */
    var createControls = function( _self ) {
        createPrevNextArrows(_self);

        if (_self.config.expandable) {
            createExpandButton(_self);
        }

        if (_self.config.thumbnails) {
            createThumbnails(_self);
        }

        _self.config.created = true;
    };

    var refreshControls = function( _self ) {
        // refreshs the prev/nav buttons depending on which slide we are
        // e.g. 1st slide - left arrow is hidden
        if (_self.items.length > 1) {
            if (_self.selectedIndex === 0) {
                _self.controls.arrowLeft.style.display = 'none';
                _self.controls.arrowRight.style.display = 'block';
            } else if(_self.selectedIndex === _self.items.length -1) {
                _self.controls.arrowLeft.style.display = 'block';
                _self.controls.arrowRight.style.display = 'none';
            }
        }
    };

    var createPrevNextArrows = function( _self ) {
        var arrowLeft, arrowRight;

        if (_self.config.controls.prev) {
            arrowLeft = _self.config.controls.prev;
        } else {
            arrowLeft = document.createElement('span');
            arrowLeft.className = 'swingSloth__arrowleft';
            arrowLeft.innerHTML = '<';
        }

        if (_self.config.controls.next) {
            arrowRight = _self.config.controls.next;
        } else {
            arrowRight = document.createElement('span');
            arrowRight.className = 'swingSloth__arrowright';
            arrowRight.innerHTML = '>';
        }

        _self.wrapper.appendChild(arrowLeft);
        _self.wrapper.appendChild(arrowRight);

        arrowLeft.style.display = 'none';
        arrowRight.style.display = 'none';

        arrowLeft.addEventListener('click', function(e) { moveSliderEvent(_self, -1, false); });
        arrowRight.addEventListener('click', function(e) { moveSliderEvent(_self, 1, false); });

        _self.controls.arrowLeft = arrowLeft;
        _self.controls.arrowRight = arrowRight;

        // refresh controls for hiding/displaying the appropriate buttons
        refreshControls(_self);
    };

    var createThumbnails = function( _self ) {

        var thumbs, wrapper, list, item, i;

        thumbs = new _self.Thumbnails(_self, _self.config.thumbnails);

    };


    var createExpandButton = function( _self ) {
        var expand = _self.config.controls.expand;

        if (!expand) {
            expand = document.createElement('span');
            expand.className = 'swingSloth__expandicon';
            expand.innerHTML = 'F';

            _self.wrapper.appendChild(expand);
        } else {
            core.style.addClass(expand, 'swingSloth__expandicon');
        }

        _self.controls.expand = expand;

        expand.addEventListener('click', function(e) { _self.toggleGalleryFullscreen(); });
        _self.viewport.addEventListener('touchend', function(e) { onImageTapEnd(_self); }); // on tap on image for touch devices
    };

    var onImageTapEnd = function(_self) {
        if (!_self.hasBeenDragged) {
            _self.toggleGalleryFullscreen();
        }
    };

    /* Event handler fired from controls when the slide needs to be moved to a new item */
    var moveSliderEvent = function( _self, dir, instantMove ) {
        _self.moveSlideTo(_self.selectedIndex + dir, instantMove);
    };

    /* Update the gallery viewport size according to the biggest item */
    var setGallerySize = function(_self) {

        if (_self.items && _self.items.length >= 0) {

            if (_self.highestItem <= 0) {
                _self.highestItem = _self.items[0].height;
            } else if (window.innerHeight < _self.highestItem) {
                _self.highestItem = window.innerHeight;
            }

            _self.viewport.style.height = _self.highestItem + 'px';
            _self.slider.style.height = _self.highestItem + 'px';
        }
    };

    /* Gets the hightest item so we can set the size of the gallery wrapper */
    var updateHighestItem = function(_self) {
        updateItemSizes(_self);

        var highest, i;
        _self.highestItem = -1; // reset

        for (i = 0; i < _self.items.length; i++) {
            _self.items[i].height = _self.items[i].element.offsetHeight;
            highest = _self.config.maxHeight ? (_self.items[i].height < _self.highestItem) : (_self.items[i].height > _self.highestItem);

            if (highest) {
                _self.highestItem = _self.items[i].height;
            }
        }

        setGallerySize(_self);
    };

    /* Event handler which is fired when screen resizes */
    var windowResize = function(_self) {

        var viewport = _self.viewport.offsetWidth;

        if (viewport !== _self.width) {
            _self.width = viewport;
            updateHighestItem(_self);

            _self.moveSlideTo(_self.selectedIndex, true);

            if (_self.expanded) {
                updateViewportPosition(_self);
            }
        }

    };

    /* Updates gallery dimensions, slide dimensions & positions, and viewport */
    var repaintGallery = function(_self) {
        _self.viewport.style.marginTop = 0;
        _self.viewport.style.height = '100%';
        _self.slider.style.height = '100%';

        updateHighestItem(_self);

        _self.moveSlideTo(_self.selectedIndex, true);

        if (_self.expanded) {
            updateViewportPosition(_self);
        }
    };

    /* Event handler keyboard pressing */
    var checkKeyDownEvent = function(e) {
        var i, gallery;
        e = e || window.event;

        for (i = 0; i < ui.photoGalleries.length; i++) {
            if (ui.photoGalleries[i].expanded) {
                gallery = ui.photoGalleries[i];
                break;
            }
        }

        if (gallery && gallery.expanded) {
            switch (e.keyCode) {
                case 37: // left arrow
                    if (gallery.selectedIndex > 0) {
                        gallery.moveSlideTo(gallery.selectedIndex - 1);
                    }
                    break;
                case 39: // right arrow
                    gallery.moveSlideTo(gallery.selectedIndex + 1);
                    break;
                case 27: // escape button
                    gallery.toggleGalleryFullscreen();
                    break;
            }

            e.stopPropagation();
        }
    };

    /* Check if an element is visible in the viewport */
    var isGalleryVisible = function() {

        var rect, i,
            html = document.documentElement,
            windowHeight = window.innerHeight || html.clientHeight;

        for (i = 0; i < ui.photoGalleries.length; i++) {
            rect = ui.photoGalleries[i].element.getBoundingClientRect();

            if (rect.top >= 0 && rect.top <= windowHeight ||
                    rect.bottom >= 0 && rect.bottom <= windowHeight) {

                ui.photoGalleries[i].isInViewport = true;

                if (typeof ui.photoGalleries[i].config.isVisibleEvent === 'function') {
                    ui.photoGalleries[i].config.isVisibleEvent();
                }

            } else {
                ui.photoGalleries[i].isInViewport = false;
            }
        }

    };

    /* Updates the viewport height according to the highest item and centers it vertically */
    var updateViewportPosition = function(_self) {
        var clientHeight = window.innerHeight || document.documentElement.clientHeight,
            spacing;

        spacing = (clientHeight - _self.highestItem) / 2;

        _self.viewport.style.marginTop = spacing + 'px';
    };

    /* Switch photo variant when toggling fullscreen */
    var switchPhotoVariants = function(_self, fullscreen) {

        var thumbVariant, fullscreenVariant,
            loadedCallback = function(item) {
                item.imageVariants.fullscreen.image.onload = null;
                item.imageVariants.fullscreen.loaded = true;
                core.style.addClass(item.imageVariants.preview.image, 'u-hide');
                core.style.removeClass(item.imageVariants.fullscreen.image, 'u-hide');

                repaintGallery(_self);
                updateViewportPosition(_self);
            };

        for (var i = 0; i < _self.items.length; i++) {
            if (fullscreen && _self.items[i].imageVariants.fullscreen) {
                if (!_self.items[i].imageVariants.fullscreen.loaded) {
                    // if the fullscreen image has not been loaded yet, do it now and swap images on the loadedCallback
                    _self.items[i].imageVariants.fullscreen.image.onload = loadedCallback.bind(this, _self.items[i]);
                    _self.items[i].imageVariants.fullscreen.image.src = _self.items[i].imageVariants.fullscreen.url;
                } else {
                    core.style.addClass(_self.items[i].imageVariants.preview.image, 'u-hide');
                    core.style.removeClass(_self.items[i].imageVariants.fullscreen.image, 'u-hide');
                }
            } else if (!fullscreen && _self.items[i].imageVariants.fullscreen) {
                core.style.removeClass(_self.items[i].imageVariants.preview.image, 'u-hide');
                core.style.addClass(_self.items[i].imageVariants.fullscreen.image, 'u-hide');
            }
        }
    };



    /* PUBLIC OBJECT */

    /**
    * Constructor for modal object
    *
    * @param {Object.<Config>} [config] Config properties used when consructing a modal
    * @constructor
    */
    ui.swingSloth = function( element, config ){

        if (!element) {
            return;
        }

        var _self = this;

        _self.element = element;
        _self.config = setDefaults( config || {} );

        ui.photoGalleries.push(_self);

        setupGallery( _self );

    };

    /**
    * Move slide to new index
    *
    * @param {Integer} [index] Index of the gallery item to display
    * @param {Boolean} [instantMove] Instantly move slider to new index without animations
    */
    ui.swingSloth.prototype.moveSlideTo = function(index, instantMove) {
        var _self = this;

        _self.selectedIndex = index;

        if (_self.selectedIndex < _self.items.length && _self.selectedIndex >= 0) {

            _self.selectedItem = _self.items[_self.selectedIndex];

            // update controls
            if (_self.selectedIndex === _self.items.length - 1) {
                _self.controls.arrowRight.style.display = 'none';
            } else {
                _self.controls.arrowRight.style.display = 'block';
            }

            if(_self.selectedIndex === 0) {
                _self.controls.arrowLeft.style.display = 'none';
            } else {
                _self.controls.arrowLeft.style.display = 'block';
            }

            // move slides
            _self.sliderPosTarget = -_self.selectedItem.positionX;
            if (instantMove) {
                _self.sliderPos = -_self.selectedItem.positionX;
            }

        } else {
            if (_self.selectedIndex === _self.items.length) {
                _self.selectedIndex = _self.items.length -1;
            } else if (_self.selectedIndex < 0) {
                _self.selectedIndex = 0;
            }
        }
    };

    /**
    * Add a new item to gallery
    *
    * @param {HTML Object} [item] HTML element to add as an item to the gallery
    */
    ui.swingSloth.prototype.addItem = function(item) {
        var _self = this;

        if (!item) {
            return;
        }

        if (!core.object.isArray(item)) {
            _self.slider.appendChild(item);
        } else {
            for (var i = 0; i < item.length; i++) {
                if(item[i]) {
                    _self.slider.appendChild(item[i]);
                }
            }
        }

        reInitiateItems(_self);
        _self.animation.animate(_self);
    };

    /**
    * Remove an item from gallery
    *
    * @param {Integer} [index] Index of item to remove
    */
    ui.swingSloth.prototype.removeItem = function(index) {
        var _self = this;

        if (index >= 0 && index < _self.items.length) {

            _self.slider.removeChild(_self.items[index].element);
            _self.items.splice(index, 1);

        }

        reInitiateItems(_self);
    };

    /**
    * Toggle the gallery fullscreen mode
    */
    ui.swingSloth.prototype.toggleGalleryFullscreen = function() {

        var _self = this;

        switchPhotoVariants(_self, !_self.expanded);

        if (!_self.expanded) {

            _self.expanded = true;

            core.style.addClass(_self.wrapper, 'expanded');
            _self.element.style.height = _self.highestItem;

            repaintGallery(_self);
            updateViewportPosition(_self);

            if (typeof _self.config.onFullscreenOpened === 'function') {
                _self.config.onFullscreenOpened();
            }

        } else {
            _self.viewport.style.marginTop = 0;
            _self.element.style.height = 'auto';
            core.style.removeClass(_self.wrapper, 'expanded');
            _self.expanded = false;
            repaintGallery(_self);

            if (typeof _self.config.onFullscreenClosed === 'function') {
                _self.config.onFullscreenClosed();
            }
        }

    };

    /**
    * Add a custom event listener
    *
    * @param {String} [eventName] Name of the event to add
    * @param {Funcction} [callback] Custom callback function you want to call
    */
    ui.swingSloth.prototype.setEventListener = function(eventName, callback) {
        var _self = this,
            event = _self.config[eventName];

        if (typeof event === 'function') {
            _self.config[eventName] = callback;
        }
    };

    /**
    * Remove a custom event listener
    *
    * @param {String} [eventName] Name of the event to remove
    */
    ui.swingSloth.prototype.removeEventListener = function(eventName) {
        var _self = this,
            event = _self.config[eventName];

        if (typeof event === 'function') {
            _self.config[eventName] = function() {};
        }
    };

    /**
    * Refresh gallery items (sizes, positioning, ...)
    */
    ui.swingSloth.prototype.refresh = function() {
        var _self = this;
        reInitiateItems(_self);
    };








    /* for the dot example */
    ui.Particle = function( elem ){

        if (!elem) {
            return;
        }

        this.element = elem;
        this.positionX = 0;
        this.dragPositionX = 0;
        this.velocityX = 1;
        this.friction = 0.95;
        this.accelerationX = 1;
        this.isDragging = false;

    };

    ui.Particle.prototype.render = function() {
        // position particle with transform
        this.element.style.transform = 'translateX(' + this.positionX + 'px)';
    };

    ui.Particle.prototype.update = function() {
        this.velocityX += this.accelerationX;
        this.velocityX *= this.friction;
        this.positionX += this.velocityX;
        // this.applyDragForce();
        // reset acceleration
        this.accelerationX = 0;
    };

    ui.Particle.prototype.applyForce = function(force) {
        this.accelerationX += force;
    };




}( PULSE.ui, PULSE.core ));

/*globals PULSE, PULSE.ui */

(function( swingSloth ){
    "use strict";

    var Animation = {};

    Animation.lastSliderPos = 0;

    Animation.render = function(_self) {
        // position particle with transform
        var diff = _self.sliderPos - Animation.lastSliderPos;
        if (diff < 0) {
            diff = -diff;
        }
        if (diff > 0.1) {
            _self.slider.style.transform = 'translateX(' + _self.sliderPos + 'px)';
            Animation.lastSliderPos = _self.sliderPos;
        }
    };

    Animation.applyPhysics = function(_self) {
        _self.velocityX += _self.acceleration;
        _self.sliderPos += _self.velocityX;
        _self.velocityX *= _self.friction;
        // _self.applyDragForce();
        // reset acceleration
        _self.acceleration = 0;
    };

    Animation.applyForce = function(force, _self) {
        _self.acceleration += force;
    };

    Animation.animate = function(_self) {
        var attraction = ( _self.sliderPosTarget - _self.sliderPos ) * _self.attractStrength;

        if (!isNaN(attraction)) {
            Animation.applyForce(attraction, _self);
        }
        Animation.applyPhysics(_self);
        Animation.render(_self);
        requestAnimationFrame(function(){ Animation.animate(_self); });
    };

    swingSloth.prototype.animation = Animation;

}( PULSE.ui.swingSloth ));

(function( swingSloth ){
    "use strict";

    var getClientX = function(event) {
        if (event.clientX) {
            return event.clientX;
        }
        if (event.touches && event.touches[0]) {
            return event.touches[0].clientX;
        }
        return 0;
    };

    var Drag = {
        gallery: null
    };

    Drag.initHandlers = function(_self) {

        Drag.gallery = _self;

        if (_self.config.draggable) {
            // dragability for non touch devices
            Drag.gallery.viewport.addEventListener('dragstart', Drag.onDragStart, false);
            Drag.gallery.viewport.addEventListener('drag', Drag.onDrag, false);
            Drag.gallery.viewport.addEventListener('dragend', Drag.onDragEnd, false);
        }

        Drag.gallery.viewport.addEventListener('touchstart', Drag.onDragStart, false);
        Drag.gallery.viewport.addEventListener('touchmove', Drag.onDrag, false);
        Drag.gallery.viewport.addEventListener('touchend', Drag.onDragEnd, false);

    };

    Drag.onDragStart = function(event, pointer) {

        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        var _self = Drag.gallery;

        _self.hasBeenDragged = false;

        _self.dragStartPosition = getClientX(event);
        _self.dragLastPosition = getClientX(event);
    };

    Drag.onDrag = function(event, pointer, moveVector) {

        event.preventDefault();

        var _self = Drag.gallery,
            clientX = getClientX(event);

        if (clientX === _self.dragLastPosition) {
            return;
        }

        var moved = clientX - _self.dragLastPosition;

        if (moved < 150 && moved > -150) {
            _self.sliderPosTarget += moved;
        }

        if (clientX !== 0) {
            _self.dragLastPosition = clientX;
        }

        _self.hasBeenDragged = true;

    };

    Drag.onDragEnd = function(event, pointer) {

        var _self = Drag.gallery,
            snapToItem, dir = 1;

        event.preventDefault();

        // get drag direction
        if (_self.dragStartPosition > _self.dragLastPosition) {
            dir = -1;
        } else if (_self.dragStartPosition === self.dragLastPosition) {
            dir = 0;
        }

        if (dir !== 0) {
            snapToItem = Drag.getNextSnappingPoint(dir);
            _self.moveSlideTo(snapToItem);
        }

    };

    Drag.getPointer = function( pointer ) {
        return {
            x: pointer.pageX !== undefined ? pointer.pageX : pointer.clientX,
            y: pointer.pageY !== undefined ? pointer.pageY : pointer.clientY
        };
    };

    /* Gets the index of the next nearest snapping point of an item  */
    Drag.getNextSnappingPoint = function(dir) {
        var _self = Drag.gallery,
            pos = -_self.sliderPosTarget,
            nearest = 99999, i,
            nearestItem, diff;

        dir = dir || 1;

        for (i = 0; i < _self.items.length; i++) {
            diff = pos - _self.items[i].positionX - (dir * (_self.items[i].width / 2.25));
            if (diff < 0) {
                diff = -diff;
            }

            if (diff < nearest) {
                nearest = diff;
                nearestItem = i;
            }
        }

        return nearestItem;

    };

    swingSloth.prototype.dragging = Drag;

}( PULSE.ui.swingSloth ));

(function( swingSloth, core ){
    "use strict";

    var Item = function(element, parent, callback) {
        var _self = this;

        _self.element = element;
        _self.parent = parent;

        _self.create(callback);
    };

    var resetVariants = function(img) {
        var fs = img.nextElementSibling;
        if (fs && core.style.hasClass('js-item-fullscreen')) {
            fs.remove();
        }
    };

    var createImageVariants = function(_self) {

        var fullscreenImg;

        resetVariants(_self);

        _self.imageVariants = {
            preview: {}, fullscreen: {}, current: {}
        };

        _self.imageVariants.preview.imageContainer = _self.element.querySelector(_self.parent.config.imageSelector);
        _self.imageVariants.preview.image = _self.imageVariants.preview.imageContainer.querySelector('img');
        core.style.addClass(_self.imageVariants.preview.image, 'js-item-preview');

        _self.imageVariants.current = _self.imageVariants.preview;

        if (_self.imageVariants.preview.imageContainer.dataset.fullscreen) {
            fullscreenImg = document.createElement('img');
            if (_self.imageVariants.preview.image.classList && _self.imageVariants.preview.image.classList.length) {
                fullscreenImg.className = _self.imageVariants.preview.image.classList.toString();
            }
            core.style.addClass(fullscreenImg, 'js-item-fullscreen');
            core.style.addClass(fullscreenImg, 'u-hide');

            _self.imageVariants.fullscreen.imageContainer = _self.imageVariants.preview.imageContainer;
            _self.imageVariants.fullscreen.image = fullscreenImg;
            _self.imageVariants.fullscreen.url = _self.imageVariants.preview.imageContainer.dataset.fullscreen;
            _self.imageVariants.fullscreen.loaded = false;

            _self.imageVariants.preview.imageContainer.appendChild(_self.imageVariants.fullscreen.image);
        } else {
            _self.imageVariants.fullscreen = null;
        }
    };

    Item.prototype.create = function(callback) {
        var _self = this;

        if (!_self.parent.config.singlePhotoViewer) {
            _self.element.style.position = 'absolute';
        }
        _self.element.style.width = '100%';

        createImageVariants(_self);

        _self.positionX = 0;
        _self.target = 0;
        _self.width = _self.imageVariants.current.image.offsetWidth;
        _self.height = _self.imageVariants.current.image.offsetHeight;

        if (_self.height <= 20) {
            _self.imageVariants.current.image.onload = function(e) {
                callback(_self.parent, _self);
            };
        } else {
            callback(_self.parent, _self);
        }
    };

    Item.prototype.setPosition = function( x ) {
        var _self = this;
        _self.positionX = x;
    };

    swingSloth.prototype.Item = Item;

}( PULSE.ui.swingSloth, PULSE.core ));

(function( swingSloth, core ){
    "use strict";

    var Thumbnails = function(gallery, config) {

        var _self = this,
            clickEventFunction, i, thumbList;

        _self.gallery = gallery;
        _self.config = config;

        if (_self.config.thumbnails) {
            _self.items = document.querySelectorAll(_self.config.thumbnails);

            if (_self.items.length) {
                _self.previousActiveThumb = _self.items[0];

                clickEventFunction = function(index) {
                    _self.items[index].addEventListener('click', function(e) { onThumbClick(_self, index, e.target); });
                };

                for (i = 0; i < _self.items.length; i++) {
                    clickEventFunction(i);
                }

                if (_self.config.controls && _self.config.list) {
                    _self.thumbList = document.querySelector(_self.config.list);

                    document.querySelector(_self.config.controls.left).addEventListener('click', function(e) { galleryNavigationClick(_self, -1); });
                    document.querySelector(_self.config.controls.right).addEventListener('click', function(e) { galleryNavigationClick(_self, 1); });
                }
            }
        }

    };

    var onThumbClick = function(_self, index, thumb) {
        _self.gallery.moveSlideTo(index);

        if (_self.previousActiveThumb && _self.previousActiveThumb !== thumb) {
            core.style.removeClass(_self.previousActiveThumb, 'is-active');
        }

        core.style.addClass(thumb, 'is-active');
        _self.previousActiveThumb = thumb;

        var width = _self.thumbList.offsetWidth;
        _self.thumbList.scrollLeft = thumb.offsetLeft - (width / 2);
    };

    var galleryNavigationClick = function(_self, dir) {
        var width = _self.thumbList.offsetWidth;
        _self.thumbList.scrollLeft += dir * width;
    };

    swingSloth.prototype.Thumbnails = Thumbnails;

}( PULSE.ui.swingSloth, PULSE.core ));

( function() {

    "use strict";

    /**
     * PULSE is the window level object to hold all Pulse JavaScript
     * PULSE.cricket should only be extended within the pulse cricket JS repo
     * @namespace PULSE
     * @type {Object}
     *//* istanbul ignore next */
    if( !window.PULSE ) {
        window.PULSE = {};
    }

    /**
     * Cricket is the package name inside of Pulse
     * @namespace cricket
     * @type {Object}
     */
    PULSE.cricket = {};

    /**
     * Unified DataStore data package
     * namespace cricket.UDS
     * typedef {Object}
     */
    PULSE.cricket.UDS = {};

    /**
     * Types of formats and the stats/match types that go under them
     * @constant
     * @memberOf cricket
     * @type {Object}
     */
    PULSE.cricket.MATCH_TYPES = {
        LIMITED: [ "T20", "T20I", "ODI", "CLT20", "IPLT20", "CWC", "LIST_A" ],
        UNLIMITED: [ "TEST", "FIRST_CLASS" ]
    };

    /**
     * Can be thrown if a function that should have been implemented hasn't been and is called
     * @extends {Error}
     * @param  {String} message - Custom message to be thrown with the name
     *//* istanbul ignore next */
    PULSE.unimplementedFunctionError = function( message ) {
        this.name = "Unimplemented Abstract Function Error";
        this.message = message || "";
    };
    PULSE.unimplementedFunctionError.prototype = Object.create( Error.prototype );
    PULSE.unimplementedFunctionError.prototype.constructor = window.PULSE.unimplementedFunctionError;
}() );

( function( cricket, core ) {

    "use strict";

    /**
     * Class for filtering match lists
     * @class MatchListFilter
     */
    cricket.MatchListFilter = function() {

        var _self = this;

        /**
         * Function that takes an array and a filter set and applies a function to filter
         * @param  {Match}                 match           - The match
         * @param  {Array.<Number|String>} filterArray     - The filter array
         * @param  {Function}              filterFunction  - The filter function
         * @return {boolean}                               - Whether the match matches the filter
         */
        this.applyFilter = function( match, filterArray, filterFunction ) {

            if( !filterArray || filterArray.length === 0 ) {
                return true;
            }

            for ( var j = 0, jLimit = filterArray.length; j < jLimit; j++ ) {
                if( filterFunction.apply( match, [ filterArray[ j ] ] ) ) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Determines if it matches team filter. If no team rules are set, returns True
         *
         * @param  {Match}         match    The match
         * @param  {Array<Number>} teamIds  The team identifiers
         * @return {Boolean}                True if matches team filter, False otherwise.
         */
        this.matchesTeamFilter = function( match, teamIds ) {
            var _self = this;
            if( teamIds && teamIds.length ) {
                return _self.applyFilter( match, teamIds, match.hasTeamWithId );
            }
            return true;
        };

        /**
         * Determines if it matches venue filter. If no venue rules are set, returns True
         *
         * @param  {Match}         match     The match
         * @param  {Array<Number>} venueIds  The venue identifiers
         * @return {Boolean}                 True if matches venue filter, False otherwise.
         */
        this.matchesVenueFilter = function( match, venueIds ) {
            var _self = this;
            if( venueIds && venueIds.length ) {
                return _self.applyFilter( match, venueIds, match.hasVenueWithId );
            }
            return true;
        };

        /**
         * Determines if it matches group name filter. If no group name rules are set, returns True
         *
         * @param  {Match}         match       The match
         * @param  {Array<String>} groupNames  The group names
         * @return {Boolean}                   True if matches group name filter, False otherwise.
         */
        this.matchesGroupNameFilter = function( match, groupNames ) {
            var _self = this;
            if( groupNames && groupNames.length ) {
                return _self.applyFilter( match, groupNames, match.hasGroupWithName );
            }
            return true;
        };

        /**
         * Determines if it matches state filter. If no match state rules are set, returns True
         *
         * @param  {Match}          match        The match
         * @param  {Array<String>}  matchStates  The match states
         * @return {Boolean}                     True if matches state filter, False otherwise.
         */
        this.matchesStateFilter = function( match, matchStates ) {
            if( matchStates && matchStates.length ) {
                return -1 < matchStates.indexOf( match.getMatchState() );
            }
            return true;
        };

        /**
         * Determines if the match date is within a given range. If no range, returns True
         *
         * @param  {Match}   match      The match
         * @param  {Date}    startDate  The start date
         * @param  {Date}    endDate    The end date
         * @return {Boolean}            True if matches date range filter, False otherwise.
         */
        this.matchesDateRangeFilter = function( match, startDate, endDate ) {
            var matchDate = match.getDate();
            if( matchDate ) {
                if( startDate && endDate ) {
                    return matchDate.getTime() >= startDate.getTime() &&
                        matchDate.getTime() <= endDate.getTime();
                }
                else if( startDate ) {
                    return matchDate.getTime() >= startDate.getTime();
                }
                else if( endDate ) {
                    return matchDate.getTime() <= endDate.getTime();
                }
            }
            return true;
        };

        /**
         * Determines if the match belongs to a tournament that's within a list of tournaments
         *
         * @param  {Match}         match         - The match
         * @param  {Array<Number>} tournamentIds - The array of tournament identifiers
         * @return {Boolean}                     - True if it matches, False otherwise
         */
        this.matchesTournamentFilter = function( match, tournamentIds ) {
            if( tournamentIds && tournamentIds.length ) {
                var tournament = match.getTournament();
                for( var i = 0, iLimit = tournamentIds.length; i < iLimit; i++ ) {
                    var tournamentId = tournamentIds[ i ];
                    if( tournamentId == tournament.id ) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        };

        /**
         * Get an array of cricket.Match instances, optionally filtered
         * @param  {FilterOptions} options - optional filter options
         * @return {Array<Match>}          - Matches array
         */
        this.filterArray = function( matches, options ) {

            var _self = this;

            if( matches.length > 0 && options ) {

                var filteredMatches = [];

                options = typeof options !== 'undefined' ? options : {};

                var limit = options.limit;
                var filters = core.object.extend( true, {}, options.filters );

                filters.matchStates = filters.matchStates || [];
                filters.teamIds = filters.teamIds || [];
                filters.venueIds = filters.venueIds || [];
                filters.groupNames = filters.groupNames || [];
                filters.tournamentIds = filters.tournamentIds || [];
                if( filters.startDate && typeof filters.startDate === "string" ) {
                    filters.startDate = filters.startDate ?
                        cricket.utils.dateFromString( filters.startDate ) : undefined;
                }
                if( filters.endDate && typeof filters.endDate === "string" ) {
                    filters.endDate = filters.endDate ?
                        cricket.utils.dateFromString( filters.endDate ) : undefined;
                }

                var reverse = filters.order === 'desc';

                matches = cricket.utils.sortMatches( matches, reverse );

                var hasFilters = options.filters && Object.keys( options.filters ).length > 0;

                if( hasFilters ) {

                    var i = 0, match = matches[ i ];
                    while ( ( !limit || filteredMatches.length < limit ) && match ) {

                        if( _self.matchesStateFilter( match, filters.matchStates ) &&
                            _self.matchesTeamFilter( match, filters.teamIds ) &&
                            _self.matchesVenueFilter( match, filters.venueIds ) &&
                            _self.matchesGroupNameFilter( match, filters.groupNames ) &&
                            _self.matchesTournamentFilter( match, filters.tournamentIds ) &&
                            _self.matchesDateRangeFilter( match, filters.startDate, filters.endDate ) ) {

                            filteredMatches.push( match );
                        }
                        match = matches[ ++i ];
                    }
                    return filteredMatches;
                } else {
                    return matches.slice( 0, limit ? Math.min( limit, matches.length ) : matches.length );
                }
            }

            return matches;
        };
    };

}( PULSE.cricket, PULSE.core ) );

( function( cricket ) {

    "use strict";

    cricket.UrlFactory = function() {
        /**
         * @abstact
         *//* istanbul ignore next */
        this.getMatchScoringUrl = function( matchId, tournamentId, env, protocol  ) {
            throw new PULSE.unimplementedFunctionError( "UrlFactory#getMatchScoringUrl" );
        };
        /**
         * @abstact
         *//* istanbul ignore next */
        this.getMatchScheduleUrl = function( tournamentId, env, protocol ) {
            throw new PULSE.unimplementedFunctionError( "UrlFactory#getMatchScheduleUrl" );
        };
        /**
         * @abstact
         *//* istanbul ignore next */
        this.getGroupStandingsUrl = function( tournamentId, env, protocol ) {
            throw new PULSE.unimplementedFunctionError( "UrlFactory#getGroupStandingsUrl" );
        };
        /**
         * @abstact
         *//* istanbul ignore next */
        this.getSquadsUrl = function( tournamentId, env, protocol ) {
            throw new PULSE.unimplementedFunctionError( "UrlFactory#getGroupStandingsUrl" );
        };
        /**
         * @abstact
         *//* istanbul ignore next */
        this.getMatchListUrl = function( params, env, protocol ) {
            throw new PULSE.unimplementedFunctionError( "UrlFactory#getMatchListUrl" );
        };
        /**
         * @abstact
         *//* istanbul ignore next */
        this.getMatchListMetaUrl = function( params, env, protocol ) {
            throw new PULSE.unimplementedFunctionError( "UrlFactory#getMatchListMetaUrl" );
        };
    };

}( PULSE.cricket ) );

( function( cricket ) {

    "use strict";

    /**
     * Configuration for the whole of the cricket module; please extend this to override
     * @type {CricketConfig}
     */
    cricket.config = {
        flipScores: false, // use 'true' for Australia, for example
        scoreDelimiter: '/'
    };

} ( PULSE.cricket ) );

( function( cricket, core ) {

    "use strict";

    /**
     * Data store for cricket objects.
     * Creates instances of matches, tournaments etc. and stores them for quick lookup.
     * Use when creating a tournament or match instance
     * @class Store
     * @static
     */
    cricket.Store = ( function() {

        var instance;

        /**
         * @constructor
         */
        var Store = function() {

            /**
             * Mapping between (Number) tournament ID and {@link Tournament} instance
             * @memberof Store
             * @type {Object}
             * @instance
             */
            var tournaments = {};

            /**
             * Mapping between (Number) match ID and {@link Match} instance
             * @memberof Store
             * @type {Object}
             * @instance
             */
            var matches = {};

            var _self = this;

            /**
             * Determines if it has a tournament based on its ID
             * @memberof Store
             *
             * @param  {(Number|TournamentId)} tournamentId - The tournament identifier
             * @return {Boolean}                            - True if has the tournament, False otherwise
             */
            this.hasTournament = function( tournamentId ) {
                var id;
                if( tournamentId ) {
                    if( tournamentId instanceof cricket.TournamentId ) {
                        id = tournamentId.getId();
                    }
                    else if( tournamentId > 0 ) {
                        id = tournamentId;
                    }
                    return typeof tournaments[ id ] !== 'undefined';
                }
                return false;
            };

            /**
             * Determines if it has a match based on its ID
             * @memberof Store
             *
             * @param  {(Number|MatchId)} matchId - The match identifier
             * @return {Boolean}                  - True if has the match, False otherwise
             */
            this.hasMatch = function( matchId ) {
                var id;
                if( matchId ) {
                    if( matchId instanceof cricket.MatchId ) {
                        id = matchId.getId();
                    }
                    else if( matchId > 0 ) {
                        id = matchId;
                    }
                    return typeof matches[ id ] !== 'undefined';
                }
                return false;
            };

            /**
             * Based on a tournament ID, returns the tournament for it (if it exists in store) or
             * creates a new instance of a {@link Tournament}
             * @memberof Store
             *
             * @param  {(Number|TournamentId)} tournamentId - The tournament identifier
             * @return {Tournament}                         - The tournament
             */
            this.getTournament = function( tournamentId ) {
                var id;
                if( tournamentId && tournamentId instanceof cricket.TournamentId ) {
                    id = tournamentId.getId();
                }
                else if( tournamentId && tournamentId > 0 ) {
                    id = tournamentId;
                }
                else {
                    return;
                }

                if( !tournaments[ id ] ) {
                    tournaments[ id ] = new cricket.Tournament( tournamentId );
                }

                return tournaments[ id ];
            };

            /**
             * Based on a match ID, returns the match for it (if it exists in store) or
             * creates a new instance of a {@link Match}
             * @memberof Store
             *
             * @param  {(Number|MatchId)}      matchId      - The match identifier
             * @param  {(Number|TournamentId)} tournamentId - The tournament identifier
             * @return {Match}                              - The match
             */
            this.getMatch = function( matchId, tournamentId ) {
                var id;
                if( matchId ) {
                    if( matchId instanceof cricket.MatchId ) {
                        id = matchId.getId();
                    }
                    else if( matchId > 0 ) {
                        id = matchId;
                    }
                    else {
                        return;
                    }

                    if( !matches[ id ] && tournamentId ) {
                        var tournament = _self.getTournament( tournamentId );
                        matches[ id ] = new cricket.Match( matchId, tournament );
                    }

                    return matches[ id ];
                }
            };

            /**
             * Empties maps to objects
             * @memberof Store
             */
            this.clearStorage = function() {
                tournaments = {};
                matches = {};
            };
        };

        return {
            getInstance: function() {
                if( !instance ) {
                    instance = new Store();
                }
                return instance;
            }
        };
    } () );

} ( PULSE.cricket, PULSE.core ) );

( function( core, cricket ) {

    "use strict";

    cricket.utils = {};

    /**
     * Get the age of the player
     * @return {Number}  Age; will return -1 for players that don't have a DOB set
     */
    cricket.utils.getAge = function( dateOfBirth ) {

        if ( typeof dateOfBirth !== 'undefined' ) {
            var todayDate = new Date();
            var birthDate = new Date( dateOfBirth );

            if( !isNaN( birthDate.getTime() ) ) {
                var years = todayDate.getFullYear() - birthDate.getFullYear();

                if ( todayDate.getMonth() < birthDate.getMonth() ||
                    todayDate.getMonth() == birthDate.getMonth() &&
                    todayDate.getDate() < birthDate.getDate() ) {
                    years--;
                }

                return years;
            }
        }
        return -1;
    };

    /**
     * Returns an object with two properties: firstName and secondName
     * @param  {String}  fullName  The full name of the player
     * @return {Object}  The player names.
     */
    cricket.utils.getPlayerNames = function( fullName ) {
        var names       = fullName.split( ' ' ),
            firstName   = names[0],
            secondName  = names.slice( 1 ).join( ' ' );

        return {
            firstName: firstName,
            secondName: secondName
        };
    };

    cricket.utils.getInningsScore = function( runs, wickets, allOut, declared, flip, delimiter ) {

        var score = "0/0";
        if( wickets !== undefined || runs !== undefined ) {
            if( cricket.config.flipScores || flip ) {
                score = ( !allOut ? ( wickets || 0 ) + ( delimiter || '/' ) : "" ) +
                    ( runs || 0 ) + ( declared ? 'd' : '' );
            }
            else {
                score = ( runs || 0 ) + ( !allOut ? ( delimiter || '/' ) +
                    ( wickets || 0 ) : '' ) + ( declared ? 'd' : '' );
            }
        }
        return score;
    };

    /**
     * Gets the team's raw innings data from the scoring file
     * @param  {Number}        teamIndex    - The team index
     * @param  {Array<Number>} battingOrder - The batting order (team indexes, in order)
     * @param  {Number}        cii          - The current innings index
     * @param  {Array<Object>} allInnings   - Array of innings, as formatted in a scoring file
     * @return {Array}                      - The team innings
     */
    cricket.utils.getInningsByTeamIndex = function( teamIndex, battingOrder, cii, allInnings ) {

        var innings = [];
        if( battingOrder && allInnings && allInnings.length ) {
            for( var i = 0; i < allInnings.length; i++ ) {
                var inns = allInnings[ i ],
                    battingIdx = battingOrder[ i ];

                if( inns.scorecard && battingIdx === teamIndex ) {
                    innings.push( inns );
                }
            }
        }

        return innings;
    };

    /**
     * Given a number of counting balls faced, returns the string equivalent of the over notation
     * E.g., 7 balls would be "1.1" (one over and one ball)
     * @param  {Number}  ballsFaced  - The balls faced
     * @return {String}              - The over notation for the balls faced
     */
    cricket.utils.convertBallsToOvers = function( ballsFaced ) {
        var oversFraction = "0";
        if( ballsFaced ) {
            var completeOvers   = Math.floor( ballsFaced / 6 ),
                incompleteOver  = ballsFaced % 6;

            oversFraction = completeOvers + ( incompleteOver !== 0 ? '.' + incompleteOver : '' );
        }
        return oversFraction;
    };

    /**
     * Gets the over progress from a number of counting balls faced and an optional maximum. If no
     * maximum is set (for unlimited overs matches), it will just return the over conversion
     * @param  {Number}  ballsFaced  - The balls faced
     * @param  {Number}  maxBalls    - (Optional) The maximum balls
     * @return {String}              - The over progress
     */
    cricket.utils.getOverProgress = function( ballsFaced, maxBalls ) {
        var overProgress = cricket.utils.convertBallsToOvers( ballsFaced );
        if( maxBalls ) {
            overProgress += '/' + cricket.utils.convertBallsToOvers( maxBalls );
        }
        return overProgress;
    };

    /**
     * Gets the run rate from number of runs and balls faced
     * @param  {Number}  runs        - The runs
     * @param  {Number}  ballsFaced  - The balls faced
     * @return {String}              - The run rate, with 2 fixed decimal places
     */
    cricket.utils.getRunRate = function( runs, ballsFaced ) {
        if( typeof ballsFaced != 'undefined' ) {
            return ( Math.floor( ( ( runs || 0 ) * 6 / ballsFaced ) * 100 ) / 100 ).toFixed( 2 );
        }
        return "";
    };

    /**
     * Given a type of tiebreaker, return a user-friendly label
     * @param  {String} type - Tie breaker type
     * @return {String}      - User-friendly tie breaker name
     */
    cricket.utils.getTieBreakerLabel = function( type ) {
        if( typeof type !== 'undefined' ) {
            switch ( type ) {
            case 'SUPER_OVER':
                return 'Super Over';
            default:
                return 'Tie Breaker';
            }
        }
        return '';
    };

    /**
     * Given an array of matches, sorts them asc or descending, by their match dates
     * @param  {Array.<Match>}  matches - The matches
     * @param  {Boolean}        reverse - Whether to sort descending or not (asc by default)
     * @return {Array.<Match>}          - The sorted matches
     */
    cricket.utils.sortMatches = function( matches, reverse ) {
        // sort them according to given rules
        return matches.sort( function( m1, m2 ) {
            if( reverse ) {
                return m2.date - m1.date;
            } else {
                return m1.date - m2.date;
            }
        } );
    };

    /**
     * Produces a date object (or undefined) if given a valid ISO date string
     * @param  {String} dateString - ISO date string
     * @return {Date}              - date object or undefined, if string invalid
     */
    cricket.utils.dateFromString = function( dateString ) {
        if( dateString ){

            var date;

            if ( typeof dateString !== 'string' ){
                dateString = dateString.toISOString();
            }

            var dateTime = dateString.split('T');
            if ( dateTime.length === 1 ) {
                return new Date( dateTime[0].replace( /\-/g, '/' ) );
            }
            else if ( dateTime.length === 2 ) {
                // we only want to replace the hyphens of date bit (there might be hypens(minus) as in GMT-0200)
                var aDate1 = dateTime[0].replace( /\-/g, '/' );
                var aDate2 = dateTime[1];
                var newDate = aDate1 + ' ' + aDate2;

                date = new Date( newDate );
            }

            if( date && date.getTime() && !isNaN( date.getTime() ) ) {
                return date;
            }
            else {
                date = new Date( dateString );
                if( date && date.getTime() && !isNaN( date.getTime() ) ) {
                    return date;
                }
            }

            return date;

        }
    };

    /**
     * Gets the timezone offset from GMT, in hours
     * @param  {String} matchDateString  - The match date string
     * @return {Number}                  - The timezone offset, in hours (decimal for half hours)
     */
    cricket.utils.getTimezoneOffset = function( matchDateString ) {
        var regex = new RegExp( /((\+|-)[0-9][0-9]):?([0-9][0-9])/ );
        var timezoneMatch = matchDateString.match( regex );
        if( timezoneMatch && timezoneMatch.length ) {
            var hours = parseInt( timezoneMatch[ 1 ], 10 );
            var mins = parseInt( timezoneMatch[ 3 ], 10 );
            return hours + ( hours < 0 ? -1 : 1 ) * ( mins / 60 );
        }
    };

    /**
     * Determines whether a ball string is a wicket (ball string taken from match scoring over history)
     * @param  {String}  ballString - The ball string
     * @return {Boolean} - True, if it's a wicket, false otherwise
     */
    cricket.utils.ballIsWicket = function( ballString ) {
        var matching = ballString.match(/W(?!d)/);
        return matching && matching.length;
    };

    /**
     * Returns true if the given string is null-like.
     * @param {String} string - the string to check if it's nullish
     * return {Boolean} - true if the value given is nullish, false otherwise
     */
    cricket.utils.isNullish = function ( string ) {
        return string === undefined || string === null || string === 'null' || string.length === 0;
    };

    /**
     * Given an array of { "team": {Team}, "players": {Array<PlayerData>} }, creates a map of player ID to player object
     * @param {Array<Object>} - array of wrappers containing a {cricket.Team} and an array of player data
     * @return {Object} - map of player ID to {cricket.Player}
     */
    cricket.utils.createPlayerLookup = function( teams ) {
        var playerLookup = {};
        for ( var i = 0, ilimit = teams.length; i < ilimit; i++ ) {
            var team = teams[ i ];
            if( team ) {
                var players = team.players;
                if( players ) {
                    for ( var j = 0, jlimit = players.length; j < jlimit; j++ ) {
                        var player = new cricket.Player( players[j] );
                        player.setTeam = team.team;
                        playerLookup[ player.id ] = player;
                    }
                }
            }
        }
        return playerLookup;
    };

    /**
     * Base64Decoder - Adapted by Lee Hollingdale from http://www.webtoolkit.info/
     */
    cricket.utils.base64Decoder = {
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            return output;
        }
    };

}( PULSE.core, PULSE.cricket ) );

(function( cricket ){
    "use strict";
    /**
     * Match ID structure corresponding to TIPSY3 spec
     * @constructor
     * @param {Number} id   - DMS ID of the Match
     * @param {String} name - operationally set (non-user-facing) name for the match (e.g., ipl2015-01)
     */
    cricket.MatchId = function( id, name ){

        this.getId = function(){
            return id;
        };
        this.getName = function(){
            return name;
        };
    };
}( PULSE.cricket ));

(function( cricket ){
    "use strict";
    /**
     * Tournament ID structure corresponding to TIPSY3 spec
     * @constructor
     * @param {Number} id   - DMS ID of the tournament
     * @param {String} name - operationally set (non-user-facing) name for the tournament, e.g. ipl2016
     */
    cricket.TournamentId = function( id, name ){

        this.getId = function(){
            return id;
        };
        this.getName = function(){
            return name;
        };
    };
}( PULSE.cricket ));

( function( cricket ) {

    "use strict";

    /**
     * Metaschedule configuration
     * @constructor
     * @param {String}           metascheduleName  - The metaschedule name
     * @param {MatchListFilter}  matchListFilter   - The filter
     * @param {Boolean}          teamAndTeam       - Whether the API should do an AND query on teams (defaults to OR)
     * @param {String}           jsonpCallback     - optional JSONP callback
     */
    cricket.APIFilter = function( matchListFilter, jsonpCallback ) {

        /**
         * Utilty function used to determine whether an array exists and is not empty
         * @param  {Array}   array - The array
         * @return {Boolean}       - True if not empty, False otherwise.
         */
        var isNotEmpty = function( array ) {
            return array && array.length > 0;
        };

        /**
         * Produces a date string form a date in the required metaschedule format of yyyy-mm-dd
         * @param  {Date}   date - The date
         * @return {string}      - The date string
         */
        var getDateString = function( date ) {

            if( date && !isNaN( date.getTime() ) ) {

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                return year.toString() + '-' +
                    ( month < 10 ? '0' : '' ) + month.toString() + '-' +
                    ( day < 10 ? '0' : '' ) + day.toString();
            }
            return undefined;
        };

        /**
         * Metaschedule filter parameters definition, in accordance to the MSAPI
         * @type {Object}
         */
        var filter = {
            'tournamentGroupIds' : isNotEmpty( matchListFilter.tournamentGroupIds ) ? matchListFilter.tournamentGroupIds : [], // metaschedule name
            'matchTypes'         : isNotEmpty( matchListFilter.matchTypes ) ? matchListFilter.matchTypes : [],   // match types ids
            'teamIds'            : isNotEmpty( matchListFilter.teamIds ) ? matchListFilter.teamIds : [],         // team ids
            'tournamentIds'      : isNotEmpty( matchListFilter.tournamentIds ) ? matchListFilter.tournamentIds : [], // tournaqment ids
            'tournamentTypes'    : isNotEmpty( matchListFilter.tournamentTypes ) ? matchListFilter.tournamentTypes : [], // tournament types
            'venueIds'           : isNotEmpty( matchListFilter.venueIds ) ? matchListFilter.venueIds : [],       // venue ids
            'teamTypes'          : isNotEmpty( matchListFilter.teamTypes ) ? matchListFilter.teamTypes : [],     // team types
            'matchStates'        : isNotEmpty( matchListFilter.matchStates ) ? matchListFilter.matchStates : [], // match states
            'startDate'          : getDateString( matchListFilter.startDate ), // start date
            'endDate'            : getDateString( matchListFilter.endDate ),   // end date
            'page'               : matchListFilter.page >= 0 ? matchListFilter.page : undefined, // page number (0-based)
            'pageSize'           : matchListFilter.pageSize > 0 ? matchListFilter.pageSize : undefined, // page size
            'entryPerDay'        : matchListFilter.entryPerDay === true ? true : undefined,
            'sortByEndDate'      : matchListFilter.sortByEndDate === true ? true : undefined,
            'sort'               : matchListFilter.order ? matchListFilter.order === 'desc' ? 'desc' : 'asc' : undefined, // order of responses
            'callback'           : jsonpCallback || undefined
        };

        /**
         * Function that resets the values of the filter back to their defaults
         * Please note: it will NOT reset the name of the metaschedule
         */
        this.resetFilter = function() {
            filter.tournamentGroupIds = [];
            filter.matchTypes = [];
            filter.teamIds = [];
            filter.tournamentIds = [];
            filter.tournamentTypes = [];
            filter.venueIds = [];
            filter.teamTypes = [];
            filter.matchStates = [];
            filter.startDate = undefined;
            filter.endDate = undefined;
            filter.page = undefined;
            filter.pageSize = undefined;
            filter.order = undefined;
            filter.callback = undefined;
        };

        /**
         * Get the MSAPI-ready filter
         * @return {Object} - The filter.
         */
        this.getFilter = function() {
            return filter;
        };
    };

}( PULSE.cricket ) );

( function( cricket ) {

    "use strict";

    /**
     * Metaschedule configuration
     * @constructor
     * @param {String}           metascheduleName  - The metaschedule name
     * @param {MatchListFilter}  matchListFilter   - The filter
     * @param {Boolean}          singleEntry       - Whether to request single entry data or not
     * @param {Boolean}          teamAndTeam       - Whether the API should do an AND query on teams (defaults to OR)
     * @param {String}           jsonpCallback     - optional JSONP callback
     */
    cricket.MetaScheduleConfig = function( metascheduleName, matchListFilter, singleEntry, teamAndTeam, jsonpCallback ) {

        /**
         * Utilty function used to determine whether an array exists and is not empty
         * @param  {Array}   array - The array
         * @return {Boolean}       - True if not empty, False otherwise.
         */
        var isNotEmpty = function( array ) {
            return array && array.length > 0;
        };

        /**
         * Produces a date string form a date in the required metaschedule format of yyyy-mm-dd
         * @param  {Date}   date - The date
         * @return {string}      - The date string
         */
        var getDateString = function( date ) {

            if( date && !isNaN( date.getTime() ) ) {

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                return year.toString() + '-' +
                    ( month < 10 ? '0' : '' ) + month.toString() + '-' +
                    ( day < 10 ? '0' : '' ) + day.toString();
            }
            return undefined;
        };

        var MATCH_TYPE = {
            'TEST': 0,
            'FIRST_CLASS': 7,
            'NO_STATS': 10,
            'ODI': 1,
            'T20I': 2,
            'LIST_A': 6,
            'T20': 5,
            'OTHER': 8
        };

        var matchTypes = isNotEmpty( matchListFilter.matchTypes ) ? matchListFilter.matchTypes : [];

        /**
         * Metaschedule filter parameters definition, in accordance to the MSAPI
         * @type {Object}
         */
        var filter = {
            'ms' : metascheduleName,                                             // metaschedule name
            'mt' : matchTypes.map( function( type ) { return MATCH_TYPE[ type ] } ),   // match types ids
            'te' : isNotEmpty( matchListFilter.teamIds ) ? matchListFilter.teamIds : [],                   // team ids
            'to' : isNotEmpty( matchListFilter.tournamentIds ) ? matchListFilter.tournamentIds : [],             // tournaqment ids
            'vr' : isNotEmpty( matchListFilter.regionIds ) ? matchListFilter.regionIds : [],     // region ids
            'vc' : isNotEmpty( matchListFilter.countryIds ) ? matchListFilter.countryIds : [],   // country ids
            'v'  : isNotEmpty( matchListFilter.venueIds ) ? matchListFilter.venueIds : [],       // venue ids
            'tt' : isNotEmpty( matchListFilter.teamTypes ) ? matchListFilter.teamTypes : [],     // team types
            's'  : isNotEmpty( matchListFilter.matchStates ) ? matchListFilter.matchStates : [], // match states
            'sd' : getDateString( matchListFilter.startDate ),                   // start date
            'ed' : getDateString( matchListFilter.endDate ),                     // end date
            'p'  : matchListFilter.pageNumber > 0 ? matchListFilter.pageNumber : undefined,                              // page number (1-based)
            'ps' : matchListFilter.pageSize > 0 ? matchListFilter.pageSize : undefined,                                // page size
            'se' : singleEntry === true ? true : undefined,
            'o'  : matchListFilter.order ? matchListFilter.order === 'desc' ? 'cd' : 'ca' : undefined, // order of responses
            'ta' : teamAndTeam === true ? true : undefined, // whether to do an AND query on teams, not an OR
            'callback': jsonpCallback || undefined
        };

        /**
         * Function that resets the values of the filter back to their defaults
         * Please note: it will NOT reset the name of the metaschedule
         */
        this.resetFilter = function() {
            filter.mt = [];
            filter.te = [];
            filter.to = [];
            filter.vr = [];
            filter.vc = [];
            filter.v = [];
            filter.tt = [];
            filter.s = [];
            filter.sd = undefined;
            filter.ed = undefined;
            filter.p = undefined;
            filter.ps = undefined;
            filter.callback = undefined;
        };

        /**
         * Get the MSAPI-ready filter
         * @return {Object} - The filter.
         */
        this.getFilter = function() {
            return filter;
        };
    };

}( PULSE.cricket ) );

( function( cricket ) {

    'use strict';

    // required for IE

    if( typeof window.CustomEvent !== "function" ) {

        var PolyfilledCustomEvent = function ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        };

        PolyfilledCustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = PolyfilledCustomEvent;
    }

    /**
     * Enum for event types
     * The event type are used to listen for custom cricket events on specific elements
     */
    cricket.eventTypes = {
        SCORING: 'scoring',
        SCHEDULE_ENTRY: 'schedule-entry',
        MATCH_LIST: 'fixtures'
    };

    /**
     * Collection of cricket events
     */
    cricket.events = {
        /**
         * Custom event for scoring publication data
         *
         * @class  ScoringEvent
         * @param  {cricket.Match} match - The match
         * @return {CustomEvent}  - The custom ScoringEvent instance
         */
        ScoringEvent: function( match ) {
            return new CustomEvent( 'scoring', { detail: match } );
        },

        /**
         * Custom event for schedule publication data
         *
         * @class  ScheduleEntryEvent
         * @param  {cricket.Match} match - The match
         * @return {CustomEvent}  - The custom ScheduleEntryEvent instance
         */
        ScheduleEntryEvent: function( match ) {
            return new CustomEvent( 'schedule-entry', { detail: match } );
        },

        /**
         * Custom event for match list publication data
         *
         * @class  MatchListEvent
         * @param  {cricket.Match} match - The match
         * @return {CustomEvent}  - The custom MatchListEvent instance
         */
        MatchListEvent: function( matchList ) {
            return new CustomEvent( 'fixtures', { detail: matchList } );
        }
    };

}( PULSE.cricket ) );

( function( cricket, core ) {

    "use strict";

    cricket.matchDataProcessor = ( function() {

        /**
         * A default innings summary structure, to be used when there's no data for the inns yet
         * @type {InningsSummary}
         */
        var defaultInnings = {
            runs: 0,
            wkts: 0,
            allOut: false,
            declared: false,
            overProgress: undefined,
            runRate: undefined,
            maxOvers: undefined
        };

        /**
         * Processes match data and sets it for a particular match
         * @class Processor
         * @abstract
         * @param {Match}  match - The match
         */
        var Processor = function( match ) {

            this.match = match;
            this.data = undefined;

            /**
             * Sets the data from a specific source
             * @param {Object}  data - The match data
             */
            this.setData = function( data ) {
                var _self = this;

                _self.data = core.object.extend( true, {}, data );
                _self.setBasicInfo();
                _self.setSourceSpecificInfo();
                _self.setRawData();
            };

            /**
             * Gets the summary model of a match
             * @return {MatchSummaryModel}  The summary model.
             */
            this.setBasicInfo = function() {
                var _self = this;

                _self.match.setDescription( _self.getDescription() );
                _self.match.setVenue( _self.getVenue() );
                _self.match.setMatchType( _self.getMatchType() );
                _self.match.setGroupName( _self.getGroupName() );
                if( !_self.match.getDate() ) {
                    _self.match.setDate( _self.getDate() );
                }
                if( !_self.match.getEndDate() ) {
                    _self.match.setEndDate( _self.getEndDate() );
                }
                _self.match.setTimezoneOffset( _self.getTimezoneOffset() );
                _self.match.setMatchStatus( _self.getMatchStatus() );
                _self.match.setMetaData( _self.getMetaData() );

            };

            /**
             * Gets the team with innings score(s)
             * @param  {Number}  index   The index of the team
             * @return {Object}  The team object with score (as Array<InningsSummary>)
             */
            this.getTeamWithScore = function( index ) {
                var _self = this;

                var team = _self.getTeam( index );
                if( team && team.id > 0 ) {
                    team.score = _self.getTeamScoreDetails( index );
                }
                return team;
            };

            /**
             * Gets the timezone offset
             * @return {Number} - The timezone offset, in hours
             */
            this.getTimezoneOffset = function() {
                var _self = this;
                var matchDateString = _self.getDateString();
                if( matchDateString ) {
                    return cricket.utils.getTimezoneOffset( matchDateString );
                }
                return 0;
            };

            /**
             * Retrieves the metadata, if it exists
             * @return {Object}  The metadata.
             */
            this.getMetaData = function() {
                var _self = this;
                if ( _self.data && _self.data.metadata ) {
                    return _self.data.metadata;
                }
                return undefined;
            };


            /**
             * @abstact
             *//* istanbul ignore next */
            this.setRawData = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#setRawData" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.setSourceSpecificInfo = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#setSourceSpecificInfo" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getMatchState = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getMatchState" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getDescription = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getDescription" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getVenue = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getVenue" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getMatchType = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getMatchType" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getGroupName = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getGroupName" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getDate = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getDate" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getEndDate = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getEndDate" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getDateString = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getDateString" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getTeam = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getTeam" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getMatchStatus = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getMatchStatus" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.getTournamentLabel = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#getTournamentLabel" );
            };
            /**
             * @abstact
             *//* istanbul ignore next */
            this.isLimitedOvers = function() {
                throw new PULSE.unimplementedFunctionError( "Processor#isLimitedOvers" );
            };
        };

        /**
         * Processor for match scoring data; inherits from match data Processor
         * @class ScoringProcessor
         * @extends {Processor}
         * @param {Match}  match   The match
         */
        var ScoringProcessor = function( match ) {
            Processor.call( this, match );

            var _self = this;

            /**
             * Saves the raw scoring data in the match object
             */
            this.setRawData = function() {
                _self.match.data.scoring = _self.data;
            };

            /**
             * Set data specific for the scoring source only. This includes:
             *  - teams with scores (will override schedule entry data)
             *  - batting order
             *  - additional match data
             *  - phase & state
             *  - follow on
             *  - full innings data
             *  - tournament label (will override schedule entry data)
             *  - match summary
             *  - playing XIs
             *  - current state (current players, partnership, current innings index, summary etc.)
             */
            this.setSourceSpecificInfo = function() {
                _self.match.hasScoring = true;

                _self.match.setTeamA( _self.getTeamWithScore( 0 ) );
                _self.match.setTeamB( _self.getTeamWithScore( 1 ) );

                _self.match.setMatchState( _self.getMatchState() );
                _self.match.setPhase( _self.data.currentState.phase );
                _self.match.setFollowOn( _self.isFollowOn() );
                _self.match.setLimitedOvers( _self.isLimitedOvers() );
                _self.match.setAdditionalInfo( _self.data.matchInfo.additionalInfo );

                _self.match.setBattingOrder( _self.data.matchInfo.battingOrder );
                _self.match.setInnings( _self.getInnings() );

                _self.match.setTournamentLabel( _self.getTournamentLabel() );
                _self.match.setMatchSummary( _self.getMatchSummary() );


                // Set the playing XIs, if players are set
                var teamAPlayingXI = _self.getPlayingXI( 0 );
                var teamBPlayingXI = _self.getPlayingXI( 1 );

                _self.match.setPlayingXI( 0, teamAPlayingXI );
                _self.match.setPlayingXI( 1, teamBPlayingXI );


                // Set current state
                var facingBatsman, nonFacingBatsman, bowler, previousBowler, batsmen = [ undefined, undefined ];

                var facingBatsmanId = _self.getFacingBatsmanId();
                var nonFacingBatsmanId = _self.getNonFacingBatsmanId();
                var bowlerId = _self.getBowlerId();
                var previousBowlerId = _self.getPreviousBowlerId();

                if( _self.data.matchInfo.battingOrder &&
                    _self.data.matchInfo.battingOrder.length ) {

                    var battingTeamIdx = _self.data.matchInfo.battingOrder[ _self.getCurrentInningsIndex() ];
                    var battingPlayingXI = battingTeamIdx === 0 ? teamAPlayingXI : teamBPlayingXI;
                    var bowlingPlayingXI = battingTeamIdx === 1 ? teamAPlayingXI : teamBPlayingXI;

                    // dereference player IDs into proper Player instances using the Playing XIs
                    if( facingBatsmanId > 0 ) {
                        facingBatsman = battingPlayingXI.getPlayerById( facingBatsmanId );
                    }
                    if( nonFacingBatsmanId > 0 ) {
                        nonFacingBatsman = battingPlayingXI.getPlayerById( nonFacingBatsmanId );
                    }
                    if( bowlerId > 0 ) {
                        bowler = bowlingPlayingXI.getPlayerById( bowlerId );
                        bowler.currentSpell = _self.data.currentState.currentBowlerCurrentSpell;
                    }
                    if( previousBowlerId > 0 ) {
                        previousBowler = bowlingPlayingXI.getPlayerById( previousBowlerId );
                        previousBowler.currentSpell = _self.data.currentState.previousBowlerCurrentSpell;
                    }

                    if( _self.data.currentState.currentBatsmen ) {
                        for( var i = 0, iLimit = _self.data.currentState.currentBatsmen.length; i < iLimit; i++ ) {
                            var currentBatsmanId = _self.data.currentState.currentBatsmen[ i ];
                            if( currentBatsmanId > 0 ) {
                                if( currentBatsmanId == facingBatsmanId ) {
                                    batsmen[ i ] = facingBatsman;
                                }
                                else if( currentBatsmanId == nonFacingBatsmanId ) {
                                    batsmen[ i ] = nonFacingBatsman;
                                }
                            }
                        }
                    }
                }

                _self.match.setCurrentState( {
                    phase: _self.data.currentState.phase,
                    inProgress: _self.data.currentState.inProgress,
                    requiredRunRate: _self.data.currentState.requiredRunRate,
                    currentInningsIndex: _self.getCurrentInningsIndex(),
                    inningsSummary: _self.data.matchInfo.inningsSummary,
                    partnership: _self.getPartnership(),
                    facingBatsman: facingBatsman,
                    nonFacingBatsman: nonFacingBatsman,
                    currentBatsmen: batsmen,
                    bowler: bowler,
                    previousBowler: previousBowler,
                    recentOvers: _self.data.currentState.recentOvers
                } );


                // Tie-breaker, if one exists
                if( _self.hasTieBreaker() ) {
                    _self.match.setTieBreaker( _self.getTieBreaker() );
                }
            };

            /**
             * Determines the state of the match based on the phase. Upcoming and pre-match count
             * as an "Upcoming" state, complete and post-match count as a "Complete" state; all the
             * rest are "Live" states. There is an exception for tie-breakers, where the match is
             * considered to be "Live" even if it is set as post-match, if it has a tie-breaker
             * that is marked as "Live". "U" -> "Upcoming", "L" -> "Live", "C" -> "Complete"
             * @return {MatchState} - The match state
             */
            this.getMatchState = function() {
                switch ( _self.data.currentState.phase ) {
                case 'E': // pre-match
                case 'U': // upcoming
                    return 'U';
                case 'C': // complete
                    return 'C';
                case 'O': // post-match
                    if ( _self.hasTieBreaker() &&
                        _self.data.tieBreaker.currentState.inProgress ) {
                        return 'L';
                    }
                    return 'C';
                default:
                    return 'L';
                }
            };

            /**
             * Gets the description
             * @return {String}  The description
             */
            this.getDescription = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.description;
                }
            };

            /**
             * Get the match summary (operationally set string, optional, often blank)
             * @return {String} - The match summary string
             */
            this.getMatchSummary = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.matchSummary;
                }
            };

            /**
             * Gets the venue
             * @return {Venue}  The venue
             */
            this.getVenue = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.venue;
                }
            };

            /**
             * Gets the match type
             * @return {String}  The match type
             */
            this.getMatchType = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.matchType;
                }
            };

            /**
             * Gets the group name
             * @return {String}  The group name
             */
            this.getGroupName = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.groupName;
                }
            };

            /**
             * Gets the date of the match
             * @return {Date}  The date
             */
            this.getDate = function() {
                if( _self.data && _self.data.matchInfo ) {
                    var date = cricket.utils.dateFromString( _self.data.matchInfo.matchDate );
                    if( date && !isNaN( date.getTime() ) ) {
                        return date;
                    }
                }
            };

            /**
             * Gets the end date of the match
             * @return {Date}  The date
             */
            this.getEndDate = function() {
                if( _self.data && _self.data.matchInfo ) {
                    var date = cricket.utils.dateFromString( _self.data.matchInfo.matchEndDate );
                    if( date && !isNaN( date.getTime() ) ) {
                        return date;
                    }
                }
            };

            /**
             * Gets the date string
             * @return {String} - The date string.
             */
            this.getDateString = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.matchDate;
                }
            };

            /**
             * Gets the tournament label
             * @return {String} - The tournament label
             */
            this.getTournamentLabel = function() {
                return _self.data.matchInfo.tournamentLabel;
            };

            /**
             * Get the team for a specific index
             * @param  {Number}  index - the index of the team (0 or 1)
             * @return {Object}        - the team
             */
            this.getTeam = function( index ) {

                if ( _self.data.matchInfo.teams &&
                    _self.data.matchInfo.teams[ index ] &&
                    _self.data.matchInfo.teams[ index ].team ) {
                    return core.object.extend( {}, _self.data.matchInfo.teams[ index ].team );
                }

                return {};
            };

            /**
             * Retrieves the status of the match, if one exists
             * @return {MatchStatus}  The match status.
             */
            this.getMatchStatus = function() {
                if( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.matchStatus;
                }
            };

            /**
             * Returns the current innings index value (will still return a value in post-match)
             * @return {Number} - The current innings index
             */
            this.getCurrentInningsIndex = function() {
                if( _self.data && _self.data.currentState ) {
                    return _self.data.currentState.currentInningsIndex;
                }
            };

            /**
             * Returns the PlayingXI instance for that team, if players are set
             * @param  {Number}    teamIndex - The team index
             * @return {PlayingXI}           - The playing XI
             */
            this.getPlayingXI = function( teamIndex ) {
                if( _self.data.matchInfo.teams &&
                    _self.data.matchInfo.teams[ teamIndex ] &&
                    _self.data.matchInfo.teams[ teamIndex ].players &&
                    _self.data.matchInfo.teams[ teamIndex ].players.length ) {

                    var xiData = _self.data.matchInfo.teams[ teamIndex ];
                    var xi = new cricket.PlayingXI( xiData.id, xiData.team );
                    xi.setData( xiData );
                    return xi;
                }
            };

            /**
             * Gets the current partnerhip; will return undefined if the match is unstarted
             * @return {Number} - The partnership.
             */
            this.getPartnership = function() {
                if( _self.data && _self.data.currentState ) {
                    var currentState = _self.hasTieBreaker() ?
                        _self.data.tieBreaker.currentState :
                        _self.data.currentState;

                    return currentState.currentPartnership;
                }
            };

            this.getFacingBatsmanId = function() {
                if( _self.data && _self.data.currentState &&
                    _self.getMatchState() === 'L' && _self.data.currentState.phase !== 'O' ) {

                    return _self.data.currentState.facingBatsman;
                }
            };

            this.getNonFacingBatsmanId = function() {
                if( _self.data && _self.data.currentState &&
                    _self.getMatchState() === 'L' && _self.data.currentState.phase !== 'O' ) {

                    return _self.data.currentState.nonFacingBatsman;
                }
            };

            this.getBowlerId = function() {
                if( _self.data && _self.data.currentState &&
                    _self.getMatchState() === 'L' && _self.data.currentState.phase !== 'O' ) {

                    return _self.data.currentState.currentBowler;
                }
            };

            this.getPreviousBowlerId = function() {
                if( _self.data && _self.data.currentState &&
                    _self.getMatchState() === 'L' && _self.data.currentState.phase !== 'O' ) {

                    return _self.data.currentState.previousBowler;
                }
            };

            this.getInnings = function() {
                if( _self.data.innings ) {
                    return _self.data.innings;
                }
                return [];
            };

            /**
             * Determines whether the match is a tie-break situation by checking whether the property exists in
             * the scoring file; there is no way of doing this for schedule at the moment
             * @return {Boolean} - true for tie-break
             */
            this.hasTieBreaker = function () {
                return _self.data &&
                    _self.data.matchInfo.tieBreaker &&
                    _self.data.tieBreaker;
            };

            /**
             * If scoring data has a tie breaker, it returns a merged version of the match info
             * tie breaker information and the tie breaker data structure containing innings etc.
             * @return {Object} - All tie breaker information
             */
            this.getTieBreaker = function() {
                if( _self.hasTieBreaker() ) {
                    return core.object.extend( true, {}, _self.data.matchInfo.tieBreaker,
                        _self.data.tieBreakear );
                }
            };

            this.getTieBreakerInnings = function() {
                if( _self.hasTieBreaker() &&
                    _self.data.tieBreaker.innings ) {
                    return _self.data.tieBreaker.innings;
                }
                return [];
            };

            /**
             * Returns an array of innings objects, so the score can be built from it, rather than simply
             * returning the score strings for each innings
             * @param  {Number} teamIndex      - The index of the team for which to return the innings objects
             * @return {Array<InningsSummary>} - Array of innings summary models for the given team
             */
            this.getTeamScoreDetails = function( teamIndex ) {

                var innings = [];

                //if scoring data exists, it takes precedence
                if( _self.data ) {
                    var battingOrder = _self.data.matchInfo.battingOrder,
                        cii = _self.data.currentState.currentInningsIndex;

                    innings = cricket.utils.getInningsByTeamIndex( teamIndex, battingOrder, cii,
                        _self.data.innings ).map( function( inns ) {
                            return getInningsSummary( inns, teamIndex );
                        } );

                    /*
                     * If a new innings has started and an innings object doesn't exist for the new
                     * innings and batting index for this innings === index add an empty score
                     * @todo       Double-check this!!
                     */
                    if( ( !_self.data.innings || _self.data.innings.length < ( cii + 1 ) ) &&
                        battingOrder &&
                        battingOrder[ cii ] === teamIndex &&
                        _self.getMatchState() ) {
                        innings.push( defaultInnings );
                    }
                }

                return innings;
            };

            /**
             * Gets the maximum overs for the team; will return nothing for unlimited overs matches
             * @param  {Number} teamIndex - The team index
             * @return {Number}           - The maximum overs.
             */
            this.getMaxOvers = function( teamIndex ) {

                if( _self.data && _self.data.innings && _self.data.matchInfo.isLimitedOvers ) {
                    var battingOrder = _self.data.matchInfo.battingOrder,
                        cii = _self.data.currentState.currentInningsIndex,
                        innings = cricket.utils.getInningsByTeamIndex( teamIndex, battingOrder,
                            cii, _self.data.innings ),
                        inns = innings.length ? innings[ 0 ] : undefined,
                        oversLimit = _self.data.matchInfo.oversLimit;

                    return inns && inns.rodl ? inns.rodl.overs : oversLimit;
                }
                else {
                    return _self.data.matchInfo.oversLimit;
                }
            };

            /**
             * Determines if the match is in a limited overs format
             * @return {Boolean} - True if limited overs, False otherwise
             */
            this.isLimitedOvers = function() {
                if ( _self.data && _self.data.matchInfo ) {
                    return _self.data.matchInfo.isLimitedOvers ||
                        typeof _self.data.matchInfo.oversLimit !== 'undefined';
                }
                return false;
            };

            /**
             * Determines whether the match has a follow-on situation by checking whether the
             * third-innings team is the same as the second-innings team
             * @return {Boolean} true if it is a follow-on, false if it isn't
             */
            this.isFollowOn = function () {
                var innsIndex = _self.getCurrentInningsIndex();
                if ( innsIndex < 2 ) {
                    return false;
                }

                if ( _self.data && _self.data.matchInfo.battingOrder ) {
                    var order = _self.data.matchInfo.battingOrder;
                    return order[ 2 ] === order[ 1 ];
                }
            };

            /**
             * Gets the innings summary from an innings object
             * @private
             * @param  {Object} innings - The innings object, as given in the scoring file
             * @return {InningsSummary} - The summary object
             */
            var getInningsSummary = function( innings, teamIndex ) {

                if( innings && innings.scorecard ) {
                    var oversLimit = _self.data.matchInfo.oversLimit;
                    return {
                        runs: innings.scorecard.runs,
                        wkts: innings.scorecard.wkts,
                        allOut: innings.scorecard.allOut || false,
                        declared: innings.declared || false,
                        overProgress: getOverProgress( innings, oversLimit ),
                        runRate: innings.runRate,
                        maxOvers: _self.getMaxOvers( teamIndex )
                    };
                }
                else {
                    return defaultInnings;
                }
            };

            /**
             * Given a string representation of the number of overs elapsed in the match
             * (e.g., 1.3) it returns the full over progress (e.g., 1.3/20)
             * @param  {String}  overs  - The overs
             * @return {String}         - The over progress
             */
            var getOverProgress = function( innings, oversLimit ) {
                var overProgress = innings.overProgress;
                var maxOvers = innings && innings.rodl ? innings.rodl.overs : oversLimit;
                if( maxOvers ) {
                    overProgress += '/' + maxOvers;
                }
                return overProgress;
            };

        };
        ScoringProcessor.prototype = Object.create( Processor.prototype );
        ScoringProcessor.prototype.constructor = ScoringProcessor;

        /**
         * Processor for match schedule entry data; inherits from match data Processor
         * @class ScheduleEntryProcessor
         * @constructor
         * @param {Match}  match - The match
         */
        var ScheduleEntryProcessor = function( match ) {
            Processor.call( this, match );

            var _self = this;

            /**
             * Saves the raw schedule data in the match object
             */
            this.setRawData = function() {
                _self.match.data.schedule = _self.data;
            };

            this.setSourceSpecificInfo = function() {

                /*
                 * Schedule entry scoring is only reliable when the match is complete; before that,
                 * scoring data will always have more accurate innings scores. So only override
                 * when the match doesn't have scoring data or the match is complete. Otherwise,
                 * it's not safe to override the team score.
                 */
                if( !_self.match.hasScoring || _self.getMatchState() === 'C' ) {
                    _self.match.setTeamA( _self.getTeamWithScore( 0 ) );
                    _self.match.setTeamB( _self.getTeamWithScore( 1 ) );
                }

                if( !_self.match.hasScoring ) {
                    /**
                     * Schedule data is not always reliable where the tournament label is concerned, so
                     * if there is scoring data, don't try to override it
                     */
                    _self.match.setTournamentLabel( _self.getTournamentLabel() );
                    /**
                     * Schedule data is not accurate enough to return the correct information in all
                     * instances, so if there is scoring, don't try to override it
                     */
                    _self.match.setLimitedOvers( _self.isLimitedOvers() );


                    /**
                     * Slight different treatment between schedule entry data and scoring, where pre-
                     * and post-match states are treated as non-live in scoring, but live in schedule,
                     * so don't let schedule override scoring so keep it consistent when data comes in
                     */
                    _self.match.setMatchState( _self.getMatchState() );
                }
            };

            /**
             * Gets the match state
             * @return {MatchState} - The match state
             */
            this.getMatchState = function() {
                return _self.data ? _self.data.matchState : undefined;
            };

            /**
             * Gets the match status object
             * @return {MatchStatus} - The match status object
             */
            this.getMatchStatus = function() {
                return _self.data ? _self.data.matchStatus : undefined;
            };

            /**
             * Gets the description
             * @return {String}  The description
             */
            this.getDescription = function() {
                if( _self.data ) {
                    return _self.data.description;
                }
            };

            /**
             * Gets the venue
             * @return {Venue}  The venue
             */
            this.getVenue = function() {
                if( _self.data ) {
                    return _self.data.venue;
                }
            };

            /**
             * Gets the match type
             * @return {String}  The match type
             */
            this.getMatchType = function() {
                if( _self.data ) {
                    return _self.data.matchType;
                }
            };

            /**
             * Gets the group name
             * @return {String}  The group name
             */
            this.getGroupName = function() {
                if( _self.data ) {
                    return _self.data.groupName;
                }
            };

            /**
             * Gets the date of the match
             * @return {Date}  The date
             */
            this.getDate = function() {
                if( _self.data ) {
                    var date = cricket.utils.dateFromString( _self.data.matchDate );
                    if( date && !isNaN( date.getTime() ) ) {
                        return date;
                    }
                }
            };

            /**
             * Gets the date of the match
             * @return {Date}  The date
             */
            this.getEndDate = function() {
                if( _self.data ) {
                    var date = cricket.utils.dateFromString( _self.data.endTimestamp );
                    if( date && !isNaN( date.getTime() ) ) {
                        return date;
                    }
                }
            };

            /**
             * Gets the date string
             * @return {String} - The date string.
             */
            this.getDateString = function() {
                if( _self.data ) {
                    return _self.data.matchDate;
                }
            };

            /**
             * Get the team for a specific index
             * @param  {Number}  index - the index of the team (0 or 1)
             * @return {Object}        - the team
             */
            this.getTeam = function( index ) {

                var team = {};
                var teamNumber = 'team' + ( index + 1 );

                if ( _self.data[ teamNumber ] ) {
                    team = _self.data[ teamNumber ].team || team;
                }

                return core.object.extend( {}, team );
            };

            this.getTournamentLabel = function() {
                return _self.data.tournamentLabel;
            };

            /**
             * Returns an array of innings objects, so the score can be built from it, rather than simply
             * returning the score strings for each innings
             * @param  {Number} teamIndex      - The index of the team for which to return the innings objects
             * @return {Array<InningsSummary>} - Array of innings summary models for the given team
             */
            this.getTeamScoreDetails = function( teamIndex ) {

                var innings = [];

                if( _self.data && _self.data[ 'team' + ( teamIndex + 1 ) ] &&
                    _self.data[ 'team' + ( teamIndex + 1 ) ].innings ) {

                    var teamData = _self.data[ 'team' + ( teamIndex + 1 ) ];

                    for( var i = 0; i < teamData.innings.length; i++ ) {

                        var inns = teamData.innings[ i ];

                        /*
                         * Sometimes the data feed returns an innings object, but with no balls
                         * faced means the inns never started, so it needs to be ignored
                         */
                        if( inns.ballsFaced ) {
                            innings.push( core.object.extend( {}, defaultInnings, {
                                overProgress: cricket.utils.getOverProgress( inns.ballsFaced, inns.maxBalls ),
                                runRate: cricket.utils.getRunRate( inns.runs, inns.ballsFaced ),
                                maxOvers: _self.getMaxOvers( teamIndex )
                            }, inns ) );
                        }
                    }
                }

                return innings;
            };

            /**
             * Gets the maximum overs for the team; will return nothing for unlimited overs matches
             * @param  {Number} teamIndex - The team index
             * @return {Number}           - The maximum overs.
             */
            this.getMaxOvers = function( teamIndex ) {

                if( _self.data &&
                    _self.data[ 'team' + ( teamIndex + 1 ) ] &&
                    _self.data[ 'team' + ( teamIndex + 1 ) ].innings &&
                    _self.data[ 'team' + ( teamIndex + 1 ) ].innings.maxBalls ) {

                    var innings = _self.data['team' + ( teamIndex + 1 ) ].innings,
                        inns = innings[ innings.length - 1 ],
                        oversLimit = cricket.utils.convertBallsToOvers( inns.maxBalls );

                    return oversLimit;
                }
            };

            /**
             * Determines if the match is in a limited overs format
             * Warning: Can return false negatives!
             * @return {Boolean} - True if limited overs, False otherwise
             */
            this.isLimitedOvers = function() {
                if ( _self.data ) {
                    var i, iLimit, innings;
                    var team1exists = true;
                    var team2exists = true;

                    if ( _self.data.team1 && _self.data.team1.innings ) {
                        var team1Innings = _self.data.team1.innings;
                        for ( i = 0, iLimit = team1Innings.length; i < iLimit; i++ ) {
                            innings = team1Innings[ i ];
                            if ( innings.maxBalls ) {
                                return true;
                            }
                        }
                    }

                    if ( _self.data.team2 && _self.data.team2.innings ) {
                        var team2Innings = _self.data.team2.innings;
                        for ( i = 0, iLimit = team2Innings.length; i < iLimit; i++ ) {
                            innings = team2Innings[ i ];
                            if ( innings.maxBalls ) {
                                return true;
                            }
                        }
                    }

                    if ( -1 < cricket.MATCH_TYPES.LIMITED.indexOf( _self.getMatchType() ) ) {
                        return true;
                    } else if ( -1 < cricket.MATCH_TYPES.UNLIMITED.indexOf( _self.getMatchType() ) ) {
                        return false;
                    }
                }
                return false;
            };

        };
        ScheduleEntryProcessor.prototype = Object.create( Processor.prototype );
        ScheduleEntryProcessor.prototype.constructor = ScheduleEntryProcessor;


        return {
            ScoringProcessor: ScoringProcessor,
            ScheduleEntryProcessor: ScheduleEntryProcessor
        };

    }() );

}( PULSE.cricket, PULSE.core ) );

( function ( core, cricket ) {
    "use strict";

    var ONE_DAY = 1000 * 60 * 60 * 24;

    /**
     * Representation of a match
     * @constructor
     * @class  Match
     * @param  {(MatchId|Number)} matchId - instance of a {@link MatchId} or a numerical ID
     * @param  {Tournament} tournament    - instance of a {@link Tournament}
     */
    cricket.Match = function ( matchId, tournament ) {

        /**
         * The ID of the match
         * @type {Number}
         */
        this.id = matchId instanceof cricket.MatchId ? matchId.getId() : matchId;
        /**
         * The operationally-set name of the match
         * @type {String}
         */
        this.name = matchId instanceof cricket.MatchId ? matchId.getName() : matchId.toString();
        /**
         * The instance of the tournament the match belongs to
         * @type {Tournament}
         */
        this.tournament = tournament;

        /**
         * Store for the raw data of a match
         * Will contain two parameters: "scoring" (/fixtures/{id}/scoring) and "schedule" (/fixtures/{id})
         * @type {Object}
         */
        this.data = {};

        /**
         * Whether the match has scoring data or not
         * @type {Boolean}
         */
        this.hasScoring = false;

        /**
         * Whether the match is limited overs or not
         * @type {Boolean}
         */
        this.limitedOvers = false;

        /**
         * Whether the match has a follow-on scenario
         * Determined by whether the batting order has 2nd and 3rd inns as batting by the same team
         * @type {Boolean}
         */
        this.followOn = false;

        /**
         * Whether the match is a result only match (i.e., has no scorecard information, just a score)
         * @type {Boolean}
         */
        this.resultOnly = false;

        /**
         * The type of the match
         * @type {MatchType}
         */
        this.matchType = undefined;
        /**
         * The state of the match
         * @type {MatchState}
         */
        this.matchState = undefined;

        /**
         * The start date (and time) of the match
         * @type {Date}
         */
        this.date = undefined;

        /**
         * The timezone offset of the match start time, in hours (e.g., 5.5 for India)
         * @type {Number}
         */
        this.timezoneOffset = 0;
        /**
         * The match description string. E.g., "1st Test"
         * @type {String}
         */
        this.description = undefined;
        /**
         * The venue where the match is played
         * @type {Venue}
         */
        this.venue = undefined;
        /**
         * The status of the match - only exists if the match is complete
         * @type {MatchStatus}
         */
        this.matchStatus = undefined;
        /**
         * The phase of the match. This is a more granular means of determining where the match is in its timeline
         * @type {MatchPhase}
         */
        this.phase = undefined;
        /**
         * Optional operationally-set string that should be used to override the innings summary text or the match outcome, if it exists
         * @type {String}
         */
        this.matchSummary = undefined;
        /**
         * The label of the match, only gets generated if requesting entryPerDay=true on the /fixtures endpoint with a {MatchListFilter}
         * If set, it should override the match description
         * @type {String}
         */
        this.label = undefined;
        /**
         * The tournament label (user-friendly tournament name)
         * @type {String}
         */
        this.tournamentLabel = undefined;

        this.teamA = undefined;
        this.teamB = undefined;

        /**
         * The array of the two squads of the match (1st belonging to Team A, 2nd to Team B)
         * @type {Squad[]}
         */
        this.squads = [ undefined, undefined ];
        /**
         * The array of the two playing XI lists (1st belonging to Team A, 2nd to Team B)
         * @type {PlayingXI[]}
         */
        this.playingXIs = [ undefined, undefined ];

        /**
         * The batting order of the match, repsenteded as an array. Each member is the index of the team batting in which position.
         * For example [ 1, 0, 0, 1 ] means Team B batted first, Team A batted 2nd and 3rd innings (follow-on), and Team B batted last inns
         * @type {Number[]}
         */
        this.battingOrder = [];
        /**
         * A metadata of sorts for the match, contains extra information such as referees, umpires, notes etc.
         * @type {Object}
         */
        this.additionalInfo = {};
        /**
         * Array of innings objects (containing scoring and scorecard information)
         * @type {Innings[]}
         */
        this.innings = [];
        /**
         * Optional object set on a match describing a tie-breaker state
         * @type {Object}
         */
        this.tieBreaker = undefined;
        /**
         * Modelled after a CurrentStateBean, contains information about the live state of the match
         * @type {CurrentState}
         */
        this.currentState = undefined;
        /**
         * CMS-set metadata for the match, can be anything
         * @type {Object}
         */
        this.metadata = {};
    };

    cricket.Match.prototype.setMatchState = function( matchState ) {
        this.matchState = matchState;
    };

    cricket.Match.prototype.setMatchStatus = function( matchStatus ) {
        this.matchStatus = matchStatus;
    };

    cricket.Match.prototype.setPhase = function( phase ) {
        this.phase = phase;
    };

    cricket.Match.prototype.setDate = function( date ) {
        this.date = date;
    };

    cricket.Match.prototype.setEndDate = function( date ) {
        this.endDate = date;
    };

    cricket.Match.prototype.setTimezoneOffset = function( timezoneOffset ) {
        this.timezoneOffset = timezoneOffset;
    };

    cricket.Match.prototype.setMatchType = function( matchType ) {
        this.matchType = matchType;
    };

    cricket.Match.prototype.setDescription = function( description ) {
        this.description = description;
    };

    cricket.Match.prototype.setTournamentLabel = function( tournamentLabel ) {
        this.tournamentLabel = tournamentLabel;
    };

    cricket.Match.prototype.setMatchSummary = function( matchSummary ) {
        this.matchSummary = matchSummary;
    };

    cricket.Match.prototype.setTeamA = function( teamA ) {
        this.teamA = teamA;
    };

    cricket.Match.prototype.setTeamB = function( teamB ) {
        this.teamB = teamB;
    };

    cricket.Match.prototype.setInnings = function( innings ) {
        this.innings = innings;
    };

    cricket.Match.prototype.setBattingOrder = function( battingOrder ) {
        this.battingOrder = battingOrder;
    };

    cricket.Match.prototype.setTieBreaker = function( tieBreaker ) {
        this.tieBreaker = tieBreaker;
    };

    cricket.Match.prototype.setVenue = function( venue ) {
        this.venue = venue;
    };

    cricket.Match.prototype.setGroupName = function( groupName ) {
        this.groupName = groupName;
    };

    cricket.Match.prototype.setSquad = function( squad ) {
        var _self = this;
        if( _self.teamA && squad.getTeam().id === _self.teamA.id ) {
            _self.squads[ 0 ] = squad;
        }
        else if( _self.teamB && squad.getTeam().id === _self.teamB.id ) {
            _self.squads[ 1 ] = squad;
        }
    };

    cricket.Match.prototype.setPlayingXI = function( teamIndex, playingXI ) {
        this.playingXIs[ teamIndex ] = playingXI;
    };

    cricket.Match.prototype.setCurrentState = function( currentState ) {
        this.currentState = currentState;
    };

    cricket.Match.prototype.setAdditionalInfo = function( additionalInfo ) {
        this.additionalInfo = additionalInfo;
    };

    cricket.Match.prototype.setInnings = function( innings ) {
        this.innings = innings;
    };

    cricket.Match.prototype.setFollowOn = function( followOn ) {
        this.followOn = followOn;
    };

    cricket.Match.prototype.setLimitedOvers = function( limitedOvers ) {
        this.limitedOvers = limitedOvers;
    };

    cricket.Match.prototype.setMetaData = function( metadata ) {
        this.metadata = metadata;
    };

    /**
     * Determines if it has scoring data
     * @return {Boolean} - True if has scoring data, False otherwise
     */
    cricket.Match.prototype.hasScoringData = function() {
        return this.hasScoring;
    };

    /**
     * Given a teamId, returns whether the team is in this match
     * @param  {(String|Number)} teamId - The ID of the team
     * @return {Boolean} - Whether it has a team with the given ID or not
     */
    cricket.Match.prototype.hasTeamWithId = function( teamId ) {

        var _self = this;

        if( teamId && teamId > -1 &&
            ( ( _self.teamA && +teamId === _self.teamA.id ) ||
              ( _self.teamB && +teamId === _self.teamB.id ) ) ) {

            return true;
        }
        return false;
    };

    /**
     * Determine if it has venue with the given id
     * @param {(String|Number)} -  venueId  The venue id
     * @return {Boolean} - True if has venue with id, False otherwise.
     */
    cricket.Match.prototype.hasVenueWithId = function ( venueId ) {

        var _self = this;

        var venue = _self.getVenue();
        if ( venueId && venueId > -1 && venue && +venueId === venue.id ) {
            return true;
        }
        return false;
    };

    /**
     * Determine if it has group with the given name
     * @param {String} -  groupName  The group name
     * @return {Boolean} - True if has group with the given name, False otherwise.
     */
    cricket.Match.prototype.hasGroupWithName = function ( groupName ) {

        var _self = this;

        if ( groupName && groupName === _self.getGroupName() ) {
            return true;
        }
        return false;
    };

    /**
     * OPTA scorecard don't have dot ball information
     * @return {Boolean} - True if has dots, False otherwise.
     */
    cricket.Match.prototype.hasDots = function() {
        var _self = this;
        if( _self.additionalInfo &&
            ( _self.additionalInfo._scorecard_source === 'opta' ||
              _self.additionalInfo._scorecard_source === 'cixml' ) ) {
            return false;
        }
        return true;
    };

    /**
     * Decides whether a particular team (based on its index in the match) is batting
     * @param  {Number}  teamIndex - The team index
     * @return {Boolean}           - True if the team is batting, False if not
     */
    cricket.Match.prototype.teamIsBatting = function( teamIndex ) {
        var _self = this;
        if( _self.hasScoringData() ) {
            var tieBreaker = _self.hasTieBreaker();
            var currentState = tieBreaker ? _self.tieBreaker.currentState : _self.currentState;
            var battingOrder = tieBreaker ? _self.tieBreaker.battingOrder : _self.battingOrder;
            if( currentState && battingOrder ) {
                var battingIdx = battingOrder[ currentState.currentInningsIndex ];
                return currentState.inProgress === true && battingIdx === teamIndex;
            }
        }
        return false;
    };

    /**
     * Decides whether a particular team (based on its index in the match) is bowling
     * @param  {Number}  teamIndex - The team index
     * @return {Boolean}           - True if the team is bowling, False if not
     */
    cricket.Match.prototype.teamIsBowling = function( teamIndex ) {
        var _self = this;
        if( _self.hasScoringData() ) {
            var tieBreaker = _self.hasTieBreaker();
            var currentState = tieBreaker ? _self.tieBreaker.currentState : _self.currentState;
            var battingOrder = tieBreaker ? _self.tieBreaker.battingOrder : _self.battingOrder;
            if( currentState && battingOrder ) {
                var battingIdx = battingOrder[ currentState.currentInningsIndex ];
                var bowlingIdx = battingIdx === 0 ? 1 : 0;
                return currentState.inProgress === true && bowlingIdx === teamIndex;
            }
        }
        return false;
    };

    /**
     * Determines whether the match is in an innings break
     * @return {Boolean} - True if in innings break, false otherwise
     */
    cricket.Match.prototype.isInInningsBreak = function() {
        var _self = this;
        if( _self.hasScoringData() ) {
            switch( _self.currentState.phase ) {
                case '12':
                case '23':
                case '34':
                    return true;
            }
        }
        return false;
    };

    /**
     * Gets the match identifier object
     * @return {MatchId} - The match identifier
     */
    cricket.Match.prototype.getMatchId = function() {
        return new cricket.MatchId( this.id, this.name );
    };

    /**
     * Get the match id
     * @return {Number}  The match id
     */
    cricket.Match.prototype.getId = function () {
        return this.id;
    };

    /**
     * Get the name. This is generated upon match creation for internal purposes and should not
     * be displayed on the front-end
     * @return {String}  Name
     */
    cricket.Match.prototype.getName = function () {
        return this.name;
    };

    /**
     * Get the tournament
     * @return {Tournament}  Tournament.
     */
    cricket.Match.prototype.getTournament = function () {
        return this.tournament;
    };

    /**
     * Get the tournament label
     * @return {String} - Tournament label
     */
    cricket.Match.prototype.getTournamentLabel = function () {
        var _self = this;
        if ( _self.tournament.tournamentLabel ) {
            return _self.tournament.tournamentLabel;
        }
        else {
            return _self.tournamentLabel;
        }
    };

    /**
     * Get the match state
     * @return {MatchState} - The state of the match
     */
    cricket.Match.prototype.getMatchState = function () {
        return this.matchState;
    };

    /**
     * Gets the date
     * @return {Date} - The date.
     */
    cricket.Match.prototype.getDate = function() {
        return this.date;
    };

    /**
     * Gets the end date
     * @return {Date} - The date.
     */
    cricket.Match.prototype.getEndDate = function() {
        return this.endDate;
    };

    /**
     * Get the match type
     * @return {string}  Match type.
     */
    cricket.Match.prototype.getMatchType = function () {
        return this.matchType;
    };

    /**
     * Get the match date
     * @return {Date} - The match date.
     */
    cricket.Match.prototype.getMatchDate = function () {
        return this.date;
    };

    /**
     * Get the team for a specific index
     * @param  {Number}  index - the index of the team (0 or 1)
     * @return {Object}        - the team
     */
    cricket.Match.prototype.getTeam = function ( index ) {
        return index === 0 ? this.teamA : this.teamB;
    };

    /**
     * Given a team id, returns the index of the team in the match (0 for home team, 1 for away)
     * @param {Number}  id - The identifier for the team; -1 if the team isn't in the match
     */
    cricket.Match.prototype.getTeamIndex = function( id ) {
        var _self = this;
        if( _self.teamA && _self.teamA.id && id && _self.teamA.id.toString() === id.toString() ) {
            return 0;
        }
        else if( _self.teamB && _self.teamB.id && id && _self.teamB.id.toString() === id.toString() ) {
            return 1;
        }
        return -1;
    };

    /**
     * Get the venue object
     * @return {Object} Venue
     */
    cricket.Match.prototype.getVenue = function () {
        return this.venue;
    };

    /**
     * Get the group name
     * @return {String} Group name
     */
    cricket.Match.prototype.getGroupName = function () {
        return this.groupName;
    };

    /**
     * Get the current innings index
     * @return {Number} - Current innings index; will return -1 if match hasn't started or no information is available
     */
    cricket.Match.prototype.getCurrentInningsIndex = function () {
        var _self = this;
        if( _self.currentState ) {
            return _self.currentState.currentInningsIndex;
        }
        return -1;
    };

    /**
     * Get the team batting order
     * @return {Array.<Number>} - array of team indices, in the order of their innings
     */
    cricket.Match.prototype.getBattingOrder = function() {
        return this.battingOrder;
    };
    /**
     * Get the team batting order in the tie breaker
     * @return {Array.<Number>} - array of team indices, in the order of their innings
     */
    cricket.Match.prototype.getTieBreakerBattingOrder = function() {
        var _self = this;
        if ( _self.hasTieBreaker() ) {
            return _self.tieBreaker.battingOrder;
        }
    };

    cricket.Match.prototype.getTeamBatFirst = function ( index ) {
        var _self = this;
        // Use scoring data if possible
        if ( _self.battingOrder && _self.battingOrder.length ) {
            return _self.battingOrder[ 0 ] === index;
        }
        return false;
    };

    cricket.Match.prototype.getInnings = function() {
        var _self = this;
        if( _self.hasScoringData() ) {
            return _self.innings;
        }
        return [];
    };
        cricket.Match.prototype.getTieBreakerInnings = function() {
        var _self = this;
        if( _self.hasTieBreaker() ) {
            return _self.tieBreaker.innings;
        }
        return [];
    };

    /**
     * Gets the innings summary based on their index in the batting order
     * Will return nothing if there's no scoring data (schedule data doesn't work here)
     * @param  {Number}  innsIndex - The inns index
     * @return {InningsSummary}    - The innings summary or undefined, if inns/data doesn't exist
     */
    cricket.Match.prototype.getInningsSummary = function( innsIndex ) {
        var _self = this;
        if( _self.hasScoringData() && _self.innings.length ) {
            if( typeof innsIndex === 'undefined' ) {
                innsIndex = _self.currentState.currentInningsIndex;
            }
            var teamIndex = _self.battingOrder[ innsIndex ];
            var team = teamIndex === 0 ? _self.teamA : _self.teamB;
            return team.score[ innsIndex < 2 ? 0 : 1 ];
        }
    };

    /**
     * Whether if the team has batted in the match
     * @return {Boolean} - True if the team hasn't batted, False if they have
     */
    cricket.Match.prototype.getYetToBat = function ( index ) {
        var _self = this;
        var team = _self.getTeam( index ),
            batting = _self.teamIsBatting( index );

        if( ( !team.score || team.score.length === 0 ) &&
            !batting &&
            _self.getMatchState() !== 'C' ) {
            return true;
        }

        return false;
    };

    /**
     * Gets the current partnership
     * @return {Number} - The current partnership
     */
    cricket.Match.prototype.getCurrentPartnership = function() {
        var _self = this;
        if ( _self.currentState ) {
            return _self.currentState.partnership;
        }
    };

    /**
     * Gets the current facing batsman
     * @return {cricket.Player} - The facing batsman; undefined if not available
     */
    cricket.Match.prototype.getFacingBatsman = function() {
        var _self = this;
        if( _self.currentState ) {
            return _self.currentState.facingBatsman;
        }
    };

    /**
     * Gets the current non-facing batsman
     * @return {cricket.Player} - The non-facing batsman; undefined if not available
     */
    cricket.Match.prototype.getNonFacingBatsman = function() {
        var _self = this;
        if( _self.currentState ) {
            return _self.currentState.nonFacingBatsman;
        }
    };

    /**
     * Gets the current batsmen at the crease
     * @return {Array<cricket.Player>} - The batsmen
     */
    cricket.Match.prototype.getCurrentBatsmen = function() {
        var _self = this;
        if( _self.currentState ) {
            return _self.currentState.currentBatsmen;
        }
        return [ undefined, undefined ];
    };

    /**
     * Gets the current bowler
     * @return {cricket.Player} - The bowler; undefined if there is no current bowler
     */
    cricket.Match.prototype.getCurrentBowler = function() {
        var _self = this;
        if( _self.currentState ) {
            return _self.currentState.bowler;
        }
    };

    /**
     * Gets the previous bowler
     * @return {cricket.Player} - The previous bowler; undefined if there is no previous bowler
     */
    cricket.Match.prototype.getPreviousBowler = function() {
        var _self = this;
        if( _self.currentState ) {
            return _self.currentState.previousBowler;
        }
    };

    /**
     * Returns the current batting team
     * @return {Team} - The current batting team.
     */
    cricket.Match.prototype.getCurrentBattingTeam = function() {
        var _self = this;
        if( _self.battingOrder && _self.battingOrder.length && _self.matchState === 'L' ) {
            var teamIndex = _self.battingOrder[ _self.getCurrentInningsIndex() ];
            return teamIndex === 0 ? _self.teamA : _self.teamB;
        }
    };

    /**
     * Returns the current batting team
     * @return {Team} - The current batting team.
     */
    cricket.Match.prototype.getCurrentBowlingTeam = function() {
        var _self = this;
        if( _self.battingOrder && _self.battingOrder.length && _self.matchState === 'L' ) {
            var teamIndex = _self.battingOrder[ _self.getCurrentInningsIndex() ];
            return teamIndex === 0 ? _self.teamB : _self.teamA;
        }
    };

    /**
     * Gets the required run rate
     * @return {String} - The required run rate
     */
    cricket.Match.prototype.getRequiredRunRate = function () {
        var _self = this;
        if ( _self.currentState ) {
            return _self.currentState.requiredRunRate;
        }
    };

    /**
     * Returns the projections or chase text for a match
     * @return {String} - The innings summary text.
     */
    cricket.Match.prototype.getInningsSummaryText = function() {
        var _self = this;

        var text;

        if( _self.currentState &&
            _self.currentState.inningsSummary &&
            _self.currentState.inningsSummary.version === 1 ) {

            var inningsSummary = _self.currentState.inningsSummary;
            var values = inningsSummary.values;
            var currentBattingTeam = _self.getCurrentBattingTeam();
            var requiredRunRate = _self.getRequiredRunRate();

            switch( inningsSummary.type ) {
                case "P":
                    text = currentBattingTeam.abbreviation + " Projections: " +
                        values[  0 ] +
                        " &#64; Current Run Rate &#124; " + values[ 1 ] + ' ' +
                        ( values[ 1 ] == 1 ? 'run' : 'runs' ) +
                        " @ 6 RPO &#124; " + values[ 2 ] + ' ' +
                        ( values[ 2 ] == 1 ? 'run' : 'runs' ) + " @ 8 RPO";
                    break;
                case "C":
                    var reqRR = requiredRunRate ?
                        " &#124; Req RR&#58; " + requiredRunRate : "";
                    text = currentBattingTeam.abbreviation + " require " +
                        values[ 0 ] + ' ' + ( values[ 0 ] == 1 ? 'run' : 'runs' ) +
                        " with " +
                        values[ 1 ] + ' ' + ( values[ 1 ] == 1 ? 'ball' : 'balls' ) +
                        " remaining" + reqRR;

                    break;

                case "T":
                    text = _self.getTestInningsSummaryText();
                    break;
            }
        }

        return text;
    };

    /**
     * If test scores, then for the current innings and the current batting team
     * we need to work out whether or not we're chasing or leading.
     * For instance Team B has a lead of 100 in the second innings then [100][1][1]
     * would be returned.
     *
     *   [0] The run delta between the two teams.
     *   [1] No-Score recorded (0), Ahead(1), or Behind(-1)
     *   [2] To-Win flag. If (1) then run count is to "win". This is only set in the final innings.
     */
    cricket.Match.prototype.getTestInningsSummaryText = function () {
        var _self = this;

        if( !_self.currentState ) {
            return;
        }

        var text;
        var values = _self.currentState.inningsSummary.values;

        var delta = values[ 0 ];
        var state = values[ 1 ];
        var toWin = values[ 2 ];

        var cii = _self.getCurrentInningsIndex();
        var teamIndex = _self.teamIsBatting( 0 ) ? 0 : 1;
        var score = _self.getInningsSummary( cii );
        var followOn = _self.isFollowOn();
        var currentBattingTeam = _self.getCurrentBattingTeam();
        var followOnText = '';

        if ( followOn && cii === 2 ) // check for cii possibly redundant
        {
            followOnText = ' are following on and';
        }

        /**
         * If it's the first innings, there's no 'leading' or 'trailing'
         */
        if ( cii === 0 ) {
            if( score ) {
                text = currentBattingTeam.abbreviation + ' are ' + score.runs + ' off ' +
                    score.overProgress + ' ' + ( score.overProgress === '1' ? 'over' : 'overs' );
            }
        }
        /**
         * If it's the last innings and the teams aren't tied
         */
        else if ( toWin && delta ) {
            text = currentBattingTeam.abbreviation + ' require ' + delta +
                ' ' + ( delta == 1 ? 'run' : 'runs' ) + ' to win';
        } else {
            switch ( state ) {
            case -1:
                text = currentBattingTeam.abbreviation + followOnText +
                    ' trail by ' + delta + ' ' + ( delta == 1 ? 'run' : 'runs' );
                break;
            case 0:
                if ( followOn ) {
                    text = currentBattingTeam.abbreviation + followOnText +
                        ' scores are level';
                } else {
                    text = 'Scores are level';
                }
                break;
            case 1:
                text = currentBattingTeam.abbreviation + followOnText +
                    ' lead by ' + delta + ' ' + ( delta == 1 ? 'run' : 'runs' );
                break;
            }
        }

        return text;
    };

    /**
     * Returns the status text of the match (e.g., West Indies won by 3 runs)
     * @return {String} - The match status text or empty string if no status is available
     */
    cricket.Match.prototype.getMatchStatusText = function() {
        var _self = this;
        if( _self.matchStatus && _self.matchStatus.text ) {
            return _self.matchStatus.text;
        }
        return '';
    };

    /**
     * Gets the outcome
     * @return {String} - The outcome: "A" (1st team won), "B" (2nd team), "N" (no result), "D" (draw)
     */
    cricket.Match.prototype.getOutcome = function () {
        var _self = this;
        if ( _self.matchStatus ) {
            return _self.matchStatus.outcome;
        }
    };

    /**
     * Check if a certain team (based on their index) won the match
     * @param  {Number}  teamIndex - The index of the team
     * @return {Boolean}           - The team won
     */
    cricket.Match.prototype.getTeamWon = function( teamIndex ) {
        var _self = this;
        var desiredOutcome = teamIndex === 0 ? 'A' : 'B';
        return desiredOutcome === _self.getOutcome();
    };

    /**
     * Gets the winner index
     * @return {Number} - The winner index, -1 if no winner
     */
    cricket.Match.prototype.getWinnerIndex = function() {
        var _self = this;
        if( _self.matchStatus && _self.matchStatus.outcome ) {
            if ( _self.matchStatus && _self.matchStatus.outcome == 'A' ) {
                return 0;
            } else if ( _self.matchStatus && _self.matchStatus.outcome == 'B' ) {
                return 1;
            }
        }
        return -1;
    };

    /**
     * Gets the umpires array
     * @return {String[]} - The umpires
     */
    cricket.Match.prototype.getUmpires = function() {
        var _self = this;

        if( Object.keys( _self.additionalInfo ).length ) {

            var limit = 10; // assumes no more than 10 umpires get assigned to a match
            var umpires = [];

            for ( var i = 0; i < limit; i++ ) {
                var umpire = _self.additionalInfo[ "umpire.name." + ( i + 1 ) ];
                if ( umpire ) {
                    umpires.push( umpire );
                }
            }

            return umpires;
        }
    };

    /**
     * Determines whether the match is a limited overs match or not
     * IMPORTANT: note that it returns false if there's no data
     *
     * @return {Boolean} - True if it is limited, false if it isn't
     */
    cricket.Match.prototype.isLimitedOvers = function () {
        return this.limitedOvers;
    };

    /**
     * Determines whether the match has a follow-on situation by checking whether the
     * third-innings team is the same as the second-innings team
     *
     * @return {Boolean} true if it is a follow-on, false if it isn't
     */
    cricket.Match.prototype.isFollowOn = function() {
        return this.followOn;
    };

    /**
     * Determines whether the match is a tie-break situation by checking whether the property exists in
     * the scoring file; there is no way of doing this for schedule at the moment
     *
     * @return {Boolean} - true for tie-break
     */
    cricket.Match.prototype.hasTieBreaker = function () {
        return typeof this.tieBreaker !== 'undefined';
    };

    /**
     * Returns the tie breaker object within a scoring file, if it exists
     * @return {Object} - tie breaker object structure, or undefined
     */
    cricket.Match.prototype.getTieBreaker = function () {
        var _self = this;
        if ( _self.hasTieBreaker() ) {
            return _self.tieBreaker;
        }
    };

    /**
     * Gets the toss string
     * @return {String}  The toss.
     */
    cricket.Match.prototype.getToss = function () {
        return this.additionalInfo[ "toss.elected" ];
    };

    /**
     * Gets the player of the match string
     * @return {String}  The toss.
     */
    cricket.Match.prototype.getPlayerOfTheMatch = function () {
        return this.additionalInfo[ "result.playerofthematch" ];
    };

    /**
     * Gets the referee string
     * @return {String} - The referee
     */
    cricket.Match.prototype.getReferee = function () {
        return this.additionalInfo[ "referee.name" ];
    };

    /**
     * Operationally set match notes
     * @return {Array<InningsNote>} - The notes for each innings
     */
    cricket.Match.prototype.getNotes = function () {
        var _self = this;

        if( Object.keys( _self.additionalInfo ).length &&
            _self.battingOrder &&
            _self.battingOrder.length &&
            _self.currentState ) {

            var cii = _self.currentState.currentInningsIndex;
            var notes = [];

            for ( var i = 0; i < cii + 1; i++ ) {
                var note = {};
                note.entries = [];
                note.team = _self.getTeam( _self.battingOrder[ i ] );

                var j = 1;
                while ( _self.additionalInfo[ "notes." + ( i + 1 ) + "." + j ] ) {
                    note.entries.push( _self.additionalInfo[ "notes." +
                        ( i + 1 ) + "." + j ] );
                    j++;
                }

                if( note.entries.length ) {
                    notes.push( note );
                }
            }
            return notes;
        }
    };

    /**
     * Iterates through the players of each team and compares the given ID with the players
     * @param  {Number}  playerId  The player id
     * @return {Player}  The player object, or undefined
     */
    cricket.Match.prototype.getPlayerById = function( playerId ) {
        var _self = this;
        if( _self.playingXIs.length ) {
            return findPlayerInLists( playerId, _self.playingXIs );
        }
        else {
            return findPlayerInLists( playerId, _self.squads );
        }
    };

    /**
     * Retrieves the latest batting stats for a given player, with the option of specifying an
     * innings to grab stats from
     * @param  {Number} id        - the player ID
     * @param  {Number} innsIndex - (optional) the innings index to retrieve stats from
     * @return {Object}           - the player's batting stats
     */
    cricket.Match.prototype.getBatsmanStats = function( id, innsIndex ) {

        var player = this.getPlayerById( id );
        if( !player ) {
            return;
        }
        var team = player.team;
        if( team ) {
            var teamIndex = this.getTeamIndex( team.id );
            var innings;
            if( typeof innsIndex !== 'undefined' && this.battingOrder[ innsIndex ] == teamIndex ) {
                innings = this.innings[ innsIndex ];
            }
            else {
                for( var i = this.battingOrder.length - 1; i >= 0; i-- ) {
                    if( this.battingOrder[ i ] == teamIndex ) {
                        innings = this.innings[ i ];
                        break;
                    }
                }
            }
            if( innings && innings.scorecard ) {
                for( var i = 0, iLimit = innings.scorecard.battingStats.length; i < iLimit; i++ ) {
                    var stats = innings.scorecard.battingStats[ i ];
                    if( stats.playerId == id ) {
                        return stats;
                    }
                }
            }
        }

    };

    /**
     * Retrieves the latest batting stats for a given player, with the option of specifying an
     * innings to grab stats from
     * @param  {Number} id        - the player ID
     * @param  {Number} innsIndex - (optional) the innings index to retrieve stats from
     * @return {Object}           - the player's batting stats
     */
    cricket.Match.prototype.getBowlerStats = function( id, innsIndex ) {

        var player = this.getPlayerById( id );
        if( !player ) {
            return;
        }
        var team = player.team;
        if( team ) {
            var teamIndex = this.getTeamIndex( team.id );
            var innings;
            if( typeof innsIndex !== 'undefined' && this.battingOrder[ innsIndex ] != teamIndex ) {
                innings = this.innings[ innsIndex ];
            }
            else {
                for( var i = this.battingOrder.length - 1; i >= 0; i-- ) {
                    if( this.battingOrder[ i ] != teamIndex ) {
                        innings = this.innings[ i ];
                        break;
                    }
                }
            }
            if( innings && innings.scorecard ) {
                for( var i = 0, iLimit = innings.scorecard.bowlingStats.length; i < iLimit; i++ ) {
                    var stats = innings.scorecard.bowlingStats[ i ];
                    if( stats.playerId == id ) {
                        return stats;
                    }
                }
            }
        }

    };

    /**
     * Calculates the number of days in a match
     * @return  {Number}  The day number.
     */
    cricket.Match.prototype.getDayNumber = function() {

        var _self = this;

        if( !_self.date ) {
            console.warn( 'Cannot retrieve match days without any data' );
            return 0;
        }

        if( _self.isLimitedOvers() ) {
            return 1;
        }
        else {
            return Math.ceil( ( _self.endDate - _self.date ) / ONE_DAY );
        }
    }

    /**
     * Retrieves an instance for each day of the match
     * return  {Array<Match>} - an instance of a cricket Match object for each day of the match;
     *                          returns an empty array if the match doesn't have enough data to
     *                          derive an entry for each day
     */
    cricket.Match.prototype.getEntryPerDay = function() {
        var _self = this;
        var matchInstances = [];

        if( !_self.date ) {
            console.warn( 'Cannot retrieve match entries by day without any data' );
            return [];
        }

        if( _self.isLimitedOvers() ) {
            return [ this ];
        }
        else {
            var matchDay, processor;
            var days = _self.getDayNumber();
            var store = cricket.Store.getInstance();
            for( var i = 0; i < days; i++ ) {
                matchDay =  new cricket.Match( _self.getMatchId(),
                    new cricket.TournamentId( _self.tournament.id, _self.tournament.name ) );
                if( _self.data.scoring ) {
                    processor = new cricket.matchDataProcessor.ScoringProcessor( matchDay );
                    processor.setData( core.object.extend( _self.data.scoring ) );
                }
                else if( _self.data.schedule ) {
                    processor = new cricket.matchDataProcessor.ScheduleEntryProcessor( matchDay );
                    processor.setData( core.object.extend( _self.data.schedule ) );
                    matchDay.endDate = _self.endDate;
                }
                // generate the same label the API generates when requesting multi-day matches
                matchDay.label = matchDay.description + ', Day ' + ( i + 1 );

                // because we're copying a test match with a start date & end date X days later,
                // work out what the days' start/end dates are going to be
                matchDay.date = new Date( matchDay.date.getTime() + ( i * ONE_DAY ) );
                matchDay.endDate = new Date( matchDay.endDate.getTime() - ( ( days - i - 1 ) * ONE_DAY ) );
                matchDay.resultOnly = _self.resultOnly;
                matchInstances.push( matchDay );
            }
        }
        return matchInstances;
    };

    /**
     * Given multiple lists of players, it works out if a specific player is in any of the lists
     * @param  {Number}                       playerId     The player identifier
     * @param  {Array<Array<cricket.Player>>} playerLists  The player lists
     * @return {Boolean} - Whether the player is in any of the lists or not
     */
    var findPlayerInLists = function( playerId, playerLists ) {
        var player;
        for( var i = 0, iLimit = playerLists.length; i < iLimit; i++ ) {
            var playerList = playerLists[ i ];
            if( playerList ) {
                player = playerList.getPlayerById( playerId );
                if( player ) {
                    return player;
                }
            }
        }
    };

}( PULSE.core, PULSE.cricket ) );

( function ( cricket ) {

    /**
     * Processor for match scorecard data
     * @constructor
     * @class  Scorecard
     * @param {Match} match - The match to process
     */
    cricket.Scorecard = function ( match ) {

        var _self = this;

        this.match = match;
    };

    /**
     * Given a innings scorecard, return the array of batsmen with their stats for that inns
     * @param  {Object}  scorecard - The scorecard
     * @return {Array}             - Batsmen
     */
    cricket.Scorecard.prototype.getBatsmen = function ( scorecard ) {
        var _self = this;

        var batsmen = [];
        var facingBatsman = _self.match.getFacingBatsman();

        if( scorecard && scorecard.battingStats ) {

            batsmen = scorecard.battingStats.map( function( playerStats ) {

                var batsman = {};

                batsman.facing = _self.match.getMatchState() === 'L' && ( facingBatsman && batsman.id === facingBatsman.id );
                batsman.player = _self.match.getPlayerById( playerStats.playerId );
                batsman.stats = {
                    runs: playerStats ? playerStats.r : "0",
                    ballsFaced: playerStats ? playerStats.b : "0",
                    strikeRate: playerStats ? playerStats.sr || "0.00" : "0.00",
                    fours: playerStats ? playerStats[ '4s' ] : "0",
                    sixes: playerStats ? playerStats[ '6s' ] : "0",
                    mod: playerStats.mod
                };

                return batsman;

            } );
        }

        return batsmen;
    };

    /**
     * Given a innings scorecard, return the array of bowlers with their stats for that inns
     * @param  {Object}  scorecard  The scorecard
     * @return {Array}             - Bowlers
     */
    cricket.Scorecard.prototype.getBowlers = function ( scorecard ) {
        var _self = this;

        var bowlers = [];

        if( scorecard && scorecard.bowlingStats ) {

            bowlers = scorecard.bowlingStats.map( function( playerStats ) {

                var bowler = {};

                bowler.player = _self.match.getPlayerById( playerStats.playerId );
                bowler.stats = {
                    wickets: playerStats ? playerStats.w : "0",
                    runsConceded: playerStats ? playerStats.r : "0",
                    overs: playerStats ? playerStats.ov : "0",
                    dots: playerStats ? playerStats.d : "0",
                    maidens: playerStats ? playerStats.maid : "0",
                    economy: playerStats ? playerStats.e : "-"
                };

                return bowler;

            } );
        }

        return bowlers;
    };

    /**
     * Get the extras.
     * @param  {Object} scorecard - The scorecard
     * @return {Object}           - Extras
     */
    cricket.Scorecard.prototype.getExtras = function ( scorecard ) {
        var _self = this;

        var extras = {},
            total = 0,
            statTypes = {
                noBallRuns: 'nb',
                wideRuns: 'w',
                byeRuns: 'b',
                legByeRuns: 'lb',
                penaltyRuns: 'pen'
            };

        for ( var type in statTypes ) {
            if ( typeof scorecard.extras[ type ] !== 'undefined' ) {
                extras[ statTypes[ type ] ] = scorecard.extras[ type ];
                total += scorecard.extras[ type ];
            } else {
                extras[ statTypes[ type ] ] = 0;
            }
        }

        extras.getTotal = function() {
            return total;
        };

        extras.toString = function() {
            var extrasArray = [];
            for ( var type in statTypes ) {
                if ( scorecard.extras[ type ] ) {
                    extrasArray.push( statTypes[ type ] + ' ' + scorecard.extras[ type ] );
                }
            }
            return extrasArray.join( ', ' );
        };

        return extras;
    };

    /**
     * Given an innings scorecard object, return the fall of wicket model
     * @param  {Object} scorecard - The scorecard
     * @return {Array}            - Fow
     */
    cricket.Scorecard.prototype.getFOW = function ( scorecard ) {
        var _self = this;

        var wickets = [];

        for ( var i = 0; i < scorecard.fow.length; i++ ) {

            var fow = scorecard.fow[ i ],
                player = _self.match.getPlayerById( fow.playerId ),
                score = fow.w + '-' + ( fow.r || "0" ),
                over = ( parseInt( fow.bp.over, 10 ) - 1 ) + '.' + fow.bp.ball;

            var model = {
                score: score,
                bp: fow.bp,
                player: player,
                over: over
            };

            wickets.push( model );
        }

        return wickets;
    };

    /**
     * Model for a single innings scorecard in a match
     * @param  {Object}  scorecard - The scorecard data
     * @return {Object}            - Innings scorecard model
     */
    cricket.Scorecard.prototype.getInningsScorecardModel = function( scorecard ) {
        var _self = this;
        return {
            // @todo probably should not set default unless cii is equal or smaller than index
            runs: scorecard.runs || 0,
            wickets: scorecard.wkts || 0,
            allOut: scorecard.allOut || false,

            batsmen: _self.getBatsmen( scorecard ),
            bowlers: _self.getBowlers( scorecard ),

            extras: _self.getExtras( scorecard ),
            fow: _self.getFOW( scorecard )
        };
    };

    /**
     * Model for a match scorecard, with optional tie breaker
     * @return {Object}  The scorecard model.
     */
    cricket.Scorecard.prototype.getModel = function () {
        var _self = this;

        var model = {
            isLimitedOvers: _self.match.isLimitedOvers(),
            innings: [],
            tieBreaker: undefined
        };
        var battingOrder, teamIndex;

        if ( _self.match.hasScoringData() && _self.match.getInnings().length ) {

            battingOrder = _self.match.getBattingOrder();
            var cii = _self.match.getCurrentInningsIndex();
            var innings = _self.match.getInnings();

            model.innings = innings.filter( function( inns ) {
                return typeof inns.scorecard !== 'undefined';
            } ).map( function( inns, index ) {
                teamIndex = battingOrder[ index ];

                return {
                    team: _self.match.getTeam( teamIndex ),
                    opposition: _self.match.getTeam( teamIndex == 0 ? 1 : 0 ),
                    scorecard: _self.getInningsScorecardModel( inns.scorecard ),

                    declared: inns.declared || false,
                    overProgress: inns.overProgress,
                    runRate: inns.runRate,
                };
            } );

            if ( _self.match.hasTieBreaker() ) {
                var tieBreaker = _self.match.getTieBreaker();
                model.tieBreaker = {
                    label: cricket.utils.getTieBreakerLabel( tieBreaker.type ),
                    innings: []
                };

                if( tieBreaker.innings ) {
                    battingOrder = _self.match.getTieBreakerBattingOrder();
                    model.tieBreaker.innings = tieBreaker.innings.filter( function( inns ) {
                        return typeof inns.scorecard !== 'undefined';
                    } ).map( function( inns, index ) {
                        teamIndex = battingOrder[ index ];

                        return {
                            team: _self.match.getTeam( teamIndex ),
                            scorecard: _self.getInningsScorecardModel( inns.scorecard )
                        };
                    } );
                }
            }
        }

        return model;
    };

    ////////////////////////////////////////////////////////////////////////////////////////



    /**
     * @todo       refactor
     * Gets the batting stats available in the scoring.js scorecard
     * @params id - the player id
     * @return the batting stats object for that player
     */
    cricket.Scorecard.prototype.getBattingStats = function ( id ) {
        var tieBreaker = this.scoringData.tieBreaker;
        var innings = this.hasTieBreaker() ? tieBreaker.innings : this.scoringData.innings;

        if ( !innings || !innings[ innings.length - 1 ].scorecard ) {
            return;
        }

        var battingStats = innings[ innings.length - 1 ].scorecard.battingStats,
            totalBatsmen = battingStats.length,
            i = totalBatsmen;

        while ( i-- ) {
            if ( battingStats[ i ].playerId == id ) {
                return battingStats[ i ];
            }
        }
    };

    /**
     * @todo       refactor
     * Gets the bowling stats available in the scoring.js scorecard
     * @params {Number} id - the player id
     * @return the bowling stats object for that player
     */
    cricket.Scorecard.prototype.getBowlingStats = function ( id ) {
        var tieBreaker = this.scoringData.tieBreaker;
        var innings = this.hasTieBreaker() ? tieBreaker.innings : this.scoringData.innings;

        if ( !innings || !innings[ innings.length - 1 ].scorecard ) {
            return;
        }

        var bowlingStats = innings[ innings.length - 1 ].scorecard.bowlingStats,
            totalBowlers = bowlingStats.length,
            i = totalBowlers;

        while ( i-- ) {
            if ( bowlingStats[ i ].playerId == id ) {
                return bowlingStats[ i ];
            }
        }
    };

    /**
     * @todo        refactor
     */
    cricket.Scorecard.prototype.getWicketStatsByBP = function ( bp ) {
        if ( !this.scoringData.innings || !this.scoringData.innings[ this.scoringData
                .innings.length - 1 ].scorecard ) return;

        var battingStats = this.scoringData.innings[ this.scoringData.innings.length -
            1 ].scorecard.battingStats;
        for ( var i = 0, iLimit = battingStats.length; i < iLimit; i++ ) {
            var batsmanStats = battingStats[ i ];
            if ( batsmanStats.mod &&
                batsmanStats.mod.dismissedBp.innings == bp.innings &&
                batsmanStats.mod.dismissedBp.over == bp.over &&
                batsmanStats.mod.dismissedBp.ball == bp.ball ) {
                var player = this.playerLookup[ batsmanStats.playerId ];
                return {
                    stats: batsmanStats,
                    player: player
                };
            }
        }
    };

}( PULSE.cricket ) );

( function( cricket, core ) {

    "use strict";

    /**
     *
     * Doesn't do too many clever things
     *
     * @class ExtendedMatchList
     * @extends MatchListFilter
     */
    cricket.ExtendedMatchList = function( reverse ) {

        cricket.MatchListFilter.call( this );

        var _self = this;

        var matches = [];
        var store = cricket.Store.getInstance();

        /**
         * Used for calculations involving days of matches
         * @constant Number ONE_DAY
         */
        var ONE_DAY = 86400000;
        /**
         * Used for calculations involving days of matches
         * @constant Number HALF_DAY
         */
        var HALF_DAY = 43200000;

        /**
         * Converts a value in milliseconds to a number of FULL days
         * @param  {Number} millis - The millis
         * @return {Number}        - The number of full days
         */
        var millisToDays = function( millis ) {
            millis = millis || 0;
            return Math.floor( millis / ONE_DAY );
        };

        /**
         * Adds a {@link Match} to an array belonging to an object representing an individual date.
         * Adds this object to the given list.
         *
         * @param {Array<Object>} list  - The list groupings by day
         * @param {Match}         match - The match
         */
        var addMatchByDay = function( list, match ) {

            var date = match.getDate().getTime();
            if( list.length === 0 ||
                millisToDays( list[ list.length - 1 ].date ) !== millisToDays( date ) )
            {
                list.push( {
                    date: date,
                    matches: []
                } );
            }

            list[ list.length - 1 ].matches.push( match );
        };

        /**
         * Extended schedule entries contain more infomration than one would extract from a
         * schedule entry, or a scoring file (typically). This function will take a {@link Match}
         * instance and override certain attributes, based on schedule entry data
         *
         * @param {Match}                 match                 - The match
         * @param {ExtendedScheduleEntry} extendedScheduleEntry - The extended schedule entry
         */
        var overrideMatch = function( match, extendedScheduleEntry ) {
            // HACK!! This information only comes in through MSAPI data, so store it here
            if( extendedScheduleEntry.label ) {
                match.label = extendedScheduleEntry.label;
            }

            // HACK!! This information only comes in through MSAPI data, so store it here
            if( extendedScheduleEntry.resultOnly === true ) {
                match.resultOnly = true;
            }

            overrideMatchState( match );
        };

        var overrideMatchState = function( match ) {
            // HACK!! Manually set if a day of a match is not live
            if( match.isLimitedOvers() === false && match.getMatchState() === 'L' ) {
                var date = match.getDate();
                var endDate = match.getEndDate();
                var now = new Date();
                if( date.getTime() - now.getTime() > HALF_DAY ) {
                    match.setMatchState( 'U' );
                }
                else if( now.getTime() - date.getTime() > HALF_DAY && now.getTime() >= endDate.getTime() ) {
                    match.setMatchState( 'C' );
                }
            }
        };

        this.addScoring = function( scoringData ) {
            if( scoringData && scoringData.matchId ) {
                // don't create matches that already exist in the match list
                for( var j = 0, jLimit = matches.length; j < jLimit; j++ ) {
                    if( matches[ j ].getId() === scoringData.matchId.id ) {
                        var processor = new cricket.matchDataProcessor.ScoringProcessor( matches[ j ] );
                        processor.setData( scoringData );

                        overrideMatchState( matches[ j ] );
                    }
                }
            }
        };

        /**
         * Given an MSAPI extended schedule entries response, process these and add them to the
         * match list. Create new {@link Tournament} and {@link Match} instances as required.
         *
         * @param {Array<ExtendedScheduleEntry>} extendedScheduleEntries - The extended schedule entries
         */
        this.addExtendedScheduleEntries = function( extendedScheduleEntries ) {

            var match;

            if( extendedScheduleEntries && extendedScheduleEntries.length ) {

                for( var i = 0, iLimit = extendedScheduleEntries.length; i < iLimit; i++ ) {

                    var extendedScheduleEntry = extendedScheduleEntries[ i ];
                    var tid = new cricket.TournamentId( extendedScheduleEntry.tournamentId.id,
                        extendedScheduleEntry.tournamentId.name );
                    var tournament = store.getTournament( tid );
                    // HACK!! This information only comes in through MSAPI/scoring data, so store it here
                    if( extendedScheduleEntry.tournamentLabel ) {
                        tournament.tournamentLabel = extendedScheduleEntry.tournamentLabel;
                    }

                    var mid = new cricket.MatchId( extendedScheduleEntry.scheduleEntry.matchId.id,
                        extendedScheduleEntry.scheduleEntry.matchId.name );

                    // HACK!! This it to ensure the instances for the match days have the proper timestamps for their days
                    extendedScheduleEntry.scheduleEntry.matchDate = extendedScheduleEntry.timestamp;

                    var matchDate = cricket.utils.dateFromString( extendedScheduleEntry.timestamp );

                    match = undefined;
                    // don't create matches that already exist in the match list
                    for( var j = 0, jLimit = matches.length; j < jLimit; j++ ) {
                        if( matches[ j ].getId() === mid.getId() &&
                            matches[ j ].getDate().getTime() === matchDate.getTime() ) {

                            match = matches[ j ];
                            break;
                        }
                    }
                    // if the match is new to the list, create/ retrieve it from storage
                    if( !match ) {
                        if( store.hasMatch( mid.getId() ) &&
                            store.getMatch( mid, tid ).getDate() &&
                            store.getMatch( mid, tid ).getDate().getTime() !== matchDate.getTime() ) {

                            match = new cricket.Match( mid, tournament );
                        }
                        else {
                            match = store.getMatch( mid, tid );
                        }
                        matches.push( match );
                    }

                    // add metadata to scheduleEntry if available
                    if (extendedScheduleEntry.metadata) {
                        extendedScheduleEntry.scheduleEntry.metadata = extendedScheduleEntry.metadata;
                    }

                    extendedScheduleEntry.scheduleEntry.endTimestamp = extendedScheduleEntry.endTimestamp;

                    // add schedule entry data to the match
                    var processor = new cricket.matchDataProcessor.ScheduleEntryProcessor( match );
                    processor.setData( extendedScheduleEntry.scheduleEntry );

                    // apply overrides
                    overrideMatch( match, extendedScheduleEntry );
                }

                cricket.utils.sortMatches( matches, reverse );
            }
        };

        /**
         * Gets all ids of matches stored
         * @return {Array<Number>} - The array of match ids
         */
        this.getMatchIds = function() {

            var ids = [];
            for( var i = 0, iLimit = matches.length; i < iLimit; i++ ) {
                if( -1 === ids.indexOf( matches[ i ].getId() ) ) {
                    ids.push( matches[ i ].getId() );
                }
            }
            return ids;
        };

        /**
         * Gets all ids of tournaments stored
         * @return {Array<Number>} - The array of tournament ids
         */
        this.getTournamentIds = function() {

            var ids = [];
            for( var i = 0, iLimit = matches.length; i < iLimit; i++ ) {
                var tournamentId = matches[ i ].getTournament().id;
                if( -1 === ids.indexOf( tournamentId ) ) {
                    ids.push( tournamentId );
                }
            }
            return ids;
        };

        /**
         * Gets the number of matches within the match list
         * @param  {Boolean} singleEntry - Whether to count single entries or not
         * @return {Number}              - The match count.
         */
        this.getMatchCount = function( singleEntry ) {
            var _self = this;
            if( singleEntry === true ) {
                return _self.getMatchIds().length;
            }
            else {
                return matches.length;
            }
        };

        /**
         * Get a reference to a match object, based on its ID, if stored in the match list
         * @param  {Number} matchId - The match identifier
         * @return {Match}          - The match
         */
        this.getMatch = function( matchId ) {

            var match, firstMatch;
            for( var i = 0, iLimit = matches.length; i < iLimit; i++ ) {

                match = matches[ i ];
                if( match.getId() === +matchId ) {

                    // there's only one instance of non-test matches
                    if( match.isLimitedOvers() ) {
                        return match;
                    }
                    else {
                        var date = match.getDate(),
                            now  = new Date();

                        // stop if there is a match playing that day (always return live day)
                        if( Math.abs( now - date ) < ONE_DAY ) {
                            break;
                        }
                        // if not, remember the first instance of the match
                        else if( !firstMatch ) {
                            firstMatch = match;
                        }
                    }
                }
            }
            // if there's a first instance, it means there was no live match
            return firstMatch || match;
        };

        /**
         * Retrieve all instances of the match from the list
         * @param  {Number} matchId - The match identifier
         * @return {Array<Match>}   - The instances of the match (will be one for limited overs)
         */
        this.getMatchDays = function( matchId ) {

            var matchDays = [];
            for( var i = 0, iLimit = matches.length; i < iLimit; i++ ) {
                if( matches[ i ].getId() == matchId ) {
                    matchDays.push( matches[ i ] );
                }
            }
            return matchDays;
        };

        /**
         * Get the list of matches
         * @return {Array<Match>} - The matches
         */
        this.getMatches = function( options ) {
            return _self.filterArray( matches, options );
        };

        /**
         * Get filtered matches grouped by date
         * Could be made more efficient
         * @param  {FilterOptions} options - The options
         * @return {Array<Object>}         - The matches as arrays with a timestamp
         * @example [ { date: 120314000, matches: [ ... ] } ]
         */
        this.getMatchesByDay = function( options ) {
            var days = [];
            var filteredMatches = _self.filterArray( matches, options );

            for( var i = 0, iLimit = filteredMatches.length; i < iLimit; i++ ) {

                addMatchByDay( days, filteredMatches[ i ] );
            }

            return days;
        };

        /**
         * Remove all matches from the list
         */
        this.reset = function() {
            matches = [];
        };


        // this.groupMatchesBySeries = function( series ) {

        //     var matches = this.getMatchesModel(),
        //         tournamentIds = series || this.getTournamentIds(),
        //         series = [];

        //     for( var i = 0, length = matches.matches.length; i < length; i++ )
        //     {
        //         var match = matches.matches[i];
        //         if( -1 < $.inArray( match.tournamentName, tournamentIds ) )
        //         {
        //             var hasSeriesIndex = this.arrHasSeriesIndex(series, match.tournamentId);

        //             if (hasSeriesIndex === 'no-match')
        //             {
        //                 series.push([ match ])
        //             }
        //             else
        //             {
        //                 series[hasSeriesIndex].push(match);
        //             }
        //         }
        //     }

        //     return { series : series };
        // };

        // this.arrHasSeriesIndex = function(series, id) {


        //     for (var i=0, len = series.length; i < len; i++) {

        //         var array = series[i];

        //         for (var m=0, mLength = array.length; m < mLength; m++) {

        //             var match = array[m];

        //             if (match.tournamentId === id) {

        //                 return i;
        //             }
        //         }
        //     }

        //     //String required so index 0 can be returned
        //     return 'no-match';
        // };

        /**
         *  Returns an array of match models
         *  For test matches, it checks the date and ignores previous day isntances
         */
        // this.getUpcomingModel = function( limit ) {

        //     var matches = this.data.matches,
        //         model   = { matches: [] },
        //         count   = 0;

        //     if( !matches )
        //     {
        //         return model;
        //     }

        //     for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
        //     {
        //         var matchId     = matches[i].scheduleEntry.matchId.name,
        //             timestamp   = matches[i].timestamp,
        //             date        = PULSE.CLIENT.DateUtil.parseDateTime( timestamp ),
        //             now         = new Date(),
        //             match       = dates[timestamp][matchId];

        //         // for test matches, check the date to find out if they're still upcoming
        //         if( ( (match.getMatchType() === 'TEST' || match.getMatchType() === "FIRST_CLASS") && date - now < 3600000 ) || ( match.getMatchType() !== 'TEST'  && match.getMatchType() !== "FIRST_CLASS" && match.getMatchState() === 'L' ) )
        //         {
        //             continue;
        //         }

        //         var matchModel = match.getFullModel();

        //         matchModel.label = matches[i].label;
        //         matchModel.tournamentLabel = matches[i].tournamentLabel;

        //         // if the metaschedule says this is a result-only match, don't include the match link
        //         matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

        //         model.matches.push( matchModel );

        //         count++;
        //         if( count === limit )
        //         {
        //             break;
        //         }
        //     }

        //     return model;
        // };

    };
    cricket.ExtendedMatchList.prototype = Object.create( cricket.MatchListFilter.prototype );
    cricket.ExtendedMatchList.prototype.constructor = cricket.ExtendedMatchList;

}( PULSE.cricket, PULSE.core ) );

( function( core, cricket ) {

    "use strict";

    /**
     * Handles metadata returned by the MSAPI
     * @class MatchListMetadata
     */
    cricket.MatchListMetadata = function( meta ) {

        var metadata = meta;
        var _self = this;

        /**
         * Gives the ability to reset the metadata
         * @param {MSAPIMeta} meta - MSAPI Metadata response
         */
        this.reset = function( meta ) {
            metadata = meta;
        };

        /**
         * Gets the countries for a region ID
         * @param  {Number}  regionId - The region identifier
         * @return {Array<Country>}   - The array of countries in that region
         */
        this.getCountriesByRegionId = function( regionId ) {

            if( regionId && metadata ) {
                for( var i = 0, iLimit = metadata.venues.regions.length; i < iLimit; i++ ) {
                    var region = metadata.venues.regions[ i] ;
                    if( region.id == regionId ) {
                        return region.countries;
                    }
                }
            }
            return [];
        };

        /**
         * Gets the venues for a country ID
         * @param  {Number}  countryId - The country identifier
         * @return {Array<Venue>}      - The venues array for that country
         */
        this.getVenuesByCountryId = function( countryId ) {

            if( countryId && metadata ) {
                for( var i = 0, iLimit = metadata.venues.regions.length; i < iLimit; i++ ) {
                    var countries = metadata.venues.regions[ i ].countries;
                    for( var j = 0, jLimit = countries.length; j < jLimit; j++ ) {
                        if( countries[ j ].id == countryId ) {
                            return countries[ j ].venues;
                        }
                    }
                }
            }
            return [];
        };

        /**
         * Gets the venues for a region ID
         * @param  {Number}  regionId - The region identifier
         * @return {Array<Venue>}     - The venues array for that region
         */
        this.getVenuesByRegionId = function( regionId ) {

            var venues = [];

            if( regionId && metadata ) {

                var countries = _self.getCountriesByRegionId( regionId );
                for( var i = 0, iLimit = countries.length; i < iLimit; i++ ) {
                    venues = venues.concat( countries[ i ].venues );
                }
            }
            return venues;
        };

        /**
         * Gets the flat venues array; all the venues in the metadata
         * @return     {Array<Venue>}  The flat venues array.
         */
        this.getFlatVenuesArray = function() {

            var venues = [];

            if( metadata ) {

                for( var i = 0, iLimit = metadata.venues.regions.length; i < iLimit; i++ ) {
                    var countries = metadata.venues.regions[ i ].countries;
                    for( var j = 0, jLimit = countries.length; j < jLimit; j++ ) {
                        venues.push( countries[ j ].venues );
                    }
                }
            }
            return venues;

        };

    };

}( PULSE.core, PULSE.cricket ) );

( function( core, cricket ) {

    "use strict";

    /**
     * Handles storing of lists of matches, processes them as appropriate
     * To be used when needing to store matches (and having enough) for filtering
     * @class SimpleMatchList
     * @deprecated
     * @extends MatchListFilter
     */
    cricket.SimpleMatchList = function() {

        cricket.MatchListFilter.call( this );

        var _self = this;

        /**
         * Mapping of match IDs to match objects
         * @type {Object}
         */
        this.matches = {};

        /**
         * Takes the match list's stored match ID to match object mapping and converts to array
         * @return {Array.<Match>} - array of match instances
         */
        var dereferenceMatches = function() {
            var matches = [];
            for ( var mid in _self.matches ) {
                if( _self.matches.hasOwnProperty( mid ) )
                {
                    matches.push( _self.getMatchById( mid ) );
                }
            }
            return matches;
        };

        /**
         * Either returns a stored version of the match or requests one from the store
         * @param  {ScheduleEntry} scheduleEntry  The schedule entry
         * @param  {TournamentId}  tournamentId   The tournament identifier
         * @return {Match}                        The match.
         */
        var getMatch = function( scheduleEntry, tournamentId ) {
            var matchId = new cricket.MatchId( scheduleEntry.matchId.id, scheduleEntry.matchId.name );
            if( !_self.matches[ matchId.getId() ] ) {
                _self.matches[ matchId.getId() ] = cricket.Store.getInstance().getMatch( matchId, tournamentId );
            }
            return _self.matches[ matchId.getId() ];
        };

        /**
         * Getter for the stored match object
         * @param  {Number}  id - The identifier
         * @return {MatchId}    - The match instance, if it exists
         */
        this.getMatchById = function( id ) {
            return _self.matches[ id ];
        };

        /**
         * Add matches to the filter
         * @param {Array<ScheduleEntry>} scheduleEntries - Matches data
         * @param {(Number|TournamentId)} tournamentId   - The ID of the tournament
         */
        this.addScheduleEntries = function( scheduleEntries, tournamentId ) {
            for ( var i = 0, iLimit = scheduleEntries.length; i < iLimit; i++ ) {
                var id = scheduleEntries[ i ].matchId.id;
                if ( !_self.matches[ id ] ) {
                    _self.matches[ id ] = getMatch( scheduleEntries[ i ], tournamentId );
                }
                var processor = new cricket.matchDataProcessor.ScheduleEntryProcessor( _self.matches[ id ] );
                processor.setData( scheduleEntries[ i ] );
            }
        };

        /**
         * Add match instances directly to the list
         * @param {Array<Match>} matches - The matches
         */
        this.addMatches = function( matches ) {
            for( var i = 0, iLimit = matches.length; i < iLimit; i++ ) {
                var match = matches[ i ];
                if( !_self.matches[ match.getId() ] ) {
                    _self.matches[ match.getId() ] = match;
                }
            }
        };

        /**
         * Get the number of matches stored
         * @return {Number} - Number of matches stored
         */
        this.getMatchCount = function() {
            return Object.keys( _self.matches ).length;
        };

        /**
         * Get an array of cricket.Match instances, optionally filtered
         * @param  {FilterOptions} options - optional filter options
         * @return {Array<Match>}          - Matches array
         */
        this.getMatches = function( options ) {

            var matches = dereferenceMatches();
            return _self.filterArray( matches, options );
        };

        console.warn( 'cricket.SimpleMatchList is deprecated. Please use cricket.ExtendedMatchList instead going forward' );
    };
    cricket.SimpleMatchList.prototype = Object.create( cricket.MatchListFilter.prototype );
    cricket.SimpleMatchList.prototype.constructor = cricket.SimpleMatchList;

} ( PULSE.core, PULSE.cricket ) );

( function ( cricket ) {
    "use strict";
    /**
     * Representation of a player
     * @constructor
     * @param  {Object} playerData - Basic player data object produced by the DMS
     */
    cricket.Player = function ( playerData ) {

        var _self = this;

        /**
         * The ID of the player
         * @private
         * @type {Number}
         */
        this.id = playerData.id;

        /**
         * The full display name of the player
         * @private
         * @type {String}
         */
        this.fullName = playerData.fullName;

        /**
         * The shortened name (usu. initials + last name) of the player
         * @private
         * @type {String}
         */
        this.shortName = playerData.shortName || '';

        /**
         * The nationality of the player
         * @private
         * @type {String}
         */
        this.nationality = playerData.nationality;

        /**
         * Player's DOB
         * @private
         * @type {Date}
         */
        this.dateOfBirth = typeof playerData.dateOfBirth !== 'undefined' ?
            new Date( playerData.dateOfBirth ) :
            undefined;

        this.age = cricket.utils.getAge( this.dateOfBirth );

        /**
         * Whether the player is right-handed or not
         * @private
         * @type {Boolean}
         */
        this.rightHandedBat = playerData.rightHandedBat;

        /**
         * The player's team
         * @type {Object}
         */
        this.team = undefined;

        /**
         * Get the id of the player
         * @return {Number}  Id
         */
        this.getId = function() {
            return this.id;
        };

        /**
         * Get the full name of the player
         * @return {String}  Full name
         */
        this.getFullName = function() {
            return this.fullName;
        };

        /**
         * Get the short name of the player
         * @return {String}  Short name; can be undefined
         */
        this.getShortName = function() {
            return this.shortName;
        };

        /**
         * Get the nationality of the player
         * @return {String}  nationality; can be undefined
         */
        this.getNationality = function() {
            return this.nationality;
        };

        /**
         * Set the date of birth of the player
         * @param {Number}  DOB as a Unix date
         */
        this.setDateOfBirth = function( milliseconds ) {
            if ( milliseconds ) {
                this.dateOfBirth = new Date( milliseconds );
                this.age = cricket.utils.getAge( this.dateOfBirth );
            }
        };

        /**
         * Get the date of birth of the player
         * @return {Date}  DOB as a date object; can be undefined
         */
        this.getDateOfBirth = function() {
            return this.dateOfBirth;
        };

        this.setTeam = function( team ) {
            this.team = team;
        };

        this.getTeam = function( team ) {
            return this.team;
        };
    };
}( PULSE.cricket ) );

( function ( core, cricket ) {

    "use strict";

    /**
     * A player list
     * @abstract
     * @class  PlayerList
     */
    cricket.PlayerList = function() {

        var _self = this;

        /**
         * The players in the list
         * @type {Array<Player>}
         */
        this.players = [];

        /**
         * Setting data
         * @abstract
         *//* istanbul ignore next */
        this.setData = function() {
            throw new PULSE.unimplementedFunctionError( "PlayerList#setData" );
        };

        /**
         * Retrieves a player from the list by their ID, if there's a match
         * @param  {Number} id - The id
         * @return {Player}    - The player
         */
        this.getPlayerById = function( id ) {
            _self = this;
            for( var i = 0, iLimit = _self.players.length; i < iLimit; i++ ) {
                if( _self.players[ i ].getId() === id ) {
                    return _self.players[ i ];
                }
            }
        };
    };

} ( PULSE.core, PULSE.cricket ) );

( function ( core, cricket ) {

    "use strict";
    /**
     * Representation of a cricket playing XI
     * @class  PlayingXI
     * @extends {PlayerList}
     * @param  {Number} id - playing XI ID
     * @param  {Team} team - instance of a {@link Team}
     */
    cricket.PlayingXI = function ( id, team ) {

        if( typeof id === 'undefined' || !team ) {
            return;
        }

        cricket.PlayerList.call( this );

        var _self = this;

        this.id = id;
        this.team = team;

        this.captain = undefined;
        this.wicketKeeper = undefined;
        this.players = [];

        this.setData = function( xiData ) {
            _self = this;
            if( xiData && xiData.players && xiData.players.length ) {
                _self.players = xiData.players.map( function( playerData ) {
                    var player = new cricket.Player( playerData );
                    player.setTeam( _self.team );
                    return player;
                } );
            }

            if( xiData.captain ) {
                _self.captain = new cricket.Player( xiData.captain );
                _self.captain.setTeam( _self.team );
            }
            if( xiData.wicketKeeper ) {
                _self.wicketKeeper = new cricket.Player( xiData.wicketKeeper );
                _self.wicketKeeper.setTeam( _self.team );
            }
        };
    };

    cricket.PlayingXI.prototype = Object.create( cricket.PlayerList.prototype );
    cricket.PlayingXI.prototype.constructor = cricket.PlayingXI;

} ( PULSE.core, PULSE.cricket ) );

( function ( core, cricket ) {

    "use strict";
    /**
     * Representation of a cricket squad
     * @class  Squad
     * @extends {PlayerList}
     * @param  {Number} id - squad ID
     * @param  {Team} team - instance of a {@link Team}
     */
    cricket.Squad = function ( id, team ) {

        if( typeof id === 'undefined' || !team ) {
            return;
        }

        cricket.PlayerList.call( this );

        var _self = this;

        this.id = id;
        this.team = team;

        this.captain = undefined;
        this.wicketKeeper = undefined;
        this.players = [];

        this.getTeam = function() {
            return _self.team;
        };

        this.setData = function( squadData ) {
            _self = this;
            if( squadData && squadData.players && squadData.players.length ) {
                _self.players = squadData.players.map( function( playerData ) {
                    var player = new cricket.Player( playerData );
                    player.setTeam( _self.team );
                    if( squadData.captainId === playerData.id ) {
                        _self.captain = player;
                    }
                    if( squadData.wicketKeeperId === playerData.id ) {
                        _self.wicketKeeper = player;
                    }
                    return player;
                } );
            }
        };
    };

    cricket.Squad.prototype = Object.create( cricket.PlayerList.prototype );
    cricket.Squad.prototype.constructor = cricket.Squad;

} ( PULSE.core, PULSE.cricket ) );

( function( core, cricket ) {

    "use strict";

    /**
     * Representation of a cricket tournament list
     * @constructor
     */
    cricket.TournamentList = function() {

        var _self = this;

        var tournamentList = [];

        /**
         * Given an API tournaments response, process these and add them to the
         * match list.
         *
         * @param {Array<TournamentEntry>} tournamentEntries - The tournament entries
         */
        this.addTournamentEntries = function( tournamentEntries ) {

            if (tournamentEntries && tournamentEntries.length) {

                var metadata, tournament;

                for( var j = 0, jLimit = tournamentEntries.length; j < jLimit; j++ ) {

                    tournament = cricket.Store.getInstance().getTournament( tournamentEntries[j].id );
                    tournament.setData(tournamentEntries[j]);

                    tournamentList.push( tournament );

                }

            }

        };

        /**
         * Get the list of tournaments
         * @return {Array<Tournament>} - The tournaments
         */
        this.getTournamentList = function() {
            return tournamentList;
        };

        /**
         * Remove all tournaments from the list
         */
        this.reset = function() {
            tournamentList = [];
        };

    };

}( PULSE.core, PULSE.cricket ) );

( function( core, cricket ) {
    "use strict";
    /**
     * Representation of a cricket tournament
     * @constructor
     * @param  {Object.<TournamentId>} tournamentId - instance of a {@link TournamentId}
     */
    cricket.Tournament = function( tournamentId ) {
        var _self = this;

        /**
         * The ID of the tournament
         * @type {Number}
         */
        this.id = tournamentId instanceof cricket.TournamentId ? tournamentId.getId() : tournamentId;

        /**
         * The string representation of the tournament
         * @type {String}
         */
        this.name = tournamentId instanceof cricket.TournamentId ? tournamentId.getName() : tournamentId.toString();

        /**
         * @todo implement this!
         */
        this.squads = [];

        /**
         * The start and end dates of the tournament
         * @type {Object}
         */
        this.dates = {};

        /**
         * If the dates are provisional
         * @type {boolean}
         */
        this.provisional = false;

        /**
         * The description of the tournament
         * @type {String}
         */
        this.label = "";

        /**
         * The match types in this tournaments
         * @type {Object}
         */
        this.matchesByType = {};

        /**
         * Whether the touranment is upcoming, in progress or complete
         * Similar response as a {@link MatchState}
         * @type {String}
         */
        this.state = undefined;

        this.matchList = new cricket.SimpleMatchList();

        /**
         * @deprecated
         * Gets a tournament objects and saves its properties as the properties
         * of this tournament object (i.e., this.tournamentName)
         * @param {Object} data - Any tournament metadata that would need to be set
         */
        this.setMetadata = function( data ) {
            for ( var d in data ) {
                _self[ d ] = data[ d ];
            }
        };

        /**
         * Gets a tournament objects and saves its required properties as the properties
         * of this tournament object (i.e., this.description)
         * @param {Object} data - Any tournament data that would need to be set
         */
        this.setData = function( data ) {

            if (!data) {
                return;
            }

            var dates = {
                startDate: data.startDate,
                endDate: data.endDate,
                provisionalStartDate: data.provisionalStartDate,
                provisionalEndDate: data.provisionalEndDate
            };

            this.dates = dates;

            if (data.description) {
                this.label = data.description;
            }

            if (data.matchesByType) {
                this.matchesByType = data.matchesByType;
            }

            if (data.hostTeam) {
                this.hostTeam = data.hostTeam;
            }

            if (data.provisional) {
                this.provisional = data.provisional;
            }

        };

        /**
         * Setter for the schedule data object; will process the matches to add into state arrays
         * @param {Array<ScheduleEntry>} data - The schedule data array of schedule entries (matches)
         */
        this.setScheduleData = function( data ) {
            if( data && data.length ) {
                _self.matchList.addScheduleEntries( data, _self.id );
                _self.state = getStateFromScheduleData();
            }
        };

        /**
         * Determine if it has schedule data
         * @return {Boolean} - True if has schedule data, False otherwise.
         */
        this.hasScheduleData = function() {
            return _self.matchList.getMatchCount() > 0;
        };

        /**
         * Determine if it has standings data
         * @return {Boolean} - True if has standings data, False otherwise.
         */
        this.hasStandingsData = function() {
            /**
             * @todo Implement this!
             */
        };

        /**
         * Gets the tournament state (pre-tournament means all matches upcoming, post means all
         * matches complete, live means anything in between)
         * @return {String} - Based on match status ("U" for upcoming, "C" for complete, "L" for live)
         */
        this.getState = function() {
            return _self.state;

            // var matchesNumber = _self.matchList.getMatchCount();
            // if( matchesNumber > 0 ) {
            //     if( matchesNumber === _self.matchList.stateArrays.upcoming.length ) {
            //         return "U";
            //     }

            //     match = _self.scheduleData[ matchesNumber - 1 ];
            //     if( matchesNumber === _self.matchList.stateArrays.complete.length ) {
            //         return "C";
            //     }

            //     return "L";
            // }
            // else if( _self.hasStandingsData() ) {
                // var groupStage = _self.standingsData[ 0 ];
                // if( groupStage && groupStage.standings[ 0 ].played === 0 ) {
                //     return "U";
                // }

                // var knockoutStage = _self.standingsData[ 1 ];
                // if( knockoutStage && knockoutStage.standings ) {
                //     var total = 0;
                //     for( var i = 0, iLimit = knockoutStage.standings.length; i < iLimit; i++ ) {
                //         var standing = knockoutStage.standings[i];
                //         total += standing.played;
                //     }

                //     if( total === 8 ) {
                //         return "C";
                //     }
                // }

                // return "L";
            // }
        };

        var getStateFromScheduleData = function() {
            var matchesNumber = _self.matchList.getMatchCount();
            if( matchesNumber > 0 ) {
                if( matchesNumber === _self.matchList.getMatches( { filters: { matchStates: [ 'U' ] } } ).length ) {
                    return "U";
                }
                if( matchesNumber === _self.matchList.getMatches( { filters: { matchStates: [ 'C' ] } } ).length ) {
                    return "C";
                }

                return "L";
            }
        };
    };


    /**
     * Used to access subscription constants
     * @readonly
     * @enum {String}
     */
    cricket.Tournament.MATCH_STATE_LABEL = {
        UPCOMING: 'U',
        LIVE: 'L',
        COMPLETE: 'C'
    };
}( PULSE.core, PULSE.cricket ) );

( function( UDS, cricket ) {

    "use strict";

    /**
     * Class to encapsulate a ball progress.
     *
     * @class BallProgress
     * @memberof cricket.UDS
     * @param {Object} rawBp - The raw bp
     */
    UDS.BallProgress = function ( rawBp ) {
        var fields = rawBp.split( '.' );
        this.innings = fields[0];
        this.over = fields[1];

        if ( fields.length > 2 ) {
            this.ball = fields[2];
        }
    };

    /**
     * BP utility that confirms whether a string is of the correct format or not
     * BPs are of {innings}.{over}.{ball} format
     *
     * @param  {String} raw - The raw BP string
     * @return {Boolean}    - Whether the BP string matches the required format or not
     */
    UDS.BallProgress.matches = function ( raw ) {
        return !cricket.utils.isNullish( raw ) && raw.match( /\d+\.\d+\.\d+/ ) !== null;
    };

    /**
     * Generates a BP string
     *
     * @return {String} - The BP string
     */
    UDS.BallProgress.prototype.description = function () {
        return this.innings + '.' + this.over + '.' + this.ball;
    };

    UDS.BallProgress.prototype.compareTo = function ( rawBp ) {
        var other = new UDS.BallProgress( rawBp );

        var compare = +this.innings - +other.innings;
        if ( compare === 0 ) {
            compare = +this.over - +other.over;
            if ( compare === 0 ) {
                compare = +this.ball - +other.ball;
            }
        }

        return compare;
    };

}( PULSE.cricket.UDS, PULSE.cricket ) );

( function( UDS, cricket ) {

    "use strict";

    /**
     * Data type for a cricket ball trajectory. Parsers up-stream handle parsing from the various
     * different source formats.
     */
    UDS.CricketBallTrajectory = function() {};

    /**
     * Gets the ball position at a particular time.
     */
    UDS.CricketBallTrajectory.prototype.getPositionAtTime = function ( t ) {
        var time = t - this.bt;

        if ( time > 0 ) {
            return { x: this.getX( this.bp.x, this.obv.x, this.oba.x, time ),
                     y: this.getYorZ( this.bp.y, this.obv.y, this.oba.y, time ),
                     z: this.getYorZ( this.bh, this.obv.z, this.oba.z, time ) };
        }
        else {
            return { x: this.getX( this.bp.x, this.ebv.x, this.a.x, time ),
                     y: this.getYorZ( this.bp.y, this.ebv.y, this.a.y, time ),
                     z: this.getYorZ( this.bh, this.ebv.z, this.a.z, time ) };
        }
    };

    /**
     * Gets the time at a particular X position.
     */
    UDS.CricketBallTrajectory.prototype.getTimeAtX = function ( x ) {
        if ( this.bp.x > x ) {
            return Math.log( ( ( x - this.bp.x ) * ( this.oba.x / this.obv.x ) ) + 1 ) / this.oba.x;
        }
        else {
            return Math.log( ( ( x - this.bp.x ) * ( this.a.x / this.ebv.x ) ) + 1 ) / this.a.x;
        }
    };

    /**
     * Gets the x value at a specific time.
     */
    UDS.CricketBallTrajectory.prototype.getX = function ( x, vx, ax, t ) {
        return x - ( vx * ( ( 1 - Math.exp( ax * t ) ) / ax ) );
    };

    /**
     * Gets the y or z values at a specific time.
     */
    UDS.CricketBallTrajectory.prototype.getYorZ = function ( pos, velocity, accel, t ) {
        return pos + ( velocity * t ) + ( ( accel * t * t ) / 2 );
    };

}( PULSE.cricket.UDS, PULSE.cricket ) );

( function( UDS, cricket ) {

    "use strict";

    /**
     * Interpret raw data into slightly less raw data
     */
    var parseRawData = function( data ) {

        var bowlerSpeeds = {};
        var countingBallDelta = 0;

        var response = { statsData: {} };

        var tData = data.data;
        for ( var i = 0; i < tData.length; i++ ) {
            var obj = tData[i];
            for ( var key in obj ) {
                var record = new UDS.StatsRecord( key, obj[ key ], cricket.utils.createPlayerLookup( [] ) );
                response.statsData[key] = record;

                var ballNum = +record.get( UDS.CricketField.BALL );
                if ( ballNum === 1 ) {
                    // First ball, so reset the countingBallDelta
                    countingBallDelta = 0;
                }

                // Set the counting ball
                record.countingBall = ballNum - countingBallDelta;

                // Update delta
                if ( !record.get( UDS.CricketField.IS_COUNTING ) ) {
                    countingBallDelta++;
                }

                // We also need to record the first valid bowl speed for each bowler, so we
                // can tell whether they are a spin or seam bowler; it might be better to store
                // the average rather that the first one?!
                var bowler = record.get( UDS.CricketField.BOWLER );
                if ( !cricket.utils.isNullish( bowler ) && bowlerSpeeds[bowler] === undefined ) {
                    var speed = record.get( UDS.CricketField.BOWL_SPEED );
                    if ( !cricket.utils.isNullish( speed ) ) {
                        var s = +speed;
                        if ( s > 13 ) {
                            bowlerSpeeds[bowler] = s < 32 ? UDS.BowlerSpeed.SPIN :
                                                            UDS.BowlerSpeed.SEAM;
                        }
                    }
                }

                var innings = record.get( UDS.CricketField.INNINGS );
                if ( innings > response.highestInnings ) {
                    response.highestInnings = innings;
                }
            }
        }
        response.latestTraj = data.latest;

        return response;
    };

    /**
     *  Get filtered data
     */
     var filterData = function( data, filter ) {
        var derived = [];
        var rawSize = 0;

        for( var key in data.statsData ) {
            if( data.statsData.hasOwnProperty( key ) ) {
                var item = data.statsData[ key ];

                if( item.get( UDS.CricketField.BATSMAN ) ) {
                    rawSize++;
                    // Check for filter compliance
                    if( item.satisfiesFilter( filter ) ) {
                        derived.push( item );
                    }
                }
            }
        }

        return derived;
    };

    /**
     * Processes UDS data for partnership information
     *
     * @class      PartnershipsProcessor
     * @memberof   cricket.UDS
     * @param      {Object}  data     The data
     * @param      {Object}  filters  The filters
     * @return     {Array}   - The p'ships in the given dataset
     */
    UDS.PartnershipsProcessor = function( data, filters ) {

        var response = parseRawData( data );
        response = filterData( response, filters || {} );

        var statsArray = [];
        var stats = {};
        var y = 0;

        for (var i = 0, j = response.length; i < j; i++) {
            var row = response[i];

            var facing = row.get( UDS.CricketField.BATSMAN );
            var nonfacing = row.get( UDS.CricketField.NF_BATSMAN );

            if ( cricket.utils.isNullish( facing ) || cricket.utils.isNullish( nonfacing ) ) {
                continue;
            }

            if ( ( facing !== stats.b1name && facing !== stats.b2name ) ||
                ( nonfacing !== stats.b1name && nonfacing !== stats.b2name ) ) {
                stats = {};
                statsArray.push( stats );

                if ( nonfacing === stats.b1name ) {
                    stats.b1name = nonfacing;
                    stats.b2name = facing;
                }
                else {
                    stats.b1name = facing;
                    stats.b2name = nonfacing;
                }

                stats.b1runs = 0;
                stats.b2runs = 0;
                stats.b1balls = 0;
                stats.b2balls = 0;
                stats.pruns = 0;
            }

            var credit = +row.get( UDS.CricketField.CREDIT );
            if ( stats.b1name === facing ) {
                stats.b1runs += credit;
                stats.b1balls++;
            }
            else {
                stats.b2runs += credit;
                stats.b2balls++;
            }

            stats.pruns += ( +row.get( UDS.CricketField.RUNS ) );
        }

        return statsArray;

    };


}( PULSE.cricket.UDS, PULSE.cricket ) );

( function( UDS ) {

    "use strict";

    /**
     * Speed mode controller
     *
     * @memberof   cricket.UDS
     */
    UDS.SpeedModeController = {

        // MPH to KMH convertion unit
        MPH_TO_KMH : 1.609,
        // M/S to Km/h
        MPS_TO_KMH : 3.6,

        // Available modes
        MODE_MPH : 'mph',
        MODE_KMH : 'kmh',

        MPH_UNIT : 'mph',
        KMH_UNIT : 'km/h',

        // Current mode and unit
        mode : 'mph',
        unit : 'mph',

        setMode : function( mode ) {
            this.mode = mode;
            this.unit = mode === this.MODE_KMH ? this.KMH_UNIT : this.MPH_UNIT;
        },

        // Converts miles per hour to kilometers per hour
        mphToKmh : function( mph ) {
            return mph * this.MPH_TO_KMH;
        },

        // Converts metres per sec to kilometers per hour
        mpsToKmh : function( mps ) {
            return mps * this.MPS_TO_KMH;
        }
    };

}( PULSE.cricket.UDS ) );

( function ( UDS, cricket ) {

    "use strict";

    /**
     * Wrapper for a record from a UDS file.
     *
     * @class StatsRecord
     * @memberof cricket.UDS
     * @param {Object}  rawBp        - The raw bp
     * @param {Object}  rawData      - The raw data
     * @param {Object}  playerLookup - The player lookup
     */
    UDS.StatsRecord = function ( rawBp, rawData, playerLookup ) {
        this.fields = rawData.split( ',' );
        this.bp = new UDS.BallProgress( rawBp );
        this.traj = null;
        this.playerLookup = playerLookup;
    };

    /**
     * Returns true if this record satisfies the given filter.
     */
    UDS.StatsRecord.prototype.satisfiesFilter = function ( filter ) {
        if ( filter === undefined ) {
            return true;
        }
        else {
            // Check innings, over and ball, allowing for All
            var inn = cricket.utils.isNullish( filter.innings ) ||
                      UDS.CricketFilter.ALL === filter.innings ||
                      this.get( UDS.CricketField.INNINGS ) == filter.innings.toString(); // Coerce!

            var over = cricket.utils.isNullish( filter.over ) ||
                       UDS.CricketFilter.ALL === filter.over ||
                       this.get( UDS.CricketField.OVER ) == filter.over; // Coerce!

            var ball = cricket.utils.isNullish( filter.ball ) ||
                       UDS.CricketFilter.ALL === filter.ball ||
                       UDS.CricketFilter.ALLBALLS === filter.ball ||
                       this.get( UDS.CricketField.BALL ) == filter.ball; // Coerce!

            if ( inn && over && ball ) {
                // Check batsman
                var lh = this.get( UDS.CricketField.HANDEDNESS ) === UDS.Handedness.LEFT;
                var ba = cricket.utils.isNullish( filter.batsman ) ||
                         UDS.CricketFilter.ALL === filter.batsman ||
                         UDS.CricketFilter.ALLBATSMEN === filter.batsman ||
                         ( !lh && UDS.CricketFilter.RIGHTHANDERS === filter.batsman ) ||
                         (  lh && UDS.CricketFilter.LEFTHANDERS === filter.batsman ) ||
                         this.get( UDS.CricketField.BATSMAN ) === filter.batsman;

                // Check bowler
                var spin = this.get( UDS.CricketField.BOWLER_SPEED ) === UDS.BowlerSpeed.SPIN;
                var bo = cricket.utils.isNullish( filter.bowler ) ||
                         UDS.CricketFilter.ALL === filter.bowler ||
                         UDS.CricketFilter.ALLBOWLERS === filter.bowler ||
                         (  spin && UDS.CricketFilter.SPINBOWLERS === filter.bowler ) ||
                         ( !spin && UDS.CricketFilter.SEAMBOWLERS === filter.bowler ) ||
                         this.get( UDS.CricketField.BOWLER ) === filter.bowler;

                return ba && bo;
            }

            return false;
        }
    };

    /**
     * Obtains a field (column) from this record.
     */
    UDS.StatsRecord.prototype.get = function ( field ) {
        switch ( field ) {
            case UDS.CricketField.ID:
                return this.bp.description();

            case UDS.CricketField.INNINGS:
                return this.bp.innings;

            case UDS.CricketField.OVER:
                return this.bp.over;

            case UDS.CricketField.BALL:
                return this.bp.ball;

            case UDS.CricketField.COUNTING_BALL:
                return this.countingBall;

            case UDS.CricketField.IS_COUNTING:
                var et = this.fields[10];
                return ( et.length === 0 || 'Lb' === et || 'B' === et );

            case UDS.CricketField.BATSMAN:
                return this.fields[1];

            case UDS.CricketField.NF_BATSMAN:
                return this.fields[2];

            case UDS.CricketField.BOWLER:
                return this.fields[3];

            case UDS.CricketField.BOWL_SPEED:
                return Number( this.fields[4] );

            case UDS.CricketField.DISMISSED:
                return this.fields[5];

            case UDS.CricketField.IS_WICKET:
                return this.fields[5] !== "-1";

            case UDS.CricketField.MOD:
                return this.fields[6];

            case UDS.CricketField.RUNS:
                if ( this.fields[7].length > 0 ) {
                    return this.fields[7];
                }
                else {
                    return 0;
                }

            case UDS.CricketField.CREDIT:
                /*if ( this.fields[8] === "0" ) {
                    return this.get( UDS.CricketField.RUNS );
                }
                else {*/
                    return this.fields[8];
                //}

            case UDS.CricketField.DEBIT:
                /*if ( this.fields[9] === "0" ) {
                    return this.get( UDS.CricketField.RUNS );
                }
                else {*/
                    return this.fields[9];
                //}

            case UDS.CricketField.EXTRA_TYPE:
                return this.fields[10];

            case UDS.CricketField.HAS_HANDEDNESS:
                return this.fields[11].length > 0;

            case UDS.CricketField.HANDEDNESS:
                return this.fields[11] === 'y' ? UDS.Handedness.RIGHT : UDS.Handedness.LEFT;

            case UDS.CricketField.PITCHED:
                if ( this.fields[12].length === 0 ) {
                    return undefined;
                }
                return { x:this.fields[12], y:this.fields[13], z:0 };

            case UDS.CricketField.STUMPS:
                if ( this.fields[14].length === 0 ) {
                    return undefined;
                }
                return { x:0, y:this.fields[14], z:this.fields[15] };

            case UDS.CricketField.WW:
                if ( cricket.utils.isNullish( this.fields[16] ) || cricket.utils.isNullish( this.fields[17] ) ) {
                    return undefined;
                }
                else {
                    return UDS.StatsRecord.covertWWToCoaching( this.fields[16], this.fields[17] );
                }

            case UDS.CricketField.WIN_LIKELIHOODS:
                if ( cricket.utils.isNullish( this.fields[18] ) ) {
                    return undefined;
                }
                else {
                    return [ +this.fields[18], +this.fields[19], +this.fields[20] ];
                }
        }
    };

    /**
     * Returns true if the traj field is non-nullish.
     */
    UDS.StatsRecord.prototype.hasTrajData = function () {
        return false;
    };

    /**
     * Gets a runs/wicket summary for this record.
     */
    UDS.StatsRecord.prototype.generateSummary = function ( lowercase ) {
        var summary = '';
        if ( this.get( UDS.CricketField.IS_WICKET ) ) {
            summary += lowercase ? 'wicket ' : 'Wicket ';
        }

        var runs = +this.get( UDS.CricketField.RUNS );
        if ( runs > 0 ) {
            summary += runs + ' run';
            if ( runs > 1 ) {
                summary += 's';
            }

            var et = this.get( UDS.CricketField.EXTRA_TYPE );
            if ( et.length > 0 ) {
                summary += ' (' + ( lowercase ? et.toLowerCase() : et ) + ')';
            }
        }
        return summary;
    };

    /**
     * Obtains a commentary-style description of this record.
     */
    UDS.StatsRecord.prototype.generateDescription = function () {
        var description = '<b>';

        description += ( +this.get( UDS.CricketField.OVER ) - 1 );
        description += '.';
        description += this.get( UDS.CricketField.COUNTING_BALL );
        description += '</b> ';

        var bowler = this.playerLookup[ this.get( UDS.CricketField.BOWLER ) ];
        description += bowler.fullName;
        description += ' to ';
        var batsman = this.playerLookup[ this.get( UDS.CricketField.BATSMAN ) ];
        description += batsman.fullName;

        // Add ball speed to description
        var speed = this.get( UDS.CricketField.BOWL_SPEED );
        if ( !isNaN( speed ) && speed >= 13 && speed <= 54 ) {
            description += ', ';
            if ( SpeedModeController.mode === SpeedModeController.MODE_KMH ) {
                speed = SpeedModeController.mpsToKmh( speed );
            }

            description += speed.toFixed( 1 );
            description += ' ' + SpeedModeController.unit;
        }

        // Add runs scored to description
        var credit = +this.get( UDS.CricketField.CREDIT );

        description += ', ';
        if ( this.get( UDS.CricketField.IS_WICKET ) ) {
            description += 'wicket';
        }
        else {
            if ( credit === 0 ) {
                description += 'dot ball';
            }
            else {
                description += credit;
                description += ' run';
                if ( credit > 1 ) {
                    description += 's';
                }
            }
        }

        // Add description of where the ball went
        var ps = this.get( UDS.CricketField.PITCH_SEGMENT );
        if ( !cricket.utils.isNullish( ps ) && !this.get( UDS.CricketField.IS_WICKET ) && credit > 0 ) {
            description += ', hit ';
            description += CricketSegmentLookup[ ps ];
        }

        // Finish the sentence
        description += '.';

        return description;
    };

    /**
     * Parses the trajectory data given.
     */
    UDS.StatsRecord.parseTrajectory = function ( encoded ) {
        // Raw string is a Base64 encoded stream
        var decoded = Base64Decoder.decode( encoded );

        if ( decoded.length < 72 ) {
            return undefined;
        }

        // Extract coefficients into a trajectory object
        var traj = new CricketBallTrajectory();
        try {
            traj.bp   = UDS.StatsRecord.readMulti( decoded, 0, 2 );
            traj.bt   = UDS.StatsRecord.readMulti( decoded, 8, 1 ).x;
            traj.a    = UDS.StatsRecord.readMulti( decoded, 12, 3 );
            traj.ebv  = UDS.StatsRecord.readMulti( decoded, 24, 3 );
            traj.obv  = UDS.StatsRecord.readMulti( decoded, 36, 3 );
            traj.oba  = UDS.StatsRecord.readMulti( decoded, 48, 3 );
            traj.bh   = UDS.StatsRecord.readMulti( decoded, 60, 1 ).x;
            //traj.pred = parseBoolean( decoded.substring( 64, 65 ) );
            //traj.xpos = this.readMulti( decoded, 65, 1 ).x;
            //traj.end = ?
            //traj.trackApproved = parseInt( decoded.substring( 71, 72 ) ) === 1;
            // TODO
            traj.trackApproved = true;

            // Calculate the period
            var start = traj.getTimeAtX( 18.5 ) + traj.bt;
            var end = traj.getTimeAtX( 0 ) + traj.bt;
            traj.period = { start: start, end: end };
        }
        catch ( exception ) {
            traj.trackApproved = false;
        }

        return traj;
    };

    /**
     * Utility method to read multiple floats from the given data stream.
     */
    UDS.StatsRecord.readMulti = function ( data, offset, n ) {
        var ret = {};

        if ( n > 0 ) {
            ret.x = UdsStatsRecord.decodeFloat( data.substring( offset, offset + 4 ) );
        }
        if ( n > 1 ) {
            ret.y = UdsStatsRecord.decodeFloat( data.substring( offset + 4, offset + 8 ) );
        }
        if ( n > 2 ) {
            ret.z = UdsStatsRecord.decodeFloat( data.substring( offset + 8, offset + 12 ) );
        }

        return ret;
    };

    /**
     * Decode an IEE754 float.
     */
    UDS.StatsRecord.decodeFloat = function ( data ) {
        var sign = ( data.charCodeAt( 0 ) & 0x80 ) >> 7;
        var exponent = ( ( data.charCodeAt( 0 ) & 0x7F ) << 1 ) + ( data.charCodeAt( 1 ) >> 7 );

        var significand = 0.0;
        var bit = 23;
        var component = 1.0;
        var b;
        var mask;

        while ( bit >= 0 ) {
            if ( bit === 23 ) {
                b = ( data.charCodeAt( 1 ) & 0x7F ) | 0x80;
                mask = 0x80;
            }
            else if ( bit === 15 ) {
                b = data.charCodeAt( 2 );
                mask = 0x80;
            }
            else if ( bit === 7 ) {
                b = data.charCodeAt( 3 );
                mask = 0x80;
            }

            if ( ( mask & b ) === mask ) {
                significand += component;
            }

            component /= 2;
            mask = mask >> 1;
            bit--;
        }

        return Math.pow( -1, sign ) *
               Math.pow( 2, exponent - 127 ) *
               significand;
    };

    UDS.StatsRecord.covertWWToCoaching = function ( wwX, wwY ) {
        var scaleX = 4.05;
        var scaleY = 3.45;
        var offsetX = -130.33;
        var offsetY = -163.64;
        //{ x:this.fields[16], y:this.fields[17] }

        return { x: ( ( wwY * scaleX ) + offsetX ), y : ( ( wwX * scaleY ) + offsetY ) };
    };

})( PULSE.cricket.UDS, PULSE.cricket );

( function( cricket, UDS ) {

    "use strict";
    /**
     * Wrapper for a record from a UDS file.
     */
    UDS.TrajRecord = function ( rawBp, rawData, playerLookup ) {
    	this.fields = rawData.split( ',' );
    	this.bp = new UDS.BallProgress( rawBp );
    	this.traj = null;
    	this.playerLookup = playerLookup;
    };

    /**
     * Returns true if this record satisfies the given filter.
     */
    UDS.TrajRecord.prototype.satisfiesFilter = function ( filter ) {
    	if ( filter === undefined ) {
    		return true;
    	}
    	else {
    		// First check a *.*.All match on the over filter
    /*		if ( filter.over !== undefined && filter.over.match( /[0-9]+\.[0-9]+\.All/ ) !== null ) {
    			var sample = filter.over.replace( /All/, '0' );
    			var sampleBp = new UDS.BallProgress( sample );

    			return ( this.bp.innings === sampleBp.innings &&
    					 this.bp.over === sampleBp.over );
    		}
    */
    		// Check innings, over and ball, allowing for All
    		var inn = cricket.utils.isNullish( filter.innings ) ||
    				  UDS.CricketFilter.ALL === filter.innings ||
    				  this.get( UDS.CricketField.INNINGS ) == filter.innings.toString(); // Coerce!

    		var over = cricket.utils.isNullish( filter.over ) ||
    		   		   UDS.CricketFilter.ALL === filter.over ||
    		   		   this.get( UDS.CricketField.OVER ) == filter.over; // Coerce!

    		var ball = cricket.utils.isNullish( filter.ball ) ||
    		   		   UDS.CricketFilter.ALL === filter.ball ||
    		   		   UDS.CricketFilter.ALLBALLS === filter.ball ||
    		   		   this.get( UDS.CricketField.BALL ) == filter.ball; // Coerce!

    		if ( inn && over && ball ) {
    			// Check batsman
    	    	var lh = this.get( UDS.CricketField.HANDEDNESS ) === CricketHandedness.LEFT;
    			var ba = cricket.utils.isNullish( filter.batsman ) ||
    					 UDS.CricketFilter.ALL === filter.batsman ||
    					 UDS.CricketFilter.ALLBATSMEN === filter.batsman ||
    					 ( !lh && UDS.CricketFilter.RIGHTHANDERS === filter.batsman ) ||
    					 (  lh && UDS.CricketFilter.LEFTHANDERS === filter.batsman ) ||
    					 this.get( UDS.CricketField.BATSMAN ) === filter.batsman;

    			// Check bowler
    			var spin = this.get( UDS.CricketField.BOWLER_SPEED ) === CricketBowlerSpeed.SPIN;
    			var bo = cricket.utils.isNullish( filter.bowler ) ||
    					 UDS.CricketFilter.ALL === filter.bowler ||
    					 UDS.CricketFilter.ALLBOWLERS === filter.bowler ||
    					 (  spin && UDS.CricketFilter.SPINBOWLERS === filter.bowler ) ||
    					 ( !spin && UDS.CricketFilter.SEAMBOWLERS === filter.bowler ) ||
    					 this.get( UDS.CricketField.BOWLER ) === filter.bowler;

    			return ba && bo;
    	    }

        	return false;
    	}
    };

    /**
     * Obtains a field (column) from this record.
     */
    UDS.TrajRecord.prototype.get = function ( field ) {
    	switch ( field ) {
    		case UDS.CricketField.ID:
    			return this.bp.description();

    		case UDS.CricketField.INNINGS:
    			return this.bp.innings;

    		case UDS.CricketField.OVER:
    			return this.bp.over;

    		case UDS.CricketField.BALL:
    			return this.bp.ball;

    		case UDS.CricketField.COUNTING_BALL:
    			return this.countingBall;

    		case UDS.CricketField.IS_COUNTING:
    			var et = this.fields[9];
    			return ( et.length === 0 || 'Lb' === et || 'B' === et );

    		case UDS.CricketField.BATSMAN:
    			return this.fields[1];

    		case UDS.CricketField.NF_BATSMAN:
    			return this.fields[2];

    		case UDS.CricketField.BOWLER:
    			return this.fields[3];

    		case UDS.CricketField.BOWL_SPEED:
    			return Number( this.fields[4] );

    		case UDS.CricketField.DISMISSED:
    			return this.fields[5];

    		case UDS.CricketField.IS_WICKET:
    			return this.fields[5] !== "-1";

    		case UDS.CricketField.MOD:
    			return this.fields[6];

    		case UDS.CricketField.RUNS:
    			if ( this.fields[7].length > 0 ) {
    				return this.fields[7];
    			}
    			else {
    				return 0;
    			}

    		case UDS.CricketField.CREDIT:
    			/*if ( this.fields[8] === "0" ) {
    				return this.get( UDS.CricketField.RUNS );
    			}
    			else {*/
    				return this.fields[8];
    			//}

    		case UDS.CricketField.EXTRA_TYPE:
    			return this.fields[9];

    		case UDS.CricketField.TRAJECTORY:
    			if ( this.traj === null ) {
    				this.traj = UDS.TrajRecord.parseTrajectory( this.fields[10] );
    			}
    			return this.traj;
    	}
    };

    /**
     * Returns true if the traj field is non-nullish.
     */
    UDS.TrajRecord.prototype.hasTrajData = function () {
    	return !cricket.utils.isNullish( this.fields[10] );
    };

    /**
     * Gets a runs/wicket summary for this record.
     */
    UDS.TrajRecord.prototype.generateSummary = function ( lowercase ) {
    	var summary = '';
    	if ( this.get( UDS.CricketField.IS_WICKET ) ) {
    		summary += lowercase ? 'wicket ' : 'Wicket ';
    	}

    	var runs = +this.get( UDS.CricketField.RUNS );
    	if ( runs > 0 ) {
    		summary += runs + ' run';
    		if ( runs > 1 ) {
    			summary += 's';
    		}

    		var et = this.get( UDS.CricketField.EXTRA_TYPE );
    		if ( et.length > 0 ) {
    			summary += ' (' + ( lowercase ? et.toLowerCase() : et ) + ')';
    		}
    	}
    	return summary;
    }

    /**
     * Obtains a commentary-style description of this record.
     */
    UDS.TrajRecord.prototype.generateDescription = function () {
    	var description = '<b>';

    	description += ( +this.get( UDS.CricketField.OVER ) - 1 );
    	description += '.';
    	description += this.get( UDS.CricketField.COUNTING_BALL );
    	description += '</b> ';

        var bowler = this.playerLookup[ this.get( UDS.CricketField.BOWLER ) ];
        description += bowler.fullName;
        description += ' to ';
        var batsman = this.playerLookup[ this.get( UDS.CricketField.BATSMAN ) ];
        description += batsman.fullName;

        // Add ball speed to description
        var speed = this.get( UDS.CricketField.BOWL_SPEED );
        if ( !isNaN( speed ) && speed >= 13 && speed <= 54 )
        {
            description += ', ';
            if ( UDS.SpeedModeController.mode === UDS.SpeedModeController.MODE_KMH )
            {
            	speed = UDS.SpeedModeController.mpsToKmh( speed );
            }

            description += speed.toFixed( 1 );
            description += ' ' + UDS.SpeedModeController.unit;
        }

        // Add runs scored to description
    	var credit = +this.get( UDS.CricketField.CREDIT );

        description += ', ';
        if ( this.get( UDS.CricketField.IS_WICKET ) )
        {
            description += 'wicket';
        }
        else
        {
        	if ( credit === 0 )
    	    {
    	        description += 'dot ball';
    	    }
    	    else
    	    {
    	        description += credit;
    	        description += ' run';
    	        if ( credit > 1 )
    	        {
    	            description += 's';
    	        }
    	    }
        }

        // Add description of where the ball went
        var ps = this.get( UDS.CricketField.PITCH_SEGMENT );
        if ( !cricket.utils.isNullish( ps ) && !this.get( UDS.CricketField.IS_WICKET ) && credit > 0 )
        {
        	description += ', hit ';
        	description += CricketSegmentLookup[ ps ];
        }

        // Finish the sentence
        description += '.';

        return description;
    };

    /**
     * Parses the trajectory data given.
     */
    UDS.TrajRecord.parseTrajectory = function ( encoded ) {
    	// Raw string is a Base64 encoded stream
    	var decoded = cricket.utils.base64Decoder.decode( encoded );

    	if ( decoded.length < 72 ) {
    		// PULSE.Tracer.warn( 'Decoded traj length was ' + decoded.length );
    		return undefined;
    	}

        // Extract coefficients into a trajectory object
    	var traj = new UDS.CricketBallTrajectory();
    	try {
    		traj.bp   = UDS.TrajRecord.readMulti( decoded, 0, 2 );
    		traj.bt   = UDS.TrajRecord.readMulti( decoded, 8, 1 ).x;
    		traj.a 	  = UDS.TrajRecord.readMulti( decoded, 12, 3 );
    		traj.ebv  = UDS.TrajRecord.readMulti( decoded, 24, 3 );
    		traj.obv  = UDS.TrajRecord.readMulti( decoded, 36, 3 );
    		traj.oba  = UDS.TrajRecord.readMulti( decoded, 48, 3 );
    		traj.bh   = UDS.TrajRecord.readMulti( decoded, 60, 1 ).x;
    		//traj.pred = parseBoolean( decoded.substring( 64, 65 ) );
    		//traj.xpos = this.readMulti( decoded, 65, 1 ).x;
    		//traj.end = ?
    		//traj.trackApproved = parseInt( decoded.substring( 71, 72 ) ) === 1;
    		// TODO
    		traj.trackApproved = true;

    		// Calculate the period
    	    var start = traj.getTimeAtX( 18.5 ) + traj.bt;
    	    var end = traj.getTimeAtX( 0 ) + traj.bt;
    	    traj.period = { start: start, end: end };
    	}
    	catch ( exception ) {
    		// PULSE.Tracer.error( exception );
    		traj.trackApproved = false;
    	}

    	return traj;
    };

    /**
     * Utility method to read multiple floats from the given data stream.
     */
    UDS.TrajRecord.readMulti = function ( data, offset, n ) {
    	var ret = {};

    	if ( n > 0 ) {
    		ret.x = UDS.TrajRecord.decodeFloat( data.substring( offset, offset + 4 ) );
    	}
    	if ( n > 1 ) {
    		ret.y = UDS.TrajRecord.decodeFloat( data.substring( offset + 4, offset + 8 ) );
    	}
    	if ( n > 2 ) {
    		ret.z = UDS.TrajRecord.decodeFloat( data.substring( offset + 8, offset + 12 ) );
    	}

    	return ret;
    };

    /**
     * Decode an IEE754 float.
     */
    UDS.TrajRecord.decodeFloat = function ( data ) {
        var sign = ( data.charCodeAt( 0 ) & 0x80 ) >> 7;
        var exponent = ( ( data.charCodeAt( 0 ) & 0x7F ) << 1 ) + ( data.charCodeAt( 1 ) >> 7 );

        var significand = 0.0;
        var bit = 23;
        var component = 1.0;
        var b;
        var mask;

        while ( bit >= 0 )
        {
            if ( bit === 23 )
            {
                b = ( data.charCodeAt( 1 ) & 0x7F ) | 0x80;
                mask = 0x80;
            }
            else if ( bit === 15 )
            {
                b = data.charCodeAt( 2 );
                mask = 0x80;
            }
            else if ( bit === 7 )
            {
                b = data.charCodeAt( 3 );
                mask = 0x80;
            }

    	    if ( ( mask & b ) === mask )
    	    {
    	        significand += component;
    	    }

    	    component /= 2;
    	    mask = mask >> 1;
    	    bit--;
        }

        return Math.pow( -1, sign ) *
               Math.pow( 2, exponent - 127 ) *
               significand;
    };
}( PULSE.cricket, PULSE.cricket.UDS ) );

( function( UDS ) {

    "use strict";

    /**
     * The Cricket Hawkeye Record field 'enum'.
     * type       {Object}
     * @memberof  cricket.UDS
     *//* istanbul ignore next */
    UDS.CricketField = {
        BATSMAN         : 0,
        BOWLER          : 1,
        INNINGS         : 2,
        OVER            : 3,
        BALL            : 4,
        ID              : 5,
        WW              : 6,
        RUNS            : 7,
        CREDIT          : 8,
        DEBIT           : 9,
        PITCHED         : 10,
        IS_WICKET       : 11,
        STUMPS          : 12,
        TRAJECTORY      : 13,
        BOWL_SPEED      : 14,
        HAS_HANDEDNESS  : 15,
        HANDEDNESS      : 16,
        IS_COUNTING     : 17,
        DISMISSED       : 18,
        NF_BATSMAN      : 19,
        WIN_LIKELIHOODS : 20,
        BOWLER_SPEED    : 21,
        PITCH_SEGMENT   : 22,
        COUNTING_BALL   : 23,
        EXTRA_TYPE      : 24
    };

    /**
     * Bowling style enum. UDS will infer this from speed, and only the first two are supported.
     * The values map directly to the HEDB enum.
     * type       {Object}
     * @memberof  cricket.UDS
     *//* istanbul ignore next */
    UDS.BowlerSpeed = { SPIN: 0, SEAM: 1, BOTH: 2, MEDIUM: 3, NOBOWL: 4 };

    /**
     * Batsman handedness enum. Maps directly to HEDB enum.
     * type       {Object}
     * @memberof  cricket.UDS
     *//* istanbul ignore next */
    UDS.Handedness = { LEFT: 0, RIGHT: 1 };

    /**
     * Constants that have special meaning in the filtering of data.
     * type       {Object}
     * @memberof  cricket.UDS
     *//* istanbul ignore next */
    UDS.CricketFilter = {
        ALL          : 'All',
        LEFTHANDERS  : 'Left-handers',
        RIGHTHANDERS : 'Right-handers',
        SPINBOWLERS  : 'Spin bowlers',
        SEAMBOWLERS  : 'Seam bowlers',
        WATCHLIVE    : 'Watch live',
        ALLINOVER    : 'All in over',
        ALLBOWLERS   : 'All Bowlers',
        ALLBALLS     : 'All Balls',
        ALLBATSMEN   : 'All Batsmen'
    };

}( PULSE.cricket.UDS ) );

( function( cricket, core ) {

    "use strict";

    cricket.APIUrlFactory = ( function() {

        var instance;

        /**
         * URL factory for JSON API responses
         * @class APIUrlFactory
         * @param {Object} config - The environment's configuration
         */
        var APIUrlFactory = function( config ) {
            var _self = this;
            var environment = core.object.extend( {}, config || {} );
            if( !environment.apiPath ) {
                console.warn( 'initialised APIUrlFactory without an API Path!!' );
            }

            var getMatchRoot = function( matchId ) {
                if( typeof matchId !== 'undefined' ) {
                    var mid = matchId instanceof cricket.MatchId ? matchId.getId() : matchId;
                    return environment.apiPath + '/fixtures/' + mid;
                }
            };

            var applyProtocol = function( url, protocol ) {
                if( protocol === 'https' ) {
                    return 'https' + url;
                }
                else if( protocol === 'http' ) {
                    return 'http' + url;
                }
                else {
                    return url;
                }
            };

            this.getFixtureUrl = function( matchId, protocol ) {
                var matchRoot = getMatchRoot( matchId );
                if( matchRoot ) {
                    return applyProtocol( matchRoot, protocol );
                }
            };

            this.getMatchScoringUrl = function( matchId, protocol ) {
                return _self.getFixtureUrl( matchId, protocol ) + '/scoring';
            };

            this.getMatchUDSMetaUrl = function( matchId, protocol ) {
                return _self.getFixtureUrl( matchId, protocol ) + '/uds';
            };

            this.getMatchUDSStatsUrl = function( matchId, paginationInfo, protocol ) {
                var url = _self.getFixtureUrl( matchId, protocol ) + '/uds/stats';
                if( paginationInfo ) {
                    url += core.url.buildQueryString( paginationInfo, true );
                }
                return url;
            };

            this.getMatchUDSTrajUrl = function( matchId, paginationInfo, protocol ) {
                var url = _self.getFixtureUrl( matchId, protocol ) + '/uds/traj';
                if( paginationInfo ) {
                    url += core.url.buildQueryString( paginationInfo, true );
                }
                return url;
            };

            this.getMatchScheduleUrl = function( tournamentId, protocol ) {
                var url = environment.apiPath + '/fixtures?tournamentIds=' + tournamentId;
                return applyProtocol( url, protocol );
            };

            this.getMatchListUrl = function( apiFilter, protocol ) {
                var url = environment.apiPath + '/fixtures';
                if( apiFilter ) {
                    url += core.url.buildQueryString( apiFilter.getFilter(), true );
                }
                return applyProtocol( url, protocol );
            };

            this.getMatchListMetaUrl = function( apiFilter, protocol ) {
                var url = applyProtocol( environment.apiPath + '/fixtures/meta', protocol );
                if( apiFilter ) {
                    url += core.url.buildQueryString( apiFilter.getFilter(), true );
                }
                return url;
            };

            this.getTournamentListUrl = function( apiFilter, protocol ) {
                var url = environment.apiPath + '/tournaments';
                if( apiFilter ) {
                    url += core.url.buildQueryString( apiFilter.getFilter(), true );
                }
                return applyProtocol( url, protocol );
            };

            this.getGroupStandingsUrl = function( apiFilter, protocol ) {
                var url = environment.apiPath + '/standings';
                if( apiFilter ) {
                    url += core.url.buildQueryString( apiFilter, true );
                }
                return applyProtocol( url, protocol );
            };

            this.getSquadsUrl = function( tournamentId, protocol ) {
                var url = environment.apiPath + '/tournament/' + tournamentId + '/squads';
                if( apiFilter ) {
                    url += core.url.buildQueryString( apiFilter, true );
                }
                return applyProtocol( url, protocol );
            };

            this.getRankedPlayerStatsUrl = function( metricName, apiFilter, protocol ) {

                var url = environment.apiPath + 'stats/ranked/players/' + metricName;

                if( apiFilter ) {
                    url += core.url.buildQueryString( apiFilter, true );
                }
                return applyProtocol( url, protocol );
            };

        };

        return {
            getInstance: function( config ) {
                if( !instance ) {
                    instance = new APIUrlFactory( config );
                }
                return instance;
            }
        };
    }() );

}( PULSE.cricket, PULSE.core ) );

( function( cricket, core ) {

    "use strict";

    cricket.DMSUrlFactory = ( function() {

        var instance;

        /**
         * URL factory for DMS-generated JSONP files hosted on the CDN or calls to the MSAPI
         * @class DMSUrlFactory
         * @param {Object} config - The environments configuration
         */
        var DMSUrlFactory = function( config ) {
            var environments = {
                cdn: {
                    dev: '//dynamic.pulselive.com/test/data/core/cricket/',
                    test: '//dynamic.pulselive.com/test/data/core/cricket/',
                    stage: '//dynamic.pulselive.com/dynamic/data/core/cricket/',
                    prod: '//dynamic.pulselive.com/dynamic/data/core/cricket/'
                },
                msapi: {
                    dev: 'http://msapitest.pulselive.com/msapi/',
                    test: 'http://msapitest.pulselive.com/msapi/',
                    stage: 'http://msapi.pulselive.com/msapi/',
                    prod: 'http://msapi.pulselive.com/msapi/'
                }
            };

            if( config && config.environments ) {
                core.object.extend( environments, config.environments );
            }

            var getTournamentRoot = function( tournamentId, env ) {
                if( typeof tournamentId !== 'undefined' ) {
                    var tName = tournamentId instanceof cricket.TournamentId ? tournamentId.getName() : tournamentId;
                    return environments.cdn[ env ] + '2012/' + tName + '/';
                }
            };

            var getMatchRoot = function( tournamentId, matchId, env ) {
                if( typeof tournamentId !== 'undefined' && typeof matchId !== 'undefined' ) {
                    var mName = matchId instanceof cricket.MatchId ? matchId.getName() : matchId;
                    return getTournamentRoot( tournamentId, env ) + mName + '/';
                }
            };

            var applyProtocol = function( url, protocol ) {
                if( protocol === 'https' ) {
                    return 'https' + url;
                }
                else if( protocol === 'http' ) {
                    return 'http' + url;
                }
                else {
                    return url;
                }
            };

            this.getMatchScoringUrl = function( matchId, tournamentId, env, protocol ) {
                var matchRoot = getMatchRoot( tournamentId, matchId, env );
                if( matchRoot ) {
                    return applyProtocol( matchRoot + 'scoring.js', protocol );
                }
            };

            this.getMatchScheduleUrl = function( tournamentId, env, protocol ) {
                var tournamentRoot = getTournamentRoot( tournamentId, env );
                if( tournamentRoot ) {
                    return applyProtocol( tournamentRoot + 'matchSchedule2.js', protocol );
                }
            };

            this.getGroupStandingsUrl = function( tournamentId, env, protocol ) {
                var tournamentRoot = getTournamentRoot( tournamentId, env );
                if( tournamentRoot ) {
                    return applyProtocol( tournamentRoot + 'groupStandings.js', protocol );
                }
            };

            this.getSquadsUrl = function( tournamentId, env, protocol ) {
                var tournamentRoot = getTournamentRoot( tournamentId, env );
                if( tournamentRoot ) {
                    return applyProtocol( tournamentRoot + 'squads.js', protocol );
                }
            };

            this.getMatchListUrl = function( msapiConfig, env ) {
                if( msapiConfig ) {
                    var urlRoot = environments.msapi[ env ] + 'data';
                    return urlRoot + core.url.buildQueryString( msapiConfig.getFilter(), true );
                }
            };

            this.getMatchListMetaUrl = function( msapiConfig, env ) {
                if( msapiConfig ) {
                    var urlRoot = environments.msapi[ env ] + 'meta';
                    return urlRoot + core.url.buildQueryString( msapiConfig.getFilter(), true );
                }
            };
        };

        return {
            getInstance: function( config ) {
                if( !instance ) {
                    instance = new DMSUrlFactory( config );
                }
                return instance;
            }
        };
    }() );

}( PULSE.cricket, PULSE.core ) );

;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

//! moment.js
//! version : 2.11.2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')$', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')$', 'i');
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             if (this.isValid() && other.isValid()) {
                 return other < this ? this : other;
             } else {
                 return valid__createInvalid();
             }
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this > +localInput;
        } else {
            return +localInput < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this < +localInput;
        } else {
            return +this.clone().endOf(units) < +localInput;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return +this === +localInput;
        } else {
            inputMs = +localInput;
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // JSON.stringify(new Date(NaN)) === 'null'
        return this.isValid() ? this.toISOString() : 'null';
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        // console.log("got", weekYear, week, weekday, "set", date.toISOString());
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = local__createLocal([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = getSet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = getSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto._months           = defaultLocaleMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto._monthsRegex      = defaultMonthsRegex;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.11.2';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result â€” either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisherâ€“Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

//  Import support https://stackoverflow.com/questions/13673346/supporting-both-commonjs-and-amd
(function(name, definition) {
    if (typeof module !== "undefined") { module.exports = definition(); }
    else if (typeof define === "function" && typeof define.amd === "object") { define(definition); }
    else { this[name] = definition(); }
}("clipboard", function() {
  if (typeof document === 'undefined' || !document.addEventListener) {
    return null;
  }

  var clipboard = {};

  clipboard.copy = (function() {
    var _intercept = false;
    var _data = null; // Map from data type (e.g. "text/html") to value.
    var _bogusSelection = false;

    function cleanup() {
      _intercept = false;
      _data = null;
      if (_bogusSelection) {
        window.getSelection().removeAllRanges();
      }
      _bogusSelection = false;
    }

    document.addEventListener("copy", function(e) {
      if (_intercept) {
        for (var key in _data) {
          e.clipboardData.setData(key, _data[key]);
        }
        e.preventDefault();
      }
    });

    // Workaround for Safari: https://bugs.webkit.org/show_bug.cgi?id=156529
    function bogusSelect() {
      var sel = document.getSelection();
      // If "nothing" is selected...
      if (!document.queryCommandEnabled("copy") && sel.isCollapsed) {
        // ... temporarily select the entire body.
        //
        // We select the entire body because:
        // - it's guaranteed to exist,
        // - it works (unlike, say, document.head, or phantom element that is
        //   not inserted into the DOM),
        // - it doesn't seem to flicker (due to the synchronous copy event), and
        // - it avoids modifying the DOM (can trigger mutation observers).
        //
        // Because we can't do proper feature detection (we already checked
        // document.queryCommandEnabled("copy") , which actually gives a false
        // negative for Blink when nothing is selected) and UA sniffing is not
        // reliable (a lot of UA strings contain "Safari"), this will also
        // happen for some browsers other than Safari. :-()
        var range = document.createRange();
        range.selectNodeContents(document.body);
        sel.removeAllRanges();
        sel.addRange(range);
        _bogusSelection = true;
      }
    };

    return function(data) {
      return new Promise(function(resolve, reject) {
        _intercept = true;
        if (typeof data === "string") {
          _data = {"text/plain": data};
        } else if (data instanceof Node) {
          _data = {"text/html": new XMLSerializer().serializeToString(data)};
        } else {
          _data = data;
        }

        function triggerCopy(tryBogusSelect) {
          try {
            if (document.execCommand("copy")) {
              // document.execCommand is synchronous: http://www.w3.org/TR/2015/WD-clipboard-apis-20150421/#integration-with-rich-text-editing-apis
              // So we can call resolve() back here.
              cleanup();
              resolve();
            }
            else {
              if (!tryBogusSelect) {
                bogusSelect();
                triggerCopy(true);
              } else {
                throw new Error("Unable to copy. Perhaps it's not available in your browser?");
              }
            }
          } catch (e) {
            cleanup();
            reject(e);
          }
        }
        triggerCopy(false);

      });
    };
  })();

  clipboard.paste = (function() {
    var _intercept = false;
    var _resolve;
    var _dataType;

    document.addEventListener("paste", function(e) {
      if (_intercept) {
        _intercept = false;
        e.preventDefault();
        var resolve = _resolve;
        _resolve = null;
        resolve(e.clipboardData.getData(_dataType));
      }
    });

    return function(dataType) {
      return new Promise(function(resolve, reject) {
        _intercept = true;
        _resolve = resolve;
        _dataType = dataType || "text/plain";
        try {
          if (!document.execCommand("paste")) {
            _intercept = false;
            reject(new Error("Unable to paste. Pasting only works in Internet Explorer at the moment."));
          }
        } catch (e) {
          _intercept = false;
          reject(new Error(e));
        }
      });
    };
  })();

  // Handle IE behaviour.
  if (typeof ClipboardEvent === "undefined" &&
      typeof window.clipboardData !== "undefined" &&
      typeof window.clipboardData.setData !== "undefined") {

    /*! promise-polyfill 2.0.1 */
    (function(a){function b(a,b){return function(){a.apply(b,arguments)}}function c(a){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof a)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],i(a,b(e,this),b(f,this))}function d(a){var b=this;return null===this._state?void this._deferreds.push(a):void j(function(){var c=b._state?a.onFulfilled:a.onRejected;if(null===c)return void(b._state?a.resolve:a.reject)(b._value);var d;try{d=c(b._value)}catch(e){return void a.reject(e)}a.resolve(d)})}function e(a){try{if(a===this)throw new TypeError("A promise cannot be resolved with itself.");if(a&&("object"==typeof a||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void i(b(c,a),b(e,this),b(f,this))}this._state=!0,this._value=a,g.call(this)}catch(d){f.call(this,d)}}function f(a){this._state=!1,this._value=a,g.call(this)}function g(){for(var a=0,b=this._deferreds.length;b>a;a++)d.call(this,this._deferreds[a]);this._deferreds=null}function h(a,b,c,d){this.onFulfilled="function"==typeof a?a:null,this.onRejected="function"==typeof b?b:null,this.resolve=c,this.reject=d}function i(a,b,c){var d=!1;try{a(function(a){d||(d=!0,b(a))},function(a){d||(d=!0,c(a))})}catch(e){if(d)return;d=!0,c(e)}}var j=c.immediateFn||"function"==typeof setImmediate&&setImmediate||function(a){setTimeout(a,1)},k=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};c.prototype["catch"]=function(a){return this.then(null,a)},c.prototype.then=function(a,b){var e=this;return new c(function(c,f){d.call(e,new h(a,b,c,f))})},c.all=function(){var a=Array.prototype.slice.call(1===arguments.length&&k(arguments[0])?arguments[0]:arguments);return new c(function(b,c){function d(f,g){try{if(g&&("object"==typeof g||"function"==typeof g)){var h=g.then;if("function"==typeof h)return void h.call(g,function(a){d(f,a)},c)}a[f]=g,0===--e&&b(a)}catch(i){c(i)}}if(0===a.length)return b([]);for(var e=a.length,f=0;f<a.length;f++)d(f,a[f])})},c.resolve=function(a){return a&&"object"==typeof a&&a.constructor===c?a:new c(function(b){b(a)})},c.reject=function(a){return new c(function(b,c){c(a)})},c.race=function(a){return new c(function(b,c){for(var d=0,e=a.length;e>d;d++)a[d].then(b,c)})},"undefined"!=typeof module&&module.exports?module.exports=c:a.Promise||(a.Promise=c)})(this);

    clipboard.copy = function(data) {
      return new Promise(function(resolve, reject) {
        // IE supports string and URL types: https://msdn.microsoft.com/en-us/library/ms536744(v=vs.85).aspx
        // We only support the string type for now.
        if (typeof data !== "string" && !("text/plain" in data)) {
          throw new Error("You must provide a text/plain type.");
        }

        var strData = (typeof data === "string" ? data : data["text/plain"]);
        var copySucceeded = window.clipboardData.setData("Text", strData);
        if (copySucceeded) {
          resolve();
        } else {
          reject(new Error("Copying was rejected."));
        }
      });
    };

    clipboard.paste = function() {
      return new Promise(function(resolve, reject) {
        var strData = window.clipboardData.getData("Text");
        if (strData) {
          resolve(strData);
        } else {
          // The user rejected the paste request.
          reject(new Error("Pasting was rejected."));
        }
      });
    };
  }

  return clipboard;
}));

!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.7 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent);
                if (svg) {
                    var src = use.getAttribute("xlink:href") || use.getAttribute("href");
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});
