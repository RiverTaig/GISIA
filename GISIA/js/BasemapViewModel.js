define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasemapViewModel = /** @class */ (function () {
        function BasemapViewModel(model) {
            console.log("base map view model constructor!!");
            this._model = model;
            //this.initializeView();
        }
        BasemapViewModel.prototype.GetTPK = function () {
            require(["js/offlinetpk2"], function (otpk) {
                var s = otpk.getTPK("http://localhost/GISIA/resources/tpk/waterton1_16.zip");
                console.log("offline = " + s);
                // otpk.getValue();
                //  otpk.increment();
                //  otpk.getValue();
                //  otpk.decrement();
                //  console.log(otpk.getValue());
            });
        };
        BasemapViewModel.prototype.initializeView = function (view, jqRef) {
            this.GetTPK();
            var optionStrings;
            //let x : HTMLOptionElement  = new HTMLOptionElement("value","innerText", true,true);
            // x.value = "value";
            // x.innerText = "innerText"
            //for (let map of this._model.GetBasemaps("cb")) {
            //    optionStrings += "<option value='" + map + "'>" + map + "</option>";
            //}
            var select = document.getElementById("baseMapViewSelect");
            var optElement = document.createElement("option");
            optElement.text = "text";
            optElement.value = "VALUE";
            optElement.selected = true;
            select.add(optElement, null);
            //select.appendChild(x);
        };
        return BasemapViewModel;
    }());
    exports.BasemapViewModel = BasemapViewModel;
});
//# sourceMappingURL=BasemapViewModel.js.map