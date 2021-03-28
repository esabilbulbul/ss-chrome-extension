/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * 
 * Dependency:
 * LocalStorage - Ctrl_Zip_Lib.js (lz-string)
 * Link  https://stackoverflow.com/questions/20773945/storing-compressed-json-data-in-local-storage
 * https://catchchallenger.first-world.info/wiki/Quick_Benchmark:_Gzip_vs_Bzip2_vs_LZMA_vs_XZ_vs_LZ4_vs_LZO
 * 
 * 
 */

var gLastResizeMilliTime = -1;//init

var BROWSER_TYPE_OPERA      = "opera";//must be lower case
var BROWSER_TYPE_CHROME     = "chrome";//must be lower case
var BROWSER_TYPE_SAFARI     = "safari";//must be lower case
var BROWSER_TYPE_FIREFOX    = "firefox";//must be lower case
var BROWSER_TYPE_IEXPLORER  = "iexplorer";//must be lower case

var DEVICE_TYPE_SMARTPHONE       = 'sp';
var DEVICE_TYPE_TABLET_PORTRAIT  = 'tp';
var DEVICE_TYPE_TABLET_LANDSCAPE = 'tl';
var DEVICE_TYPE_COMPUTER         = 'pc';

var BASE64_MARKER = ';base64,';

//var BROWSER_INTERNET_EXPLORER = "ie";//keep lowercase !!!
//var BROWSER_CHROME            = "chrome";
//var BROWSER_SAFARI            = "safari";

var SCREEN_MODE_PC           = "PC";
var SCREEN_MODE_TABLET       = "TB";
var SCREEN_MODE_SMARTPHONE   = "SP";

var gHeight=0;
var gWidth=0;
var gBrowserType="";
var gUTILScreenMode;



var gHomePaths = [];

var gRootPath = '';//

var gbGeoCurPosAPIRun = false;

var gGeoCallbackGetLocation = null;

var gUTIL_LAT_COOKIE         = "c.lat";
var gUTIL_LON_COOKIE         = "c.lon";
var gUTIL_COUNTRY_COOKIE     = "c.co";//country code
var gUTIL_COUNTRYNAME_COOKIE = "c.cn";
var gUTIL_STATE_COOKIE   = "c.stt";
var gUTIL_CITY           = "c.cty";
var gUTIL_IP             = "c.ip";
var gUTIL_LANGUAGE       = 'ss-lng';
var gUTIL_BROWSER_ID     = 'ss-bid';
var gUTIL_TOKEN          = 'ss-tk';//This has always been set by server (we just keep this here for reference)
var gUTIL_VERSIONS       = 'ss-ver';
var gUTIL_SIGN_REMEMBER_ME = 'ss-rmb-me';//this way the session will be saved or destroeyd when browser closed

