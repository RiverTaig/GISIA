
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
import {LabelsModel  } from "./LabelsModel";
import {LabelsView  } from "./LabelsView";
declare var require: any;

export class LabelsViewModel {

    public _model: LabelsModel;
    public _view : LabelsView;
    
    constructor( model : LabelsModel, view : LabelsView) {

        console.log("Labels  view model constructor!!");
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

