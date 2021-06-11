const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./schema/schema');
const { nanoid } = require('nanoid')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.send(shortUrls);
})

app.post('/shortUrls', async (req, res) => {
    try {
        const short_id = nanoid(6);
        const old = await ShortUrl.findOne({ full: req.body.fullUrl });
        if (old != null) res.send(old.short);
        else {
            const data = await ShortUrl.create({ full: req.body.fullUrl, short: short_id });
            res.send(data.short);
        }
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl === null) return res.sendStatus(404)
    let link = shortUrl.full;
    if(!link.startsWith('http')) link = "http://" + link;
    
    res.status(301).redirect(link);
});

const LOCAL_DB = 'mongodb://localhost:27017/urlShortener';
const DB = 'mongodb+srv://dbAdmin:dbpassword@cluster0.zwa6j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(DB , {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    app.listen(8000, () => {
        console.log("Server started on port 8000");
    });
})
    .catch((e) => console.log(e));
