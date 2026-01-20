const fetch = require('node-fetch');

module.exports = {
  name: 'meteo',
  aliases: ['weather', 'météo'],
  description: 'Météo Abidjan',
  async execute(sock, msg) {
    try {
      const lat = 5.3097;
      const lon = -4.0127;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=\( {lat}&longitude= \){lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Africa%2FAbidjan&forecast_days=3`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('API meteo HS');

      const data = await res.json();
      const current = data.current;

      const codes = {
        0: '☀️ Ciel clair', 1: '🌤️ Clair', 2: '⛅ Nuageux', 3: '☁️ Couvert',
        45: '🌫️ Brouillard', 51: '🌧️ Pluie légère', 61: '🌧️ Pluie', 80: '🌦️ Averses', 95: '⛈️ Orage'
      };
      const weather = codes[current.weather_code] || 'Inconnu';

      let forecast = '\nPrévisions 3 jours :\n';
      data.daily.time.forEach((day, i) => {
        const max = data.daily.temperature_2m_max[i];
        const min = data.daily.temperature_2m_min[i];
        const desc = codes[data.daily.weather_code[i]] || '?';
        forecast += `📅 ${day} : ${desc}  ${min}° → ${max}°\n`;
      });

      const reply = `
🏎️ Météo Abidjan \( {THEME} ( \){current.time})
${weather}
🌡️ ${current.temperature_2m}°C (ressenti ${current.apparent_temperature}°C)
💧 ${current.relative_humidity_2m}%
💨 ${current.wind_speed_10m} km/h
${forecast}
${BOT_NAME} par ${CREATOR}
      `;
      await sock.sendMessage(msg.key.remoteJid, { text: reply });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Erreur météo 😓 Réessaie plus tard ! 🏎️' });
    }
  }
};
