/* ==========================================
   CASHFLOW TRACKER
   PART 1 - INITIALIZATION
========================================== */

// ---------- DOM ELEMENTS ----------

const expenseForm = document.getElementById("expenseForm");

const salaryInput = document.getElementById("salary");

const expenseName = document.getElementById("expenseName");

const expenseAmount = document.getElementById("expenseAmount");

const categorySelect = document.getElementById("category");

const expenseDate = document.getElementById("expenseDate");

const notes = document.getElementById("notes");

const expenseList = document.getElementById("expenseList");

const errorMessage = document.getElementById("errorMessage");

const salaryDisplay = document.getElementById("salaryDisplay");

const expenseDisplay = document.getElementById("expenseDisplay");

const balanceDisplay = document.getElementById("balanceDisplay");

const savingPercent = document.getElementById("savingPercent");

const budgetPercent = document.getElementById("budgetPercent");

const progressFill = document.getElementById("progressFill");

const budgetStatus = document.getElementById("budgetStatus");

const highestExpense = document.getElementById("highestExpense");

const averageExpense = document.getElementById("averageExpense");

const transactionCount = document.getElementById("transactionCount");

const budgetScore = document.getElementById("budgetScore");

const searchInput = document.getElementById("searchTransaction");

const currencySelect = document.getElementById("currency");

const themeBtn = document.getElementById("themeToggle");

const downloadBtn = document.getElementById("downloadPdf");

const clearBtn = document.getElementById("clearData");

// ---------- DATA ----------

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let salaryValue = Number(localStorage.getItem("salary")) || 0;

let currencySymbol = "₹";

// ---------- CURRENCY ----------

const symbols = {

    INR:"₹",

    USD:"$",

    EUR:"€",

    GBP:"£"

};

// ---------- TODAY'S DATE ----------

const today = new Date();

if(expenseDate){

    expenseDate.value = today.toISOString().split("T")[0];

}

// ---------- DOUGHNUT CHART ----------

const doughnutCtx =
document.getElementById("expenseChart").getContext("2d");

const doughnutChart = new Chart(doughnutCtx,{

    type:"doughnut",

    data:{

        labels:[],

        datasets:[{

            data:[],

            backgroundColor:[

                "#22c55e",

                "#3b82f6",

                "#f59e0b",

                "#ef4444",

                "#8b5cf6",

                "#14b8a6",

                "#eab308",

                "#ec4899"

            ],

            borderWidth:0

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{

                position:"bottom",

                labels:{

                    color:"white"

                }

            }

        }

    }

});

// ---------- BAR CHART ----------

const barCtx =
document.getElementById("barChart").getContext("2d");

const barChart = new Chart(barCtx,{

    type:"bar",

    data:{

        labels:["Income","Expense","Balance"],

        datasets:[{

            label:"Amount",

            data:[0,0,0],

            backgroundColor:[

                "#22c55e",

                "#ef4444",

                "#3b82f6"

            ],

            borderRadius:10

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{

                display:false

            }

        },

        scales:{

            y:{

                beginAtZero:true,

                ticks:{

                    color:"white"

                }

            },

            x:{

                ticks:{

                    color:"white"

                }

            }

        }

    }

});

// ---------- GREETING ----------

function updateGreeting(){

    const hour = new Date().getHours();

    const heading = document.querySelector(".welcome h1");

    if(!heading) return;

    if(hour < 12){

        heading.innerHTML = "Good Morning ☀️";

    }

    else if(hour < 18){

        heading.innerHTML = "Good Afternoon 🌤️";

    }

    else{

        heading.innerHTML = "Good Evening 🌙";

    }

}

updateGreeting();
/* ==========================================
   PART 2
   ADD EXPENSE & UPDATE DASHBOARD
========================================== */

// Add Expense

expenseForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const salary = Number(salaryInput.value);

    const name = expenseName.value.trim();

    const amount = Number(expenseAmount.value);

    const category = categorySelect.value;

    const date = expenseDate.value;

    const note = notes.value.trim();

    errorMessage.textContent = "";

    // Validation

    if (salary <= 0) {

        errorMessage.textContent = "Enter a valid salary.";

        return;

    }

    if (name === "") {

        errorMessage.textContent = "Expense name is required.";

        return;

    }

    if (amount <= 0) {

        errorMessage.textContent = "Enter a valid amount.";

        return;

    }

    // Save salary

    salaryValue = salary;

    // Create expense object

    const expense = {

        id: Date.now(),

        name,

        amount,

        category,

        date,

        note

    };

    // Add to array

    expenses.push(expense);

    // Save

    localStorage.setItem("salary", salaryValue);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Reset form

    expenseName.value = "";

    expenseAmount.value = "";

    notes.value = "";

    categorySelect.selectedIndex = 0;

    expenseDate.value = today.toISOString().split("T")[0];

    // Refresh UI

    updateDashboard();

    renderExpenses();

});

