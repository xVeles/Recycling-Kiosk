// Port needs to be the same as the ISS host port
const _port = 8189;
const url = "http://localhost:" + _port + "/";

let platform, maptypes, map, kioskList = [];
//Buttons
let signUpBtn = document.getElementById("signUpButton");
let signUpBck = document.getElementById("backBtn")
let startBtn = document.getElementById("startBtn");
let accountBtn = document.getElementById("accountBtn");
let rckBtn = document.getElementById("rckBtn");
let pwdChngBtn = document.getElementById("pwdChngBtn");
let storeBtn = document.getElementById("storeBtn");
let cartBtn = document.getElementById("cart-tab");
let createAccountBtn = document.getElementById("createAccountBtn");
let loginBtn = document.getElementById("loginButton");
let logOutBtn = document.getElementById("logOutButton");
//area for page
let mainHeader = document.getElementById("mainHeader");
let recycleUnlkBtn = document.getElementById("unlockRecycleBtn");
let upcycleUnlkBtn = document.getElementById("unlockUpcycleBtn");
let donateUnlkBtn = document.getElementById("unlockDonateBtn");

//Pages
let accountContent = document.getElementById("account-tab");
let loading = document.getElementById("loading");

//Shop
let tops = [], pants = [], jackets = [], accessories = [], cart = [];
let topsContent = document.getElementById("tops");
let pantsContent = document.getElementById("pants");
let jacketsContent = document.getElementById("jackets");
let accessoriesContent = document.getElementById("accessories");
let cartContent = document.getElementById("cart");

//Account Page
let accountName = document.getElementById("accountName");
let accountEmail = document.getElementById("accountEmail");
//registry page
let signUpFirstName = document.getElementById("signUpFirstName");
let signUpLastName = document.getElementById("signUpLastName");
let signUpUserName = document.getElementById("signUpUserName");
let registerPass = document.getElementById("registerPass");
let signUpEmail = document.getElementById("signUpEmail");
let statusMsg = document.getElementById("statusMsg");

//login page
let userInputEmail = document.getElementById("userInputEmail");
let userInputPassword = document.getElementById("userInputPass");

//Maps
let recycleCard = document.getElementById("recycleCard");
let upcycleCard = document.getElementById("upcycleCard");
let donateCard = document.getElementById("donateCard");
let recycleNotif = document.getElementById("recycleNotif");
let upcycleNotif = document.getElementById("upcycleNotif");
let donateNotif = document.getElementById("donateNotif");
let recycleIcon = document.getElementById("recycleIcon");
let upcycleIcon = document.getElementById("upcycleIcon");
let donateIcon = document.getElementById("donateIcon");

//user details
let loggedUsername = "";
let loggedFirstName = "";
let loggedLastName = "";
let loggedEmail = "";
let loggedPoints = 0;
let loggedRecycle = 0;
let loggedUpcycle = 0;

init();

function init()
{
    console.log(logOutBtn);
    // Map API Init
    platform = new H.service.Platform({
        'apikey': 'bjkfk3pJqU3BF9q5_wxtcx5M03kpRxaUUsKOlFG18FA'
      });

    maptypes = platform.createDefaultLayers();
    
    //button eventlisteners

    loginBtn.addEventListener("click", () => {
        loginUser();
    });

    logOutBtn.addEventListener("click", () => {
        alert("I have been clicked");
    });

    signUpBtn.addEventListener("click", () => {
        signUpToggle();
    });

    signUpBck.addEventListener("click", () => {
        signUpToggle();
        clearRegistration();
    });
    
    startBtn.addEventListener('click', () => {
        getLocation();
    }); 
    
    accountBtn.addEventListener('click', () => {
        carouselSlideTo(2);
    });
    
    rckBtn.addEventListener('click', () => {
        carouselSlideTo(1);
    });
    
    storeBtn.addEventListener('click', () => {
        carouselSlideTo(0);
    });

    document.getElementById("cart-tab").addEventListener('click', () =>
    {
        refreshCart();
    });

    createAccountBtn.addEventListener("click", () => {
        registerUser();
    })
    document.getElementById("mapModalCloseBtn").addEventListener('click', () =>
    {
        updateRecycleButtons(0);
    });

    document.getElementById("selectRecycleOption").addEventListener('click', () =>
    {
        updateLockerCards();
    });

    recycleUnlkBtn.addEventListener('click', () =>
    {
        updateRecycleButtons(1);
    });

    upcycleUnlkBtn.addEventListener('click', () =>
    {
        updateRecycleButtons(2);
    });

    donateUnlkBtn.addEventListener('click', () =>
    {
        updateRecycleButtons(3);
    });

    getStore();
}

