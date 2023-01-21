var dataset = [
  { input: "how are you?", output: [0] },
  { input: "hi", output: [1] },
  { input: "what's your name?", output: [2] },
  { input: "what can you do?", output: [3] },
  { input: "Who created you", output: [4] },
   
   
];

var responseMap = {
  [0]: "I am fine, How are you?",
  [0]: "I am fine, What do you need help with",
  [1]: "Hello there!",
  [2]: "My name is Chatbot.",
  [3]: "I can answer questions, give information, and even tell a joke or two.",
  [4]: "I am created by Technologypower#3174",
};

module.exports = { dataset, responseMap };