/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateDashboard() {

    let totalExpense = 0;

    expenses.forEach(item => {

        totalExpense += item.amount;

    });

    const balance = salaryValue - totalExpense;

    // Summary Cards

    salaryDisplay.textContent =
        currencySymbol + salaryValue.toLocaleString();

    expenseDisplay.textContent =
        currencySymbol + totalExpense.toLocaleString();

    balanceDisplay.textContent =
        currencySymbol + balance.toLocaleString();

    /* Savings Percentage */

    let saving = 0;

    if (salaryValue > 0) {

        saving = Math.round(

            (balance / salaryValue) * 100

        );

    }

    savingPercent.textContent = saving + "%";

    /* Budget Used */

    let used = 0;

    if (salaryValue > 0) {

        used = Math.round(

            (totalExpense / salaryValue) * 100

        );

    }

    budgetPercent.textContent = used + "%";

    progressFill.style.width = used + "%";

    // Budget Status

    if (used < 60) {

        budgetStatus.textContent = "Healthy ✅";

        budgetStatus.style.color = "#22c55e";

    }

    else if (used < 90) {

        budgetStatus.textContent = "Careful ⚠️";

        budgetStatus.style.color = "#facc15";

    }

    else {

        budgetStatus.textContent = "Overspending ❌";

        budgetStatus.style.color = "#ef4444";

    }

    /* Highest Expense */

    if (expenses.length > 0) {

        const maxExpense = Math.max(

            ...expenses.map(e => e.amount)

        );

        highestExpense.textContent =
            currencySymbol + maxExpense.toLocaleString();

    }

    else {

        highestExpense.textContent =
            currencySymbol + "0";

    }

    /* Average Expense */

    const average =

        expenses.length > 0

            ? Math.round(totalExpense / expenses.length)

            : 0;

    averageExpense.textContent =
        currencySymbol + average.toLocaleString();

    /* Transaction Count */

    transactionCount.textContent = expenses.length;

    /* Budget Score */

    if (used < 50) {

        budgetScore.textContent = "Excellent ⭐";

    }

    else if (used < 75) {

        budgetScore.textContent = "Good 👍";

    }

    else if (used < 90) {

        budgetScore.textContent = "Average 🙂";

    }

    else {

        budgetScore.textContent = "Poor 🚨";

    }

    // Update Charts

    updateCharts();

}
/* ==========================================
   PART 3
   RENDER EXPENSES + DELETE + SEARCH + CHARTS
========================================== */

/* ---------- Render Expenses ---------- */

function renderExpenses(filteredExpenses = expenses) {

    expenseList.innerHTML = "";

    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `
            <div class="transaction">
                <div class="transaction-left">
                    <div class="transaction-icon">
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>No Transactions Found</h4>
                        <p>Add your first expense.</p>
                    </div>
                </div>
            </div>
        `;

        return;
    }

    filteredExpenses.forEach(expense => {

        expenseList.innerHTML += `

        <div class="transaction">

            <div class="transaction-left">

                <div class="transaction-icon">

                    <i class="fa-solid fa-receipt"></i>

                </div>

                <div class="transaction-details">

                    <h4>${expense.name}</h4>

                    <p>

                        ${expense.category} • ${expense.date}

                    </p>

                    <small>${expense.note || ""}</small>

                </div>

            </div>

            <div class="transaction-right">

                <h3>

                    ${currencySymbol}${expense.amount.toLocaleString()}

                </h3>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

        `;

    });

}

/* ---------- Delete Expense ---------- */

function deleteExpense(id) {

    if (!confirm("Delete this expense?")) return;

    expenses = expenses.filter(item => item.id !== id);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();

    updateDashboard();

}

/* ---------- Search ---------- */

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const filtered = expenses.filter(expense =>

        expense.name.toLowerCase().includes(keyword) ||

        expense.category.toLowerCase().includes(keyword) ||

        expense.note.toLowerCase().includes(keyword)

    );

    renderExpenses(filtered);

});

/* ---------- Update Charts ---------- */

function updateCharts() {

    let totalExpense = 0;

    expenses.forEach(item => {

        totalExpense += item.amount;

    });

    const balance = salaryValue - totalExpense;

    /* ---------- Doughnut ---------- */

    const categoryTotals = {};

    expenses.forEach(expense => {

        if (!categoryTotals[expense.category]) {

            categoryTotals[expense.category] = 0;

        }

        categoryTotals[expense.category] += expense.amount;

    });

    doughnutChart.data.labels = Object.keys(categoryTotals);

    doughnutChart.data.datasets[0].data =
        Object.values(categoryTotals);

    doughnutChart.update();

    /* ---------- Bar ---------- */

    barChart.data.datasets[0].data = [

        salaryValue,

        totalExpense,

        balance

    ];

    barChart.update();

}
/* ==========================================
   PART 4
   THEME • CURRENCY • DATE • INITIALIZATION
========================================== */

