/*globals PULSE, PULSE.app */

(function (app) {
    "use strict";

    app.templates = {};
    app.common = {};
    app.defaultLanguage = "EN";
    app.googleMapsKey = "AIzaSyCXdb302utTvJrluU8cxRf1jeqjyXuxJMU";

    app.paths = [
        {
            label: "local",
            domain: "localhost",
            cdn: "//dev-icc.pulselive.com/resources/",
            canary: "https://api.canary.platform.pulselive.com/dev/",
            api: "//api.dev.platform.pulselive.com",
            cricket: "//cricketapi.dev.platform.pulselive.com",
            cms: "//api.dev.platform.pulselive.com/content/icc",
            tournamentGroupId: 5198
        },
        {
            label: "local-webgen",
            domain: "local.icc.com",
            cdn: "//dev-icc.pulselive.com/resources/",
            canary: "https://api.canary.platform.pulselive.com/dev/",
            api: "//api.dev.platform.pulselive.com",
            cricket: "//cricketapi.dev.platform.pulselive.com",
            cms: "//api.dev.platform.pulselive.com/content/icc",
            tournamentGroupId: 5198
        },
        {
            label: "development",
            domain: "dev-icc.pulselive.com",
            cdn: "/resources/ver/",
            canary: "https://api.canary.platform.pulselive.com/dev/",
            api: "//api.dev.platform.pulselive.com",
            cricket: "//cricketapi.dev.platform.pulselive.com",
            // cricket: "//cricketapi-ecb.pulselive.com",
            cms: "//api.dev.platform.pulselive.com/content/icc",
            cmsSearch: "//api.dev.platform.pulselive.com/search/icc",
            playerImagePath: "http://icc-corp-2013-live.s3.amazonaws.com/players/",
            tournamentGroupId: 5198,
            pollQuestions : 'https://dynamic.pulselive.com/dynamic/data/icctest',
            pollAnswer: 'https://canary2.pulselive.com/poll/vote'
        },
        {
            label: "development",
            domain: "dev-icc-about.pulselive.com",
            cdn: "/resources/ver/",
            canary: "https://api.canary.platform.pulselive.com/dev/",
            api: "//api.dev.platform.pulselive.com",
            cricket: "//cricketapi.dev.platform.pulselive.com",
            //cricket: "//cricketapi-ecb.pulselive.com",
            cms: "//api.dev.platform.pulselive.com/content/icc",
            cmsSearch: "//api.dev.platform.pulselive.com/search/icc",
            tournamentGroupId: 5198
        },
        {
            label: "test",
            domain: "test-icc.pulselive.com",
            cdn: "/resources/ver/",
            canary: "https://api.canary.platform.pulselive.com/test/",
            api: "//api.test.platform.pulselive.com",
            cricket: "//cricketapi.test.platform.pulselive.com",
            cms: "//api.test.platform.pulselive.com/content/icc",
            cmsSearch: "//api.test.platform.pulselive.com/search/icc",
            tournamentGroupId: 5198,
            pollQuestions : 'https://dynamic.pulselive.com/dynamic/data/icctest',
            pollAnswer: 'https://canary2.pulselive.com/poll/vote'
        },
        {
            label: "test",
            domain: "test-icc-about.pulselive.com",
            cdn: "/resources/ver/",
            canary: "https://api.canary.platform.pulselive.com/test/",
            api: "//api.test.platform.pulselive.com",
            cricket: "//cricketapi.test.platform.pulselive.com",
            cms: "//api.test.platform.pulselive.com/content/icc",
            cmsSearch: "//api.test.platform.pulselive.com/search/icc",
            tournamentGroupId: 5198
        },
        {
            label: "staging",
            domain: "stage-icc.pulselive.com",
            cdn: "/resources/ver/",
            canary: "https://api.canary.platform.pulselive.com/production/",
            api: "//content-icc.pulselive.com",
            cricket: "//cricketapi-icc.pulselive.com",
            cms: "//content-icc.pulselive.com/content/icc",
            cmsSearch: "//content-icc.pulselive.com/search/icc",
            tournamentGroupId: 5198,
            pollQuestions : 'https://dynamic.pulselive.com/dynamic/data/icc',
            pollAnswer: 'https://canary2.pulselive.com/poll/vote'
        },
        {
            label: "production",
            domain: "www.icc-cricket.com",
            cdn: "/resources/ver/",
            canary: "https://api.canary.platform.pulselive.com/production/",
            api: "//content-icc.pulselive.com",
            cricket: "//cricketapi-icc.pulselive.com",
            cms: "//content-icc.pulselive.com/content/icc",
            cmsSearch: "//content-icc.pulselive.com/search/icc",
            tournamentGroupId: 5198,
            pollQuestions : 'https://dynamic.pulselive.com/dynamic/data/icc',
            pollAnswer: 'https://canary2.pulselive.com/poll/vote'
        }
    ];

    app.checkEnvironment = function () {

        var location = window.location.hostname;
        var environment;

        app.paths.map(function (path) {
            if (location === path.domain) {
                environment = path;
            }
        });

        return environment || "There are no app.paths defined for this domain";

    };

    app.environment = app.checkEnvironment();

    app.apiPath = {
        'players': {
            // Lists all players in the system
            'all': app.environment.cricket + '/players',
            // Get details of a specific player
            'single': app.environment.cricket + '/players/{id}',
            // Lists players ranked by rating based on given matchType and role
            'ranked': app.environment.cricket + '/icc-ratings/ranked/players/{matchType}/{role}'
        },
        'fixtures': {
            'all': app.environment.cricket + '/fixtures',
            'single': app.environment.cricket + '/fixtures/{id}',
            'meta': app.environment.cricket + '/fixtures/meta'
        },
        'cms': {
            'playlist': app.environment.cms + '/playlist/en/',
            'text': app.environment.cms + '/text/en/',
            'photo': app.environment.cms + '/photo/en/',
            'video': app.environment.cms + '/video/en/',
            'audio': app.environment.cms + '/audio/en/',
            'document': app.environment.cms + '/document/en/',
            'promo': app.environment.cms + '/promo/en/',
            'bio': app.environment.cms + '/bios/en/'
        }
    };

    app.formats = ["TEST", "ODI", "T20I", "T20", "LIST_A", "FIRST_CLASS"];
    app.teams = {
        womens: [
            {
                id: 24,
                fullName: "Sri Lanka Women",
                shortName: "Sri Lanka "
            },
            {
                id: 25,
                fullName: "South Africa Women",
                shortName: "South Africa "
            },
            {
                id: 26,
                fullName: "New Zealand Women",
                shortName: "New Zealand"
            },
            {
                id: 27,
                fullName: "West Indies Women",
                shortName: "West Indies "
            },
            {
                id: 28,
                fullName: "England Women",
                shortName: "England"
            },
            {
                id: 29,
                fullName: "Pakistan Women",
                shortName: "Pakistan "
            },
            {
                id: 30,
                fullName: "Australia Women",
                shortName: "Australia"
            },
            {
                id: 31,
                fullName: "India Women",
                shortName: "India "
            },
            {
                id: 162,
                fullName: "Ireland Women",
                shortName: "Ireland "
            },
            {
                id: 163,
                fullName: "Japan Women",
                shortName: "Japan"
            },
            {
                id: 164,
                fullName: "Netherlands Women",
                shortName: "Netherlands"
            },
            {
                id: 165,
                fullName: "Zimbabwe Women",
                shortName: "Zimbabwe"
            },
            {
                id: 166,
                fullName: "Thailand Women",
                shortName: "Thailand"
            },
            {
                id: 167,
                fullName: "Canada Women",
                shortName: "Canada"
            },
            {
                id: 170,
                fullName: "Bangladesh Women",
                shortName: "Bangladesh"
            },
            {
                id: 346,
                fullName: "INDIA Blue Women",
                shortName: "INDIA Blue"
            },
            {
                id: 347,
                fullName: "INDIA Red Women",
                shortName: "INDIA Red"
            },
            {
                id: 430,
                fullName: "Papua New Guinea Women",
                shortName: "Papua New Guinea"
            },
            {
                id: 431,
                fullName: "China Women",
                shortName: "China"
            },
            {
                id: 432,
                fullName: "Scotland Women",
                shortName: "Scotland"
            },
            {
                id: 449,
                fullName: "Samoa Women",
                shortName: "Samoa"
            },
            {
                id: 450,
                fullName: "Hong Kong Women",
                shortName: "Hong Kong"
            },
            {
                id: 451,
                fullName: "Nepal Women",
                shortName: "Nepal"
            }
        ],
        mens: [
            {
                id: 11,
                fullName: "England",
                shortName: "England"
            },
            {
                id: 13,
                fullName: "Sri Lanka",
                shortName: "Sri Lanka"
            },
            {
                id: 14,
                fullName: "India",
                shortName: "India"
            },
            {
                id: 15,
                fullName: "Australia",
                shortName: "Australia"
            },
            {
                id: 16,
                fullName: "New Zealand",
                shortName: "New Zealand"
            },
            {
                id: 18,
                fullName: "Zimbabwe",
                shortName: "Zimbabwe"
            },
            {
                id: 19,
                fullName: "South Africa",
                shortName: "South Africa"
            },
            {
                id: 20,
                fullName: "Pakistan",
                shortName: "Pakistan"
            },
            {
                id: 21,
                fullName: "West Indies",
                shortName: "West Indies"
            },
            {
                id: 22,
                fullName: "Bangladesh",
                shortName: "Bangladesh"
            },
            {
                id: 17,
                fullName: "Afghanistan",
                shortName: "Afghanistan"
            },
            {
                id: 128,
                fullName: "Oman",
                shortName: "Oman"
            },
            {
                id: 12,
                fullName: "Ireland",
                shortName: "Ireland"
            },
            {
                id: 65,
                fullName: "Bermuda",
                shortName: "Bermuda"
            },
            {
                id: 66,
                fullName: "Canada",
                shortName: "Canada"
            },
            {
                id: 67,
                fullName: "Kenya",
                shortName: "Kenya"
            },
            {
                id: 68,
                fullName: "Netherlands",
                shortName: "Netherlands"
            },
            {
                id: 69,
                fullName: "Scotland",
                shortName: "Scotland"
            },
            {
                id: 91,
                fullName: "Denmark",
                shortName: "Denmark"
            },
            {
                id: 102,
                fullName: "Guernsey",
                shortName: "Guernsey"
            },
            {
                id: 103,
                fullName: "Hong Kong",
                shortName: "Hong Kong"
            },
            {
                id: 109,
                fullName: "Italy",
                shortName: "Italy"
            },
            {
                id: 111,
                fullName: "Jersey",
                shortName: "Jersey"
            },
            {
                id: 124,
                fullName: "Namibia",
                shortName: "Namibia"
            },
            {
                id: 125,
                fullName: "Nepal",
                shortName: "Nepal"
            },
            {
                id: 126,
                fullName: "Nigeria",
                shortName: "Nigeria"
            },
            {
                id: 133,
                fullName: "Papua New Guinea",
                shortName: "PNG"
            },
            {
                id: 150,
                fullName: "Tanzania",
                shortName: "Tanzania"
            },
            {
                id: 155,
                fullName: "United Arab Emirates",
                shortName: "UAE"
            },
            {
                id: 156,
                fullName: "Uganda",
                shortName: "Uganda"
            },
            {
                id: 158,
                fullName: "Vanuatu",
                shortName: "Vanuatu"
            }
        ]
    };

} (PULSE.app));

