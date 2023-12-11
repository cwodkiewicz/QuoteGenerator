const fetch = require("node-fetch");
const mysql = require("mysql");

// Cloud SQL database configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "quotes",
});

// Function to fetch quotes from the API
const fetchQuotes = async () => {
  let page = 1;
  let allQuotes = [];

  while (true) {
    const apiUrl = `https://api.quotable.io/quotes?page=${page}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results.length === 0) {
      // No more quotes, break out of the loop
      break;
    }

    allQuotes = allQuotes.concat(data.results);
    page++;
  }

  return allQuotes;
};

// Function to insert quotes into the Cloud SQL database
const insertQuotesToDatabase = (quotes) => {
  connection.connect();

  quotes.forEach((quote) => {
    const { content, author } = quote;
    const query = `INSERT INTO quotes (content, author) VALUES (?, ?)`;
    connection.query(query, [content, author], (error, results) => {
      if (error) throw error;
      console.log(`Inserted quote: ${content} by ${author}`);
    });
  });

  connection.end();
};

// Main script execution
const runScript = async () => {
  try {
    // Fetch quotes from the API
    const quotes = await fetchQuotes();

    console.log(`Total quotes fetched: ${quotes.length}`);

    // Insert quotes into the database
    insertQuotesToDatabase(quotes);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Execute the script
runScript();
