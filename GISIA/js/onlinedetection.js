window.addEventListener('load', function(e) {
    if(navigator.onLine){
        updateOnlineStatus(true);
    }
    else{
        updateOnlineStatus(false);
    }
});

window.addEventListener('online', function(e){
    updateOnlineStatus(true);
    $(".topnav").removeClass("disconnect");
});

window.addEventListener('offline', function(e) {
    updateOnlineStatus(false);
    $(".topnav").addClass("disconnect");
});
function updateOnlineStatus(online){
    var osm = document.getElementById('onlineStatusMessage');
    if(online){
        osm.innerHTML = "<span class='lime'>ONLINE</span>";
    }
    else{
        osm.innerHTML = "<span class='red'>OFFLINE</span>";
    }
}