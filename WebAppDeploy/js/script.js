//Buttons
let startBtn = document.getElementById("startBtn");
let accountBtn = document.getElementById("accountBtn");
let rckBtn = document.getElementById("rckBtn");
let pwdChngBtn = document.getElementById("pwdChngBtn");

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
});

rckBtn.addEventListener("click", function() {
    $('.carousel').carousel(1);
});

function loadAccount() 
{
    disableAllTabs();
    accountContent.setAttribute("class", "container h-100 active");
}

function loadRCK() {
    disableAllTabs();
    startContent.setAttribute("class", "row h-100 active");
}

function disableAllTabs()
{
    startContent.setAttribute("class", "row h-100 hidden");
    accountContent.setAttribute("class", "container h-100 hidden");
}

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