// Carousel Controller
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

//registration stuff
function registerUser() {
    let registerURL = url + "api/users/register";
    let person = {Username : signUpUserName.value, Firstname : signUpFirstName.value, Lastname : signUpLastName.value, Password : registerPass.value, Email : signUpEmail.value, Points : 0, Recylce : 0, Upcycle : 0, Donate : 0};
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          signUpToggle();
          clearRegistration();
        }
        else {
            registerError(this.responseText);
        }
    };
    xhr.open("POST", registerURL,true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(person));
}

//login stuff
function loginUser() {
    let loginURL = url + "api/users/login?Email=" + userInputEmail.value;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", loginURL, true);   
    xhr.setRequestHeader("Authorization", "Basic " + btoa(userInputEmail.value+":"+userInputPassword.value));
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.send(null);
    xhr.onload = function() {
        if (xhr.status != 200) {
          registerError("Incorrect Credentials");
        } else {
            let jsonText = JSON.parse(xhr.responseText);
            loggedEmail = userInputEmail.value;
            accountPopulate(jsonText);
            successfulLogin();
        }
    }
}

// Location stuff
function getLocation() 
{
    if (navigator.geolocation)
    {
        document.getElementById("start-tab").classList.toggle("d-none");
        loading.classList.toggle("d-none");
        navigator.geolocation.getCurrentPosition(showMap);
        
    } else 
    { 
        console.log("Geolocation is not supported by this browser.");
    }
}
  
function showMap(position) 
{
    // Generate Map
    map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
        zoom: 16,
        center: { lng: position.coords.longitude, lat: position.coords.latitude },
        pixelRatio: window.devicePixelRatio || 1
    });
    let ui = H.ui.UI.createDefault(map, maptypes);
    ui.removeControl('mapsettings');
    window.addEventListener('resize', () => map.getViewPort().resize());
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // User Position
    let icon = new H.map.Icon("imgs/my_location-24px.svg");
    let marker = new H.map.Marker({ lat: position.coords.latitude, lng: position.coords.longitude }, { icon: icon });
    map.addObject(marker);

    // Request for Kiosk Locations
    const xmlRequester = new XMLHttpRequest();
    const kioskUrl = url + "api/kiosk/kiosks";
    xmlRequester.open("GET", kioskUrl, true);

    // Load data from request    
    xmlRequester.onload = () =>
    {
        const jsonText = JSON.parse(xmlRequester.responseText);
        if (jsonText.length != 0)
        {
            // Create group of icons 
            let rckIcon = new H.map.Icon("imgs/rck_location-24px.svg");
            let group = new H.map.Group();

            group.addEventListener('tap', (e) =>
            {
                let bubble = new H.ui.InfoBubble(e.target.getGeometry(), 
                {
                    content: e.target.getData()
                });
                ui.addBubble(bubble);
            }, false);

            // Process Kiosks
            for (let i = 0; i < jsonText.length; i++)
            {
                let marker = new H.map.Marker(
                    {lng:jsonText[i].Longitude,lat:jsonText[i].Latitude},
                    { icon:rckIcon });
                marker.setData(
                    "<button type=\"button\" onmousedown=\"mapModalData(" + i + ")\" class=\"map-modal btn btn-sm btn-link bubble-text text-decoration-none\" data-toggle=\"modal\" data-target=\"#mapModal\">" + jsonText[i].Name
                    + "<p class=\"font-weight-light text-tiny address-text\">" + jsonText[i].Address.split(',')[0] + "</p></button>"
                );
                group.addObject(marker);    
                kioskList.push(jsonText[i]);
            }
            console.log(jsonText);
            map.addObject(group);
        }
        loading.classList.toggle("d-none");
        
    }

    xmlRequester.send(null);
}

