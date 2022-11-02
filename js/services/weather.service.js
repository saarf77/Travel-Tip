export const weatherService = {
  getWeather,
};

function getWeather(lat, lng) {
       //TODO: Enter your API Key

  return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_WEATHER}`)
    .catch((err) => {
      console.log("Error", err);
    })
    .then((res) => {
      const currWeather = {
        icon: res.data.weather[0].icon,
        description: res.data.weather[0].description,
        temp: res.data.main.temp + 'C',
        maxTemp: res.data.main.temp_max + 'C ',
        minTemp: res.data.main.temp_min + 'C ',
        wind: res.data.wind.speed,
      };
      return currWeather;
    })
}
