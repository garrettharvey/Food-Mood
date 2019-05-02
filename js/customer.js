//Initialize Firestore
"<link rel='stylesheet' href='css/style2.css'>";
firestore = firebase.firestore();

const nameField = document.getElementById("userName");
const addressField = document.getElementById("userAddress");
const cityField = document.getElementById("userCity");
const stateField = document.getElementById("userState");
const zipField = document.getElementById("userZip");
const emailField = document.getElementById("userEmail");
const phoneNumberField = document.getElementById("userPhone");
const searchSection = document.getElementById("searchSection");
// const restTags = document.getElementById("restTags");
const itemSummary = document.getElementById("itemSummary");
const subtotal = document.getElementById("subtotal");
const checkout = document.getElementById("checkout");
const cartButton = document.getElementById("cartButton");
const editButton = document.getElementById("editButton");
const searchBar = document.getElementById("searchbar");
const filterRestTab = document.getElementById("filterRest");
const mapTab = document.getElementById("showMap");
const ordersButton = document.getElementById("ordersButton");
const notifyHeader = document.getElementById("notifyHeader");
const filterRestDiv = document.getElementById("filterRestDiv");
const mapDiv = document.getElementById("map");
const cbSection = document.getElementById("checkboxSection");

notifyHeader.style.visibility = "hidden";

var name = "";
var address = "";
var city = "";
var state = "";
var zip = "";
var email = "";
var phoneNumber = "";
var restaurants = [];
var restIDs = [];
var filtersUsed = [];



filterRestTab.addEventListener("click", e => {

  console.log("Filter Restaurants");
  mapDiv.style.display = "none";
  filterRestDiv.style.display = "block";


});//end filterRestTab listener

mapTab.addEventListener("click", e => {

  console.log("Show Map");
  filterRestDiv.style.display = "none";
  mapDiv.style.display = "block";
});//end mapTab listener


// function initMap() {
//   // Map options
//   var options = {
//     zoom: 8,
//     center: { lat: 42.3601, lng: -71.0589 }
//   }

//   // New map
//   var map = new google.maps.Map(document.getElementById('map'), options);

//   // Listen for click on map
//   // google.maps.event.addListener(map, 'click', function (event) {
//   //   // Add marker
//   //   addMarker({ coords: event.latLng });
//   // });

//   /*
//   // Add marker
//   var marker = new google.maps.Marker({
//     position:{lat:42.4668,lng:-70.9495},
//     map:map,
//     icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
//   });

//   var infoWindow = new google.maps.InfoWindow({
//     content:'<h1>Lynn MA</h1>'
//   });

//   marker.addListener('click', function(){
//     infoWindow.open(map, marker);
//   });
//   */

//   // Array of markers
//   var markers = [
//     {
//       coords: { lat: 42.4668, lng: -70.9495 },
//       iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//       content: '<h1>Lynn MA</h1>'
//     },
//     {
//       coords: { lat: 42.8584, lng: -70.9300 },
//       content: '<h1>Amesbury MA</h1>'
//     },
//     {
//       coords: { lat: 42.7762, lng: -71.0773 }
//     }
//   ];

//   // Loop through markers
//   // for (var i = 0; i < markers.length; i++) {
//   //   // Add marker
//   //   addMarker(markers[i]);
//   // }

//   // Add Marker Function
//   function addMarker(props) {
//     var marker = new google.maps.Marker({
//       position: props.coords,
//       map: map,
//       //icon:props.iconImage
//     });

//     // Check for customicon
//     if (props.iconImage) {
//       // Set icon image
//       marker.setIcon(props.iconImage);
//     }

//     // Check content
//     if (props.content) {
//       var infoWindow = new google.maps.InfoWindow({
//         content: props.content
//       });

//       marker.addListener('click', function () {
//         infoWindow.open(map, marker);
//       });
//     }
//   }
// }

////////////////////////////////////////FILTER RESTAURANTS
function renderRestaurants() {
  firestore.collection("Restaurants").get().then(function (documents) {

    documents.forEach(function (doc) {
      var data = doc.data();
      var div = document.createElement("div");
      div.innerHTML = "<h3 style='color:#006400;'>" + data.RestaurantName + "</h3>"
        + "<button id='" + doc.id + "' type=submit class='btn btn-success'>View Restaurant</button>";
      // div.className = 'col-md-3 col-lg-10 mx-left text-center mb-3 card card-body d-inline-block font-weight-bold';
      div.className = 'card card-body fixed space float-left font-weight-bold';
      searchSection.appendChild(div);
      restaurants.push(data); //wow I should have been doing this instead of .get multiple times #imDumb
      restIDs.push(doc.id);
    });

    eventListeners(restIDs);

  });

}//end renderRestaurants

