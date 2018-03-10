
/**
 * フィールドコンポーネント(オセロのマスエリア)
 * - クリックしたマスが未占有のマスである場合、マスの状態変更を親に通知
 */
let Fields = {
  props: ['turn', 'size', 'col', 'row', 'cellState'],
  template: `
    <ul :style="{width: size + 'px'}">
      <li v-for="n, i in cellState" @click="checkField" :data-state="n.state" :style="{width: (size/col) + 'px', height: (size/row) + 'px'}" ref="cells"></li>
    </ul>
  `,
  methods: {
    checkField(e){
      let n = this.$refs.cells.indexOf(e.currentTarget);
      let state = this.cellState[n].state;
      if(state !== 0) return;

      this.changeField(n);
    },
    changeField(n){
      let turn = 1;
      if(!this.turn){ // 相手のターン
        turn = 2;        
      }
      this.$emit('changeCell', n, turn);
    }
  }
};


/**
 * リザルトコンポーネント
 * - どっちが勝ったかを表示
 */
let Result = {
  props: ['remain', 'countPlayer', 'countOpponent'],
  computed: {
    whoIsWin: function(){
      let result;
      if(this.countPlayer > this.countOpponent){
        result = 'WIN';
      }else if(this.countPlayer < this.countOpponent){
        result = 'LOSE';
      }else{
        result = 'DRAW';
      }
      return result;
    }
  },
  template: `
    <div>
      <transition name="fade">
        <div class="modal" v-if="remain == 0">
          <div class="modal__bg"></div>
          <div class="modal__content">
            <p class="modal__result__winner">{{ whoIsWin }}</p>
            <p class="modal__result__retry" @click="retryGame">RETRY</p>
          </div>
        </div>
      </transition>
    </div>
  `,
  methods: {
    retryGame(){
      this.$emit('retry');
    }
  }
};


/**
 * ステータスコンポーネント
 * - プレイヤー・相手の現状コマの数と、現在のターン表示
 */
let Status = {
  props: ['turn', 'countPlayer', 'countOpponent'],
  computed: {
    whoseTurn: function(){
      return this.turn? 'Player': 'Opponent';
    }
  },
  template: `
    <p>
      <span>{{ whoseTurn }}</span>
      <span>Player: {{ countPlayer }}</span>
      <span>Opponent: {{ countOpponent }}</span>
    </p>
  `
};


/**
 * オセロコンポーネント
 * - オセロのゲーム全体を管轄
 */
