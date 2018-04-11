//"http://localhost/GISIA/tpk/bootstrap-map-js/src/css/bootstrapmap.css"
//"http://localhost/GISIA/arcgis_js_api/library/3.14/3.14/dojo/resources/blank.gif"
//"http://localhost/GISIA/arcgis_js_api/library/3.14/3.14/dojo/resources/blank.gif"
var CACHE_NAME = "GISIA-cache-v1.193";
var urlsToCache = [
    "/GISIA/",
    "/GISIA/index.html",
    "/GISIA/tpk-layer.html",
    "/GISIA/sw.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/dojo/resources/blank.gif",
    "/GISIA/favicon.ico",
    "/GISIA/css/normalize.css",
    "/GISIA/css/main.css",
    "/GISIA/js/main.js",
    "/GISIA/js/createdatabase.js",
    "/GISIA/js/offlinetpk2.js",
    "/GISIA/js/onlinedetection.js",
    "/GISIA/js/vendor/jquery-3.3.1.min.js",
    "/GISIA/js/vendor/jquery-ui.min.js",
    "/GISIA/resources/images/thumb.png",
    "/GISIA/css/vendor/jquery-ui.min.css",
    "/GISIA/resources/tpk/waterton1_16.zip",
    "/GISIA/arcgis_js_api/library/3.14/3.14/init.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/nls/jsapi_en-us.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/dojox/gfx/svg.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/map.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/geometry/circle.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/dojo/on.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/symbols/simplefillsymbol.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/graphic.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/layers/graphicslayer.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/units.js",
    "/GISIA/js/tpk/bootstrap-map-js/src/js/bootstrapmap.js",
    "/GISIA/js/tpk/bootstrap-map-js/src/css/bootstrapmap.css",
    "/GISIA/tpk/bootstrap-map-js/src/css/bootstrapmap.css",
    "/GISIA/bootstrap/3.2.0/css/bootstrap.min.css",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/css/esri.css",
    "/GISIA/js/tpk/offline-editor-js/dist/offline-tpk-src.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/dojo/NodeList-traverse.js",
    "/GISIA/css/images/map/logo-med.png",
    "/GISIA/css/dijit/images/ajax-loader.gif",    
    "/GISIA/js/vendor/bootstrap.min.js",
    "/GISIA/js/Basemap/BasemapModel.js",
    "/GISIA/js/Basemap/BasemapViewModel.js",
    "/GISIA/js/Basemap/BasemapView.js",
    "/GISIA/html/about.html",
    "/GISIA/html/Basemap.html",
    "/GISIA/html/bookmarks.html",
    "/GISIA/html/camera.html",
    "/GISIA/html/Data.html",
    "/GISIA/js/Data/DataModel.js",
    "/GISIA/js/Data/DataViewModel.js",
    "/GISIA/js/Data/DataView.js",    
    "/GISIA/html/helloworld.html",
    "/GISIA/html/home.html",
    "/GISIA/html/tracing.html",    
    "/GISIA/html/Map.html",    
    "/GISIA/html/synch.html",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/images/map/logo-med.png",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/dijit/images/ajax-loader.gif",
    "/GISIA/resources/kml/palmsprings.kml"
];

if ('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('sw.js').then(function(registration){
        console.log("Service Worker registration successful for version "  + CACHE_NAME +  " with scope: ", registration.scope);
    }).catch(function(err){
        console.log("ServiceWorker registration failed");
    }
    );
}

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then (function (cache){
                try{
                console.log("Opened Cache");
                return cache.addAll(urlsToCache);
                }
                catch(e){
                    debugger;
                }
            })
    );
});

self.addEventListener("fetch",function(event){
    //console.log("GETTING FILE: " + event.request);
    event.respondWith(
        caches.match(event.request)
        
            .then(function (response){
                if(response){
                    //debugger;
                    console.log("Returning cached file: " + response.url);
                    return response;
                }
                else{ //Since we didn't find the file in the cache, we try to fetch it. 
                    console.log("file not found - CaSe MaTtErS " );
                    debugger;
                    var fetchRequest = event.request.clone();//clone first since request/response are streams
                    
                    return fetch(fetchRequest)
                        .then(function(response){
                            if(! response || response.status !== 200 || response.type !== 'basic'){
                                console.log("error trying to fetch " + fetchRequest.url);
                                return response; //Tried to fetch from online but it didn't work
                            }
                            //Online success
                            var responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(function(cache){
                                    console.log("Caching: " + event.request.url);
                                    cache.put(event.request, responseToCache);
                                });
                            return response; //return the online response to browser for display. 
                        });
                }
            })
    );
});

// Delete outdated caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key, i) {
          if (key !== CACHE_NAME) {
            return caches.delete(keyList[i])
          }
        }))
      })
    )
  })