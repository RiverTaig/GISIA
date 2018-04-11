import { BasemapViewModel } from "./BasemapViewModel";
declare var require: any;
//CHANGE
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/

//export module BasemapModel{

    
    export class BasemapModel {
        /**
         *
         */
         _viewModel : BasemapViewModel = null;
        constructor() {
            //debugger;
            console.log("basemapmodel constructor");
    
        }
        initialize(viewModel : BasemapViewModel){
            this._viewModel = viewModel;
        }
        GetBasemaps(searchPattern: string): string {
            return "qqqq";
        }
    }
//}

