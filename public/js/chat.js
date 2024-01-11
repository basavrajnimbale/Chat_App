const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment')
const dummy = document.getElementById('dummy')
let remainingChat = []
let lastId = localStorage.getItem('lastId')

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

window.addEventListener('DOMContentLoaded', async () => {
    dummy.innerHTML = '';
    if (localStorage.getItem('messages')) {
        remainingChat = localStorage.getItem('messages');
        remainingChat = JSON.parse(remainingChat); // Parse stored data

        console.log(typeof remainingChat); // Log the type of remainingChat

        // dummy.innerHTML = `<div class="d-flex justify-content-center mb-2"><button class='btn btn-warning btn-sm'>old messages</button></div>`;

        if (remainingChat.length) {
            remainingChat.forEach(chat => {
                dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
            });
            lastId = remainingChat[remainingChat.length - 1].id;
            localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
        }
        // displayChats(lastId); // Call displayChats function with lastId
    } else {
        const response = await axios.get(`http://localhost:3000/group/chats`);
        remainingChat = response.data
        
        if (remainingChat.length > 5) {
            const startIndex = remainingChat.length - 5;
            const lastFiveChats = remainingChat.slice(startIndex);
            remainingChat = lastFiveChats;
        }

        remainingChat.forEach(chat => {
            dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
        });
        localStorage.setItem('messages', JSON.stringify(remainingChat));
        localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
    }
});

const interval = setInterval( displayChats ,1000)
clearInterval(interval);

async function displayChats() {
    lastId = localStorage.getItem('lastId')
    console.log(lastId)
    const response = await axios.get(`http://localhost:3000/group/chats/?id=${lastId}`);
    let newMsg = response.data
    newMsg.forEach(chat => {
        dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
    });

    let remainingChat = JSON.parse(localStorage.getItem('messages')) || []
    let newArray = remainingChat.concat(newMsg)
    console.log(newArray);
    if (newArray.length > 5) {
        const startIndex = newArray.length - 5;
        const lastFiveChats = newArray.slice(startIndex);
        newArray = lastFiveChats;
    }
    console.log(newArray[newArray.length - 1].id);
    localStorage.setItem('messages', JSON.stringify(newArray));
    localStorage.setItem('lastId', newArray[newArray.length - 1].id);

}


// async function displayChats() {
//     try {


//         dummy.innerHTML = '';

//         chats.forEach(chat => {
//             dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
//         });

//         remainingChat.push(...chats); // Append new chats to the existing chat array

//         if (remainingChat.length > 5) {
//             const startIndex = remainingChat.length - 5;
//             const lastTwoChats = remainingChat.slice(startIndex);
//             remainingChat = lastTwoChats;
//         }

//         localStorage.setItem('messages', JSON.stringify(remainingChat)); // Store all chats
//         localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
//         console.log(chats);
//     } catch (err) {
//         console.log(err);
//     }
// }