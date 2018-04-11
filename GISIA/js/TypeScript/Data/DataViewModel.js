define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataViewModel = /** @class */ (function () {
        function DataViewModel(model, view) {
            //debugger;
            console.log("data  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        DataViewModel.prototype.Data_AddToMap_Click = function () {
            alert("Click");
        };
        DataViewModel.prototype.GetANumber = function () {
            return 3.12;
        };
        DataViewModel.prototype.GetTPK = function (url) {
            if (window.DEBUG) {
                debugger;
            }
            require(["js/offlinetpk2"], function (otpk) {
                var s = otpk.getTPK(url);
                console.log("offline = " + s);
                window.displayMenu();
                window.$("#mapAnchor").trigger("click");
            });
        };
        DataViewModel.prototype.initialize = function () {
            if (window.DEBUG) {
                debugger;
            }
            //debugger;
            var optionStrings;
        };
        return DataViewModel;
    }());
    exports.DataViewModel = DataViewModel;
});
//# sourceMappingURL=DataViewModel.js.map