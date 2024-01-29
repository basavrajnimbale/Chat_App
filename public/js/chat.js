const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment')
const dummy = document.getElementById('dummy')
let remainingChat = []
let lastId = localStorage.getItem('lastId')
const form = document.getElementById('createGrpForm');
const usernewForm = document.getElementById('userAddForm')
const chatting = document.querySelector('.dummy');
const leftPnael = document.querySelector('.groupList')
let selectedGroupId;
let selectedUserId;

const socket = io();
socket.on('connect', _ => {
    console.log(`connected with ${socket.id}`)
});
// socket.on('sent-msgs', (sender, msg) => {
//     console.log(sender + ' : ' + msg);
//     dummy.innerHTML += `<div class="col-8 mb-1">${sender} : ${msg}`;
// })

socket.on('sent-msgs', (content) => {
    console.log(content);
    if (content.format === 'image/jpeg') {
        dummy.innerHTML += `<div class="col-8 my-1">${content.username}<div class="mt-1 mb-3"><img src="${content.message}" alt="alt" width="200" height="200" class="rounded" /></div></div>`;
    } else {
        dummy.innerHTML += `<div class="col-8 my-1">${content.username} : ${content.message}`;
    }
});
async function sendMsg(grpId, e) {
    try {
        const message = inputBox.value
        // const { data: { result } }= await axios.post(`/group/newMsg?id=${grpId}`, { message }, { headers: { "Authorization": token } });
        // console.log(data);
        const files = document.getElementById('file').files;
        const formData = new FormData();

        formData.set('file', files[0]);
        formData.set('message', message);
        const headers = {
            headers: {
                "Authorization": token,
                "Content-Type": "multipart/form-data"
            }
        };
        const { data } = await axios.post(`/group/newMsg?id=${grpId}`, formData, headers);
        inputBox.value = '';
        // console.log(response.data);
        // console.log(result)
        // socket.emit('new-msg', result.message, result.groupId, result.userName);
        // dummy.innerHTML += `<div class="col-8 mb-1">You : ${result.message}`;
        document.getElementById('file').value = '';
        console.log(data);
        socket.emit('new-msg', data);
        let HTMLContent = `<div class="col-8 my-1">You : ${data.message}`;
        if (data.format === 'image/jpeg') {
            HTMLContent = `<div class="col-8 my-1">You<div class="mt-1 mb-3"><img src="${data.message}" alt="alt" width="200" height="200" class="rounded" /></div></div>`;
        }
        dummy.innerHTML += HTMLContent;
    }
    catch (err) {
        console.log(err);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
// console.log(parseJwt(token));


async function fetchChats(groupId, event) {
    try {
        selectedGroupId = groupId;
        const response = await axios.get(`/group/grpChats/?id=${groupId}`);

        document.querySelector('.right').classList.remove('d-none');
        document.getElementById('grpName').textContent = event.target.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.id);
        dummy.innerHTML = '';
        let sender = parseJwt(token).name;
        console.log(sender);
        let newMsg = response.data.chats
        newMsg.forEach(chat => {
            console.log(chat.message);
            let user = chat.username;
            // console.log(user);
            // console.log(chat);
            if (chat.username === sender) {
            //     dummy.innerHTML += `<div class="col-8 mb-1">You : ${chat.message}</div>`;                
            // }else {
            //     dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
            // }
            user = 'You';
            }
            let HTMLContent = `<div class="col-8 my-1">${user} : ${chat.message}</div>`;
            if (chat.format === 'image/jpeg') {
                HTMLContent = `<div class='col-8 my-1'>${user}<div class="mt-1 mb-3"><img src="${chat.message}" alt="alt" width="300" height="300" class="img-fluid rounded" /></div></div>`;
            }
            
            console.log(HTMLContent);
            dummy.innerHTML += HTMLContent;
        })

        let remainingChat = JSON.parse(localStorage.getItem('messages')) || []
        let newArray = remainingChat.concat(newMsg)
        if (newArray.length > 100) {
            const startIndex = newArray.length - 100;
            const lastHundredChats = newArray.slice(startIndex);
            newArray = lastHundredChats;
        }
        console.log(newArray[newArray.length - 1].id);
        localStorage.setItem('messages', JSON.stringify(newArray));
        localStorage.setItem('lastId', newArray[newArray.length - 1].id);
        sendbtn.setAttribute('onclick', `sendMsg(${groupId}, event)`);
    }
    catch (err) {
        console.log(err)
    }
}

let interval;

// Start the interval
interval = setInterval(function () {
    fetchChats(lastId);
    console.log(lastId)
}, 1000);

// To stop the interval (clear it)
clearInterval(interval);

let createGrp = document.getElementById('createGrp');
createGrp.onclick = async () => {
    try {
        const { data } = await axios.get('/user/allusers', { headers: { "Authorization": token } });
        console.log(data);
        document.querySelector('.groupList').classList.toggle('d-none');
        document.querySelector('.group').classList.toggle('d-none')
        const userList = document.querySelector('#userList');

        data.forEach((user, index) => {
            userList.innerHTML += `<li class="list-group-item"><div class="form-check">
            <input class="form-check-input" type="checkbox" name="participant" id="${user.name}" value="${user.name}">
            <label class="form-check-label" for="${user.name}">${user.name}</label></div></li>`;
        })
    }
    catch (err) {
        console.log(err);
    }
}

// click on cross button
const cancelBtn = document.getElementById('cancel');
cancelBtn.onclick = (e) => {
    document.querySelector('.groupList').classList.toggle('d-none');
    form.classList.toggle('d-none');
    showGrp();
}

const oldFormbtn = document.getElementById('create');
oldFormbtn.addEventListener('click', oldForm);


// click on create group submit button
async function oldForm(e) {
    try {
        e.preventDefault();
        console.log(e.target);
        // const name = e.target.name.value;
        const name = form.querySelector('#name').value;
        console.log(name);
        const members = [];
        let list = form.querySelectorAll('input[type="checkbox"]');
        console.log(list);
        list.forEach(item => { if (item.checked) members.push(item.value); });
        console.log(members);
        if (!members.length) {
            alert('Please select atleast one member to proceed!');
        }
        else {
            const groupDetails = {
                name, members
            }
            console.log(groupDetails);
            const { data } = await axios.post('/group/members', groupDetails, { headers: { "Authorization": token } });
            console.log(data);
            document.querySelector('.groupList').classList.toggle('d-none');
            form.classList.toggle('d-none');
            showGrp();
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function showGrp() {
    try {
        const response = await axios.get('/group/allGroup', { headers: { "Authorization": token } });
        const groupData = response.data;

        console.log(groupData);

        const ul = document.getElementById('grpList')
        ul.innerHTML = '';

        groupData.forEach(group => {
            socket.emit('join-group', group.id);
            console.log(group.id + ' groupid');
            ul.innerHTML += `<li class='list-group-item' id='${group.name}' onclick='fetchChats(${group.id}, event)'>
                <div class='d-flex'><span class='text-size ms-3 me-4'><i class='bi bi-people'></i></span><h3>${group.name}</h3></div></li>`;
        });
    } catch (error) {
        console.error("Error fetching group data:", error);
    }
}

const threeDotsIcon = document.querySelector('.bi-three-dots-vertical');
threeDotsIcon.addEventListener('click', grpDetails)


async function grpDetails() {
    try {
        const response = await axios.get(`/group/reqGroup/${selectedGroupId}`, { headers: { "Authorization": token } });
        const groupData = response.data;

        console.log(typeof groupData);

        let div = document.getElementById('offcanvasExampleLabel');

        div.innerHTML = '';
        groupData.forEach(group => {
            console.log(group.id + ' groupid');
            div.innerHTML += `<div class='list-group-item' id='${group.name}'>
                <div class='d-flex'><span class='text-size ms-3 me-4'><i class='bi bi-people'></i></span><h3>${group.name}</h3></div></div>`;
        });
        grpUserDetails()
    } catch (error) {
        console.log(error);
    }
}

async function grpUserDetails() {
    try {
        const result = await axios.get(`/group/allUser?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        let userData = result.data.member
        console.log(result);

        let ul = document.querySelector('.offcanvas-ul');
        ul.innerHTML = '';

        userData.forEach(user => {
            selectedUserId = user.id;

            let li = document.createElement('li');
            li.classList.add('offcanvas-li');
            li.innerHTML = `<div class="d-flex justify-content-between align-items-center id="${user.id}">
                                <div>${user.name} - ${user.isAdmin ? 'Admin' : 'Member'}</div>
                                    <div class="btn-group dropstart">
                                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                                            id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        </button>
    
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <li class="dropdown-item" id="${user.id}" onclick="removeUser(${user.id})"> Remove-User </li>
                                            <li class="dropdown-item" id="${user.id}" onclick="addAdmin(${user.id})"> Add-Admin </li>
                                        </ul>
                                    </div>
                            </div>`;
            ul.appendChild(li);
        });
    }
    catch (error) {
        console.log(error);
    }
}

const addUserItem = document.getElementById('addUserButton');
addUserItem.addEventListener('click', () => addUser());

async function addUser() {
    try {
        console.log(selectedGroupId);
        const result = await axios.get(`/user/newUsers?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        console.log(result.data);
        document.querySelector('.newGroupList').classList.toggle('d-none');
        const userList = document.querySelector('#newUserList');
        userList.innerHTML = "";

        result.data.nonGroupMembers.forEach((user, index) => {
            userList.innerHTML += `<li class="list-group-item"><div class="form-check">
            <input class="form-check-input" type="checkbox" name="participant" id="${user.name}" value="${user.name}">
            <label class="form-check-label" for="${user.name}">${user.name}</label></div></li>`;
        })
    }
    catch (err) {
        console.log(err)
    }
}

const addNewUserbtn = document.getElementById('addUser');
addNewUserbtn.addEventListener('click', newFormSubmit);

async function newFormSubmit(e) {
    try {
        e.preventDefault();
        console.log(e.target);
        const newMembers = [];
        let userlist = usernewForm.querySelectorAll('input[type="checkbox"]');
        console.log(userlist);
        userlist.forEach(item => { if (item.checked) newMembers.push(item.value); });
        console.log(newMembers);
        
        const groupDts = {
            members: newMembers
        }

        const { data } = await axios.post(`/group/member?id=${selectedGroupId}`, groupDts, { headers: { "Authorization": token } });
        console.log(data);
        document.querySelector('.newGroupList').classList.toggle('d-none');
        grpUserDetails();
    }
    catch (err) {
        console.log(err);
    }
}

const formCancelBtn = document.getElementById('newCancel');
formCancelBtn.onclick = (e) => {
    document.querySelector('.newGroupList').classList.toggle('d-none');
}

async function removeUser(selectedUserId) {
    try {
        console.log(selectedUserId)
        const { data } = await axios.get(`/user/${selectedUserId}?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        console.log(data);
        grpUserDetails();
    } catch (error) {
        console.log(error);
    }
}

async function addAdmin(selectedUserId) {
    try {
        const result = await axios.get(`/group/${selectedUserId}?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        console.log(result.data);
        grpUserDetails()
    }
    catch (err) {
        console.log(err);
    }
}

document.getElementById('logoutbtn').onclick = () => {
    window.location.href = '../views/login.html';
    localStorage.removeItem('token');
}

window.addEventListener('DOMContentLoaded', async () => {
    showGrp();
    dummy.innerHTML = '';

    if (localStorage.getItem('messages')) {
        remainingChat = localStorage.getItem('messages');
        remainingChat = JSON.parse(remainingChat);

        if (remainingChat.length) {
            remainingChat.forEach(chat => {
                dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
            });

            lastId = remainingChat[remainingChat.length - 1].id;
            console.log(lastId);
            localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
        }
    } else {
        try {
            const response = await axios.get(`/user/chats`);
            remainingChat = response.data;

            if (remainingChat.length > 100) {
                const startIndex = remainingChat.length - 100;
                const lastHundredChats = remainingChat.slice(startIndex);
                remainingChat = lastHundredChats;
            }

            remainingChat.forEach(chat => {
                dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
            });

            localStorage.setItem('messages', JSON.stringify(remainingChat));
            localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }
});


