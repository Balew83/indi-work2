function getAI() {
    const region = document.getElementById("regionSelect").value;
    const weather = document.getElementById("weatherSelect").value;
    const cropSelect = document.getElementById("cropSelect");
    const aiText = document.getElementById("aiText");

    if (!region || !weather) {
        aiText.innerText = "Waiting for your selections...";
        aiText.style.color = "#888";
        return;
    }

    // Update Dashboard Weather Details (Air Conditions)
    const weatherDetails = document.getElementById("weatherDetails");
    if (weatherDetails) {
        let humidity = Math.floor(Math.random() * (85 - 45) + 45);
        let wind = Math.floor(Math.random() * (25 - 5) + 5);
        weatherDetails.innerHTML = `<i class="fa-solid fa-droplet"></i> ${humidity}% Hum | <i class="fa-solid fa-wind"></i> ${wind} km/h`;
    }

    // Generate 7-Day Forecast Movement
    updateForecast(weather);

    // Automated Seasonal Crop Recommendation Logic
    let recommendedCrops = [];
    if (weather === "Moderate Rain" || weather === "Heavy Rain") {
        // Meher Season equivalents
        recommendedCrops = ["Maize", "Wheat", "Teff", "Barley", "Beans"];
    } else if (weather === "Sunny") {
        recommendedCrops = ["Potatoes", "Tomatoes", "Onions", "Peppers"];
    } else if (weather === "Drought" || region === "Afar" || region === "Somali") {
        recommendedCrops = ["Sorghum", "Millet", "Chickpeas"];
    } else {
        recommendedCrops = ["Cassava", "Sweet Potatoes", "Sunflower"];
    }

    // If no crop is selected yet, suggest one automatically
    let activeCrop = cropSelect.value;
    let autoSuggestionMsg = "";

    if (!activeCrop) {
        activeCrop = recommendedCrops[0];
        autoSuggestionMsg = `Based on the ${weather} conditions in ${region}, we recommend planting **${recommendedCrops.join(", ")}**. <br><br>`;
    }

    aiText.style.color = "#2e7d32";
    let advice = `📍 <strong>AI Analysis for ${region}:</strong><br>${autoSuggestionMsg}`;
    advice += `<strong>Advice for ${activeCrop}:</strong> `;

    if (weather === "Heavy Rain") {
        advice += "Ensure proper drainage to prevent root rot. In the Highlands (Amhara/Tigray), watch for soil erosion.";
    } else if (weather === "Drought") {
        advice += "Prioritize irrigation. For regions like Somali or Afar, consider drought-resistant varieties or mulching to conserve moisture.";
    } else if (weather === "Sunny") {
        advice += "Ideal for photosynthesis. Monitor soil moisture levels closely, especially for leafy vegetables.";
    } else if (weather === "Moderate Rain") {
        advice += "Perfect timing for fertilizer application. The Meher season conditions are favorable for growth.";
    } else if (weather === "Windy") {
        advice += "Support tall crops like Maize or Sugarcane with stakes if necessary to prevent lodging.";
    }

    if (region === "Afar" || region === "Somali") {
        advice += " Note: High heat levels in this region may require additional shading for young seedlings.";
    } else if (region === "Amhara" || region === "Oromia") {
        advice += " Note: Current elevation suggests checking for specific highland pests.";
    }

    aiText.innerHTML = advice;
}

