// Recherche simple de pistes
if (texte.startsWith('!spsearch ')) {
  const recherche = texte.slice(10).trim();
  if (!recherche) return await sock.sendMessage(jid, { text: '🏎️ Donne-moi le nom de la track ou l’artiste boss !' });

  await sock.sendMessage(jid, { text: '👑 Maserati-Bot sur Spotify… Recherche en cours 🎧💨' });

  const resultat = await maseratiSearch(recherche, 5);

  if (!resultat.succes) {
    return await sock.sendMessage(jid, { text: `❌ ${resultat.message}` });
  }

  let msg = `🏎️ *Résultats Spotify pour "${recherche}"* 👑\n\n`;
  resultat.pistes.forEach((p, i) => {
    msg += `\( {i+1}. * \){p.name}* – ${p.artists?.join(', ') || '—'}\n` +
           `   Lien : ${p.link}\n\n`;
  });

  msg += `Maserati-Bot • yankee Hells 🙂 ✨🇨🇮`;

  await sock.sendMessage(jid, { text: msg });
}

// Téléchargement direct par lien Spotify
if (texte.startsWith('!spdl ')) {
  const lien = texte.slice(6).trim();
  if (!lien) return await sock.sendMessage(jid, { text: '🏎️ Colle le lien Spotify boss ! Ex: https://open.spotify.com/track/...' });

  await sock.sendMessage(jid, { text: '👑 Maserati-Bot en mode turbo… Téléchargement Spotify en cours 🎵💨' });

  const resultat = await maseratiDownload(lien);

  if (!resultat.succes) {
    return await sock.sendMessage(jid, { text: `❌ ${resultat.message}` });
  }

  await sock.sendMessage(jid, { 
    audio: resultat.buffer,
    mimetype: 'audio/mpeg',
    fileName: resultat.nomFichier,
    caption: `🎧 *${resultat.titre}* – ${resultat.artistes.join(', ')}\n` +
             `Téléchargé avec Maserati-Bot • yankee Hells 🙂 🏎️👑✨🇨🇮`
  });
}

// Combo : recherche + auto-download du premier résultat
if (texte.startsWith('!spotify ') || texte.startsWith('!sp ')) {
  const recherche = texte.slice(9).trim(); // ou slice(4) pour !sp
  if (!recherche) return await sock.sendMessage(jid, { text: '🏎️ Envoie-moi le nom de la musique boss ! Ex: !spotify burna boy' });

  await sock.sendMessage(jid, { text: '👑 Maserati-Bot accélère… Recherche + téléchargement Spotify 💨🎤' });

  const resultat = await maseratiSearchDownload(recherche);

  if (!resultat.succes) {
    return await sock.sendMessage(jid, { text: `❌ ${resultat.message}` });
  }

  await sock.sendMessage(jid, { 
    audio: resultat.buffer,
    mimetype: 'audio/mpeg',
    fileName: resultat.nomFichier,
    caption: `🎵 *${resultat.titre}* – ${resultat.artistes.join(', ')}\n` +
             `Téléchargé avec Maserati-Bot • yankee Hells 🙂 🏎️👑✨🇨🇮`
  });
    }
