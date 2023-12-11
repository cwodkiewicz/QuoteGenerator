const mysql = require("mysql2/promise");

async function fetchRandomQuote() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1", // Use Cloud SQL Proxy
    user: "root",
    password: "Soccer22", // Replace with your MySQL password
    database: "quotes",
  });

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM quotes_table ORDER BY RAND() LIMIT 1"
    );
    return rows[0];
  } finally {
    await connection.end();
  }
}

fetchRandomQuote()
  .then((quote) => {
    console.log("Random Quote:", quote);
  })
  .catch((error) => {
    console.error("Error fetching quote:", error);
  });
