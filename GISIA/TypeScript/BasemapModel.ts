
import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";

export class BasemapModel {
    /**
     *
     */
    constructor() {
        console.log("basemapmodel constructor");

    }
    GetBasemaps(searchPattern: string): string {
        return "qqqq";
    }
}
