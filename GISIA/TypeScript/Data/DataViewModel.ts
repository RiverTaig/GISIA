
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
import {DataModel  } from "./DataModel";
import {DataView  } from "./DataView";
declare var require: any;

export class DataViewModel {

    public _model: DataModel;
    public _view : DataView;
    
    constructor( model : DataModel, view : DataView) {
        //debugger;
        console.log("data  view model constructor!!");
        this._model = model;
        this._view = view;
        view.initialize(this);
        model.initialize(this);
        
    }
    Data_AddToMap_Click( ) {
       alert("Click") ;
    }
    public GetANumber(){
        return 3.12;
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

