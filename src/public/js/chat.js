const socket = io();
const messages = document.getElementById("messages");

socket.on("messages", (data) => {
    let out = ``;
    data.forEach(item => {
        out += `<p class="card-text"><b>${item.user}:</b> <span class="fw-light">${item.message}</span></p>`;
    });
    messages.innerHTML = out;
});

const sendMessage = () => {
    const user = document.getElementById("user");
    const message = document.getElementById("message");
    socket.emit("newMessage", { user: user.value, message: message.value });
    user.value = "";
    message.value = "";
};

const btnSend = document.getElementById("btnSend");
btnSend.onclick = sendMessage;