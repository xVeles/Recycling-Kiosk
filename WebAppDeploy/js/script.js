// Port needs to be the same as the ISS host port
let _port = 8989;

let platform, maptypes, map;
//Buttons
let startBtn = document.getElementById("startBtn");
let accountBtn = document.getElementById("accountBtn");
let rckBtn = document.getElementById("rckBtn");
let pwdChngBtn = document.getElementById("pwdChngBtn");
let storeBtn = document.getElementById("storeBtn");

//area for page
let mainHeader = document.getElementById("mainHeader");

//Tabs
let accountContent = document.getElementById("account-tab");
let startContent = document.getElementById("start-tab");
let mapTab = document.getElementById("map-tab");
let loading = document.getElementById("loading");
let kioskList = document.getElementById("kiosk-list");

init();

function init()
{
    platform = new H.service.Platform({
        'apikey': 'bjkfk3pJqU3BF9q5_wxtcx5M03kpRxaUUsKOlFG18FA'
      });

      // Obtain the default map types from the platform object
    maptypes = platform.createDefaultLayers();
      
      //button eventlisteners
    startBtn.addEventListener("click", function() {
        getLocation();
    });
    
    accountBtn.addEventListener("click", function() {
        carouselSlideTo(2);
    });
    
    rckBtn.addEventListener("click", function() {
        carouselSlideTo(1);
    });
    
    storeBtn.addEventListener("click", function() {
        carouselSlideTo(0);
    })
}

function carouselSlideTo(slide)
{
    $('.carousel').carousel(slide);
    storeBtn.setAttribute("class", "nav-link text-secondary");
    rckBtn.setAttribute("class", "nav-link text-secondary");
    accountBtn.setAttribute("class", "nav-link text-secondary");

    switch (slide)
    {
        case 0:
            storeBtn.setAttribute("class", "nav-link text-primary");
            break;
        case 1:
            rckBtn.setAttribute("class", "nav-link text-primary");
            break;
        case 2:
            accountBtn.setAttribute("class", "nav-link text-primary");
            break;
    }
}

// Location stuff
function getLocation() 
{
    if (navigator.geolocation) {
        startContent.setAttribute("class", "row h-100 hidden");
        loading.setAttribute("class", "show");
        navigator.geolocation.getCurrentPosition(showMap);
        
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}
  
function showMap(position) 
{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
        zoom: 16,
        center: { lng: longitude, lat: latitude },
        pixelRatio: window.devicePixelRatio || 1
    });
    
    window.addEventListener('resize', () => map.getViewPort().resize());
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    let icon = new H.map.Icon(currentPosIcon);
    let marker = new H.map.Marker({ lat: latitude, lng: longitude }, { icon: icon });
    map.addObject(marker);

    let rck = new H.map.Icon(rckIcon);
    rckMarker = new H.map.Marker({ lat: -36.873214, lng: 174.615223 }, { icon:rck });
    map.addObject(rckMarker);

    rckMarker2 = new H.map.Marker({ lat: -36.873081, lng: 174.620244 }, { icon:rck });
    map.addObject(rckMarker2);

    loading.setAttribute("class", "hidden");
    //kioskList.setAttribute("class", "list-group");

    // TODO: Fetch from Web API
    // Foreach add list group
    // Event adding
}

let rckIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 170.191 150.518"><defs>\
<style>.cls-1 {fill: #4495ec;}.cls-2 {fill: #fff;font-size: 35px;font-family: SegoeUI-Bold, Segoe UI;font-weight: 700;}</style></defs><g id="White_text" data-name="White text" transform="translate(-970.611 313.157)"><path id="Path_784" data-name="Path 784" class="cls-1" d="M81.877,24.065c-16.9-.57-21.543-22.8-21.543-22.8s-8.834-2.85-14.25,0S3.618,30.053,3.618,30.053s-6.841,1.71-1.71,10.259S17.014,62.541,17.014,62.541s4.845,4.847,11.97,0,9.12-7.694,9.12-7.694v81.8s-2.565,5.129,4.845,5.416,80.942,0,80.942,0,4.275,1.422,4.275-5.416v-81.8l9.975,7.694s5.415,2.282,8.55-1.993S162.65,38.6,162.65,38.6s1.424-5.7-1.711-8.55S128.237,6.109,123.89,2.976s-10.6-2.328-15.675-1.709S98.78,24.635,81.877,24.065Z" transform="matrix(0.999, -0.052, 0.052, 0.999, 970.611, -304.628)"/><text id="RCK" class="cls-2" transform="translate(1023.805 -210.24) rotate(-3)"><tspan x="0" y="0">RCK</tspan></text></g></svg>'
let currentPosIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>'