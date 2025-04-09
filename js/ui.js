// ui.js
import { findR } from './mining.js';
import { updateState, getState } from './state.js'; // 引入状态管理模块

let resultElement = document.getElementById("result");
let progressElement = document.getElementById("progress").querySelector('span');

// 更新进度条
function updateProgress(currentNonce, hashCount) {
  const state = getState();
  const progressPercentage = (hashCount / state.expectedAttempts) * 100;
  progressElement.style.width = `${progressPercentage}%`;
  // 更新当前状态显示
  document.getElementById("currentNumber").innerHTML = `
    <span>Current Nonce:</span> <span>${currentNonce}</span><br>
    <span>Hashes Checked:</span> <span>${hashCount}</span><br>
    <span>Progress:</span> <span>${progressPercentage.toFixed(2)}%</span>`;
}

function clearResult() {
    document.getElementById("result").innerHTML = "";
}


// 挖矿结果回调
function onFound(r, hash, hashCount) {
  resultElement.innerHTML = `Found nonce: ${r} with hash: ${hash}. Hash count: ${hashCount}`;
}

// 开始挖矿计算
function startCalculation() {
  const inputText = document.getElementById("inputText").value;
  const difficulty = parseInt(document.getElementById("inputNumber").value);
  const initial_r = parseInt(document.getElementById("initial_r").value);

  if (!inputText || difficulty < 0 || difficulty > 256) {
    resultElement.innerHTML = "Invalid input. Please check your data.";
    return;
  }

  // 更新状态
  updateState({ isCalculating: true, hashCount: 0, currentNonce: 0, expectedAttempts: 2 ** difficulty });

  // 开始挖矿
  findR(inputText, difficulty, initial_r, updateProgress, onFound);
}

// 将需要内联调用的函数挂载到 window 对象上
window.clearResult = clearResult;
window.startCalculation = startCalculation;

export { startCalculation };