var Util = 
{
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //
    //                              NOTICE
    // 
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    init: function()
    {
        try
        {
            //alert('Util.init');

            Util.browser.getScreenMode(true);
            
            Util.hardware.saveBrowserId();
            
            Util.misc.initLanguageCode();
            
            Util.geo.getGeoLocation();

            //Util.browser.getScreenMode();
            var rc = Util.browser.isMobile();
            if (rc==true)
            {
                gUTILScreenMode = SCREEN_MODE_SMARTPHONE;
            }
        }
        catch(e)
        {
            Util.alert(e.message);
        }
        //alert(Util.testHeight());
    },

    test: function()
    {
        return navigator.userAgent;
    },

    version:
    {
        getVersion: function()
        {
            var sVersionNoClient = '';
            var sPathName = Util.url.getPathName();
            
            var sVersionDataClient = Util.cookie.getCookie(gUTIL_VERSIONS);
            if (Util.misc.isNull(sVersionDataClient)==false)
            {
                var oVersionDataClient = Util.json.parse(sVersionDataClient);
                sVersionNoClient       = oVersionDataClient[sPathName];
            }
            
            return sVersionNoClient;
        },

        check: function()
        {
            var sPathName = Util.url.getPathName();

            Util.version.refreshIfExpired(sPathName);
        },

        refreshIfExpired: function(pName)
        {
            var sURL = 'http://' + Util.url.getDomainName() + '/ss-web-client/SHIPSHUK/WEBSITE/version/version.json?';
            sURL += 'dt=' + Util.dtime.getMilliseconds();

            var rc = Comm.SendAJAXRequest(function(e){ Util.version.onresponse_Refresh(e, this, pName); }, sURL, "", 'POST');

        },

        onresponse_Refresh: function(e, pthis, pName)
        {
            try
            {
                if (!(pthis.readyState == 4 && pthis.status == 200))
                {
                    return ;
                }

                //alert(pthis.responseText);
                var sServerResp = pthis.responseText;
                sServerResp = sServerResp.replace(/\r\n/g, "");
                var oVersion = Util.json.parse(sServerResp);

                if (oVersion!=null)
                {
                    var DTIME_COL_JSON = 'dtime';
                    var sVersionNoServer   = oVersion[pName];
                    var sVersionDataClient = Util.cookie.getCookie(gUTIL_VERSIONS);
                    if (Util.misc.isNull(sVersionDataClient)==true)
                    //if (true)
                    {
                        //null (first time)
                        //Add dtime and save
                        //oVersion.date = '"' + Util.dtime.getMilliseconds() + '"';
                        oVersion[DTIME_COL_JSON] = Util.dtime.getMilliseconds();//this is for client use only
                        var sVersionData = JSON.stringify(oVersion);
                        Util.cookie.createCookie(gUTIL_VERSIONS, sVersionData, 7);//default expiry 7
                    }
                    else
                    {
                        //NOT null
                        //check version if it not outdated
                        //var oVersionDataClient = Util.json.parse(sVersionDataOnClient);
                        //alert(JSON.stringify(oVersionDataClient));
                        var oVersionDataClient = Util.json.parse(sVersionDataClient);
                        var sVersionNoClient   = oVersionDataClient[pName];
                        
                        var nLastLoadTime      = oVersionDataClient[DTIME_COL_JSON];
                        var nNow               = Util.dtime.getMilliseconds();

                        if ( (sVersionNoServer!=sVersionNoClient) &&
                              ((nNow -nLastLoadTime) > 10 * 1000) ) // for now 5 seconds
                             //((nNow -nLastLoadTime) > 20 * 1000) )  //last load if older than 20 seconds
                        {
                            // Clean Cache
                            // Reload
                            Util.cookie.deleteCookie(gUTIL_VERSIONS);
                            window.location.reload(true);
                            alert('reloading');
                        }
                    }
                    //var sVersionOnClient = 
                    //alert(oVersion[pName]);
                }
                /*
                var serverVersion = res.data;
                var lastReload = parseInt(localStorage.getItem("lastReload") || "0");
                var now = new Date().getTime();
                if ( serverVersion.build !== clientVersion.build &&
                     now - lastReload > 60 * 1000 ) 
                {
                    // Prevent infinite reloading.
                    //localStorage.setItem("lastReload", now);
                    //window.location.reload(true); // force page reload
                }
                */
           }
           catch(e)
           {
               Util.alert(e.message);
           }
        },

        // this force to page to renew downloading the pages with ignoring the cached files. Downloads the servers 
        // versions over
        reload: function()
        {
            
        },
    },
    
    alert: function(pMsg)
    {
        alert(pMsg);
    },
    
    exception: 
    {
        getError: function(e)
        {
            return e.message;
        }
    },

    algorithm:
    {
        str:
        {

            similarity_Levenshtein: function(s1, s2) 
            {
                var longer = s1;
                var shorter = s2;
                
                if (s1.length < s2.length) 
                {
                    longer = s2;
                    shorter = s1;
                }
                
                var longerLength = longer.length;
                if (longerLength == 0) 
                {
                  return 1.0;
                }
                
                return (longerLength - Util.algorithm.str.editDistance(longer, shorter)) / parseFloat(longerLength);
            },
            
            editDistance: function(s1, s2)
            {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();

                var costs = new Array();
                for (var i = 0; i <= s1.length; i++)
                {
                  var lastValue = i;
                  for (var j = 0; j <= s2.length; j++)
                  {
                    if (i == 0)
                      costs[j] = j;
                    else 
                    {
                        if (j > 0) 
                        {
                          var newValue = costs[j - 1];
                          if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),costs[j]) + 1;
                        
                          costs[j - 1] = lastValue;
                          lastValue = newValue;
                        }
                    }
                  }
                  if (i > 0)
                    costs[s2.length] = lastValue;
                }
                
                return costs[s2.length];
            }
        }
    },
    
    array: 
    {
        initialize: function(pRowNum, pColNum)
        {
            var aGraphData = [];
            for (var m=0; m<pRowNum; m++)
            {
                aGraphData[m] = [];

                for (var y=1; y<=pColNum; y++)
                {
                    
                    aGraphData[m][y]=0;
                }
            }
            
            return aGraphData;
        }
    },
    
    fontawesome:
    {
        spin: function(pIcon, pbForward)
        {
            return pIcon + ' ' + 'fa-spin fa-fw';
        }
    },

    text:
    {
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //
        //  <span smiley -> :)
        //
        // calculate length without emojis
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        calcLenwoEmoji: function(psTxt)
        {
            var oNodes = Util.xml.getXMLNodes(psTxt);

            var iTotlen = 0;
            var sTxt = psTxt;

            for(var i=0; i<oNodes.length; i++)
            {
                if (!((oNodes[i].nodeType==3) || (oNodes[i].nodeType==4)))//if span
                {
                    iTotlen +=2;
                }
                else
                {
                    iTotlen += oNodes[i].nodeValue.length;
                }
            }

            return iTotlen;
        },

    },

    string:
    {
        replaceAll: function(pSource, pStr2Find, pStr2Replace)
        {
            var str = pSource;

            while(str.indexOf(pStr2Find)>=0)
            {
                str = pSource.replace(str, pStr2Find, pStr2Replace);
            }

            return str;
        },

        quote: function(pStr)
        {
            return '"' + pStr + '"';
        },
        
        leftPad: function(pSource, padStr, length)
        {
            var str = pSource;
            
            while (str.length < length)
                str = padStr + str;
            
            return str;
        },
        
        replaceAll: function(pSrcTxt, pTarget, pReplace)
        {
            var sTxt = pSrcTxt;
            var index = sTxt.indexOf(pTarget);
            while(index>=0)
            {
                sTxt  = sTxt.replace(pTarget, pReplace);
                index = sTxt.indexOf(pTarget);
            }
            return sTxt;
            //return target.replace(new RegExp(search, 'g'), replacement);
        },
 
        toUppercase: function(pStr)
        {
           return pStr.toUpperCase();
        },
        
        //pArgs = Array
        concat: function(pArgs, pSeperator)
        {
            var sFinal = '';
            for (var i=0; i<pArgs.length; i++)
            {
                if (i!=0)
                    sFinal += pSeperator;
                
                sFinal += pArgs[i];
            }
            
            return sFinal;
        }

    },
    
    url: 
    {
        getPathName: function()
        {
            var sURL = window.location.pathname;
            
            var aURLParts = sURL.split('/');
            
            return aURLParts[aURLParts.length-1];
        },
        
        //localhost, shipshuk.com so on 
        getDomainName: function(pURL)
        {
            try
            {
                if (pURL==null)
                    var sURL = document.location.origin;
                    //var sURL = window.location.href; //this is not cross-border solution
                else
                    var sURL = pURL;

                var aURLParts = sURL.split('/');

                return aURLParts[2];
            }
            catch(e)
            {
                
            }
        },
        
        addParam: function(paParams, pName, pVal, pbEncode)
        {
            var index = paParams.length;

            if (pbEncode==true)
                var val = Util.url.encodeBase64(pVal);
            else
                var val = pVal;

           paParams[index] = [];
           paParams[index][0] = pName;
           paParams[index][1] = val;

        },
        
        addURLParam: function(psParamName, psParamVal, pbEncode, pbFirst)
        {
            var sParamStr = "";

            if (pbFirst==false)
                sParamStr += "&";

            if (pbEncode==true)
                sParamStr += psParamName + "=" + Util.url.encodeBase64(psParamVal);
            else
                sParamStr += psParamName + "=" + psParamVal;

            return sParamStr;
        },

        getURLParam: function(pPrmName, pbDecode)
        {
            var prmVal = Util.url.getURLVars()[pPrmName];

            if (typeof prmVal != 'undefined')
            {
                if (pbDecode==false)
                    return prmVal;
                else
                    return decodeURIComponent(prmVal);
            }

            return "";
        },

        getURLVars: function()
        {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 
                                                                                {
                                                                                    vars[key] = value;
                                                                                }
                                                    );
            return vars;
        },
        
        decodeURL: function(pURI)
        {
            return decodeURI(pURI);
        },

        //URLEncoder
        encodeURL: function(pURI)
        {
            return encodeURI(pURI);
        },

        decodeURLComponent: function(pURIComp)
        {
            return Util.url.decodeBase64(pURIComp);
        },

        encodeURLComponent: function(pURIComp)
        {
            return Util.url.encodeBase64(pURIComp);
        },

        encodeBase64: function(pData)
        {
            return encodeURIComponent(pData);
        },

        decodeBase64: function(pData)
        {
            return decodeURIComponent(pData);
        },

    },

    json:
    {
        parse: function(pStr)
        {
            if (Util.json.isJSON(pStr)==true)
            {
                
                return JSON.parse(pStr);
            }
            
            return '{}';//empty json
        },
        
        isJSON: function(pStr)
        {
            try 
            {
                JSON.parse(pStr);
            } 
            catch (e) 
            {
                return false;
            }
            return true;
        },
        
        //It adds a new object and value to json. It creates new one if not exist
        //returns final json string
        addNewObject: function(psJSONString, pObjectName, pObjectVal)
        {
            if (Util.misc.isNull(psJSONString)==true)
            {
                var sFinalVal = "{" + "\"" + pObjectName + "\"" + ':' + pObjectVal + "}";
                return sFinalVal;
            }
            else
            {
                var json          = Util.json.parse(psJSONString);
                if (json[pObjectName]!=null)
                {
                    json[pObjectName] =  pObjectVal;
                    return JSON.stringify(json);
                }
                else
                {
                    var sFinalVal = "{" + "\"" + pObjectName + "\"" + ':' + pObjectVal + "}";
                    return sFinalVal;
                }
            }
            
        },
        
        getVal: function(psJSONSource, pObjectName)
        {
            var json          = Util.json.parse(psJSONSource);
            
            return json[pObjectName];
        }
    },

    geo:
    {
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // You should have this in html code
        // <script language="JavaScript" src="http://geoip.nekudo.com/api?callback=Util.geo.processIP" type="text/javascript"></script>
        // <script language="JavaScript" src="https://freegeoip.net/json/?callback=Util.geo.processIP" type="text/javascript"></script>
        // <script type="application/javascript" src="https://api.ipify.org?format=jsonp&callback=Util.geo.getIP"></script>
        // Reference: https://www.ipify.org/
        // 
        // Other references: (this one to get details 10k / h limited)
        //      http://geoip.nekudo.com/api?callback=Util.geo.processIP
        //      http://freegeoip.net/json/14.192.238.204
        // Also
        //      http://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    
        processIP: function(pJSONIp)
        {
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // geoip.nekudo.com no LIMIT by default
            // but can be blocked if overused
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            //alert(pJSONIp.country);

            // IP
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sIP          = pJSONIp.ip;
            Util.geo.setIP(sIP);

            // COUNTRY CODE
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //gCountryCode = pJSONIp.country_code;//freegeoip
            var sCountryCode = Util.misc.ifNull(pJSONIp.country.code, '');
            Util.geo.setCountryCode(sCountryCode);

            // COUNTRY CODE
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //gCountry     = pJSONIp.country_name;//freegeoip
            var sCountry     = Util.misc.ifNull(pJSONIp.country.name, '');
            Util.geo.setCountryName(sCountry);

            // STATE CODE
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sState       = Util.misc.ifNull(pJSONIp.region_name, '');
            Util.geo.setStateCode(sState);

            //gLatitude    = pJSONIp.latitude;//freegeoip
            //gLongitude   = pJSONIp.longitude;//freegeoip
            var sLatitude    = pJSONIp.location.latitude;
            var sLongitude   = pJSONIp.location.longitude;
            Util.geo.saveLastCordinates(sLatitude, sLongitude);

            // CITY
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sCity        = Util.misc.ifNull(pJSONIp.city,'');
            Util.geo.setCity(sCity);

            if (gGeoCallbackGetLocation!=null)
            {
                gGeoCallbackGetLocation();
                gGeoCallbackGetLocation = null;//to prevent recurisve calls
            }

        },

        //this one only saves city, country, state and ip
        // for reference: https://dev.maxmind.com/geoip/geoip2/javascript/
        processGEOIP2: function(pJSONResp)
        {

            var oResp = JSON.stringify(pJSONResp, undefined, 4);
            var oDets = Util.json.parse(oResp);
            
            var sLongitude = oDets.location.longitude;
            var sLatitude  = oDets.location.latitude;
            Util.geo.saveLastCordinates(sLatitude, sLongitude);
            
            var sIP        = oDets.traits.ip_address;
            Util.geo.setIP(sIP);
            
            // COUNTRY CODE
            //----------------------------------------------------------------
            var sCountry   = oDets.country.names["en"];
            Util.geo.setCountryName(sCountry);

            // COUNTRY CODE
            //----------------------------------------------------------------
            var sCountryCode = oDets.country.iso_code;
            Util.geo.setCountryCode(sCountryCode);

            // COUNTRY CODE
            //----------------------------------------------------------------
            var sCity        = oDets.city.names["en"];
            Util.geo.setCity(sCity);

            // STATE 
            //----------------------------------------------------------------
            var sState       = oDets.subdivisions[0].iso_code;
            Util.geo.setStateCode(sState);

            if (gGeoCallbackGetLocation!=null)
            {
                gGeoCallbackGetLocation();
                gGeoCallbackGetLocation = null;//to prevent recurisve calls
            }
            
            
            
        },
        
        //this one only saves city, country, state and ip
        //for reference : https://dev.maxmind.com/geoip/geoip2/javascript/
        processGEOIP2_Addr: function(pJSONResp)
        {

            var oResp = JSON.stringify(pJSONResp, undefined, 4);
            var oDets = Util.json.parse(oResp);

            // IP
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sIP        = oDets.traits.ip_address;
            Util.geo.setIP(sIP);

            // COUNTRY CODE
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sCountryCode = oDets.country.iso_code;
            Util.geo.setCountryCode(sCountryCode);

            // COUNTRY NAME
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sCountry     = oDets.country.names["en"];//COUNTRY NAME
            Util.geo.setCountryName(sCountry);

            // CITY
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sCity        = oDets.city.names["en"];
            Util.geo.setCity(sCity);

            // STATE
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var sState       = oDets.subdivisions[0].iso_code;
            Util.geo.setStateCode(sState);

            if (gGeoCallbackGetLocation!=null)
            {
                gGeoCallbackGetLocation();
                gGeoCallbackGetLocation = null;//to prevent recurisve calls
            }

        },

        saveLastCordinates: function(pLat, pLon)
        {
            Util.geo.setLatitude(pLat);
            Util.geo.setLongitude(pLon);
            /*
            Util.cookie.createCookie(gUTIL_LAT_COOKIE, pLat, 1000);//100 days expiry
            Util.cookie.createCookie(gUTIL_LON_COOKIE, pLon, 1000);//100 days expiry
            */
        },

        setIP: function(pIp)
        {
            Util.cookie.createCookie(gUTIL_IP, pIp, -1, true);
        },

        // processIP should be executed before this function. See processIP above
        getIP: function()
        {
            return Util.cookie.getCookie(gUTIL_IP);
        },

        //returns in meters
        calculateDistance: function(lat1, long1, lat2, long2)
        {
            //Function prototype definiton
            if (typeof(Number.prototype.toRad) === "undefined")
            {
                Number.prototype.toRad = function()
                {
                    return this * Math.PI / 180;
                }
            }

            var lat1  = lat1;
            var lat2  = lat2;
            var lon1  = long1;
            var lon2  = long2;

            var R =  6371e3; // metres
            var φ1 = lat1.toRad();
            var φ2 = lat2.toRad();
            var Δφ = (lat2-lat1).toRad();
            var Δλ = (lon2-lon1).toRad();

            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            var d = R * c;

            return d;
        },

        getCountry: function(pbUpperCase)
        {
            var sCountryName = Util.geo.getCountryName();
            if (pbUpperCase==true)
                return sCountryName.toUpperCase();
            else
                return sCountryName.toLowerCase();

        },

        getGeoLocation: function(pbForceReset, pCallbackApp)
        {
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //  
            //  By Default initiliaze Lat/Lon with the values from cache
            //  
            //  
            //  
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var Lat = Util.cookie.getCookie(gUTIL_LAT_COOKIE);
            var Lon = Util.cookie.getCookie(gUTIL_LON_COOKIE);
            var CountryCode = Util.cookie.getCookie(gUTIL_COUNTRY_COOKIE);
            
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //                          Init Values
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if (Lat!='')
            {
                Util.geo.saveLastCordinates(Lat, Lon);
                
                Util.geo.setLatitude(Lat);
                Util.geo.setLongitude(Lon);
                
            }
            
            if (CountryCode!='')
            {
                Util.geo.setCountryCode(CountryCode);
            }
            
            gGeoCallbackGetLocation = null;
            
            var loc = navigator.geolocation;
            if (navigator.geolocation)
            //if (false)
            {
                if ((gbGeoCurPosAPIRun==false) || (pbForceReset==true))
                {
                    
                    navigator.geolocation.getCurrentPosition( function(position){ Util.geo.onSuccess_getCurrentPosition(position, pCallbackApp); } );
                    
                    //Get Addrs via ip process                    
                    gGeoCallbackGetLocation = null;
                    //Util.geo.geoLocateByIP('http://geoip.nekudo.com/api?callback=Util.geo.processIP_addr');
                    geoip2.city(Util.geo.processGEOIP2_Addr, Util.geo.onError_GEOIP2);
                    
                }
            }
            else
            {
                //Run Backup GeoIP url
                gGeoCallbackGetLocation = pCallbackApp; 
                //Util.geo.geoLocateByIP('http://geoip.nekudo.com/api?callback=Util.geo.processIP');
                geoip2.city(Util.geo.processGEOIP2, null);
                
            }
        },
        
        onError_GEOIP2: function()
        {
            
        },
        
        //-------------------------------------------------------
        // posDets comes different object set at each flow
        //-------------------------------------------------------
        onSuccess_getCurrentPosition: function(posDets, pCallbackApp)
        {
            Util.geo.oncomplete_getGeoLocation(posDets);

            if (pCallbackApp!=null)
                pCallbackApp();
        },

        geoLocateByIP: function(pURL)
        {
            var script = document.createElement('script');
            /*
            script.onload = function() {
                                            alert('script loaded');
                                       };
            */
            //if (pCallbackonLoad!=null)
            //    script.onload = pCallbackonLoad;
            
            script.src = pURL;
            document.getElementsByTagName('head')[0].appendChild(script);
            
            return script;
        },

        oncomplete_getGeoLocation: function(position)
        {
            gbGeoCurPosAPIRun = true;
            Util.geo.setLatitude(position.coords.latitude);
            Util.geo.setLongitude(position.coords.longitude);

            Util.geo.saveLastCordinates(position.coords.latitude, position.coords.longitude);
        },

        getCurrentLocation: function()
        {
            return Util.geo.getCity() + ', ' + Util.geo.getState();        
        },

        getState: function()
        {
            return Util.geo.getStateCode();
        },

        setLatitude: function(pLat)
        {
            Util.cookie.createCookie(gUTIL_LAT_COOKIE, pLat);
        },

        getLatitude: function()
        {
            try
            {
                return  Util.cookie.getCookie(gUTIL_LAT_COOKIE);

            }
            catch(e)
            {
                return '';
            }
        },
        
        setLongitude: function(pLong)
        {
            Util.cookie.createCookie(gUTIL_LON_COOKIE, pLong);
        },

        getLongitude: function()
        {
            try
            {
                return  Util.cookie.getCookie(gUTIL_LON_COOKIE);

            }
            catch(e)
            {
                return '';
            }
        },

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //
        //                              NOTICE
        //
        //This should be called on the page prior to all
        //<script type="application/javascript" src="https://api.ipify.org?format=jsonp&callback=Util.geo.processIP"></script>
        //
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        getCountryCode: function()
        {
            try
            {
                return  Util.cookie.getCookie(gUTIL_COUNTRY_COOKIE);

            }
            catch(e)
            {
                return '';
            }
        },

        setCountryName: function(pCountry)
        {
            Util.cookie.createCookie(gUTIL_COUNTRYNAME_COOKIE, pCountry);
        },

        getCountryName: function()
        {
            try
            {
                return  Util.cookie.getCookie(gUTIL_COUNTRYNAME_COOKIE);

            }
            catch(e)
            {
                return '';
            }
        },

        setCountryCode: function(pCountryCode)
        {
            Util.cookie.createCookie(gUTIL_COUNTRY_COOKIE, pCountryCode);

        },
        
        setStateCode: function(pStateCode)
        {
            Util.cookie.createCookie(gUTIL_STATE_COOKIE, pStateCode);
            
        },
        
        getStateCode: function()
        {
            try
            {
                return  Util.cookie.getCookie(gUTIL_STATE_COOKIE);

            }
            catch(e)
            {
                return '';
            }
        },
        
        setCity: function(pCity)
        {
            Util.cookie.createCookie(gUTIL_CITY, pCity);
        },
        
        getCity: function()
        {
            try
            {
                return  Util.cookie.getCookie(gUTIL_CITY);
            }
            catch(e)
            {
                return '';
            }
        }
    },

    cookie:
    {
        //
        // pbSessionOnly means deleted on browser closing
        //
        // Expriy if don't set means delete cookie when browser deleted
        createCookie: function(cname, cvalue, expdays, pbSessionOnly)
        {
            var lExpDays = 7;
            if (expdays!=null)
                lExpDays = expdays;

            var d = new Date();

            if (!((lExpDays==-1) || (pbSessionOnly==true)))
            {
                d.setTime(d.getTime() + (lExpDays*24*60*60*1000));

                var expires = "expires="+ d.toUTCString();
            }
            else
            {
                expires = '';
            }
            
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        
        deleteCookie: function(cname)
        {
            var exMins = 0;
            var cvalue = '';
            
            var d = new Date();
            d.setTime(d.getTime() + (exMins*60*1000));
            var expires = "expires="+d.toUTCString();  
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },

        getCookie: function(cname, pbClean)
        {
            if (cname=="")
                return document.cookie;

            var name = cname + "=";

            var ca = document.cookie.split(';');

            for(var i = 0; i <ca.length; i++)
            {
                var c = ca[i].trim();
                while (c.charAt(0) == ' ')
                {
                    c = c.substring(1);
                }
                
                if (c.indexOf(name) == 0)
                {
                    if (pbClean!=true)//default
                    {
                        return c.substring(name.length, c.length);
                    }
                    else
                    {
                        var sCookieVal = c.substring(name.length, c.length);
                        return sCookieVal.replace(/\r\n/g, "");
                    }
                        
                }
            }

            return "";  
        },

        readCookies: function()
        {
            return document.cookie;
        },

    },
    
    image:
    {
        getImageDimensions: function(pImgSrc)
        {
            var img = new Image();
            img.src = pImgSrc;

            var oImgDimObj = {width:img.width, height:img.height, src:pImgSrc};        

            return oImgDimObj;
        },

        ChangeImgSrc: function(pId, pNewSrc)
        {
            document.getElementById(pId).src = pNewSrc;
        },

        getImageLightness: function(imageSrc, callback)
        {
            var img = document.createElement("img");
            img.src = imageSrc;
            img.style.display = "none";
            document.body.appendChild(img);

            var colorSum = 0;

            img.onload = function() 
            {
                // create canvas
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this,0,0);

                var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                var data = imageData.data;
                var r,g,b,avg;

                for(var x = 0, len = data.length; x < len; x+=4) 
                {
                    r = data[x];
                    g = data[x+1];
                    b = data[x+2];

                    avg = Math.floor((r+g+b)/3);
                    colorSum += avg;
                }

                var brightness = Math.floor(colorSum / (this.width*this.height));
                callback(brightness);
            }

        },

    },
    
    format:
    {
        //for locale = https://www.w3schools.com/jsref/jsref_tolocalestring.asp
        //for exxample; en-US, tr-TR
        Str2Date: function(pDateTime, psLocale)
        {
            var sLocale = 'en-US';
            
            if (Util.misc.isNull(psLocale)==false)
                sLocale = psLocale;
            
            if (pDateTime.length>=14)
                var d = new Date( Date.UTC(pDateTime.substr(0, 4), pDateTime.substr(4, 2), pDateTime.substr(6, 2), pDateTime.substr(8, 2), pDateTime.substr(10, 2), pDateTime.substr(12, 2) ));
            else
                var d = new Date( Date.UTC(pDateTime.substr(0, 4), pDateTime.substr(4, 2), pDateTime.substr(6, 2)));//ignoer time part
            
            return d.toLocaleString(sLocale, { timeZone: 'UTC' });
        },
        
        convert2Number: function(psVal)
        {
            var sVal = psVal.replace(',', '');
            if (sVal!='-')
                return parseFloat(sVal);
            else
                return 0;
        },
        
        //counts "." "," and " "
        calcCurrencySeperators: function(psVal)
        {
            var aDotParts   = psVal.split('.');
            var iNumberDots = aDotParts.length-1;
            
            var aCommaParts  = psVal.split(',');
            var iNumberComma = aCommaParts.length-1;
            
            var aSpaceParts  = psVal.split(',');
            var iNumberSpace = aSpaceParts.length-1;
            
            return iNumberDots + iNumberComma + iNumberSpace;
        },

        reformat2Currency: function(psIntegerPart, psFractionPart, piDecimalLength, psFormat)
        {
            var iDecimalLen = 2;//default
            if (Util.misc.isNull(piDecimalLength)==false)
                iDecimalLen = piDecimalLength;

            var sDecimalZeroes =Util.string.leftPad('','0', iDecimalLen);

            var sIntegerFormatted = Util.format.Text2Currency(psIntegerPart, psFormat);
            this.partInteger  = sIntegerFormatted;            
            if (Util.misc.isNull(psFractionPart)==false)
            {
                this.partFraction = (psFractionPart + sDecimalZeroes).substring(0,2);
                this.value        = this.partInteger + '.' + this.partFraction;
            }
            else
            {
                this.partFraction = sDecimalZeroes;
                this.value        = this.partInteger + '.' + this.partFraction;
            }
        },

        //psNumber can come with , or . or can be no numeric
        //psFormat = optional
        //psFractionSetting = optional
        Text2Currency: function(psNumber, psFormat, psFractionSetting)
        {
            var iNumber = 0;
            var sNumber = psNumber;
            
            //Replace signs
            var sNumber = sNumber.replace(/[\D\s\._\-]+/g, "");
            
            //Check if numeric
            iNumber = sNumber ? parseInt( sNumber, 10 ) : 0;
            
            if (sNumber==0)
                return psNumber;
            else
                return Util.format.Number2Currency(iNumber, psFormat, psFractionSetting);
        },

        //For example
        //var iNumber = 10000;
        //iNumber.toLocaleString('en-US');
        //psFormat for example; 'en-US'
        //psFractionSetting = {minimumFractionDigits: 2, maximumFractionDigits: 2}
        //
        //https://www.w3schools.com/jsref/jsref_tolocalestring_number.asp
        //
        Number2Currency: function(piNumber, psFormat, psFractionSetting)
        {
            try
            {
                if (Util.misc.isNull(psFormat)==true)
                {
                    //return piNumber.toLocaleString('en-US', '{minimumFractionDigits: 2, maximumFractionDigits: 2}');//default format
                    //host default language
                    //return piNumber.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});//default format
                    return piNumber.toLocaleString('en-US');//default
                }
                else
                {
                    if (Util.misc.isNull(psFractionSetting)==false)
                        return piNumber.toLocaleString(psFormat, psFractionSetting);//default format
                    else
                        return piNumber.toLocaleString(psFormat);//default format
                }

            }
            catch(e)
            {
                alert(e.message);
                return '';
            }
        },

    },

    misc:
    {
        //server root path i.e www.shipshuk.com 
        setRootPath: function(pPath)
        {
            gRootPath = pPath;
        },

        getRootPath: function()
        {
            return gRootPath;
        },

        getCurrency: function()
        {
            this.currencycode = '';
            this.currencysign = '$';
        },
        
        initLanguageCode: function()
        {
            var CountryCode;
            var LangCode;

            CountryCode = Util.geo.getCountryCode();

            if (CountryCode=="MY")
            {
                LangCode = "en";
            }
            else if (CountryCode=="MM") //Default
            {
                LangCode = "en";
            }
            else if (CountryCode=="TR")
            {
                LangCode = "tr";
            }
            else
            {
                LangCode = "en";//default
            }

            Util.misc.setLanguageCode(LangCode);

            return LangCode;
            
        },
        
        setLanguageCode: function(pLangCode)
        {
            Util.cookie.createCookie(gUTIL_LANGUAGE, pLangCode, 1000);
        },

        getLanguageCode: function()
        {
            var sLan = Util.cookie.getCookie(gUTIL_LANGUAGE);
            if ((sLan==null) || (sLan==''))
                return 'en';
            else
                return sLan;
        },

        isNumber: function(n)
        {
            try
            {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            catch(Err)
            {
                return false;
            }
        },

        ifNull: function(o, f)
        {
            if (Util.misc.isNull(o)==true)
            {
                return f;
            }
            
            return o;
        },
        
        isNull: function(o)
        {
            if (!((o=='') || (o==null)))
            {
                return false;
            }
            else
            {

                return true;
            }
        },

        replaceURLs2AHref: function(psCData)
        {
            //var nbsp = new RegExp(String.fromCharCode(160), "g");
            var sCData     = ' ' + psCData;
            var sFinalData = psCData;

            sCData = Util.string.replaceAll(sCData, '&nbsp;', ' ');
            //Search for urls         
            //var index      = Util.misc.isURLExist(sCData);
            var URLIndexes=[];

            //while(index>=0)
            for (var j=0; j<4; j++)// 1 = http 2 = https 3 = www
            {
                var sURLPattern;
                switch(j)
                {
                    case 0:
                        sURLPattern = 'https://';
                        break;
                    case 1:
                        sURLPattern = 'http://';
                        break;
                    case 2:
                        sURLPattern = ' www.';//must start with space
                        break;
                    case 3:
                        sURLPattern = ' #';
                        break;
                }

                var aList = sCData.split(sURLPattern);
                var lastindex = 0;
                for (var i=0; i<aList.length-1; i++)
                {
                    var index = URLIndexes.length;
                    URLIndexes[index]    = [];
                    URLIndexes[index][0] = sURLPattern;

                    lastindex  += aList[i].length;

                    URLIndexes[index][1] = lastindex;
                    lastindex += sURLPattern.length;
                }

            }

            //Collect URLs to be replaced
            for (var i=0; i<URLIndexes.length; i++)
            {
                var sStartPattern = URLIndexes[i][0];
                var iStartIndex   = URLIndexes[i][1];

                var sURLBlock = sCData.substr(iStartIndex);

                //find 1st space in URL Block
                if ((sStartPattern==' www.') || (sStartPattern==' #'))
                    var indexSpace  = sURLBlock.indexOf(' ',1);
                else
                    var indexSpace  = sURLBlock.indexOf(' ');

                if (indexSpace<0)
                    indexSpace = sURLBlock.length;

                var sURL = sURLBlock.substr(0, indexSpace);
                var iEndIndex = iStartIndex + indexSpace;

                URLIndexes[i][2] = sURL;
                var repPointer = '#' + i;
                sFinalData = sFinalData.replace(sURL.trim(), repPointer);
                URLIndexes[i][3] = repPointer;
                //sFinalData = sFinalData.substring(0, iStartIndex) + "<a href='" + sURL + "'>" + sURL + "</a>" + sFinalData.substring(0, iStartIndex)
                //sFinalData = sFinalData.replace(sURL.trim(), "<a href='" + sURL + "'>" + sURL + "</a>");
            }

            //Replace URLs
            for (var i=0; i<URLIndexes.length; i++)
            {
                var sURL        = URLIndexes[i][2];
                var sRepPointer = URLIndexes[i][3];
                var sAhref = "<a href='" + sURL + "'>" + sURL + "</a>";
                sFinalData = sFinalData.replace(sRepPointer, sAhref);
            }

            return sFinalData;
        },

        isURLExist: function(psTxt)
        {
            //var founded = [];

            //founded[0] = -1;
            //founded[1] = '';

            var index = psTxt.indexOf('https://');
            if (index<0)
            {
                index = psTxt.indexOf('http://');
                if (index<0)
                {
                    index = psTxt.indexOf('www.');

                    //founded[0] = index;
                    //founded[1] = 'www.';
                }
                else
                {
                    //founded[0] = index;
                    //founded[1] = 'http://';
                }
            }
            else
            {
                //founded[0] = index;
                //founded[1] = 'https://';
            }

            return index;
        },

        //This function returns whether the call made from the original intended page or through some other page i.e. mother page 
        //Control objects are only added to form if they are called from their parent forms.
        //For example:
        //Toolbar button will only be added if it is called from frmBody.html; the same button call can be called through other htmls as 
        //init function is same for all main.hmtl -html parts frmBody, frmStatus, frmTop, frmToolbar and etc.
        isCrossBorder: function(pTargetFrameHTMLName)
        {        
            var HTMLName  = Util.window.GetHTMLName();
            var ParentName= Util.window.GetParentHTMLName();//in .html

            if (HTMLName==ParentName)//call made from menu.html so parent=html=menu.html
            {
                if (pTargetFrameHTMLName==HTMLName)//call made from menu.html but target is frmBody, so cross border
                    return false;
            }

            if (HTMLName==pTargetFrameHTMLName)//html=target=body/menu/status.html
                return false;

            return true;
        },
        
        getKey: function(pId, pKeyTag)
        {
            var KeyWords    = pId.split(":");

            for (var i=0;i<KeyWords.length;i++)
            {
                var sKeyWord = ':' + KeyWords[i] + ':';

                if (sKeyWord==pKeyTag)
                {
                    //Next
                    return KeyWords[i+1];
                }
            }
            return "";
        },


    },

    storage:
    {
        
        //pDuration = in day 
        //Only for session 
        //When the main div is fixed
        //the value offsetTop / Left returns 0
        //We try to find the distance from the mother divs
        save: function(pId, pObj, pbSession, pDayLong)
        {
            //storageObj.Id
            //storageObj.Val
            //storageObj.Expiry
            try
            {
                var Expiry = new Date();
                if (pDayLong!=null)
                {
                    Expiry.setDate(Expiry.getDate() + parseInt(pDayLong)); 
                }
                else
                {
                    Expiry = null;
                }

                var SObj = new Util.storage.Object(pId, pObj, Expiry);

                if (typeof(Storage) !== "undefined")
                {
                    if (pbSession==true)
                    {
                        //Save for session
                        //sessionStorage.setItem(pId, JSON.stringify(SObj));
                        Util.storage.pushStorage(pId, JSON.stringify(SObj), true);
                    }
                    else
                    {
                        //Save for good
                        Util.storage.pushStorage(pId, JSON.stringify(SObj), false);
                        //localStorage.setItem(pId, JSON.stringify(SObj));
                    }
                }
                
                return true;
            }
            catch(err)
            {
                return false;
            }
        },

        //pDuration = in day 
        //Only for session 
        //When the main div is fixed
        //the value offsetTop / Left returns 0
        //We try to find the distance from the mother divs
        read: function(pId, pbSession)
        {
            if (pbSession==true)
            {
                //var rawObj =  sessionStorage.getItem(pId);
                var rawObj = Util.storage.popStorage(pId, true);
                var SObj   = Util.json.parse(rawObj);
                return SObj.val;
            }
            else
            {
                //var rawObj = localStorage.getItem(pId);
                var rawObj = Util.storage.popStorage(pId, false);
                if (rawObj!=null)
                {
                    var SObj   = Util.json.parse(rawObj);

                    if (SObj.expiry!=null)
                    {
                        var rc = Util.dtime.isExpired(new Date(SObj.expiry));
                        if (rc==true)
                            return null;
                        else
                            return SObj.val;
                    }
                    else
                    {
                        return SObj.val;
                    }
                }
                else
                {
                    return null;
                }
            }
        },

        pushStorage: function(pId, pVal, pbSession)
        {
            var sVal = LZString.compress(pVal); 
            
            if (pbSession==true)
            {
                sessionStorage.setItem(pId, sVal);
            }
            else
            {
                localStorage.setItem(pId, sVal);
            }
        },
        
        popStorage: function(pId, pbSession)
        {
            if (pbSession==true)
            {
                var sVal = sessionStorage.getItem(pId);
            }
            else
            {
                var sVal = localStorage.getItem(pId);
            }
            
            if (sVal!=null)
                return LZString.decompress(sVal);
            else
                return sVal;
        },

        isExist: function(pId, pbSession)
        {
            if (pbSession==true)
                var ret = Util.storage.popStorage(pId, true);
                //var ret = sessionStorage.getItem(pId);
            else
                var ret = Util.storage.popStorage(pId, false);
                //var ret = localStorage.getItem(pId);
            
            if (Util.misc.isNull(ret)==true) 
                return false;
            else
                return true;
        },

        remove: function(pId, pbSession)
        {
            if (pbSession==true)
                sessionStorage.removeItem(pId);
            else
                localStorage.removeItem(pId);
        },
        
        clearAll: function(pbSession)
        {
            if (pbSession==true)
            {
                sessionStorage.clear();
            }
            else
            {
                localStorage.clear();
            }
        },
        
        //returns the storage usage of localstorage in KB
        getUsage: function()
        {
            return JSON.stringify(localStorage).length;
        },
        
        //pDurationType = m: month, w: week, d: day, h: hour, mi: minute 
        Object: function(pId, pVal, pExpiry)
        {
            this.id     = pId;
            this.val    = pVal;
            this.expiry = pExpiry;
            //this.startdtime  = 
        }
    },

    window:
    {
        //pMaxTimesInSecond = max How many times can be called when resized
        event_resize: function(pCallback, pMaxTimesInSecond)
        {
            window.addEventListener('resize', function(){ Util.window.onresize( pCallback, pMaxTimesInSecond ); });

            //Util.dtime.
        },
        
        onresize: function(pCallback, pMaxTimesInSecond)
        {
            if (pMaxTimesInSecond!=null)
            {
                var iDelay = Math.floor(1000/pMaxTimesInSecond);
                var MilliSeconds = Util.dtime.getMilliseconds();
            
                if (gLastResizeMilliTime!=-1)
                {
                    var iDiff = Math.abs(gLastResizeMilliTime - MilliSeconds);

                    if (iDiff > iDelay)
                        pCallback();
                }
                else
                {
                    //first time running
                    pCallback();
                }
                gLastResizeMilliTime = MilliSeconds;
            }
            else
            {
                //fire each time
                pCallback();
            }
        },

        redirect: function(pURL)
        {
            window.location = pURL;
        },
        
        //Without redirecting page
        setURL: function(pURL, title, path)
        {
            window.history.pushState('shipshuk', 'shipshuk', pURL);
        },

        GetHTMLName: function()//window.location
        {
            var index = location.pathname.lastIndexOf("/");
            var sPath = location.pathname;

            return sPath.substring(index + 1);
        },

        GetParentHTMLName: function()
        {   
            var index =  parent.location.pathname.lastIndexOf("/");
            var sPath =  parent.location.pathname;

            return sPath.substring(index + 1);
            //return parent.location.pathname;
        },

        GetWindowHTMLName: function()
        {   
            var index = window.document.location.pathname.lastIndexOf("/");
            var sPath = window.document.location.pathname;

            return sPath.substring(index + 1);
        },

        getScreenHeight: function()
        {
            return screen.height;
        },

        getScreenWidth: function()
        {
            return screen.width;
        },

        getWindowWidth: function()
        {
            //if ((document.body.clientWidth<500) || (window.innerHeight<500))
            //return document.body.clientWidth;
            //var iWidth = Number(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth );
            //var iWidth = window.innerWidth;//document.documentElement.clientWidth
            var iWidth = document.documentElement.clientWidth;

            if ((iWidth==null) || (iWidth<=0))
            {
                //alert('getWindowWidth=0');
                //iWidth = window.parent.innerWidth;
                iWidth = document.documentElement.clientWidth;
            }

            //if (iWidth<30)
            //    iWidth = screen.innerHeight;
            //return iWidth.toFixed(2);
            return iWidth;
        },

        getWindowHeight: function()
        {
            //var iHeight = window.innerHeight;
            var iHeight = document.documentElement.clientHeight

            //alert('document.documentElement.offsetHeight=' + document.documentElement.offsetHeight);
            if ((iHeight==null) || (iHeight<=0))
            {   
                //iHeight = window.parent.innerHeight;
                iHeight = document.documentElement.clientHeight
                //iHeight = document.documentElement.offsetHeight;
            }

            return iHeight;
        },
        
        nakedHeight: function(psHeight)//12px -> 12
        {
            return Util.window.nakedSize(psHeight);
        },

        nakedSize: function(psViewport)//12px -> 12
        {
            if (psViewport!="")
                return psViewport.substring(0,(psViewport.length-2))

            return 0;
        },

    },

    page:
    {
        
        //global.css must be included
        hideWindowScrollY: function()
        {
            /*
            var oBody = CtrlObj.getBody();
            gBodyInitOverflow = oBody.style.overflow;
            oBody.style.overflowY = 'hidden';
            */
           document.body.className += ' body_noscroll';
        },
        
        resetWindowScrollY: function()
        {
            var sCSS = document.body.className;
            document.body.className = sCSS.replace('body_noscroll', '').trim();

            /*
            var oBody = CtrlObj.getBody();
            gBodyInitOverflow = oBody.style.overflow;
            oBody.style.overflowY = 'auto';   
            */
        },

        getWindowScrollbarWidth: function()
        {
            var iFullWidth  = window.innerWidth;
            var iInnerWidth = document.documentElement.clientWidth;

            return iFullWidth - iInnerWidth;
        },

        setHome: function(pId, pHomePath)
        {
            var Index = gHomePaths.length;

            gHomePaths[Index] = [];
            gHomePaths[Index][0] = pId;
            gHomePaths[Index][1] = pHomePath;
        },

        getHome: function(pId)
        {
            for (var i=0; i<gHomePaths.length; i++)
            {
                if (gHomePaths[i][0]==pId)
                {
                    return gHomePaths[i][1];
                }
            }

            return "";
        },

    },

    element:
    {
        //This way the item can be switched with TAB button 
        addTabIndex: function(pEl, pTabIndex, pbNoFocusBorder)
        {
            pEl.tabIndex = pEl;

            if (pbNoFocusBorder==true)
            {
                pEl.style.outline = 'none';
            }
            //pEl.out
            //outline:none
        },
        
        //returns the script element of the document 
        getCurrentElement: function()
        {
            return document.currentScript;
        },
        
        //returns the script's parent element that is under
        getParentElement: function()
        {
            return document.currentScript.parentNode;
        },
        
        //fixed elements return 0
        getOffsetTop: function(pId, pObj)
        {
            if (pObj==null)
                var obj = CtrlObj.getObject(pId);
            else
                var obj = pObj

            
            let top = 0;
            let left = 0;
            let element = obj;
            
            if (element.offsetTop!=0)
                return element.offsetTop;

            // Loop through the DOM tree
            // and add it's parent's offset to get page offset
            do {
              top += element.offsetTop || 0;
              left += element.offsetLeft || 0;
              element = element.offsetParent;
            } while (element);

            return top;
            /*
            return {
              top,
              left,
            };
            */
            
        },
        
        getOffsetLeft: function(pId, pObj)
        {
            if (pObj==null)
                var obj = CtrlObj.getObject(pId);
            else
                var obj = pObj
            
            let top = 0;
            let left = 0;
            let element = obj;
            
            if (element.offsetLeft!=0)
                return element.offsetLeft;

            // Loop through the DOM tree
            // and add it's parent's offset to get page offset
            do {
              top += element.offsetTop || 0;
              left += element.offsetLeft || 0;
              element = element.offsetParent;
            } while (element);

            return left;
            /*
            return {
              top,
              left,
            };
            */
            
        },
        
        getFontSize: function(pObjId)
        {
            var obj   = document.getElementById(pObjId);
            var style = window.getComputedStyle(obj, null).getPropertyValue('font-size');

            if (style!="")
            {
                var indexPX   = style.indexOf("px");
                var sFontSize = style.substring(0, indexPX);

                return Number(sFontSize);
            }

            return "";

        },

        isExist: function(pObjId)
        {        
            if (document.getElementById(pObjId))
                return true;

            return false;
        },

        isExist_name: function(pObjname)
        {       
            if (document.getElementsByName(pObjname))
                return true;

            return false;
        },
        
        getParentElement: function(pId)
        {
            var El = window.parent.document.getElementById(pId);
            return El;
        },

        getElementHeight: function(pId)
        {
            var oEl = CtrlObj.getObject(pId);
            return oEl.clientHeight;
        },
        
        getElementWidth: function(pId)
        {
            var oEl = CtrlObj.getObject(pId);
            return oEl.clientWidth;
        },

        cleanAllNodes: function(el)
        {
            while (el[0]!=null)
            {
                Util.element.cleanNode(el[0]);
            }
        },
        
        cleanChildNodes: function(el)
        {
            while (el.firstChild) 
            {
                el.removeChild(el.firstChild);
            }
        },
        
        cleanNode: function(el)
        {
            if (el!=null)
                el.remove();
        }

    },

    scroll:
    {
        // returns the distance of the element to the top
        // the value is in pixel value
        // if the pId null or empty, it returns the body element
        distance2Bottom: function(pId)
        {
            //scrollheight: total height (visible + invisible)
            //offsetHeight: total height (visible)
            //scrollTop: # of pixels the element scrolled upward

            if (Util.misc.isNull(pId)==true)
            {
                var iScrollHeight = document.body.scrollHeight;
                var ioffsetHeight = window.innerHeight;
                var iScrollTop    = window.scrollY;
                var iAdjustmentHeight = 18;//tested with firefox and chrom
                
                return (iScrollHeight - (ioffsetHeight + iScrollTop) + iAdjustmentHeight);
            }
            else
            {
                var oEl  = CtrlObj.getObject(pId);

                return (oEl.scrollHeight - (oEl.offsetHeight + oEl.scrollTop));
            }
        }
    },

    browser: 
    {
        getLanguage: function()
        {
            return navigator.language;
        },
        
        getBrowserId: function()
        {
            return Util.hardware.getBrowserId();
        },

        getBrowser: function(pAgent)
        {
            //alert('oop');
            //alert('TTT' + navigator.userAgent.toLowerCase().indexOf(BROWSER_TYPE_FIREFOX));
            var sAgent = String(navigator.userAgent).toLowerCase();
            //alert(s);

            if (gBrowserType!="")
            {
                gBrowserType = BROWSER_TYPE_SAFARI;//default
            
                return gBrowserType;
            }
            //alert(navigator.userAgent);
            //alert(navigator.userAgent.indexOf('OPR'));
            if( (sAgent.indexOf(BROWSER_TYPE_OPERA)>= 0) || (sAgent.indexOf('OPR') >=  0) )
            {
                gBrowserType = BROWSER_TYPE_OPERA;
            }
            else if(sAgent.indexOf(BROWSER_TYPE_CHROME) >=  0 )
            {
                gBrowserType = BROWSER_TYPE_CHROME;
            }
             // WARNING: ALWAYS PUT FIREFOX BEFORE SAFARI
            else if ( (sAgent.indexOf(BROWSER_TYPE_FIREFOX) >= 0 ) ||
                      (sAgent.indexOf("fxios") >=  0 ) )
            {
                gBrowserType = BROWSER_TYPE_FIREFOX;
            }
            else if(sAgent.indexOf(BROWSER_TYPE_SAFARI) >=  0)
            {
                gBrowserType = BROWSER_TYPE_SAFARI;
            }
            else if((sAgent.indexOf(BROWSER_TYPE_IEXPLORER) >=  0) || (!!document.documentMode == true )) //IF IE > 10
            {
                gBrowserType = BROWSER_TYPE_IEXPLORER;
            }  
            else 
            {
               gBrowserType = 'unknonw';//By Default
               return 'unknown';
            }

            return gBrowserType;

            
        },
        
        getBrowserType: function()
        {
            return Util.browser.getBrowser();
        },
        
        isMobile: function()
        {
            var check = false;

            // device detection
            //if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            //    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) 
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) 
                check = true;

            return check;
        },

        getScreenMode: function(pbRefresh)
        {
            if (pbRefresh!=true)
            {
                return gUTILScreenMode;
            }

            //Calculate Window
            gHeight = Util.window.getWindowHeight();
            gWidth  = Util.window.getWindowWidth();
            //gHeight = Util.window.getScreenHeight();
            //gWidth  = Util.window.getScreenWidth();

            //Calculate Screen
            //var iHeight = Util.window.getScreenHeight();//Util.window.getScreenHeight();
            //var iWidth  = Util.window.getScreenWidth(); //Util.window.getScreenWidth();
            var iHeight = Util.window.getWindowHeight();//Util.window.getScreenHeight();
            var iWidth  = Util.window.getWindowWidth(); //Util.window.getScreenWidth();

            var iScreenSize   = iHeight * iWidth;

            //if (iScreenSize < (400*600) )//(320*480)
            /*
            if (iScreenSize < (600*800) )//(320*480)
            {
                return SCREEN_MODE_SMARTPHONE; //Smartphone
            }
            */
            //alert('DIMENSIONS:' + iHeight + ' : ' + iWidth);

            var MIN_SIZE_PC     = 1024*768;
            var MAX_SIZE_PHONE  = 800*480;

            if (iScreenSize >= MIN_SIZE_PC)
            {
                gUTILScreenMode=SCREEN_MODE_PC;
                return gUTILScreenMode;
            }
            else if (iScreenSize > MAX_SIZE_PHONE )
            {
                gUTILScreenMode=SCREEN_MODE_TABLET;
                return gUTILScreenMode;//Tablet
            }
            else 
            {            
                //alert('phone');
                gUTILScreenMode=SCREEN_MODE_SMARTPHONE;
                return gUTILScreenMode; //Smartphone
            }

        },
        
        isScreenLandscape:function()
        {
            var iRatio = gWidth / gHeight;

            if (iRatio>1.3)
                return true;
            else
                return false;
        },


    },
    
    units:
    {
        setEM: function(pSize, pbNoSuffix)
        {
            if (pbNoSuffix==true)
            {
                return pSize;
            }
            else
            {
                //pSize = pSize * 0.5;
                //return pSize + 'px';//for now
                return pSize + 'em';
            }
        },

        setVW: function(pSize, pbNoSuffix)
        {
            if (pbNoSuffix==true)
            {
                return pSize;
            }
            else
            {
                //pSize = pSize * 0.5;
                //return pSize + 'px';//for now
                return pSize + 'em';
                //return pSize + 'vw';
            }
        },
        
        setVW2: function(pSize, pbNoSuffix)
        {
            if (pbNoSuffix==true)
            {
                return pSize;
            }
            else
            {
                //pSize = pSize * 0.5;
                //return pSize + 'px';//for now
                return pSize + 'vw';
                //return pSize + 'vw';
            }
        },

        setVH: function(pSize, pbNoSuffix)
        {
            if (pbNoSuffix==true)
            {
                return pSize;
            }
            else
            {
                //pSize = pSize * 0.5;

                return pSize + 'em';
                //return pSize + 'vh';
            }
        },

        setVH2: function(pSize, pbNoSuffix)
        {
            if (pbNoSuffix==true)
            {
                return pSize;
            }
            else
            {
                //pSize = pSize * 0.5;

                return pSize + 'vh';
                //return pSize + 'vh';
            }
        },

        // 100    vw = X px
        // Target vw = ? px
        vw2px: function(pTargetvw)
        {
            if (gWidth==0)
            {
                //Util.browser.getScreenMode(true);
                gWidth = Util.window.getWindowWidth();
                //gWidth = Util.window.getScreenWidth();
            }

            var iW = (gWidth * (pTargetvw / 100));

            return iW.toFixed(2);
        },

        em2px: function(pEMSize)
        {
            var tempDiv = document.getElementById('emdiv_');
            if (tempDiv==null)
            {
                tempDiv = document.createElement("div");
                tempDiv.id = 'emdiv_';
                tempDiv.style.height = '1em';
                document.body.appendChild(tempDiv);
                tempDiv.style.visibility = 'hidden';            
            }
            return tempDiv.offsetHeight * pEMSize;
        },

        px2em: function(pTargetpx)
        {
            //default px2em 1/16
            return (pTargetpx * (1/16));
        },

        px2vw: function(pTargetpx)
        {
            if (gWidth==0)
            {
                gWidth = Util.window.getWindowWidth();
                //gWidth = Util.window.getScreenWidth();
            }

            return (pTargetpx * 100) / gWidth;

        },

        // 100    vh = X px
        // Target vh = ? px
        vh2px: function(pTargetvh)
        {
            if (gHeight==0)
            {
                gHeight = Util.window.getWindowHeight();
                //gHeight = Util.window.getScreenHeight();
            }

            var iH = (gHeight * (pTargetvh/ 100));// * 1.3;

            return iH.toFixed(2);
        },

        px2vh: function(pTargetpx)
        {
            if (gHeight==0)
            {
                gHeight = Util.window.getWindowHeight();
                //gHeight = Util.window.getScreenHeight();
            }

            return (pTargetpx * 100) / gHeight;
        },

        vwh2px: function(pTarget_vp)
        {
            if (gHeight>gWidth)
                return Util.units.vh2px(pTarget_vp);
            else
                return Util.units.vw2px(pTarget_vp);
        },

    },
    
    style:
    {
        addStyleAttrib: function(pName, pValue)
        {
            return pName + ': ' + pValue + '; ';
        },

    },
    
    xml:
    {
        getXMLNodes: function(psTxt)
        {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString('<div>' + psTxt + '</div>',"text/xml");
            var oChildNodes = xmlDoc.getElementsByTagName("div")[0].childNodes;

            return oChildNodes;
        },
    },

    dtime:
    {
        //since the begining January 1, 1970
        // kinda like tick count
        getMilliseconds: function()
        {
            var d = new Date();
            var n = d.getTime();
            
            return n;
        },

        getMonthName: function(piMonthNo, pLang)
        {
            switch(piMonthNo)
            {
                case 1:
                    
                    if (pLang=='tr')
                        return 'Ocak'
                    else
                        return 'January';
                    
                    break;
                
                case 2:
                    
                    if (pLang=='tr')
                        return 'Subat'
                    else
                        return 'February';
                    
                    break;

                case 3:
                    
                    if (pLang=='tr')
                        return 'Mart'
                    else
                        return 'March';
                    
                    break;

                case 4:
                    
                    if (pLang=='tr')
                        return 'Nisan'
                    else
                        return 'April';
                    
                    break;

                case 5:
                    
                    if (pLang=='tr')
                        return 'Mayis'
                    else
                        return 'May';
                    
                    break;

                case 6:
                    
                    if (pLang=='tr')
                        return 'Haziran'
                    else
                        return 'June';
                    
                    break;

                case 7:
                    
                    if (pLang=='tr')
                        return 'Temmuz'
                    else
                        return 'July';
                    
                    break;

                case 8:
                    
                    if (pLang=='tr')
                        return 'Agustos'
                    else
                        return 'August';
                    
                    break;

                case 9:
                    
                    if (pLang=='tr')
                        return 'Eylul'
                    else
                        return 'September';
                    
                    break;

                case 10:
                    
                    if (pLang=='tr')
                        return 'Ekim'
                    else
                        return 'October';
                    
                    break;

                case 11:
                    
                    if (pLang=='tr')
                        return 'Kasim'
                    else
                        return 'November';
                    
                    break;

                case 12:
                    
                    if (pLang=='tr')
                        return 'Aralik'
                    else
                        return 'December';

                    break;

            }
        },
        
        //caution: also native function with the same name
        //getDate: function()
        //{
        //    return new Date();
        //},
        
        //Date paraemeters are new Date()
        isExpired: function(pTargetDate)
        {
            var year  = pTargetDate.getFullYear();
            var month = pTargetDate.getMonth();
            var day   = pTargetDate.getDate();
            
            var dateToday   = new Date();
            
            var year_today  = dateToday.getFullYear();
            var month_today = dateToday.getMonth();
            var day_today   = dateToday.getDate();
            
            if (year_today>year)
                return true;
            
            if (year_today==year)
            {
                if (month_today>month)
                    return true;
            
                if (month_today==month)
                {
                    if (day_today>day)
                        return true;
                }
            }
            
            return false;
        },
        
        getmsTime: function()
        {
            var d = new Date();

            return d.getTime();
        },

        getYYMMDDHHmmSS: function()
        {
            var d = new Date();
            
            var YYYY = d.getFullYear().toString();
            var MM   = (d.getMonth()+1).toString();
            var DD   = d.getDate().toString();
            var HH   = d.getHours().toString();
            var mm   = d.getMinutes().toString();
            var SS   = d.getSeconds().toString();
            
            var YYMMDDHHmmSS;
            
            YYMMDDHHmmSS = YYYY.substring(2,4);
            if (MM.length==1)
                YYMMDDHHmmSS += '0' + MM;
            else
                YYMMDDHHmmSS += MM;

            if (DD.length==1)
                YYMMDDHHmmSS += '0' + DD;
            else
                YYMMDDHHmmSS += DD;

             if (HH.length==1)
                YYMMDDHHmmSS += '0' + HH;
            else
                YYMMDDHHmmSS += HH;

            if (mm.length==1)
                YYMMDDHHmmSS += '0' + mm;
            else
                YYMMDDHHmmSS += mm;

            if (SS.length==1)
                YYMMDDHHmmSS += '0' + SS;
            else
                YYMMDDHHmmSS += SS;

            return YYMMDDHHmmSS;
        }
        
    },

    random:
    {
        generateRandom: function()
        {
            var sYYMMDDHHmmSS = Util.dtime.getYYMMDDHHmmSS();
            
            var sPart1 = sYYMMDDHHmmSS.substring(0,12);
            
            var sRandNo = Math.random().toString();//generates between 0-1
            
            var n = sRandNo.indexOf('.');
            
            var FinalRandNo = sRandNo.substr(n+1);
            
            return sPart1 + FinalRandNo;
        },

    },
    
    gmap:
    {
        generateGMAPLink: function(pLat, pLong, piZoom)
        {
            var iZoom = 10;//default
            if (Util.misc.isNull(piZoom)==false)
                iZoom = piZoom;

            return 'https://maps.google.com/?z=' + piZoom + '&q=' + pLat + ',' + pLong;
            /*
            oA_Addr.innerHTML = psAddr;
            oA_Addr.href = 'https://maps.google.com/?z=10&q=' + pLat + ',' + pLong;//lat + lon
            oA_Addr.target = '_blank';
            oA_Addr.title  = psAddr;
            */
        },
    },

    animation:
    {
        transformX: function(pObj, pDelta, pTransitionSecs, pStyleInherit)
        {
            var sStyle = pStyleInherit;
            sStyle += Util.style.addStyleAttrib("transform" , "translateX(" + pDelta + ")");
            if (pTransitionSecs>0)
            {
                sStyle += Util.style.addStyleAttrib("transition", "all " + pTransitionSecs + "s ease");
            }

            pObj.setAttribute('style',sStyle);
        },

        transformY: function(pObj, pDelta, pTransitionSecs, pStyleInherit)
        {
            var sStyle = '';
            if (Util.misc.isNull(pStyleInherit)==false)
                sStyle = pStyleInherit + ';';

            sStyle += Util.style.addStyleAttrib("transform" , "translateY(" + pDelta + ")");
            if (pTransitionSecs>0)
            {
                sStyle += Util.style.addStyleAttrib("transition", "all " + pTransitionSecs + "s ease");
            }

            pObj.setAttribute('style',sStyle);
        }

    },

    hardware:
    {
        //This function generates per device unique ID
        //The methodology used for this in the following link
        //https://andywalpole.me/blog/140739/using-javascript-create-guid-from-users-browser-information
        //https://stackoverflow.com/questions/27247806/generate-unique-id-for-each-device
        //max about 40
        getBrowserId: function()
        {
            return Util.hardware.getDeviceID();
            /*
            var sBrowserId = Util.hardware.getDeviceID();

            Util.cookie.createCookie(gCOOKIENAME_BROWSER, sBrowserId, -1, true);

            return sBrowserId;
            */
        },

        saveBrowserId: function()
        {
            var sBrowserId = Util.hardware.getDeviceID();

            Util.cookie.createCookie(gUTIL_BROWSER_ID, sBrowserId, -1, true);

        },

        getDeviceID: function()
        {
            var navigator_info = window.navigator;
            var screen_info = window.screen;
            var uid = navigator_info.mimeTypes.length;

            uid += navigator_info.userAgent.replace(/\D+/g, '');
            uid += navigator_info.plugins.length;
            uid += screen_info.height || '';
            uid += screen_info.width || '';
            uid += screen_info.pixelDepth || '';

            return uid;
        },

        getDeviceType: function()
        {
            var DEVICE_QUERY_MOBILE           = '(min-width: 480px)';
            var DEVICE_QUERY_TABLET_PORTRAIT  = '(min-width: 768px)';
            var DEVICE_QUERY_TABLET_LANDSCAPE = '(min-width: 992px)';
            var DEVICE_QUERY_PC               = '(min-width: 1200px)';

            if (window.matchMedia(DEVICE_QUERY_PC).matches==true)
            {
                return DEVICE_TYPE_COMPUTER;
                
            }
            else if (window.matchMedia(DEVICE_QUERY_TABLET_LANDSCAPE).matches==true)
            {
                return DEVICE_TYPE_TABLET_LANDSCAPE;
            }
            else if (window.matchMedia(DEVICE_QUERY_TABLET_PORTRAIT).matches==true)
            {
                return DEVICE_TYPE_TABLET_PORTRAIT;
            }
            else
            {
                return DEVICE_TYPE_SMARTPHONE;
            }
        }
    },

    conversion:
    {
        //from DataURL2Binary
        convertDataURIToBinary: function(dataURI)
        {
            var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataURI.substring(base64Index);
            var raw = window.atob(base64);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));

            for(i = 0; i < rawLength; i++) {
              array[i] = raw.charCodeAt(i);
            }
            return array;
        }
    },
    
    file:
    {
        //https://www.html5rocks.com/en/tutorials/file/dndfiles/
        //pLen = 0 - Nth byte of the file
        calculateFileHash_Sha256: function(pId, pFile, pLen, pCallback)
        {
            //var files = document.getElementById("sampleFile").files;
            //var file  = files[0];
            var reader = new FileReader();
            
            reader.onloadend = function(evt){ Util.file.oncomplete_FileHashSha256(evt, pId, pLen, pCallback); };

            var blob = pFile.slice(0, pLen + 1);
            reader.readAsDataURL(blob);
            //reader.readAsBinaryString(blob); 
            //reader.readAsArrayBuffer(blob);
            //reader.readAsText(blob, 'UTF-8');

        },
        
        oncomplete_FileHashSha256: function(evt, pId, pLen, pCallback)
        {
            if (evt.target.readyState == FileReader.DONE)
            {
                var dataURI = evt.target.result;
                var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                var base64 = dataURI.substring(base64Index);

                var sFinalData = base64.substring(0, pLen);
                var sHash = Util.crypto.sha256.calculate(sFinalData);

                if (pCallback!=null)
                    pCallback(pId, sHash);
            }
        }
    },
    
    crypto:
    {
        sha256:
        {
            calculate: function(psData)
            {
                try
                {
                    var sha256 = new jsSHA('SHA-256', 'TEXT'); 
                    sha256.update(psData);
                    var hash = sha256.getHash("HEX");

                    return hash;
                }
                catch(e)
                {
                    //make sure you have included the following library
                    // <script src="../../CONTROLS/crypto/sha256/sha256.js" type="text/javascript"/></script>
                    Util.alert(e.message);    
                }
            }
        }
    }

}


