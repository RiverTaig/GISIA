var CACHE_NAME = "GISIA-cache-v1.65";
var urlsToCache = [
    "/GISIA/index.html",
    "/GISIA/index2.html",
    "/GISIA/tpk-layer.html",
    "/GISIA/sw.js",
    "/GISIA/css/normalize.css",
    "/GISIA/css/main.css",
    "/GISIA/js/main.js",
    "/GISIA/js/createdatabase.js",
    "/GISIA/js/onlinedetection.js",
    "/GISIA/js/vendor/jquery-3.3.1.min.js",
    "/GISIA/js/vendor/jquery-ui.min.js",
    "/GISIA/resources/images/thumb.png",
    "/GISIA/css/vendor/jquery-ui.min.css",
    "/GISIA/resources/tpk/waterton1_16.zip",
    "/GISIA/arcgis_js_api/library/3.14/3.14/init.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/nls/jsapi_en-us.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/dojox/gfx/svg.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/esri/geometry/Circle.js",
    "/GISIA/arcgis_js_api/library/3.14/3.14/dojo/NodeList-traverse.js",
    "/GISIA/css/images/map/logo-med.png",
    "/GISIA/css/dijit/images/ajax-loader.gif",    
    "/GISIA/js/vendor/bootstrap.min.js",
    "/GISIA/js/helloworld.js",
    "/GISIA/js/basemap.js",
    "/GISIA/html/about.html",
    "/GISIA/html/basemap.html",
    "/GISIA/html/bookmarks.html",
    "/GISIA/html/camera.html",
    "/GISIA/html/data.html",
    "/GISIA/html/helloworld.html",
    "/GISIA/html/home.html",
    "/GISIA/html/tracing.html",    
    "/GISIA/html/map.html",    
    "/GISIA/html/synch.html"
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
                console.log("Opened Cache");
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("fetch",function(event){
    event.respondWith(
        caches.match(event.request)
            .then(function (response){
                if(response){
                    //debugger;
                    console.log("Returning cached file: " + response.url);
                    return response;
                }
                else{ //Since we didn't find the file in the cache, we try to fetch it. 
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