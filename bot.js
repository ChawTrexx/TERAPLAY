import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TARGET_CHATS = ['-1002539335292', '-1002573783731'];
const TERABOX_REGEX = /https?:\/\/(?:www\.)?(terabox|terasharelink|teraboxshare|teraboxurl|teraboxlink|terafileshare|1024terabox)\.com\/\S+/i;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('🤖 Bot active! Send TeraBox link + media.'));
bot.on(['text', 'photo', 'video'], async (ctx) => {
  const msg = ctx.message;
  const text = msg.text || msg.caption || '';

  const match = text.match(TERABOX_REGEX);
  if (!match) return;

  const terabox_link = match[0];
  const safe_link = `https://teraplayer.vercel.app/?q=${encodeURIComponent(terabox_link)}`;

  const caption = `<span class='tg-spoiler'>🎬 Watch safely here 👇</span>
<span class='tg-spoiler'>${safe_link}</span>

<span class='tg-spoiler'>⚡ Shared by @AXONI_bot</span>`;

  await ctx.reply('✅ Processing your upload securely...');

  let fileId = null;
  let mediaType = null;

  if (msg.photo) {
    fileId = msg.photo[msg.photo.length - 1].file_id;
    mediaType = 'photo';
  } else if (msg.video) {
    fileId = msg.video.file_id;
    mediaType = 'video';
  }

  if (!fileId) {
    await ctx.reply('⚠️ Please attach a photo or video with the TeraBox link.');
    return;
  }

  for (const target of TARGET_CHATS) {
    try {
      if (mediaType === 'photo') {
        await ctx.telegram.sendPhoto(target, fileId, {
          caption: caption,
          parse_mode: 'HTML',
          has_spoiler: true,
        });
      } else {
        await ctx.telegram.sendVideo(target, fileId, {
          caption: caption,
          parse_mode: 'HTML',
        });
      }
      console.log(`✅ Sent safely to ${target}`);
    } catch (e) {
      await ctx.reply(`⚠️ Failed to send to ${target}: ${e.message}`);
      console.error(`❌ Failed to send to ${target}:`, e);
    }
  }

  await ctx.reply('✅ Sent safely to all channels!');
});

export default async function handler(req, res) {
  await bot.handleUpdate(req.body, res);
  res.status(200).end();
}
