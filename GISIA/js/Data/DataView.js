define(["require", "exports", "esri/layers/KMLLayer"], function (require, exports, KMLLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataView = /** @class */ (function () {
        function DataView() {
            this._viewModel = null;
            console.log("Data viewer constructor");
        }
        DataView.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
            //this._viewModel.GetTPK("http://localhost/GISIA/resources/tpk/waterton1_16.zip");
            var select = document.getElementById("DataViewSelect");
            var optElement = document.createElement("option");
            optElement.text = "Palm Springs";
            optElement.value = "http://localhost/GISIA/resources/kml/palmsprings.kml";
            optElement.selected = true;
            select.add(optElement, null);
            //select.appendChild(x);
            select.add(optElement, null);
            optElement = document.createElement("option");
            optElement.text = "Waterton";
            optElement.value = "http://localhost/GISIA/resources/tpk/PS1-14.zip";
            optElement.selected = true;
            select.add(optElement, null);
        };
        DataView.prototype.onAddDataToMapClick = function () {
            if (window.DEBUG) {
                debugger;
            }
            console.log("on add to map click");
            var select = document.getElementById("DataViewSelect");
            var url = select[select.selectedIndex].value;
            console.log(url);
            var kmlUrl = "http://localhost/GISIA/resources/kml/tpk/palmsprings.kml";
            var kmlLayer = new KMLLayer("kmlLayer", kmlUrl);
            var map;
            map = window.gisia.map;
            map.addLayer(kmlLayer);
            kmlLayer.on("load", function () {
                alert("layer loaded");
                //domStyle.set("loading", "display", "none");
            });
            // require([
            //     "esri/layers/KMLLayer",
            //     "dojo/parser", "dojo/dom-style",
            //     "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
            //   ], function(KMLLayer : esri.KMLLayer  ,
            //     parser, domStyle
            //   ) {
            //     let gisia = (window as any).gisia as any;
            //     let map : KMLLayer;
            //     var kmlUrl = "http://localhost/GISIA/resources/kml/tpk/palmsprings.kml";
            //     var kml = new KMLLayer(kmlUrl);
            //     map.addLayer(kml);
            //     kml.on("load", function() {
            //       domStyle.set("loading", "display", "none");
            //     });
            //   });
            //this._viewModel.GetTPK(url);
        };
        return DataView;
    }());
    exports.DataView = DataView;
});
//# sourceMappingURL=DataView.js.map