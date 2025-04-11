function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'f26e1dad4fe7b0bbc3d0209808adfb10'; // Replace with your actual API key
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

            // Icon
            const icon = getWeatherIcon(condition);
            document.getElementById('weather-icon').innerText = icon;

            // Clothing suggestion with emojis
            const suggestion = getClothingSuggestion(temp);
            document.getElementById('suggestion').innerText = suggestion;

            // Google Map location update
            document.getElementById('map').src =
                `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lon}`;
        })
        .catch(() => {
            alert('City not found!');
        });
}

function getWeatherIcon(condition) {
    condition = condition.toLowerCase();
    if (condition.includes("clear")) return "☀️";
    if (condition.includes("cloud")) return "☁️";
    if (condition.includes("rain")) return "🌧️";
    if (condition.includes("snow")) return "❄️";
    if (condition.includes("storm")) return "⛈️";
    return "🌈";
}

function getClothingSuggestion(temp) {
    if (temp > 30) return "It's hot! Wear shorts and stay hydrated 🩳💧";
    if (temp > 20) return "Nice weather! Light clothes recommended 👕🌤️";
    if (temp > 10) return "A bit chilly, wear a jacket 🧥🍂";
    return "Cold weather! Wear warm clothes 🧣🧤🧥";
}

function speakWeather() {
    const location = document.getElementById('location').innerText;
    const temperature = document.getElementById('temperature').innerText;
    const condition = document.getElementById('condition').innerText;
    const suggestion = document.getElementById('suggestion').innerText;

    const message = `Weather report for ${location}. The temperature is ${temperature} degrees Celsius. The condition is ${condition}. Clothing suggestion: ${suggestion}.`;

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}
