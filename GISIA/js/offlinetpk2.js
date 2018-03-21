define([
    "esri/map", "esri/geometry/Circle", "esri/symbols/SimpleFillSymbol", "esri/graphic",
    "esri/layers/GraphicsLayer", "esri/units", "dojo/on",
    "tpk/bootstrap-map-js/src/js/bootstrapmap.js",
    "tpk/offline-editor-js/dist/offline-tpk-src.js"],
    function (Map, Circle, SimpleFillSymbol, Graphic, GraphicsLayer, Units, on, BootstrapMap) {
        var privateValue = 0;
        var map, tpkLayer = null;        
        var testStringFunc = function () {
            return "sample value";
        };

        var zipParser = function (blob) {
            
            O.esri.zip.createReader(new O.esri.zip.BlobReader(blob), function (zipReader) {
                zipReader.getEntries(function (entries) {
                    console.log("entries!!");
                    //debugger;
                    initMap(entries);
                    if(entries){
                        console.log("TPKs downloaded and unzipped!");
                    }
                    zipReader.close(function (evt) {
                         console.log("Done reading zip file.")
                    });
                }, function (err) {
                    alert("There was a problem reading the file!: " + err);
                })
            })
        };
        function initMap(entries) {

            //Destroy the old map so we can reload a new map
            if (tpkLayer != null) {
                map.removeLayer(tpkLayer);
                map.destroy();
                tpkLayer = null;
            }

            map = BootstrapMap.create("mapDiv", {});

            tpkLayer = new O.esri.TPK.TPKLayer();
            tpkLayer.on("progress", function (evt) {
                console.log("TPK loading...");
            })
            tpkLayer.extend(entries);
            var symbol = new SimpleFillSymbol().setColor(null).outline.setColor("blue");
            var gl = new GraphicsLayer({ id: "circles" });
            map.addLayer(tpkLayer);
            map.addLayer(gl);
            map.on("click", function (e) {
                var radius = map.extent.getWidth() / 10;
                var circle = new Circle({
                    center: e.mapPoint,
                    geodesic: false,
                    radius: 5280,
                    radiusUnit: Units.FEET
                });
                var graphic = new Graphic(circle, symbol);
                gl.add(graphic);
            });

        };
        return {
            circle: function () {
                var circle = new Circle({
                    geodesic: false,
                    center: new Point(123, 234),
                    radius: 5280,
                    radiusUnit: Units.FEET
                });
                var tester = testStringFunc();
                return tester;
            },
            getTPK: function (urlToTPK) {
                //urlInputBtn.innerHTML = "Get file via url";

                var xhrRequest = new XMLHttpRequest();
                xhrRequest.open("GET", urlToTPK, true);
                xhrRequest.responseType = "blob";
                /*xhrRequest.onprogress = function (evt) {
                    var percent = 0;
    
                    if ("total" in evt) {
                        percent = (parseFloat(evt.loaded / evt.total) * 100).toFixed(0);
                    }
                    else {
                        percent = (parseFloat(evt.loaded / evt.totalSize) * 100).toFixed(0);
                    }
                    urlInputBtn.innerHTML = "Get file via url " + percent + "%";
                    console.log("Begin downloading remote tpk file...")
                }*/

                xhrRequest.error = function (err) {
                    console.log("ERROR retrieving TPK file: " + err.toString());
                    alert("There was a problem retrieve the file.");
                }

                xhrRequest.onload = function (oEvent) {
                    if (this.status == 200) {
                        console.log("Remote tpk download finished.");

                        zipParser(this.response);
                    }
                    else {
                        alert("There was a problem loading the file. " + this.status + ": " + this.statusText)
                    }
                };

                xhrRequest.send();
            },

            increment: function () {
                let y = Base;
                y.helloWorld();
                privateValue++;
            },

            decrement: function () {
                privateValue--;
            },

            getValue: function () {
                return privateValue;
            }
        };
    });

// Parse the zip file contents into a zip.Entries object
