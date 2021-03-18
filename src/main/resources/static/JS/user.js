function getUser() {
    let out = '';
    let userRoles = '';
    fetch('http://localhost:8080/api/user/', {
        headers: {
            'Authorization': `Bearer_${localStorage.getItem('token')}`
        }
    })
        .then(response =>
             response.json().then(user => ({user, response})
             )

        .then(({user, response}) => {
            if(response.status === 403){
                window.location.replace("http://localhost:8081/login")
            }
            for (let i = 0; i < user.roles.length; i++) {
                userRoles += user.roles[i].name.replace('ROLE_', ' ');
            }
            out = `<td id="id${user.id}"> ${user.id}</td>
            <td id="name${user.id}">${user.name}</td>
            <td id="surname${user.id}">${user.surname} </td>
            <td id="age${user.id}">${user.age}</td>
            <td id="username${user.id}">${user.username}</td>
            <td id="userRole${user.id}">${userRoles}</td>`;
            document.getElementById("oneUser").innerHTML = out;
            $('#headerSpan').text(`${user.username} with roles: ${userRoles}`);
        }))
}
function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('roles')
}
getUser();