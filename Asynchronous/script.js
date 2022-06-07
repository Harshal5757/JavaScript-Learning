'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const countryDataOnScreen = function(data, className = '') {
    const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flags.svg}" />
            <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 10000000).toFixed(1)} mn people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
}
///////////////////////////////////////
// const countryDataRender = function(country) {
//     const request = new XMLHttpRequest();
//     request.open('GET', `https://restcountries.com/v2/name/${country}`);
//     request.send();
//     request.addEventListener('load', function () {
//         const [data] = JSON.parse(this.responseText);
//         console.log(data);
//         countryDataOnScreen(data);
//         const request1 = new XMLHttpRequest();
//         request1.open('GET', `https://restcountries.com/v2/alpha/${data.borders[0]}`);
//         request1.send();
//         request1.addEventListener('load', function () {
//             const neighbour = JSON.parse(this.responseText);
//             console.log(neighbour);
//             countryDataOnScreen(neighbour, 'neighbour');
//         });
//     });
// }
const renderErr = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
}
const errorHandler = function(msg) {
    console.error(msg)
}

const getJson = function(url, msg = 'Something went wrong') {
    return fetch(url).then(response => {
        if(!response.ok) throw new Error(`${msg} ${response.status}`);
        return response.json();
    })
}

const countryDataRender = function(country){
    getJson(`https://restcountries.com/v2/name/${country}`, 'Country Not Found')
    .then(data => {
        countryDataOnScreen(data[0])
        const neighbour = data[0].borders?.[0]
        if(!neighbour) throw new Error('Neighbour not found');
        return getJson(`https://restcountries.com/v2/alpha/${data[0].borders[0]}`, 'Neighbour not found');
    })
    .then(data => countryDataOnScreen(data, 'neighbour'))
    .catch(err => errorHandler(`Something went wrong ${err}`))
    .finally(() => countriesContainer.style.opacity = 1);
}

const getLocation = function() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)            
    })
}

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/
const whereIam = function(lat, lng) {
    getJson(`https://geocode.xyz/${lat},${lng}?geoit=json`, `Error while retriveing Reverse goalocation`)
    .then(data => {
        console.log(`You are in ${data.region}, ${data.country}`);
        return getJson(`https://restcountries.com/v2/name/${data.country}`, `Country not Found`)
    })
    .then(data => countryDataRender(data[0].name))
    .catch(err => console.log(`${err.message}`));
}

btn.addEventListener('click', function() {
    // countryDataRender('UK');
    getLocation().then(pos => {
        const {latitude: lat, longitude: lng} = pos.coords
        whereIam(lat, lng);
    }).catch(err => console.error(`Failed to load current Location ${err}`));
});