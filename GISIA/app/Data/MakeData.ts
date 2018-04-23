import * as Dialog from 'dijit/Dialog';

import ESRIMap = require("esri/map");
import * as dom from 'dojo/dom';
//import Collections = require('typescript-collections');
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Polyline = require("esri/geometry/Polyline");
import Point = require("esri/geometry/Point");
import Graphic = require("esri/graphic");
import SpatialReference = require("esri/SpatialReference");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import Color = require("esri/Color");
import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import ClassBreaksRenderer = require("esri/renderers/ClassBreaksRenderer");
import Font = require("esri/symbols/Font");
import TextSymbol = require("esri/symbols/TextSymbol");
import WebMercatorUtils = require("esri/geometry/webMercatorUtils")
import ScreenUtils = require("esri/geometry/screenUtils");
import Extent = require("esri/geometry/Extent");
import ScreenPoint = require("esri/geometry/ScreenPoint");
import Query = require("esri/tasks/query");
import PopupTemplate = require("esri/dijit/PopupTemplate");
import Request = require("esri/request");
import FeatureLayer = require("esri/layers/FeatureLayer");
import FeatureSet = require("esri/tasks/FeatureSet");
import GeometryEngine = require("esri/geometry/geometryEngine");
import Polygon = require("esri/geometry/Polygon");
//import * as Collections from 'typescript-collections';
import { PolyLine } from 'dojox/gfx/shape';

declare var require: any;

export class MakeData {
    //tet
    private _privateVariable: string = null;
    private _mapRef: ESRIMap;
    private _glSp: GraphicsLayer;
    //private _glMiscPoints: GraphicsLayer;
    private _traceResults = new GraphicsLayer({ id: "TraceResults" });
    private _gl06: GraphicsLayer;
    private _spLayer: FeatureLayer;
    private _electricLineLayer: FeatureLayer;

    _dictSP: Object = null;
    _dictDownstream: Object = null; //this will be like Collections.Dictionary<number, [number]> = null;  **if** I can get dictionary working!!
    private _gl7: GraphicsLayer;
    private _gl8: GraphicsLayer;
    private randomFirstNames: string[] = [
        "Alan", "Barbara", "Chuck", "Dan", "Elise", "Frank", "Georgia", "Hank", "Ingrid", "Jack", "Kathy", "Larry", "Mary", "Ned", "Oprah",
        "Paul", "Queen", "Ron", "Susan", "Thom", "Uma", "Vince", "Wanda", "Xavier", "Yoko", "Zufong"
    ];
    private randomCity: string[] = ["Austin", "Baltimore", "Chicago", "Denver", "Eugene", "Fargo", "Gainsville", "Houston", "Ipswich", "Jacksonville",
        "Kipler", "Lawrence", "Mayberry", "Nantucket", "Ogden", "Philadelphia", "Quebec City", "Ramon", "Susanville", "Toledo", "Ulster", "Venice",
        "Wilsonville", "Xanadu", "Yellowstone", "Zion"];
    private randomState: string[] = ["Texas", "Utah", "Oregon", "Washington", "California", "Maine", "Mississippi", "Colorado", "Idaho", "Ohio", "Alabama",
        "Alaska", "New York", "Wyoming", "Oklahoma", "Montana", "Rhode Island", "New Jersey", "Wisconsin", "Virginia", "Pennsylvania", "Florida", "Hawaii",
        "Nebraska", "Arizona", "Illinois"];
    private randomLastNames: string[] = [
        "Alberts", "Billings", "Chadwick", "Daniels", "Earnheardt", "Fairchild", "Grossman", "Harris", "Irwin", "Johnson", "Keeting", "Lawrence", "Michaels", "Nelson", "Olsen",
        "Poundstone", "Quincy", "Rasmussen", "Sadler", "Tillerson", "Urich", "Vance", "Wilson", "Xu", "Youngblood", "Zaher"
    ];
    private randomStreets: string[] = [
        "Ash", "Berry", "Cherry", "Dogwood", "Elm", "Furley", "Gathorne", "Harleton", "Islington", "Jowett", "Kensington", "Lilestone", "Marlborough", "Newton", "Osbert",
        "Palmerston", "Queensland", "Raynor", "Sherwood", "Trinity", "Upwey", "Vacek", "Warwick", "Xenia", "Yardley", "Zealand"
    ];
    private _servicePointRenderer: any = {};
    constructor(mapRef: ESRIMap) {

        console.log("constructor");
        this._mapRef = mapRef;
        //These two graphic layer get converted to feature layers
        this._glSp = new GraphicsLayer({ id: "ServicePoints" });
        //this._glMiscPoints = new GraphicsLayer({ id: "MiscElectric" });
        this._glSp.setVisibility(false);
        //this._glMiscPoints.setVisibility(false);

        this._gl06 = new GraphicsLayer({ id: "ElectricLines_06" });
        this._gl7 = new GraphicsLayer({ id: "ElectricLines_7" });
        this._gl8 = new GraphicsLayer({ id: "ElectricLines_8" });
        let uvr = new UniqueValueRenderer(this.uniqueValueRendererJSON());


        var symbol = new SimpleMarkerSymbol();
        symbol.setColor(new Color([150, 150, 150, 0.5]));
        symbol.setSize(10);
        let vvSPRenderer = new SimpleRenderer(symbol);    //this.uniqueValueRenderer_sp_JSON());

        let colWinter: any = (dom.byId("gisiaWinter") as any).value;
        let colSpring: any = (dom.byId("gisiaSpring") as any).value;
        let colSummer: any = (dom.byId("gisiaSummer") as any).value;
        let colFall: any = (dom.byId("gisiaFall") as any).value;
        let visualParams: any = [];
        visualParams.push({
            "type": "colorInfo",
            "field": "MAXMONTH",
            "stops": [
                {
                    "value": 1,
                    "color": new Color(colWinter),
                    "label": "Jan"
                },
                {
                    "value": 2,
                    "color": new Color(colWinter),
                    "label": "Feb"
                },
                {
                    "value": 3,
                    "color": new Color(colSpring),
                    "label": "Mar"
                },
                {
                    "value": 4,
                    "color": new Color(colSpring),
                    "label": "Apr"
                },
                {
                    "value": 5,
                    "color": new Color(colSpring),
                    "label": "May"
                },
                {
                    "value": 6,
                    "color": new Color(colSummer),
                    "label": "Jun"
                },
                {
                    "value": 7,
                    "color": new Color(colSummer),
                    "label": "Jul"
                },
                {
                    "value": 8,
                    "color": new Color(colSummer),
                    "label": "Aug"
                },
                {
                    "value": 9,
                    "color": new Color(colFall),
                    "label": "Sep"
                },
                {
                    "value": 10,
                    "color": new Color(colFall),
                    "label": "Oct"
                },
                {
                    "value": 11,
                    "color": new Color(colFall),
                    "label": "Nov"
                },
                {
                    "value": 12,
                    "color": new Color(colWinter),
                    "label": "Dec"
                }
            ]
        });

        let sizeMatters = (dom.byId("gisia-chkVaryByUsage") as any).checked;
        if (sizeMatters) {
            visualParams.push({
                "type": "sizeInfo",
                "field": "MAXUSAGE",
                "minDataValue": 100,
                "maxDataValue": 2766,
                "valueUnit": "unknown",

                "minSize": {
                    "type": "sizeInfo",
                    "expression": "view.scale",
                    "stops": [
                        { "value": 4500, "size": 8 },
                        { "value": 36000, "size": 4 },
                        { "value": 72000, "size": 2 },
                        { "value": 144000, "size": 1 }
                    ]
                },
                "maxSize": {
                    "type": "sizeInfo",
                    "expression": "view.scale",
                    "stops": [
                        { "value": 4500, "size": 40 },
                        { "value": 36000, "size": 20 },
                        { "value": 72000, "size": 10 },
                        { "value": 144000, "size": 5 }
                    ]
                }
            });
        }
        vvSPRenderer.setVisualVariables(visualParams);
        //let renderer = new ClassBreaksRenderer(symbol, "LEVEL");
        let simpleRenderer = new SimpleRenderer(symbol);

        this._servicePointRenderer = vvSPRenderer;// renderer.toJson();
        //renderer.addBreak(400, Infinity, new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5])));

        //this._gl06.renderer = uvr;
        this._gl7.renderer = uvr;
        this._gl8.renderer = uvr;
        //this._glSp.renderer = vvSPRenderer;//uvrSP;

        this._gl7.minScale = 8000;
        this._gl8.minScale = 4000;

        this.setupMapClickHandler();
        this.listenForExtentChange();
    }

