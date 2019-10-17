const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const { Server } = require('ws');

app.use('/client', express.static(path.join(__dirname, 'client')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));


const messages = [`Welcome to Chat ${ new Date()}`];

app.get('/api/messages', (req, res)=> res.send(messages));
app.post('/api/messages', (req, res)=> {
  messages.push(req.body.message);
  res.send(req.body);
  clients.forEach( client => {
    if(client.id !== req.query.id){
      client.send(req.body.message);
    }
  });
});

const port = process.env.PORT || 3000;


const server = app.listen(port, ()=> console.log(`listening on port ${port}`));

const webSocketServer = new Server({ server });

let clients = [];

webSocketServer.on('connection', (client, options)=> {
  const id = options.url.split('=')[1];
  client.id = id;
  clients.push(client);
  client.on('close', ()=> {
    clients = clients.filter(_client => _client !== client);
  });
  console.log(clients.length);
});
