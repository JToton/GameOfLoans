// JavaScript for Modal, Kanban, and Custom Expense Functionality

let expenseId = 0; // Unique identifier for each expense card
let totalIncome = 0;
let totalExpenses = 0;

function openIncomeModal() {
  document.getElementById('incomeModal').classList.remove('hidden'); 
}

function saveIncome() {
    const income = parseFloat(document.getElementById('incomeInput').value);
    if (!isNaN(income) && income > 0) {
        totalIncome = income;
        localStorage.setItem('income', income);
        document.getElementById('incomeModal').classList.add('hidden');
        openExpenseModal(); // Open the expense modal
    } else {
        alert("Please enter a valid income amount.");
    }
}

function openExpenseModal() {
    document.getElementById('expenseModal').classList.remove('hidden');
}



function addExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    if (name && !isNaN(amount) && amount > 0 && category) {
        createExpenseCard(name, amount, category);
        // Only add to total expenses if the category is not 'gonzo'
        if (category !== 'gonzo') {
            totalExpenses += amount;
        }
        updateMoneyMeter();  // Recalculate and update the money meter
    } else {
        alert("Please fill in all fields with valid entries.");
    }
}



function createExpenseCard(name, amount, category) {
    console.log(`Creating card for ${name}, Amount: ${amount}, Category: ${category}`);
    const card = document.createElement('div');
    card.innerHTML = `<strong>${name}</strong>: $${amount.toFixed(2)}`;
    card.draggable = true;
    card.id = 'expense-' + expenseId++;
    card.ondragstart = drag;
    card.classList.add('bg-white', 'p-2', 'mb-2', 'rounded', 'shadow', 'cursor-move');
    card.setAttribute('data-category', category);
    card.setAttribute('data-amount', amount);
    document.getElementById(category).appendChild(card);
}



function closeExpenseModal() {
    document.getElementById('expenseModal').classList.add('hidden');
}

function allowDrop(event) {
    event.preventDefault();  // This allows a drop by preventing the default handling of the element
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text/plain");
    var card = document.getElementById(data);
    var dropZone = event.target.closest('.category-section'); // Ensure it's dropping into a category section

    if (!dropZone) {
        console.error("Not a valid drop zone");
        return; // Stop the function if not dropped into a category section
    }

    var newCategory = dropZone.id;
    var oldCategory = card.getAttribute('data-category');
    var amount = parseFloat(card.getAttribute('data-amount'));

    card.setAttribute('data-category', newCategory); // Update the card's category
    dropZone.appendChild(card); // Move the card to the new section

    updateFinancials(oldCategory, newCategory, amount);
}

function updateFinancials(oldCategory, newCategory, amount) {
    if (isNaN(amount)) {
        console.error("Invalid amount:", amount);
        return; // Prevent processing if the amount is not a valid number
    }

    if (oldCategory !== 'gonzo' && newCategory === 'gonzo') {
        totalExpenses -= amount;
    } else if (oldCategory === 'gonzo' && newCategory !== 'gonzo') {
        totalExpenses += amount;
    }

    updateMoneyMeter(); // Always update the money meter after financial changes
}

/*function updateMoneyMeter() {
  const surplus = totalIncome - totalExpenses;
  const moneyMeter = document.getElementById('moneyMeter');
  const debtMeter = document.getElementById('debtMeter');
  const statusText = document.querySelector('.text-center.bg-white.px-2.py-1');

  moneyMeter.style.height = surplus >= 0 ? `${Math.min(surplus / totalIncome * 100, 100)}%` : '0%';
  debtMeter.style.height = surplus < 0 ? `${Math.min(-surplus / totalIncome * 100, 100)}%` : '0%';
  moneyMeter.style.backgroundColor = surplus >= 0 ? 'green' : 'transparent';
  debtMeter.style.backgroundColor = surplus < 0 ? 'red' : 'transparent';
  statusText.textContent = surplus >= 0 ? `Surplus: $${surplus.toFixed(2)} / Debt: $0.00` : `Surplus: $0.00 / Debt: $${(-surplus).toFixed(2)}`;
}
*/

function updateMoneyMeter() {
    const financialBalance = totalIncome - totalExpenses;
    localStorage.setItem('financialStatus', financialBalance);  // Save financial balance to local storage so youtube-api.js can read from it
  
    const moneyMeter = document.getElementById('moneyMeter');
    const debtMeter = document.getElementById('debtMeter');
    const statusText = document.querySelector('.text-center.bg-white.px-2.py-1');
  
    moneyMeter.style.height = financialBalance >= 0 ? `${Math.min(financialBalance / totalIncome * 100, 100)}%` : '0%';
    debtMeter.style.height = financialBalance < 0 ? `${Math.min(-financialBalance / totalIncome * 100, 100)}%` : '0%';
    moneyMeter.style.backgroundColor = financialBalance >= 0 ? 'green' : 'transparent';
    debtMeter.style.backgroundColor = financialBalance < 0 ? 'red' : 'transparent';
    statusText.textContent = financialBalance >= 0 ? `Surplus: $${financialBalance.toFixed(2)} / Debt: $0.00` : `Surplus: $0.00 / Debt: $${(-financialBalance).toFixed(2)}`;
  }
  



function openExpenseModal() {
    document.getElementById('expenseModal').classList.remove('hidden');
}

// Function to handle the opening of the custom expense modal
function openCustomExpenseModal() {
    document.getElementById('customExpenseModal').classList.remove('hidden');
}

// Function to add a custom expense
function addCustomExpense() {
    const customName = document.getElementById('customExpenseName').value;
    const customAmount = parseFloat(document.getElementById('customExpenseAmount').value);
    const customCategory = document.getElementById('customExpenseCategory').value;

    if (customName && !isNaN(customAmount) && customAmount > 0 && customCategory) {
        createExpenseCard(customName, customAmount, customCategory);
        // Only add to total expenses if the category is not 'gonzo'
        if (customCategory !== 'gonzo') {
            totalExpenses += customAmount;
        }
        updateMoneyMeter();  // Recalculate and update the money meter
        closeCustomExpenseModal();  // Optionally close the modal
    } else {
        alert("Please fill in all fields with valid entries for the custom expense.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadMarketData('SPY', 'sp500Graph');   // S&P 500 ETF
    loadMarketData('QQQ', 'nasdaqGraph');  // NASDAQ ETF
    loadMarketData('AAPL', 'aaplGraph');   // Apple
});


async function loadMarketData(ticker, canvasId) {
    const apiKey = 'lJQ5GF4aMI8Y6gTcU7Vrv3jM6TSI3kHa';
    const storageKey = `${ticker}-data`;
    const cachedData = localStorage.getItem(storageKey);

    if (cachedData) {
        const data = JSON.parse(cachedData);
        plotData(data, canvasId);
        console.log(`Using cached data for ${ticker}`);
    } else {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-01/2023-12-31?apiKey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.results) {
                localStorage.setItem(storageKey, JSON.stringify(data));
                plotData(data, canvasId);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    }
}

function plotData(data, canvasId) {
    const prices = data.results.map(res => res.c);
    const labels = data.results.map(res => new Date(res.t).toLocaleDateString());
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${canvasId.replace('Graph', '')} Prices`,
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}
