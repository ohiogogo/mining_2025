// worker.js
importScripts("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");

let stopRequested = false;

self.onmessage = function(e) {
  const data = e.data;

  if (data.command === "start") {
    stopRequested = false;
    const { inputText, difficulty, initial_r } = data;
    const target = BigInt(2) ** BigInt(256 - difficulty);
    let r = initial_r;
    let hashCount = 0;
    const startTime = Date.now();
    let lastUpdateTime = Date.now();

    const blockSize = 5000; // 每次处理的迭代次数

    function processBlock() {
      // 处理一个块中的迭代
      for (let i = 0; i < blockSize && !stopRequested; i++) {
        const hash = CryptoJS.SHA256(inputText + r.toString()).toString(CryptoJS.enc.Hex);
        hashCount++;
        const hashBigInt = BigInt("0x" + hash);

        if (hashBigInt < target) {
          self.postMessage({
            type: "found",
            r: r,
            hash: hash,
            hashCount: hashCount,
            elapsedTime: (Date.now() - startTime) / 1000
          });
          return;
        }

        r++;
      }

      // 每 0.1 秒更新一次进度
      if (Date.now() - lastUpdateTime >= 500) {
        self.postMessage({
          type: "progress",
          currentNonce: r,
          hashCount: hashCount
        });
        lastUpdateTime = Date.now();
      }

      if (!stopRequested) {
        // 使用 setTimeout 让出执行权，使得 onmessage 能处理 stop 命令
        setTimeout(processBlock, 0);
      } else {
        self.postMessage({
          type: "stopped",
          message: "Calculation stopped by user."
        });
      }
    }

    processBlock(); // 开始处理
  }
  else if (data.command === "stop") {
    stopRequested = true;
  }
};