function mapModalData(index)
{
    let modalTitle = document.getElementById("mapModalLabel");
    modalTitle.innerText = kioskList[index].Name;
}

function updateLockerCards()
{
    console.log("t");
    if (document.getElementById("recycleCheck").checked)
        recycleCard.classList.toggle("class", "card");
    else
        recycleCard.setAttribute("class", "card d-none");

    if (document.getElementById("upcycleCheck").checked)
        upcycleCard.setAttribute("class", "card");
    else
        upcycleCard.setAttribute("class", "card d-none");

    if (document.getElementById("donateCheck").checked)
        donateCard.setAttribute("class", "card");
    else
        donateCard.setAttribute("class", "card d-none");
}

function updateRecycleButtons(mode)
{
    switch (mode)
    {
        case 0:
            recycleUnlkBtn.setAttribute("class", "btn btn-success w-100");
            upcycleUnlkBtn.setAttribute("class", "btn btn-success w-100");
            donateUnlkBtn.setAttribute("class", "btn btn-success w-100");
            recycleNotif.innerText = "";
            upcycleNotif.innerText = "";
            donateNotif.innerText = "";
            recycleIcon.innerText = "lock";
            upcycleIcon.innerText = "lock";
            donateIcon.innerText = "lock";
            document.getElementById("recycleCheck").checked = false;
            document.getElementById("upcycleCheck").checked = false;
            document.getElementById("donateCheck").checked = false;
            $('#collapseOne').collapse('show');
            $('#collapseTwo').collapse('hide');
            

            break;
        case 1:
            recycleUnlkBtn.setAttribute("class", "btn btn-success w-100 disabled");
            recycleNotif.innerText = "Locker will automatically lock when closed";
            recycleIcon.innerText = "lock_open";
            break;
        case 2:
            upcycleUnlkBtn.setAttribute("class", "btn btn-success w-100 disabled");
            upcycleNotif.innerText = "Locker will automatically lock when closed";
            upcycleIcon.innerText = "lock_open";
            break;
        case 3:
            donateUnlkBtn.setAttribute("class", "btn btn-success w-100 disabled");
            donateNotif.innerText = "Locker will automatically lock when closed";
            donateIcon.innerText = "lock_open";
            break;  
    }
}

function getStore()
{
    const xmlRequester = new XMLHttpRequest();
    const shopUrl = url + "api/shop/list";
    xmlRequester.open("GET", shopUrl, true);

    xmlRequester.onload = () =>
    {
        const jsonText = JSON.parse(xmlRequester.responseText);

        if (jsonText.length != 0)
        {
            for (let i = 0; i < jsonText.length; i++)
            {
                switch (jsonText[i].CategoryID)
                {
                    case 1:
                        tops.push(jsonText[i]);
                        break;
                    case 2:
                        pants.push(jsonText[i]);
                        break;
                    case 3:
                        jackets.push(jsonText[i]);
                        break;
                    case 4:
                        accessories.push(jsonText[i]);
                        break;
                }
            }

            displayShopItems(document.getElementById("tops"), tops);
            displayShopItems(document.getElementById("pants"), pants);
            displayShopItems(document.getElementById("jackets"), jackets);
            displayShopItems(document.getElementById("accessories"), accessories);
        }
    };

    xmlRequester.send(null);
}

