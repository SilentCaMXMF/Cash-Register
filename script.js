const priceInput = document.getElementById("price");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueElement = document.getElementById("change-due");

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const currencyUnits = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100,
};

const checkCashRegister = (price, cash, cid) => {
  const changeDue = cash - price;
  let totalCid = cid.reduce((sum, denom) => sum + denom[1], 0);
  totalCid = parseFloat(totalCid.toFixed(2));

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    updateChangeDue("INSUFFICIENT_FUNDS", []);
    return;
  }

  if (changeDue === 0) {
    updateChangeDue("CLOSED", []);
    return;
  }

  if (totalCid < changeDue) {
    updateChangeDue("INSUFFICIENT_FUNDS", []);
    return;
  }

  const change = [];
  let remainingChange = changeDue;

  cid.reverse().forEach(([unit, amount]) => {
    if (currencyUnits[unit] <= remainingChange && amount > 0) {
      let unitChange = 0;
      while (remainingChange >= currencyUnits[unit] && amount > 0) {
        remainingChange -= currencyUnits[unit];
        remainingChange = parseFloat(remainingChange.toFixed(2));
        amount -= currencyUnits[unit];
        unitChange += currencyUnits[unit];
      }
      change.push([unit, parseFloat(unitChange.toFixed(2))]);
    }
  });

  const totalChange = change.reduce((sum, [, value]) => sum + value, 0);
  if (totalChange < changeDue || remainingChange > 0) {
    updateChangeDue("INSUFFICIENT_FUNDS", []);
    return;
  }

  if (totalChange === totalCid) {
    updateChangeDue("CLOSED", change);
    return;
  }

  updateChangeDue("OPEN", change);
};

const updateChangeDue = (status, change) => {
  if (status === "INSUFFICIENT_FUNDS") {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
  } else if (status === "CLOSED") {
    changeDueElement.textContent = `Status: CLOSED ${change.map(([unit, amount]) => `${unit}: $${amount}`).join(" ")}`;
  } else if (status === "OPEN") {
    changeDueElement.textContent = `Status: OPEN ${change.map(([unit, amount]) => `${unit}: $${amount}`).join(" ")}`;
  } else {
    changeDueElement.textContent = "Unexpected status.";
  }
};

purchaseBtn.addEventListener("click", () => {
  const price = parseFloat(priceInput.value);
  const cash = parseFloat(cashInput.value);

  if (isNaN(price) || isNaN(cash) || price <= 0 || cash <= 0) {
    alert("Please enter valid amounts for price and cash provided");
    return;
  }

  // Case 9 & 10: Exact cash
  if (price === cash) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    return;
  }

  checkCashRegister(price, cash, cid);
});
