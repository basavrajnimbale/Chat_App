const formSubmit = document.getElementById('login-form')
formSubmit.addEventListener('submit', login)

async function login(e) {
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const response = await axios.post('http://localhost:3000/user/login', loginDetails);

        if (response.status === 200) {
            alert(response.data.message);
            console.log(response.data);
        } else {
            throw new Error(response.data.message);
        }
    } catch (err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
}