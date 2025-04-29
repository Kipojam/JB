const { cmd } = require('../command');
const config = require("../config");
const warnings = {};


// Anti-Bad Words System
cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply,
  sender
}) => {
  try {
    const badWords = ["wtf", "mia", "xxx", "fuck", 'sex', "huththa", "pakaya", 'ponnaya', "hutto"];

    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));

    if (containsBadWord && config.ANTI_BAD_WORD === 'true') {
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
      await conn.sendMessage(from, { 'text': "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" }, { 'quoted': m });
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});

// Anti-Link System
const linkPatterns = [
  /https?:\/\/\S+/gi // Yeh kisi bhi "http" ya "https" se start hone wale link ko pakdega
];

cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    // Ensure global warnings object exists
    if (!global.warnings) global.warnings = {};

    // Check if it's a group and bot has admin rights
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // Link detection
    const linkPatterns = [/https?:\/\/\S+/]; // Ensure this is properly defined
    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK === 'true') {
      console.log(`Link detected from ${sender}: ${body}`);

      // Immediately try to delete the message
      try {
        await conn.sendMessage(from, { delete: m.key });
        console.log(`Message deleted: ${m.key.id}`);
      } catch (deleteError) {
        console.error("Failed to delete message:", deleteError);
      }

      // Increment warning count
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      const warningCount = global.warnings[sender];

      if (warningCount < 4) {
        await conn.sendMessage(from, {
          text: `⚠️ Warning ${warningCount}/4 @${sender.split('@')[0]}! Links are not allowed in this group.\nAfter 4 warnings, you will be removed. 🚫`,
          mentions: [sender]
        });
      } else {
        await conn.sendMessage(from, {
          text: `🚫 @${sender.split('@')[0]} has been removed for sending links repeatedly after 4 warnings.`,
          mentions: [sender]
        });

        await conn.groupParticipantsUpdate(from, [sender], "remove");

        // Reset warnings after removal
        delete global.warnings[sender];
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ An error occurred while processing the message.");
  }
});
