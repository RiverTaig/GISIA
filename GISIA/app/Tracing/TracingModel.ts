import {TracingViewModel } from "./TracingViewModel";
declare var require: any;

 
    export class TracingModel {
 
         _viewModel :TracingViewModel = null;
        constructor() {
            //debugger;
            console.log("GISIA TracingViewModel constructor");
    
        }
        initialize(viewModel :TracingViewModel){
            this._viewModel = viewModel;
        }
 
    }
 

