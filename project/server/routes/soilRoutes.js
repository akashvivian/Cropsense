const express = require('express');
const axios = require('axios');
const router = express.Router();

function getIndianSoilFallback(lat, lng) {
  // North India (Indo-Gangetic Plain) - alluvial soil
  if (lat > 24 && lat < 32 && lng > 74 && lng < 88) {
    return { N: 80, P: 40, K: 60, pH: 7.2 };
  }
  // South India (Deccan Plateau) - red/laterite soil
  if (lat > 10 && lat < 20 && lng > 74 && lng < 82) {
    return { N: 45, P: 25, K: 50, pH: 6.2 };
  }
  // Western India (Rajasthan/Gujarat) - arid/sandy soil
  if (lat > 20 && lng < 74) {
    return { N: 30, P: 15, K: 40, pH: 7.8 };
  }
  // Northeast India - acidic/forest soil
  if (lat > 22 && lng > 88) {
    return { N: 60, P: 35, K: 55, pH: 5.8 };
  }
  // Tamil Nadu / Kerala (coastal south)
  if (lat < 12 && lng > 76) {
    return { N: 50, P: 30, K: 70, pH: 6.5 };
  }
  // Central India (MP, Maharashtra)
  if (lat > 18 && lat < 24 && lng > 74 && lng < 82) {
    return { N: 55, P: 28, K: 48, pH: 6.8 };
  }
  // Default
  return { N: 50, P: 30, K: 50, pH: 6.5 };
}

const offsets = [[0, 0], [0.01, 0], [-0.01, 0], [0, 0.01], [0, -0.01]];

router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'Latitude and longitude are required' });

    let totals = { nitrogen: 0, soc: 0, phh2o: 0 };
    let successCount = 0;

    const promises = offsets.map(async ([dLat, dLng]) => {
      const qLat = parseFloat(lat) + dLat;
      const qLng = parseFloat(lng) + dLng;
      const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${qLng}&lat=${qLat}&property=nitrogen&property=phh2o&property=soc&depth=0-5cm&value=mean`;
      try {
        const response = await axios.get(url, { timeout: 8000 });
        const layers = response.data.properties.layers;
        if (layers && layers.length > 0) {
          let pt = { nitrogen: 0, soc: 0, phh2o: 0 };
          layers.forEach(layer => {
            const val = layer.depths[0]?.values?.mean;
            if (val) {
              if (layer.name === 'nitrogen') pt.nitrogen = val;
              if (layer.name === 'soc') pt.soc = val;
              if (layer.name === 'phh2o') pt.phh2o = val;
            }
          });
          totals.nitrogen += pt.nitrogen;
          totals.soc += pt.soc;
          totals.phh2o += pt.phh2o;
          successCount++;
        }
      } catch (err) {}
    });

    await Promise.all(promises);

    if (successCount === 0 || totals.nitrogen === 0) {
      const fallback = getIndianSoilFallback(parseFloat(lat), parseFloat(lng));
      return res.json({ N: fallback.N, P: fallback.P, K: fallback.K, ph: fallback.pH });
    }

    const isricNitrogen = totals.nitrogen / successCount;
    const isricCarbon = totals.soc / successCount;
    const isricPH = totals.phh2o / successCount;

    const N = (isricNitrogen / 100) * 50;
    const P = 30 + (isricCarbon / 10) * 2;
    const K = 40 + (isricNitrogen / 100) * 30;
    const pH = isricPH / 10;

    res.json({
      N: Math.round(N * 10) / 10,
      P: Math.round(P * 10) / 10,
      K: Math.round(K * 10) / 10,
      ph: Number(pH.toFixed(1))
    });
  } catch (error) {
    const fallback = getIndianSoilFallback(parseFloat(lat), parseFloat(lng));
    res.json({ N: fallback.N, P: fallback.P, K: fallback.K, ph: fallback.pH });
  }
});

module.exports = router;
