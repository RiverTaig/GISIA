
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
//CHANGE
import {BasemapModel  } from "./BasemapModel";
import {BasemapView  } from "./BasemapView";
declare var require: any;

export class BasemapViewModel {

    public _model: BasemapModel;
    public _view : BasemapView;
    
    constructor( model : BasemapModel, view : BasemapView) {
        //debugger;
        console.log("base map  view model constructor!!");
        this._model = model;
        this._view = view;
        view.initialize(this);
        model.initialize(this);
        
    }

    public GetTPK(url : string){
        if( (window as any).DEBUG){
            debugger;
        }
        require(["js/offlinetpk2" ], function(otpk : any  ){
            let s = otpk.getTPK(url);
            console.log("offline = " + s);
            (window as any).displayMenu();
            (window as any).$("#mapAnchor").trigger("click");
        });        
    }

    public initialize( ) {
        if( (window as any).DEBUG){
            debugger;
        }
        //debugger;
        let optionStrings : string;
        
  
    }


}

