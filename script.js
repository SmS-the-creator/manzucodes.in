const form = document.getElementById("weatherForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value;

  const apiKey = "YOUR_API_KEY"; // Replace with your real OpenWeatherMap API key
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.length === 0) {
      resultDiv.innerHTML = "❌ City not found!";
      return;
    }

    const { lat, lon, name } = geoData[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].description;

    let clothing = "";
    if (temp < 10)
      clothing = "🧥 It's cold! Wear a heavy jacket and warm clothes.";
    else if (temp < 20)
      clothing = "🧢 It's cool! You might need a light jacket.";
    else if (temp < 30)
      clothing = "👕 Nice weather! A T-shirt and jeans should be fine.";
    else
      clothing = "🌡️ It's hot! Wear shorts and stay hydrated.";

    const mapEmbed = `
      <div class="map-container">
        <iframe 
          width="100%" height="250" frameborder="0" style="border:0"
          src="https://www.google.com/maps?q=${lat},${lon}&hl=es;z=14&output=embed" 
          allowfullscreen>
        </iframe>
      </div>`;

    resultDiv.innerHTML = `
      <h2>${name}</h2>
      <p><strong>Temperature:</strong> ${temp}°C</p>
      <p><strong>Condition:</strong> ${condition}</p>
      <p><strong>Clothing Suggestion:</strong> ${clothing}</p>
      <h3>📍 Location Map</h3>
      ${mapEmbed}
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "⚠️ Error fetching weather data.";
  }
});