(function( app, core ){
	"use strict";

	/**
	 * @namespace app.defaultData.private
	 */
	
	var defaultData;

	// expiry set in days
	var dataExpiry = 1;

	/**
	 * Map teams data response to structured model
	 * @param  {Array} teams Array of team groups to be modelled
	 * @return {Object} Teams object containing separate Arrays of teams ( all, full, affiliate, associate, womens )
	 */
	var modelTeams = function( teams ){


		/** 
		 * Model object for teams to be mapped to - labels must match grouping labels in teams data
		 * @type {Object}
		 */
		var model = {
			all: {
				label: 'All',
				teams: []
			},
			full: {
				label: 'Full Members',
				teams: []
			},
			affiliate: {
				label: 'Affiliate Members',
				teams: []
			},
			associate: {
				label: 'Associate Members',
				teams: []
			},
			womens: {
				label: 'Womens',
				teams: []
			}
		};

		teams.forEach( function( type ) {

			var target = false;

			switch( type.label ){
				case model.full.label:
					target = model.full.teams;
					break;
				case model.affiliate.label:
					target = model.affiliate.teams;
					break;
				case model.womens.label:
					target = model.womens.teams;
					break;	
				case model.associate.label:
					target = model.associate.teams;
			}

			if( target ){
				type.members.forEach( function( member ){
					if( model.all.teams.indexOf( member ) === -1 ){
						model.all.teams.push( member );
					}
					if( target.indexOf( member ) === -1 ){
						target.push( member );
					}		
				} );
			}
		} );

		return model;
	};


	/**
	 * Function to request new Cricket Meta data based on the app.environment.tournamentGroupId
	 * defaultData is set on retrieval of data
	 */
	var getData = function(){
		var setDefaultData = function( data ) {
			defaultData = {
				teams: modelTeams( data.teams ),
				venues: data.venues, // Should be modelled as required
				tournaments: data.tournaments // Should be modelled as required
			};
		};

        var cricketSubscriber = {
			url: app.apiPath.fixtures.meta + "?tournamentGroupIds=" + app.environment.tournamentGroupId,
			target: this,
			method: "GET",
			callback: setDefaultData,
			constant: true,
			forceCallback: true
		};

		core.data.manager.add( cricketSubscriber );
	}; 

	/**
	 * Check for existing defaultICCData in local storage
	 * If it doesn't exist make a new request
	 * @param  {Function} callback Function to return data response to
	 */
	var checkData = function( callback ) {
		var stored = core.localStorage.getStorage("defaultICCData");
		//var stored = false;
		if( stored ){
			defaultData = JSON.parse(stored);
			callback( defaultData );
		}
		else{
			getData();
			var checkForData = setInterval(function(){
				if( defaultData ){
					callback( defaultData );
					clearInterval(checkForData);
					core.localStorage.setStorage( "defaultICCData", JSON.stringify(defaultData), dataExpiry );
				}
			}, 500);
		}
	};

	/**
	 * Public app.defaultData object providing methods to get constatnt ICC data
	 * @type {Object}
	 */
	app.defaultData = {
		/**
		 * get data from app.defaultData
		 * should be called whenever defaultData is required app.defaultData.get( callback )
		 * @param  {Function} callback Function to return data response to
		 */
		get: function( callback ){
			if( !callback ){
				return "ERROR defaultData.js - No callback method provided to pass default data to.";
			}
			if(defaultData){
				callback( defaultData );
			}
			else{
				checkData( callback );
			}
		}
	};


}( PULSE.app, PULSE.core ));
/*globals PULSE, PULSE.app, PULSE.core */


(function( app, core ){
	"use strict";

	app.I18N = {};

	app.I18N.setup = function(){
		var req_language = core.utils.getStorage( 'req_language', true );
	    app.language = req_language || app.defaultLanguage;
	    var Translator = new app.I18N.Translator( PULSE.I18N );

	    if (!PULSE.I18N) { PULSE.I18N = {}; }
	    PULSE.I18N.lookup = function()
	    {
	        return Translator.lookup.apply( Translator, arguments );
	    };
	    if( typeof window.moment !== 'undefined' )
	    {
	        app.I18N.enOverride();
	        moment.locale( app.language );
	    }
	};

	app.I18N.enOverride = function() {
	    moment.locale( 'en',
	    {
	        longDateFormat : {
	            LT: "HH:mm",
	            // LT: "h:mm A",
	            LTS: "h:mm:ss A",
	            l : 'DD/MM',
	            L: "DD/MM/YYYY",
	            ll: 'D MMMM',
	            LL: "D MMMM YYYY",
	            lll: "MMM D YYYY LT",
	            LLL: "MMMM Do YYYY LT",
	            llll: "ddd MMM D YYYY",
	            LLLL: "dddd, MMMM Do YYYY"
	        },
	        yearFirst: false
	    } );
	};


	app.I18N.Translator = function( translationsData )
	{
		var _self = this;

	    _self.hasTranslations = false;
	    _self.language = app.language;

	    if( translationsData )
	    {
	        _self.hasTranslations = true;
	        if( _self.language !== translationsData.language )
	        {
	            if( translationsData.language === undefined )
	            console.log( 'Language mismatch! Using ' + translationsData.language );
	            _self.language = translationsData.language;
	        }

	        _self.translations = translationsData.translations || {};
	        _self.hasTranslations = true;
	    }
	    else
	    {
	        _self.hasTranslations = false;
	        _self.translations = {};
	    }
	};

	app.I18N.Translator.prototype.lookup = function( key, replaceMap )
	{
		var _self = this;
	    if( key )
	    {
	        var mapping = _self.lookupKey( key );
	        if( replaceMap )
	        {
	            for( var replaceKey in replaceMap )
	            {
	                var regExp = new RegExp( "\\${" + replaceKey + "}", "gi" );
	                mapping = mapping.replace( regExp, replaceMap[ replaceKey ] );
	            }
	        }

	        return mapping;
	    }

	    return "";
	};

	app.I18N.Translator.prototype.lookupKey = function( key )
	{
		var _self = this;
	    if( _self.hasTranslations )
	    {
	        return _self.translations[ key ] || key;
	    }
	    else
	    {
	        return key;
	    }
	};


}( PULSE.app, PULSE.core ));
( function( app ){

    "use strict";

    /**
     * Map of media query size labels to screen widths
     * Mirrors what's in src/styles/layout/_mq.scss so the JS & CSS use the same values
     */
    app.measurements = {
        mobile: 400,
        phablet: 640,
        tablet: 840,
        desktop: 1025,
        wide: 1300
    };

}( PULSE.app ) );

( function( app, core, common, cricket ) {

    "use strict";

    app.common.templating = {};

    /**
     *  get generic date
     * @param {string} date
     * @return {string}
     */
    var getDateNice = function( date ) {
        var momentDate = moment( date ).utc();

        return momentDate.format("DD MMM YY");
    };

    app.common.templating.scoreToString = function( inningsSummaries ) {
        return inningsSummaries.map( function( summary ) {
            return cricket.utils.getInningsScore( summary.runs, summary.wkts, summary.allOut, summary.declared );
        } ).join( ' & ' );
    };

    /**
     * image utils template helper functions
     *
     */
    var imageUtils = {

        /**
         * get variant by tag
         * @param {array} variants
         * @param {string} tag
         */
        getVariantByTag: function( variants, tag ) {
            var output = false;
            if ( variants.length > 0 ) {
                variants.forEach( function( item, index ) {
                    if ( item.tag && item.tag !== null ) {
                        if ( item.tag.label !== null && item.tag.label === tag ) {
                            output = item.url;
                        }
                    }
                });
            }
            return output;
        }
    };

    /**
     * content has tag function
     * @param {array} tags
     */
    var contentHasTag = function( tags, searchTag ) {
        var hasTag = false;
        if ( tags.length > 0 ) {
            tags.forEach( function( item, key ) {
                if ( item.label !== undefined && item.label == searchTag ) {
                    hasTag = true;
                }
            });
        }
        return hasTag;
    };

    /**
     * date age helper function
     * @param {string} date - expects date as string
     * @return {string}
     */
    var dateAge = function( date ) {

        var output = '';

        if ( date !== '' ) {
            date = moment( core.date.parseString( date ) ).utc();

            var diff = moment().format('x') - date;

            var dateAge = 'old';
            if ( diff < 86400000 ) {
                dateAge = 'new';
            }

            var current, hours, mins, hoursLabel, minsLabel;
            current = diff;
            hours = Math.floor( current / (60 * 60 * 1000) );
            mins = Math.round( (current / (60 * 1000)) % 60 );

            // output difference of current date and published date
            if ( hours > 0 ) {
                hoursLabel = hours === 1 ? 'hr' : 'hrs';
                output = '<strong>' + hours + '</strong> ' + hoursLabel + ' ';
            }
            minsLabel = mins === 1 ? 'min' : 'mins';
            output += '<strong>' + mins + '</strong> ' + minsLabel + ' ago';

            // if date is old override output
            if ( dateAge === 'old' ) {
                output = getDateNice( new Date( date ) );
            }

            return output;
        }
        return ''; // return nothing in false case
    };

    /**
     * Parses an HTML string to an actual element
     *
     * @param {String} htmlString - HTML string you want to parse to an HTML element
     */
    var stringToElement = function( htmlString ) {

        var d = document.createElement( 'div' );
        d.innerHTML = htmlString.trim();
        return d.firstChild;
    };

    var scoreToString = function( inningsSummaries ) {
        return inningsSummaries.map( function( summary ) {
            return cricket.utils.getInningsScore( summary.runs, summary.wkts, summary.allOut, summary.declared );
        } ).join( ' & ' );
    };

    var getFormattedDate = function( match, timezone, dateFormat ) {
        var date = match.getDate();
        if( date ) {
            var momentDate = moment( date );
            switch( timezone ) {
                case 'BST':
                    return momentDate.utc().add( 1, 'hours' ).format( dateFormat );
                case 'local':
                    return moment( date ).utc().add( match.timezoneOffset, 'hours' ).format( dateFormat );
                // case 'GMT':
                default:
                    return momentDate.utc().format( dateFormat );

            }
        }
        return '';
    };

    var buildDescription = function() {
        var description = '';
        if( arguments && arguments.length ) {
            description = Array.prototype.filter.call( arguments, function( arg ) {
                return typeof arg !== 'undefined' && arg;
            } ).join( ', ' );
        }
        return description;
    };

    var getVenueString = function( venue ) {
        var venueString = 'TBC';
        if( venue && venue.fullName !== 'TBC' ) {
            venueString = venue.shortName || venue.fullName;
            if( venue.city ) {
                venueString += ', ' + venue.city;
            }
        }
        return venueString;
    };

    var getMatchTypeLabel = function( matchType ) {
        switch( matchType ) {
            case 'TEST':
                return 'Test';
            case 'FIRST_CLASS':
                return 'First Class';
            case 'LIST_A':
                return 'List A';
            case 'ODI':
                return 'ODI';
            case 'T20':
                return 'T20';
            case 'T20I':
                return 'T20I';
            case 'WODI':
                return 'ODI';
            case 'WT20':
                return 'T20';
            case 'WT20I':
                return 'T20I';
            default:
                return matchType;
        }
    };

    /**
     * Can only be used with Scoring Publication data, returns a user-friendly string for the
     * description of the innings (e.g., "England 1st Innings")
     * @param  {cricket.Match} match - the match
     * @param  {Number} inningsIndex - the index of the innings
     * @return {String}              - the user-facing string
     */
    var getInningsLabel = function( match, inningsIndex ) {
        if( match && match.getBattingOrder().length ) {
            inningsIndex = inningsIndex > -1 ? inningsIndex : ( match.currentState.currentInningsIndex || 0 );
            var team = match.getTeam( match.getBattingOrder()[ inningsIndex ] );
            if( match.isLimitedOvers() ) {
                return ( team.shortName || team.fullName ) + ' Innings';
            }
            else {
                var inningsOrdinal = inningsIndex > 1 ? ' 2nd ' : ' 1st ';
                return ( team.shortName || team.fullName ) + inningsOrdinal + 'Innings';
            }
        }
        return '';
    };

    var getPlayerHeadshotUrl = function( playerId, matchType, extension, size ) {

        extension = extension || 'png';
        size = size || '480x480';

        switch( matchType ) {
            case 'TEST':
                return "https://icc-resources.s3.amazonaws.com/player-photos/test/" + size + "/" + playerId + "." + extension;
            case 'ODI':
                return "https://icc-resources.s3.amazonaws.com/player-photos/odi/" + size + "/" + playerId + "." + extension;
            case 'T20I':
                return "https://icc-resources.s3.amazonaws.com/player-photos/t20i/" + size + "/" + playerId + "." + extension;
            default:
                return "https://icc-resources.s3.amazonaws.com/player-photos/test/" + size + "/photo-missing.png";
        }
    };

    var getMatchDateRange = function( match, format ) {

        var dateFormatShort = format || "ddd D";
        var dateFormat = format || "ddd D MMMM";


        if( match.getEndDate && match.getDate().getDate() != match.getEndDate().getDate() ) {
            if( match.getDate().getMonth() === match.getEndDate().getMonth() ){
                return moment( match.getDate() ).format( dateFormatShort ) + " - " +  moment( match.getEndDate() ).format( dateFormat );
            }
            else{
                return moment( match.getDate() ).format( dateFormat ) + " - " +  moment( match.getEndDate() ).format( dateFormat );
            }
        }
        else{
            return moment( match.getDate() ).format( dateFormat );
        }

    };

    var getDateDiff = function (start, end, measurement ) {
        measurement = measurement || 'days';
        var startDate = moment(start);
        var endDate = moment(end);
        return endDate.diff(startDate, measurement);
    };

    /**
	 * Get duration in time format mm:ss
	 *
	 * @param {Int} number of seconds
	 * @returns {String} output duration in format mm:ss
	 */
	var durationToTime = function( duration ) {
        var sec_num = parseInt(duration, 10);

        if (sec_num) {
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) { hours   = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            var minSec = minutes + ':' + seconds;

            return hours > 0 ? hours + ':' + minSec : minSec;
        }

        return '00:00';
    };

    /**
     * Helper for pluralisation of nouns
     * @param {Number} number - the number to base the logic off of
     * @param {String} singular - the singular version of the noun
     * @param {String} plural - the plural version of the noun
     * @param {Boolean} includeNumber - whether to prepend the number to the output string or not
     */
    var pluralise = function( number, singular, plural, includeNumber ) {
        var string = includeNumber ? number + ' ' : '';
        return string + ( number == 1 ? singular : plural );
    };

    /**
     * object with all helper functions for underscore templates
     */
    app.common.templating.helper = {
        imageUtils: imageUtils,
        contentHasTag: contentHasTag,
        dateAge: dateAge,
        getPlayerHeadshotUrl: getPlayerHeadshotUrl,
        getDateDiff: getDateDiff,
        durationToTime: durationToTime,
        buildDescription: buildDescription,
        pluralise: pluralise,
        cricket: {
            getInningsLabel: getInningsLabel,
            getMatchTypeLabel: getMatchTypeLabel,
            getVenueString: getVenueString,
            scoreToString: scoreToString,
            getFormattedDate: getFormattedDate,
            buildDescription: buildDescription,
            getMatchDateRange: getMatchDateRange
        }
    };

    /**
     * Renders a template with the given data and returns the compiled template
     *
     * @param {Object}  data              - data to render in JSON format
     * @param {String}  templateName      - the name of the template (must match file name)
     * @param {Boolean} parseToHtmlObject - parse the rendered template string to an HTML object - default false
     * @return {(String|DOMElement)}      - Rendered template with model
     */
    app.common.templating.render = function( model, templateName, parseToHtmlObject ) {
        var renderedTemplate = '';

        model = model || {};
        for( var func in app.common.templating ) {
            if( app.common.templating.hasOwnProperty( func ) ) {
                model[ func ] = app.common.templating[ func ];
                model.urlUtil = {
                    generateUrl: app.common.generateUrl
                };
            }
        }

        if( templateName ) {
            var templateEngine = app.templates[ templateName ];
            if( templateEngine ) {
                try {
                    renderedTemplate = templateEngine( model );
                }
                catch( e ) {
                    if( e.message ) {
                        e.message += ' in template ' + templateName;
                    }
                    console.warn( e );
                }
                if( parseToHtmlObject ) {
                    return stringToElement( renderedTemplate );
                }
            }
            else {
                console.warn( 'No template was rendered. Template not found: ' + templateName );
            }
        }
        return renderedTemplate;
    };

}( PULSE.app, PULSE.core, PULSE.app.common, PULSE.cricket ) );