function renderFilters() {
  firestore.doc("Tags/Tags").get().then(function (doc) {

    if (doc && doc.exists) {

      var data = doc.data();
      var filters = data.Tags.split(", ");

      filters.forEach(element => {
        // console.log("rendered filters");
        // restTags.innerHTML += "<option value='" + element + "'>" + element + "</option>";
        // restTags.className = "'mdb-select md-form colorful-select dropdown-primary' multiple searchable='Search here..'";
        cbSection.innerHTML += "<li><input type='checkbox' id='checkbox" + element + "' value='" + element + "'><label for='checkbox" + element + "'>" + element + "</label></li>";
      });
    }
  })
}//end renderFilters
// .replace(/\s+/g, '')
function filterRestaurants(filterHow) {

  if (filtersUsed.includes(filterHow)) {//already using that filter
    //do nothing
  } else {//add new filter
    filtersUsed.push(filterHow);
  }//end if

  console.log(filtersUsed);

  if (filtersUsed.includes("name") && filtersUsed.includes("tags")) {//filter by name and tags
    console.log("filter w both");
    filterByNameAndTags();
  } else if (filtersUsed.includes("tags")) {//filter by tags
    filterByTags();
  } else if (filtersUsed.includes("name")) {//filter by name
    filterByName();
  } else {
    //you done fucked up A A ron
    console.log(filtersUsed);
    console.log(filterHow);
  }//end if filterHow

}//end filterRestaurants


function filterByTags() {
  var filteredRestaurants = [];
  var filteredRestIDs = [];
  for (var i = 0; i < restaurants.length; i++) {
    filteredRestaurants[i] = restaurants[i];
    filteredRestIDs[i] = restIDs[i];
  }//end for i

  console.log(filteredRestaurants);
  var tagsArray = getSelections(cbSection);

  for (var i = 0; i < tagsArray.length; i++) {
    for (var j = 0; j < filteredRestaurants.length; j++) {
      if (filteredRestaurants[j] != null) {
        var thisRestTags = filteredRestaurants[j]['RestaurantTags'];
        if (!thisRestTags.includes(tagsArray[i])) {
          delete filteredRestaurants[j];
          delete filteredRestIDs[j];
        }//end if !includes
      }//end if != null
    }//end for j
  }//end for i

  console.log(filteredRestaurants);

  searchSection.innerHTML = '';

  reRenderRestauraunts(filteredRestaurants, filteredRestIDs);
  eventListeners(filteredRestIDs);
}//end filterByTags

function filterByName() {
  var searchedName = searchBar.value;
  searchedName = searchedName.toUpperCase();

  var filteredRestaurants = [];
  var filteredRestIDs = [];
  for (var i = 0; i < restaurants.length; i++) {
    filteredRestaurants[i] = restaurants[i];
    filteredRestIDs[i] = restIDs[i];
  }//end for i

  for (var j = 0; j < filteredRestaurants.length; j++) {
    if (filteredRestaurants[j] != null) {
      var thisRestName = filteredRestaurants[j]['RestaurantName'].toUpperCase();
      if (!thisRestName.includes(searchedName)) {
        delete filteredRestaurants[j];
        delete filteredRestIDs[j];
      }//end if !includes
    }//end if != null
  }//end for j

  console.log(filteredRestaurants);
  searchSection.innerHTML = '';

  reRenderRestauraunts(filteredRestaurants, filteredRestIDs);
  eventListeners(filteredRestIDs);

}//end filterByName

