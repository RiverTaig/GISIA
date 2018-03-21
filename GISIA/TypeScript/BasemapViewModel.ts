
/*import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";*/
import {BasemapModel  } from "./BasemapModel";
declare var require: any;
export class BasemapViewModel {

    public _model: BasemapModel.BasemapModel;

    constructor( model : BasemapModel.BasemapModel) {
        
        console.log("base map view model constructor!!");
        this._model = model;
        //this.initializeView();
    }

    private GetTPK(){
        require(["js/offlinetpk2" ], function(otpk : any){
            let s = otpk.getTPK("http://localhost/GISIA/resources/tpk/waterton1_16.zip");
            console.log("offline = " + s);
            // otpk.getValue();
            //  otpk.increment();
            //  otpk.getValue();
            //  otpk.decrement();
            //  console.log(otpk.getValue());
        });        
    }
    public initializeView(view : any, jqRef : any ) {
        this.GetTPK();
        let optionStrings : string;
        //let x : HTMLOptionElement  = new HTMLOptionElement("value","innerText", true,true);
        // x.value = "value";
        // x.innerText = "innerText"
        //for (let map of this._model.GetBasemaps("cb")) {
        //    optionStrings += "<option value='" + map + "'>" + map + "</option>";
        //}


        let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("baseMapViewSelect");
        
        let optElement : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
        optElement.text = "text";
        optElement.value = "VALUE";
        optElement.selected = true;
        select.add(optElement, null);
        //select.appendChild(x);


    }


}