/*globals PULSE, PULSE.app */

(function( app ){
	"use strict";

	app.widgetDeps = function(){

		var environment = app.checkEnvironment();
		var els = document.querySelectorAll( '[data-script]' );
		var deps = [];
		var scriptPrefix = app.environment.cdn + "widgets/";
		var scriptSuffix = app.environment.label === "production" ? ".min.js" : ".js";

		Array.prototype.map.call( els, function( el ){
		    addDependancy(el.dataset.script);
		} );

		function addDependancy( dep ){
			if( deps.indexOf( dep ) < 0 ){
				deps.push( dep );
				var script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = scriptPrefix + dep + scriptSuffix;
				document.body.appendChild( script );
			}
		}
	};

}( PULSE.app ));
/*globals PULSE, PULSE.app */

(function( app ){
	"use strict";

	window.onload = function(){
		app.widgetDeps();
		// app.I18N.setup();

		/** If FastClick.js is loaded it rebinds all click events with touch events where necessary */
		if( FastClick !== null ){
			FastClick.attach(document.body);
		}
	};

}( PULSE.app ));
PULSE.app.templates.filter_dropdown=_.template('<div class="drop-down js-drop-down"> <div class="drop-down__clickzone js-dropdown-trigger" tabindex="0" role="button"></div> <div class="drop-down__label js-drop-down-label"><%= label %></div> <div class="drop-down__current js-drop-down-current"><%= current %></div> <div class="drop-down__caret-down"> <svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/resources/ver/i/svg-output/icons.svg#icn-caret-down"></use></svg> </div> <ul class="drop-down__dropdown-list js-drop-down-options"> <% options.forEach( function( item, key ) {  %> <li tabindex="0" role="button" class="drop-down__dropdown-list__option" role="button" data-option="<%= item.key %>"><%= item.value %></li> <% }); %> </ul> </div>');
/*globals PULSE, PULSE.app, PULSE.ui */

( function( core, common ) {

    common.filterOptions = function( filters, references ){

        var _self = this;

        _self.filters = filters;

        _self.updateReferences( references );   


    };

    common.filterOptions.prototype.addRefsToFilters = function(){

        var _self = this;

        var refString = "";

        if( typeof _self.references === 'string' ){
            refString += _self.references;
        }
        else{            
            for ( var key in _self.references ) {
                // skip loop if the property is from prototype
                if (!_self.references.hasOwnProperty(key)) continue;
                if( refString.length > 0 ){
                    refString += ',';
                }
                refString += key + ':' + _self.references[key];
            }
        }

        _self.filters.references = refString;
    };

    common.filterOptions.prototype.updateFilters = function( newFilters ){

        var _self = this;

        _self.filters = core.object.extend( _self.filters, newFilters );

    };

    common.filterOptions.prototype.updateReferences = function( newReferences ){

        var _self = this;

        if( newReferences ){ 
            if( !_self.references || typeof _self.references === 'string' ){
                _self.references = newReferences;              
            }
            else{
                _self.references = core.object.extend( _self.references, newReferences );
            }

            _self.addRefsToFilters();
        }
    };

    common.filterOptions.prototype.removeReference = function( reference ){

        var _self = this;

        delete _self.references[reference];

        _self.addRefsToFilters();

    };

    common.filterOptions.prototype.get = function( ){
        var _self = this;
        return _self.filters;
    };

} )( PULSE.core, PULSE.app.common );
(function( app, common ) {

    var MATCH_ORDER = ['TEST', 'ODI', 'T20I', 'FIRST_CLASS', 'LIST_A', 'T20', 'OTHER'];

    /**
     * Order matches by specific matchType order.
     * @param {Array<Object>} matches array of match objects
     * @param {Array<String>} order (optional) list of match types to use for ordering
     */
    common.orderMatchesByMatchType = function(matches, order) {

        var theOrder = order || MATCH_ORDER;
        var live = new Array(theOrder.length);
        var fixtures = new Array(theOrder.length);
        var results = new Array(theOrder.length);
        var type, i;

        // fill arrays with empty arrays
        for (var a = 0; a < theOrder.length; a++) {
            live[a] = [];
            fixtures[a] = [];
            results[a] = [];
        }

        // sort matches into the different buckets
        matches.forEach(function(match, index) {

            type = match.matchType;
            i = theOrder.indexOf(type);

            if (i > -1) {
                switch (match.matchState) {
                    case 'L':
                        live[i].push(match);
                        break;
                    case 'U':
                        fixtures[i].push(match);
                        break;
                    case 'C':
                        results[i].push(match);
                        break;
                }
            }

        });

        // merge back all matches in specifin order
        var orderedMatches = _.union(_.flatten(live), _.flatten(fixtures), _.flatten(results));

        return orderedMatches;

    };

}( PULSE.app, PULSE.app.common ));

/**
 * Coupled set of date string and moment object
 * @typedef {object} momentCouple
 * @property {moment|Date} date the moment Object
 * @property {string} string the generated string
 * @property {string} std locale independent date string ( DD-MM-YYYY )
 */

( function( common, app, core, moment ) {

	var oneDay = ( ( 60 * 60 ) * 24 ) * 1000;

	/**
	 * Use momentJS to get a locale-observant string with a specified format
	 * will return moment object as well as string
	 *
	 * @param start
	 * @param end
	 * @param format
	 * @param {boolean} inclusive if true will include start  day in response
	 * @returns {momentCouple[]} array of days with moment day and string included in each index position
	 */
	common.momentGetDaysFromRange = function( start, end, format, inclusive ) {

		var startAsDate = start instanceof Date ? start : new Date( start );
		var endAsDate = end instanceof Date ? end : new Date( end );

		var startTime = startAsDate.getTime();
		var endTime = endAsDate.getTime();

		var days = [];

		var current = startTime;

		if( inclusive && ( startAsDate.toLocaleDateString() !== endAsDate.toLocaleDateString() ) ) {

			days.push( {
				date: startAsDate,
				string: moment && format ? moment( startAsDate ).locale( app.language ).format( format ) : startAsDate.toLocaleDateString(),
				std: moment ? moment( startAsDate ).format( "DD-MM-YYYY" ) : false
			} )
		}

		// add a day until the date reaches the end date
		do{

			current = current + oneDay;
			var asDate = new Date( current );

			days.push( {
				date: asDate,
				string: moment && format ? moment( asDate ).locale( app.language ).format( format ) : asDate.toLocaleDateString(),
				std: moment ? moment( asDate ).format( "DD-MM-YYYY" ) : false
			} )

		} while ( current < endAsDate.getTime() );

		return days;

	}

	/**
	 * Get the time since a specific date
	 *
	 * @param {Date} date Date to be calculated from now
	 * @param {Object} Optional format for output
	 * @returns {String} output Amount of time since date
	 */
	common.getSinceString = function( date, format )
	{
	    if( date )
	    {
	        var now = new Date();

	        var diff = Math.floor( ( now - date ) / 1000 );

	        if( diff <= 0 )
	        {
	            return format ? format.justNow : "just now";
	        }
	        else if( diff < 60 )
	        {
	            var output = Math.round( diff );
	            return output + ( format ? format.seconds : "s" );
	        }
	        else if( diff < 60 * 60 )
	        {
	            var output = Math.round( diff / 60 );
	            return output + ( format ? format.minutes : "m" );
	        }
	        else if( diff < 60 * 60 * 24 )
	        {
	            var output = Math.round( diff / ( 60 * 60 ) );
	            return output + ( format ? format.hours : "h" );
	        }
	        else
	        {
	            var output = Math.round( diff / ( 60 * 60 * 24 ) );
	            return output + ( format ? format.days : "d" );
	        }
	    }
	};

	/**
	 * Get duration in time format mm:ss
	 *
	 * @param {Int} number of seconds
	 * @returns {String} output duration in format mm:ss
	 */
	common.durationToTime = function( duration ) {
        var sec_num = parseInt(duration, 10);

        if (sec_num) {
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) { hours   = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            var minSec = minutes + ':' + seconds;

            return hours > 0 ? hours + ':' + minSec : minSec;
        }

        return '00:00';
    };

} )( PULSE.app.common, PULSE.app, PULSE.core, moment );

(function( app, common ){
    var images = document.querySelectorAll('.preload-img'),
        i, highRes;

    // for (i = 0; i < images.length; i++) {
    //
    //     highRes = images[i].dataset.highresImg;
    //
    //     // (function(i, highRes){
    //
    //         var img = new Image();
    //         img.onload = function(){ onImageLoad(i, highRes); };
    //
    //         img.src = highRes;
    //     // })(i, highRes);
    //
    // }
    //
    // var onImageLoad = function(i, highRes) {
    //     if (images[i].nodeName === 'A') {
    //         images[i].style.backgroundImage = 'url("' + highRes + '")';
    //         images[i].classList.remove('preload-img');
    //     } else {
    //         images[i].onload = function() {
    //             this.classList.remove('preload-img');
    //         };
    //         images[i].setAttribute('src', highRes);
    //     }
    // };

    common.getPhotoByVariant = function(photos, variant) {

        var photo, l;

        for (l = 0; l < photos.length; l++) {
			if (photos[l].tag.label === variant) {
                photo = photos[l];
                break;
            }
		}

        return photo || null;

    };

    common.setPlayerImageLoader = function( playerId, imgSize, imageWrapper, imgExtension, matchType ) {
        var main = common.getPlayerImg( playerId, imgSize, imgExtension, matchType ),
            missing = common.getDefaultPlayerImg( imgSize ),
            profileImg = new Image();

        profileImg.onload = function() {
            imageWrapper.setAttribute( 'src', main );
			profileImg.setAttribute( 'src', main );
		};

        profileImg.onerror = function() {
            if ( ! imageWrapper.getAttribute( 'data-error' ) ) {
                imageWrapper.setAttribute( 'data-error', true );
                imageWrapper.setAttribute( 'src', missing );
            }
        };
    };

    common.getDefaultPlayerImg = function( imgSize ) {
		return common.getPlayerImg( 'Photo-Missing', imgSize );
	};

    common.getPlayerImg = function ( playerId, size, extension, matchType ) {
        var match;

        switch (matchType) {
            case 'TEST':
                match = 'test/';
                break;
            case 'ODI':
                match = 'odi/';
                break;
            case 'T20I':
                match = 't20i/';
                break;
            default:
                match = '';
        }

        return app.environment.playerImagePath + match + size + "/" + playerId + ( "." + ( extension || "png" ) );
    };

}( PULSE.app, PULSE.app.common ));

