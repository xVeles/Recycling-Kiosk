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
    alert("I have been clicked");
});

accountBtn.addEventListener("click", function() {
    loadAccount();
});

rckBtn.addEventListener("click", function() {
    loadRCK();
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