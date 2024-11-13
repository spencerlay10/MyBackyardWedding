const express = require('express');
const path = require('path');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

// Serve static files (e.g., CSS, images)
app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

app.get('/home', (req, res) => {
    res.render('index'); // This will look for 'our_story.ejs' in the 'views' folder
  });

// Route to render the 'Our Story' page
app.get('/our_story', (req, res) => {
  res.render('our_story'); // This will look for 'our_story.ejs' in the 'views' folder
});

app.get('/login_page', (req, res) => {
    res.render('login_page'); // This will look for 'our_story.ejs' in the 'views' folder
  });

app.get('/sign_up', (req, res) => {
    res.render('sign_up'); // This will look for 'our_story.ejs' in the 'views' folder
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
