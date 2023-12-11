document.addEventListener("DOMContentLoaded", function () {
  // Quote of the Day
  const quoteText = document.querySelector(".quote"),
    quoteBtn = document.getElementById("newQuoteBtn"),
    authorName = document.querySelector(".author .name"),
    copyBtn = document.querySelector(".copy");
  const speakBtn = document.getElementById("speakBtn");

  // Load the Text-to-Speech API
  gapi.load("client", initTextToSpeech);

  function initTextToSpeech() {
    // Initialize the API client
    gapi.client
      .init({
        apiKey: "",
        discoveryDocs: [
          "https://texttospeech.googleapis.com/$discovery/rest?version=v1",
        ],
      })
      .then(() => {
        console.log("Text-to-Speech API initialized");
      })
      .catch((error) => {
        console.error("Error initializing Text-to-Speech API:", error);
      });
  }

  // Random Quote

  async function fetchRandomQuote() {
    const response = await fetch("https://35.239.118.124:4000/get-quote");
    if (!response.ok) {
      throw new Error(`Error fetching quote: ${response.statusText}`);
    }
    return response.json();
  }

  function displayQuote(content, author) {
    quoteText.innerText = content;
    authorName.innerText = author;
    quoteBtn.classList.remove("loading");
    quoteBtn.innerText = "New Quote";
  }

  function randomQuote() {
    quoteBtn.classList.add("loading");
    quoteBtn.innerText = "Loading Quote...";

    // Replace the API call with your server's endpoint
    fetch("http://34.68.157.123:3000/getRandomQuote") // Update with your VM's IP and port
      .then((response) => response.json())
      .then((result) => {
        quoteText.innerText = result.content;
        authorName.innerText = result.author;
        quoteBtn.classList.remove("loading");
        quoteBtn.innerText = "New Quote";
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        quoteBtn.classList.remove("loading");
        quoteBtn.innerText = "New Quote";
      });
  }

  quoteBtn.addEventListener("click", randomQuote);

  randomQuote();

  function speakQuote(text) {
    // Use the Text-to-Speech API to synthesize speech
    gapi.client.texttospeech.text
      .synthesize({
        input: {
          text: text,
        },
        voice: {
          languageCode: "en-US", // Replace with the desired language code
          name: "en-US-Wavenet-D", // Replace with the desired voice
        },
        audioConfig: {
          audioEncoding: "LINEAR16",
        },
      })
      .then((response) => {
        // Play the synthesized speech
        const audio = new Audio(
          `data:audio/wav;base64,${response.result.audioContent}`
        );
        audio.play();
      })
      .catch((error) => {
        console.error("Error synthesizing speech:", error);
      });
  }

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(
      `${quoteText.innerText} - ${authorName.innerText}`
    );
  });

  speakBtn.addEventListener("click", () => {
    speakQuote(`${quoteText.innerText} by ${authorName.innerText}`);
  });

  // Category Quote
  const categorySelect = document.getElementById("categorySelect"),
    categoryQuoteText = document.querySelector(".category-quote"),
    categoryAuthorName = document.querySelector(
      ".category-author .category-name"
    ),
    categoryQuoteBtn = document.getElementById("newCategoryQuoteBtn"),
    categoryQuoteCopy = document.querySelector(".copy-category"),
    categorySpeakBtn = document.getElementById("categorySpeakBtn");

  // Function to speak the category quote using Text-to-Speech API
  function speakCategoryQuote() {
    const textToSpeak = `${categoryQuoteText.innerText} by ${categoryAuthorName.innerText}`;
    speakQuote(textToSpeak);
  }

  function fetchCategoryQuote(category) {
    categoryQuoteBtn.classList.add("loading");
    categoryQuoteBtn.innerText = "Loading Quote...";

    const apiUrl = `http://34.68.157.123:3000/getCategoryQuote?category=${category}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((result) => {
        if (result.content) {
          categoryQuoteText.innerText = result.content;
          categoryAuthorName.innerText = result.author;
        } else {
          categoryQuoteText.innerText = "No quotes found.";
          categoryAuthorName.innerText = "";
        }

        categoryQuoteBtn.classList.remove("loading");
        categoryQuoteBtn.innerText = "New Quote";
      })
      .catch((error) => {
        console.error("Error fetching category quote:", error);
        categoryQuoteBtn.classList.remove("loading");
        categoryQuoteBtn.innerText = "New Quote";
      });
  }

  function handleCategoryChange() {
    const selectedCategory = categorySelect.value;
    fetchCategoryQuote(selectedCategory);
  }

  categoryQuoteCopy.addEventListener("click", () => {
    navigator.clipboard.writeText(
      `${categoryQuoteText.innerText} - ${categoryAuthorName.innerText}`
    );
  });

  categorySelect.addEventListener("change", handleCategoryChange);
  categoryQuoteBtn.addEventListener("click", handleCategoryChange);

  // Text-to-speech event listener
  categorySpeakBtn.addEventListener("click", speakCategoryQuote);

  // Initial fetch
  handleCategoryChange();

  // Rasberry PI functionality
  const displayOnPiBtn1 = document.getElementById("displayOnPiBtn1");

  displayOnPiBtn1.addEventListener("click", () => {
    sendQuoteToPi(quoteText.innerText);
  });

  const displayOnPiBtn2 = document.getElementById("displayOnPiBtn2");

  displayOnPiBtn2.addEventListener("click", () => {
    sendQuoteToPi(categoryQuoteText.innerText, categorySelect.value);
  });

  const displayOnPiBtn3 = document.getElementById("displayOnPiBtn3");

  displayOnPiBtn3.addEventListener("click", () => {
    sendQuoteToPi(authorQuoteText.innerText);
  });

  const displayOnPiBtn4 = document.getElementById("displayOnPiBtn4");

  displayOnPiBtn4.addEventListener("click", () => {
    sendQuoteToPi(combinedQuoteText.innerText, combinedCategorySelect.value);
  });

  function sendQuoteToPi(currentQuoteText, category = null) {
    const apiUrl = "http://192.168.1.23:5000/receive-quote";
    const payload = { quote: currentQuoteText, category: category };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Quote sent to Raspberry Pi:", data);
      })
      .catch((error) => {
        console.error("Error sending quote to Raspberry Pi:", error);
      });
  }
});

// footer
// document.addEventListener("DOMContentLoaded", function () {
//   var footer = document.querySelector(".footer");

//   function toggleFooter() {
//     if (window.scrollY > 100) {
//       footer.classList.add("visible");
//     } else {
//       footer.classList.remove("visible");
//     }
//   }

//   window.addEventListener("scroll", toggleFooter);
// });

function initTextToSpeech() {
  // Initialize the API client
  gapi.client
    .init({
      apiKey: "", // Replace with your actual API key
      discoveryDocs: [
        "https://texttospeech.googleapis.com/$discovery/rest?version=v1",
      ],
    })
    .then(() => {
      console.log("Text-to-Speech API initialized");
    })
    .catch((error) => {
      console.error("Error initializing Text-to-Speech API:", error);
    });
}

function speakQuote(text) {
  // Use the Text-to-Speech API to synthesize speech
  gapi.client.texttospeech.text
    .synthesize({
      input: {
        text: text,
      },
      voice: {
        languageCode: "en-US", // Replace with the desired language code
        name: "en-US-Wavenet-D", // Replace with the desired voice
      },
      audioConfig: {
        audioEncoding: "LINEAR16",
      },
    })
    .then((response) => {
      // Play the synthesized speech
      const audio = new Audio(
        `data:audio/wav;base64,${response.result.audioContent}`
      );
      audio.play();
    })
    .catch((error) => {
      console.error("Error synthesizing speech:", error);
    });
}

// Author Quote
function searchAuthors() {
  const query = document.getElementById("author-search-input").value;

  // Make a request to the Quotable API
  fetch(
    `https://api.quotable.io/search/authors?query=${query}&autocomplete=true&limit=5&matchThreshold=1`
  )
    .then((response) => response.json())
    .then((data) => {
      // Handle the response, update the UI with search results
      displaySearchResults(data.results);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displaySearchResults(results) {
  // Clear previous search results
  const selectElement = document.getElementById("author-select");
  selectElement.innerHTML = "";

  // Populate the dropdown with search results
  results.forEach((author) => {
    const option = document.createElement("option");
    option.value = author.name;
    option.textContent = author.name;
    selectElement.appendChild(option);
  });
}

function loadAuthorQuotes(authorName) {
  // Implement the logic to load quotes for the selected author
  // You can use a similar approach as with the category quotes
  console.log("Loading quotes for:", authorName);
}

const authorSelect = document.getElementById("author-select"),
  authorQuoteText = document.querySelector(".author-quote"),
  authorNameElement = document.querySelector(".author-name .author-name"),
  newAuthorQuoteBtn = document.getElementById("newAuthorQuoteBtn"),
  authorQuoteCopy = document.querySelector(".copy-author"),
  authorSpeakBtn = document.getElementById("authorSpeakBtn");

// Function to speak the author quote using Text-to-Speech API
function speakAuthorQuote() {
  const textToSpeak = `${authorQuoteText.innerText} by ${authorNameElement.innerText}`;
  speakQuote(textToSpeak);
}

function fetchAuthorQuote(authorName) {
  newAuthorQuoteBtn.classList.add("loading");
  newAuthorQuoteBtn.innerText = "Loading Quote...";

  // Update the API endpoint to your server's author quote endpoint
  const apiUrl = `http://34.68.157.123:3000/getAuthorQuote?author=${authorName}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((result) => {
      if (result.content) {
        authorQuoteText.innerText = result.content;
        authorNameElement.innerText = result.author;
      } else {
        authorQuoteText.innerText = "No quotes found for the selected author.";
        authorNameElement.innerText = "";
      }

      newAuthorQuoteBtn.classList.remove("loading");
      newAuthorQuoteBtn.innerText = "New Quote";
    })
    .catch((error) => {
      console.error("Error fetching author quote:", error);
      newAuthorQuoteBtn.classList.remove("loading");
      newAuthorQuoteBtn.innerText = "New Quote";
    });
}

function handleAuthorChange() {
  const selectedAuthor = authorSelect.value;
  fetchAuthorQuote(selectedAuthor);
}

authorSelect.addEventListener("change", handleAuthorChange);
newAuthorQuoteBtn.addEventListener("click", handleAuthorChange);

authorQuoteCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(
    `${authorQuoteText.innerText} - ${authorNameElement.innerText}`
  );
});

// Text-to-speech event listener
authorSpeakBtn.addEventListener("click", speakAuthorQuote);

// Initial fetch
handleAuthorChange();

// Combined Quote
function searchCombinedAuthors() {
  const query = document.getElementById("combined-author-search-input").value;

  fetch(
    `https://api.quotable.io/search/authors?query=${query}&autocomplete=true&limit=5&matchThreshold=1`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCombinedSearchResults(data.results);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayCombinedSearchResults(results) {
  const selectElement = document.getElementById("combined-author-select");
  selectElement.innerHTML = "";

  results.forEach((author) => {
    const option = document.createElement("option");
    option.value = author.name;
    option.textContent = author.name;
    selectElement.appendChild(option);
  });
}

// const combinedAuthorSelect = document.getElementById("combined-author-select"),
//   combinedCategorySelect = document.getElementById("combined-category-select"),
//   combinedQuoteText = document.querySelector(".combined-quote"),
//   combinedAuthorNameElement = document.querySelector(
//     ".combined-author-name .combined-author-name"
//   ),
//   newCombinedQuoteBtn = document.getElementById("newCombinedQuoteBtn");

// function fetchCombinedQuote(authorName, category) {
//   newCombinedQuoteBtn.classList.add("loading");
//   newCombinedQuoteBtn.innerText = "Loading Quote...";

//   const apiUrl = `https://api.quotable.io/quotes?author=${authorName}&tags=${category}&limit=1000`;

//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((result) => {
//       const quotes = result.results;
//       const randomIndex = Math.floor(Math.random() * quotes.length);
//       const quote = quotes[randomIndex];

//       combinedQuoteText.innerText = quote.content;
//       combinedAuthorNameElement.innerText = quote.author;
//       newCombinedQuoteBtn.classList.remove("loading");
//       newCombinedQuoteBtn.innerText = "New Quote";
//     })
//     .catch((error) => {
//       console.error("Error fetching combined quote:", error);
//       newCombinedQuoteBtn.classList.remove("loading");
//       newCombinedQuoteBtn.innerText = "New Quote";
//     });
// }

// function loadCombinedQuotes() {
//   const selectedAuthor = combinedAuthorSelect.value;
//   const selectedCategory = combinedCategorySelect.value;
//   fetchCombinedQuote(selectedAuthor, selectedCategory);
// }

// // Initial fetch for combined container
// loadCombinedQuotes();

const combinedAuthorSelect = document.getElementById("combined-author-select"),
  combinedCategorySelect = document.getElementById("combined-category-select"),
  combinedQuoteText = document.querySelector(".combined-quote"),
  combinedAuthorNameElement = document.querySelector(
    ".combined-author-name .combined-author-name"
  ),
  newCombinedQuoteBtn = document.getElementById("newCombinedQuoteBtn"),
  combinedQuoteCopy = document.querySelector(".copy-combined"),
  combinedSpeakBtn = document.getElementById("combinedSpeakBtn");

// Function to speak the combined quote using Text-to-Speech API
function speakCombinedQuote() {
  const textToSpeak = `${combinedQuoteText.innerText} by ${combinedAuthorNameElement.innerText}`;
  speakQuote(textToSpeak);
}

function fetchCombinedQuote(authorName, category) {
  newCombinedQuoteBtn.classList.add("loading");
  newCombinedQuoteBtn.innerText = "Loading Quote...";

  let apiUrl;

  // Update the API endpoint to your server's combined quote endpoint
  if (authorName && category) {
    apiUrl = `http://34.68.157.123:3000/getCombinedQuote?author=${authorName}&category=${category}`;
  } else if (authorName) {
    apiUrl = `http://34.68.157.123:3000/getCombinedQuote?author=${authorName}`;
  } else if (category) {
    apiUrl = `http://34.68.157.123:3000/getCombinedQuote?category=${category}`;
  } else {
    apiUrl = `http://34.68.157.123:3000/getCombinedQuote`;
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then((result) => {
      if (result.content) {
        combinedQuoteText.innerText = result.content;
        combinedAuthorNameElement.innerText = result.author;
      } else {
        combinedQuoteText.innerText = "No quotes found.";
        combinedAuthorNameElement.innerText = "";
      }

      newCombinedQuoteBtn.classList.remove("loading");
      newCombinedQuoteBtn.innerText = "New Quote";
    })
    .catch((error) => {
      console.error("Error fetching combined quote:", error);
      newCombinedQuoteBtn.classList.remove("loading");
      newCombinedQuoteBtn.innerText = "New Quote";
    });
}

function loadCombinedQuotes() {
  const selectedAuthor = combinedAuthorSelect.value;
  const selectedCategory = combinedCategorySelect.value;
  fetchCombinedQuote(selectedAuthor, selectedCategory);
}

combinedQuoteCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(
    `${combinedQuoteText.innerText} - ${combinedAuthorNameElement.innerText}`
  );
});

// Text-to-speech event listener
combinedSpeakBtn.addEventListener("click", speakCombinedQuote);

// Initial fetch for combined container
loadCombinedQuotes();
// });
// // COPY
// // Copy button for Author Quote
// const authorCopyBtn = document.querySelector(".author-copy");

// authorCopyBtn.addEventListener("click", () => {
//   copyToClipboard(authorQuoteText, authorNameElement);
// });

// // Copy button for Category Quote
// const categoryCopyBtn = document.querySelector(".category-copy");

// categoryCopyBtn.addEventListener("click", () => {
//   copyToClipboard(categoryQuoteText, categoryAuthorName);
// });

// // Copy function
// function copyToClipboard(contentElement, authorElement) {
//   navigator.clipboard.writeText(
//     `${contentElement.innerText} - ${authorElement.innerText}`
//   );
// }

// // Copy button for Combined Quote
// const combinedCopyBtn = document.querySelector(".combined-copy");

// combinedCopyBtn.addEventListener("click", () => {
//   copyToClipboard(combinedQuoteText, combinedAuthorNameElement);
// });
