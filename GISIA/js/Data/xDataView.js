define(["require", "exports"], function (require, exports) {
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
            alert("adding data to map");
            //this._viewModel.GetTPK(url);
        };
        return DataView;
    }());
    exports.DataView = DataView;
});
