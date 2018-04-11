define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*import Accessor = require("esri/core/Accessor");
    import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
    //export module BasemapModel{
    var DataModel = /** @class */ (function () {
        function DataModel() {
            /**
             *
             */
            this._viewModel = null;
            //debugger;
            console.log("GISIA DataViewModel  constructor");
        }
        DataModel.prototype.initialize = function (viewModel) {
            this._viewModel = viewModel;
        };
        DataModel.prototype.GetData = function (searchPattern) {
            return "";
        };
        return DataModel;
    }());
    exports.DataModel = DataModel;
});
//}
