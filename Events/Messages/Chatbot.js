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
        await message.reply({
          content: `${res.data.cnt}`,
        });
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

        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
      }
      if (Data.Type == "System") {
        // provide optional config object (or undefined). Defaults shown.
        const config = {
          binaryThresh: 0.5,
          hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
          activation: "sigmoid", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
          inputSize: 700,
          inputRange: 700,
          outputSize: 200,
          learningRate: 0.5,
          decayRate: 0.009,
          iterations: 20000,
        };
        // create a simple feed forward neural network with backpropagation
        const net = new brain.NeuralNetwork(config);
        const { dataset, responseMap } = require("../../Systems/Dataset.js");
        const stringSimilarity = require("string-similarity");

        net.train(dataset);

        // find the best match for the user's message
        const bestMatch = stringSimilarity.findBestMatch(
          message.content,
          dataset.map((data) => data.input)
        );

        const index = bestMatch.bestMatchIndex;
        // one-hot encode the input
        const oneHotEncodedInput = Array(dataset.length).fill(0);
        oneHotEncodedInput[index] = 1;
        console.log(oneHotEncodedInput);
        // run the encoded input through the network
        const output = net.run(oneHotEncodedInput);
        console.log(output);
        // get the corresponding response from the responseMap
        const highestValue = Math.max(...output);
        const responseIndex = output.indexOf(highestValue);
        const response = responseMap[dataset[index].output];
        console.log(response);
        if (response === undefined || response === null) {
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
