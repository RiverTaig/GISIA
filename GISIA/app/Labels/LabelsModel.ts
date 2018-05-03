import {LabelsViewModel } from "./LabelsViewModel";
declare var require: any;

 
    export class LabelsModel {
 
         _viewModel :LabelsViewModel = null;
        constructor() {

            console.log("GISIA LabelsViewModel constructor");
    
        }
        initialize(viewModel :LabelsViewModel){
            this._viewModel = viewModel;
        }
 
    }
 