/*globals PULSE, PULSE.app, PULSE.app.common */

( function( core, app, common ) {

    /**
	 * creates content path based on the type and parameters
	 * @param {String} type Type of content
	 * @param {Object} params
	 * @returns {String} url Content url
	 */
	common.createContentPath = function( type, params, lang, id ) {
		var url = app.environment.cms + '/' + type + '/' + ( lang ? lang : app.defaultLanguage ) + '/' + ( id ? id : '' );

        if( params ) {
        	url += '?' + core.url.buildQueryString( params )
        }

		return url;
	};

	/**
	 * creates canary path based a strean id
	 * @param {int} id Stream id
	 * @returns {String} url Canary url
	 */
	common.createCanaryPathFromId = function ( id )
	{
		var url = app.environment.canary + 'stream/' + id + '/posts';

		return url;
	};

	common.createPollQuestionUrl = function( pollName )
	{
		var url = app.environment.pollQuestions + '/' + pollName + '/poll.js';

		return url;
	};

	common.createPollAnswerUrl = function( questionId, optionId )
	{
		var url = app.environment.pollAnswer + '?id=' + questionId + '&option=' + optionId + '&callback=JSON_CALLBACK';

		return url;
	};

	/**
	 * creates API path based on a string and parameters
	 * @param {String} path Object path for the API object
	 * @param {Object} params Url parameters
	 * @returns {String} url API url
	 */
	common.createApiPath = function ( path, params )
	{
		var thisPath = core.object.objectByString( app.apiPath, path );
		var paramArray = [];
		for ( var key in params )
		{
			if ( thisPath.indexOf( '{' + key + '}' ) > -1 )
			{
				thisPath = thisPath.replace( '{' + key + '}', params[ key ] );
			}
			else if ( params[key] != undefined )
			{
				paramArray.push( key + '=' + params[key] );
			}
		}
		var url = thisPath;
		if ( paramArray.length > 0 )
		{
			url += '?' + paramArray.join( '&' );
		}
		return url;
	};

	/**
	 * generate a url for a some content
	 * @param {String} type Type of content
	 * @param {int} id Id of content
	 * @returns {String} url Link to content
	 */
	common.generateUrl = function( type, id, restriction )
	{
		var base = '//' + app.environment.domain;
		var type = ( type || "" ).toLowerCase();

		restriction = restriction ? restriction.toLowerCase() : "";

		switch ( type )
		{
			case 'text':
                if ( restriction == 'featured' ) {
                    return base + '/news/' + id + '/featured';
                }
                if ( restriction == 'media-release' ) {
                    return base + '/media-releases/' + id;
                }
                if ( restriction == 'press-release' ) {
                    return base + '/news/' + id + '/press-release';
                }
				return base + '/news/' + id;
			case 'video':
				return base + '/video/' + id;
			case 'playlist':
				if( restriction == 'photo' ) {
					return base + '/photos/' + id;
				}
				else if( restriction == 'video' ) {
					return base + '/video/categories/' + id;
				}
				return '';
			case 'cricket_player':
				return base + '/players/' + id;
			case 'cricket_match':
				return base + '/match/' + id;
			default:
				return base + "/" + type + "/" + id;
		}
		return '';
	};

    /**
	 * Use the browser's built-in functionality to safely escape a string
	 * @param {String} str String to escape
	 * @returns {String} str Escaped string (no, it didn't run away)
	 */
     common.escapeHtml = function(str) {
         var div = document.createElement('div');
         div.appendChild(document.createTextNode(str));
         return div.innerHTML;
     };

} )( PULSE.core, PULSE.app, PULSE.app.common );

/*globals PULSE, PULSE.app, PULSE.app.common */
( function( app, common, cricket ) {

    common.widget = {};

    /**
     * Map of widget attribute names to content types
     * @type {Object}
     */
    WIDGET_ATTRIBUTES = {
        // cricket references
        'data-tournament-id': 'CRICKET_TOURNAMENT',
        'data-team-id': 'CRICKET_TEAM',
        'data-venue-id': 'CRICKET_VENUE',
        'data-match-id': 'CRICKET_MATCH',
        'data-tournament-group-id': 'CRICKET_TOURNAMENTGROUP'
    };

    /**
     * Gets a data attribute of a DOM element and converts it to a number
     *
     * @param  {string}     attribute     The attribute name
     * @param  {DOMElement} element       The element
     * @return {Number}                   The number attribute.
     */
    common.widget.getNumberAttribute = function( attribute, element ) {
        var value = parseInt( element.getAttribute( attribute ), 10 );
        if( isNaN( value ) === false ) {
            return value;
        }
    };

    /**
     * Gets the data attribute of a DOM element and converts it into an array
     *
     * @param  {string}        attribute  The attribute name
     * @param  {DOMElement}    element    The element
     * @return {Array<String>}            The array attribute.
     */
    common.widget.getArrayAttribute = function( attribute, element ) {
        var value = element.getAttribute( attribute );
        if( value ) {
            return value.split( ',' ).map( function( item ) {
                return item.trim();
            } ).filter( function( item ) {
                return typeof item !== 'undefined' && item !== '';
            } );
        }
    };

    /**
     * Retrieves hash map of content references from a widget container's attributes
     * @param  {DOMElement} element - The widget container
     * @return {Object}             - Hash of content type to array of reference IDs
     */
    common.widget.retrieveReferences = function( element ) {
        var references = {};
        if( element ) {
            for( var attr in WIDGET_ATTRIBUTES ) {
                references[ WIDGET_ATTRIBUTES[ attr ] ] = common.widget.getArrayAttribute( attr, element );
            }
        }
        return references;
    };

    /**
     * Given a map of content references, it converts it to a {@link PULSE.cricket.MatchListFilter}
     *
     * @param  {Object} referencesMap          - The references map
     * @return {PULSE.cricket.MatchListFilter} - The filter for the match list
     */
    common.widget.convertToFilter = function( referencesMap ) {
        var filter = {};
        for( var contentType in referencesMap ) {
            switch( contentType ) {
                case 'CRICKET_TOURNAMENT':
                    filter[ 'tournamentIds' ] = referencesMap[ contentType ];
                    break;
                case 'CRICKET_TEAM':
                    filter[ 'teamIds' ] = referencesMap[ contentType ];
                    break;
                case 'CRICKET_VENUE':
                    filter[ 'venueIds' ] = referencesMap[ contentType ];
                    break;
                case 'CRICKET_TOURNAMENTGROUP':
                    filter[ 'tournamentGroupIds' ] = referencesMap[ contentType ];
                    break;
                }
        }
        return filter;
    };

    /**
     * Retrieves match information from a widget container's data attributes and retrieves/creates
     * the appropriate cricket.Match instance so it can be used inside a widget
     * 
     * @param  {DOMElement} container - the widget container
     * @return {cricket.Match}        - the instance of the match
     */
    common.widget.getMatchFromContainer = function( container ) {
        var matchId = common.widget.getNumberAttribute( 'data-match-id', container );
        var tournamentId = common.widget.getNumberAttribute( 'data-tournament-id', container );
        var store = cricket.Store.getInstance();

        return store.getMatch( matchId, tournamentId );
    };

} )( PULSE.app, PULSE.app.common, PULSE.cricket );

/*globals PULSE, PULSE.app, PULSE>I18N */

( function( common, core, templates ) {

    /**
     * create an interface for the use of the scroll loader
     */
    common.ScrollLoaderDelegate = function() {

    };

    /**
     * indicate to the delegate object that the scroller has reached a point
     * where it has been activated and the delegate should populate the
     * container with new data
     */
    common.ScrollLoaderDelegate.prototype.didRequestLoad = function() {

    };




    /**
     * @namespace common.ScrollLoader.private
     */

    /**
     * draw the loader from the template, ensuring translation is used
     *
     * @param {common.ScrollLoader} _self contextual reference to the object that is calling the function
     */
    var drawLoader = function( _self ) {

        var loader = '<div class="loader-container"></div>',
            loadingIndicator = '<div class="loader js-loader"></div>';

        //append to container and keep a reference
        _self.element = core.dom.appendDomString( _self.showMoreContainer || _self.container, loader );
        _self.loadingIndicator = core.dom.appendDomString( _self.element, loadingIndicator );

    };

    var onScroll = function( event ) {
        var _self = this;
        if ( !_self.loading && _self.element ) {
            var top = _self.element.getBoundingClientRect().top;
            if ( ( window.innerHeight - top ) >= _self.limit && (_self.element.offsetHeight !== 0 || _self.ignoreOffsetHeight)) {
                _self.show();
                if ( _self.delegate ) {
                    _self.loading = true;
                    _self.delegate.didRequestLoad();
                }
            }
        }
    };

    var onShowMoreClick = function() {
        var _self = this;

        core.style.addClass( _self.showMoreButton, 'u-hide' );

        drawLoader( _self );

        _self.loading = true;
        _self.delegate.didRequestLoad();
    };

    /**
     * set the scroller listener for the loader
     *
     * @param {common.ScrollLoader} _self contextual reference to the object that is calling the function
     */
    var setScrollListeners = function( _self ) {
        if (_self.delegate.config && _self.delegate.config.scrollBoundary) {
            var elem = typeof _self.delegate.config.scrollBoundary === 'string' ? document.querySelector(_self.delegate.config.scrollBoundary) : _self.delegate.config.scrollBoundary;
            elem.addEventListener( 'scroll', onScroll.bind( _self ) );
        } else {
            document.addEventListener( 'scroll', onScroll.bind( _self ) );
        }
        _self.scrollListenersSet = true;
    };

    var removeListeners = function( _self ) {
        if (_self.delegate.config && _self.delegate.config.scrollBoundary) {
            document.querySelector(_self.delegate.config.scrollBoundary).removeEventListener( 'scroll', onScroll.bind( _self ) );
        } else {
            document.removeEventListener( 'scroll', onScroll.bind( _self ) );
        }
        _self.scrollListenersSet = false;
    };


    /**
     * create a scroll loader, for requesting more content when the page scroll
     * reaches this point the scroller will append itself to the bottom of
     * the list of content provided as container
     *
     * @param {HTMLElement} container
     * @param {common.ScrollLoaderDelegate} delegate
     * @param {boolean} ignoreOffsetHeight Whether to ignore the offset height or not.
     * @param {boolean} showMore Whether a show more button should be shown before initiating the infinity scroll.
     */
    common.ScrollLoader = function( container, delegate, ignoreOffsetHeight, showMore ) {
        var _self = this;

        _self.delegate = delegate;
        _self.container = container;
        _self.ignoreOffsetHeight = ignoreOffsetHeight;
        _self.loading = false;
        _self.element = false;
        // this property defines how far above the bottom of the screen the
        // loading element must rise in order to trigger a load request
        _self.limit = 0;
        _self.showMore = showMore;
        _self.scrollListenersSet = false;

        if (showMore && delegate.widget) {
            _self.showMoreContainer = delegate.widget.querySelector('.js-show-more');
            _self.showMoreButton = delegate.widget.querySelector('.js-show-more-button');
            core.style.addClass( _self.showMoreContainer, 'is-active' );

            _self.showMoreButton.addEventListener( 'click', onShowMoreClick.bind( _self ));
        } else {
            drawLoader( _self );
            setScrollListeners( _self );
        }

    };

    common.ScrollLoader.prototype.enable = function() {
        var _self = this;
        _self.loading = false;
        setScrollListeners( _self );
    };

    common.ScrollLoader.prototype.disable = function() {
        var _self = this;
        _self.loading = true;
        removeListeners( _self );
    };

    /**
     * Reset the loader; will re-add the tracker on the page
     */
    common.ScrollLoader.prototype.reset = function() {
        var _self = this;

        _self.loading = false;

        _self.removeLoader();
        removeListeners( _self );

        if (_self.showMore) {
            core.style.removeClass( _self.showMoreButton, 'u-hide' );
        } else {
            drawLoader( _self );
            setScrollListeners( _self );
        }
    };

    /**
     * public method that can be used to initialte a re-append
     */

    common.ScrollLoader.prototype.contentLoaded = function(allContentLoaded) {
        var _self = this;

        _self.loading = false;
        _self.hide();

        if (!_self.scrollListenersSet) {
            setScrollListeners(_self);
        }
        if (allContentLoaded) {
            _self.hideShowMore();
        }
    };

    /**
     * remove the loader
     *
     */
    common.ScrollLoader.prototype.removeLoader = function() {
        var _self = this;

        if ( _self.element && _self.element.parentNode ) {
            _self.element.parentNode.removeChild( _self.element );
        }
        _self.element = false;
        _self.hideShowMore();
    };

    /**
     * make the loader visible
     *
     */
    common.ScrollLoader.prototype.show = function() {
        var _self = this;
        _self.element.style.display = "block";
        _self.loadingIndicator.style.display = "block";
    };

    /**
     * hide the loader
     *
     */
    common.ScrollLoader.prototype.hide = function() {
        var _self = this;
        if (_self.loadingIndicator) {
            _self.loadingIndicator.style.display = "none";
        }
    };

    /**
     * hide the show more button
     *
     */
    common.ScrollLoader.prototype.hideShowMore = function() {
        var _self = this;
        core.style.addClass( _self.showMoreButton, 'u-hide' );
    };

    common.ScrollLoader.prototype.newLoader = function() {
        var _self = this;

        if ( !_self.element ) {
            drawLoader( _self );
        }
    };

    /**
     * delegate will call this on the scroll loader when it has finished
     * loading data and adding this data to the view.
     */
    common.ScrollLoader.prototype.completedDataLoad = function() {
        var _self = this;

        _self.loading = false;
        _self.removeLoader();
    };

} )( PULSE.app.common, PULSE.core, PULSE.app.templates );

