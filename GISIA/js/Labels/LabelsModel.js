define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelsModel = /** @class */ (function () {
        function LabelsModel() {
            this._viewModel = null;
            console.log("GISIA LabelsViewModel constructor");
        }
        LabelsModel.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        return LabelsModel;
    }());
    exports.LabelsModel = LabelsModel;
});
//# sourceMappingURL=LabelsModel.js.map