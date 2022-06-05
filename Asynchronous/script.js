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
    countriesContainer.style.opacity = 1;
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
    console.log(msg)
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
        return getJson(`https://restcountries.com/v2/alpha/${data[0].borders[0]}`, 'Neighbour not found');
    })
    .then(data => countryDataOnScreen(data, 'neighbour'))
    .catch(err => errorHandler(`Something went wrong ${err}`))
    .finally(() => countriesContainer.style.opacity = 1);
}
btn.addEventListener('click', function() {
    countryDataRender('UK');
})
