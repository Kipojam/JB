const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme","f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
const msr = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

if (!isCreator && !isDev && !isOwner && !isMe) return reply(msr.own_cmd)
if (!q) return reply("*Please write the Group Link*️ 🖇️")
 let result = args[0].split('https://chat.whatsapp.com/')[1]
 await conn.groupAcceptInvite(result)
     await conn.sendMessage(from , { text: `✔️ *Successfully Joined*`}, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
} )

// invite link

cmd({
    pattern: "invite",
    react: "🖇️",
    alias: ["grouplink","glink"],
    desc: "To Get the Group Invite link",
    category: "group",
    use: '.invite',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
const msr = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

if (!isGroup) return reply(msr.only_gp)
if (!isAdmins) { if (!isDev) return reply(msr.you_adm),{quoted:mek }} 
if (!isBotAdmins) return reply(msr.give_adm)
const code = await conn.groupInviteCode(from)

 await conn.sendMessage(from , { text: `🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/${code}`}, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
} )

// rest link

cmd({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink","resetglink","revokelink","f_revoke"],
    desc: "To Reset the group link",
    category: "group",
    use: '.revoke',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
const msr = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

if (!isGroup) return reply(msr.only_gp)
if (!isAdmins) { if (!isDev) return reply(msr.you_adm),{quoted:mek }} 
if (!isBotAdmins) return reply(msr.give_adm)
await conn.groupRevokeInvite(from)
 await conn.sendMessage(from , { text: `*Group link Reseted* ⛔`}, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
} )

//kick

cmd({
    pattern: "kick",
    react: "🥏",
    alias: ["remove"],
    desc: "To Remove a participant from Group and delete their message",
    category: "group",
    use: '.kick',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply}) => {
try {
    const msr = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

    if (!isGroup) return reply(msr.only_gp)
    if (!isAdmins) { if (!isDev) return reply(msr.you_adm, {quoted: mek}) } 
    if (!isBotAdmins) return reply(msr.give_adm)
  
    let users = mek.mentionedJid && mek.mentionedJid.length 
        ? mek.mentionedJid[0] 
        : mek.msg?.contextInfo?.participant || false;

    if (!users) return reply("*Couldn't find any user in context* ❌");

    // Remove the user from the group
    await conn.groupParticipantsUpdate(from, [users], "remove");

    // Delete the user's message
    if (mek.msg?.contextInfo?.stanzaId) {
        await conn.sendMessage(from, {
            delete: {
                remoteJid: from,
                fromMe: false,
                id: mek.msg.contextInfo.stanzaId,
                participant: users
            }
        });
    }

    // Confirm removal
    await conn.sendMessage(from, { text: `*Successfully removed* ✔️` }, { quoted: mek });

} catch (e) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    console.log(e);
    reply(`❌ *An error occurred!!*\n\n${e}`);
}
});

// hidetag

cmd({
    pattern: "hidetag",
    react: "🔊",
    desc: "To Tag all Members for Message",
    category: "group",
    use: '.tag Hi',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag , args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
const msr = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

if (!isGroup) return reply(msr.only_gp)
if (!isAdmins) { if (!isDev) return reply(msr.you_adm),{quoted:mek }} 
if (!isBotAdmins) return reply(msr.give_adm)
	
		if(!q) return reply('*Please add a Message* ℹ️')
		let teks = `${q}`
                conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek })
                
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
} )

cmd({
    pattern: "taggp",
    react: "🔊",
    alias: ["tggp","djtaggp"],
    desc: "To Tag all Members for Message",
    category: "group",
    use: '.tag Hi',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag , args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
		if ( !m.quoted ) return reply('*Please mention a message* ℹ️')
		if(!q) return reply('*Please add a Group Jid* ℹ️')
		//if ( q == "120363174739054837@g.us" ) { if ( !isDev ) return reply("❌ *Acai wage ! You can send Tag messages to Official Support Group*") }
		let teks = `${m.quoted.msg}`
        conn.sendMessage(q, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek })
                
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
} )

