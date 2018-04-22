define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelingViewModel = /** @class */ (function () {
        function LabelingViewModel(model, view) {
            //debugger;
            console.log("Labeling  view model constructor!!");
            this._model = model;
            this._view = view;
            view.initialize(this);
            model.initialize(this);
        }
        LabelingViewModel.prototype.initialize = function () {
            if (window.DEBUG) {
                debugger;
            }
            //debugger;
            var optionStrings;
        };
        return LabelingViewModel;
    }());
    exports.LabelingViewModel = LabelingViewModel;
});
//# sourceMappingURL=LabelingViewModel.js.map