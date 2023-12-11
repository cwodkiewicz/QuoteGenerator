const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000; // Update with your desired port

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://34.68.157.123');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Endpoint to get a random quote
app.get('/getRandomQuote', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1', // Use Cloud SQL Proxy
      user: 'root',       // Replace with your MySQL user
      password: 'Soccer22', // Replace with your MySQL password
      database: 'quotes',
    });

    const [rows] = await connection.execute(
      'SELECT * FROM quotes_table ORDER BY RAND() LIMIT 1'
    );

    await connection.end();

    if (rows && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'No quotes found' });
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get a category-based quote
app.get('/getCategoryQuote', async (req, res) => {
  try {
    const { category } = req.query;
    
    const formattedCategory = category.replace('-', ' ');

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    const connection = await mysql.createConnection({
      host: '127.0.0.1', // Use Cloud SQL Proxy
      user: 'root',       // Replace with your MySQL user
      password: 'Soccer22', // Replace with your MySQL password
      database: 'quotes',
    });

    const [rows] = await connection.execute(
      'SELECT * FROM quotes_table WHERE category = ? ORDER BY RAND() LIMIT 1',
      [formattedCategory]
    );

    await connection.end();

    if (rows && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'No quotes found for the specified category' });
    }
  } catch (error) {
    console.error('Error fetching category quote:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get an author-based quote
app.get('/getAuthorQuote', async (req, res) => {
  const { author } = req.query;

  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1', // Use Cloud SQL Proxy
      user: 'root',       // Replace with your MySQL user
      password: 'Soccer22', // Replace with your MySQL password
      database: 'quotes',
    });

    const [rows] = await connection.execute(
      'SELECT * FROM quotes_table WHERE author = ? ORDER BY RAND() LIMIT 1',
      [author]
    );

    await connection.end();

    if (rows && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: `No quotes found for the author: ${author}` });
    }
  } catch (error) {
    console.error('Error fetching author quote:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle combined quotes endpoint
app.get('/getCombinedQuote', async (req, res) => {
  try {
    const { author, category } = req.query;

    let query = 'SELECT * FROM quotes_table';

    // Handle both author and category parameters
    if (author && category) {
  const formattedCategory = category.replace('-', ' ');
  query += ` WHERE author = '${author}' AND category = '${formattedCategory}'`;
} else if (author) {
  query += ` WHERE author = '${author}'`;
} else if (category) {
  const formattedCategory = category.replace('-', ' ');
  query += ` WHERE category = '${formattedCategory}'`;
}


    query += ' ORDER BY RAND() LIMIT 1';

    const connection = await mysql.createConnection({
      host: '127.0.0.1', // Use Cloud SQL Proxy
      user: 'root',       // Replace with your MySQL user
      password: 'Soccer22', // Replace with your MySQL password
      database: 'quotes',
    });

    const [rows] = await connection.execute(query);

    await connection.end();

    if (rows && rows.length > 0) {
  const quote = {
    content: rows[0].content,
    author: rows[0].author,
    category: rows[0].category
    // Add other properties if needed
  };
  res.json(quote);
} else {
  res.status(404).json({ error: 'No quotes found' });
}
  } catch (error) {
    console.error('Error fetching combined quote:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Handle the root path
app.get('/', (req, res) => {
  res.send('Server is running. Use /getRandomQuote, /getCategoryQuote?category=yourCategory to fetch a quote, /getAuthorQuote?author=yourAuthor, or /getCombinedQuote?author=yourAuthor&category=yourCategory.');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
