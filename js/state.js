// state.js
let state = {
  isCalculating: false,
  hashCount: 0,
  currentNonce: 0,
  progress: 0,
  result: '',
  expectedAttempts: 0
};

// 更新状态
function updateState(newState) {
  state = { ...state, ...newState };
  return state;
}

// 获取当前状态
function getState() {
  return state;
}

export { updateState, getState };