    private _extentChangeCounter = 0;
    private _labelPresent = false;
    listenForExtentChange() {


        this._mapRef.on("extent-change", (e) => {
            if (this._labelPresent) {
                this._mapRef.graphics.clear();
            }
            let scale = this._mapRef.getScale();
            this._extentChangeCounter++;
            console.log("Scale " + scale + "  counter: " + this._extentChangeCounter);
            let chkLabelServicePoints: HTMLInputElement = <HTMLInputElement>dom.byId("gisia-chkLabelServicePoints");
            let numLabelScale = dom.byId("gisia-numLabelScale");

            let labelServicePoints: boolean = true;
            if (chkLabelServicePoints === null || chkLabelServicePoints === undefined) {
                labelServicePoints = false;
            }
            else {
                labelServicePoints = chkLabelServicePoints.checked;
            }

            if (labelServicePoints) {
                let labelScale: number = (numLabelScale === null) ? 5000 : (numLabelScale as any).value;
                if (scale <= labelScale) {
                    let thisLevel = this._mapRef.getLevel();
                    this._mapRef.graphics.clear();
                    //if (thisLevel > 17) {
                    this.LabelInExtent();
                    this._labelPresent = true;
                }
            }
        });
    }
    ProjectLatLongPoint(lat: number, long: number, map: ESRIMap): Point {
        //Guard against a mistake where lat=long
        if (lat < -90) {
            let tempLat = lat;
            let tempLon = long;
            lat = tempLon;
            long = tempLat;
        }
        let llpnt: Point = new Point(long, lat);

        let mapPoint = WebMercatorUtils.geographicToWebMercator(llpnt) as Point;
        return mapPoint;
    }

    //Simple Expression
    private labelExpression0 = `
    {FIRSTNAME} {LASTNAME}{NEWLINE}
    {ADDRESS}
    `;

    //Name / addreess / Total electric usage (aggregation)
    private labelExpression1 = `
    Name: {FIRSTNAME} {LASTNAME}{NEWLINE}
    {ADDRESS},{CITY},{STATE}{NEWLINE}
    <RELATION layerID="0" primaryKey="USAGE" foreignKey="" where="" outputRecords="relatedElectricUsageRecords", fields="Month,Value" >
        <FOREACH delimter=",">
            {Value}
        </FOREACH>
    </RELATION>
    TOTAL: 
    <SUM inputRecords="relatedElectricUsageRecords" field="Value" round="2" where="">
        {SUM} KWH
    </SUM>
    `;

    //Highest usage during summer (filtering)
    private labelExpression2 = `
    {ADDRESS}{NEWLINE}
    <RELATION layerID="0" primaryKey="USAGE" foreignKey="" 
        where="Month in ('Jun','July','Aug')" outputRecords="relatedElectricUsageRecords", fields="Month,Value" >
    </RELATION>
    {NEWLINE}
    TOTAL: <MAX inputRecords="relatedElectricUsageRecords" field="Value" round="2">
        {Month} : {Value} KWH
    </MAX> 
    `    ;

