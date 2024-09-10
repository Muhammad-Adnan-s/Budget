// Access the Ellements
let btn = document.querySelector('.btn');

let inputs = document.querySelector('.input');

let title = document.querySelector('#title');
let amount = document.querySelector('#amount');

let exbtn = document.querySelector('.exp-btn');
let incbtn = document.querySelector('.inc-btn');
let allbtn = document.querySelector('.all-btn');

let totalexp = document.querySelector('.totalexp');
let totaleinc = document.querySelector('.totalinc');
let totaleb = document.querySelector('.total-b');

let expele = document.querySelector('.exp-element');
let incele = document.querySelector('.inc-element');
let allele = document.querySelector('.all-element');

let entry_list = [];
// ------------------------------------------------
//               Adding the data
// ------------------------------------------------

btn.addEventListener('click', () => {
    if (title.value === '' && amount.value === '') return;
    if (title.classList.contains('exp')) {
        let expens = {
            type: 'exp',
            title: title.value,
            amount: parseFloat(amount.value)
        }
        entry_list.push(expens);

    }
    else if (title.classList.contains('inc')) {
        let expens = {
            type: 'inc',
            title: title.value,
            amount: parseFloat(amount.value)
        }
        entry_list.push(expens);
    }
    clearelements([allele, expele, incele]);
    clearinput();
    save_in_browser();
    updateUi();

})
// Clearing inputs and data
function clearelements(elements) {
    elements.forEach(element => {
        element.innerHTML = '';
    })
}
function clearinput() {
    title.value = '';
    amount.value = '';
}

// -------------------------------------------------------
//               Updating ui 
// -------------------------------------------------------
function updateUi() {
    clearelements([allele, expele, incele]);
    let income = calculatetotal('inc', entry_list);
    let outcom = calculatetotal('exp', entry_list);
    let balance = Math.abs(calculatetotalb(income, outcom));
    let sign = (income >= outcom) ? '$ ' : '-$';
    totaleinc.innerHTML = `<small>$${income}</small>`;
    totalexp.innerHTML = `<small>$${outcom}</small>`;
    totaleb.innerHTML = `<small>${sign}${balance}</small>`;
    entry_list.forEach((entry, index) => {
        if (entry.type == 'exp') {
            showentry(expele, index, entry.type, entry.title, entry.amount);
        }
        else if (entry.type == 'inc') {
            showentry(incele, index, entry.type, entry.title, entry.amount);
        }
        showentry(allele, index, entry.type, entry.title, entry.amount);
    })
    updateConvas(outcom, income);
}
function showentry(list, index, type, title, amount) {
    const entry = `<li id= "${index}" class="${type}">
        <div class="entry">${title}: ${amount}</div>
        <span class="material-symbols-rounded " id="edit" role="button">edit</span>
        <span class="material-symbols-rounded " id="delete" role="button">delete</span>
        </li>`;
    const position = 'afterbegin';
    list.insertAdjacentHTML(position, entry);
}
function calculatetotal(type, list) {
    let sum = 0;
    list.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount;
        }
    })
    return sum;
}

function calculatetotalb(income, outcom) {
    return income - outcom;
}
// -----------------------------------------------------
//                Active and hide elements
// -----------------------------------------------------

exbtn.addEventListener('click', () => {
    show(expele);
    hide([incele, allele]);
    active(exbtn);
    inactive([incbtn, allbtn]);
    inputs.classList.remove('hide');
    title.classList.add('exp');
    amount.classList.add('exp');
    btn.classList.add('exp');
    title.classList.remove('inc');
    amount.classList.remove('inc');
    btn.classList.remove('inc');
})
incbtn.addEventListener('click', () => {
    show(incele);
    hide([expele, allele]);
    active(incbtn);
    inactive([exbtn, allbtn]);
    inputs.classList.remove('hide');
    title.classList.add('inc');
    amount.classList.add('inc');
    btn.classList.add('inc');
    title.classList.remove('exp');
    amount.classList.remove('exp');
    btn.classList.remove('exp');
})
allbtn.addEventListener('click', () => {
    show(allele);
    hide([incele, expele]);
    active(allbtn);
    inactive([incbtn, exbtn]);
    inputs.classList.add('hide');
})
function show(element) {
    element.classList.remove('hide');
}
function hide(elements) {
    elements.forEach(element => {
        element.classList.add('hide');
    });
}
function active(element) {
    element.classList.add('active');
}

function inactive(elements) {
    elements.forEach(element => {
        element.classList.remove('active');
    });
}
//     convas
let main = document.querySelector('.canvas');
console.log(main);
let convas = document.createElement('canvas');
convas.width = 50;
convas.height = 50;
main.appendChild(convas);
let ctx = convas.getContext('2d')
let r = 20;
ctx.lineWidth = 8;
function drawCircle(color, ratio, anticlockwise) {
    ctx.strokeStyle = color;
    ctx.beginPath()
    ctx.arc(convas.width / 2, convas.height / 2, r, 0, ratio * 2 * Math.PI, anticlockwise)
    ctx.stroke()
}
function updateConvas(income, outcom) {
    ctx.clearRect(0, 0, convas.width, convas.height);
    let ratio = income / (income + outcom)
    drawCircle('#ffffff', -ratio, false)
    drawCircle('#ff4842', 1 - ratio, true);
}


// ---------------------------------------------------
//           Deleting the entries
// ---------------------------------------------------

const dlt = 'delete';
const edit = 'edit';
expele.addEventListener('click', deleteoredit)
allele.addEventListener('click', deleteoredit)
incele.addEventListener('click', deleteoredit)

function deleteoredit(event) {
    const targetbtn = event.target;
    const entry = targetbtn.parentNode;
    if (targetbtn.id==dlt) {
        deleteentry(entry);
    }
    else if (targetbtn.id==edit) {
        editentry(entry);
    }
}
function deleteentry(entry){
    entry_list.splice(entry.id,1);
    save_in_browser();
    updateUi();
}
function editentry(entry){
    let Entry=entry_list[entry.id];
    if(Entry.type=='exp'){
        title.value=Entry.title;
        amount.value=Entry.amount
    }
    else if(Entry.type=='inc'){
        title.value=Entry.title;
        amount.value=Entry.amount
    }
    deleteentry(entry);
}
// -------------------------------------------------------
//          Saving data in browser and access it
// -------------------------------------------------------
function save_in_browser(){
    localStorage.setItem('entry_list',JSON.stringify(entry_list));
    console.log('saving');
}
window.onload=function(){
    const stored_data=localStorage.getItem('entry_list');
    console.log('Reterving the data',stored_data);
    if(stored_data){
        entry_list=JSON.parse(stored_data);
        updateUi();
    }
}


