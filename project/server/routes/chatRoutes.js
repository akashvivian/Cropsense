const express = require('express');
const router = express.Router();

const rules = [
  {
    keywords: ['water', 'rice', 'irrigation rice'],
    reply: `Rice needs 1200–2000mm of water per season. During the growing phase, maintain 5–10cm standing water in the field. Reduce water 2 weeks before harvest. In Tamil Nadu, transplanted rice needs watering every 2–3 days during dry spells.`
  },
  {
    keywords: ['nitrogen deficiency', 'nitrogen', 'yellow leaves', 'pale leaves'],
    reply: `Nitrogen deficiency shows as yellowing of older/lower leaves starting from the tip, stunted growth, and pale green color overall. Apply urea (46-0-0) at 50kg/acre or DAP (18-46-0) at 25kg/acre. Split into 2 doses — at planting and 30 days after.`
  },
  {
    keywords: ['fertilizer', 'tomato', 'tomatoes'],
    reply: `For tomatoes, use NPK 19-19-19 at transplanting (25kg/acre). At flowering, switch to NPK 12-32-16 (20kg/acre). After fruit set, apply potassium-rich fertilizer like SOP (0-0-50) at 15kg/acre. Also add calcium nitrate (10kg/acre) to prevent blossom end rot.`
  },
  {
    keywords: ['crops', 'grow', 'best', 'region', 'here', 'which crop'],
    reply: `In Tamil Nadu / South India: Kharif (June–Oct) — Rice, Maize, Groundnut, Cotton. Rabi (Nov–Feb) — Wheat, Sorghum, Sunflower. Summer (Mar–May) — Vegetables like Brinjal, Tomato, Okra. Black cotton soil is best for cotton; red loamy soil suits groundnut and millets.`
  },
  {
    keywords: ['pest', 'insect', 'disease', 'fungus', 'blight', 'wilt'],
    reply: `For fungal diseases (blight, wilt), spray Mancozeb 75WP at 2.5g/litre or Carbendazim 50WP at 1g/litre. For sucking pests (aphids, whitefly), use Imidacloprid 17.8SL at 0.5ml/litre. For stem borers in rice, apply Chlorpyrifos 20EC at 2.5ml/litre.`
  },
  {
    keywords: ['soil', 'ph', 'preparation', 'improve'],
    reply: `For acidic soil (pH < 6), apply agricultural lime at 200–400kg/acre. For alkaline soil (pH > 7.5), add gypsum at 200kg/acre. Add FYM (Farm Yard Manure) at 5 tonnes/acre before planting to improve organic matter and water retention.`
  },
  {
    keywords: ['wheat', 'water wheat', 'irrigate wheat'],
    reply: `Wheat needs 450–650mm of water. Give 6 irrigations: at crown root (21 days), tillering (45 days), jointing (65 days), flowering (85 days), milk stage (105 days), and dough stage (120 days). Each irrigation should be 5–6cm deep.`
  },
  {
    keywords: ['maize', 'corn'],
    reply: `Maize needs 500–800mm of water. Apply NPK 120:60:40 kg/ha. Sow at 60×20cm spacing. Critical water stages are knee-high, tasseling, and grain fill. Watch for Fall Armyworm — spray Emamectin Benzoate 5SG at 0.4g/litre if found.`
  },
  {
    keywords: ['groundnut', 'peanut'],
    reply: `Groundnut needs well-drained sandy loam soil. Apply gypsum at 200kg/acre at pegging stage for good pod development. Water requirement is 500–700mm. Use Thiram seed treatment (3g/kg seed) to prevent seed rot. Harvest when 70% of pods turn dark inside.`
  },
  {
    keywords: ['organic', 'organic farming', 'compost', 'vermicompost'],
    reply: `For organic farming: use vermicompost at 2 tonnes/acre, neem cake at 100kg/acre, and Trichoderma viride at 2.5kg/acre mixed with FYM. For pest control, spray neem oil (5ml/litre) + garlic extract. Jeevamrutha (cow dung + urine ferment) applied weekly boosts soil microbes.`
  }
];

function getReply(message) {
  const msg = message.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some(k => msg.includes(k))) {
      return rule.reply;
    }
  }
  return `I can help with crops, fertilizers, irrigation, pest control, and soil management. Try asking: "How much water does rice need?", "Signs of nitrogen deficiency?", "Best fertilizer for tomatoes?", or "What crops grow best here?"`;
}

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Try Groq first if key is available, fallback to rules
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'paste_your_groq_key_here') {
    try {
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama3-8b-8192',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are CropSense AI, a farming assistant for Indian farmers. Give SPECIFIC, DIRECT answers in 3-4 sentences. Include specific quantities (kg/acre, ml/litre). Focus on Tamil Nadu / South India when region is relevant.`
          },
          { role: 'user', content: message }
        ]
      });
      return res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
      console.error('Groq failed, using fallback:', err.message);
    }
  }

  res.json({ reply: getReply(message) });
});

module.exports = router;
