'use strict';
{
  const socket = io();
  socket.on('message', ({ author, date, content }) => addMessage(author, date, content));
  socket.on('newUser', (user) => addMessage('Chat Bot', null, user + ' has joined the converstaion!'));
  socket.on('removeUser', (user) => addMessage('Chat Bot', null, user + ' has left the conversation... :('));

  const opts = {
    loginForm: '#welcome-form',
    messagesSection: '#messages-section',
    messagesList: '#messages-list',
    addMessageForm: '#add-messages-form',
    userNameInput: '#username',
    messageContentInput: '#message-content',
  };

  const loginForm = document.querySelector(opts.loginForm);
  const messagesSection = document.querySelector(opts.messagesSection);
  const messagesList = document.querySelector(opts.messagesList);
  const addMessageForm = document.querySelector(opts.addMessageForm);
  const userNameInput = document.querySelector(opts.userNameInput);
  const messageContentInput = document.querySelector(opts.messageContentInput);
  let userName = '';

  function login(e) {
    e.preventDefault();

    if (!userNameInput.value) {
      alert('Field cannot be empty');
      return;
    } else {
      userName = userNameInput.value;
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
      socket.emit('join', userName);
    }
  }

  function addMessage(author, date, content) {
    const message = document.createElement('li');

    const heading = document.createElement('h3');
    heading.classList.add('message__author');
    if (author === userName) {
      heading.innerHTML = 'You';
    } else {
      heading.innerHTML = author;
    }

    const dateField = document.createElement('div');
    dateField.classList.add('message__date');
    dateField.innerHTML = date;

    const div = document.createElement('div');
    div.classList.add('message__content');
    div.innerHTML = content;

    message.classList.add('message', 'message--received');
    if (author === userName) {
      message.classList.add('message--self');

      const close = document.createElement('div');
      close.classList.add('message__close');
      close.innerHTML = 'X';
      div.appendChild(close);
      close.addEventListener('click', () => message.remove());
    }

    message.appendChild(heading);
    message.appendChild(dateField);
    message.appendChild(div);

    messagesList.appendChild(message);

  }

  function sendMessage(e) {
    e.preventDefault();

    const messageContent = messageContentInput.value;

    const today = new Date();
    const day = (today.getDate()).toString().padStart(2, 0);
    const month = (today.getMonth() + 1).toString().padStart(2, 0);
    const year = today.getFullYear();
    const time = today.getTime() / 1000;
    const minutes = Math.floor((time / 60) % 60).toString().padStart(2, 0);
    const hours = Math.floor((time / 3600) % 24).toString().padStart(2, 0);
    const date = `${day}.${month}.${year} ${hours}:${minutes}`;

    if (!messageContent.length) {
      alert('You can\'t send empty message');
      return;
    } else {
      addMessage(userName, date, messageContent);
      socket.emit('message', { author: userName, date: date, content: messageContent })
      messageContentInput.value = '';
    }
  }

  loginForm.addEventListener('submit', e => {
    login(e);
  });

  addMessageForm.addEventListener('submit', e => {
    sendMessage(e);
  });

}
