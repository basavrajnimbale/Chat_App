const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment')
const dummy = document.getElementById('dummy')
let remainingChat = []
let lastId = localStorage.getItem('lastId')
const form = document.getElementById('createGrpForm');
console.log(form);
const usernewForm = document.getElementById('userAddForm')
const chatting = document.querySelector('.dummy');
const leftPnael = document.querySelector('.groupList')
let selectedGroupId;
let selectedUserId;

async function sendMsg(grpId) {
    try {
        const message = inputBox.value
        console.log(grpId);
        const response = await axios.post(`http://localhost:3000/group/newMsg?id=${grpId}`, { message }, { headers: { "Authorization": token } });
        inputBox.value = '';
        console.log(response.data);
    }
    catch (err) {
        console.log(err);
    }
}

async function fetchChats(groupId, event) {
    try {
        selectedGroupId = groupId;
        const response = await axios.get(`http://localhost:3000/group/grpChats/?id=${groupId}`);
        console.log(response);
        console.log(response.data);
        // let newMsg = Object.values(response.data);

        document.querySelector('.right').classList.remove('d-none');
        document.getElementById('grpName').textContent = event.target.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.id);
        dummy.innerHTML = '';

        let newMsg = response.data.chats
        console.log(typeof newMsg);
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
        sendbtn.setAttribute('onclick', `sendMsg(${groupId})`);
        threeDotsIcon.setAttribute('onclick', ``)
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

// const interval = setInterval(
//     () => {
//         // lastId = localStorage.getItem('lastId');
//         console.log(lastId + 'hiiiiii');
//         fetchChats(lastId);
//     }, 1000);
// clearInterval(interval);

let createGrp = document.getElementById('createGrp');
createGrp.onclick = async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/user/allusers', { headers: { "Authorization": token } });
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
            const { data } = await axios.post('http://localhost:3000/group/members', groupDetails, { headers: { "Authorization": token } });
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
        const response = await axios.get('http://localhost:3000/group/allGroup', { headers: { "Authorization": token } });
        const groupData = response.data;

        console.log(groupData);

        const ul = document.getElementById('grpList')
        ul.innerHTML = '';

        groupData.forEach(group => {
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

        const response = await axios.get(`http://localhost:3000/group/reqGroup/${selectedGroupId}`, { headers: { "Authorization": token } });
        const groupData = response.data;

        console.log(typeof groupData);

        let div = document.getElementById('offcanvasExampleLabel');

        div.innerHTML = '';
        groupData.forEach(group => {
            console.log(group.id + ' groupid');
            div.innerHTML += `<div class='list-group-item' id='${group.name}'>
                <div class='d-flex'><span class='text-size ms-3 me-4'><i class='bi bi-people'></i></span><h3>${group.name}</h3></div></div>`;
        });

        const result = await axios.get(`http://localhost:3000/group/allUser?id=${selectedGroupId}`, { headers: { "Authorization": token } });
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

    } catch (error) {
        console.log(error);
    }
}

const addUserItem = document.getElementById('addUserButton');
console.log(typeof addUserItem)
addUserItem.addEventListener('click', () => addUser());

async function addUser() {
    try {
        console.log(selectedGroupId);
        const result = await axios.get(`http://localhost:3000/user/newUsers?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        console.log(result.data);
        document.querySelector('.newGroupList').classList.toggle('d-none');
        const userList = document.querySelector('#newUserList');
        userList.innerHTML="";

        result.data.nonGroupMembers.forEach((user, index) => {
            userList.innerHTML += `<li class="list-group-item"><div class="form-check">
            <input class="form-check-input" type="checkbox" name="participant" id="${user.name}" value="${user.name}">
            <label class="form-check-label" for="${user.name}">${user.name}</label></div></li>`;
        })

        



        // const { data } = await axios.get(`http://localhost:3000/group/findGroupId?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        // console.log(data);
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
            members:newMembers 
        }
        
        const { data } = await axios.post(`http://localhost:3000/group/member?id=${selectedGroupId}`, groupDts, { headers: { "Authorization": token } });
        console.log(data);

    }
    catch (err) {
        console.log(err);
    }
}


const formCancelBtn = document.getElementById('newCancel');
formCancelBtn.onclick = (e) => {
    document.querySelector('.newGroupList').classList.toggle('d-none');
    // showGrp();
}

async function removeUser(selectedUserId) {
    try {
        console.log(selectedUserId)
        const { data } = await axios.get(`http://localhost:3000/user/${selectedUserId}?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

async function addAdmin(selectedUserId) {
    try {
        const result = await axios.get(`http://localhost:3000/group/${selectedUserId}?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        console.log(result.data);

        // grpDetails()

        // const result  = await axios.get(`http://localhost:3000/user/newUsers?id=${selectedGroupId}`, { headers: { "Authorization": token } });
        // console.log(result.data);
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
            const response = await axios.get(`http://localhost:3000/user/chats`);
            remainingChat = response.data;

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
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }
});


