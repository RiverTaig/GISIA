import {DataModel  } from "./DataModel";
import { DataViewModel } from "./DataViewModel";
import KMLLayer = require("esri/layers/KMLLayer");
import ESRIMap = require("esri/map");
import {MakeData} from "./MakeData";


declare var require: any;
export class DataView{
    _viewModel  : DataViewModel = null;
    constructor (){
        console.log("Data viewer constructor");
    }
    public initialize(viewModel : DataViewModel){
        this._viewModel = viewModel;

        let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("DataViewSelect");
        
        let optElement : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
        optElement.text = "Electric Service Points";
        optElement.value = "Electric Service Points";
        optElement.selected = false;
        select.add(optElement, null);
        select.appendChild(optElement);

        
        optElement = document.createElement("option");
        optElement.text ="Electric Lines";
        optElement.value = "Electric Lines";
        optElement.selected = false;
        select.add(optElement, null);     

        optElement = document.createElement("option");
        optElement.text ="Electric Lines and Points";
        optElement.value = "Electric Lines and Points";
        optElement.selected = true;
        select.add(optElement, null);   
        
    }
    //private makeData : MakeData = null;
    public onAddDataToMapClick(){
        let makeData : MakeData = new MakeData( (window as any).gisia.map  );
        makeData.ClearGraphics();
        makeData.MakeData();
        makeData.MakeSPGraphicsIntoFeatureLayer();
        makeData.MakeLinesIntoFeatureLayer();
        let displayMenu = true;

        if(displayMenu){

            (window as any).displayMenu();
        }
        (window as any).$("#mapAnchor").trigger("click");        
        return;

    }

}