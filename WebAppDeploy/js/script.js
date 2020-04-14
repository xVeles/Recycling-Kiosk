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
let mainContent = document.getElementById("mainContent");

//Tabs
let accountContent = document.getElementById("account-tab");
let startContent = document.getElementById("start-tab");
let mapTab = document.getElementById("map-tab");
let loading = document.getElementById("loading");

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
        // Store Tab
        case 0:
            storeBtn.setAttribute("class", "nav-link text-primary");
            break;
        // Maps Tab
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
        navigator.geolocation.getCurrentPosition(showPosition);
        
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
  }
  
function showPosition(position) 
{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
        zoom: 16,
        center: { lng: longitude, lat: latitude }
    });
    loading.setAttribute("class", "hidden");
}
