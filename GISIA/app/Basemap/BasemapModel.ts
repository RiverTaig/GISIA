import { BasemapViewModel } from "./BasemapViewModel";
declare var require: any;
//declare var _lastError : any;
//CHANGE
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/

//export module BasemapModel{

    
    export class BasemapModel {
        /**
         * please let this work in basmap model
         */
         _viewModel : BasemapViewModel = null;
        constructor() {
            //debugger;
            (window as any)._lastError = "Basemap model constructor";
            console.log("basemapmodel constructor");
        }
        initialize(viewModel : BasemapViewModel){
            this._viewModel = viewModel;
        }
        GetBasemaps(searchPattern: string): string {
            return "";
        }
    }
//}

