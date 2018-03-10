(() => {

let status = 0; // 0: 開始前, 1: カウント中, 2: カウント停止
let timer = null; // カウントアップタイマー
let startTime;
let limitTime = {sec: 10, msec: 1}; // リミットタイム(10:001以上になるとアウト)

let startNum = document.querySelector('.countNum');
let startBtn = document.querySelector('.countStartBtn');
let stopBtn = document.querySelector('.countStopBtn');
let resetBtn = document.querySelector('.countResetBtn');

/**
 * ゲームステータスに応じて、ボタンを表示・非表示
 * @param {number} n - ゲームのステータス
 */
function setCountState(n){
  status = n;

  switch(status){
    case 0:
      startBtn.style.display = 'block';
      stopBtn.style.display = 'none';
      resetBtn.style.display = 'none';
      break;

    case 1:
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      resetBtn.style.display = 'none';
      break;

    case 2:
      startBtn.style.display = 'none';
      stopBtn.style.display = 'none';
      resetBtn.style.display = 'block';
      break;
  }
}

function startCount(){
  timer = setTimeout( () => {
    let now = new Date();
    let d = parseInt((now.getTime() - startTime.getTime()) / 1000);
    let min = parseInt((d / 60) % 60);
    let sec = d % 60;
    let msec = now.getTime() - startTime.getTime();

    startNum.children[0].textContent = ('00' + min).slice(-2);
    startNum.children[1].textContent = ('00' + sec).slice(-2);
    startNum.children[2].textContent = ('000' + msec).slice(-3);
    startCount();
  }, 1000/60);
}

function stopCount(){
  clearTimeout(timer);

  // リミット判定
  if( parseInt(startNum.children[1].textContent,10) >= limitTime.sec && parseInt(startNum.children[2].textContent,10) >= limitTime.msec){
    startNum.classList.add('is-over');
  }
}

/**
 * カウントを初期表示
 */
function resetCount(){
  for(let i = 0, len = startNum.children.length; i < len; i++){
    if(i < len - 1){
      // 分・秒
      startNum.children[i].textContent = '00';
    }else{
      // ミリ秒
      startNum.children[i].textContent = '000';
    }
  }
  startNum.classList.remove('is-over');
}
    
// カウントアップ開始
startBtn.addEventListener('click', () => {
  setCountState(1);
  startTime = new Date();
  startCount();
}, false);

// カウントアップ停止
stopBtn.addEventListener('click', () => {
  setCountState(2);
  stopCount();
}, false);

// カウントアップリセット
resetBtn.addEventListener('click', () => {
  setCountState(0);
  resetCount();
}, false);

})();
