import express from 'express';
import { openai } from './api.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = 3000;

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
  async function upload() {
    try {
      const response = await openai.createFile(
        fs.createReadStream('./data_prepared.jsonl'),
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