function displayShopItems(content, items)
{
    let shopContent = "<div class=\"row\">";

    for (let i = 0; i < items.length; i++)
    {

        shopContent += "<div class=\"col-md-4 col-6\"><div class=\"card\"><img src=\"imgs/" + items[i].ShopImg + "\" class=\"card-img-top\" alt=\"" + items[i].Name + "\">"
        + "<div class=\"card-body\"><span class=\"text-tiny text-secondary\">ID #" +items[i].ProductID + "</span><p class=\"card-text\">" + items[i].Name + "</p><p class=\"card-text\"> Size: " + items[i].Size 
        + "</p><button type=\"button\" onmousedown=\"shopModalData(" + items[i].CategoryID +"," + i + ")\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#shopModal\"> View Item </button></div></div></div>";
    }   

    shopContent += "</div>";
    content.innerHTML = shopContent;
}

function selectItem(category, index)
{
    switch (category)
    {
        case 1:
            return tops[index];
        case 2:
            return pants[index];
        case 3:
            return jackets[index];
        case 4:
            return accessories[index];
    }
}

function shopModalData(category, index)
{
    let item = selectItem(category, index);
    
    let title = document.getElementById("shop-item-title");
    title.innerText = item.Name;

    let img = document.getElementById("shop-item-img");
    img.setAttribute("src", "imgs/" + item.ShopImg);

    let name = document.getElementById("shop-item-name");
    name.innerText = item.Name;

    let id = document.getElementById("shop-item-id");
    id.innerText = "ID #" + item.ProductID;

    let stock = document.getElementById("shop-item-stock");
    stock.innerText = "Stock: " + item.Stock;
    
    let quantity = document.getElementById("shop-item-quantity");
    let options = "";

    for (let i = 1; i <= item.Stock; i++)
    {
        options += "<option value=\"" + i + "\">" + i + "</option>";
    }

    quantity.innerHTML = options;
    let cartButton = document.getElementById("add-to-cart");

    if (item.Stock > 0)
    {   
        stock.setAttribute("class", "text-secondary");
        cartButton.setAttribute("class", "btn btn-primary");
        cartButton.setAttribute("data-dismiss", "modal");
        cartButton.innerText = "Add to Cart";
        
        cartButton.setAttribute("onmousedown", "addToCart(" + category + "," + index+ "," + quantity.value + ");");
    }
    else
    {
        stock.setAttribute("class", "text-danger");
        cartButton.setAttribute("class", "btn btn-danger disabled");
        cartButton.removeAttribute("data-dismiss");
        cartButton.innerText = "Out of Stock";

        cartButton.removeAttribute("onmousedown");

        //cartButton.parentNode.replaceChild(cartButton.cloneNode(true), cartButton);
    }

    let desc = document.getElementById("shop-item-desc");
    desc.innerText = item.Description;
}

function addToCart(category, index)
{
    let item = selectItem(category, index);
    let quantity = document.getElementById("shop-item-quantity");

    let alert = document.getElementById("shop-alert");

    for (let i = 0; i < cart.length; i++)
    {
        if (item.ProductID == cart[i].ProductID)
        {
            alert.setAttribute("class", "alert alert-danger text-center");
            alert.innerText = "That item is already in your cart!";
            return;
        }
    }
    

    item.Quantity = Number(quantity.value);

    cart.push(item);    
    alert.setAttribute("class", "alert alert-success text-center");
    alert.innerText = "Added " + quantity.value + " " + item.Name + " " + item.Size + " to your cart";

    refreshCart();
}

function removeFromCart(index)
{
    let newCart = [];

    let alert = document.getElementById("shop-alert");
    alert.setAttribute("class", "alert alert-danger text-center");
    alert.innerText = "Removed " + cart[index].Name + " from your cart";

    for (let i = 0; i < cart.length; i++)
    {
        if (index != i) newCart.push(cart[i]);
    }

    cart = newCart;

    refreshCart();
}

