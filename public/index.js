const city = document.getElementById('city_name');
const cityDate = document.getElementById('city_date');
const submitCity = document.getElementById('submit_city');
const searchCity = document.getElementById('search_city');
const weatherContainer = document.getElementById('city_weather');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const hourlyDetails = document.getElementById('hourly-forecast');

const getSearchResults = () =>{
    submitCity.addEventListener('submit',(event)=>{
        event.preventDefault();
        localStorage.setItem('value',JSON.stringify(searchCity.value));
        retrieveWeatherDetails()
    })
};

const getHourlyForecast = (lat,lon) =>{
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=252963480e18a0b04bf3178e96bfa484`;
    let hourData = "";
    fetch(url).then(res=>res.json()).then(result=>{
        const hoursArr = result.hourly;
        hoursArr.forEach((hour)=>{
            const hourIcon = hour.weather[0].icon;
            const ic = `https://openweathermap.org/img/wn/${hourIcon}@2x.png`;
            const desc = hour.weather[0].description;
            const time = new Date(hour.dt *1000).toLocaleTimeString([], {hour: '2-digit'});
            hourData +=`<div class="hourly-details"><span>${time}</span><br/>
                    <img class="hour-icon" alt=${desc} src=${ic}><br/>
                    <span class="hour-temp">${hour.temp} &#8451;</span></div>`;
            }

        );
        const fResult = !result ? {} : result;
        const fCurrent = !fResult.current ? {} : fResult.current;
        humidity.innerHTML = `${!fCurrent.humidity ? "" :fCurrent.humidity} &#37;`;
        wind.innerHTML = `${!fCurrent.wind_speed ? "" : fCurrent.wind_speed} m/s`;
        pressure.innerHTML = !fCurrent.uvi ? "" :fCurrent.uvi;
        hourlyDetails.innerHTML = hourData;
    }).catch(error=>{
    })
};

const retrieveWeatherDetails = () => {
    let searchValue = JSON.parse(localStorage.getItem('value'));
    const value = !searchValue ? 'Kampala':searchValue;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=252963480e18a0b04bf3178e96bfa484`;
    let cityInfo = "";
    fetch(url).then(response => response.json())
        .then(data =>{
            const day = new Date(data.dt * 1000).toDateString();
            const weatherArr = data.weather;
            const image = `https://openweathermap.org/img/wn/${weatherArr[0].icon}@2x.png`;
            city.innerHTML = data.name;
            cityDate.innerHTML = day;
            cityInfo += `<div>
                     <div class="weather-info">
                        <h4 class="city-text" id="city_temperature">${data.main.temp} &#8451;</h4>
                        <p class="city-text" id="description">${weatherArr[0].description}</p>
                    </div>
                    <img class="weather-icon" alt=${weatherArr[0].description} src=${image}></div>`;
            weatherContainer.innerHTML = cityInfo;
            getHourlyForecast(data.coord.lat, data.coord.lon);
        }).catch(err =>{});

};
retrieveWeatherDetails();
getSearchResults();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}


