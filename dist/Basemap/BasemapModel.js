define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //declare var _lastError : any;
    //CHANGE
    /*import Accessor = require("esri/core/Accessor");
    import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
    //export module BasemapModel{
    var BasemapModel = /** @class */ (function () {
        function BasemapModel() {
            /**
             *
             */
            this._viewModel = null;
            //debugger;
            window._lastError = "Basemap model constructor";
            console.log("basemapmodel constructor");
        }
        BasemapModel.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        BasemapModel.prototype.GetBasemaps = function (searchPattern) {
            return "qqlgqq";
        };
        return BasemapModel;
    }());
    exports.BasemapModel = BasemapModel;
});
//}
//# sourceMappingURL=BasemapModel.js.map