function filterByNameAndTags() {
  var searchedName = searchBar.value;
  searchedName = searchedName.toUpperCase();

  var filteredRestaurants = [];
  var filteredRestIDs = [];
  for (var i = 0; i < restaurants.length; i++) {
    filteredRestaurants[i] = restaurants[i];
    filteredRestIDs[i] = restIDs[i];
  }//end for i

  console.log(filteredRestaurants);
  var tagsArray = getSelections(cbSection);

  for (var i = 0; i < tagsArray.length; i++) {
    for (var j = 0; j < filteredRestaurants.length; j++) {
      if (filteredRestaurants[j] != null) {
        var thisRestTags = filteredRestaurants[j]['RestaurantTags'];
        var thisRestName = filteredRestaurants[j]['RestaurantName'].toUpperCase();
        if (!thisRestTags.includes(tagsArray[i])) {
          delete filteredRestaurants[j];
          delete filteredRestIDs[j];
        }//end if !includes tag
        if (!thisRestName.includes(searchedName)) {
          delete filteredRestaurants[j];
          delete filteredRestIDs[j];
        }//end if !includes name
      }//end if !=null
    }//end for j
  }//end for i

  console.log(filteredRestaurants);

  searchSection.innerHTML = '';

  reRenderRestauraunts(filteredRestaurants, filteredRestIDs);
  eventListeners(filteredRestIDs);

}//end filterByNameAndTags


function reRenderRestauraunts(filteredRestaurants, filteredRestIDs) {
  filteredRestaurants.forEach(function (element, index) {
    var div = document.createElement("div");
    div.innerHTML = "<h3 style='color:#006400;'>" + element['RestaurantName'] + "</h3>"
      + "<button id='" + filteredRestIDs[index] + "' type=submit class= 'btn btn-success'>View Restaurant</button>";
    // div.className = 'row hidden-md-up col-md-4 mb-3 card card-block float-right font-weight-bold';
    div.className = 'card card-body fixed float-left space font-weight-bold';
    searchSection.appendChild(div);
  });
}//end reRender

function eventListeners(IDs) {

  IDs.forEach(function (elem) {
    var buttonReference = document.getElementById(elem);
    buttonReference.addEventListener("click", e => {
      window.location.replace("restaurant.html?restaurant_id=" + elem);
    });
  });

}//end eventListeners IDs

function getSelections(cbSection) {


  // NodeList.prototype.forEach = Array.prototype.forEach
  var c = cbSection.childNodes;
  var cArray = [];
  // console.log("t1: " + c);
  c.forEach(function (item) {
    var kid = item.firstChild;
    cArray.push(kid);
    // console.log("t2: " + kid);
    // console.log(item);
  });

  var result = [];
  for (var i = 1, cLen = cArray.length; i < cLen; i++) {
    if (cArray[i].checked) {
      result.push(cArray[i].value);
    }//end if checked
  }//endFor
  return result;

  // 
  // var options = select && select.options;
  // var opt;

  // for (var i = 0, iLen = options.length; i < iLen; i++) {
  //   opt = options[i];

  //   if (opt.selected) {
  //     result.push(opt.value || opt.text);
  //   }
  // }
  // return result;



}//end getSelections
////////////////////////////////////////END FILTER RESTAURANTS

////////////////////////////////////////FILTER FOOD



////////////////////////////////////////END FILTER FOOD

////////////////////////////////////////CART MODAL
var total = 0;
var cartCount = 0;
var itemTotal = 0;

editButton.addEventListener("click", e => {
  window.location.replace("editAccount.html");
});//end editButton listener

function fillCart() {
  var listNumber = 0;
  total = 0;

  firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {

    querySnapshot.forEach(function (itemDoc) {
      docData = itemDoc.data();
      // cartCount += docData.Quantity;
      total += docData.TotalCost;
      listNumber += 1;

      // console.log("cartCount: " + cartCount);
      // console.log("total: " + total.toFixed(2));
      // console.log("docquantity: " + docData.Quantity)
      var div = document.createElement('div');
      div.innerHTML = '<br><div id="' + itemDoc.id + 'Div">' +
        '<p>' + listNumber + '. ' +
        docData.FoodName + ' - $' + docData.FoodPrice +
        '<p id="quantity' + itemDoc.id + '">' +
        'Quantity: ' + docData.Quantity + '  ' +
        '</p>' +
        '<span><button id="takeOne' + itemDoc.id + '" type="button" class="btn btn-info">-</button>' + ' ' +
        '<button id="addOne' + itemDoc.id + '" type="button" class="btn btn-info">+</button>' + ' ' +
        '<button id="delete' + itemDoc.id + '" type="button" class="btn btn-danger">Remove</button></span>' +
        '</p>' +
        '</div>';
      itemSummary.appendChild(div);
      handleQuantity(itemDoc.id, docData.FoodPrice, docData.Quantity);
    });//end foreach
    if (cartCount == 0) {
      subtotal.innerText = "Your Cart Is Empty";
    } else {
      subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
    }
  });//end get.then
}//end fillCart

