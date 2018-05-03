define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TracingModel = /** @class */ (function () {
        function TracingModel() {
            this._viewModel = null;
            console.log("GISIA TracingViewModel constructor");
        }
        TracingModel.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        return TracingModel;
    }());
    exports.TracingModel = TracingModel;
});
//# sourceMappingURL=TracingModel.js.map