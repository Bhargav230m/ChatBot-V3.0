const { Client } = require("discord.js");
const brain = require("brain.js");
const chatbotDB = require("../../Schemas/Chatbot");
const axios = require("axios");
module.exports = {
  name: "messageCreate",
  /**
 * 

 * @param {Client} client 
 */
  async execute(message, client) {
    client.config = require("../../config.json");
    const { guild } = message;
    const Data = await chatbotDB.findOne({ Guild: guild.id });
    if (!Data) return;
    if (message.author.bot || !message.guild) return;
    if (message.channel.id !== Data.Channel) return;

    try {
      if (Data.Type == "BrainShop") {
        const KEY = client.config.BrainShopAPI;
        const res = await axios.get(
          `${KEY}1&msg=${encodeURIComponent(message.content)}`
        );
        if (res.data.cnt === undefined || res.data.cnt === null) {
          message.reply("I am sorry, Can you repeat it again?");
        } else {
          await message.reply({
            content: `${res.data.cnt}`,
          });
          return;
        }
      }
      if (Data.Type == "ChatGPT") {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
          organization: client.config.OPENAI_ORG,
          apiKey: client.config.OPENAI_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const gptResponse = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Hey give me a response me for this : ${message.content}`,
          temperature: 0.5,
          max_tokens: 300,
          top_p: 1.0,
          frequency_penalty: 0.5,
          presence_penalty: 0.0,
        });
        if (gptResponse === undefined || gptResponse === null) {
          message.reply("I am sorry, Can you repeat it again?");
        } else {
          message.reply(`${gptResponse.data.choices[0].text}`);
          return;
        }
      }
      if (Data.Type == "System") {
        const config = {
          binaryThresh: 0.5,
          hiddenLayers: [3],
          activation: "sigmoid",
          inputSize: 700,
          inputRange: 700,
          outputSize: 200,
          learningRate: 0.5,
          decayRate: 0.009,
          iterations: 20000,
        };

        const net = new brain.NeuralNetwork(config);

        const { dataset, responseMap } = require("../../Systems/Dataset.js");
        const stringSimilarity = require("string-similarity");

        const bestMatch = stringSimilarity.findBestMatch(
          message.content,
          dataset.map((data) => data.input)
        );

        net.train(dataset);
        // message.reply("Training 1%");
        // message.reply("Training 10%");
        // message.reply("Training 20%");
        // message.reply("Training 100%");
        // message.reply("Tranining Done, Executing...");

        const index = bestMatch.bestMatchIndex;

        const oneHotEncodedInput = Array(dataset.length).fill(0);
        oneHotEncodedInput[index] = 1;
        console.log(oneHotEncodedInput);

        const outputValues = net.run(oneHotEncodedInput);
        console.log(outputValues);
        const highestValue = Math.max(...outputValues);
        const responseIndex = outputValues.indexOf(highestValue);
        const output1 = responseMap[dataset[responseIndex].output[0]];
        console.log(output1);
        const response = output1[Math.floor(Math.random() * output1.length)];
        console.log(response);
        if (response === undefined || response === null || response == Object) {
          message.reply("I am sorry, Can you repeat it again?");
        } else {
          message.reply(response);
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
