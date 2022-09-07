const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const { populate } = require('./models/user');

main().catch(e => console.log(e));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/authDemo');
    console.log('MONGODB CONNECTED')
}

// Views set up
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Body Parser
app.use(express.urlencoded({ extended: true }))
// Session
const sessionConfig = { secret: 'thisisthesecret' }
app.use(session(sessionConfig))

app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login')
    } else {
        res.send('THIS IS A SECRET!!! YOU CANT SEE ME UNLESS YOU ARE LOGGED IN. ')
    }
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hash })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/secret')
})

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const results = await bcrypt.compare(password, user.password);
    // The following code means, if the results come back that the username and pw
    // are in our database, log them in....
    if (results) {
        // here we are saving there user id in Mongo to our session
        req.session.user_id = user._id;
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})






app.listen(PORT, () => {
    console.log(`Now listening on ${PORT}`)
})
