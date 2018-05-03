import { DataViewModel } from "./DataViewModel";
declare var require: any;

/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/

//export module BasemapModel{

    
    export class DataModel {
        /**
         *  
         */
         _viewModel : DataViewModel = null;
        constructor() {

            console.log("GISIA DataViewModel constructor");
    
        }
        initialize(viewModel : DataViewModel){
            this._viewModel = viewModel;
        }
        GetData(searchPattern: string): string {
            return "";
        }
    }
//}

