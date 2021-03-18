document.querySelector('.loginForm').addEventListener('submit', e => {
    e.preventDefault();

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,

        })
    })
        .then(r => r.json()
            .then(data => ({data, r}))).then(({data, r}) => {
        if (r.status === 200) {
            if (data.roleName.includes("ROLE_ADMIN")) {
                window.location.replace("http://localhost:8081/admin");
            } else {
                window.location.replace("http://localhost:8081/user")
            }
            localStorage.setItem("token", data.token)
            localStorage.setItem("roles", data.roles)
            console.log(data.token)
        }else if (r.status === 403){
            alert("Invalid username or password")
        }
    })
})

