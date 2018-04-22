import {TracingModel  } from "./TracingModel";
import {TracingViewModel } from "./TracingViewModel";

import ESRIMap = require("esri/map");



declare var require: any;
export class TracingView{
    _viewModel  : TracingViewModel = null;
    constructor (){
        console.log("Tracing viewer constructor");
    }
    public initialize(viewModel : TracingViewModel){
        this._viewModel = viewModel;

          
    }
    
 

}