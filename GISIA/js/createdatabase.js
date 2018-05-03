if (!window.indexedDB) {
    window.alert("Your browser doesnn't support indexDB.");
}
var _gisiaDB;
var dbVersion = "1";
var request = window.indexedDB.open("GISIA_DB", dbVersion);

request.onupgradeneeded = function (event) {
    console.log("running onupgradeneeded");
    var gisiaDB = event.target.result;
    if (!gisiaDB.objectStoreNames.contains("bookmarks")) {
        gisiaDB.createObjectStore("bookmarks");
    }
 
};

request.error = function (event) {
    console.log("Error opening database");
};

request.onsuccess = function (event) {
    _gisiaDB = event.target.result;
    //document.querySelector("#saveBookmarkToDB").addEventListener("click", addBookmark);
    
};




function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function addBookmark(event) {
    var transaction = _gisiaDB.transaction(["bookmarks"], "readwrite");
    var store = transaction.objectStore("bookmarks");
    var bookmark = {
        xmin: 120,
        xmax: 120.1,
        ymin: 45,
        ymax: 45.1
    };

    var request = store.add(bookmark, createGuid());
    request.onerror = function (event) {
        console.log("error: ", event.target.error.name);

    };

    request.onsuccess = function (event) {
        console.log("Request completed");
    };


 

}