function handleQuantity(docId, price, quantity) {

  var addOne = document.getElementById("addOne" + docId);
  var takeOne = document.getElementById("takeOne" + docId);
  var deleteAll = document.getElementById("delete" + docId);
  var quantityNumber = document.getElementById("quantity" + docId);

  addOne.addEventListener("click", e => {
    console.log("addOne" + docId);
    cartCount++;
    total += price;
    quantity++;
    itemTotal = quantity * price;
    subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
    quantityNumber.innerText = "Quantity: " + quantity + "";
    cartCounter.innerText = cartCount;
    console.log("newindvPrice: " + itemTotal);
    updateCart(docId, itemTotal, quantity)
  });

  takeOne.addEventListener("click", e => {
    console.log("takeOne" + docId);
    cartCount--;
    total -= price;
    quantity--;
    itemTotal = quantity * price;
    if (quantity <= 0) {//not allowed to make quantity negative. DONT LET THEM
      total += price;
      cartCount++;
      quantity++;
      return;
    }//end if
    subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
    quantityNumber.innerText = "Quantity: " + quantity + "";
    cartCounter.innerText = cartCount;
    console.log("newindvPrice: " + itemTotal);
    updateCart(docId, itemTotal, quantity)
  });

  deleteAll.addEventListener("click", e => {
    console.log("deleting:" + docId);
    cartCount -= quantity;
    itemTotal = quantity * price;
    total -= itemTotal;
    if (total <= 0) {//dont allow negative total or weird negative 0 to show up
      total = 0;
    }//end if
    subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
    cartCounter.innerText = cartCount;
    deleteItem(docId);
  });

}//end handleQuantity

function updateCart(foodId, newTotal, newQuantity) {
  firestore.doc("Users/" + email + "/cart/" + foodId).update(
    {
      "Quantity": newQuantity,
      "TotalCost": newTotal
    }).then(function () {
      console.log("Food successfully Updated.");
    }).catch(function (error) {
      console.log("Error writing Food: " + error + ".");
    });
}//end updateFood

function deleteItem(foodId) {
  var itemDiv = document.getElementById(foodId + "Div")
  itemDiv.parentNode.removeChild(itemDiv);
  firestore.doc("Users/" + email + "/cart/" + foodId).delete().then(function () {
    console.log("Food successfully deleted!");

  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}//end deleteItem

function setCartCount() {
  // var cartCount = 0;
  var quantityCount = 0;

  //get cart count and put correct number next to cart button
  firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      docData = doc.data();
      quantityCount += (docData.Quantity);
      cartCount = quantityCount;
    });//end foreach
    if (cartCount == 0) {
      //do nothing
    } else {
      cartCounter.innerText = cartCount;
    }
  });//end get.then
}//end setCartCount

cartButton.addEventListener("click", e => {
  //remove the items in the cart modal and reload them just incase it changed
  while (itemSummary.firstChild) {
    itemSummary.removeChild(itemSummary.firstChild);
  }
  fillCart();
})//end cartButton EventListener

checkout.addEventListener("click", e => {
  window.location.replace("orderCart.html");
})//end checkoutButton listener

////////////////////////////////////////END CART MODAL

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in. Get their email.
    console.log("The currently logged in user is: " + user.email + ".");
    email = user.email;

    //Check to see if this user is a customer. If not, redirect them to their dashboard.
    firestore.doc("/Users/" + email).get().then(function (doc) {

      if (doc.exists) {

        var docData = doc.data();
        var role = docData.UserRole;

        nameField.innerText = docData.UserName;
        addressField.innerText = docData.UserAddress;
        cityField.innerText = docData.UserCity;
        stateField.innerText = docData.UserState;
        zipField.innerText = docData.UserZipCode;
        emailField.innerText = docData.UserEmail;
        phoneNumberField.innerText = docData.UserPhoneNumber;

        //Redirect user to the dashboard for their role.
        if (role === "Customer") return;
        else if (role === "Manager") window.location.replace("manager.html");
        else if (role === "Deliverer") window.location.replace("deliverer.html");
        else console.log("The value of role is not an accepted value: -" + role + ".");

      } else console.log("The users document does not exist.");

    });

    renderRestaurants();

    renderFilters();

    setCartCount();

    fillCart();

  } else {
    // No user is signed in. Redirect them to the homepage.
    console.log("No user is signed in, redirecting...");
    window.location.replace("homepage.html");
  }
});//end auth