let Othello = {
  data: function(){
    return {
      // 自身のターンかどうか
      isMyTurn: true,
      // フィールドの縦・横マス数
      fields: {
        containerSize: 400,
        col: 4,
        row: 4
      },
      // オセロのマス状態(0: 未占有, 1: 自マス(白), 2: 相手マス(黒))
      cells: [
        {id: 1, state: 0},
        {id: 2, state: 0},
        {id: 3, state: 0},
        {id: 4, state: 0},
        {id: 5, state: 0},
        {id: 6, state: 0},
        {id: 7, state: 0},
        {id: 8, state: 0},
        {id: 9, state: 0},
        {id: 10, state: 0},
        {id: 11, state: 0},
        {id: 12, state: 0},
        {id: 13, state: 0},
        {id: 14, state: 0},
        {id: 15, state: 0},
        {id: 16, state: 0},
      ]
    }
  },
  computed: {
    result: function(){
      let player = 0, opponent = 0, remain = 0;

      for(let i = 0, cnt = this.cells.length; i < cnt; i++){
        if(this.cells[i].state === 1){
          player++;
        }else if(this.cells[i].state === 2){
          opponent++;
        }else{
          remain++;
        }
      }

      return {
        remain: remain,
        player: player,
        opponent: opponent
      };
    }
  },
  components: {
    Fields,
    Status,
    Result
  },
  template: `
    <div>
      <Fields :turn="isMyTurn" :size="fields.containerSize" :col="fields.col" :row="fields.row" :cellState="cells" @changeCell="calcArea" />
      <Status :turn="isMyTurn" :countPlayer="result.player" :countOpponent="result.opponent" />
      <Result :remain="result.remain" :countPlayer="result.player" :countOpponent="result.opponent" @retry="retryGame" />
    </div>
  `,
  methods: {
    /**
     * マスの切り替え
     * @param {number} n - マスのインデックス番号 
     * @param {number} state - マスのステータス(1: 自マス(白), 2: 相手マス(黒))
     */
    changeArea(n, state){
      this.cells[n].state = state;
    },

    /**
     * マスエリアの計算
     * @param {number} n - マスのインデックス番号 
     * @param {number} state - マスのステータス(1: 自マス(白), 2: 相手マス(黒))
     */
    calcArea(n, state){
      // クリックしたマスを切り替え
      this.changeArea(n, state);

      let c = n % this.fields.col;
      let r = parseInt(n / this.fields.col, 10);
      
      let col = []; // [縦]マス情報
      let row = []; // [縦]マス情報
      let diagonal = [], d = 2; // [斜め]マス情報(右斜め下、左斜め下)

      for(let i = 0; i < d; i++){
        diagonal[i] = [];

        for(let k = 0, cnt = this.fields.col; k < cnt; k++){
          let num;

          switch(i){
            case 0: // 右斜め下
              if(k < c && r - (c - k) >= 0){ // クリックした位置より左
                num = k + this.fields.col * (r - (c - k));
              }else if(k > c && r + (k - c) < this.fields.row){ // クリックした位置より右
                num = k + this.fields.col * (r + (k - c));
              }else if(k === c){ // クリックした位置
                num = k + this.fields.col * r;
              }
              break;

            case 1: // 左斜め下
              if(k < c && r + (c - k) < this.fields.row){ // クリックした位置より左
                num = k + this.fields.col * (r + (c - k));
              }else if(k > c && r - (k - c) >= 0){ // クリックした位置より右
                num = k + this.fields.col * (r - (k - c));
              }else if(k === c){ // クリックした位置
                num = k + this.fields.col * r;
              }
              break;
          }
  
          if(num >= 0){
            diagonal[i].push({index: num, state: this.cells[num].state});  
          }
        }
      }

      // 縦横マス情報の取得
      for(let i = 0, cnt = this.cells.length; i < cnt; i++){
        if(i % this.fields.col === c){
          col.push({index: i, state: this.cells[i].state});
        }
        if(parseInt(i / this.fields.col, 10) === r){
          row.push({index: i, state: this.cells[i].state});
        }
      }

      // console.log(col);
      // console.log(row);
      // console.log(diagonal[0]);
      // console.log(diagonal[1]);
      this.interpose(n, col);
      this.interpose(n, row);
      for(let i = 0; i < d; i++){
        this.interpose(n, diagonal[i]);
      }

      this.changePart();
    },

    interpose(n, arry){    

      let isContinuous = false;
      let block = [];
      let range = [];
      let point;

      // マス囲い込み
      for(let i = 0, cnt = arry.length; i < cnt; i++){
        if(arry[i].state !== 0){
          if(isContinuous){
            // 連なっている場合
            block[block.length - 1].push(arry[i]);
          }else{
            // はじめて占有済みマスについた場合
            block[block.length] = [];
            block[block.length - 1].push(arry[i]);
            isContinuous = true;
          }
          if(arry[i].index === n){
            point = block[block.length - 1].length - 1;
          }
        }else{
          isContinuous = false;
        }
      }
      // console.log(point, block);

      for(let i = 0, icnt = block.length; i < icnt; i++){
        if( block[i].length > 2 ){
          if(point < block[i].length - 1){
            for(let k = point + 1, kcnt = block[i].length; k < kcnt; k++){
              if( block[i][point].state === block[i][k].state ) break;
              range.push(block[i][k]);
              if(k === kcnt - 1 && (block[i][point].state !== block[i][k].state)){
                range = [];
              }
            }
          }

          if(point > 0){
            for(let k = point - 1; k >= 0; k--){
              if( block[i][point].state === block[i][k].state ) break;
              range.push(block[i][k]);
              if(k === 0 && (block[i][point].state !== block[i][k].state)){
                range = [];
              }
            }
          }
        }
      }

      if(range.length > 0){
        for(let i = 0, cnt = range.length; i < cnt; i++){
          this.changeArea(range[i].index, this.isMyTurn? 1: 2);
        }  
      }
    },

    /**
     * ターン変更
     */
    changePart(){
      this.isMyTurn = !this.isMyTurn;
    },


    retryGame(){
      this.isMyTurn = true;
      for(let i = 0, cnt = this.cells.length; i < cnt; i++){
        this.changeArea(i, 0);
      }
    }
  }
};


new Vue({
  el: '#app',
  components: {
    Othello,
  },
  template: `
    <Othello />
  `
});