/*globals PULSE, PULSE.core */

(function( app, common ){
    "use strict";

    app.playerImage = function( element, config ) {

        var _self = this;

        _self.element = element;
        _self.playerId = _self.element.getAttribute( 'data-player' );
        _self.imageSize = _self.element.getAttribute( 'data-size' ) || '480x480';
        _self.imgExtension = _self.element.getAttribute( 'data-extension' );
        _self.matchType = _self.element.getAttribute( 'data-match-type' );

        common.setPlayerImageLoader( _self.playerId, _self.imageSize, _self.element, _self.imgExtension, _self.matchType );
    };

    app.setPlayerImages = function( container ) {
        if( container ) {
            var widgets = container.querySelectorAll( '[data-widget="player-image"]' );
            for ( var i = 0; i < widgets.length; i++ ) {
                new app.playerImage( widgets[ i ], {} );
            }
        }
    };

    app.setPlayerImages( document );


}( PULSE.app, PULSE.app.common ));

/*globals PULSE, PULSE.app*/

( function( app, common, core ) {

    /* PRIVATE METHODS */

    /**
     * @namespace common.slider.private
     */

    var setDefaults = function( config ){

        if( !config.wrap ){
            console.warn( 'You must provide a wrap element in your slider config' );
            return;
        }
        if( !config.controls || !config.controls.next || !config.controls.previous ){
            console.warn( 'You must provide a both next and previous control elements in your slider config' );
            return;
        }
        if( !config.slideList ){
            config.slideList = config.wrap.querySelector( '.js-slide-list' );
        }
        if( !config.slides ){
            config.slides = config.wrap.querySelectorAll( '.js-slide' );
        }
        if( !config.slideRate ){
            config.slideRate = 50; // pixels to move per FPS
        }
        if( !config.thumbSlideRate ){
            config.thumbSlideRate = 10; // pixels to move per FPS
        }
        if( !config.interval ){
            config.interval = 5000;
        }
        if( !config.auto ){
            config.auto = false;
        }
        if( !config.startIndex ){
            config.startIndex = 0;
        }
        if( !config.hideClass ){
            config.hideClass = 'is-hidden';
        }
        if( config.thumbsWrap && !config.thumbsType ){
            config.thumbsType = 'image';
        }
        if( !config.thumbClass ){
            config.thumbClass = 'thumbnail';
        }

        return config;

    };

    var bindControls = function ( scope ) {

        scope.config.controls.previous.addEventListener( 'click', function( e ){
            e.preventDefault();
            scope.config.slidePrev = true;
            scope.slidePrev();
        } );

        scope.config.controls.next.addEventListener( 'click', function( e ){
            e.preventDefault();
            scope.config.slideNext = true;
            scope.slideNext();
        } );


        if ( scope.config.controls.expand ){
            // used to handle multiple expand elements that also set the current image on expand
            if(scope.config.controls.expand.length > 1) {

                for (var i = 0; i < scope.config.controls.expand.length; i++) {

                    scope.config.controls.expand[i].addEventListener('click', function(e) {

                        e.preventDefault();
                        scope.config.currentSlide = e.target.parentNode.parentNode;
                        scope.toggleExpand();
                    });
                }

            } else {

                scope.config.controls.expand.addEventListener( 'click', function( e ){
                    e.preventDefault();
                    scope.toggleExpand();
                } );

            }

        }

        if ( scope.config.controls.autoStart && scope.config.controls.autoStop ){
            scope.config.controls.autoStart.addEventListener( 'click', function( e ){
                e.preventDefault();
                scope.startAuto();
            } );
            scope.config.controls.autoStop.addEventListener( 'click', function( e ){
                e.preventDefault();
                scope.stopAuto();
            } );
        }

    };

    var buildViewport = function( scope ){

        var newViewport = false;

        if( !scope.config.viewport ){
            newViewport = true;
            scope.config.viewport = document.createElement( 'div' );
            core.style.addClass( scope.config.viewport, 'slider-viewport' );
        }
        scope.config.viewportList = document.createElement( 'ul' );
        core.style.addClass( scope.config.viewportList, 'slider-viewport__list' );
        scope.config.viewport.appendChild( scope.config.viewportList );

        if( newViewport ){
            scope.config.wrap.appendChild( scope.config.viewport );
        }

        bindViewport( scope );

    };

    var bindViewport = function( scope ){
        var timeout;

        var checkScroll = function( ){
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                var scrollDiff = Math.abs(scope.config.viewport.scrollLeft - scope.config.viewport.offsetWidth);
                if (scrollDiff > 30) {
                    if( scope.config.viewport.scrollLeft > scope.config.viewport.offsetWidth ){
                        scope.slideNext();
                    } else{
                        scope.slidePrev();
                    }
                } else {
                    scope.updateViewport( scope.config.currentSlide );
                }
                scope.config.viewport.removeEventListener( 'scroll', checkScroll );
            }, 50 );
        };

        scope.config.viewportList.addEventListener( 'touchstart', function( e ){
            startPos = scope.config.viewport.scrollLeft;
            scope.config.viewport.addEventListener( 'scroll', checkScroll );
        } );
    };

    var bindResize = function( scope ){
        var timeout;

        var checkResize = function( ){
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                scope.updateViewport( scope.config.currentSlide );
            }, 200 );
        };

        window.addEventListener( 'resize', checkResize );
    };

    var buildThumbnails = function( scope ){
        scope.config.thumbnails = Array.prototype.map.call( scope.config.slides, function( slide, index ){
            slide.indexVal = index;
            var thumb = document.createElement( 'li' );
            core.style.addClass( thumb, scope.config.thumbClass );
            switch( scope.config.thumbsType ){
                case "image":
                    thumb.appendChild( slide.querySelector( 'picture' ).cloneNode( true ) );
                    break;
                case "index":
                    thumb.innerHTML = index + 1;
            }
            thumb.addEventListener( 'click', function(){
                scope.slideToIndex( index );
            } );
            scope.config.thumbsWrap.appendChild( thumb );
            return thumb;
        } );
    };

    var bindThumbControls = function( scope ){

        scope.config.thumbControls.left.addEventListener( 'click', function( e ){
            e.preventDefault();
            scope.slideThumbsLeft();
        } );

        scope.config.thumbControls.right.addEventListener( 'click', function( e ){
            e.preventDefault();
            scope.slideThumbsRight();
        } );

    };

    var setFullScreenPhoto = function(slide, data) {
        var picElem = slide.querySelector('.js-picture-element');
        var picContent = '';

        data.srcset.forEach(function(set) {
            picContent += '<source srcset="' + set.src + '" media="' + (set.media ? set.media : '') + '">';
        });

        var img = new Image();
        img.onload = function() {
            picContent += '<img src=' + data.img + ' class="thumbnail__image"/>';
            picElem.innerHTML = picContent;
        };
        img.src = data.img;

    };

    common.slider = function ( config ) {
        'use strict';

        var _self = this;

        _self.config = setDefaults( config );

        // hide the slide list
        // core.style.addClass( _self.config.slideList, _self.config.hideClass );

        _self.config.currentSlide = _self.config.slides[ _self.config.startIndex ];
        _self.config.firstSlide = _self.config.slides[0];
        _self.config.lastSlide = _self.config.slides[ _self.config.slides.length - 1 ];
        _self.isViewportFullsize = false;

        bindControls( _self );
        buildViewport( _self );
        bindResize( _self );
        if( _self.config.thumbsWrap ){
            buildThumbnails( _self );

            if( _self.config.thumbControls ){
                bindThumbControls( _self );
            }
        }
        _self.updateViewport( _self.config.currentSlide );

        if( _self.config.auto ){
            _self.startAuto();
        }

    };

    common.slider.prototype.slidePrev = function(){

        var _self = this;
        var limit = 0;

        function moveSlide() {

            var newPos = _self.config.viewport.scrollLeft - _self.config.slideRate;

            if( newPos <= limit){
                _self.config.viewport.scrollLeft = limit;
                cancelAnimationFrame( sliding );
                _self.updateViewport( _self.config.prevSlide );
            } else if(_self.config.slidePrev === true) {
                _self.config.viewport.scrollLeft = newPos;
                requestAnimationFrame( moveSlide );
            }
        }
        var sliding = requestAnimationFrame(moveSlide);

    };

    common.slider.prototype.slideNext = function(){

        var _self = this;
        var limit = ( _self.config.viewport.offsetWidth * 2 ) - 10;

        function moveSlide() {

            var newPos = _self.config.viewport.scrollLeft + _self.config.slideRate;

            if( newPos >= limit ) {
                _self.config.viewport.scrollLeft = limit;
                cancelAnimationFrame( sliding );
                _self.updateViewport( _self.config.nextSlide );
            } else if(_self.config.slideNext === true) {
                _self.config.viewport.scrollLeft = newPos;
                requestAnimationFrame( moveSlide );
            }
        }
        var sliding = requestAnimationFrame(moveSlide);

    };

    common.slider.prototype.slideToIndex = function ( targetIndex ) {

        var _self = this;

        if( _self.config.currentSlide.indexVal !== targetIndex ){

            if ( _self.config.currentSlide.indexVal < targetIndex ) {
                var newTarget = _self.config.currentSlide;
                newTarget.forceNext = _self.config.slides[ targetIndex ];
                _self.updateViewport(newTarget, 'next');
            }
            else {
                var newTarget = _self.config.currentSlide;
                newTarget.forcePrev = _self.config.slides[ targetIndex ];
                _self.updateViewport(newTarget, 'prev');
            }
        }

    };

    common.slider.prototype.startAuto = function(){

        var _self = this;

        if( !_self.autoPlaying ){
            _self.autoPlaying = setInterval(
                function(){
                    _self.slideNext();
                }, _self.config.interval
            );
            core.style.toggleClass( _self.config.controls.autoStart, _self.config.hideClass );
            core.style.toggleClass( _self.config.controls.autoStop, _self.config.hideClass );
        }
        else{
            return "slider is already auto playing";
        }
    };

    common.slider.prototype.stopAuto = function(){

        var _self = this;

        if( _self.autoPlaying ){
            clearInterval( _self.autoPlaying );
            _self.autoPlaying = false;
            core.style.toggleClass( _self.config.controls.autoStart, _self.config.hideClass );
            core.style.toggleClass( _self.config.controls.autoStop, _self.config.hideClass );
        }
        else{
            return "slider is not auto playing";
        }
    };

    common.slider.prototype.arrowKeyNav = function(e) {

        var _self = this;
        _self.config.slidePrev = false;
        _self.config.slideNext = false;

        if( e.keyCode === 39 ) {
            _self.config.slideNext = true;
            _self.slideNext();
            _self.stopAuto();
        }
        else if( e.keyCode === 37 ) {
            _self.config.slidePrev = true;
            _self.slidePrev();
            _self.stopAuto();
        }
        else if( e.keyCode === 27 ) {
            _self.toggleExpand();
        }
    };

    common.slider.prototype.toggleExpand = function(){

        var _self = this;

        var keyListener = function(e) {

            if (_self.isViewportFullsize) {
                _self.arrowKeyNav(e);
            }
        };

        if ( core.style.hasClass( _self.config.wrap, 'expanded' ) ){
            _self.isViewportFullsize = false;
            core.style.removeClass( _self.config.wrap, 'expanded' );
            core.style.removeClass( document.getElementsByTagName( 'body' )[0], 'u-body-no-scroll' );

        } else {
            _self.isViewportFullsize = true;
            core.style.addClass( _self.config.wrap, 'expanded' );
            core.style.addClass( document.getElementsByTagName( 'body' )[0], 'u-body-no-scroll' );

            var fullscreenData = _self.config.currentSlide.getAttribute('data-fullscreen-data');
            if (fullscreenData) {
                setFullScreenPhoto( _self.config.currentSlide, JSON.parse(fullscreenData) );
            }

            if (!_self.keyEventListenerAdded) {
                _self.keyEventListenerAdded = true;
                document.addEventListener('keyup', keyListener );
            }
        }

        _self.updateViewport( _self.config.currentSlide );

    };

    common.slider.prototype.updateViewport = function (target, slide) {

        var _self = this;
        _self.config.currentSlide = target;

        if (target.forcePrev) {
            _self.config.prevSlide = target.forcePrev;
            target.forcePrev = false;
            _self.config.slidePrev = true;
        } else {
            _self.config.prevSlide = core.dom.getPreviousSiblings( _self.config.currentSlide )[0];
            if ( !_self.config.prevSlide ) {
                _self.config.prevSlide = _self.config.lastSlide;
            }
        }

        if (target.forceNext) {
            _self.config.nextSlide = target.forceNext;
            target.forceNext = false;
            _self.config.slideNext = true;
        } else {
            _self.config.nextSlide = core.dom.getNextSiblings( _self.config.currentSlide )[0];
            if ( !_self.config.nextSlide ) {
                _self.config.nextSlide = _self.config.firstSlide;
            }
        }

        _self.config.viewportList.innerHTML = "";
        _self.config.viewportList.appendChild( _self.config.prevSlide.cloneNode( true ) );
        _self.config.viewportList.appendChild( _self.config.currentSlide.cloneNode( true ) );
        _self.config.viewportList.appendChild( _self.config.nextSlide.cloneNode( true ) );

        _self.config.viewport.scrollLeft = _self.config.viewport.offsetWidth;

        if ( slide === "next" ) {
            _self.slideNext( true );
        } else if ( slide === "prev" ) {
            _self.slidePrev( true );
        }

        if( _self.config.thumbnails ){
            _self.setActiveThumb( _self.config.currentSlide.indexVal );
        }

        _self.loadHighResImages();

    };

    common.slider.prototype.loadHighResImages = function () {
        _self = this;
        var array = [_self.config.prevSlide, _self.config.currentSlide, _self.config.nextSlide];

        array.forEach(function(element, key){
            var fullscreenData = element.getAttribute('data-fullscreen-data');

            if (fullscreenData && element.dataset.imageLoaded != 'true') {
                element.dataset.imageLoaded = true;
                setFullScreenPhoto(_self.config.viewportList.querySelector('li:nth-child('+ Number(key+1) +')'),JSON.parse(fullscreenData) );

                setFullScreenPhoto( element, JSON.parse(fullscreenData) );
            }

        });


    };
    common.slider.prototype.setActiveThumb = function( activeIndex ){
        var _self = this;
        Array.prototype.forEach.call( _self.config.thumbnails, function( thumb ){
            core.style.removeClass( thumb, 'is-active' );
        } );
        core.style.addClass( _self.config.thumbnails[ activeIndex ], 'is-active' );
    };

    common.slider.prototype.slideThumbsRight = function( direction ){
        var _self = this;

        var getThumbWidth = function(){
            var width = _self.config.thumbnails[0].offsetWidth;

            var marginLeft = parseInt( window.getComputedStyle( _self.config.thumbnails[0] ).getPropertyValue('margin-left') );
            var marginRight = parseInt( window.getComputedStyle( _self.config.thumbnails[0] ).getPropertyValue('margin-right') );

            return width + marginRight + marginLeft;

        };

        var startPos =  _self.config.thumbsWrap.scrollLeft;
        var distance = getThumbWidth();
        var limit = ( _self.config.thumbnails.length * distance ) - _self.config.thumbsWrap.offsetWidth;


        function moveThumbs() {

            var newPos = _self.config.thumbsWrap.scrollLeft += _self.config.thumbSlideRate;

            if( newPos > limit ){
                _self.config.thumbsWrap.scrollLeft = limit;
                cancelAnimationFrame( slidingThumbs );
            }
            else if( newPos >= startPos + distance ){
                _self.config.thumbsWrap.scrollLeft = newPos;
                cancelAnimationFrame( slidingThumbs );
            }
            else{
                _self.config.thumbsWrap.scrollLeft = newPos;
                requestAnimationFrame( moveThumbs );
            }
        }

        if( _self.config.thumbsWrap.scrollLeft < limit ){
            var slidingThumbs = requestAnimationFrame( moveThumbs );
        }

    };

    common.slider.prototype.slideThumbsLeft = function( direction ){
        var _self = this;

        var startPos =  _self.config.thumbsWrap.scrollLeft;
        var distance = _self.config.thumbnails[0].offsetWidth;
        var limit = 0;

        function moveThumbs() {

            var newPos = _self.config.thumbsWrap.scrollLeft -= _self.config.thumbSlideRate;

            if( newPos < limit ){
                _self.config.thumbsWrap.scrollLeft = limit;
                cancelAnimationFrame( slidingThumbs );
            }
            else if( newPos <= startPos - distance ){
                _self.config.thumbsWrap.scrollLeft = newPos;
                cancelAnimationFrame( slidingThumbs );
            }
            else{
                _self.config.thumbsWrap.scrollLeft = newPos;
                requestAnimationFrame( moveThumbs );
            }
        }

        if( _self.config.thumbsWrap.scrollLeft > limit ){
            var slidingThumbs = requestAnimationFrame( moveThumbs );
        }

    };


} )( PULSE.app, PULSE.app.common, PULSE.core );

