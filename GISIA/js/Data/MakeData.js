define(["require", "exports", "dojo/dom", "esri/layers/GraphicsLayer", "esri/geometry/Polyline", "esri/geometry/Point", "esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/symbols/Font", "esri/symbols/TextSymbol", "esri/geometry/webMercatorUtils", "esri/geometry/Extent", "esri/tasks/query", "esri/dijit/PopupTemplate", "esri/layers/FeatureLayer", "esri/geometry/geometryEngine"], function (require, exports, dom, GraphicsLayer, Polyline, Point, Graphic, SimpleLineSymbol, SimpleMarkerSymbol, Color, SimpleRenderer, UniqueValueRenderer, Font, TextSymbol, WebMercatorUtils, Extent, Query, PopupTemplate, FeatureLayer, GeometryEngine) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MakeData = /** @class */ (function () {
        function MakeData(mapRef) {
            //tet
            this._privateVariable = null;
            //private _glMiscPoints: GraphicsLayer;
            this._traceResults = new GraphicsLayer({ id: "TraceResults" });
            this._dictSP = null;
            this._dictDownstream = null; //this will be like Collections.Dictionary<number, [number]> = null;  **if** I can get dictionary working!!
            this.randomFirstNames = [
                "Alan", "Barbara", "Chuck", "Dan", "Elise", "Frank", "Georgia", "Hank", "Ingrid", "Jack", "Kathy", "Larry", "Mary", "Ned", "Oprah",
                "Paul", "Queen", "Ron", "Susan", "Thom", "Uma", "Vince", "Wanda", "Xavier", "Yoko", "Zufong"
            ];
            this.randomCity = ["Austin", "Baltimore", "Chicago", "Denver", "Eugene", "Fargo", "Gainsville", "Houston", "Ipswich", "Jacksonville",
                "Kipler", "Lawrence", "Mayberry", "Nantucket", "Ogden", "Philadelphia", "Quebec City", "Ramon", "Susanville", "Toledo", "Ulster", "Venice",
                "Wilsonville", "Xanadu", "Yellowstone", "Zion"];
            this.randomState = ["Texas", "Utah", "Oregon", "Washington", "California", "Maine", "Mississippi", "Colorado", "Idaho", "Ohio", "Alabama",
                "Alaska", "New York", "Wyoming", "Oklahoma", "Montana", "Rhode Island", "New Jersey", "Wisconsin", "Virginia", "Pennsylvania", "Florida", "Hawaii",
                "Nebraska", "Arizona", "Illinois"];
            this.randomLastNames = [
                "Alberts", "Billings", "Chadwick", "Daniels", "Earnheardt", "Fairchild", "Grossman", "Harris", "Irwin", "Johnson", "Keeting", "Lawrence", "Michaels", "Nelson", "Olsen",
                "Poundstone", "Quincy", "Rasmussen", "Sadler", "Tillerson", "Urich", "Vance", "Wilson", "Xu", "Youngblood", "Zaher"
            ];
            this.randomStreets = [
                "Ash", "Berry", "Cherry", "Dogwood", "Elm", "Furley", "Gathorne", "Harleton", "Islington", "Jowett", "Kensington", "Lilestone", "Marlborough", "Newton", "Osbert",
                "Palmerston", "Queensland", "Raynor", "Sherwood", "Trinity", "Upwey", "Vacek", "Warwick", "Xenia", "Yardley", "Zealand"
            ];
            this._servicePointRenderer = {};
            this._extentChangeCounter = 0;
            this._labelPresent = false;
            //Simple Expression
            this.labelExpression0 = "\n    {FIRSTNAME} {LASTNAME}{NEWLINE}\n    {ADDRESS}\n    ";
            //Name / addreess / Total electric usage (aggregation)
            this.labelExpression1 = "\n    Name: {FIRSTNAME} {LASTNAME}{NEWLINE}\n    {ADDRESS},{CITY},{STATE}{NEWLINE}\n    <RELATION layerID=\"0\" primaryKey=\"USAGE\" foreignKey=\"\" where=\"\" outputRecords=\"relatedElectricUsageRecords\", fields=\"Month,Value\" >\n        <FOREACH delimter=\",\">\n            {Value}\n        </FOREACH>\n    </RELATION>\n    TOTAL: \n    <SUM inputRecords=\"relatedElectricUsageRecords\" field=\"Value\" round=\"2\" where=\"\">\n        {SUM} KWH\n    </SUM>\n    ";
            //Highest usage during summer (filtering)
            this.labelExpression2 = "\n    {ADDRESS}{NEWLINE}\n    <RELATION layerID=\"0\" primaryKey=\"USAGE\" foreignKey=\"\" \n        where=\"Month in ('Jun','July','Aug')\" outputRecords=\"relatedElectricUsageRecords\", fields=\"Month,Value\" >\n    </RELATION>\n    {NEWLINE}\n    TOTAL: <MAX inputRecords=\"relatedElectricUsageRecords\" field=\"Value\" round=\"2\">\n        {Month} : {Value} KWH\n    </MAX> \n    ";
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
            var uvr = new UniqueValueRenderer(this.uniqueValueRendererJSON());
            var symbol = new SimpleMarkerSymbol();
            symbol.setColor(new Color([150, 150, 150, 0.5]));
            symbol.setSize(10);
            var vvSPRenderer = new SimpleRenderer(symbol); //this.uniqueValueRenderer_sp_JSON());
            var colWinter = dom.byId("gisiaWinter").value;
            var colSpring = dom.byId("gisiaSpring").value;
            var colSummer = dom.byId("gisiaSummer").value;
            var colFall = dom.byId("gisiaFall").value;
            var visualParams = [];
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
            var sizeMatters = dom.byId("gisia-chkVaryByUsage").checked;
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
            var simpleRenderer = new SimpleRenderer(symbol);
            this._servicePointRenderer = vvSPRenderer; // renderer.toJson();
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
        MakeData.prototype.listenForExtentChange = function () {
            var _this = this;
            this._mapRef.on("extent-change", function (e) {
                if (_this._labelPresent) {
                    _this._mapRef.graphics.clear();
                }
                var scale = _this._mapRef.getScale();
                _this._extentChangeCounter++;
                console.log("Scale " + scale + "  counter: " + _this._extentChangeCounter);
                var chkLabelServicePoints = dom.byId("gisia-chkLabelServicePoints");
                var numLabelScale = dom.byId("gisia-numLabelScale");
                var labelServicePoints = true;
                if (chkLabelServicePoints === null || chkLabelServicePoints === undefined) {
                    labelServicePoints = false;
                }
                else {
                    labelServicePoints = chkLabelServicePoints.checked;
                }
                if (labelServicePoints) {
                    var labelScale = (numLabelScale === null) ? 5000 : numLabelScale.value;
                    if (scale <= labelScale) {
                        var thisLevel = _this._mapRef.getLevel();
                        _this._mapRef.graphics.clear();
                        //if (thisLevel > 17) {
                        _this.LabelInExtent();
                        _this._labelPresent = true;
                    }
                }
            });
        };
        MakeData.prototype.ProjectLatLongPoint = function (lat, long, map) {
            //Guard against a mistake where lat=long
            if (lat < -90) {
                var tempLat = lat;
                var tempLon = long;
                lat = tempLon;
                long = tempLat;
            }
            var llpnt = new Point(long, lat);
            var mapPoint = WebMercatorUtils.geographicToWebMercator(llpnt);
            return mapPoint;
        };
        MakeData.prototype.LabelInExtent = function () {
            var _this = this;
            var query = new Query();
            //query.outFields = ["*"];
            query.geometry = this._mapRef.extent;
            //query.spatialRelationship = "SPATIAL_REL_INTERSECTS";
            query.returnGeometry = true;
            if (this._spLayer) {
                if (this._spLayer.isVisibleAtScale(this._mapRef.getScale())) {
                    this._spLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (featureSet) {
                        _this.AddLabelsToGraphics(featureSet);
                    }, function (err) {
                        console.log("ERROR " + err.toString());
                    });
                }
            }
        };
        // Returns the entire label expression as an array of arrays where the outer array represents lines and the inner array are the elements for that line
        MakeData.prototype.GetLabelExpressionAsArray = function () {
            try {
                var labelExpression = document.getElementById("gisia-txtLabelExpression").value;
                labelExpression = labelExpression.replace(/[\n\r]/g, '');
                var lines = labelExpression.split("[CR]");
                var len = lines.length;
                var outLinesArray = [];
                for (var i = 0; i < lines.length; i++) {
                    var lineString = lines[i].trim();
                    //outLinesArray.push(line.trim());
                    var elementsInLine = lineString.split("`");
                    var line = [];
                    for (var j = 0; j < elementsInLine.length; j++) {
                        var elementInLine = elementsInLine[j];
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
        };
        MakeData.prototype.GetLabelLines = function (labelExpressionAsArray, graphic) {
            var textLines = [];
            for (var line = 0; line < labelExpressionAsArray.length; line++) {
                var commandsForLine = labelExpressionAsArray[line];
                var textForLine = "";
                for (var commandIndex = 0; commandIndex < commandsForLine.length; commandIndex++) {
                    var labelElement = commandsForLine[commandIndex];
                    if (labelElement.indexOf("[") + labelElement.indexOf("]") > 1) {
                        var fieldName = labelElement.substr(1, labelElement.length - 2).trim(); //e.g. "OBJECTID"
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
        };
        MakeData.prototype.HandleAggregate = function (json, graphic) {
            //todo delegate this generic stuff to HandleOperataor
            var aggPvPairs = null;
            try {
                aggPvPairs = json.params;
            }
            catch (ex) {
                throw ("The aggregate function did not have all expected properties");
            }
            if (aggPvPairs.relationshipId !== "-1") {
                return; //not implmented yet
            }
            //USAGE.records.Value  (where "Value" is the poorly named field. we want the value of Value)
            var pathToJsonData = aggPvPairs.field.split(".");
            var jsonField = graphic.attributes[pathToJsonData[0]]; //USAGE
            var max = -9999999999;
            var min = 9999999999;
            var sum = 0;
            var toJson = JSON.parse(jsonField);
            var records = toJson[pathToJsonData[1]];
            var recordCount = records.length;
            var dataField = pathToJsonData[2];
            for (var i = 0; i < recordCount; i++) {
                //Record is a row which has an array of name value pairs corresponding 
                //to fields and their values.  one of them will be the field we want.
                //for the sample data, the two fields are Month and Value
                var record = records[i];
                var value = 0;
                for (var fieldIndex = 0; fieldIndex < record.length; fieldIndex++) {
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
            var average = sum / recordCount;
            var precision = parseInt(aggPvPairs.round);
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
        };
        MakeData.prototype.HandleOperators = function (labelElement, graphic) {
            var retValue = "";
            var json = this.JSONFromLabelElement(labelElement); //todo cache these
            switch (json.name) {
                case "AGGREGATE":
                    retValue = this.HandleAggregate(json, graphic);
                    break;
            }
            return retValue;
        };
        MakeData.prototype.JSONFromLabelElement = function (labelElement) {
            var firstQuoteIndex = -1;
            var secondQuoteIndex = -1;
            var equalIndex = -1;
            var foundFirstQuote = false;
            var foundOperationName = false;
            var foundFirstSpace = false;
            var operationName = "";
            var startOfVariableIndex = -1;
            var paramsNode = null;
            var json = {};
            var leftSide = "";
            var rightSide = "";
            for (var i = 0; i < labelElement.length; i++) {
                var character = labelElement[i];
                if (character === " " && foundOperationName === false) {
                    operationName = labelElement.substring(1, i);
                    json["name"] = operationName;
                    json["params"] = {};
                    paramsNode = json["params"];
                    foundOperationName = true;
                    startOfVariableIndex = i;
                }
                if (foundOperationName) {
                    if (character === "=" && foundFirstQuote === false) {
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
                        }
                        else {
                            foundFirstQuote = true;
                            firstQuoteIndex = i;
                        }
                    }
                } //found foundOperationName
            }
            return json;
        };
        MakeData.prototype.PrecisionRound = function (num, precision) {
            var factor = Math.pow(10, precision);
            var answer = Math.round(num * factor) / factor;
            return answer;
        };
        MakeData.prototype.AddLabelsToGraphics = function (featureSet) {
            var _this = this;
            var DISTANCE_AT_LEVEL_15 = 75;
            var MAXLABELS = 700; //todo read from user
            var checkForOverlap = true;
            var fontSize = 16;
            var stopLabelingAtThisExtent = false;
            var level = this._mapRef.getLevel();
            var deltaFromBaseLevel = 15 - level;
            var multiplier = Math.pow(2, deltaFromBaseLevel);
            var amountToAdd = multiplier * DISTANCE_AT_LEVEL_15;
            var spatRef = this._mapRef.spatialReference;
            var font = new Font(fontSize.toString() + "px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
            font.family = "Arial";
            var offset = this._mapRef.extent.getWidth() / 60;
            var labelsPlaced = 0;
            var labelExtents = [];
            var labelExpressionAsArray = this.GetLabelExpressionAsArray();
            for (var graphicIndex = 0; graphicIndex < featureSet.length; graphicIndex++) {
                if (stopLabelingAtThisExtent) {
                    break;
                }
                //when checking for overlaps, no extents beyond the currentLabelExtentsIndex needs to be checked (a label never overlaps with itself)
                var currentLabelExtentsIndex = labelExtents.length;
                var graphic = featureSet[graphicIndex];
                var startPoint = graphic.geometry;
                var x = graphic.geometry.x;
                var y = graphic.geometry.y;
                //TODO - Build this out to be flexible
                var textLines = this.GetLabelLines(labelExpressionAsArray, graphic);
                // let textForLine1 = `${graphic.attributes["FIRSTNAME"]} ${graphic.attributes["LASTNAME"]} `;
                // let textForLine2 = `${graphic.attributes["ADDRESS"]} ST., `
                // let textForLine3 = `${graphic.attributes["CITY"]}, ${graphic.attributes["STATE"]}`;
                // let textLines = [textForLine1, textForLine2, textForLine3];
                var labelThisFeature = true;
                var labelTuples = [];
                for (var lineIndex = 0; lineIndex < textLines.length; lineIndex++) {
                    var textForLine = textLines[lineIndex];
                    var ts = new TextSymbol(textForLine, font, new Color([0, 0, 0]));
                    ts.xoffset = offset;
                    ts.yoffset = offset;
                    ts.haloColor = new Color([255, 255, 255]);
                    ts.haloSize = 2;
                    ts.setHorizontalAlignment("left");
                    var newX = x + offset;
                    var newY = (y - (lineIndex * amountToAdd)) + offset;
                    var textPoint = new Point(newX, newY);
                    textPoint.spatialReference = spatRef;
                    if (checkForOverlap) {
                        var lineLength = multiplier * 3.0 * textForLine.length * fontSize;
                        var thisExtent = new Extent(newX, newY, (newX + lineLength), (newY + (fontSize)), spatRef);
                        if (this.hasOverlaps(labelExtents, thisExtent, currentLabelExtentsIndex) === false) {
                            labelExtents.push(thisExtent);
                            var lt = [textPoint, ts];
                            labelTuples.push(lt);
                        }
                        else {
                            labelThisFeature = false;
                            break;
                        }
                    }
                }
                if (labelThisFeature) {
                    labelTuples.forEach(function (labelTuple, index, labelTuples) {
                        var textGraphicToAdd = new Graphic(labelTuple[0], labelTuple[1]);
                        _this._mapRef.graphics.add(textGraphicToAdd);
                        labelsPlaced++;
                        if (labelsPlaced > MAXLABELS) {
                            stopLabelingAtThisExtent = true;
                            console.log("MAX LABELS REACHED FOR EXTENT");
                        }
                    });
                }
            }
        };
        MakeData.prototype.hasOverlaps = function (labelExtents, testExtent, currentLabelExtentsIndex) {
            for (var i = 0; i < currentLabelExtentsIndex; i++) {
                if (GeometryEngine.overlaps(labelExtents[i], testExtent)) {
                    return true;
                }
            }
            return false;
        };
        MakeData.prototype.MakeLinesIntoFeatureLayer = function () {
            var _this = this;
            var userWantsLines = document.getElementById("DataViewSelect");
            var selectedOption = userWantsLines.selectedOptions[0];
            if (selectedOption.value.indexOf("Lines") < 0) {
                return;
            }
            var featureCollectionLine = {
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
                "drawingInfo": {},
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
            this._electricLineLayer.minScale = 290000; //
            //Uses visual variables to symbolize on max usage and max month
            this._electricLineLayer.renderer = new UniqueValueRenderer(this.uniqueValueRendererJSON());
            var eventReference = this._mapRef.on("layer-add-result", function (results) {
                if (results.layer.id == "electricLineLayer") {
                    _this._electricLineLayer = (results.layer);
                    //this._spLayer.renderer = this._servicePointRenderer;
                    //this._spLayer.minScale = 4000;
                    var features = [];
                    var graphics = _this._gl06.graphics;
                    for (var i = 0; i < graphics.length; i++) {
                        //for (let i = 0; i < 2; i++) {
                        var item = graphics[i];
                        features.push(item);
                    }
                    _this._electricLineLayer.applyEdits(features, null, null, function (addsResult, deletsResult, updateResults) {
                        //Once the edits are applied, we can delete the graphics
                    });
                    eventReference.remove();
                }
            });
            this._electricLineLayer.on("click", function (evt) {
                debugger;
                var g = evt.graphic;
                var chkTraceUpstream = dom.byId("chkTraceUpstream").checked;
                var chkTraceDownstream = dom.byId("chkTraceDownstream").checked;
                if (chkTraceDownstream === false) {
                    return;
                }
                _this._traceResults.clear();
                var id = evt.graphic.attributes["ID"];
                //let graphicsToSymbolize: Graphic[] = [];
                var sls = new SimpleLineSymbol();
                sls.setWidth(10);
                sls.setStyle("STYLE_SHORTDASH");
                var dstCol = new Color(dom.byId("gisia-colTraceDownstream").value);
                var dstColA = [dstCol.r, dstCol.g, dstCol.b, .5];
                //downstreamTraceColor.setColor(new Color(downstreamTraceColor.r,downstreamTraceColor.g,downstreamTraceColor.b,.5));
                sls.setColor(new Color(dstColA));
                var unionedExtent = new Extent(99999999, 99999999, -99999999, -99999999, _this._mapRef.spatialReference);
                var linesToVisit = [id];
                var spatRef = _this._mapRef.spatialReference;
                while (linesToVisit.length > 0) {
                    var id_1 = linesToVisit.pop();
                    var associatedGraphic = _this._dictSP[id_1];
                    var pl = new Polyline(_this._mapRef.spatialReference);
                    var x1 = associatedGraphic.geometry.paths[0][0][0];
                    var y1 = associatedGraphic.geometry.paths[0][0][1];
                    var x2 = associatedGraphic.geometry.paths[0][1][0];
                    var y2 = associatedGraphic.geometry.paths[0][1][1];
                    if (x1 < unionedExtent.xmin) {
                        unionedExtent.xmin = x1 - 300;
                    }
                    if (x2 > unionedExtent.xmax) {
                        unionedExtent.xmax = x2 + 300;
                    }
                    if (y1 < unionedExtent.ymin) {
                        unionedExtent.ymin = y1 - 300;
                    }
                    if (y2 > unionedExtent.ymax) {
                        unionedExtent.ymax = y2 + 300;
                    }
                    pl.addPath([[x1, y1], [x2, y2]]);
                    pl.spatialReference = spatRef;
                    var newGraphic = new Graphic(pl, sls, associatedGraphic.attributes);
                    //graphicsToSymbolize.push(newGraphic);
                    _this._traceResults.add(newGraphic);
                    var immediateChildren = _this._dictDownstream[id_1];
                    for (var i = 0; i < immediateChildren.length; i++) {
                        linesToVisit.push(immediateChildren[i]);
                    }
                }
                var simpRend = new SimpleRenderer(sls);
                _this._traceResults.setRenderer(simpRend);
                _this._traceResults.setVisibility(true);
                _this._mapRef.setExtent(unionedExtent);
                _this._mapRef.addLayer(_this._traceResults);
            });
            this._mapRef.addLayer(this._electricLineLayer, 0);
            //this._glSp.setVisibility(false);
            this._electricLineLayer.setVisibility(true);
            //associate the features with the popup on click
        };
        MakeData.prototype.MakeSPGraphicsIntoFeatureLayer = function () {
            var _this = this;
            var userWantsPoints = document.getElementById("DataViewSelect");
            var selectedOption = userWantsPoints.selectedOptions[0];
            if (selectedOption.value.indexOf("Points") < 0) {
                return;
            }
            var featureCollection = {
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
                description: "<div>{ADDRESS}<br>{CITY}, {STATE}<br>{PHONE}<br>\n            <br><p id=\"gisiaTxtMaxUse\">click usage to see peak month</p>\n            <img width=\"160px\" height=\"120px\" src=\"" + window.gisiaActiveImage + "\" >\n            <canvas id=\"gisia-canBarChart\" width=\"240\" height=\"150\"></canvas>\n            <br><button  class=\"gisia-btnUsage\" id='btnShowData' onclick='\n            \n            var usage = {USAGE};\n            var data = [];\n            for(var i = 0 ; i < 12 ; i++){\n                data.push(usage.records[i][1].Value);\n            }\n            var canvas = document.getElementById(\"canvas\");\n            if (canvas.getContext) {\n                var dl = data.length;\n                var max = -999;\n                for(var q = 0 ; q < dl; q++){\n                    var curValue = parseFloat(data[q]);\n                    if( curValue > max){\n                        max = curValue;\n                        //alert(\"max set to \" + max);\n                      }\n                  }\n                  document.getElementById(\"gisiaTxtMaxUse\").innerHTML = \"Max Use: \" + Math.round(max);\n                  //alert(\"max = \" + max)  ;\n                  //alert(\"data sub 0 \" + data[0]);\n                  var data2 =[];\n                  for(var i = 0 ; i < dl; i++){\n                    var val = parseFloat(data[i].toString());\n                    var lessThanOne = val/max;\n                    //alert(\"less than 1 \" + lessThanOne);\n                    data2.push(100 * lessThanOne );\n                  }\n                  \n                  data = data2;\n                  //alert(data[6] );\n                  var months = [\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\",\"JUL\",\"AUG\",\"SEP\",\"OCT\",\"NOV\",\"DEC\"];\n                  var colors = [\"#FFFFFF\",\"#AAFFAA\",\"#55FF55\",\"#00FF00\",\"#55FF00\",\"#AAFF00\",\"#FFFF00\",\"#FFE100\",\"#FFC300\",\"#FFA500\",\"#FFC355\",\"#FFE1AA\"];\n                  var ctx = canvas.getContext(\"2d\");\n                  ctx.strokStyle = \"#000000\";\n                  ctx.font = \"10px serif\";\n                  for(var x = 0 ; x < 12; x++){\n                    var xOffset = x*20;\n                    ctx.fillStyle = colors[x];\n                    var yStart = 100 - data[x];\n                    ctx.fillRect(xOffset, yStart, 15, data[x]);\n                    //alert(yStart + \" , \" + data[x]);\n                    ctx.strokeRect(xOffset, yStart, 15, data[x]);\n                    ctx.fillStyle = \"#000000\";\n                    var y = (x % 2 === 0) ? 130 : 120;\n                    ctx.fillText(months[x],xOffset, y);\n                  }\n                  ctx.font = \"20px serif\";\n                  //ctx.fillText(\"MAX: \" + max.toString(), 50,50) ;\n            }\n \n  '>Usage</button>  \n            </div>"
            });
            this._spLayer = new FeatureLayer(featureCollection, {
                id: 'servicePointLayer',
                infoTemplate: popupTemplate,
            });
            this._spLayer.minScale = 360012;
            //Uses visual variables to symbolize on max usage and max month
            this._spLayer.renderer = this._servicePointRenderer;
            var eventReference = this._mapRef.on("layer-add-result", function (results) {
                if (results.layer.id == "servicePointLayer") {
                    _this._spLayer = (results.layer);
                    //this._spLayer.renderer = this._servicePointRenderer;
                    //this._spLayer.minScale = 4000;
                    var features = [];
                    var graphics = _this._glSp.graphics;
                    for (var i = 0; i < graphics.length; i++) {
                        //for (let i = 0; i < 2; i++) {
                        var item = graphics[i];
                        features.push(item);
                    }
                    _this._spLayer.applyEdits(features, null, null, function (addsResult, deletsResult, updateResults) {
                        //Once the edits are applied, we can delete the graphics
                    });
                    eventReference.remove();
                }
            });
            //Feature layer click ServicePointClick
            this._spLayer.on("click", function (evt) {
                debugger;
                var spID = evt.graphic.attributes["LINKID"];
                window.gisiaActiveFeature = spID;
                var spLayer = _this._spLayer;
                var jsonForTemplate = _this.PopupTemplateJson();
                var makeImageVisible = false;
                var description = jsonForTemplate.description;
                description = description.replace("**VISIBLE**", "collapse");
                var pictureDB = window.gisiaPictureToFeatureDB;
                if (pictureDB !== undefined && pictureDB !== null) {
                    var associatedPicture = pictureDB[spID];
                    if (associatedPicture !== undefined) {
                        makeImageVisible = true;
                        var imgTag = "<img width=\"160px\" height=\"120px\" style=\"visibility:visible\" src=\"" + associatedPicture + "\" >";
                        var tagToReplace = "<div id=\"gisia-divDynamicImage\"></div>";
                        var indexOfTagtoReplace = description.indexOf(tagToReplace);
                        if (indexOfTagtoReplace > -1) {
                            description = description.replace(tagToReplace, imgTag);
                        }
                    }
                }
                jsonForTemplate.description = description;
                _this._spLayer.setInfoTemplate(new PopupTemplate(jsonForTemplate));
                if (makeImageVisible) {
                    _this._mapRef.infoWindow.resize(350, 500);
                }
                var chkTraceUpstream = dom.byId("chkTraceUpstream");
                var chkTraceDownstream = dom.byId("chkTraceDownstream");
                if (chkTraceUpstream === undefined || chkTraceUpstream === null) {
                    return;
                }
                if (chkTraceUpstream.checked === false) {
                    debugger;
                    return;
                }
                else {
                    evt.preventDefault();
                    var graphicIDInTrace = evt.graphic.attributes["LINKID"];
                    var graphicsToSymbolize = [];
                    var sls = new SimpleLineSymbol();
                    sls.setWidth(10);
                    sls.setStyle("STYLE_SHORTDASH");
                    sls.setColor(new Color([255, 0, 0, .75]));
                    //Get the graphics for an upstream trace
                    while (chkTraceUpstream && graphicIDInTrace !== -1) {
                        //get the parent of thie current graphicID
                        //graphicIDInTrace = this._dictSpTopology.getValue(graphicIDInTrace);
                        var associatedGraphic = _this._dictSP[graphicIDInTrace];
                        //let assocGraphicCloned =  new Graphic(associatedGraphic);
                        var pl = new Polyline(_this._mapRef.spatialReference);
                        var x1 = associatedGraphic.geometry.paths[0][0][0];
                        var y1 = associatedGraphic.geometry.paths[0][0][1];
                        var x2 = associatedGraphic.geometry.paths[0][1][0];
                        var y2 = associatedGraphic.geometry.paths[0][1][1];
                        pl.addPath([[x1, y1], [x2, y2]]);
                        pl.spatialReference = _this._mapRef.spatialReference;
                        //associatedGraphic.geometry;
                        var newGraphic = new Graphic(pl, sls, associatedGraphic.attributes);
                        graphicsToSymbolize.push(newGraphic);
                        graphicIDInTrace = associatedGraphic.attributes["PARENT"];
                    }
                    //Get the graphics for a downstream trace
                    if (chkTraceDownstream) {
                    }
                    _this._traceResults.clear();
                    var srs = new SimpleRenderer(sls);
                    _this._traceResults.setRenderer(srs);
                    _this._traceResults.setVisibility(true);
                    var resultsPolyline = new Polyline(_this._mapRef.spatialReference);
                    var pointsMakingUpPath = [];
                    for (var i = 0; i < graphicsToSymbolize.length; i++) {
                        var g = graphicsToSymbolize[i];
                        var path = g.geometry.paths[0];
                        var firstPoint = new Point(path[0]);
                        var secondPoint = new Point(path[1]);
                        firstPoint.setSpatialReference(_this._mapRef.spatialReference);
                        secondPoint.setSpatialReference(_this._mapRef.spatialReference);
                        pointsMakingUpPath.push(secondPoint);
                        pointsMakingUpPath.push(firstPoint);
                    }
                    resultsPolyline.addPath(pointsMakingUpPath);
                    var resultGraphic = new Graphic(resultsPolyline);
                    _this._traceResults.add(resultGraphic);
                    _this._mapRef.addLayer(_this._traceResults);
                }
            });
            this._mapRef.addLayer(this._spLayer);
            //this._glSp.setVisibility(false);
            this._spLayer.setVisibility(true);
            //associate the features with the popup on click
        };
        MakeData.prototype.getFeatureLayer = function (layerName) {
            var _this = this;
            var retlyr = null;
            this._mapRef.graphicsLayerIds.forEach(function (layerID, index, array) {
                var lyr = _this._mapRef.getLayer(layerID);
                if (lyr.id.toUpperCase() === layerName.toUpperCase()) {
                    retlyr = lyr;
                }
            });
            return retlyr;
        };
        MakeData.prototype.LabelInExtent2 = function () {
        };
        //-116.476036,33.844951
        MakeData.prototype.setupMapClickHandler = function () {
        };
        MakeData.prototype.MakeData = function () {
            try {
                var lyrsToRemove = ["electricLineLayer", "servicePointLayer"];
                for (var i = 0; i < lyrsToRemove.length; i++) {
                    var lyrToRemove = this._mapRef.getLayer(lyrsToRemove[i]);
                    if (lyrToRemove !== null && lyrToRemove !== undefined) {
                        try {
                            this._mapRef.removeLayer(lyrToRemove);
                            lyrToRemove.clear();
                        }
                        catch (ex) {
                        }
                    }
                }
                this._electricLineLayer = null;
                this._spLayer = null;
                this._mapRef.graphics.clear();
                var MAXLEVEL = 6;
                //this._dictSpTopology = new Collections.Dictionary<number,number>(); //Collections.Dictionary<number,number>();
                this._dictSP = new Object();
                this._dictDownstream = new Object();
                this._gl06.clear();
                this._gl7.clear();
                this._traceResults.clear();
                this._gl8.clear();
                this._glSp.clear();
                var linesArray = [];
                var graphicArray = [];
                var startLineFromPoint = this.ProjectLatLongPoint(33.802558, -116.545520, this._mapRef);
                var endLineFromPoint = this.ProjectLatLongPoint(33.82484, -116.489442, this._mapRef);
                var startLine = new Polyline([[startLineFromPoint.x, startLineFromPoint.y], [endLineFromPoint.x, endLineFromPoint.y]]);
                startLine.spatialReference = this._mapRef.spatialReference;
                var line = new Line(0, -1, startLine, 0);
                var customerCount = 0;
                var g = new Graphic(line.geom);
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
                var linesToVisit = [line];
                var lineMaxID = 0;
                var minMax = 99999;
                var maxMax = -1;
                while (linesToVisit.length > 0) {
                    var currentLine = linesToVisit.pop();
                    var x1 = currentLine.toPoint.x;
                    var y1 = currentLine.toPoint.y;
                    var newLevel = currentLine.level + 1;
                    if (newLevel > MAXLEVEL) {
                        continue;
                    }
                    var newLength = 5000 / (Math.pow(2, newLevel)); //LEVELS 0-6 LENGTHS ARE: 
                    //add random number to the angle between 20 degrees and 70 degrees (.349 radians and 1.222 radians)
                    var radiansToAdd = (Math.floor(Math.random() * (1222 - 349)) + 349) / 1000;
                    for (var i = 0; i < 4; i++) {
                        var x2 = x1 + Math.cos((i * (Math.PI / 2)) + radiansToAdd) * newLength;
                        var y2 = y1 - Math.sin((i * (Math.PI / 2)) + radiansToAdd) * newLength;
                        var servicePointGeometry = new Point(x2, y2).setSpatialReference(this._mapRef.spatialReference);
                        var newPolyline = new Polyline([currentLine.toPointArray, [x2, y2]]);
                        newPolyline.spatialReference = this._mapRef.spatialReference;
                        lineMaxID++;
                        var newLine = new Line(lineMaxID, currentLine.id, newPolyline, newLevel);
                        linesToVisit.push(newLine);
                        var g_1 = new Graphic();
                        g_1.setGeometry(newPolyline);
                        if (newLevel === MAXLEVEL) {
                            customerCount++;
                            var usageObj = {
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
                            var usageString = JSON.stringify(usageObj);
                            //let maxUsage = -1;
                            var maxMonthForThisCustomer = -1;
                            var maxUsageForAMonthInTheYearForThisCustomer = -1;
                            //If there were no seasons at all and average temperatures and customers were mixed evenly 
                            // customers would use power at a constant rate (the customerBasePower)
                            var customerBasePower = 100 + (Math.random() * 250);
                            //except, every third customer in a wealthy neighborhood use power much faster
                            //1000 meters squared is 1000000
                            var distanceFromEpicCenter = Math.sqrt(Math.pow(x2 - (-12965632), 2) + Math.pow(y2 - (4004956), 2));
                            var winterCustomer = false;
                            if (Math.random() > .66) {
                                if (distanceFromEpicCenter < 1000) {
                                    var weight = (1000 - distanceFromEpicCenter) / 1000;
                                    customerBasePower = (1 + (weight)) * customerBasePower;
                                    winterCustomer = true;
                                }
                            }
                            //loop through the 12 months to get total useage for each month (typically highest in summer)
                            for (var i_1 = 1; i_1 < 13; i_1++) {
                                //Calculate delta from this month to decemeber and january - summer tends to have most use
                                var distanceFromDecember = 13 - i_1;
                                var distanceFromJanuary = i_1 - 1;
                                //The month multiplier is between 1  to 4
                                var usageMultiplier = distanceFromDecember <= distanceFromJanuary ? (distanceFromDecember / 2) + 1 : (distanceFromJanuary / 2) + 1;
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
                                var usageInMonth = usageMultiplier * customerBasePower;
                                if (usageInMonth > maxUsageForAMonthInTheYearForThisCustomer) {
                                    maxUsageForAMonthInTheYearForThisCustomer = usageInMonth;
                                    maxMonthForThisCustomer = i_1;
                                    if (usageInMonth < minMax) {
                                        minMax = usageInMonth;
                                    }
                                    if (usageInMonth > maxMax) {
                                        maxMax = usageInMonth;
                                    }
                                }
                                var searchString = i_1.toString() + "VALUE";
                                var replaceString = usageInMonth.toString();
                                usageString = usageString.replace(searchString, replaceString);
                            }
                            var last4OfPhone = 9999 - Math.floor(Math.random() * 8999);
                            var newSP = new Graphic(servicePointGeometry, null, {
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
                            });
                            this._glSp.add(newSP);
                        }
                        if (newLevel !== MAXLEVEL) {
                            var newMiscPoint = new Graphic(new Point(x2, y2).setSpatialReference(this._mapRef.spatialReference), null, {
                                ID: newLine.id,
                                LEVEL: 1
                            });
                            //this._glMiscPoints.add(newMiscPoint);
                        }
                        g_1.attributes = {
                            ID: newLine.id,
                            LEVEL: newLevel,
                            PARENT: newLine.parent,
                            LINKID: newLine.id
                        };
                        graphicArray.push(g_1);
                        //need to see if an entry in 
                        if (this._dictDownstream[newLine.id] === undefined) {
                            this._dictDownstream[newLine.id] = [];
                        }
                        //this._dictSpTopology.setValue(newLine.id,newLine.parent);
                        this._dictSP[newLine.id] = g_1; //newLine.parent;
                        this._dictDownstream[newLine.parent].push(newLine.id);
                        console.log(newLevel);
                    }
                }
                var totalGraphics = graphicArray.length;
                for (var i = 0; i < totalGraphics; i++) {
                    var graphic = graphicArray[i];
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
        };
        MakeData.prototype.ClearGraphics = function () {
            this._mapRef.infoWindow.resize(300, 390);
            this._traceResults.clear();
        };
        MakeData.prototype.uniqueValueRenderer_sp_JSON = function () {
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
        };
        MakeData.prototype.uniqueValueRendererJSON = function () {
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
        };
        MakeData.prototype.PopupTemplateJson = function () {
            return {
                title: "{FIRSTNAME} {LASTNAME}",
                description: "\n            <div class=\"gisia-container\">\n                <div style=\"display:inline-block;float:left;margin-right:10px;\" class=\"gisia-left-element\">\n            \n                <div id=\"gisia-div-spInfo\">\n                <div>{ADDRESS}<br>{CITY}, {STATE}<br>{PHONE}<br>\n                <p id=\"gisiaTxtMaxUse\"></p>\n                <button id='btnShowData' class='gisia-btnUsage' style=\"  background-color: #008CBA; \n                border: none;\n                color: white;\n                padding: 5px 12px;\n                text-align: center;\n                text-decoration: none;\n                display: inline-block;\n                font-size: 12px;\n                margin: 4px 2px;\n                cursor: pointer;\n                border-radius:10px;\" onclick='\n                var usage = {USAGE};\n                var data = [];\n                for(var i = 0 ; i < 12 ; i++){\n                    data.push(usage.records[i][1].Value);\n                }\n                var canvas = document.getElementById(\"gisia-canBarChart\");\n                if (canvas.getContext) {\n                    var dl = data.length;\n                    var max = -999;\n                    for(var q = 0 ; q < dl; q++){\n                        var curValue = parseFloat(data[q]);\n                        if( curValue > max){\n                            max = curValue;\n                            //alert(\"max set to \" + max);\n                          }\n                      }\n                      document.getElementById(\"gisiaTxtMaxUse\").innerHTML = \"Max Use: \" + Math.round(max);\n                      //alert(\"max = \" + max)  ;\n                      //alert(\"data sub 0 \" + data[0]);\n                      var data2 =[];\n                      for(var i = 0 ; i < dl; i++){\n                        var val = parseFloat(data[i].toString());\n                        var lessThanOne = val/max;\n                        //alert(\"less than 1 \" + lessThanOne);\n                        data2.push(100 * lessThanOne );\n                      }\n                      \n                      data = data2;\n                      //alert(data[6] );\n                      var months = [\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\",\"JUL\",\"AUG\",\"SEP\",\"OCT\",\"NOV\",\"DEC\"];\n                      var colors = [\"#FFFFFF\",\"#AAFFAA\",\"#55FF55\",\"#00FF00\",\"#55FF00\",\"#AAFF00\",\"#FFFF00\",\"#FFE100\",\"#FFC300\",\"#FFA500\",\"#FFC355\",\"#FFE1AA\"];\n                      var ctx = canvas.getContext(\"2d\");\n                      ctx.strokStyle = \"#000000\";\n                      ctx.font = \"10px serif\";\n                      for(var x = 0 ; x < 12; x++){\n                        var xOffset = x*20;\n                        ctx.fillStyle = colors[x];\n                        var yStart = 100 - data[x];\n                        ctx.fillRect(xOffset, yStart, 15, data[x]);\n                        //alert(yStart + \" , \" + data[x]);\n                        ctx.strokeRect(xOffset, yStart, 15, data[x]);\n                        ctx.fillStyle = \"#000000\";\n                        var y = (x % 2 === 0) ? 130 : 120;\n                        ctx.fillText(months[x],xOffset, y);\n                      }\n                      ctx.font = \"20px serif\";\n                      //ctx.fillText(\"MAX: \" + max.toString(), 50,50) ;\n                }\n     \n      '>Usage</button>\n      </div> \n                </div>\n          \n            </div>\n            <div style=\"display:inline-block;float:left\" class=\"gisia-right-element\">\n            <div id=\"gisia-divDynamicImage\"></div>\n        </div>  \n        <div>\n                <canvas style=\"margin-top:15px\" id=\"gisia-canBarChart\" width=\"240\" height=\"150\"></canvas>\n                </div>\n            </div>"
            };
        };
        return MakeData;
    }());
    exports.MakeData = MakeData;
    var Line = /** @class */ (function () {
        function Line(id, parent, geom, level) {
            this.id = id;
            this.parent = parent;
            this.geom = geom;
            this.level = level;
            this._angleRadians = 0;
            this._angleDegrees = 0;
        }
        Object.defineProperty(Line.prototype, "angleDegrees", {
            get: function () {
                if (this._angleDegrees === 0) {
                    this.calculateAngles();
                }
                return this._angleDegrees;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "angleRadians", {
            get: function () {
                if (this._angleRadians === 0) {
                    this.calculateAngles();
                }
                return this._angleRadians;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "fromPoint", {
            get: function () {
                return new Point(this.geom.paths[0][0]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "toPoint", {
            get: function () {
                var latLongPoint = new Point(this.geom.paths[0][1]);
                return latLongPoint;
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.calculateAngles = function () {
            var currentLine = this;
            var logicalLine = currentLine.geom.paths[0];
            var firstPoint = this.fromPoint;
            var secondPoint = this.toPoint;
            var angleRadians = Math.atan2(secondPoint.y - firstPoint.y, secondPoint.x - firstPoint.x);
            this._angleDegrees = angleRadians * (360 / (2 * Math.PI));
            this._angleRadians = angleRadians;
        };
        Object.defineProperty(Line.prototype, "toPointArray", {
            get: function () {
                return [this.toPoint.x, this.toPoint.y];
            },
            enumerable: true,
            configurable: true
        });
        return Line;
    }());
});
//# sourceMappingURL=MakeData.js.map