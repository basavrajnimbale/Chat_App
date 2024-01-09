const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment')
const dummy = document.getElementById('dummy')

sendbtn.onclick = async () => {
    try {
        const message = inputBox.value;
        console.log(message);
        const response = await axios.post('http://localhost:3000/user/chat', { message }, { headers: { "Authorization": token } });
        console.log(response);
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', displayChats())

async function displayChats() {
    setInterval(async () => {
        try {
            const response = await axios.get('http://localhost:3000/group/chats');
            // console.log(response);
            dummy.innerHTML = '';
            response.data.forEach(chat => {
                dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}`;
            })
        } catch (err) {
            console.log(err);
        }
    }, 1000);
}