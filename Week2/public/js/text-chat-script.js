var user = prompt("Enter your name:");

let textMessage = document.querySelector('#chat_message');
let send = document.getElementById('send');
let messages = document.querySelector('.messages');

send.addEventListener('click', e => {
    if (textMessage.value.length != 0) {
        socket.emit('message', textMessage.value);
        textMessage.value = '';
    }
});

textMessage.addEventListener('keydown', e => {
    if (e.key === 'Enter' && textMessage.value.length != 0) {
        socket.emit('message', textMessage.value);
        textMessage.value = '';
    }
})

socket.on('createMessage', (message, userName) => {
    messages.innerHTML = messages.innerHTML + 
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});