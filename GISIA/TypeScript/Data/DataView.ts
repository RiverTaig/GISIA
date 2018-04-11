import {DataModel  } from "./DataModel";
import { DataViewModel } from "./DataViewModel";
import KMLLayer = require("esri/layers/KMLLayer");
import ESRIMap = require("esri/map");


declare var require: any;
export class DataView{
    _viewModel  : DataViewModel = null;
    constructor (){
        console.log("Data viewer constructor");
    }
    public initialize(viewModel : DataViewModel){
        this._viewModel = viewModel;

  

        //this._viewModel.GetTPK("http://localhost/GISIA/resources/tpk/waterton1_16.zip");
        let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("DataViewSelect");
        
        let optElement : HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
        optElement.text = "Palm Springs";
        optElement.value = "http://localhost/GISIA/resources/kml/palmsprings.kml";
        optElement.selected = true;
        select.add(optElement, null);
        //select.appendChild(x);

        select.add(optElement, null);
        optElement = document.createElement("option");
        optElement.text = "Waterton";
        optElement.value = "http://localhost/GISIA/resources/tpk/PS1-14.zip";
        optElement.selected = true;
        select.add(optElement, null);         
    }
    public onAddDataToMapClick(){
        if( (window as any).DEBUG){
            debugger;
        }
        console.log ("on add to map click");
        let select : HTMLSelectElement = <HTMLSelectElement> document.getElementById("DataViewSelect");
        var url =  select[select.selectedIndex].value;
        console.log(url);
        let kmlUrl = "http://localhost/GISIA/resources/kml/tpk/palmsprings.kml";
        let kmlLayer : KMLLayer = new KMLLayer("kmlLayer",kmlUrl);
        let map : ESRIMap;
        map = (window as any).gisia.map;
        map.addLayer(kmlLayer);
        kmlLayer.on("load", function() {
            alert("layer loaded");
            //domStyle.set("loading", "display", "none");
        });        

        // require([
        //     "esri/layers/KMLLayer",
        //     "dojo/parser", "dojo/dom-style",
        
        //     "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
        //   ], function(KMLLayer : esri.KMLLayer  ,
        //     parser, domStyle
        //   ) {

        //     let gisia = (window as any).gisia as any;
        //     let map : KMLLayer;

        //     var kmlUrl = "http://localhost/GISIA/resources/kml/tpk/palmsprings.kml";
        //     var kml = new KMLLayer(kmlUrl);
        //     map.addLayer(kml);
        //     kml.on("load", function() {
        //       domStyle.set("loading", "display", "none");
        //     });
        //   });
        //this._viewModel.GetTPK(url);
    }

}