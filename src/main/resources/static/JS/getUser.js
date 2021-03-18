const token = localStorage.getItem('token');
const rolesStore = localStorage.getItem("roles")
function getUser() {
    let out = '';
    let userRoles = '';
    fetch('http://localhost:8080/api/user/', {

        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer_${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then(user => {
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
        })
}

function getAllUsers() {
    let out = '';
    fetch('http://localhost:8080/api/admin/users',{
        headers:{
            'Authorization': `Bearer_${token}`
        }
    })
        .then(response =>
             response.json().then(users => ({users, response})
             )
        .then(({users, response}) => {
            if(response.status === 403 &&  rolesStore !== null){
                window.location.replace("http://localhost:8081/user")
            }else if(response.status === 403 && rolesStore === null) {
                window.location.replace("http://localhost:8081/login")
            }
            users.forEach(user => {
                let userRoles = '';
                for (let i = 0; i < user.roles.length; i++) {
                    userRoles += user.roles[i].name.replace('ROLE_', ' ');
                }
                out += `<tr ><td id="id${user.id}">${user.id}</td>
            <td id="name${user.id}">${user.name}</td>
            <td id="surname${user.id}">${user.surname} </td>
            <td id="age${user.id}">${user.age}</td>
            <td id="username${user.id}">${user.username}</td>
            <td id="userRole${user.id}">${userRoles}</td>
            <td id="${user.id}"> 
                <button type="button" class="btn btn-info" data-toggle="modal" 
                data-target="#edit" id="edit${user.id}" onclick="fillModalEdit(${user.id})"  >
                Edit</button>
            </td>
            <td> 
                <button type="button" class="btn btn-danger" data-toggle="modal" 
                data-target="#delete" id="delete${user.id}" onclick="fillModalDelete(${user.id})">
                Delete</button>
            </td>
            <td></td></tr>`;
            });
            document.getElementById('allUsers').innerHTML = out;
        }))
}
// -----------------------------MODAL EDIT----------------------------------
function fillModalEdit(id) {
    $('#idEdit').val($('#id' + id).text());
    $('#firstNameEdit').val($('#name' + id).text());
    $('#lastNameEdit').val($('#surname' + id).text());
    $('#ageEdit').val($('#age' + id).text());
    $('#emailEdit').val($('#username' + id).text());
    $('#passwordEdit').val("");
}
// -----------------------------MODAL DELETE----------------------------------
function fillModalDelete(id) {
    $('#idDelete').val($('#id' + id).text());
    $('#firstNameDelete').val($('#name' + id).text());
    $('#lastNameDelete').val($('#surname' + id).text());
    $('#ageDelete').val($('#age' + id).text());
    $('#emailDelete').val($('#username' + id).text());
}
// -----------------------------GET ROLES----------------------------------
function getRoles() {
    let opt = '';
    fetch("http://localhost:8080/api/admin/roles", {

        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer_${token}`
        }
    })
        .then(response => {
            return response.json()
        })
        .then(roles => {
            roles.forEach(role => {
                document.getElementById('roleUserEdit')
                opt += `<option value="${role.id}">${role.name}</option>`
            });
            document.getElementById('roleUserEdit').innerHTML = opt;
            document.getElementById('roleUserNew').innerHTML = opt;
        })
}

getRoles();
// -----------------------------DELETE USER----------------------------------
document.getElementById('delete').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('idDelete').value;
    fetch('http://localhost:8080/api/admin/users/' + id, {
        headers: {
            'Authorization': `Bearer_${localStorage.getItem('token')}`
        },
        method: 'DELETE',
    }).then(() => {
        $('#delete').modal('hide');
    }).then(() => getAllUsers());
})
// -----------------------------EDIT USER----------------------------------
document.getElementById('modalEditUser').addEventListener('submit', e => {
    e.preventDefault();
    let array = [];
    $('#roleUserEdit option:selected').each(function () {
        array.push({id: $(this).val(), name: $(this).text(), authority: $(this).text()});
    });
    fetch('http://localhost:8080/api/admin/users', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer_${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: document.getElementById('idEdit').value,
            name: document.getElementById('firstNameEdit').value,
            surname: document.getElementById('lastNameEdit').value,
            age: document.getElementById('ageEdit').value,
            username: document.getElementById('emailEdit').value,
            password: document.getElementById('passwordEdit').value,
            roles: array,
        })
    }).then(() => {
        $('#edit').modal('hide');
    }).then(() => getAllUsers());
})


getAllUsers();
getUser();

// -----------------------------NEW USER----------------------------------
document.querySelector('.newUser').addEventListener('submit', e => {
    e.preventDefault();
    let array = [];
    $('#roleUserNew option:selected').each(function () {
        array.push({id: $(this).val(), name: $(this).text(), authority: $(this).text()});
    });
    fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer_${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('lastName').value,
            surname: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            username: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: array,
        })
    })
        .then(response => response.json())
        .then(() => document.querySelector('.newUser').reset())
        .then(() => getAllUsers());
})
// -----------------------------LOGOUT----------------------------------
function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('roles')
}
