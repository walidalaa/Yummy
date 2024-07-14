let mealsData = document.getElementById("mealsData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

$(function() {
  searchByName("").then(function() {
      $(".loading-screen").fadeOut(500);
      $("body").css("overflow", "auto");
  });
});
//----------------------------------------------------
function openSideNav() {
  $(".side-nav-menu").animate({ left: 0 }, 500);
  $(".open-close-icon").removeClass("fa-aline-justify");
  $(".open-close-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links li").eq(i).animate({top: 0,},(i + 5) * 100);
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
  $(".side-nav-menu").animate({left: -boxWidth,},500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
}

closeSideNav();
$(".side-nav-menu i.open-close-icon").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});
// ----------------------------------
function displayMeals(arr) {
  let meals = "";

  arr.forEach(item => {
    meals += `
      <div class="col-md-3">
        <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${item.strMealThumb}" alt="" srcset="">
          <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${item.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  });

  mealsData.innerHTML = meals;
}
//------------------------------------------------

async function getCategories() {
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn();
  searchContainer.innerHTML = "";

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  response = await response.json();

  displayCategories(response.categories);
  $(".inner-loading-screen").fadeOut();
}
// --------------------------------------
function displayCategories(arr) {
  let Categories = "";

  arr.forEach(category => {
    Categories += `
      <div class="col-md-3">
        <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${category.strCategoryThumb}" alt="" srcset="">
          <div class="meal-layer position-absolute text-center text-black p-2">
            <h3>${category.strCategory}</h3>
            <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
          </div>
        </div>
      </div>
    `;
  });

  mealsData.innerHTML = Categories;
}
// -------------------------------------------------
async function getArea() {
  mealsData.innerHTML = "";
  $("inner-loading-screen").fadeIn();
  searchContainer.innerHTML = "";

  let responce = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  responce = await responce.json();

  displayArea(responce.meals);
  $(".inner-loading-screen").fadeout();
}
// ---------------------------------------------------
function displayArea(arr) {
  let Area = "";

  arr.forEach(area => {
    Area += `
    <div class="col-md-3">
     <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
       <i class="fa-solid fa-house-laptop fa-4x"></i>
       <h3>${area.strArea}</h3>
     </div>
    </div>
   `;
  });

  mealsData.innerHTML = Area;
}
// -----------------------------------------
async function getIngredients() {
  mealsData.innerHTML = "";
  $("inner-loading-screen").fadeIn();
  searchContainer.innerHTML = "";

  let responce = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  responce = await responce.json();

  displayIngredients(responce.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut();
}
// --------------------------------------------------
function displayIngredients(arr) {
  let Ingredients = "";
  arr.forEach(Ingredient => {
    Ingredients += `
     <div class="col-md-3">
        <div onclick="getIngredientsMeals('${Ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${Ingredient.strIngredient}</h3>
          <p>${Ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
     </div>
   `;
  });
  mealsData.innerHTML = Ingredients;
}
// -------------------------------------
async function getCategoryMeals(category) {
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn();

  let responce = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  responce = await responce.json();

  displayMeals(responce.meals.slice(0.2));
  $(".inner-loading-screen").fadeOut();
}
// ---------------------------------------

async function getAreaMeals(area) {
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn();

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut();
}
// -------------------------------------------

async function getIngredientsMeals(ingredients) {
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn();

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut();
}
// ---------------------------------------------
async function getMealDetails(mealID) {
  closeSideNav();
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn();

  searchContainer.innerHTML = "";
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();

  displayMealDetails(respone.meals[0]);
  $(".inner-loading-screen").fadeOut();
}
// ------------------------------------------------------------------------------------
function displayMealDetails(meal) {
  searchContainer.innerHTML = "";

  let ingredients = "";
  Array.from({ length: 20 }, (_, i) => i + 1).forEach(i => {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }
  });

  let tags = meal.strTags ? meal.strTags.split(",") : [];
  
  let tagsStr = "";
  tags.forEach(tag => {
    tagsStr += `<li class="alert alert-danger m-2 p-1">${tag}</li>`;
  });

  let cartoona = `
  <div class="col-md-4">
    <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
    <h2>${meal.strMeal}</h2>
  </div>
  <div class="col-md-8">
    <h2>Instructions</h2>
    <p>${meal.strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsStr}</ul>
    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
  </div>`;

  mealsData.innerHTML = cartoona;
}
// ---------------------------------------
function showSearchInputs() {
  searchContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`;

  mealsData.innerHTML = "";
}
// --------------------------------------------
async function searchByName(term) {
  closeSideNav();
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}
// ---------------------------------------------------
async function searchByFLetter(term) {
  closeSideNav();
  mealsData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  term == "" ? (term = "a") : "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}
// ************************************************
 
    let inputStates = {
      nameInputTouched: false,
      emailInputTouched: false,
      phoneInputTouched: false,
      ageInputTouched: false,
      passwordInputTouched: false,
      repasswordInputTouched: false,
    };

    function showContacts() {
      mealsData.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
          <div class="container w-75 text-center">
            <div class="row g-4">
              ${createInputField('nameInput', 'Enter Your Name', 'Special characters and numbers not allowed')}
              ${createInputField('emailInput', 'Enter Your Email', 'Email not valid *example@yyy.zzz', 'email')}
              ${createInputField('phoneInput', 'Enter Your Phone', 'Enter valid Phone Number')}
              ${createInputField('ageInput', 'Enter Your Age', 'Enter valid age', 'number')}
              ${createInputField('passwordInput', 'Enter Your Password', 'Enter valid password *Minimum eight characters, at least one letter and one number:*', 'password')}
              ${createInputField('repasswordInput', 'Re-enter Your Password', 'Enter valid repassword', 'password')}
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
          </div>
        </div>
      `;
      submitBtn = document.getElementById("submitBtn");

      setupInputListeners(['nameInput', 'emailInput', 'phoneInput', 'ageInput', 'passwordInput', 'repasswordInput']);
    }

    function createInputField(id, placeholder, alertText, type = 'text') {
      return `
        <div class="col-md-6">
          <input id="${id}" onkeyup="inputsValidation()" type="${type}" class="form-control" placeholder="${placeholder}">
          <div id="${id}Alert" class="alert alert-danger w-100 mt-2 d-none">
            ${alertText}
          </div>
        </div>
      `;
    }

    function setupInputListeners(ids) {
      ids.forEach(id => {
        document.getElementById(id).addEventListener("focus", () => {
          inputStates[`${id}Touched`] = true;
        });
      });
    }

    function inputsValidation() {
      for (const key in inputStates) {
        if (inputStates[key]) {
          validateInput(key.replace('Touched', ''));
        }
      }

      if (isFormValid()) {
        submitBtn.removeAttribute("disabled");
      } else {
        submitBtn.setAttribute("disabled", true);
      }
    }

    function validateInput(id) {
      const alertId = `${id}Alert`;
      const validationFunction = `${id}Validation`;

      if (window[validationFunction]()) {
        document.getElementById(alertId).classList.replace("d-block", "d-none");
      } else {
        document.getElementById(alertId).classList.replace("d-none", "d-block");
      }
    }

    function isFormValid() {
      return nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation();
    }

    function nameValidation() {
      return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
    }

    function emailValidation() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        document.getElementById("emailInput").value
      );
    }

    function phoneValidation() {
      return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        document.getElementById("phoneInput").value
      );
    }

    function ageValidation() {
      return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
        document.getElementById("ageInput").value
      );
    }

    function passwordValidation() {
      return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
        document.getElementById("passwordInput").value
      );
    }

    function repasswordValidation() {
      return (
        document.getElementById("repasswordInput").value ===
        document.getElementById("passwordInput").value
      );
    }

    document.addEventListener("DOMContentLoaded", showContacts);
 