function updateForecast(currentWeather) {
    const forecastGrid = document.getElementById("forecastGrid");
    const forecastContainer = document.getElementById("forecast");

    if (!forecastGrid || !forecastContainer) return;

    forecastContainer.style.display = "block";
    forecastGrid.innerHTML = "";

    const days = ["Today", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weatherIcons = {
        "Sunny": "fa-sun",
        "Moderate Rain": "fa-cloud-rain",
        "Heavy Rain": "fa-cloud-showers-heavy",
        "Windy": "fa-wind",
        "Drought": "fa-temperature-high"
    };
    const weatherTypes = ["Sunny", "Moderate Rain", "Heavy Rain", "Windy", "Drought"];

    days.forEach((day, index) => {
        let dayWeather = index === 0 ? currentWeather : weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        let icon = weatherIcons[dayWeather] || "fa-cloud";

        forecastGrid.innerHTML += `
            <div class="forecast-day">
                <strong>${day}</strong>
                <i class="fa-solid ${icon}"></i>
                <span>${dayWeather}</span>
            </div>
        `;
    });
}

function saveForecast() {
    const region = document.getElementById("regionSelect").value;
    const weather = document.getElementById("weatherSelect").value;
    const crop = document.getElementById("cropSelect").value || "General Recommendation";
    const forecastGrid = document.getElementById("forecastGrid");

    const days = forecastGrid.querySelectorAll('.forecast-day');
    const forecastData = Array.from(days).map(day => ({
        day: day.querySelector('strong').innerText,
        weather: day.querySelector('span').innerText
    }));

    const plan = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        region,
        weather,
        crop,
        forecast: forecastData
    };

    const savedPlans = JSON.parse(localStorage.getItem("agriPlans") || "[]");
    savedPlans.push(plan);
    localStorage.setItem("agriPlans", JSON.stringify(savedPlans));

    alert(`Success! Your weekly plan for ${region} has been saved to your local storage.`);
}

function speakAdvice() {
    const text = document.getElementById("aiText").innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function addPost() {
    const input = document.getElementById("postInput");
    const imageInput = document.getElementById("imageInput");
    const postsContainer = document.getElementById("posts");

    if (input.value === "" && !imageInput.files[0]) return;

    const post = document.createElement("div");
    post.className = "post";
    post.style.borderLeft = "4px solid #43a047";

    let content = `<p><strong>Farmer:</strong> ${input.value}</p>`;

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            content += `<img src="${e.target.result}" style="max-width: 200px; border-radius: 8px; display: block; margin-top: 10px;">`;
            post.innerHTML = content;

            // Automatic AI Response to Image
            setTimeout(() => {
                triggerCommunityAI("I've analyzed your photo. This looks like a healthy crop, but ensure you check the undersides of leaves for any early signs of pests.");
            }, 1500);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        post.innerHTML = content;
    }

    postsContainer.prepend(post);
    input.value = "";
    imageInput.value = "";
}

function triggerCommunityAI(message) {
    const postsContainer = document.getElementById("posts");
    const aiPost = document.createElement("div");
    aiPost.className = "post";
    aiPost.style.background = "#e8f5e9";
    aiPost.style.borderLeft = "4px solid #2e7d32";
    aiPost.innerHTML = `<p><i class="fa-solid fa-robot"></i> <strong>AgriAI Bot:</strong> ${message}</p>`;
    postsContainer.prepend(aiPost);

    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}

function showCropType() {
    const cropSelect = document.getElementById("cropSelect");
    const cropInfo = document.getElementById("cropInfo");
    const selectedCrop = cropSelect.value;

    const cropData = {
        "Maize": "Cereal/Grain",
        "Rice": "Cereal/Grain",
        "Wheat": "Cereal/Grain",
        "Soybeans": "Legume/Oilseed",
        "Potatoes": "Tuber",
        "Tomatoes": "Vegetable (Fruit)",
        "Onions": "Bulb Vegetable",
        "Garlic": "Bulb Vegetable",
        "Carrots": "Root Vegetable",
        "Cabbage": "Leafy Vegetable",
        "Peppers": "Vegetable",
        "Beans": "Legume",
        "Cassava": "Root/Starch",
        "Sweet Potatoes": "Tuber/Root",
        "Barley": "Cereal",
        "Sorghum": "Cereal",
        "Millet": "Cereal",
        "Cotton": "Fiber Crop",
        "Sunflower": "Oilseed",
        "Sugarcane": "Sugar Crop"
    };

    if (selectedCrop) {
        cropInfo.innerHTML = `Selected: ${selectedCrop} | Type: ${cropData[selectedCrop]}`;
    } else {
        cropInfo.innerHTML = "Please select a crop first!";
    }
}