const { SlashCommandBuilder } = require("discord.js");
const chatbotDB = require("../../../Schemas/Chatbot");
const Reply = require("../../../Systems/Reply");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-chatbot")
    .setDescription("Disable Chatbot"),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction) {
    const { guild } = interaction;
    const Data = await chatbotDB.findOne({ Guild: guild.id });

    if (Data) {
      await chatbotDB.findOneAndDelete({ Guild: guild.id });
      Reply(interaction, ":white_check_mark:", "Disabled ChatBot V3.0");
    }
    if (!Data) {
      Reply(interaction, ":x:", "This plugin is not enabled yet");
    }
  },
};