/*globals PULSE, PULSE.app */

( function( core, common ) {

	var scrollBoundary = function() {

		var _self = this;

		_self.stickyItems = [];
		var timer = null;

		window.addEventListener( 'scroll', function(e) {
			onScroll( _self, e );

			if(timer !== null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				onScroll( _self, e );
			}, 300);
		} );
	};

	var onScroll = function(_self, e) {

        var i, item, boundaryRect, scrollTop, windowScroll;

		for (i = 0; i < _self.stickyItems.length; i++) {
            item = _self.stickyItems[i];
            elemRect = item.elem.getBoundingClientRect();
            windowScroll = window.scrollY || window.pageYOffset;

			if (item.boundary === 'viewport') {
				scrollTop = 0;
				boundaryPos = elemRect.top + item.margin;
			} else {
				boundaryRect = item.boundary.getBoundingClientRect();
				scrollTop = (boundaryRect.top * -1) + item.elem.offsetHeight + elemRect.top + item.margin;
				boundaryPos = item.boundary.offsetHeight;
			}

			if (!core.style.hasClass(item.container[0], item.activeClass)) {

				if (scrollTop >= boundaryPos) { // reached the bottom of the boundary elem

					if (windowScroll >= item.scrollPos) {
						setClass(item.container, item.activeClass);
					}
					item.scrollPos = window.scrollY || window.pageYOffset;

				}

			} else if (item.boundary === 'viewport' && windowScroll === 0) { // scrolled back up to the top
	             removeClass(item.container, item.activeClass);
			} else if (item.boundary !== 'viewport' && windowScroll <= item.scrollPos) { // scrolled back up above the boundary
	             removeClass(item.container, item.activeClass);
			}

		}

	};

	var setClass = function(container, activeClass) {
		for (var x = 0; x < container.length; x++) {
			core.style.addClass(container[x], activeClass);
		}
	};

	var removeClass = function(container, activeClass) {
		for (var x = 0; x < container.length; x++) {
			core.style.removeClass(container[x], activeClass);
		}
	};

	var addItemFromWidget = function(widget) {
		var item, boundarySelector, boundary, margin, activeClass, containers;

		item = widget.getAttribute('data-item');
		boundarySelector = widget.getAttribute('data-boundary');
		margin = parseInt(widget.getAttribute('data-margin'));
		activeClass = widget.getAttribute('data-active-class');
		containers = document.querySelectorAll(widget.getAttribute('data-containers'));

		if (item) {
			item = document.querySelector(item);
		}
		if (boundarySelector) {
			boundary = document.querySelector(boundarySelector);
		} else {
			boundary = 'viewport';
		}

		common.scrollBoundary.addItem(item || widget, boundary, margin, containers, activeClass);
	};



	/**
	 * Add an element to be watched on scroll if it reaches the boundary of another element and apply a class
	 * @param {object} item element to be watched
	 * @param {object} boundary boundary element
	 * @param {integer} scrollMargin margin to the boundary element
	 * @param {object} itemContainer array of elements which the class should be applied to - optional (if not set, class will be set to item)
	 * @param {string} activeClass CSS class to be set on element when active - default: is-static
	 */
	scrollBoundary.prototype.addItem = function(item, boundary, scrollMargin, itemContainer, activeClass) {

		var _self = this;

		if (item && boundary) {

			_self.stickyItems.push({
				elem: item,
				boundary: boundary,
				container: itemContainer && itemContainer.length > 0 ? itemContainer : [item],
				margin: scrollMargin || 0,
				activeClass: activeClass || 'is-static'
			});

		}

		onScroll( _self );

	};

	common.scrollBoundary = new scrollBoundary();

	var widgets = document.querySelectorAll('[data-widget="scroll-boundary"]');
	for (var i = 0; i < widgets.length; i++) {
		addItemFromWidget(widgets[i]);
	}


}( PULSE.core, PULSE.app.common ));

/*globals PULSE, PULSE.app, PULSE.ui */

