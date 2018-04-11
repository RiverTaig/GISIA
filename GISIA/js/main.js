
// Grab elements, create settings, etc.
//var video = document.getElementById('video');
//test
// Get access to the camera!
//if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// Not adding `{ audio: true }` since we only want video now
//    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//       video.src = window.URL.createObjectURL(stream);
//      video.play();
// });
//}
function ViewEvent(view, event)
{
    __MVVM_Views[view][event]();

}

function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }



function btnSavePicture_Click() {
    console.log("btnSavePicture_Click 1 ");
    getImageDatabase(function (db) {
        console.log("btnSavePicture_Click 2");
        saveBlob(db);
    });


}

function getImageDatabase(onSuccessFunction) {
    console.log("getImageDatabase");
    var indexedDB = window.indexedDB || window.webkitIndexDB || window.mozIndexedDB;
    var idbTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    var dbVersion = 1;
    var db;
    var request = indexedDB.open("gisiaImages", dbVersion);
    var createObjectStore = function (database) {
        console.log("Creating GISIA Images object store");
        database.createObjectStore("pictures");
    };

    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
    request.onerror = function (event) {
        console.log("Error creating / accessing IndexedDB database");
    };

    request.onsuccess = function (event) {
        console.log("Success creating  accessing IndexedDB database");
        db = request.result;
        db.onerror = function (event) {
            console.log("Error creating / accessing objectstore");
        };
        onSuccessFunction(db);
    };
}

function saveBlob(db) {
    console.log("saveBlob 1");

    var canvas = document.getElementById("canvas");
    //Get data from canvas
    var img_b64 = canvas.toDataURL('image/png');
    //Create blob from DataURL
    var blob = dataURItoBlob(img_b64);
    //img = document.createElement("img");
    //img.src = URL.createObjectURL(blob);



    var transaction = db.transaction(["pictures"], "readwrite");
    var put = transaction.objectStore("pictures").put(blob, createGuid());
    console.log("saveBlob 2");
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function btnMedia_Click() {

    document.getElementById("divPictureArea").style.display = "inherit";
}
function btnDisplayImage_Click() {
    console.log("btnDisplayImage_Click 1 ");
    getImageDatabase(function (db) {
        console.log("btnDisplayImage_Click 2");
        var transaction = db.transaction(["pictures"], "readonly");
        var objectStore = transaction.objectStore("pictures");
        //debugger;
        var getFirstImageKeyRequest = objectStore.getAllKeys();
        getFirstImageKeyRequest.onsuccess = function (res) {
            var firstImageKey = res.target.result[0]; // First file in db
            var objectStoreRequest = objectStore.get(firstImageKey);
            objectStoreRequest.onsuccess = function (event) {
                var imgFile = objectStoreRequest.result;
                var imgURL = window.URL.createObjectURL(imgFile);
                var imgPicture = document.getElementById("thumb");
                imgPicture.setAttribute("src", imgURL);
            };
        };

    });


}

function btnSnapPhoto_Click() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');

    context.drawImage(video, 0, 0, 640, 480);

}
var opt = {
    autoOpen: false,
    modal: true,
    show: {
        effect: 'fade',
        duration: 800
    }
};

$('.thumb').on("click", function (event) {
    console.log("thumb clicked");
    $('#largeImage').attr('src', this.src);
    $('#large-image-modal').dialog(opt).dialog('open');
});


function displayMenu() {
    var topNav = document.getElementById("myTopnav");
    var dropDown = $("#gisia-menu");

    if (dropDown.css("display") !== "none") {
        topNav.className += " responsive";
    } else {
        topNav.className = "topnav";
    }
}

var __MVVM_Views = {};// ["viewName" : view instance with DOM events which has a ref to the view model which has a ref to the model which can notify functions on viewModel when data changes]


$(document).ready(function () {
    var navigateTo = function (whereTo) {
        //alert("Navigating to: " + whereTo);
        //debugger;
        $("#" + whereTo).load("html/" + whereTo + ".html", function (response, status, xhr) {


            var model = null;
            var view = null;
            var viewModel = null;
            var modelInstance = null;
            var viewModelInstance = null;
            var viewInstance = null;
            switch (whereTo) {
                case "Basemap":
                    //Model
                    require(["js/Basemap/BasemapModel","js/Basemap/BasemapViewModel","js/Basemap/BasemapView"], function (bmm,bmvm,bmv) {
                        modelInstance= new bmm.BasemapModel();
                        viewInstance= new bmv.BasemapView();
                        viewModelInstance= new bmvm.BasemapViewModel(modelInstance, viewInstance, $);
                        __MVVM_Views.BasemapView = viewInstance;
                    } );

      

                    break;
                case "Data":
                    //var esriTest = new BasemapViewModel();
                    require(["js/Data/DataModel","js/Data/DataViewModel","js/Data/DataView"], function (m,dvm,dv) {
                        modelInstance= new m.DataModel();
                        viewInstance= new dv.DataView();
                        viewModelInstance= new dvm.DataViewModel(modelInstance, viewInstance, $);
                        __MVVM_Views.DataView = viewInstance;
                    } );                    
                    break;
            }


        });
    }
    navigateTo("Map");



    $("#myTopnav a").click(function () {
        var contentClass = "";
        try {
            $('#divMainContent > div').addClass("hideContent");
            if ($(this)[0].attributes["content"] !== undefined) {
                contentClass = $(this)[0].attributes["content"].value;
                var contentClassSelector = "#" + $(this)[0].attributes["content"].value;
                $(contentClassSelector).removeClass("hideContent");
                var userSelection = $(this).text();
                console.log("NAVIGATING TO " + userSelection);
                if (userSelection === "Map") {
                    return;
                }
                else {
                    navigateTo(userSelection);

                }
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            if ($(this).hasClass("icon") == false) {
                $('div > a.active').removeClass("active");
                $(this).addClass("active");
                //if responsive, then hide anchor tags
                //if ($(this).parent().style.display !== "none"){

                if ($(this).parent().hasClass("responsive")) {
                    $("#activeAnchor").text(contentClass);
                    $(this).parent().removeClass("responsive");
                }
            }
            else {
                $("#activeAnchor").text("");
            }
 
        }


    });
});   