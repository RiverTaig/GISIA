define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TracingView = /** @class */ (function () {
        function TracingView() {
            this._viewModel = null;
            console.log("Tracing viewer constructor");
        }
        TracingView.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
            //let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("DataViewSelect");
            //let optElement : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
            //optElement.text = "Palm Springs";
            //optElement.value = "/GISIA/resources/kml/palmsprings.kml";
            //optElement.selected = true;
            //select.add(optElement, null);
            //select.appendChild(x);
            //select.add(optElement, null);
            // optElement = document.createElement("option");
            // optElement.text = "Waterton";
            // optElement.value = "/GISIA/resources/tpk/PS1-14.zip";
            // optElement.selected = true;
            // select.add(optElement, null);         
        };
        TracingView.prototype.onAddDataToMapClick = function () {
        };
        return TracingView;
    }());
    exports.TracingView = TracingView;
});
//# sourceMappingURL=DataView.js.map