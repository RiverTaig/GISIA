define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelsView = /** @class */ (function () {
        function LabelsView() {
            this._viewModel = null;
            console.log("Labels viewer constructor");
        }
        LabelsView.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        LabelsView.prototype.onBackToMapClick = function () {
            window.displayMenu();
            window.$("#mapAnchor").trigger("click");
        };
        LabelsView.prototype.onRandomLabelExpressionClick = function () {
            //
            var labelExpression = document.getElementById("gisia-txtLabelExpression").value = '[FIRSTNAME]` `[LASTNAME][CR][PHONE][CR]`MAX: `{AGGREGATE table="" relationshipId="-1" field="USAGE.records.Value" round="1" operation="max"}` Kwh`';
        };
        return LabelsView;
    }());
    exports.LabelsView = LabelsView;
});
//# sourceMappingURL=LabelsView.js.map