function refreshCart()
{
    cartItems = "<div class=\"row row-cols-4\">";

    for (let i = 0; i < cart.length; i++)
    {
        if (i % 4 == 0 && i != 0)
        {
            cartItems += "</div><div class=\"row row-cols-4 shop-row\">";
        }

        cartItems += "<div class=\"col\"><div class=\"card\"><img src=\"imgs/" + cart[i].ShopImg + "\" class=\"card-img-top\" alt=\"" + cart[i].Name + "\">"
        + "<div class=\"card-body\"><span class=\"text-tiny text-secondary\">ID #" + cart[i].ProductID + "</span><p class=\"card-text\">" + cart[i].Name + "</p><p class=\"card-text\"> Size: " + cart[i].Size + "</p>"
        + "<p><label>Quantity: " + cart[i].Quantity + "</p><button type=\"button\" onmousedown=\"removeFromCart(" + i + ")\" class=\"btn btn-danger\"> Remove Item </button></div></div></div>";
    }

    if (cart.length == 0) cartItems = "You're cart is empty! Add some stuff to it!";

    cartItems += "</div>";
    document.getElementById("cart").innerHTML = cartItems;
}

function successfulLogin() {
    logToggle();
}

function logToggle() {
    let mainApp = document.getElementById("mainApp");
    let logInScreen = document.getElementById("logInScreen");
    let footNav = document.getElementById("footNav");
    mainApp.classList.toggle("d-none");
    logInScreen.classList.toggle("d-none");
    footNav.classList.toggle("d-none");
}

function accountPopulate(jsonText) {
    loggedUsername = jsonText.Username;
    loggedFirstname = jsonText.Firstname;
    loggedLastName = jsonText.Lastname;
    loggedPoints = jsonText.Points;
    loggedUpcycle = jsonText.Upcycle;
    loggedRecycle = jsonText.Recylce;
    accountPageUpdate();
}

function accountPageUpdate() {
    accountName.innerHTML = `${loggedFirstname} ${loggedLastName}`;
    accountEmail.innerHTML = `${loggedEmail}`;
}


function signUpToggle() {;
    let loginPage = document.getElementById("logIn");
    let signUpPage = document.getElementById("signUp");
    loginPage.classList.toggle("d-none");
    signUpPage.classList.toggle("d-none");
    if(loginPage.classList.contains("d-none")) {
        statusMsg.innerHTML = "Create Account to Log In";
        statusMsg.classList.remove("text-danger");
    }
    else {
        statusMsg.classList.add("text-dark")
        statusMsg.innerHTML = "Log In to complete your order";
    }
}

function registerError(message) {
    statusMsg.innerHTML= message;
    statusMsg.classList.add("text-danger");
}

function clearRegistration() {
signUpFirstName.value = "";
signUpLastName.value = "";
signUpUserName.value = "";
registerPass.value = "";
signUpEmail.value = "";
}
    
//let rckIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 170.191 150.518"><defs>
//<style>.cls-1 {fill: #4495ec;}.cls-2 {fill: #fff;font-size: 35px;font-family: SegoeUI-Bold, Segoe UI;font-weight: 700;}</style></defs><g id="White_text" data-name="White text" transform="translate(-970.611 313.157)"><path id="Path_784" data-name="Path 784" class="cls-1" d="M81.877,24.065c-16.9-.57-21.543-22.8-21.543-22.8s-8.834-2.85-14.25,0S3.618,30.053,3.618,30.053s-6.841,1.71-1.71,10.259S17.014,62.541,17.014,62.541s4.845,4.847,11.97,0,9.12-7.694,9.12-7.694v81.8s-2.565,5.129,4.845,5.416,80.942,0,80.942,0,4.275,1.422,4.275-5.416v-81.8l9.975,7.694s5.415,2.282,8.55-1.993S162.65,38.6,162.65,38.6s1.424-5.7-1.711-8.55S128.237,6.109,123.89,2.976s-10.6-2.328-15.675-1.709S98.78,24.635,81.877,24.065Z" transform="matrix(0.999, -0.052, 0.052, 0.999, 970.611, -304.628)"/><text id="RCK" class="cls-2" transform="translate(1023.805 -210.24) rotate(-3)"><tspan x="0" y="0">RCK</tspan></text></g></svg>'
//let currentPosIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>'
