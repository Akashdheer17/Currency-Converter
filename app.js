const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode.toLowerCase();
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  
  try {
    const URL = `${BASE_URL}/${fromCurr.value}.json`;
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rate");
    
    let data = await response.json();
    let rate = data[fromCurr.value][toCurr.value];
    
    if (!rate) throw new Error("Invalid currency conversion");
    
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value.toUpperCase()} = ${finalAmount} ${toCurr.value.toUpperCase()}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again later.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value.toUpperCase();
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

const swapBtn = document.querySelector("#swap");

swapBtn.addEventListener("click", () => {
  // Swap the selected values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags accordingly
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Update exchange rate after swap
  updateExchangeRate();
});
