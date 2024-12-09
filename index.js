const express = require('express');
const path = require('path');

const app = express();

// set up the connection between the file and the database 

const knex = require("knex") ({ 
    client : "pg", 
    connection : { 
    host : "localhost", 
    user : "postgres", 
    password : "reese", 
    database : "myBackyardWedding", 
    port : 5433 } 
    }); 
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

app.get('/our_story', (req, res) => {
    res.render('our_story'); // Render our_story.ejs
});

app.get('/login_page', (req, res) => {
    res.render('login_page'); // Render login_page.ejs
});

app.get('/signup_page', (req, res) => {
    res.render('signup_page'); // Render sign_up.ejs
});

app.get('/contact_us_page', (req, res) => {
    res.render('contact_us_page'); // Render contact_us_page.ejs
});

app.get('/faq_page', (req, res) => {
    res.render('faq_page'); // Render faq_page.ejs
});

app.get('/find_a_backyard', (req, res) => {
    res.render('find_a_backyard'); // Render find_a_backyard.ejs
});

app.post("/signup_page", async (req, res) => {
    const {
        host_first_name,
        host_last_name,
        host_email,
        host_phone,
        venue_name,
        description,
        venue_address,
        venue_city,
        venue_state,
        venue_zip_code,
        price_per_hour,
        max_guests,
    } = req.body;

    try {
        // Start a transaction to ensure both inserts succeed
        await knex.transaction(async (trx) => {
            // Step 1: Insert data into the Hosts table and retrieve the generated host_id
            const [host] = await trx("hosts")
                .insert({
                    host_first_name: host_first_name.toLowerCase(),
                    host_last_name: host_last_name.toLowerCase(),
                    host_email: host_email.toLowerCase(),
                    host_phone: host_phone,
                    host_address: host_address.toLowerCase(),
                    host_city: host_city.toLowerCase(),
                    host_state: host_state.toLowerCase(),
                    host_zip_code: host_zip_code.toLowerCase(),

                })
                .returning("host_id");

            const hostId = host.host_id; // Extract the integer host_id

            // Step 2: Insert data into the EventRequest table with the retrieved host_id
            await trx("venues").insert({
                host_id: hostId, // Use the extracted host_id
                venue_name: venue_name.toLowerCase(),
                description: description.toLowerCase(),
                venue_address: venue_address.toLowerCase(),
                venue_city: venue_city.toLowerCase(),
                venue_state: venue_state,
                venue_zip_code: venue_zip_code,
                price_per_hour: price_per_hour,
                max_guests: max_guests
            });
        });

        // Redirect back to the '/organize_event' page
        res.redirect('/organize_event');
    } catch (error) {
        console.error("Error organizing event:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
