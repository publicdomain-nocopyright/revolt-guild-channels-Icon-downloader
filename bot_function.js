const https = require('https');
const path = require('path');
const fsp = require('fs').promises; // Import fs module with promises and declare as fsp
const fs = require('fs');

client.on("messageCreate", async (message) => {
  if (message.content === "Download Guild Icons") {
    await message.channel.sendMessage("**Starting to Download Guild Icons**");
	

    const directoryPath = path.join(__dirname, 'icons', message.server.name); // Directory 'icons/${message.server.name}' should exist
    await fsp.mkdir(directoryPath, { recursive: true });
	
	let channel_position = 0;
    for (const channel of message.server.channels.values()) {
		channel_position++;
      //await message.channel.sendMessage(`<#${channel.id}>`); // Print channel name
		
      if (channel.iconURL !== undefined) {
        const fileName = `${channel_position}_#${channel.name}_${channel.id}_${channel.iconURL.match(/icons\/([^/?]+)/)?.[1] || null}.png`;
        const filePath = path.join(directoryPath, fileName);

        const fileStream = fs.createWriteStream(filePath); // Use fs.createWriteStream

        const request = https.get(channel.iconURL, function(response) {
          response.pipe(fileStream);
        });

        request.on('error', async function(err) {
          await message.channel.sendMessage(`Error downloading icon for channel '<#${channel.id}>': ${err.message}`);
        });

        fileStream.on('finish', async function() {
          await message.channel.sendMessage(`✔️ Icon for channel '<#${channel.id}>' downloaded successfully.`);
        });

        fileStream.on('error', async function(err) {
          await message.channel.sendMessage(`Error writing icon for channel '<#${channel.id}>': ${err.message}`);
        });
      } else {
        await message.channel.sendMessage(`Channel '<#${channel.id}>' 🔳 contains no icon. Skipping.`);
      }
    }
  }
});

