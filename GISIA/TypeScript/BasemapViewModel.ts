
import Accessor = require("esri/core/Accessor");
import { subclass, declared } from "esri/core/accessorSupport/decorators";
import {BasemapModel } from "./BasemapModel";

export class BasemapViewModel {

    private _model: BasemapModel;

    constructor(model : BasemapModel) {
        
        console.log("base map view model constructor!!");
        this._model = model;
        //this.initializeView();
    }

    // public initializeView( ) {
    //     let optionStrings : string;
    //     for (let map of this._model.GetBasemaps("cb")) {
    //         optionStrings += "<option value='" + map + "'>" + map + "</option>";
    //     }
    //     //$("#baseMapViewSelect").innerHTML = optionStrings;
    //     //Now get the selection input

    // }


}

