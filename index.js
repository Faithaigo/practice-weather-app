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
        retrieveWeatherDetails(searchCity.value)
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
            hourData +=`<div class="hourly-details"><span>${hour.dt}</span><br/>
                    <img class="hour-icon" alt=${desc} src=${ic}><br/>
                    <span class="hour-temp">${hour.temp} &#8451;</span></div>`
            }

        );
        hourlyDetails.innerHTML = hourData;

    })
};

const retrieveWeatherDetails = (searchValue) => {
    const value = !searchValue ? 'New York':searchValue;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=252963480e18a0b04bf3178e96bfa484`;
    let cityInfo = "";
    fetch(url).then(response => response.json())
        .then(data =>{
            const city_name = data.name;
            const time = data.dt;
            const day = new Date(time * 1000).toDateString();
            const temperature = data.main.temp;
            const weatherArr = data.weather;
            const weatherDescription = weatherArr[0].description;
            const weatherIcon = weatherArr[0].icon;
            const humidityInfo = data.main.humidity;
            const windInfo = data.wind.speed;
            const pressureInfo = data.main.pressure;
            const lat = data.coord.lat;
            const  lon  = data.coord.lon;
            const image = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            city.innerHTML = city_name;
            cityDate.innerHTML = day;
            cityInfo += `<div>
                     <div class="weather-info">
                        <h4 class="city-text" id="city_temperature">${temperature} &#8451;</h4>
                        <p class="city-text" id="description">${weatherDescription}</p>
                    </div>
                    <img class="weather-icon" alt=${weatherDescription} src=${image}></div>`;
            console.log(data);
            weatherContainer.innerHTML = cityInfo;
            humidity.innerHTML = `${humidityInfo} &#37;`;
            wind.innerHTML = `${windInfo} m/s`;
            pressure.innerHTML = pressureInfo;
            getHourlyForecast(lat, lon)
        })
        .catch(err => console.log(err));
};
retrieveWeatherDetails(searchCity.value);
getSearchResults();


