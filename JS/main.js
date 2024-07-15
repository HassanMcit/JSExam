/// <reference types="../@types/jquery"/>

const row = document.getElementById('row');
const dataInfo = document.getElementById('data-product');
const displaySearch = document.getElementById('display-search');
const category = document.getElementById('category-section-data');
const searchWord = document.getElementById('search-by-word');
const searchFirstLetter = document.getElementById('search-by-first-letter');
const searchBtn = document.getElementById('search');
const categoryBtn = document.getElementById('category');
const areaBtn = document.getElementById('area');
const ingredientBtn = document.getElementById('ingredient');
const contactBtn = document.getElementById('contact');
const submitBtn = document.getElementById('submit');

// console.log(searchBtn, categoryBtn, areaBtn, ingredientBtn, contactBtn);
let dataRecived, mainData = undefined;
let currentDisplay;

$(".logo-header").css(`opacity`,`0.3`);

$(function () {
    $('.row').removeClass('d-none');
});

$('.nav-lists').animate({ 'left': -$('.nav-lists').outerWidth() });
$('.logo-header').animate({ 'left': '0px' });



$('.close-icon i').on('click', function (e) {
    if (e.target.classList.contains('fa-align-justify')) {
        openNav();
    } else {
        closeNav();
    }
});

searchWord.addEventListener('blur', function (e) {
    this.value = '';
});

searchFirstLetter.addEventListener('blur', function (e) {
    this.value = '';
});

function openNav() {
    $(".logo-header").css(`opacity`,`1`);
    $(".close-icon i").removeClass("fa-align-justify");
    $(".close-icon i").addClass("fa-x");
    $('.nav-lists').animate({ 'left': '0' });
    $('.logo-header').animate({ 'left': 246 });
    $('.nav-link').animate({ 'top': '0' }, 500);
}

function closeNav() {
    $(".logo-header").css(`opacity`,`0.3`);
    $(".close-icon i").addClass("fa-align-justify");
    $(".close-icon i").removeClass("fa-x");
    $('.nav-lists').animate({ 'left': -$('.nav-lists').outerWidth() });
    $('.logo-header').animate({ 'left': '0px' });
    $('.nav-link').animate({ 'top': '300px' }, 500);
}

async function getDataFromAPI(dataAPI, location) {
    document.getElementById('contact-section').classList.add('d-none');
    let response = await fetch(dataAPI);
    dataRecived = await response.json();
    if (mainData === undefined) mainData = dataRecived;
    $('.loader-screen').addClass('d-none');
    if (location === category) {
        diplayData(dataRecived.categories, location);
    } else {
        console.log(dataRecived.meals);
        diplayData(dataRecived.meals, location);
    }
}

function diplayData(data, location) {
    $('.loader-screen').addClass('d-none');
    document.getElementById('area-section').classList.add('d-none');
    document.getElementById('ingredient-section').classList.add('d-none');
    currentDisplay = location;
    let box = '';
    if (data[0].idMeal === undefined) {
        box = data.map((meal) =>
            `
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="card xxxx w-100 position-relative cursor-pointer bg-black overflow-hidden" onClick="searchCatergory('${meal.strCategory}')">
                            <img src="${meal.strCategoryThumb}" class="w-100 card-img-top" alt="${meal.idCategory}" />
                            <div class="card-body position-absolute text-center w-100 fs-3 cursor-pointer bg-white bg-opacity-75 h-100 top-100 d-flex flex-column align-items-center">
                            ${meal.strCategory}
                            <p class="fs-5 text-center">
                            ${meal.strCategory} ${meal.strCategoryDescription.split(" ").slice(1, 11).join(" ")}</p>
                            </div>
                        </div>
                    </div>
                `
        ).join('');
    } else {
        let x = dataRecived.meals.filter((e, i) => {
            if (e.idMeal == dataRecived.meals[i].idMeal) {
                return dataRecived.meals[i];
            }
        });
        box = x.map((meal) =>
            `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card xxxx w-100 position-relative overflow-hidden" cursor-pointer onClick="displayDataProduct('${meal.idMeal}')">
                    <img src="${meal.strMealThumb}" class="w-100 card-img-top" alt="${meal.strMeal}" />
                    <div class="card-body position-absolute w-100 justify-content-center bg-danger fs-3 bg-white bg-opacity-75 cursor-pointer h-100 top-100 d-flex align-items-center">
                    ${meal.strMeal}
                    </div>
                </div>
            </div>
        `).join('');
    }
    location.innerHTML = box;
}

