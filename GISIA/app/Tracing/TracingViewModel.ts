
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
import {TracingModel  } from "./TracingModel";
import {TracingView  } from "./TracingView";
declare var require: any;

export class TracingViewModel {

    public _model: TracingModel;
    public _view : TracingView;
    
    constructor( model : TracingModel, view : TracingView) {
      
        console.log("tracing  view model constructor!!");
        this._model = model;
        this._view = view;
        view.initialize(this);
        model.initialize(this);
        
    }
 

    public initialize( ) {
        if( (window as any).DEBUG){
          
        }
      
        let optionStrings : string;
        
  
    }


}