/* ---------- Theme Toggle ---------- */

const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){

    body.classList.add("light-mode");

    if(themeBtn){
        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
    }

}

if(themeBtn){

themeBtn.addEventListener("click",()=>{

    body.classList.toggle("light-mode");

    if(body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});

}

/* ---------- Currency ---------- */

currencySelect.addEventListener("change",()=>{

    currencySymbol = symbols[currencySelect.value];

    updateDashboard();

    renderExpenses();

});

/* ---------- Today's Date ---------- */

const todayDate =
document.getElementById("todayDate");

if(todayDate){

    const options={

        weekday:"long",

        year:"numeric",

        month:"long",

        day:"numeric"

    };

    todayDate.innerHTML =
    new Date().toLocaleDateString(
        "en-IN",
        options
    );

}

/* ---------- Greeting ---------- */

function updateGreeting(){

    const hour = new Date().getHours();

    const greeting =
    document.querySelector(".welcome h1");

    if(!greeting) return;

    if(hour<12){

        greeting.innerHTML =
        "Good Morning ☀️";

    }

    else if(hour<17){

        greeting.innerHTML =
        "Good Afternoon 🌤️";

    }

    else{

        greeting.innerHTML =
        "Good Evening 🌙";

    }

}

updateGreeting();

/* ---------- Budget Warning ---------- */

function checkBudget(){

    let total=0;

    expenses.forEach(item=>{

        total+=item.amount;

    });

    if(salaryValue===0) return;

    const percent=
    (total/salaryValue)*100;

    if(percent>=90){

        alert("⚠ Warning! You have used more than 90% of your monthly budget.");

    }

}

/* ---------- Refresh Dashboard ---------- */

function refreshDashboard(){

    renderExpenses();

    updateDashboard();

    checkBudget();

}

refreshDashboard();

/* ---------- Auto Save ---------- */

window.addEventListener("beforeunload",()=>{

    localStorage.setItem(

        "expenses",

        JSON.stringify(expenses)

    );

    localStorage.setItem(

        "salary",

        salaryValue

    );

});

/* ---------- Keyboard Shortcut ---------- */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter" && document.activeElement.tagName!=="TEXTAREA"){

        e.preventDefault();

    }

});
/* ==========================================
   PART 5
   PDF • CLEAR DATA • NOTIFICATIONS • STARTUP
========================================== */

/* ---------- PDF Export ---------- */

downloadBtn.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let totalExpense = 0;

    expenses.forEach(item => {
        totalExpense += item.amount;
    });

    const balance = salaryValue - totalExpense;

    doc.setFontSize(20);
    doc.text("CashFlow Tracker Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Salary : ${currencySymbol}${salaryValue}`,20,40);

    doc.text(`Expenses : ${currencySymbol}${totalExpense}`,20,50);

    doc.text(`Balance : ${currencySymbol}${balance}`,20,60);

    doc.text("------------------------------",20,72);

    let y = 85;

    expenses.forEach((item,index)=>{

        doc.text(

            `${index+1}. ${item.name} (${item.category}) - ${currencySymbol}${item.amount}`,

            20,

            y

        );

        y += 10;

        if(y>270){

            doc.addPage();

            y=20;

        }

    });

    doc.save("CashFlow_Report.pdf");

});

/* ---------- Clear Data ---------- */

clearBtn.addEventListener("click",()=>{

    const confirmDelete=confirm(

        "Delete all transactions?"

    );

    if(!confirmDelete) return;

    expenses=[];

    salaryValue=0;

    localStorage.removeItem("expenses");

    localStorage.removeItem("salary");

    salaryInput.value="";

    renderExpenses();

    updateDashboard();

    showToast("All data deleted.");

});

/* ---------- Toast Notification ---------- */

function showToast(message){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);

}

/* ---------- Welcome Message ---------- */

window.addEventListener("load",()=>{

    showToast("Welcome back, Sakshi 👋");

});

/* ---------- Save Success ---------- */

expenseForm.addEventListener("submit",()=>{

    setTimeout(()=>{

        showToast("Expense Added Successfully ✅");

    },300);

});

/* ---------- Statistics ---------- */

function getStatistics(){

    let total=0;

    let highest=0;

    expenses.forEach(item=>{

        total+=item.amount;

        if(item.amount>highest){

            highest=item.amount;

        }

    });

    console.log("Salary :",salaryValue);

    console.log("Expense :",total);

    console.log("Balance :",salaryValue-total);

    console.log("Highest :",highest);

}

/* ---------- Auto Refresh ---------- */

setInterval(()=>{

    getStatistics();

},30000);


/* ---------- Startup ---------- */

renderExpenses();

updateDashboard();

updateCharts();

updateGreeting();

console.log("CashFlow Tracker Loaded Successfully 🚀");
