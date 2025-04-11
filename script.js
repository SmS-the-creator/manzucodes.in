const apiKey = "f26e1dad4fe7b0bbc3d0209808adfb10"; // Replace with your real key

document.getElementById('weatherForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const city = document.getElementById('city').value.trim();
  getWeather(city);
});

document.getElementById("micButton").addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const spokenCity = event.results[0][0].transcript;
    document.getElementById("city").value = spokenCity;
    getWeather(spokenCity);
  };

  recognition.onerror = function (event) {
    alert("Speech error: " + event.error);
  };
});

function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        document.getElementById("weatherBox").innerHTML = `<p style="color:red">City not found.</p>`;
        speak("City not found. Please try again.");
        return;
      }

      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const icon = data.weather[0].icon;
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      let clothing = "";
      if (temp < 10) clothing = "Wear a heavy jacket and warm clothes.";
      else if (temp < 20) clothing = "You might need a light jacket.";
      else if (temp < 30) clothing = "T-shirt and jeans should be fine.";
      else clothing = "It's hot! Wear shorts and stay hydrated.";

      document.getElementById("weatherBox").innerHTML = `
        <h2>${city}</h2>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Condition:</strong> ${desc}</p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
        <p><strong>Clothing Suggestion:</strong> ${clothing}</p>
        <div class="map">
          <h3>📍 Location Map</h3>
          <iframe src="https://www.google.com/maps?q=${lat},${lon}&z=13&output=embed" allowfullscreen></iframe>
        </div>
      `;

      const speechText = `The temperature in ${city} is ${temp} degrees Celsius with ${desc}. ${clothing}`;
      speak(speechText);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("weatherBox").innerHTML = `<p style="color:red">Error fetching data.</p>`;
      speak("Something went wrong while fetching weather data.");
    });
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  synth.speak(utter);
}
