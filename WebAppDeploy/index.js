//Buttons
let startBtn = document.getElementById("startBtn");
let accountBtn = document.getElementById("accountBtn");
let rckBtn = document.getElementById("rckBtn");

//area for page
let mainHeader = document.getElementById("mainHeader");
let mainContent = document.getElementById("mainContent");

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

function loadAccount() {
    mainContent.innerHTML = "\
    <div class='container h-100'>\
        <div id='account' class='mt-3'>\
            <span class='text-dark'>My Account:</span><br>\
            <span id='accountName' class='text-muted'>James Robertson</span><br>\
        </div>\
        <div class='card mt-3'>\
            <div class='card-body shadow'>\
                <div class='row'>\
                        <div class='col-10'>\
                            <span class='text-dark'>Email</span><br>\
                            <span id='emailOfUser' class='text-muted'>james.robertson@email.com</span><br>\
                        </div>\
                        <div class='col-2'>\
                            <span class='material-icons'>mail_outline </span>\
                        </div>\
                </div>\
            </div>\
        </div>\
        <div class='card mt-3 shadow'>\
            <div class='card-body'>\
                <span class='text-dark'>Password</span><br>\
                <button id='startBtn' type='button' class='btn btn-success w-100'>Change Password</button><br>\
            </div>\
        </div>\
        <div class='card mt-3 shadow'>\
            <div class='card-body'>\
                <div class='row'>\
                    <div class='col-10'>\
                        <span class='text-dark'>Discount Codes</span><br>\
                        <span id='discountCode' class='text-muted'>AENK24KN</span><br>\
                    </div>\
                    <div class='col-2'>\
                    <span class='material-icons'> monetization_on </span>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class='card mt-3 shadow'>\
            <div class='card-body'>\
                <div class='row'>\
                    <div class='col-10'>\
                        <span class='text-dark'>Favourite Dropoff</span><br>\
                        <span>RCK - <span id='dropOffLocation' class='text-muted'>AENK24KN</span></span><br>\
                    </div>\
                    <div class='col-2'>\
                    <span class='material-icons'>location_on</span>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>\
    ";
}

function loadRCK() {
    mainContent.innerHTML = "\
    <div class='row h-100'>\
        <div class='col-md-12 my-auto text-center'>\
            <p>Press start to begin</p>\
            <button id='startBtn' type='button' class='btn btn-success shadow'>Start</button>\
        </div>\
    </div>\
    ";
}