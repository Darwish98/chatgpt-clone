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
    const {message, model, temperature, tokens } = req.body;
    console.log(model, temperature, tokens);
    const response =  await openai.chat.completions.create({
        messages: [{ role: "user", content: `${message}` }],
        model: `${model}`,
        max_tokens: Number(tokens),
        temperature: Number(temperature),
    });
    res.json({
        message: response.choices[0].message.content,
    })
});

app.get('/models',  async (req, res) => {
    const list = await openai.models.list();
    console.log(list.data);
    res.json({
        models: list
    });

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
