const {cmd , commands} = require('../command')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "play1",
    desc: "To download songs.",
    react: "🎵",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try {
    if (!q) return reply("Please give me a url or title");

    const search = await yts(q);
    const data = search.videos[0];
    const url = data.url;

    let desc = `
*⫷⦁JBKENY MUSⵊC DOWNLOADⵊNG⦁⫸*

🎵 *MUSⵊC FOUND!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎧 *ENJOY THE MUSIC BROUGHT TO YOU!*

> *JBKENY WHATSAPP BOT* 
> *© ᴄʀᴇᴀᴛᴇᴅ ʙʏ PKDRILLER* 
`;

    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

    // Use new API
    let apiRes = await fetch(`https://api.giftedtech.web.id/api/download/ytmp3?apikey=gifted&url=${encodeURIComponent(url)}`);
    let json = await apiRes.json();

    if (!json.success) return reply("Failed to fetch audio from new API");

    let downloadUrl = json.result.download_url;

    await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
    await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: json.result.title + ".mp3",
        caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ PKDRILLER*"
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`_Hi ${pushname}, retry later_`);
}
})

//====================video_dl=======================

cmd({
    pattern: "darama",
    alias: ["video"],
    desc: "To download videos.",
    react: "🎥",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try {
    if (!q) return reply("Please give me a url or title");

    const search = await yts(q);
    const data = search.videos[0];
    const url = data.url;

    let desc = `
*⫷⦁JBKENY VⵊDEO DOWNLOADⵊNG⦁⫸*

🎥 *VⵊDEO FOUND!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *ENJOY THE VIDEO BROUGHT TO YOU!*

> *JBKENY WHATSAPP BOT* 
> *© ᴄʀᴇᴀᴛᴇᴅ ʙʏ PKDRILLER*
`;

    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

    // Use new API
    let apiRes = await fetch(`https://api.giftedtech.web.id/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(url)}`);
    let json = await apiRes.json();

    if (!json.success) return reply("Failed to fetch video from new API");

    let downloadUrl = json.result.download_url;

    await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
    await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: json.result.title + ".mp4",
        caption: "*© NEXUS-XMD*"
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`_Hi ${pushname}, retry later_`);
}
})
