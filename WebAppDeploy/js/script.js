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



//button eventlisteners
startBtn.addEventListener("click", function() {
    getLocation();
});

accountBtn.addEventListener("click", function() {
    $('.carousel').carousel(2);
    storeBtn.setAttribute("class", "nav-link text-secondary");
    rckBtn.setAttribute("class", "nav-link text-secondary");
    accountBtn.setAttribute("class", "nav-link text-primary");
});

rckBtn.addEventListener("click", function() {
    $('.carousel').carousel(1);
    storeBtn.setAttribute("class", "nav-link text-secondary");
    rckBtn.setAttribute("class", "nav-link text-primary");
    accountBtn.setAttribute("class", "nav-link text-secondary");
});

storeBtn.addEventListener("click", function() {
    $('.carousel').carousel(0);
    storeBtn.setAttribute("class", "nav-link text-primary");
    rckBtn.setAttribute("class", "nav-link text-secondary");
    accountBtn.setAttribute("class", "nav-link text-secondary");
})

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
   console.log("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude);
  }