function searchCatergory(cat) {
    $('.loader-screen').removeClass('d-none');
    row.classList.remove('d-none');
    category.classList.add('d-none');
    $('.loader-screen').removeClass('d-none');
    getDataFromAPI(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`, row)
}

document.addEventListener('click', function (e) {
    if (e.target.hasAttribute("close-x")) {
        closeDisplay();
    }
})

function closeDisplay() {
    console.log(currentDisplay.id);
    if (currentDisplay.id === 'display-search') {
        $('#search-section').removeClass('d-none');
    } else {
        $(currentDisplay).removeClass('d-none');
    }
    dataInfo.classList.add('d-none');
}

async function displayDataProduct(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let x = (await response.json()).meals[0];

    $('.loader-screen').remove('d-none');
    // console.log(data.meals[index])
    row.classList.add('d-none');
    dataInfo.classList.remove('d-none');
    document.getElementById('search-section').classList.add('d-none');
    let recipesBox = '';
    for (let i = 1; i < 20; i++) {
        if (x['strIngredient' + i] !== "") {
            recipesBox +=
                `<p class="rounded-3 bg-info bg-opacity-75 py-2 px-3">${x['strMeasure' + i]} ${x['strIngredient' + i]}</p>`
        }
    }
    let box = '';
    box = `
        <div class="container text-white">
            <div class="row g-4 justify-content-center align-items-md-start position-relative">
            <i class="fa-solid fa-x fa-2x position-absolute mt-5 close-x end-0" close-x></i>
                <div class="col-12 col-md-4 mt-5">
                    <img src="${x.strMealThumb}" class="w-100 mt-5" alt="" />
                </div>
                <div class="col-12 col-md-8 mt-5 pt-5"">
                <h1 class='fs-2'>Instructions</h1>
                <p>${x.strInstructions}</p>
                <div>
                    <p class="h2">Area : ${x.strArea}</p>
                    <p class="h2">Category : ${x['strCategory']}</p>
                    <p class="h2 mb-4">Recipes :</p>
                    <div class='d-flex flex-wrap gap-3' id="recipes">
                        ${recipesBox}
                    </div>
                    <h3 class="mt-3 mb-4">Tage: </h3>

                    <div>
                        <a href="${x.strSource}" target="_blank" class="btn btn-success">Source</a>
                        <a href="${x.strYoutube}" target="_blank" class="btn btn-danger ms-2">YouTube</a>
                    </div>
                </div>
            </div>
        </div>
        </div >`;
    $('.loader-screen').remove('d-none');
    dataInfo.innerHTML = box;
}

$('#search').on('click', function (e) {
    e.preventDefault();
    $('#row').addClass('d-none');
    $('#search-section').removeClass('d-none');
    $('#data-product').addClass('d-none');
    $('#category-section').addClass('d-none');
    $('#category-section-data').addClass('d-none');
    $('#area-section').addClass('d-none');
    $('#ingredient-section').addClass('d-none');
    $('#contact-section').addClass('d-none');
    
    resetInputFields();
    closeNav();
});

$('#search-by-word').on('input', function () {
    $('.loader-screen').removeClass('d-none');
    getDataFromAPI(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.value}`, displaySearch);
});

$('#search-by-first-letter').on('input', function () {
    $('.loader-screen').removeClass('d-none');
    getDataFromAPI(`https://www.themealdb.com/api/json/v1/1/search.php?f=${this.value}`, displaySearch);
});

$(categoryBtn).on('click', function (e) {
    e.preventDefault();
    $('#row').addClass('d-none');
    $('#search-section').addClass('d-none');
    $('#data-product').addClass('d-none');
    $('#area-section').addClass('d-none');
    $('#category-section-data').removeClass('d-none');
    $('#category-section').removeClass('d-none');
    $('#ingredient-section').addClass('d-none');
    $('#contact-section').addClass('d-none');
    closeNav();
    resetInputFields();
    $('.loader-screen').removeClass('d-none');
    displaySearch.innerHTML = '';
    getDataFromAPI(`https://www.themealdb.com/api/json/v1/1/categories.php`, category);
});

