const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const chatbotDB = require("../../../Schemas/Chatbot");
const Reply = require("../../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-chatbot")
    .setDescription("Setup advanced chatbot in your server")
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("Channel where the responses be send")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("type")
        .setDescription("Type of the chatbot")
        .addChoices(
          { name: "BrainShop (recommended)", value: "BrainShop" },
          { name: "ChatGPT (Logical Answers)", value: "ChatGPT" },
          { name: "System (Default)", value: "System" }
        )
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const Data = await chatbotDB.findOne({ Guild: guild.id });
    const Channel = await options.getChannel("channel");
    let Types = await options.getString("type");
    if (!Types) Types = "System";
    if (Data) {
      if (Channel.id == Data.Channel) {
        Reply(interaction, ":x:", "This channel already has chatbot enabled");
      } else {
        await chatbotDB.create({
          Guild: guild.id,
          Channel: Channel.id,
          Type: Types,
        });
        const embed = new EmbedBuilder()
          .setTitle("Chatbot System")
          .setDescription(
            `Chatbot has been enabled for this guild with the type ${Types}`
          )
          .setFooter({ text: "Chatbot System" })
          .setColor("Random")
          .setThumbnail(guild.iconURL({ size: 1024 }))
          .setImage(guild.bannerURL({ size: 1024 }))
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
        const E = new EmbedBuilder()
          .setTitle("Chatbot System")
          .setDescription(
            `Chatbot has been enabled for this channel with the type ${Types}`
          )
          .setFooter({ text: "Chatbot System" })
          .setThumbnail(guild.iconURL({ size: 1024 }))
          .setImage(guild.bannerURL({ size: 1024 }))
          .setColor("Random")
          .setTimestamp();
        Channel.send({
          embeds: [E],
        });
      }
    }
    if (!Data) {
      await chatbotDB.create({
        Guild: guild.id,
        Channel: Channel.id,
        Type: Types,
      });
      const embed = new EmbedBuilder()
        .setTitle("Chatbot System")
        .setDescription(
          `Chatbot has been enabled for this guild with the type ${Types}`
        )
        .setFooter({ text: "Chatbot System" })
        .setColor("Random")
        .setThumbnail(guild.iconURL({ size: 1024 }))
        .setImage(guild.bannerURL({ size: 1024 }))
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
      const E = new EmbedBuilder()
        .setTitle("Chatbot System")
        .setDescription(
          `Chatbot has been enabled for this channel with the type ${Types}`
        )
        .setFooter({ text: "Chatbot System" })
        .setThumbnail(guild.iconURL({ size: 1024 }))
        .setImage(guild.bannerURL({ size: 1024 }))
        .setColor("Random")
        .setTimestamp();
      Channel.send({
        embeds: [E],
      });
    }
  },
};
