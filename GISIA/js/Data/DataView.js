define(["require", "exports", "./MakeData"], function (require, exports, MakeData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataView = /** @class */ (function () {
        function DataView() {
            this._viewModel = null;
            console.log("Data viewer constructor");
        }
        DataView.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
            var select = document.getElementById("DataViewSelect");
            var optElement = document.createElement("option");
            optElement.text = "Electric Service Points";
            optElement.value = "Electric Service Points";
            optElement.selected = false;
            select.add(optElement, null);
            select.appendChild(optElement);
            optElement = document.createElement("option");
            optElement.text = "Electric Lines";
            optElement.value = "Electric Lines";
            optElement.selected = false;
            select.add(optElement, null);
            optElement = document.createElement("option");
            optElement.text = "Electric Lines and Points";
            optElement.value = "Electric Lines and Points";
            optElement.selected = true;
            select.add(optElement, null);
        };
        //private makeData : MakeData = null;
        DataView.prototype.onAddDataToMapClick = function () {
            var makeData = new MakeData_1.MakeData(window.gisia.map);
            makeData.ClearGraphics();
            makeData.MakeData();
            makeData.MakeSPGraphicsIntoFeatureLayer();
            makeData.MakeLinesIntoFeatureLayer();
            window.displayMenu();
            window.$("#mapAnchor").trigger("click");
            return;
        };
        return DataView;
    }());
    exports.DataView = DataView;
});
//# sourceMappingURL=DataView.js.map