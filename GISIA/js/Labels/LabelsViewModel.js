define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelsViewModel = /** @class */ (function () {
        function LabelsViewModel(model, view) {
            console.log("Labels  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        LabelsViewModel.prototype.initialize = function () {
            if (window.DEBUG) {
            }
            var optionStrings;
        };
        return LabelsViewModel;
    }());
    exports.LabelsViewModel = LabelsViewModel;
});
//# sourceMappingURL=LabelsViewModel.js.map