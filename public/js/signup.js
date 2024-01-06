const formSubmit = document.getElementById('signup-form')
formSubmit.addEventListener('submit', signup)

async function signup(e) {
    try{
        e.preventDefault();

        const signupDeatils = {
            name: e.target.name.value,
            email: e.target.email.value,
            phonenumber: e.target.phonenumber.value,
            password: e.target.password.value
        }
        const response = await axios.post('http://localhost:3000/user/signup', signupDeatils)
        console.log(response)
        formSubmit.reset();

    } catch(err){
        document.body.innerHTML += `<div style="color:red;">${err} ></div>`;
    }
}