const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá <strong>${username}</strong> - Você está na sala <strong>${room}</strong>`

socket.emit("create_chat", {
  username,
  room
}, messages => {
  messages.messages.forEach(message => createMessage(message));
});



document.getElementById("message_input").addEventListener("keypress", (event) => {
  if(event.key === 'Enter') {
    const message = event.target.value;

    const data = {
      room,
      message,
      username,
    }

    socket.emit("message", data);

    event.target.value = "";
  }
});

socket.on("message", data => {
  createMessage(data);
});

socket.on("notification_lives", data => {
  console.log(data)
  alert(data.title)
});

function createMessage(data) {
  const messageDiv = document.getElementById("messages");

  messageDiv.innerHTML +=`
  <div class="new_message">
    <label class="form-label">
      <strong>${data.userId}</strong> <span>${data.message} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
    </label>
  </div>
  `;
};





document.getElementById("logout").addEventListener("click", (event) => {
  window.location.href = "index.html";
})

document.getElementById("alertLive").addEventListener("click", (event) => {
  socket.emit("started_live", {
    _id:'6178a2d573df75b4d08ed282',
    title:'live começando',
    url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  });
})