define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasemapViewModel = /** @class */ (function () {
        function BasemapViewModel(model, view) {
            console.log("base map  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        BasemapViewModel.prototype.GetTPK = function (url) {
            if (window.DEBUG) {
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
            }
            var optionStrings;
        };
        return BasemapViewModel;
    }());
    exports.BasemapViewModel = BasemapViewModel;
});
//# sourceMappingURL=BasemapViewModel.js.map