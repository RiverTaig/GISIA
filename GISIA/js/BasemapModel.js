/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasemapModel;
    (function (BasemapModel_1) {
        var BasemapModel = /** @class */ (function () {
            /**
             *
             */
            function BasemapModel() {
                console.log("basemapmodel constructor");
            }
            BasemapModel.prototype.GetBasemaps = function (searchPattern) {
                return "qqqq";
            };
            return BasemapModel;
        }());
        BasemapModel_1.BasemapModel = BasemapModel;
    })(BasemapModel = exports.BasemapModel || (exports.BasemapModel = {}));
});
//# sourceMappingURL=BasemapModel.js.map