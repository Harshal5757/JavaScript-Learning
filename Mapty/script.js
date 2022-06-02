'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout{
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this._calcPace();
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
    }

    _calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
    }
}

class App {
    #map;
    #mapEvent;
    #workouts = [];
    constructor() {
        this._getPostion();
        inputType.addEventListener('change', this._toggleEvelvaitonField.bind(this));
        form.addEventListener('submit', this._newWorkout.bind(this));
    }

    _getPostion(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
            console.log("Error while retrieve geolocation");
        });
    }

    _loadMap(pos){
        const {latitude, longitude} = pos.coords;
        this.#map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
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
        inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = '';
        form.classList.add('hidden');
        this.renderWorkoutMarker(workout);
    }
    renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({maxWidth: 300,
            maxHeight: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`}).setContent('Workout!'))
        .openPopup();
    }
}
const app = new App();