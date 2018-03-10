(() => {

let chatData = [
  // チャットデータを以下のように格納
  // {part: 'me', text: ''},
  // {part: 'other', text: ''}
];

let isEnable = true;

let patterns = [
  {id: 1, text: 'へんじがない ただのしかばねのようだ'},
  {id: 2, text: 'おはようございます ゆうべはおたのしみでしたね'},
  {id: 3, text: 'おお○○よ しんでしまうとはなさけない'},
  {id: 4, text: 'ふっかつのじゅもんがちがいます'},
  {id: 5, text: 'おきのどくですが ぼうけんのしょは きえてしまいました'},
  {id: 6, text: 'いやー さがしましたよ'},
  {id: 7, text: 'なんと このわしが好きと申すか!?'},
  {id: 8, text: 'ふ～ん 仲がいいか……。 まあ よく知らないと そう見えるかもね。'},
  {id: 9, text: 'わーい！　ありがとう！'},
  {id: 10, text: 'ならばわしのおかしたあやまちも わしの人生にとって意味のある事だったのじゃろうか？'},
  {id: 11, text: 'よくぞ でかした！ では みなのもの ひきあげじゃあ！'},
  {id: 12, text: 'トンヌラというのはどうだろうかっ!?'},
  {id: 13, text: 'おろかものめ！ いしとなり えいえんのときを くやむがよい！'},
  {id: 14, text: 'そーれ ハッスル ハッスル'},
  {id: 15, text: 'それ 言いすぎ'},
  {id: 16, text: '遊んでくれてありがとう。つまらなかったわ'},
  {id: 17, text: '世界の半分を○○にやろう'},
  {id: 18, text: 'わしはぴちぴちぎゃるになりたいのう'}
];

let chatBox = document.querySelector('.chat-box');
let chatEnd = document.querySelector('.chat-end');
let textInput = document.querySelector('.chat-input');
let submitBtn = document.querySelector('.chat-btn');


function pushMsg(obj){
  chatData.push({part: obj.part, text: obj.text});
  renderMsg(obj);

  if(obj.part === 'me'){
    let delay = 500 + Math.random() * 1000;

    setTimeout( () => {
      let n = Math.floor(Math.random() * patterns.length);

      pushMsg({
        part: 'other',
        text: patterns[n].text
      });

      isEnable = true;
    }, delay );  
  }
}

function renderMsg(obj){
  let chatContainer = document.createElement('div');
  let chatContent = document.createElement('div');
  let chatText = document.createElement('p');

  chatContainer.classList.add('chat-container');
  chatContainer.setAttribute('data-role', obj.part);
  chatContent.classList.add('chat-content');
  chatText.classList.add('chat-text');

  chatText.textContent = obj.text;
  chatContent.appendChild(chatText);
  chatContainer.appendChild(chatContent);
  chatBox.children[0].appendChild(chatContainer);

  // 画面下端まで行ったらスムーススクロールさせる
  smoothScroll(chatEnd, 300, function(){}, chatBox);
}


submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(!textInput.value || !isEnable) return;
  
  isEnable = false;

  pushMsg({
    part: 'me',
    text: textInput.value
  });

  // インプット要素を初期状態に
  textInput.value = '';
}, false);

})();
