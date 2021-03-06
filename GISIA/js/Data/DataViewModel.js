define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataViewModel = /** @class */ (function () {
        function DataViewModel(model, view) {
            console.log("data  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        DataViewModel.prototype.GetTPK = function (url) {
            if (window.DEBUG) {
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
            }
            var optionStrings;
        };
        return DataViewModel;
    }());
    exports.DataViewModel = DataViewModel;
});
//# sourceMappingURL=DataViewModel.js.map