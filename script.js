function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = 'your_openweather_api_key'; // Replace with your OpenWeather key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const temp = data.main.temp.toFixed(2);
      const condition = data.weather[0].description;
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      document.getElementById('location').innerText = city;
      document.getElementById('temperature').innerText = temp;
      document.getElementById('condition').innerText = condition;

      document.getElementById('weather-icon').innerText = getWeatherIcon(condition);
      document.getElementById('suggestion').innerText = getClothingSuggestion(temp);

      // Auto speak weather details
      speakWeather(city, temp, condition);

      // Show location map (no API key needed)
      const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=13&output=embed`;
      document.getElementById('map').src = mapUrl;
    })
    .catch(() => {
      alert("City not found!");
    });
}

function getWeatherIcon(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("clear")) return "☀️";
  if (condition.includes("storm")) return "⛈️";
  return "🌤️";
}

function getClothingSuggestion(temp) {
  if (temp > 30) return "It's hot! Wear shorts and stay hydrated 🩳🥤";
  if (temp > 20) return "Nice weather! Light clothes recommended 👕🌤️";
  if (temp > 10) return "It's cool! Wear a jacket 🧥🍂";
  return "It's cold! Bundle up warmly 🧣🧤";
}

function speakWeather(city, temp, condition) {
  const speech = new SpeechSynthesisUtterance(
    `The weather in ${city} is ${temp} degrees Celsius with ${condition}.`
  );
  window.speechSynthesis.speak(speech);
}
