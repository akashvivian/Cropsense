function getRuleBasedCrops({ temperature, humidity, ph, lat, lng }) {
  const crops = new Set();

  // --- South India (lat < 20) ---
  if (lat < 20) {
    if (temperature > 28 && humidity > 70) {
      crops.add('rice'); crops.add('coconut'); crops.add('banana');
    }
    if (temperature > 25 && humidity >= 50 && humidity < 75) {
      crops.add('mango'); crops.add('cotton'); crops.add('pigeonpeas');
    }
    if (temperature > 22 && humidity > 85) {
      crops.add('papaya'); crops.add('coffee');
    }
    if (temperature >= 25 && humidity >= 60 && humidity < 80) {
      crops.add('blackgram'); crops.add('mungbean');
    }
  }

  // --- North India (lat >= 25 && lat < 32) ---
  if (lat >= 25 && lat < 32) {
    if (temperature < 25 && humidity >= 40) {
      crops.add('wheat'); crops.add('chickpea'); crops.add('lentil');
    }
    if (temperature >= 20 && temperature <= 30) {
      crops.add('maize'); crops.add('cotton'); crops.add('sugarcane');
    }
    if (temperature > 28 && humidity > 60) {
      crops.add('rice'); crops.add('pigeonpeas');
    }
    if (humidity < 40) {
      crops.add('chickpea'); crops.add('mothbeans'); crops.add('lentil');
    }
  }

  // --- Rajasthan / Arid (lat >= 24, lng < 76) ---
  if (lat >= 24 && lng < 76) {
    crops.add('mothbeans'); crops.add('chickpea'); crops.add('lentil');
    if (temperature > 25) crops.add('mungbean');
  }

  // --- Northeast India (lat >= 22, lng >= 88) ---
  if (lat >= 22 && lng >= 88) {
    crops.add('rice'); crops.add('jute'); crops.add('banana');
    if (temperature < 25) crops.add('lentil');
  }

  // --- Maharashtra / Central India (lat >= 17, lat < 22) ---
  if (lat >= 17 && lat < 22) {
    crops.add('cotton'); crops.add('soybean'); crops.add('pigeonpeas');
    if (temperature > 25 && humidity > 60) crops.add('rice');
    if (temperature < 25) crops.add('wheat'); crops.add('chickpea');
  }

  // --- Himachal / Uttarakhand / J&K (lat >= 30) ---
  if (lat >= 30) {
    crops.add('apple'); crops.add('wheat');
    if (temperature < 20) crops.add('lentil'); crops.add('chickpea');
    if (temperature >= 15 && temperature < 25) crops.add('maize');
  }

  // --- pH based additions ---
  if (ph < 5.5) {
    crops.add('rice'); crops.add('tea');
  }
  if (ph > 7.5) {
    crops.add('cotton'); crops.add('wheat'); crops.add('chickpea');
  }

  // --- Temperature based universal rules ---
  if (temperature >= 20 && temperature <= 30 && humidity >= 50) {
    crops.add('maize');
  }
  if (temperature > 30 && humidity > 80) {
    crops.add('rice'); crops.add('coconut');
  }
  if (temperature < 20 && humidity >= 55) {
    crops.add('wheat'); crops.add('lentil'); crops.add('chickpea');
  }

  const result = Array.from(crops);
  return result.length > 0 ? result : ['maize', 'chickpea', 'lentil'];
}

module.exports = { getRuleBasedCrops };
