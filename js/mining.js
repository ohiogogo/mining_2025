// mining.js
import { updateState, getState } from './state.js'; // 引入状态管理模块

// SHA256哈希计算
function sha256(message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

// 计算目标值（难度D）
function calculateTarget(difficulty) {
  return BigInt(2) ** BigInt(256 - difficulty);
}

// 挖矿计算
function findR(inputText, difficulty, initial_r, onProgress, onFound) {
  const target = calculateTarget(difficulty);
  let r = initial_r;
  let hashCount = 0;

  // 开始搜索
  while (true) {
    const hash = sha256(inputText + r.toString());
    hashCount++;

    const hashBigInt = BigInt("0x" + hash);
    if (hashBigInt < target) {
      onFound(r, hash, hashCount);
      break;
    }

    // 更新进度
    onProgress(r, hashCount);
    r++;
  }
}

export { findR };