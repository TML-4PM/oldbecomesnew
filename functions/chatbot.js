document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  if (!chatbotContainer) return;

  // Create a basic chatbot UI
  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";
  chatBox.style.position = "fixed";
  chatBox.style.bottom = "20px";
  chatBox.style.right = "20px";
  chatBox.style.width = "300px";
  chatBox.style.height = "400px";
  chatBox.style.border = "1px solid #ccc";
  chatBox.style.background = "#fff";
  chatBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
  chatBox.innerHTML = `
    <div id="chat-header" style="background:blue; color:#fff; padding:10px;">Chat Assistant</div>
    <div id="chat-messages" style="height:300px; overflow-y:auto; padding:10px;"></div>
    <input id="chat-input" type="text" placeholder="Type your message" style="width:80%; padding:5px;">
    <button id="chat-send" style="padding:5px;">Send</button>
  `;
  chatbotContainer.appendChild(chatBox);

  const messagesDiv = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  chatSend.addEventListener("click", () => {
    const message = chatInput.value;
    if (message.trim() === "") return;
    // Display the user message
    let userMsgDiv = document.createElement("div");
    userMsgDiv.textContent = "You: " + message;
    messagesDiv.appendChild(userMsgDiv);
    chatInput.value = "";

    // Get a bot response
    let botResponse = getBotResponse(message);
    let botMsgDiv = document.createElement("div");
    botMsgDiv.textContent = "Bot: " + botResponse;
    messagesDiv.appendChild(botMsgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});

function getBotResponse(message) {
  message = message.toLowerCase();
  if (message.includes("product")) {
    return "You can select products from the list above.";
  } else if (message.includes("quote")) {
    return "Click on 'Generate Quote' to see your pricing.";
  } else if (message.includes("schedule")) {
    return "You can schedule a job by selecting a date and clicking 'Schedule Job'.";
  } else {
    return "I'm here to help! Ask me about products, quotes, or scheduling.";
  }
}
