const {OpenAI} =  require("openai");
var express = require('express')
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors')


const openai = new OpenAI({
    apiKey: dotenv.config().parsed.OPENAI_API_KEY
});

//API ;
const app = express()
const port = 3080

app.use(bodyParser.json());
app.use(cors());

app.post('/',  async (req, res) => {
    const {message} = req.body;
    console.log(message, "message");
    const response =  await openai.chat.completions.create({
        messages: [{ role: "user", content: `${message}` }],
        model: "gpt-3.5-turbo",
        max_tokens: 50,
        temperature: 0.4,
    });
    res.json({
        message: response.choices[0].message.content,
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
