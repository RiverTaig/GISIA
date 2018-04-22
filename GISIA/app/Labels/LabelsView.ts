import {LabelsModel  } from "./LabelsModel";
import {LabelsViewModel } from "./LabelsViewModel";

import ESRIMap = require("esri/map");



declare var require: any;
export class LabelsView{
    _viewModel  : LabelsViewModel = null;
    constructor (){
        console.log("Labels viewer constructor");
    }
    public initialize(viewModel : LabelsViewModel){
        this._viewModel = viewModel;

          
    }
    
    public onRandomLabelExpressionClick(){
        //
        var labelExpression = (document.getElementById("gisia-txtLabelExpression") as any).value = '[FIRSTNAME]` `[LASTNAME][CR][PHONE][CR]`MAX: `{AGGREGATE table="" relationshipId="-1" field="USAGE.records.Value" round="1" operation="max"}` Kwh`';
    }

}