$('#area').on('click', function (e) {
    e.preventDefault();
    $('#row').addClass('d-none');
    $('#search-section').addClass('d-none');
    $('#data-product').addClass('d-none');
    $('#category-section-data').addClass('d-none');
    $('#category-section').addClass('d-none');
    $('#area-section').removeClass('d-none');
    $('#ingredient-section').addClass('d-none');
    $('#contact-section').addClass('d-none');
    closeNav();
    resetInputFields();
    $('.loader-screen').removeClass('d-none');
    getAreaFromAPI(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
});


$('#ingredient').on('click', function (e) {
    e.preventDefault();
    $('#row').addClass('d-none');
    $('#search-section').addClass('d-none');
    $('#data-product').addClass('d-none');
    $('#category-section-data').addClass('d-none');
    $('#category-section').addClass('d-none');
    $('#area-section').addClass('d-none');
    $('#ingredient-section').removeClass('d-none');
    $('#contact-section').addClass('d-none');
    closeNav();
    $('.loader-screen').removeClass('d-none');
    resetInputFields();
    getIngredientFromAPI(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
});

async function getIngredientFromAPI(ingredient) {
    let response = await fetch(ingredient);
    let data = await response.json();
    $('.loader-screen').addClass('d-none');
    displayIngredient(data.meals);
}

function searchIngredient(Ingredient) {
    $('.loader-screen').removeClass('d-none');
    row.classList.remove('d-none');
    document.getElementById('ingredient-section').classList.add('d-none');
    $('.loader-screen').removeClass('d-none');
    getDataFromAPI(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`, row)
}

function displayIngredient(data) {
    let box = '';
    data = data.filter(e => e.strDescription !== null).slice(0, 20);
    data.map(e => {
        box += `
            <div class="col-12 col-md-6 col-lg-3 cursor-pointer">
                <div class="card xxxx w-100 position-relative text-center bg-black text-center text-white overflow-hidden" cursor-pointer onClick="searchIngredient('${e.strIngredient}')">
                <p><i class="fa-solid fa-drumstick-bite fa-5x"></i></p>    
                <h2>${e.strIngredient}</h2>
                <p>${e.strDescription.split(" ").splice(0, 15).join(" ")}</p>
                </div>
            </div>`;
    });
    document.getElementById('ingredient-section').innerHTML = box;
}

async function getAreaFromAPI(area) {
    let response = await fetch(area);
    let data = await response.json();
    $('.loader-screen').addClass('d-none');
    displayArea(data.meals);
}

function displayArea(data) {
    let box = '';
    data.map(e => {
        box += `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card xxxx w-100 position-relative text-center bg-black text-center text-white overflow-hidden" cursor-pointer onClick="searchArea('${e.strArea}')">
                <p><i class="fa-solid fa-house-laptop fa-5x"></i></p>    
                <h2>${e.strArea}</h2>
                </div>
            </div>`;
    });
    document.getElementById('area-section').innerHTML = box;
}

function searchArea(area) {
    row.classList.remove('d-none');
    category.classList.add('d-none');
    $('.loader-screen').removeClass('d-none');
    getDataFromAPI(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`, row)
}


getDataFromAPI('https://www.themealdb.com/api/json/v1/1/search.php?s=', row);


$('#contact').on('click', function (e) {
    e.preventDefault();
    $('#row').addClass('d-none');
    $('#search-section').addClass('d-none');
    $('#data-product').addClass('d-none');
    $('#category-section-data').addClass('d-none');
    $('#category-section').addClass('d-none');
    $('#area-section').addClass('d-none');
    $('#ingredient-section').addClass('d-none');
    $('#contact-section').removeClass('d-none');
    closeNav();
    $('.loader-screen').removeClass('d-none');
    resetInputFields();
    getIngredientFromAPI(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
});

document.addEventListener('input', function (e) {
    if (['inputName', 'inputEmail', 'inputPhone', 'inputAge', 'inputPassword'].includes(e.target.id)) {
        e.target.classList.add('is-invalid');
        regexCheck(e.target);
    }
});

document.getElementById('inputRePassword').addEventListener('input', function (e) {
    e.target.classList.add('is-invalid');
    if (document.getElementById('inputPassword').value === e.target.value) {
        e.target.classList.remove('is-invalid');
        e.target.classList.add('is-valid');
        e.target.nextElementSibling.classList.add('d-none');
        if (document.getElementById('inputRePassword').classList.contains('is-valid') &&
            document.getElementById('inputName').classList.contains('is-valid') &&
            document.getElementById('inputEmail').classList.contains('is-valid') &&
            document.getElementById('inputPhone').classList.contains('is-valid') &&
            document.getElementById('inputAge').classList.contains('is-valid') &&
            document.getElementById('inputPassword').classList.contains('is-valid')) {
            submitBtn.removeAttribute('disabled')
        } else {
            submitBtn.setAttribute('disabled', 1);
        }
    } else {
        e.target.classList.add('is-invalid');
        e.target.classList.remove('is-valid');
        e.target.nextElementSibling.classList.remove('d-none');
        submitBtn.setAttribute('disabled', 1);
    }

});

// console.log(submitBtn.removeAttribute('disabled'));

function regexCheck(element) {
    regex = {
        inputName: /^[a-zA-Z ]+$/,
        inputEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        inputPhone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        inputAge: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
        inputPassword: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
    }
    if (regex[element.id].test(element.value)) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
        element.nextElementSibling.classList.add('d-none');
    } else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        element.nextElementSibling.classList.remove('d-none');
    }
}

document.addEventListener('click', function (e) {
    if (['inputName', 'inputEmail', 'inputPhone', 'inputAge', 'inputPassword', 'inputRePassword'].includes(e.target.id)) {
        if (!e.target.hasBlurListener) {
            e.target.addEventListener('blur', function (blurEvent) {
                if (e.target.value === '') {
                    e.target.nextElementSibling.classList.remove('d-none');
                } else {
                    e.target.nextElementSibling.classList.add('d-none');
                }
            });
            e.target.hasBlurListener = true;
        }
    }
})

const inputFieldIds = ['inputName', 'inputEmail', 'inputPhone', 'inputAge', 'inputPassword', 'inputRePassword'];

function resetInputFields() {
    inputFieldIds.forEach(id => {
        const input = document.getElementById(id);
        input.value = '';
        input.classList.remove('is-valid', 'is-invalid');
    });
    submitBtn.setAttribute('disabled', 1);
}