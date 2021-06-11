const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ShortUrl = require('./schema/schema');
const { nanoid } = require('nanoid')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.send(shortUrls);
})

app.post('/shortUrls', async (req, res) => {
    try {
        const short_id = nanoid(6);
        console.log(req.body);
        console.log(short_id);
        const data = await ShortUrl.create({ full: req.body.fullUrl, short: short_id });
        res.send(data);
        // res.redirect('/')
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl === null) return res.sendStatus(404)

    res.redirect(shortUrl.full)
});

mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    app.listen(8000, () => {
        console.log("Server started on port 8000");
    });
})
    .catch((e) => console.log(e));