(function (app, core, common) {

    var FilterTypes = [
        {
            name: 'MENS_TEAM',
            label: 'Filter by Team',
            current: 'All Teams',
            options: [
                {
                    key: 'ALL',
                    value: 'All Teams'
                }
            ]
        },
        {
            name: 'WOMENS_TEAM',
            label: 'Filter by Team',
            current: 'All Teams',
            options: [
                {
                    key: 'ALL',
                    value: 'All Teams'
                }
            ]
        },
        {
            name: 'ALL_TEAM',
            label: 'Filter by Team',
            current: 'All Teams',
            options: [
                {
                    key: 'ALL',
                    value: 'All Teams'
                }
            ]
        },
        {
            name: 'FORMAT',
            label: 'Filter by Format',
            current: 'All Formats',
            options: [
                {
                    key: 'ALL',
                    value: 'All Formats'
                }
            ]
        }
    ];

    var labelToTypeMap = {
        'Filter by Team': 'CRICKET_TEAM',
        'Filter by Format': 'FORMAT'
    };

    var replaceAll = function (target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    /**
	 * filterDropDown
     * Common module that should be called in content list module for filtering
     * @param {object} targetObject - widget element
     * @param {object} filterTarget - section element which should hold a update function and where data gets loaded in.
	 */
    common.filterDropDown = function (targetObject, filterTarget) {

        var _self = this;

        _self.targetObject = targetObject;
        _self.container = filterTarget;
        _self.currentOption = {
            type: '',
            title: '',
            key: ''
        };

        _self.filterDropDownTemplate = "filter_dropdown";

        _self.dataFilters = [];

        if (typeof _self.targetObject.filter !== 'undefined') {

            if (typeof _self.targetObject.filter === "string") {
                _self.targetObject.filter = [_self.targetObject.filter]; // backward compatibility
            }

            _self.dataFilters = _self.targetObject.filter;
        }

        //TODO: check if there are duplicates in dataFilters array and deduplicate it
        _self.dataFilters.forEach(function (filter, idx) {
            FilterTypes.forEach(function ( type ) {
                if ( filter === type.name ) {
                    _self.render( type )
                }
            });
        });

        _self.buildDropdown();
    };

    common.filterDropDown.prototype.renderTeams = function (model, src) {
        var _self = this;

        var newOptions = [];

        for( var i=0; i < src.length; i++ ) {
            newOptions.push({
                key: src[i].id,
                value: src[i].fullName
            });
        };
        newOptions.sort(function (a, b) {
            if (a.value < b.value) return -1;
            if (b.value < a.value) return 1;
            return 0;
        });

        model.options = model.options.concat( newOptions );
        _self.container.innerHTML += app.common.templating.render(model, _self.filterDropDownTemplate);
    };

    common.filterDropDown.prototype.renderFormats = function (model, src) {
        var _self = this;

        Array.prototype.forEach.call(src, function (item, index) {
            model.options.push({
                key: item,
                value: replaceAll(item, '_', ' ')
            });
        });
        _self.container.innerHTML += app.common.templating.render(model, _self.filterDropDownTemplate);
    };

    /**
     * render dropdown widget
     * @param {object} dropdown
     */
    common.filterDropDown.prototype.render = function ( type ) {

        var _self = this;

        switch ( type.name ) {
            case 'MENS_TEAM':
                _self.renderTeams( type, app.teams.mens );
                break;
            case 'WOMENS_TEAM':
                _self.renderTeams( type, app.teams.womens );
                break;
            case 'ALL_TEAM':
                _self.renderTeams( type, app.teams.mens.concat( app.teams.womens ) );
                break;
            case 'FORMAT':
                _self.renderFormats( type, app.formats );
                break;
            default:
                console.log('Unknown filter type')
                break;
        }
    };

    /**
     * updateCurrent
     * Helper function to update current dropdown option
     * This function also calls the update function of the target object.
     * @param {object} data
     */
    common.filterDropDown.prototype.updateCurrent = function (data) {

        var _self = this;

        _self.currentOption.type = typeof data.type !== undefined ? data.type : '';
        _self.currentOption.title = typeof data.title !== undefined ? data.title : '';
        _self.currentOption.key = typeof data.key !== undefined ? data.key : '';

        // send data to target list
        _self.targetObject.update(_self.getCurrent());
    };

    common.filterDropDown.prototype.getCurrent = function () {
        var _self = this;
        return _self.currentOption;
    }

    /**
     * Dropdown
     * creates a custom dropdown
     * turns dom element with js-drop-down class into a custom dropdown and keeps track of selected option
     */
    common.filterDropDown.prototype.buildDropdown = function () {
        var _self = this;
        _self.dropDown = _self.container.querySelectorAll('.js-drop-down');

        Array.prototype.forEach.call(_self.dropDown, function (el, index) {
            el.querySelector('.js-dropdown-trigger').addEventListener('click', function (e) {
                e.preventDefault();

                // toggle dropdown
                core.style.toggleClass(el, 'is-open');
            });

            el.querySelector('.js-dropdown-trigger').addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    core.style.toggleClass(el, 'is-open');
                }
            });

            // get option click
            var options = el.querySelector('.js-drop-down-options');
            var current = el.querySelector('.js-drop-down-current');
            var label = el.querySelector('.js-drop-down-label');

            var onOptionSelect = function (optionEl) {
                // save selected option as current option
                _self.updateCurrent({
                    type: labelToTypeMap[label.innerHTML],
                    title: optionEl.innerHTML,
                    key: optionEl.getAttribute('data-option')
                });

                // toggle dropdown
                core.style.toggleClass(el, 'is-open');

                current.innerHTML = _self.currentOption.title;
            };

            Array.prototype.forEach.call(options.querySelectorAll('[data-option]'), function (optionEl, optionIndex) {
                optionEl.addEventListener('click', function (e) {
                    onOptionSelect(optionEl);
                });
                optionEl.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        onOptionSelect(optionEl);
                    }
                });
            });
        });
    };


})(PULSE.app, PULSE.core, PULSE.app.common);

/*globals PULSE, PULSE.app, PULSE.ui */

( function( app, core, common ) {
    "use strict";

    common.verticalShare = function( element ) {

        var _self = this;

        _self.element =  element;
        _self.copyBtn = _self.element.querySelector( '.js-copy-url' );
        _self.copyMessage = _self.element.querySelector( '.js-copy-message' );
        _self.toggleBtn = _self.element.querySelector( '.js-share-btn' );

        core.event.listenForMultiple( _self.toggleBtn, ['click','keypress'], function(){
            core.style.toggleClass(_self.element, 'is-active');
        } );

        core.event.listenForMultiple( _self.copyBtn, ['click','keypress'], function(){
            _self.copyUrl();
        } );

    };

    common.verticalShare.prototype.copyUrl = function( ) {

        var _self = this;

        _self.shareURL = _self.copyBtn.getAttribute('data-share-url');

        _self.url = _self.shareURL || window.location.href;

        clipboard.copy( _self.url ).then(
            function() {
                _self.copyUrlMessage();
            },
            function(err){
                _self.copyUrlMessage( 'fail' );
            }
        );
    }

    common.verticalShare.prototype.copyUrlMessage = function( fail ) {

        var _self = this;

        core.style.addClass(_self.copyBtn, 'is-active');

        if (fail) {
            core.style.addClass(_self.copyMessage, 'share-vertical__copy-message--fail');
            _self.copyMessage.innerHTML = 'URL could not be copied';
        }

        setTimeout(function() {
            core.style.removeClass(_self.copyBtn, 'is-active');
        }, 2000);
    }

    var widgets = document.querySelectorAll( '[data-widget="share-vertical"]' );
    for( var i = 0; i < widgets.length; i++ ) {
        new common.verticalShare( widgets[ i ], {} );
    }

} )( PULSE.app, PULSE.core, PULSE.app.common );

/*globals PULSE, PULSE.app*/

( function( app, common ) {

	/**
	 * constructor for the page share widget. Widget requires following data attributes to be
	 * present on target button elements;
	 *
	 * data-social - if this contains a url then it will be used as the page share url
	 * data-social-service - the service name ( should correlate to a n entry in the socialLinks
	 * object that is defined in socialHelper Class - ../../js/social-helpers.js)
	 *
	 * @param {Object} element element defining the page share widget
	 * @constructor
	 */
	common.pageShare = function( element, url ) {

		var _self = this;
        _self.element = element;

		if ( _self.element.getAttribute( 'data-social-service' ) === 'twitter' && document.title !== 'International Cricket Council' ) {
			_self.bodyContent = document.title;
		}

		_self.setListeners();
	};

	/**
	 * move up the dom tree to find the element containing the desired data attributes. Do not traverse up past the
	 * widget container. return the data set attribute of the element.
	 *
	 * @param {object} element DOM Element on which to begin the traversal
	 * @returns {object} hash - dataset attribute of the element or false if no element can be found
	 */
	common.pageShare.prototype.getSocialDataset = function( element ) {
		var _self = this,
            inspecting = element;

		do {
			if( inspecting.getAttribute( 'data-social-service' ) ) {
				return inspecting.dataset;
			}
			inspecting = inspecting.parentElement;
		} while ( inspecting !== _self.element );

		return false;
	};

	/**
	 * start listening for click events on the element
	 */
	common.pageShare.prototype.setListeners = function() {
		var _self = this;

		// bind clicks on individual social buttons
		_self.element.addEventListener( 'click', function( evt ) {
            evt.preventDefault();
            evt.stopPropagation();
			// handle clicks on individual social clicks
			var clicked = _self.getSocialDataset( evt.currentTarget );
			if ( clicked && clicked.socialService ) {
				app.socialHelpers[ clicked.socialService ].sharePage( clicked.shareUrl || _self.url, false, clicked.shareBody || _self.bodyContent );
			}
		} );
	};






	/**
	 * constructor for the page share widget. Widget requires following data attributes to be
	 * present on target button elements;
	 *
	 * data-social - if this contains a url then it will be used as the page share url
	 * data-social-service - the service name ( should correlate to a n entry in the socialLinks
	 * object that is defined in socialHelper Class - ../../js/social-helpers.js)
	 *
	 * @param {Object} element element defining the page share widget
	 * @constructor
	 */
	app.pageShare = function( element, url ) {
		var pageShare = new common.pageShare( element, url );
	};

	/**
	 * create the widget instances
	 */
	var widgets = document.querySelectorAll( '.js-social-option' );
	for(var x = 0; x < widgets.length; x++) {
		new app.pageShare( widgets[ x ] );
	}

} )( PULSE.app, PULSE.app.common );

/*globals PULSE, PULSE.app*/