    LabelInExtent() {
        let query = new Query();
        //query.outFields = ["*"];
        query.geometry = this._mapRef.extent;
        //query.spatialRelationship = "SPATIAL_REL_INTERSECTS";
        query.returnGeometry = true;

        if (this._spLayer) {
            if (this._spLayer.isVisibleAtScale(this._mapRef.getScale())) {
                this._spLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, (featureSet: any) => {
                    this.AddLabelsToGraphics(featureSet);

                }, (err: any) => {
                    console.log("ERROR " + err.toString());

                });
            }
        }

    }

    // Returns the entire label expression as an array of arrays where the outer array represents lines and the inner array are the elements for that line
    GetLabelExpressionAsArray(): string[][] {
        try {
            let labelExpression = (document.getElementById("gisia-txtLabelExpression") as any).value;
            labelExpression = labelExpression.replace(/[\n\r]/g, '');

            let lines = labelExpression.split("[CR]");
            let len = lines.length;
            let outLinesArray = [];
            for (let i = 0; i < lines.length; i++) {
                let lineString = lines[i].trim();
                //outLinesArray.push(line.trim());
                let elementsInLine = lineString.split("`");
                let line = [];
                for (let j = 0; j < elementsInLine.length; j++) {
                    let elementInLine = elementsInLine[j];
                    if (elementInLine.length > 0) {
                        line.push(elementInLine);
                    }
                }
                outLinesArray.push(line);
                //
            }


            return outLinesArray;
        }
        catch (ex) {
            //document.getElementById("output").innerHTML = answer;
        }
    }

    GetLabelLines(labelExpressionAsArray: string[][], graphic: Graphic): string[] {
        let textLines: string[] = [];


        for (let line = 0; line < labelExpressionAsArray.length; line++) {
            let commandsForLine: string[] = labelExpressionAsArray[line];
            let textForLine = "";
            for (let commandIndex = 0; commandIndex < commandsForLine.length; commandIndex++) {
                let labelElement = commandsForLine[commandIndex];
                if (labelElement.indexOf("[") + labelElement.indexOf("]") > 1) {
                    let fieldName = labelElement.substr(1, labelElement.length - 2).trim(); //e.g. "OBJECTID"
                    textForLine += graphic.attributes[fieldName].trim();
                }
                else if (labelElement.indexOf("{") + labelElement.indexOf("}") > 1) {

                    textForLine += this.HandleOperators(labelElement, graphic);

                }
                else {
                    textForLine += labelElement;
                }
            }
            textLines.push(textForLine);
        }



        return textLines;
    }

    HandleAggregate(json: any, graphic: Graphic): string {


        //todo delegate this generic stuff to HandleOperataor
        let aggPvPairs: iAggregateOperator = null;
        try {
            aggPvPairs = <iAggregateOperator>json.params;
        }
        catch (ex) {
            throw ("The aggregate function did not have all expected properties");
        }

        if (aggPvPairs.relationshipId !== "-1") {
            return;//not implmented yet
        }
        //USAGE.records.Value  (where "Value" is the poorly named field. we want the value of Value)
        let pathToJsonData = aggPvPairs.field.split(".");
        let jsonField = graphic.attributes[pathToJsonData[0]]; //USAGE
        let max = -9999999999;
        let min = 9999999999;
        let sum = 0;
        let toJson = JSON.parse(jsonField);
        let records = toJson[pathToJsonData[1]];
        let recordCount = records.length;
        let dataField = pathToJsonData[2];
        for (let i = 0; i < recordCount; i++) { //loop 0 to < 12
            //Record is a row which has an array of name value pairs corresponding 
            //to fields and their values.  one of them will be the field we want.
            //for the sample data, the two fields are Month and Value
            let record = records[i];
            let value = 0;
            for (let fieldIndex = 0; fieldIndex < record.length; fieldIndex++) {
                if (record[fieldIndex].hasOwnProperty(dataField)) {
                    value = parseFloat(record[fieldIndex][dataField]);
                    break;
                }
            }

            sum += value;
            if (value > max) {
                max = value;
            }
            if (value < min) {
                min = value;
            }
        }
        let average = sum / recordCount;
        let precision = parseInt(aggPvPairs.round);
        switch (aggPvPairs.operation) {
            case "sum":
                return this.PrecisionRound(sum, precision).toString();
            case "min":
                return this.PrecisionRound(min, precision).toString();
            case "max":
                return this.PrecisionRound(max, precision).toString();
            case "avg":
                return this.PrecisionRound(average, precision).toString();
        }
        return "";
    }

    HandleOperators(labelElement: string, graphic: Graphic): string {
        let retValue = "";
        let json = this.JSONFromLabelElement(labelElement);//todo cache these

        switch (json.name) {
            case "AGGREGATE":
                retValue = this.HandleAggregate(json, graphic);
                break;
        }
        return retValue;
    }

    JSONFromLabelElement(labelElement: string): any {
        let firstQuoteIndex = -1;
        let secondQuoteIndex = -1;
        let equalIndex = -1;
        let foundFirstQuote = false;
        let foundOperationName = false;
        let foundFirstSpace = false;
        let operationName = "";
        let startOfVariableIndex = -1;
        let paramsNode = null;
        let json = {};
        let leftSide = "";
        let rightSide = ""
        for (let i = 0; i < labelElement.length; i++) {
            let character = labelElement[i];
            if (character === " " && foundOperationName === false) {
                operationName = labelElement.substring(1, i);
                json["name"] = operationName;
                json["params"] = {};
                paramsNode = json["params"];
                foundOperationName = true;
                startOfVariableIndex = i;
            }

            if (foundOperationName) {

                if (character === "=" && foundFirstQuote === false) {//disregard equal signs in quoted string
                    leftSide = labelElement.substring(startOfVariableIndex, i).trim();
                }
                if (character === '"') {
                    if (foundFirstQuote) {
                        foundFirstQuote = false;
                        rightSide = labelElement.substring(firstQuoteIndex + 1, i).trim();
                        paramsNode[leftSide] = rightSide;
                        leftSide = "";
                        rightSide = "";
                        firstQuoteIndex = -1;
                        foundFirstQuote = false;
                        startOfVariableIndex = i + 1;
                    } else {
                        foundFirstQuote = true;
                        firstQuoteIndex = i;
                    }
                }
            } //found foundOperationName
        }
        return json;
    }

    PrecisionRound(num: number, precision: number): number {
        var factor = Math.pow(10, precision);
        let answer: number = Math.round(num * factor) / factor;
        return answer;
    }

    AddLabelsToGraphics(featureSet: Graphic[]) {

        const DISTANCE_AT_LEVEL_15 = 75;
        const MAXLABELS = 700; //todo read from user
        let checkForOverlap = true;
        let fontSize = 16;
        let stopLabelingAtThisExtent = false;
        let level = this._mapRef.getLevel();
        let deltaFromBaseLevel = 15 - level;
        let multiplier = Math.pow(2, deltaFromBaseLevel);
        let amountToAdd = multiplier * DISTANCE_AT_LEVEL_15;
        let spatRef = this._mapRef.spatialReference;
        let font = new Font(fontSize.toString() + "px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
        font.family = "Arial";
        let offset =  this._mapRef.extent.getWidth() / 60;
        let labelsPlaced = 0;
        let labelExtents: Extent[] = [];

        let labelExpressionAsArray = this.GetLabelExpressionAsArray();
        for (let graphicIndex = 0; graphicIndex < featureSet.length; graphicIndex++) {
            if (stopLabelingAtThisExtent) {
                break;
            }
            //when checking for overlaps, no extents beyond the currentLabelExtentsIndex needs to be checked (a label never overlaps with itself)
            let currentLabelExtentsIndex = labelExtents.length;
            let graphic = featureSet[graphicIndex];
            let startPoint = <Point>graphic.geometry;
            let x = (graphic.geometry as Point).x;
            let y = (graphic.geometry as Point).y;

            //TODO - Build this out to be flexible

            let textLines = this.GetLabelLines(labelExpressionAsArray, graphic);

            // let textForLine1 = `${graphic.attributes["FIRSTNAME"]} ${graphic.attributes["LASTNAME"]} `;
            // let textForLine2 = `${graphic.attributes["ADDRESS"]} ST., `
            // let textForLine3 = `${graphic.attributes["CITY"]}, ${graphic.attributes["STATE"]}`;
            // let textLines = [textForLine1, textForLine2, textForLine3];

            let labelThisFeature: boolean = true;
            type labelTuple = [Point, TextSymbol];
            let labelTuples: labelTuple[] = [];
            for (let lineIndex = 0; lineIndex < textLines.length; lineIndex++) {
                let textForLine = textLines[lineIndex];
                let ts = new TextSymbol(textForLine, font, new Color([0, 0, 0]));
                ts.xoffset = offset;
                ts.yoffset = offset;
                ts.haloColor = new Color([255, 255, 255]);
                ts.haloSize = 2;
                ts.setHorizontalAlignment("left");
                let newX = x + offset;
                let newY = (y - (lineIndex * amountToAdd)) + offset;
                let textPoint = new Point(newX, newY);
                textPoint.spatialReference = spatRef;
                if (checkForOverlap) {
                    let lineLength = multiplier * 3.0 * textForLine.length * fontSize;
                    let thisExtent = new Extent(newX, newY, (newX + lineLength), (newY + (fontSize )), spatRef);
                    if (this.hasOverlaps(labelExtents, thisExtent, currentLabelExtentsIndex) === false) {
                        labelExtents.push(thisExtent);
                        let lt: labelTuple = [textPoint, ts];
                        labelTuples.push(lt);
                    }
                    else {
                        labelThisFeature = false;
                        break;
                    }
                }

            }
            if (labelThisFeature) {
                labelTuples.forEach((labelTuple, index, labelTuples) => {
                    let textGraphicToAdd = new Graphic(labelTuple[0], labelTuple[1]);
                    this._mapRef.graphics.add(textGraphicToAdd);
                    labelsPlaced++;
                    if (labelsPlaced > MAXLABELS) {
                        stopLabelingAtThisExtent = true;
                        console.log("MAX LABELS REACHED FOR EXTENT");
                    }
                });
            }
        }
    }
    hasOverlaps(labelExtents: Extent[], testExtent: Extent, currentLabelExtentsIndex: number): boolean {
        for (let i = 0; i < currentLabelExtentsIndex; i++) {
            if (GeometryEngine.overlaps(labelExtents[i], testExtent)) {
                return true;
            }
        }
        return false;
    }

    MakeLinesIntoFeatureLayer() {
        let userWantsLines = document.getElementById("DataViewSelect") as HTMLSelectElement;
        let selectedOption = userWantsLines.selectedOptions[0];
        if (selectedOption.value.indexOf("Lines") < 0) {
            return;
        }
        let featureCollectionLine: any = {
            "layerDefinition": null,
            "featureSet": {
                "features": [],
                "geometryType": "esriGeometryPolyline"
            }
        };
        //TODO add drawingInfo.renderer
        //FIRSTNAME,LASTNAME,ADDRESS,CITY,STATE,USAGE,ID
        featureCollectionLine.layerDefinition = {
            "geometryType": "esriGeometryPolyline",
            "objectIdField": "ID",
            "drawingInfo": {

            },
            "fields": [{
                "name": "ID",
                "alias": "ObjectID",
                "type": "esriFieldTypeOID"
            }
            ]
        };

        this._electricLineLayer = new FeatureLayer(featureCollectionLine, {
            id: 'electricLineLayer',

        });
        this._electricLineLayer.minScale = 290000;//
        //Uses visual variables to symbolize on max usage and max month
        this._electricLineLayer.renderer = new UniqueValueRenderer(this.uniqueValueRendererJSON());

        let eventReference = this._mapRef.on("layer-add-result", (results) => {
            if (results.layer.id == "electricLineLayer") {
                this._electricLineLayer = ((results.layer) as FeatureLayer);
                //this._spLayer.renderer = this._servicePointRenderer;
                //this._spLayer.minScale = 4000;
                let features = [];
                let graphics = this._gl06.graphics;
                for (let i = 0; i < graphics.length; i++) {
                    //for (let i = 0; i < 2; i++) {
                    let item = graphics[i];
                    features.push(item);
                }

                this._electricLineLayer.applyEdits(features, null, null, (addsResult: any, deletsResult: any, updateResults: any) => {

                    //Once the edits are applied, we can delete the graphics
                });
                eventReference.remove();
            }

        });




        this._electricLineLayer.on("click", (evt) => {
            debugger;
            let g: Graphic = evt.graphic;


            let chkTraceUpstream = (<HTMLInputElement>dom.byId("chkTraceUpstream")).checked;
            let chkTraceDownstream = (<HTMLInputElement>dom.byId("chkTraceDownstream")).checked;

            if (chkTraceDownstream === false) {
                return;
            }
            this._traceResults.clear();
            let id = evt.graphic.attributes["ID"] as number;


            //let graphicsToSymbolize: Graphic[] = [];
            let sls = new SimpleLineSymbol();
            sls.setWidth(10);
            sls.setStyle("STYLE_SHORTDASH");
            let dstCol: Color = new Color((dom.byId("gisia-colTraceDownstream") as any).value);
            let dstColA = [dstCol.r, dstCol.g, dstCol.b, .5];
            //downstreamTraceColor.setColor(new Color(downstreamTraceColor.r,downstreamTraceColor.g,downstreamTraceColor.b,.5));
            sls.setColor(new Color(dstColA));
            let unionedExtent = new Extent(99999999, 99999999, -99999999, -99999999, this._mapRef.spatialReference);
            let linesToVisit: [number] = [id];
            let spatRef = this._mapRef.spatialReference;
            while (linesToVisit.length > 0) {
                let id = linesToVisit.pop();
                let associatedGraphic: Graphic = this._dictSP[id];
                let pl: Polyline = new Polyline(this._mapRef.spatialReference);
                let x1 = (associatedGraphic.geometry as Polyline).paths[0][0][0];
                let y1 = (associatedGraphic.geometry as Polyline).paths[0][0][1];
                let x2 = (associatedGraphic.geometry as Polyline).paths[0][1][0];
                let y2 = (associatedGraphic.geometry as Polyline).paths[0][1][1];
                if (x1 < unionedExtent.xmin) { unionedExtent.xmin = x1 - 300; }
                if (x2 > unionedExtent.xmax) { unionedExtent.xmax = x2 + 300; }
                if (y1 < unionedExtent.ymin) { unionedExtent.ymin = y1 - 300; }
                if (y2 > unionedExtent.ymax) { unionedExtent.ymax = y2 + 300; }
                pl.addPath([[x1, y1], [x2, y2]]);
                pl.spatialReference = spatRef;
                let newGraphic: Graphic = new Graphic(pl, sls, associatedGraphic.attributes);
                //graphicsToSymbolize.push(newGraphic);
                this._traceResults.add(newGraphic);

                let immediateChildren = this._dictDownstream[id];
                for (let i = 0; i < immediateChildren.length; i++) {
                    linesToVisit.push(immediateChildren[i]);
                }

            }

            let simpRend: SimpleRenderer = new SimpleRenderer(sls);
            this._traceResults.setRenderer(simpRend);
            this._traceResults.setVisibility(true);
            this._mapRef.setExtent(unionedExtent);
            this._mapRef.addLayer(this._traceResults);

        });

        this._mapRef.addLayer(this._electricLineLayer, 0);
        //this._glSp.setVisibility(false);
        this._electricLineLayer.setVisibility(true);
        //associate the features with the popup on click

    }

    MakeSPGraphicsIntoFeatureLayer() {
        let userWantsPoints = document.getElementById("DataViewSelect") as HTMLSelectElement;
        let selectedOption = userWantsPoints.selectedOptions[0];
        if (selectedOption.value.indexOf("Points") < 0) {
            return;
        }
        let featureCollection: any = {
            "layerDefinition": null,
            "featureSet": {
                "features": [],
                "geometryType": "esriGeometryPoint"
            }
        };
        //FIRSTNAME,LASTNAME,ADDRESS,CITY,STATE,USAGE,ID
        featureCollection.layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "objectIdField": "ID",
            "drawingInfo": {
                "renderer": {
                    "type": "simple",
                    "label": "",
                    "description": "",
                    "symbol": {
                        "color": [210, 105, 30, 191],
                        "size": 6,
                        "angle": 0,
                        "xoffset": 0,
                        "yoffset": 0,
                        "type": "esriSMS",
                        "style": "esriSMSCircle"
                    }
                }
            },
            "fields": [{
                "name": "ID",
                "alias": "ObjectID",
                "type": "esriFieldTypeOID"
            }, {
                "name": "FIRSTNAME",
                "alias": "First Name",
                "type": "esriFieldTypeString"
            }, {
                "name": "LASTNAME",
                "alias": "Last Name",
                "type": "esriFieldTypeString"
            },
            {
                "name": "ADDRESS",
                "alias": "Address",
                "type": "esriFieldTypeString"
            },
            {
                "name": "CITY",
                "alias": "City",
                "type": "esriFieldTypeString"
            },
            {
                "name": "STATE",
                "alias": "State",
                "type": "esriFieldTypeString"
            },
            {
                "name": "USAGE",
                "alias": "Electric Usage",
                "type": "esriFieldTypeString"
            }
            ]
        };
        //featureCollection.layerDefinition.drawingInfo.renderer = this._servicePointRenderer;


        var popupTemplate = new PopupTemplate({
            title: "{FIRSTNAME} {LASTNAME}",
            description: `<div>{ADDRESS}<br>{CITY}, {STATE}<br>{PHONE}<br>
            <br><p id="gisiaTxtMaxUse">click usage to see peak month</p>
            <img width="160px" height="120px" src="${(window as any).gisiaActiveImage}" >
            <canvas id="gisia-canBarChart" width="240" height="150"></canvas>
            <br><button  class="gisia-btnUsage" id='btnShowData' onclick='
            
            var usage = {USAGE};
            var data = [];
            for(var i = 0 ; i < 12 ; i++){
                data.push(usage.records[i][1].Value);
            }
            var canvas = document.getElementById("canvas");
            if (canvas.getContext) {
                var dl = data.length;
                var max = -999;
                for(var q = 0 ; q < dl; q++){
                    var curValue = parseFloat(data[q]);
                    if( curValue > max){
                        max = curValue;
                        //alert("max set to " + max);
                      }
                  }
                  document.getElementById("gisiaTxtMaxUse").innerHTML = "Max Use: " + Math.round(max);
                  //alert("max = " + max)  ;
                  //alert("data sub 0 " + data[0]);
                  var data2 =[];
                  for(var i = 0 ; i < dl; i++){
                    var val = parseFloat(data[i].toString());
                    var lessThanOne = val/max;
                    //alert("less than 1 " + lessThanOne);
                    data2.push(100 * lessThanOne );
                  }
                  
                  data = data2;
                  //alert(data[6] );
                  var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
                  var colors = ["#FFFFFF","#AAFFAA","#55FF55","#00FF00","#55FF00","#AAFF00","#FFFF00","#FFE100","#FFC300","#FFA500","#FFC355","#FFE1AA"];
                  var ctx = canvas.getContext("2d");
                  ctx.strokStyle = "#000000";
                  ctx.font = "10px serif";
                  for(var x = 0 ; x < 12; x++){
                    var xOffset = x*20;
                    ctx.fillStyle = colors[x];
                    var yStart = 100 - data[x];
                    ctx.fillRect(xOffset, yStart, 15, data[x]);
                    //alert(yStart + " , " + data[x]);
                    ctx.strokeRect(xOffset, yStart, 15, data[x]);
                    ctx.fillStyle = "#000000";
                    var y = (x % 2 === 0) ? 130 : 120;
                    ctx.fillText(months[x],xOffset, y);
                  }
                  ctx.font = "20px serif";
                  //ctx.fillText("MAX: " + max.toString(), 50,50) ;
            }
 
  '>Usage</button>  
            </div>`
        });

        this._spLayer = new FeatureLayer(featureCollection, {
            id: 'servicePointLayer',
            infoTemplate: popupTemplate,

        });
        this._spLayer.minScale = 360012;
        //Uses visual variables to symbolize on max usage and max month
        this._spLayer.renderer = this._servicePointRenderer;

        let eventReference = this._mapRef.on("layer-add-result", (results) => {
            if (results.layer.id == "servicePointLayer") {
                this._spLayer = ((results.layer) as FeatureLayer);
                //this._spLayer.renderer = this._servicePointRenderer;
                //this._spLayer.minScale = 4000;
                let features = [];
                let graphics = this._glSp.graphics;
                for (let i = 0; i < graphics.length; i++) {
                    //for (let i = 0; i < 2; i++) {
                    let item = graphics[i];
                    features.push(item);
                }

                this._spLayer.applyEdits(features, null, null, (addsResult: any, deletsResult: any, updateResults: any) => {
                    //Once the edits are applied, we can delete the graphics
                });
                eventReference.remove();
            }

        });

        //Feature layer click ServicePointClick
        this._spLayer.on("click", (evt) => {
            debugger;
            let spID = evt.graphic.attributes["LINKID"];
            (window as any).gisiaActiveFeature = spID;
            let spLayer = this._spLayer;

            let jsonForTemplate = this.PopupTemplateJson();
            let makeImageVisible = false;
            let description = jsonForTemplate.description;
            description = description.replace("**VISIBLE**", "collapse");
            let pictureDB = (window as any).gisiaPictureToFeatureDB;
            if (pictureDB !== undefined && pictureDB !== null) {
                let associatedPicture = pictureDB[spID];
                if (associatedPicture !== undefined) {
                    makeImageVisible = true;
                    let imgTag = `<img width="160px" height="120px" style="visibility:visible" src="${associatedPicture}" >`;
                    let tagToReplace = "<div id=\"gisia-divDynamicImage\"></div>";
                    let indexOfTagtoReplace = description.indexOf(tagToReplace);
                    if (indexOfTagtoReplace > -1) {
                        description = description.replace(tagToReplace, imgTag);
                    }
                }
            }
            jsonForTemplate.description = description;
            this._spLayer.setInfoTemplate(new PopupTemplate(
                jsonForTemplate
            ));
            if (makeImageVisible) {
                this._mapRef.infoWindow.resize(350, 500);
            }


            let chkTraceUpstream = (<HTMLInputElement>dom.byId("chkTraceUpstream"));
            let chkTraceDownstream = (<HTMLInputElement>dom.byId("chkTraceDownstream"));
            if (chkTraceUpstream === undefined || chkTraceUpstream === null) {
                return;
            }
            if (chkTraceUpstream.checked === false ) {
                debugger;
                return;
            }
            else {
                evt.preventDefault();
                let graphicIDInTrace = evt.graphic.attributes["LINKID"];
                let graphicsToSymbolize: Graphic[] = [];
                let sls = new SimpleLineSymbol();
                sls.setWidth(10);
                sls.setStyle("STYLE_SHORTDASH");
                sls.setColor(new Color([255, 0, 0, .75]));
                //Get the graphics for an upstream trace
                while (chkTraceUpstream && graphicIDInTrace !== -1) {
                    //get the parent of thie current graphicID
                    //graphicIDInTrace = this._dictSpTopology.getValue(graphicIDInTrace);
                    let associatedGraphic: Graphic = this._dictSP[graphicIDInTrace];
                    //let assocGraphicCloned =  new Graphic(associatedGraphic);
                    let pl: Polyline = new Polyline(this._mapRef.spatialReference);
                    let x1 = (associatedGraphic.geometry as Polyline).paths[0][0][0];
                    let y1 = (associatedGraphic.geometry as Polyline).paths[0][0][1];
                    let x2 = (associatedGraphic.geometry as Polyline).paths[0][1][0];
                    let y2 = (associatedGraphic.geometry as Polyline).paths[0][1][1];

                    pl.addPath([[x1, y1], [x2, y2]]);
                    pl.spatialReference = this._mapRef.spatialReference;
                    //associatedGraphic.geometry;
                    let newGraphic: Graphic = new Graphic(pl, sls, associatedGraphic.attributes);

                    graphicsToSymbolize.push(newGraphic);
                    graphicIDInTrace = associatedGraphic.attributes["PARENT"];

                }
                //Get the graphics for a downstream trace
                if (chkTraceDownstream) {

                }

                this._traceResults.clear();

                let srs: SimpleRenderer = new SimpleRenderer(sls);

                this._traceResults.setRenderer(srs);

                this._traceResults.setVisibility(true);
                let resultsPolyline: Polyline = new Polyline(this._mapRef.spatialReference);
                let pointsMakingUpPath: Point[] = [];
                for (let i = 0; i < graphicsToSymbolize.length; i++) {
                    let g: Graphic = graphicsToSymbolize[i];
                    let path = (g.geometry as Polyline).paths[0];
                    let firstPoint: Point = new Point(path[0]);
                    let secondPoint: Point = new Point(path[1]);
                    firstPoint.setSpatialReference(this._mapRef.spatialReference);
                    secondPoint.setSpatialReference(this._mapRef.spatialReference);
                    pointsMakingUpPath.push(secondPoint);
                    pointsMakingUpPath.push(firstPoint);

                }
                resultsPolyline.addPath(pointsMakingUpPath);
                let resultGraphic = new Graphic(resultsPolyline);
                this._traceResults.add(resultGraphic);
                this._mapRef.addLayer(this._traceResults);
            }
        });



        this._mapRef.addLayer(this._spLayer);

        //this._glSp.setVisibility(false);
        this._spLayer.setVisibility(true);
        //associate the features with the popup on click

    }

    getFeatureLayer(layerName: string): FeatureLayer {
        let retlyr: FeatureLayer = null;
        this._mapRef.graphicsLayerIds.forEach((layerID, index, array) => {
            let lyr = <FeatureLayer>this._mapRef.getLayer(layerID);
            if (lyr.id.toUpperCase() === layerName.toUpperCase()) {
                retlyr = lyr;
            }

        });
        return retlyr;
    }

    LabelInExtent2() {

    }
    //-116.476036,33.844951
    setupMapClickHandler() {



    }

    MakeData() {
        try {

            let lyrsToRemove = ["electricLineLayer", "servicePointLayer"];

            for (let i = 0; i < lyrsToRemove.length; i++) {
                let lyrToRemove = this._mapRef.getLayer(lyrsToRemove[i]);
                if (lyrToRemove !== null && lyrToRemove !== undefined) {
                    try {
                        this._mapRef.removeLayer(lyrToRemove);
                        (lyrToRemove as FeatureLayer).clear();
                    }
                    catch (ex) {

                    }
                }
            }
            this._electricLineLayer = null;
            this._spLayer = null;
            this._mapRef.graphics.clear();

            const MAXLEVEL = 6;
            //this._dictSpTopology = new Collections.Dictionary<number,number>(); //Collections.Dictionary<number,number>();
            this._dictSP = new Object();
            this._dictDownstream = new Object();
            this._gl06.clear();
            this._gl7.clear();
            this._traceResults.clear();
            this._gl8.clear();
            this._glSp.clear();

            let linesArray = [];
            let graphicArray = [];
            let startLineFromPoint = this.ProjectLatLongPoint(33.802558, -116.545520, this._mapRef);
            let endLineFromPoint = this.ProjectLatLongPoint(33.82484, -116.489442, this._mapRef);
            let startLine = new Polyline([[startLineFromPoint.x, startLineFromPoint.y], [endLineFromPoint.x, endLineFromPoint.y]]);
            startLine.spatialReference = this._mapRef.spatialReference;
            let line = new Line(0, -1, startLine, 0);
            let customerCount = 0;

            let g = new Graphic(line.geom);
            g.attributes = {
                ID: line.id,
                LEVEL: 0,
                PARENT: line.parent,
                LINKID: 0
            };
            //this._dictSpTopology.setValue(0,-1);
            this._dictSP[0] = g;
            this._dictDownstream[0] = [];
            graphicArray.push(g);
            //linesArray.push(line);

            let linesToVisit = [line];
            let lineMaxID = 0;
            let minMax = 99999;
            let maxMax = -1;
            while (linesToVisit.length > 0) {
                let currentLine = linesToVisit.pop();
                let x1 = currentLine.toPoint.x;
                let y1 = currentLine.toPoint.y;
                let newLevel = currentLine.level + 1;
                if (newLevel > MAXLEVEL) {
                    continue;
                }
                let newLength = 5000 / (Math.pow(2, newLevel));//LEVELS 0-6 LENGTHS ARE: 
                //add random number to the angle between 20 degrees and 70 degrees (.349 radians and 1.222 radians)
                let radiansToAdd = (Math.floor(Math.random() * (1222 - 349)) + 349) / 1000;
                for (let i = 0; i < 4; i++) {
                    let x2 = x1 + Math.cos((i * (Math.PI / 2)) + radiansToAdd) * newLength;
                    let y2 = y1 - Math.sin((i * (Math.PI / 2)) + radiansToAdd) * newLength;


                    let servicePointGeometry = new Point(x2, y2).setSpatialReference(this._mapRef.spatialReference);
                    let newPolyline = new Polyline([currentLine.toPointArray, [x2, y2]]);
                    newPolyline.spatialReference = this._mapRef.spatialReference;
                    lineMaxID++;
                    let newLine: Line = new Line(lineMaxID, currentLine.id, newPolyline, newLevel);
                    linesToVisit.push(newLine);
                    let g = new Graphic();
                    g.setGeometry(newPolyline);

                    if (newLevel === MAXLEVEL) {
                        customerCount++;
                        let usageObj: any = {
                            "records": [
                                [{ "Month": "JAN" }, { "Value": "1VALUE" }],
                                [{ "Month": "FEB" }, { "Value": "2VALUE" }],
                                [{ "Month": "MAR" }, { "Value": "3VALUE" }],
                                [{ "Month": "APR" }, { "Value": "4VALUE" }],
                                [{ "Month": "MAY" }, { "Value": "5VALUE" }],
                                [{ "Month": "JUN" }, { "Value": "6VALUE" }],
                                [{ "Month": "JUL" }, { "Value": "7VALUE" }],
                                [{ "Month": "AUG" }, { "Value": "8VALUE" }],
                                [{ "Month": "SEP" }, { "Value": "9VALUE" }],
                                [{ "Month": "OCT" }, { "Value": "10VALUE" }],
                                [{ "Month": "NOV" }, { "Value": "11VALUE" }],
                                [{ "Month": "DEC" }, { "Value": "12VALUE" }],
                            ]
                        };

                        let usageString = JSON.stringify(usageObj);
                        //let maxUsage = -1;
                        let maxMonthForThisCustomer = -1;
                        let maxUsageForAMonthInTheYearForThisCustomer = -1;
                        //If there were no seasons at all and average temperatures and customers were mixed evenly 
                        // customers would use power at a constant rate (the customerBasePower)
                        let customerBasePower = 100 + (Math.random() * 250);
                        //except, every third customer in a wealthy neighborhood use power much faster
                        //1000 meters squared is 1000000
                        let distanceFromEpicCenter = Math.sqrt(Math.pow(x2 - (-12965632), 2) + Math.pow(y2 - (4004956), 2));
                        let winterCustomer = false;
                        if (Math.random() > .66) {
                            if (distanceFromEpicCenter < 1000) {
                                let weight = (1000 - distanceFromEpicCenter) / 1000;
                                customerBasePower = (1 + (weight)) * customerBasePower;
                                winterCustomer = true;
                            }
                        }
                        //loop through the 12 months to get total useage for each month (typically highest in summer)
                        for (let i = 1; i < 13; i++) {
                            //Calculate delta from this month to decemeber and january - summer tends to have most use
                            let distanceFromDecember = 13 - i;
                            let distanceFromJanuary = i - 1;
                            //The month multiplier is between 1  to 4
                            let usageMultiplier = distanceFromDecember <= distanceFromJanuary ? (distanceFromDecember / 2) + 1 : (distanceFromJanuary / 2) + 1;
                            //Every 20th customer though is a winter resident and is therefore much more likely to have peaks in winter,
                            //so the peak months are effectively reversed
                            if (customerCount % 20 == 0 || winterCustomer) {
                                usageMultiplier = 5 + (usageMultiplier * -1); //1>4, 2>3, 2.5>2.5, 3>2, 4>1
                            }
                            //in addition to the one in 20 that are winter residents, there is a wealthy neighborhood where 
                            //there are a lot of winter residents who use a lot of power. This neighborhood is centered at
                            //-12965632,4004956, and your chances of being a winter resident are greatest near that point.
                            //anything within 1 kilometer of that point is inversely affected by distance. Customers at the epicenter use
                            //triple normal.
                            // else{
                            //     let dSqured = Math.pow(x2 - (-12965632),2) +  Math.pow(y2 - (4004956),2);
                            //     //1000 meters squared is 1000000
                            //     if(dSqured < 1000000){
                            //         let weight = dSqured / 1000000;
                            //         customerBasePower = (1 + ( weight)) * customerBasePower;
                            //         //usageMultiplier = usageMultiplier = 5 + (usageMultiplier * -1);
                            //     }
                            // }
                            //Of course not always does high summer or high winter have the most use, so multiply by random number. 
                            //the line below ensures that values fall between 1 and 5
                            usageMultiplier = 1 + (Math.random() * usageMultiplier);

                            let usageInMonth = usageMultiplier * customerBasePower;

                            if (usageInMonth > maxUsageForAMonthInTheYearForThisCustomer) {
                                maxUsageForAMonthInTheYearForThisCustomer = usageInMonth;
                                maxMonthForThisCustomer = i;
                                if (usageInMonth < minMax) {
                                    minMax = usageInMonth;
                                }
                                if (usageInMonth > maxMax) {
                                    maxMax = usageInMonth;
                                }
                            }
                            let searchString = i.toString() + "VALUE";
                            let replaceString = usageInMonth.toString();
                            usageString = usageString.replace(searchString, replaceString);
                        }
                        let last4OfPhone = 9999 - Math.floor(Math.random() * 8999);
                        let newSP = new Graphic(
                            servicePointGeometry, null, {
                                ID: newLine.id,
                                LEVEL: Math.floor(Math.random() * 6),
                                MAXMONTH: maxMonthForThisCustomer,
                                MAXUSAGE: maxUsageForAMonthInTheYearForThisCustomer,
                                FIRSTNAME: this.randomFirstNames[Math.floor(Math.random() * 26)],
                                LASTNAME: this.randomLastNames[Math.floor(Math.random() * 26)],
                                ADDRESS: Math.round((Math.random() * 1000)).toString() + " " + this.randomStreets[Math.floor(Math.random() * 26)],
                                CITY: this.randomCity[Math.floor(Math.random() * 26)],
                                STATE: this.randomState[Math.floor(Math.random() * 26)],
                                PHONE: "555-" + last4OfPhone,
                                USAGE: usageString,
                                LINKID: newLine.id
                            }
                        );
                        this._glSp.add(newSP);
                    }
                    if (newLevel !== MAXLEVEL) {
                        let newMiscPoint = new Graphic(
                            new Point(x2, y2).setSpatialReference(this._mapRef.spatialReference), null, {
                                ID: newLine.id,
                                LEVEL: 1
                            }
                        );
                        //this._glMiscPoints.add(newMiscPoint);
                    }
                    g.attributes = {
                        ID: newLine.id,
                        LEVEL: newLevel,
                        PARENT: newLine.parent,
                        LINKID: newLine.id
                    };
                    graphicArray.push(g);

                    //need to see if an entry in 
                    if (this._dictDownstream[newLine.id] === undefined) {
                        this._dictDownstream[newLine.id] = [];
                    }
                    //this._dictSpTopology.setValue(newLine.id,newLine.parent);
                    this._dictSP[newLine.id] = g; //newLine.parent;
                    this._dictDownstream[newLine.parent].push(newLine.id);
                    console.log(newLevel);
                }
            }

            let totalGraphics = graphicArray.length;
            for (let i = 0; i < totalGraphics; i++) {
                let graphic = graphicArray[i];
                switch (graphic.attributes.LEVEL) {
                    case 7:
                        this._gl7.add(graphic);
                        break;
                    case 8:
                        this._gl8.add(graphic);
                        break;
                    default:
                        this._gl06.add(graphic);
                        break;
                }

            }
            //this._mapRef.addLayer(this._gl06);
            //this._mapRef.addLayer(this._gl7);
            //this._mapRef.addLayer(this._gl8);
            //this._mapRef.addLayer(this._glSp);
            //alert("done: TOTAL = " + graphicArray.length);
            //alert("done: minMax / maxMax = " + minMax.toString() +   " | " + maxMax.toString());

        }
        catch (ex) {
            console.log("ERROR! " + ex.toString());
        }
    }
    ClearGraphics() {
        this._mapRef.infoWindow.resize(300, 390);
        this._traceResults.clear();
    }
    private uniqueValueRenderer_sp_JSON(): any {
        return {
            "type": "uniqueValue",
            "field1": "LEVEL",
            "defaultSymbol": {
                "color": [0, 0, 0, 78],
                "size": 6,
                "type": "esriSMS",
                "style": "esriSMSCircle"
            },
            "uniqueValueInfos": [
                {
                    "value": "1",
                    "symbol": {
                        "color": [255, 0, 0, 78],
                        "size": 20,
                        "type": "esriSMS",
                        "style": "esriSMSCircle"
                    }
                },
                {
                    "value": "2",
                    "symbol": {
                        "color": [0, 255, 0, 78],
                        "size": 30,
                        "type": "esriSMS",
                        "style": "esriSMSCircle"
                    }
                }
            ]
        };
    }
    private uniqueValueRendererJSON(): any {
        return {
            "type": "uniqueValue",
            "field1": "LEVEL",
            "defaultSymbol": {
                "color": [0, 0, 0, 255],
                "width": 1,
                "type": "esriSLS"
            },
            "uniqueValueInfos": [{
                "value": "0",
                "symbol": {
                    "color": [0, 0, 0, 255],
                    "width": 8,
                    "type": "esriSLS"
                }
            },
            {
                "value": "1",
                "symbol": {
                    "color": [0, 0, 0, 255],
                    "width": 7,
                    "type": "esriSLS"
                }
            },
            {
                "value": "2",
                "symbol": {
                    "color": [45, 45, 45, 255],
                    "width": 6,
                    "type": "esriSLS"
                }
            },
            {
                "value": "3",
                "symbol": {
                    "color": [90, 90, 90, 255],
                    "width": 5,
                    "type": "esriSLS"
                }
            },
            {
                "value": "4",
                "symbol": {
                    "color": [135, 135, 135, 255],
                    "width": 4,
                    "type": "esriSLS"
                }
            },
            {
                "value": "5",
                "symbol": {
                    "color": [180, 180, 180, 255],
                    "width": 3,
                    "type": "esriSLS"
                }
            }, {
                "value": "6",
                "symbol": {
                    "color": [200, 200, 200, 255],
                    "width": 2,
                    "type": "esriSLS"
                }
            },
            {
                "value": "7",
                "symbol": {
                    "color": [210, 210, 210, 255],
                    "width": 1,
                    "type": "esriSLS"
                }
            }]
        };

    }
    PopupTemplateJson(): any {
        return {
            title: "{FIRSTNAME} {LASTNAME}",
            description: `
            <div class="gisia-container">
                <div style="display:inline-block;float:left;margin-right:10px;" class="gisia-left-element">
            
                <div id="gisia-div-spInfo">
                <div>{ADDRESS}<br>{CITY}, {STATE}<br>{PHONE}<br>
                <p id="gisiaTxtMaxUse"></p>
                <button id='btnShowData' class='gisia-btnUsage' style="  background-color: #008CBA; 
                border: none;
                color: white;
                padding: 5px 12px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 12px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius:10px;" onclick='
                var usage = {USAGE};
                var data = [];
                for(var i = 0 ; i < 12 ; i++){
                    data.push(usage.records[i][1].Value);
                }
                var canvas = document.getElementById("gisia-canBarChart");
                if (canvas.getContext) {
                    var dl = data.length;
                    var max = -999;
                    for(var q = 0 ; q < dl; q++){
                        var curValue = parseFloat(data[q]);
                        if( curValue > max){
                            max = curValue;
                            //alert("max set to " + max);
                          }
                      }
                      document.getElementById("gisiaTxtMaxUse").innerHTML = "Max Use: " + Math.round(max);
                      //alert("max = " + max)  ;
                      //alert("data sub 0 " + data[0]);
                      var data2 =[];
                      for(var i = 0 ; i < dl; i++){
                        var val = parseFloat(data[i].toString());
                        var lessThanOne = val/max;
                        //alert("less than 1 " + lessThanOne);
                        data2.push(100 * lessThanOne );
                      }
                      
                      data = data2;
                      //alert(data[6] );
                      var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
                      var colors = ["#FFFFFF","#AAFFAA","#55FF55","#00FF00","#55FF00","#AAFF00","#FFFF00","#FFE100","#FFC300","#FFA500","#FFC355","#FFE1AA"];
                      var ctx = canvas.getContext("2d");
                      ctx.strokStyle = "#000000";
                      ctx.font = "10px serif";
                      for(var x = 0 ; x < 12; x++){
                        var xOffset = x*20;
                        ctx.fillStyle = colors[x];
                        var yStart = 100 - data[x];
                        ctx.fillRect(xOffset, yStart, 15, data[x]);
                        //alert(yStart + " , " + data[x]);
                        ctx.strokeRect(xOffset, yStart, 15, data[x]);
                        ctx.fillStyle = "#000000";
                        var y = (x % 2 === 0) ? 130 : 120;
                        ctx.fillText(months[x],xOffset, y);
                      }
                      ctx.font = "20px serif";
                      //ctx.fillText("MAX: " + max.toString(), 50,50) ;
                }
     
      '>Usage</button>
      </div> 
                </div>
          
            </div>
            <div style="display:inline-block;float:left" class="gisia-right-element">
            <div id="gisia-divDynamicImage"></div>
        </div>  
        <div>
                <canvas style="margin-top:15px" id="gisia-canBarChart" width="240" height="150"></canvas>
                </div>
            </div>`
        };
    }
}
class Line implements iLine {
    constructor(public id: number, public parent: number, public geom: Polyline, public level: number) {

    }
    private _angleRadians: number = 0;
    private _angleDegrees: number = 0;
    public get angleDegrees(): number {
        if (this._angleDegrees === 0) {
            this.calculateAngles()
        }
        return this._angleDegrees;
    }

    public get angleRadians(): number {
        if (this._angleRadians === 0) {
            this.calculateAngles()
        }
        return this._angleRadians;
    }
    public get fromPoint(): Point {
        return new Point(this.geom.paths[0][0]);
    }
    public get toPoint(): Point {
        let latLongPoint = new Point(this.geom.paths[0][1]);

        return latLongPoint
    }
    public calculateAngles() {
        let currentLine = this;
        let logicalLine = currentLine.geom.paths[0];

        let firstPoint = this.fromPoint;
        let secondPoint = this.toPoint;

        let angleRadians = Math.atan2(secondPoint.y - firstPoint.y, secondPoint.x - firstPoint.x);
        this._angleDegrees = angleRadians * (360 / (2 * Math.PI));
        this._angleRadians = angleRadians;

    }
    public get toPointArray() {
        return [this.toPoint.x, this.toPoint.y]
    }

}
interface iLine {
    "id": number,
    "parent": number,
    "geom": Polyline,
    "level": number,
    "angleRadians": number,
    "angleDegrees": number,
    "fromPoint": Point,
    "toPoint": Point,
    "toPointArray": number[]
}

interface iAggregateOperator {
    "relationshipId": string,
    "round": string,
    "field": string,
    "operation": string
}