define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelingView = /** @class */ (function () {
        function LabelingView() {
            this._viewModel = null;
            console.log("Labeling viewer constructor");
        }
        LabelingView.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        LabelingView.prototype.onRandomLabelExpressionClick = function () {
            alert("onrandom");
        };
        return LabelingView;
    }());
    exports.LabelingView = LabelingView;
});
//# sourceMappingURL=LabelingView.js.map