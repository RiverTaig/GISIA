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
        };
        return TracingView;
    }());
    exports.TracingView = TracingView;
});
//# sourceMappingURL=TracingView.js.map