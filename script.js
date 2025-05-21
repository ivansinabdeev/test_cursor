const result = document.getElementById("result");
const buttons = document.querySelectorAll("button");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

let currentNumber = "";
let firstOperand = null;
let operator = null;
let shouldResetScreen = false;
let history = [];

// Загрузка истории из localStorage при запуске
if (localStorage.getItem("calculatorHistory")) {
  history = JSON.parse(localStorage.getItem("calculatorHistory"));
  updateHistoryDisplay();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.value;

    if (isNumber(value)) {
      handleNumber(value);
    } else if (isOperator(value)) {
      handleOperator(value);
    } else if (value === "=") {
      handleEquals();
    } else if (value === ".") {
      handleDecimal();
    } else if (value === "AC") {
      clearAll();
    } else if (value === "DEL") {
      deleteLastChar();
    }
  });
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calculatorHistory");
  updateHistoryDisplay();
});

function isNumber(value) {
  return !isNaN(value) && value !== " ";
}

function isOperator(value) {
  return ["+", "-", "*", "/", "%"].includes(value);
}

function handleNumber(value) {
  if (shouldResetScreen) {
    result.value = "";
    shouldResetScreen = false;
  }
  result.value += value;
}

function handleOperator(value) {
  if (firstOperand === null) {
    firstOperand = parseFloat(result.value);
  } else if (operator) {
    const secondOperand = parseFloat(result.value);
    firstOperand = calculate(firstOperand, operator, secondOperand);
    result.value = firstOperand;
  }
  operator = value;
  shouldResetScreen = true;
}

function handleEquals() {
  if (operator === null || firstOperand === null) return;

  const secondOperand = parseFloat(result.value);
  const calculation = calculate(firstOperand, operator, secondOperand);

  // Создаем запись в истории
  const historyItem = {
    expression: `${firstOperand} ${operator} ${secondOperand}`,
    result: calculation,
  };
  addToHistory(historyItem);

  result.value = calculation;
  firstOperand = null;
  operator = null;
  shouldResetScreen = true;
}

function handleDecimal() {
  if (!result.value.includes(".")) {
    result.value += ".";
  }
}

function clearAll() {
  result.value = "";
  firstOperand = null;
  operator = null;
  shouldResetScreen = false;
}

function deleteLastChar() {
  result.value = result.value.slice(0, -1);
}

function calculate(first, operator, second) {
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      return second !== 0 ? first / second : "Ошибка";
    case "%":
      return first % second;
    default:
      return second;
  }
}

function addToHistory(item) {
  history.unshift(item); // Добавляем новый элемент в начало массива
  if (history.length > 10) {
    // Ограничиваем историю 10 записями
    history.pop();
  }
  localStorage.setItem("calculatorHistory", JSON.stringify(history));
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  historyList.innerHTML = "";
  history.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `${item.expression} = ${item.result}`;
    historyList.appendChild(historyItem);
  });
}
