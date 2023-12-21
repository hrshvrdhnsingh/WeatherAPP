const API_KEY = "33ee56d27047a95962f8e3f9fe6d5488";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");

const userContainer= document.querySelector(".card-wrapper");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");

let currentTab = userTab;
currentTab.classList.add("current-tab");
grantAccessContainer.classList.add("active");
getfromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        //console.log(currentTab);
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        
        if(!searchForm.classList.contains("active") && clickedTab!=userTab) {
            //If search form is invisible, make it visisble
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () =>{ switchTab(userTab); });
searchTab.addEventListener("click", () =>{ switchTab(searchTab); });

//Check if latitude and longitude is already available in system.
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //Make Grant Page invisible
    grantAccessContainer.classList.remove("active");
    //Make loader vivible
    loadingScreen.classList.add("active");
    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
} 

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryName = document.querySelector("[data-countryName]");
    const temp = document.querySelector("[data-temp]");
    const high = document.querySelector("[data-high]");
    const low = document.querySelector("[data-low]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weathericon = document.querySelector("[data-weatherIcon]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudy]");
    const feelsLike = document.querySelector("[data-feelsLike]");

    //Fetch Info
    cityName.innerText = weatherInfo?.name; 
    countryName.innerText = weatherInfo?.sys?.country;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    high.innerText = `Maximum: ${weatherInfo?.main?.temp_max} °C`;
    low.innerText = `Minimum: ${weatherInfo?.main?.temp_min} °C`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
    feelsLike.innerText = `Feels like ${weatherInfo?.main?.feels_like} °C`;
}

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //window.alert("Geolocation Not Supported");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    console.log(cityName);
    if(cityName === ""){
        console.log("hello");
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        console.log(data);
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        window.alert("Couldn't get information");
    }
}

 let butt = document.querySelector(".btn");
 butt.addEventListener("click", ()=> {
    if(searchForm.classList.contains("active")){
        searchForm.classList.remove("active")
    }
}); 

