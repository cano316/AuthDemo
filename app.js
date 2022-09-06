const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');

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


app.get('/secret', (req, res) => {
    res.send('THIS IS A SECRET!!! YOU CANT SEE ME UNLESS YOU ARE LOGGED IN. ')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hash })
    await user.save();
    res.redirect('/secret')
})








app.listen(PORT, () => {
    console.log(`Now listening on ${PORT}`)
})
