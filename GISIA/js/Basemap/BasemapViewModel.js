define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasemapViewModel = /** @class */ (function () {
        function BasemapViewModel(model, view) {
            //debugger;
            console.log("base map  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        BasemapViewModel.prototype.baseMap_AddToMap_Click = function () {
            alert("Click");
        };
        BasemapViewModel.prototype.GetANumber = function () {
            return 3.12;
        };
        BasemapViewModel.prototype.GetTPK = function (url) {
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
        BasemapViewModel.prototype.initialize = function () {
            if (window.DEBUG) {
                debugger;
            }
            //debugger;
            var optionStrings;
        };
        return BasemapViewModel;
    }());
    exports.BasemapViewModel = BasemapViewModel;
});
//# sourceMappingURL=BasemapViewModel.js.map