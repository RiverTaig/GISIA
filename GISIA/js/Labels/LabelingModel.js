define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelingModel = /** @class */ (function () {
        function LabelingModel() {
            this._viewModel = null;
            //debugger;
            console.log("GISIA LabelingViewModel constructor");
        }
        LabelingModel.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        return LabelingModel;
    }());
    exports.LabelingModel = LabelingModel;
});
//# sourceMappingURL=LabelingModel.js.map