define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TracingViewModel = /** @class */ (function () {
        function TracingViewModel(model, view) {
            console.log("tracing  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        TracingViewModel.prototype.initialize = function () {
            if (window.DEBUG) {
            }
            var optionStrings;
        };
        return TracingViewModel;
    }());
    exports.TracingViewModel = TracingViewModel;
});
//# sourceMappingURL=TracingViewModel.js.map