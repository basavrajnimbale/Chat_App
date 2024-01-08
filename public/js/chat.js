const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment')

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