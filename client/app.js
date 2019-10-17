const getId = ()=> {
  let id = window.localStorage.getItem('id');
  if(!id){
    id = Math.floor(Math.random()*1000);
    window.localStorage.setItem('id', id);
  }
  return id;
};

const displayUserInfo = ()=> {
  const h1 = document.querySelector('h1');
  h1.innerHTML = getId();
};

const displayMessage = (message)=> {
  const ul = document.querySelector('ul');
  ul.innerHTML = `${ul.innerHTML}<li>${ message }</li>`;
};

const loadMessagesFromServer = async()=> {
  const response = await axios.get('/api/messages');
  const messages = response.data;
  messages.forEach( message => displayMessage(message));
}

const sendMessageToServer = async (str)=> {
  const message = `${getId()} | ${ str } | ${ new Date() }`;
  const response = (await axios.post(`/api/messages?id=${getId()}`, { message })).data;
  displayMessage(response.message);
};


const connectInput = ()=> {
  const input = document.querySelector('input');
  input.addEventListener('blur', (ev)=> {
    sendMessageToServer(ev.target.value);
    ev.target.value = '';
  });
};

const setUpWebSocket = ()=> {
  const url = window.document.location.origin.replace('http', 'ws');
  const socket = new WebSocket(`${url}?id=${getId()}`);
  socket.addEventListener('message', (ev)=> displayMessage(ev.data));
};

const setUp = ()=> {
  loadMessagesFromServer();
  displayUserInfo();
  connectInput();
  setUpWebSocket();
};

setUp();
