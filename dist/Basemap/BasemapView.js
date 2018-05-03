define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasemapView = /** @class */ (function () {
        function BasemapView() {
            //CHANGE
            this._viewModel = null;
            console.log("basemap viewer constructor");
        }
        BasemapView.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel; //testnew comment
            var select = document.getElementById("baseMapViewSelect");
            var optElement = document.createElement("option");
            optElement.text = "Waterton National Park";
            optElement.value = "http://localhost/GISIA/resources/tpk/waterton1_16.zip";
            optElement.selected = true;
            select.add(optElement, null);
            //select.appendChild(x);
            select.add(optElement, null);
            optElement = document.createElement("option");
            optElement.text = "Palm Springs";
            optElement.value = "http://localhost/GISIA/resources/tpk/PS1-14.zip";
            optElement.selected = true;
            select.add(optElement, null);
        };
        BasemapView.prototype.onAddToMapClick = function () {
            if (window.DEBUG) {
                debugger;
            }
            console.log("on add to map click");
            var select = document.getElementById("baseMapViewSelect");
            var url = select[select.selectedIndex].value;
            console.log(url);
            this._viewModel.GetTPK(url);
        };
        return BasemapView;
    }());
    exports.BasemapView = BasemapView;
});
//# sourceMappingURL=BasemapView.js.map