( function( app, common ) {

	/**
	 * @namespace app.socialHelpers.private
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

		this.name = serviceName;

		this.socialLinks = {
			"twitter" : { "shareUrl" : "http://www.twitter.com/intent/tweet?text=" },
			"facebook" : { "shareUrl" : "http://www.facebook.com/sharer/sharer.php?u=" },
			"googleplus" : { "shareUrl" : "http://plus.google.com/share?url=" },
			"whatsapp" : { "shareUrl" : "whatsapp://send?text=" },
			"email" : { }
		};

		this.defualtWindowConfiguration = {
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
	 * @param {{string}} url the url to share on the social media site
	 * @returns {string} url string inclusive of the encoded url
	 */
	socialHelper.prototype.buildShareUrl = function( url, body, useUrlParaAsShareUrl ) {

		var share = url ? url : window.location.href;

        if (useUrlParaAsShareUrl) {
            return url;
        }

		if ( body ) {
			share = body + ' ' + share;
		}

		if ( this.name === 'twitter' ) {
			share += ' #cricket @icc';
		}

		return this.socialLinks[ this.name ].shareUrl + encodeURIComponent( share )
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

			for ( var c = 0; c < settings.length; c++ ) {

				configurationString += settings[ c ] + '=' + windowConfiguration[ settings[ c ] ];

				if( c < ( settings.length -1 ) ) {
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
	 * @param {{string}} url optionally provide a specific url to link to, otherwise the current window.location
	 * will be used to create a share url link
     * @param {{object}} windowConfiguration optionally provide a window configuration object
     * @param {{String}} body optionally provide text to share
	 * @param {{boolean}} useUrlParaAsShareUrl if true, it will use the URL passed as the first parameter instead of the this.socialLinks
	 */
	socialHelper.prototype.sharePage = function( url, windowConfiguration, body, useUrlParaAsShareUrl ) {

		window.open( this.buildShareUrl( url, body, useUrlParaAsShareUrl ), "_blank", this.makeWindowConfigurationString(
			windowConfiguration || this.defualtWindowConfiguration ) );
	};

	/**
	 * keep the social helpers under the app object
	 *
	 * @type {{twitter: socialHelper, facebook: socialHelper, google: socialHelper}}
	 */
	app.socialHelpers = {
		"twitter" : new socialHelper( 'twitter' ),
		"facebook" : new socialHelper( 'facebook' ),
		"google" : new socialHelper( 'googleplus' ),
		"whatsapp" : new socialHelper( 'whatsapp' )
	};

} )( PULSE.app, PULSE.app.common );

/*globals PULSE, PULSE.app, PULSE.ui */

( function( app, core, common ) {

    /**
	 * LinkList
     * Common module that build a dropdown which contains links as items
     * @param {object} element - widget element
	 */
    common.LinkList = function( element ) {

        var _self = this;

        _self.element = element;

        _self.buildDropdown();
    };

    /**
     * LinkList
     * creates a custom dropdown with all event handlers
     */
    common.LinkList.prototype.buildDropdown = function() {
        var _self = this;

        _self.element.querySelector('.js-dropdown-trigger').addEventListener('click', function(e) {
            e.preventDefault();

            // toggle dropdown
            core.style.toggleClass( _self.element, 'is-open' );
        });

        _self.element.querySelector('.js-dropdown-trigger').addEventListener('keypress', function(e) {
            if ( e.key === 'Enter' ) {
                core.style.toggleClass( _self.element, 'is-open' );
            }
        });

    };

    var widgets = document.querySelectorAll( '[data-widget="linklist-dropdown"]' );
    for( var i = 0; i < widgets.length; i++ ) {
        new common.LinkList( widgets[ i ] );
    }

} )( PULSE.app, PULSE.core, PULSE.app.common );

/*globals PULSE, PULSE.app, PULSE.app.common*/

( function( app, common, core ) {

    // pass in the 'created_time' string returned from Instagram
   // stamp arrives formatted as Fri Apr 29 2016 13:59:11 GMT+0100 (BST)
   var parsePostedDate = function(dateString) {
       // by splitting the date string it'll also work for Safari http://stackoverflow.com/a/6427318/1486020
       var a = dateString.split(/[^0-9]/);
       var date = new Date (a[0], a[1]-1, a[2], a[3], a[4], a[5]);
       return date;
   };

   var getUserAccountUrl = function(id) {
       return "https://www.facebook.com/" + id;
   };

   var getPhotoUrl = function(attachments) {
       if (!attachments || attachments.data.length === 0) {
           return null;
       }

       var photoObject = attachments.data[0];

       if (photoObject.subattachments) {
           // post is an album - return url of first image
           return photoObject.subattachments.data[0].media.image.src;
       }

       if(photoObject.media) {
           return photoObject.media.image.src;
       }
       else {
           return null;
       }

   };

   var getAvatar = function(post) {
       if (post.from && post.from.picture) {
           return post.from.picture.data.url;
       }
       return;
   };

   common.getFacebookModel = function(post) {

       var _self = this, model,
           userAccountLink = getUserAccountUrl( post.from.id ),
           postDate = parsePostedDate( post.created_time),
           sinceString = common.getSinceString( postDate ),
           photo = '';

       if (post.type === 'photo') {
           photo = post.picture;
       }

       model = {
           timestamp: sinceString,
           id: post.id,
           text: post.message,
           link: post.permalink_url,
           photo: getPhotoUrl(post.attachments),
           feedType: 'facebook',
           user: {
               id: post.from.id,
               name: post.from.name,
               link: userAccountLink,
               avatarUrl: getAvatar(post)
           }
       };

       return model;

   };

} )( PULSE.app, PULSE.app.common, PULSE.core );

/*globals PULSE, PULSE.app, PULSE.app.common*/

( function( app, common, core ) {

    /**
     * Utility method to scan the given String for what look like HTTP links,
     * Twitter handles and hashtags (called entities), and mark them up with <a> tags.
     *
     * For URLs and media links, use expanded_url as the title and use the
     * display_url provided by Twitter as the text of the anchor tag
     *
     * See: https://dev.twitter.com/docs/tco-url-wrapper/best-practices
     *
     * @param  {String} string   - the original body of the tweet
     * @param  {Object} entities - mapping of types of entities to an array of entity objects
     * @return {String}          - the processed body of the tweet, with anchor tags
     */
    var markUpLinks = function(string, entities)
    {
        // to support the old way of doing things, when entities weren't use
        // to determine links to pages or media and the URL was directly processed
        // from the tweet text body
        if (!entities)
        {
            string = string.replace(/(https{0,1}:\/\/\S+)/g, '<a target="_blank" href="$1">$1</a>')
                .replace(/@(\S+)/g, '<a target="_blank" href="//www.instagram.com/$1">@$1</a>')
                .replace(/#(\S+)/g,
                    '<a target="_blank" href="//www.instagram.com/explore/tags/$1">#$1</a>');

            return string;
        }

        // extrapolate URLs from the identified entities of the tweet
        var entitiesArray = [];

        if (entities.urls)
        {
            for (var i = 0, iLimit = entities.urls.length; i < iLimit; i++)
            {
                var entity = entities.urls[i];

                var html = '<a href="' +
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
            for (var i = 0, iLimit = entities.media.length; i < iLimit; i++)
            {
                var entity = entities.media[i];

                var html = '<a href="' +
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

        if (entities.user_mentions)
        {
            for (var i = 0, iLimit = entities.user_mentions.length; i < iLimit; i++)
            {
                var entity = entities.user_mentions[i];

                var url = getUserAccountUrl(entity.screen_name);

                var html = '<a href="' +
                    url +
                    '" target="_blank">&#64;' +
                    entity.screen_name +
                    '</a>';

                entitiesArray.push(
                {
                    html: html,
                    original: '@' + entity.screen_name,
                    start: entity.indices[0],
                    end: entity.indices[1]
                });
            }
        }

        if (entities.hashtags)
        {
            for (var i = 0, iLimit = entities.hashtags.length; i < iLimit; i++)
            {
                var entity = entities.hashtags[i];

                var url = getSearchTagUrl(entity.text);

                var html = '<a href="' +
                    url +
                    '" target="_blank">&#35;' +
                    entity.text +
                    '</a>';

                entitiesArray.push(
                {
                    html: html,
                    original: '#' + entity.text,
                    start: entity.indices[0],
                    end: entity.indices[1]
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
        for (var i = 0, iLimit = entitiesArray.length; i < iLimit; i++)
        {
            var entity = entitiesArray[i];

            var lowercaseString = string.toLowerCase();
            var lowercaseOriginal = entity.original.toLowerCase();
            entity.start = lowercaseString.search( lowercaseOriginal );
            entity.end = entity.start + entity.original.length;
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
        for (var i = 0, iLimit = entitiesArray.length; i < iLimit; i++)
        {
            var entity = entitiesArray[i];
            var length = entity.start - previousIdx;

            newString += string.substr(previousIdx, length);
            newString += entity.html;

            previousIdx = entity.end;
        }

        /**
         * At the end, add what's left of the original string
         */
        newString += string.substr(previousIdx);

        return newString;
    };

    // pass in the 'created_time' string returned from Instagram
    // stamp arrives formatted as Fri Apr 29 2016 13:59:11 GMT+0100 (BST)
    var parsePostedDate = function(timestamp) {
        var date = new Date(parseInt(timestamp) * 1000);
        return date;
    };

    var getUserAccountUrl = function(screenName) {
        return "https://www.instagram.com/" + screenName;
    };

    common.getInstagramModel = function(post) {

        var _self = this, model,
            userAccountLink = getUserAccountUrl( post.user.username ),
            postDate = parsePostedDate( post.created_time),
            sinceString = common.getSinceString( postDate ),
            photo = '';
            video = {};

        photo = post.images.standard_resolution.url;

        if ( post.type === 'video' ) {
            video = post.videos.standard_resolution;
        }

        model = {
            timestamp: sinceString,
            id: post.id,
            text: markUpLinks(post.caption.text),
            link: post.link,
            type: post.type,
            photo: photo,
            video: video,
            likes: post.likes.count,
            // extended_media: extended_media,
            feedType: 'instagram',
            user: {
                id: post.user.id,
                name: post.user.full_name,
                account: post.user.username,
                link: userAccountLink,
                avatarUrl: post.user.profile_picture
            }
        };

        return model;

    };

} )( PULSE.app, PULSE.app.common, PULSE.core );

/*globals PULSE, PULSE.app, PULSE.app.common*/

( function( app, common, core ) {

	// pass in the 'created_time' string returned from Instagram
    // stamp arrives formatted as Fri Apr 29 2016 13:59:11 GMT+0100 (BST)
    var parsePostedDate = function(dateString) {
        var date = new Date(dateString);
        return date;
    };

    var getUserAccountUrl = function(screenName) {
        return "//twitter.com/" + screenName;
    };

    var getSearchTagUrl = function(topic)
    {
        return "//twitter.com/search?q=%23" + topic;
    };

    /**
     * Utility method to scan the given String for what look like HTTP links,
     * Twitter handles and hashtags (called entities), and mark them up with <a> tags.
     *
     * For URLs and media links, use expanded_url as the title and use the
     * display_url provided by Twitter as the text of the anchor tag
     *
     * See: https://dev.twitter.com/docs/tco-url-wrapper/best-practices
     *
     * @param  {String} string   - the original body of the tweet
     * @param  {Object} entities - mapping of types of entities to an array of entity objects
     * @return {String}          - the processed body of the tweet, with anchor tags
     */
    var markUpLinks = function(string, entities)
    {
        // to support the old way of doing things, when entities weren't use
        // to determine links to pages or media and the URL was directly processed
        // from the tweet text body
        if (!entities)
        {
            string = string.replace(/(https{0,1}:\/\/\S+)/g, '<a target="_blank" href="$1">$1</a>')
                .replace(/@(\S+)/g, '<a target="_blank" href="//twitter.com/$1">@$1</a>')
                .replace(/#(\S+)/g,
                    '<a target="_blank" href="//twitter.com/#!/search?q=%23$1">#$1</a>');

            return string;
        }

        // extrapolate URLs from the identified entities of the tweet
        var entitiesArray = [];

        if (entities.urls)
        {
            for (var i = 0, iLimit = entities.urls.length; i < iLimit; i++)
            {
                var entity = entities.urls[i];

                var html = '<a href="' +
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
            for (var i = 0, iLimit = entities.media.length; i < iLimit; i++)
            {
                var entity = entities.media[i];

                var html = '<a href="' +
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

        if (entities.user_mentions)
        {
            for (var i = 0, iLimit = entities.user_mentions.length; i < iLimit; i++)
            {
                var entity = entities.user_mentions[i];

                var url = getUserAccountUrl(entity.screen_name);

                var html = '<a href="' +
                    url +
                    '" target="_blank">&#64;' +
                    entity.screen_name +
                    '</a>';

                entitiesArray.push(
                {
                    html: html,
                    original: '@' + entity.screen_name,
                    start: entity.indices[0],
                    end: entity.indices[1]
                });
            }
        }

        if (entities.hashtags)
        {
            for (var i = 0, iLimit = entities.hashtags.length; i < iLimit; i++)
            {
                var entity = entities.hashtags[i];

                var url = getSearchTagUrl(entity.text);

                var html = '<a href="' +
                    url +
                    '" target="_blank">&#35;' +
                    entity.text +
                    '</a>';

                entitiesArray.push(
                {
                    html: html,
                    original: '#' + entity.text,
                    start: entity.indices[0],
                    end: entity.indices[1]
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
        for (var i = 0, iLimit = entitiesArray.length; i < iLimit; i++)
        {
            var entity = entitiesArray[i];

            var lowercaseString = string.toLowerCase();
            var lowercaseOriginal = entity.original.toLowerCase();
            entity.start = lowercaseString.search( lowercaseOriginal );
            entity.end = entity.start + entity.original.length;
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
        for (var i = 0, iLimit = entitiesArray.length; i < iLimit; i++)
        {
            var entity = entitiesArray[i];
            var length = entity.start - previousIdx;

            newString += string.substr(previousIdx, length);
            newString += entity.html;

            previousIdx = entity.end;
        }

        /**
         * At the end, add what's left of the original string
         */
        newString += string.substr(previousIdx);

        return newString;
    };

    common.getTweetModel = function( tweet )
    {
        var userAccountLink = getUserAccountUrl( tweet.actor.preferredUsername ),
            tweetDate = parsePostedDate( tweet.postedTime ),
            timestamp = common.getSinceString( tweetDate ),
            photo = '',
            extended_media = [],
            model;

        if( tweet.entities && tweet.entities.media )
        {
            for( var i = 0, iLimit = tweet.entities.media.length; i < iLimit; i++ )
            {
                if( tweet.entities.media[i].type === 'photo' )
                {
                    photo = tweet.entities.media[i].media_url_https;
                }
            }
        }

        if( tweet.twitter_entities && tweet.twitter_entities.media )
        {
            for( var i = 0, iLimit = tweet.twitter_entities.media.length; i < iLimit; i++ )
            {
                var p = tweet.twitter_entities.media[ i ];
                extended_media.push( p.media_url_https );
                photo = p.media_url_https;
            }
        }

        if( tweet.long_object && tweet.long_object.twitter_entities && tweet.long_object.twitter_entities.media ) {

            var longObject = tweet.long_object.twitter_entities.media;

            for( var i = 0, iLimit = longObject.length; i < iLimit; i++ ) {
                if( longObject[i].type === 'photo' ) {
                    photo = longObject[i].media_url_https;
                }
            }
        }

        if( photo !== '')
            photo = photo + ":small";

        model = {
            timestamp: timestamp,
            id: tweet.id,
            text: markUpLinks(tweet.body),
            link: tweet.link,
            photo: photo,
            extended_media: extended_media,
            user: {
                id: tweet.actor.id,
                name: tweet.actor.displayName,
                account: tweet.actor.preferredUsername,
                link: userAccountLink,
                description: tweet.actor.summary,
                avatarUrl: tweet.actor.image
            },
            feedType: 'twitter',
            favorites: tweet.favoritesCount,
            retweets: tweet.retweetCount
        };

        return model;
    };

} )( PULSE.app, PULSE.app.common, PULSE.core );
