// first I will declare my variables

const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const inflow = document.getElementById('income');
const outflow = document.getElementById('expense');
const balance = document.getElementById('balance');
const list = document.getElementById('list');

// Get transactions from local storage. this needs to be at the top
const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
  );
  
  let transactions =
    localStorage.getItem("transactions") !== null ? localStorageTransactions : [];
  

// add transaction where e is the event
function addTransaction(e){
e.preventDefault();
// e.preventDefault is to prevent the default behaviour of js

// this is to display error message with timeout (withing the p tag so it shows up where the p tag is) if nothing is in value
if (text.value.trim() === "" || amount.value.trim() === ""){
    document.getElementById("error_msg").innerHTML = "<span >Error: Please enter description and amount!</span>";
    setTimeout(
        () => (document.getElementById('error_msg').innerHTML = "")
        5000
    );
    // this next part is everything that makes the app work

    // the transaction is an object with 3 name:value pairs
} else {
    const transaction = {
        // the id declares a function.this funtion generates the buttons in the history list 
        id: generateID(),
        
        text: text.value,
        // must add + before amount to work
        amount: +amount.value,
    };
    
    transactions.push(transaction);

    addTransactionDom(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
}


}

// Generates random number greater than a thousand
function generateID(){
    return Math.floor(Math.random() * 100000000);
}

// transactions history here
function addTransactionDom(transaction){
    // get sign, if amount is less than 0, then its - else its + 
    const sign = transaction.amount < 0 ? "-" : "+";

    const item = document.createElement('li');

    // add style class based on value to li
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    // im taking the above item and adding this innerHTML. the back ticks are from ES6 to create variables
    item.innerHTML = `
    ${transaction.text} ${sign}${Math.abs(transaction.amount)}<button class ="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>`;

    // I will define the removeTransaction function below

    list.appendChild(item);
    // this then adds the item variable from above
}

// update the balance, inflow and outflow
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    // map is looping over the transactions and returning the transaction.amount. With => we don't need to use the return word
  
    const total = amounts.reduce((bal, value) => (bal += value), 0).toFixed(2);
    // reduce accumulates stuff, has two parameter- where(bal) and what(value) ie I want to accumulate the amounts in balance and append each value to that balance
  
    const income = amounts
      .filter((value) => value > 0)
      .reduce((bal, value) => (bal += value), 0)
      .toFixed(2);
  
    const expense =
      amounts
        .filter((value) => value < 0)
        .reduce((bal, value) => (bal += value), 0) * -(1).toFixed(2);
  
    // this gets inner text for inflow and out flow and balance
    balance.innerText = `$${total}`;
    inflow.innerText = `$${income}`;
    outflow.innerText = `$${expense}`;
  }
  
  // Remove transaction by ID, check if the transaction.id coresponds to the right id and remove it on click
  function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
  
    updateLocalStorage();
  
    start();
  }
  
  // Update local storage transactions. here I am setting the transaction and using stringify to serialize the js object to JSON for the local storage to read
  function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
  
  // Starts app
  function start() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
  }
  
  start();
  
  form.addEventListener("submit", addTransaction);
  
