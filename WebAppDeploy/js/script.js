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
let recycleUnlkBtn = document.getElementById("unlockRecycleBtn");
let upcycleUnlkBtn = document.getElementById("unlockUpcycleBtn");
let donateUnlkBtn = document.getElementById("unlockDonateBtn");

//Pages
let accountContent = document.getElementById("account-tab");
let loading = document.getElementById("loading");

//Shop
let tops = [], pants = [], jackets = [], accessories = [], cart = [];

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

init();

function init()
{
    // Map API Init
    platform = new H.service.Platform({
        'apikey': 'bjkfk3pJqU3BF9q5_wxtcx5M03kpRxaUUsKOlFG18FA'
      });

    maptypes = platform.createDefaultLayers();
    
    //button eventlisteners
    signUpBtn.addEventListener("click", () => {
        signUpToggle();
    });

    signUpBck.addEventListener("click", () => {
        signUpToggle();
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
    let shopContent = "<div class=\"row row-cols-4\">";

    for (let i = 0; i < items.length; i++)
    {
        if (i % 4 == 0 && i != 0)
        {
            shopContent += "</div><div class=\"row row-cols-4 shop-row\">";
        }

        shopContent += "<div class=\"col\"><div class=\"card\"><img src=\"imgs/" + items[i].ShopImg + "\" class=\"card-img-top\" alt=\"" + items[i].Name + "\">"
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

function signUpToggle() {
    let loginPage = document.getElementById("logIn");
    let signUpPage = document.getElementById("signUp");
    let statusMsg = document.getElementById("statusMsg");
    loginPage.classList.toggle("d-none");
    signUpPage.classList.toggle("d-none");
    if(loginPage.classList.contains("d-none")) {
        statusMsg.innerHTML = "Create an account to continue";
    }
    else {
        statusMsg.innerHTML = "Log In to complete your order";
    }
}