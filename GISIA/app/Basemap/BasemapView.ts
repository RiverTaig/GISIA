import {BasemapModel  } from "./BasemapModel";
import { BasemapViewModel } from "./BasemapViewModel";
declare var require: any;
export class BasemapView{
    //CHANGE
    _viewModel  : BasemapViewModel = null;
    constructor (){
        console.log("basemap viewer constructor");
    }
    public initialize(viewModel : BasemapViewModel){
        this._viewModel = viewModel;//testnew comment
        let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("baseMapViewSelect");
        
        let optElement : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
        optElement.text = "Waterton National Park";
        optElement.value = "/GISIA/resources/tpk/waterton1_16.zip";
        optElement.selected = true;
        select.add(optElement, null);
        //select.appendChild(x);
        //changed
        select.add(optElement, null);
        optElement = document.createElement("option");
        optElement.text = "Palm Springs";
        optElement.value = "/GISIA/resources/tpk/palmsprings1-18.zip";
        optElement.selected = true;
        select.add(optElement, null);         
    }
    public onAddToMapClick(){
        if( (window as any).DEBUG){
            debugger;
        }
        console.log ("on add to map click");
        let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("baseMapViewSelect");
        var url =  select[select.selectedIndex].value;
        console.log(url);
        this._viewModel.GetTPK(url);
    }
  
}