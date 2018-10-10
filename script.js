var Table = document.getElementById("Table");
// buttons
var buAdd = document.getElementById('buAdd');
var buDelRow = document.getElementById('buDelRow');
var buUpdate = document.getElementById('buUpdate')
// divs
var delMsg = document.getElementById('delMsg');
var alert = document.getElementById('alert');
// inputs
var newDepName = document.getElementById('newDepName');
var newDepNotes = document.getElementById('newDepNotes');
var updateDepName = document.getElementById('updateDepName');
var updateDepNotes = document.getElementById('updateDepNotes');

alert.style.display = 'none';

let currentRowIndex = null;
let currentDepName = null;


let { name, notes,
    depid, gender, birthday, salary, yrsofexp, } = obj;
let add = {
    name: name.value,
    notes: notes.value,
    depid: parseInt(depid.value),
    gender: (gender.value == 'male') ? true : false,
    birthday: birthday.value,
    isactive: (radYes.checked) ? true : false,
    salary: parseFloat(salary.value),
    yrsofexp: parseInt(yrsofexp.value),

}

buAdd.onclick = async function (add) {
    const response = await fetch('https://trainingg.herokuapp.com/deps', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(add)

    })
    const st = await response.status;
    const data = await response.json();
    console.log(st);
    console.log(data);

    if (st === 200) {
        alert.style.display = 'block';
        alert.classList.add('alert-success')
        alert.innerHTML = 'department added'
    } else {
        alert.style.display = 'block';
        alert.classList.add('alert-danger')
        alert.innerHTML = 'unable to add department'
    }
    refresh();
    $('#addDepModal').modal('hide');
}






