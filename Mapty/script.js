'use strict';



const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    id = (Date.now()+'').slice(-10);
    clicks = 0;
    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
    click(){
        this.clicks++;
    }
}

class Running extends Workout{
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this._calcPace();
        this._setDescription();
    }

    _calcPace() {
        this.pace = this.duration / this.distance;
    }
}
class Cycling extends Workout{
    type = 'cycling';
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this._calcSpeed();
        this._setDescription();
    }

    _calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
    }
}

class App {
    #map;
    #mapEvent;
    #mapZoomLevel = 13;
    #workouts = [];
    constructor() {
        this._getPostion();
        this._getLocalStorage();
        inputType.addEventListener('change', this._toggleEvelvaitonField.bind(this));
        form.addEventListener('submit', this._newWorkout.bind(this));
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }

    _getPostion(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
            console.log("Error while retrieve geolocation");
        });
    }

    _loadMap(pos){
        const {latitude, longitude} = pos.coords;
        this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this));
        this.#workouts.forEach(work => this._renderWorkoutMarker(work));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _hideForm() {
        inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        form.style.display = 'grid';
    }

    _toggleEvelvaitonField(){
        inputElevation.closest('div').classList.toggle('form__row--hidden');
        inputCadence.closest('div').classList.toggle('form__row--hidden');
    }

    _newWorkout(e){
        e.preventDefault();
        const {lat, lng} = this.#mapEvent.latlng;
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);
        let workout;
        const validInput = (...input) => input.every(inp => Number.isFinite(inp));
        const allPositive = (...input) => input.every(inp => inp > 0);
        if(type === 'running'){
            const cadence = Number(inputCadence.value);
            if(!validInput(distance, duration, cadence)
                || !allPositive(distance, duration)) return;
            workout = new Running([lat, lng], distance, duration, cadence);
        }
        if(type === 'cycling'){
            const elevation = Number(inputElevation.value)
            if(!validInput(distance, duration, elevation)
                || !allPositive(distance, duration)) return;
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        this.#workouts.push(workout);
        this._renderWorkoutMarker(workout);
        this._renderWorkout(workout);
        this._hideForm();
        this._setLocalStorage();
    }
    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({maxWidth: 300,
            maxHeight: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`}).setContent(workout.description))
        .openPopup();
    }
    _renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
        `;
        if(workout.type === 'running') {
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
            </li>
            `
        }
        if(workout.type === 'cycling') {

            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
            </li>
            `
        }
        form.insertAdjacentHTML('afterend', html)
    }
    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        if(!workoutEl) return;
        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
        this.#map.setView(workout.coords, this.#mapZoomLevel, {animate: true, pan: {duration: 1}});
        workout.click();
    }

    _setLocalStorage(){
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage(){
        const data = JSON.parse(localStorage.getItem('workouts'));
        if(!data) return;
        this.#workouts = data;
        this.#workouts.forEach(work => this._renderWorkout(work));
    }
}
const app = new App();