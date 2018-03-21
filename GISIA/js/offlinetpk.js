   define([
        "esri/map", "esri/geometry/Circle", "esri/symbols/SimpleFillSymbol",
        "esri/graphic", "esri/layers/GraphicsLayer", "esri/units",
        "dojo/on",
        "tpk/bootstrap-map-js/src/js/bootstrapmap.js",
        "tpk/offline-editor-js/dist/offline-tpk-src.js", "dojo/domReady!"],
        function (Map, Circle, SimpleFillSymbol,
            Graphic, GraphicsLayer, Units, on, BootstrapMap) {

            var map, tpkLayer = null;
            var fileInput, fileInputField;

            var url = "";//document.getElementById("url-input");
            // var urlInputBtn = document.getElementById("url-btn");
            // urlInputBtn.onclick = function () {
            //     getTPK();
            // };

            //initChooseLocalFile();

            /**
             * Choose a TPK file from your local filesystem
             */
            // function initChooseLocalFile() {
            //     fileInputField = document.getElementById("file-input-field");
            //     fileInput = document.getElementById("file-input");
            //     fileInput.addEventListener('change', function () {
            //         console.log("File success");
            //         fileInputField.value = fileInput.files[0].name;
            //         zipParser(fileInput.files[0]);
            //     }, false);
            // }

            function setURL(selectedURL){
                url = selectedURL;
            }
            // Retrieve the TPK file via an HTTP request
            function getTPK(urlToTPK) {
                urlInputBtn.innerHTML = "Get file via url";

                var xhrRequest = new XMLHttpRequest();
                xhrRequest.open("GET", urlToTPK, true);
                xhrRequest.responseType = "blob";
                xhrRequest.onprogress = function (evt) {
                    var percent = 0;

                    if ("total" in evt) {
                        percent = (parseFloat(evt.loaded / evt.total) * 100).toFixed(0);
                    }
                    else {
                        percent = (parseFloat(evt.loaded / evt.totalSize) * 100).toFixed(0);
                    }
                    urlInputBtn.innerHTML = "Get file via url " + percent + "%";
                    console.log("Begin downloading remote tpk file...")
                }

                xhrRequest.error = function (err) {
                    console.log("ERROR retrieving TPK file: " + err.toString());
                    alert("There was a problem retrieve the file.");
                }

                xhrRequest.onload = function (oEvent) {
                    if (this.status == 200) {
                        console.log("Remote tpk download finished.")
                        zipParser(this.response);
                    }
                    else {
                        alert("There was a problem loading the file. " + this.status + ": " + this.statusText)
                    }
                };

                xhrRequest.send();
            }

            // Parse the zip file contents into a zip.Entries object
            function zipParser(blob) {

                O.esri.zip.createReader(new O.esri.zip.BlobReader(blob), function (zipReader) {
                    zipReader.getEntries(function (entries) {
                        initMap(entries);
                        //if(entries)alert("TPK downloaded and unzipped!");
                        zipReader.close(function (evt) {
                            console.log("Done reading zip file.")
                        })
                    }, function (err) {
                        alert("There was a problem reading the file!: " + err);
                    })
                })
            }

            // Initialize the Map and the TPKLayer
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

            }

        }
    )
