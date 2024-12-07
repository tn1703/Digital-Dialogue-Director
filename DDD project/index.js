
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");
  inputField.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      let input = inputField.value;
      inputField.value = "";
      output(input);
    }
  });
});

function output(input) {
  let product;

  let text = input.toLowerCase();
  text = text;

  if (compare(prompts, replies, text)) {
    // Search for an exact match in `prompts`
    product = compare(prompts, replies, text);
    updateDOM(input, product);
  } else if (text.match(/thank/gi)) {
    product = "You're welcome!";
    updateDOM(input, product);
  } else if (text.match(/(corona|covid|virus)/gi)) {
    // If no match, check if the message contains `coronavirus`
    product = coronavirus[Math.floor(Math.random() * coronavirus.length)];
    updateDOM(input, product);
  } else {
    // If none of the predefined patterns match, fetch response from API
    fetchApiResponse(text)
      .then((response) => {
        product = response; // Use the response from the API
        updateDOM(input, product);
      })
      .catch((error) => {
        console.error("API Error:", error);
        product = "Oops! Something went wrong while fetching from the API.";
        updateDOM(input, product);
      });
  }
}

function compare(promptsArray, repliesArray, string) {
  let reply;
  let replyFound = false;
  for (let x = 0; x < promptsArray.length; x++) {
    for (let y = 0; y < promptsArray[x].length; y++) {
      if (promptsArray[x][y] === string) {
        let replies = repliesArray[x];
        reply = replies[Math.floor(Math.random() * replies.length)];
        replyFound = true;
        // Stop inner loop when the input value matches prompts
        break;
      }
    }
    if (replyFound) {
      // Stop outer loop when reply is found instead of iterating through the entire array
      break;
    }
  }
  return reply;
}

function updateDOM(input, product) {
  const messagesContainer = document.getElementById("messages");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="user.jpeg" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botImg = document.createElement("img");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botImg.src = "bot.jpeg";
  botImg.className = "avatar";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  botDiv.appendChild(botImg);
  messagesContainer.appendChild(botDiv);

  // Keep messages at most recent
  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;

  // Response time for bot "real"
  setTimeout(() => {
    botText.innerText = `${product}`;
     textToSpeech(product); // comment this line if needed
  }, 2000);
}

// Function to fetch response from API
function fetchApiResponse(input) {
  const apiKey = "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"; // Replace with your actual API key
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // Replace with your actual API endpoint
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
    }),
  };

  return fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => data.choices[0].message.content.trim());
}
