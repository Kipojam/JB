const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "tempnum",
    alias: ["fakenum", "tempnumber"],
    desc: "Generate temporary numbers for any country",
    category: "tools",
    react: "📱",
    use: ".tempnum us"
},
async (Void, m, { args, reply }) => {
    try {
        const countryCode = args[0]?.toLowerCase() || "us"; // Default to US if no code provided
        
        // Fetch data with error handling
        const response = await axios.get(
            `https://api.vreden.my.id/api/tools/fakenumber/listnumber?id=${countryCode}`,
            { timeout: 5000 }
        );

        const data = response.data;

        // Check if response contains valid data
        if (!data || !Array.isArray(data.result) || data.result.length === 0) {
            return reply(`❌ No numbers found for *${countryCode.toUpperCase()}*.\nTry another country code!`);
        }

        // Extract numbers safely
        const numbers = data.result.slice(0, 15); // Limit to 15 numbers max
        const country = numbers[0]?.country || countryCode.toUpperCase();

        // Format the output
        let numberList = numbers.map((num, i) => `${i + 1}. ${num.number}`).join("\n");

        await reply(
            `╭──「 📱 *TEMP NUMBERS* 」\n` +
            `│\n` +
            `│ 🌍 *Country:* ${country}\n` +
            `│ 🔢 *Available Numbers:*\n` +
            `${numberList}\n` +
            `│\n` +
            `│ 💡 *Usage:* .otpbox <number>\n` +
            `╰──「 Powered by *CASEYRHODES-TECH* 」`
        );

    } catch (err) {
        console.error("API Error:", err);
        reply("⚠ API is currently down or not responding. Try again later!");
    }
});

cmd({
    pattern: "templist",
    alias: ["tempnumberlist", "tempnlist", "listnumbers"],
    desc: "Show list of countries with temp numbers",
    category: "tools",
    react: "🌍",
    filename: __filename,
    use: ".templist"
},
async (conn, m, { reply }) => {
    try {
        const { data } = await axios.get("https://api.vreden.my.id/api/tools/fakenumber/country");

        if (!data || !data.result) return reply("❌ Couldn't fetch country list.");

        const countries = data.result.map((c, i) => `*${i + 1}.* ${c.title} \`(${c.id})\``).join("\n");

        await reply(`🌍 *Total Available Countries:* ${data.result.length}\n\n${countries}`);
    } catch (e) {
        console.error("TEMP LIST ERROR:", e);
        reply("❌ Failed to fetch temporary number country list.");
    }
});

cmd({
    pattern: "otpbox",
    alias: ["otp", "getnum", "tempotp"],
    desc: "Check inbox of a temp number",
    category: "tools",
    react: "📨",
    filename: __filename,
    use: ".otpbox <number>"
},
async (conn, m, { args, reply }) => {
    const number = args[0];
    if (!number) return reply("❌ Please provide a number.\n\nExample: `.otpbox +16600887591`");

    try {
        const response = await axios.get(`https://api.vreden.my.id/api/tools/fakenumber/message?nomor=${encodeURIComponent(number)}`);
        const messages = response.data?.result;

        if (!messages || messages.length === 0) {
            return reply("❌ No messages found for this number.");
        }

        let text = `╭─「 *OTP Inbox* 」\n│ *Number:* ${number}\n│ *Total Messages:* ${messages.length}\n│\n`;

        for (let i = 0; i < Math.min(10, messages.length); i++) {
            const msg = messages[i];
            text += `│ ${i + 1}. *From:* ${msg.from}\n`;
            text += `│     *Time:* ${msg.time_wib}\n`;
            text += `│     *Message:* ${msg.content}\n│\n`;
        }

        text += `╰─ Powered by *CASEYRHODES-TECH*`;

        await reply(text);
    } catch (e) {
        console.error("OTPBOX ERROR:", e);
        reply("❌ Failed to fetch messages. Make sure the number is correct.");
    }
});
