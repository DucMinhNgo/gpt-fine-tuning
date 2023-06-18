import express, { query } from 'express';
import { openai } from './api.js';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';

const fsPromises = fs.promises;

const convertJsonToJsonl = async (dataArray, name) => {
    for (const dataObject of dataArray) {
        await fsPromises.appendFile( `./file/${name}` , JSON.stringify(dataObject) + "\n");
    }
}

dotenv.config()

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('OK');
})

app.get('/create-completion', async (req, res) => {
  const { query } = req;

  try {
    const response = await openai.createCompletion({
      model: query?.model,
      prompt: query?.prompt,
      max_tokens: 200
    })
    if (response.data) {
      res.send(response.data.choices);
    }
  } catch (err) {
    res.send('Error!');
  }
});

app.get('/get-list-fine-turning', async (req, res) => {
  const { query } = req;

  try {
    const response = await openai.listFineTunes()

    let data = response.data.data;

    if (query?.id && query?.status) {
      return res.send(data.filter((item) => item?.id?.toString() === query?.id?.toString() && item?.status?.toString() === query?.status?.toString()));
    }

    if (query?.id) return res.send(data.filter((item) => item?.id?.toString() === query?.id?.toString()));

    if (query?.status) return res.send(data.filter((item) => item?.status?.toString() === query?.status?.toString()));

    return res.send(data);

  } catch (err) {
    res.send('Error!');
  }
});

app.post('/upload-data', async (req, res) => {
  const { query } = req;

  if (query?.url) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');

    var dataArray = [];
    const urls = query?.url.split(',');

    for (let i = 0; i < urls?.length; i++) {
      const element = urls[0];

      const obj = await (await fetch(element, myHeaders)).json();

      dataArray.push(...obj);
    }

    // if (dataArray?.length <= 0) dataArray.push(...(await (await fetch(query?.url, myHeaders)).json()));

    console.log(dataArray);

    
    await convertJsonToJsonl(dataArray, query?.jsonl_name);
  }

  if (query?.json_file) {
    const data = fs.readFileSync(`./file/${query?.json_file}`, 'utf8');
    const dataArray = JSON.parse(data);

    await convertJsonToJsonl(dataArray, query?.jsonl_name);
  }

  async function upload() {
    try {
      const response = await openai.createFile(
        fs.createReadStream(`./file/${query?.jsonl_name}`),
        'fine-tune'
      );
      res.send(response.data.id);
      fs.writeFileSync('./fileId.js', `export const fileId = "${response.data.id}"`)
    } catch (err) {
      res.send('Error!');
    }
  }
  
  upload()
})

app.post('/create-fine-turning', async (req, res) => {
 const { query } = req; 

  async function createFineTune() {
    try {
      const response = await openai.createFineTune({
        training_file: query?.fileId,
        model: query?.model,
        // model: 'davinci:ft-personal-2023-06-13-16-57-57'
      })
      res.send(response.data);
    } catch (err) {
      res.send('Error!');
    }
  }
  
  createFineTune()
})

app.listen(port, () => {
  console.log(`sever run on port http://localhost${port}`)
})