/**
 * 弾丸とターゲットの衝突サンプル
 * 
 * - 弾丸とターゲットが接触したら色が変わる
 */


/**
 * 弾丸コンポーネント
 */
let Bullet = {
  props: ['run', 'w', 'h'],
  data: function(){
    return {
      timer: null,
      isMove: false,
      color: '#888',
      size: 30,
      x: -30,
      y: 0
    }
  },
  mounted(){
    this.y = 30 +(Math.random() * this.h) * 2/3;
    this.speed = 3 + Math.random() * 10;
    // this.setColor();
    this.move();
  },
  watch: {
    run: function(){
      // console.log(this.run);
      if(this.run && !this.isMove){
        this.isMove = true;
        this.move();
      }else if(!this.run){
        this.isMove = false;
        this.stop();
      }
    }
  },
  template: `
    <div class="rect" :style="{backgroundColor: color, top: y + 'px', left: x + 'px', width: size + 'px', height: size + 'px'}"></div>
  `,
  methods: {
    /**
     * 移動
     */
    move(){
      this.timer = setTimeout( () => {
        if(this.x >= this.w){
          // 右端までいったら左端に戻る
          this.x = -this.size;
          this.y = 30 +(Math.random() * this.h) * 2/3;
          // this.size = 10 + Math.random() * 50;
          // this.speed = 3 + Math.random() * 10;
          // this.setColor();
        }else{
          this.x += this.speed;
        }
        this.move();

        // 親コンポーネントに位置情報更新を通知
        this.$emit('updatePosition', parseInt(this.$el.getAttribute('data-num'), 10), this.size, this.x, this.y);
      }, 1000/30);
    },
    /**
     * 移動
     */
    stop(){
      clearTimeout(this.timer);
    },
    /**
     * 弾丸の色変更
     * https://q-az.net/random-color-code/
     */
    setColor(){
      let color = Math.floor(Math.random() * 16777215).toString(16);
      for(count = color.length; count < 6; count++){
        color = '0' + color;
      }
      this.color = '#' + color;
    }
  }
};


/**
 * ターゲットコンポーネント
 */
let Target = {
  props: ['w', 'h'],
  data: function(){
    return {
      size: 60,
      x: 0,
      y: 0
    }
  },
  mounted(){
    this.setPosition();
    this.notice();
  },
  template: `
    <div class="target" :style="{top: y + 'px', left: x + 'px', width: size + 'px', height: size + 'px'}"></div>
  `,
  methods: {
    setPosition(){
      this.x = Math.random() * this.w;
      this.y = 30 +(Math.random() * this.h) * 2/3;
    },
    notice(){
      this.$emit('noticePosition', this.size, this.x, this.y);
    }
  }
};



new Vue({
  el: '#app',
  data: function(){
    return {
      bullets: [
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
      ],

      // ターゲットコンポーネントから送られる情報を以下に格納
      target: {
        size: 0,
        x: 0,
        y: 0
      },

      winW: window.innerWidth,
      winH: window.innerHeight,
    }
  },
  mounted(){
    window.addEventListener('resize', () => {
      this.resize();
    }, false);
  },
  components: {
    Bullet,
    Target
  },

  // テンプレート側は、弾丸がターゲットに接触した際の色付けに
  // 弾丸コンポーネントに対し、':class="b.isHit? 'is-hit': ''"' を追加
  template: `
    <div class="container" @click="setRunState">
      <Bullet v-for="b, i in bullets" :class="b.isHit? 'is-hit': ''" :data-num="i" :run="b.isRun" :w="winW" :h="winH" @updatePosition="updatePosition" />
      <Target :w="winW" :h="winH" @noticePosition="noticePosition" />
    </div>   
  `,
  methods: {
    /**
     * ステージサイズの変更
     */
    resize(){
      this.winW = window.innerWidth;
      this.winH = window.innerHeight;
    },

    /**
     * 弾丸コンポーネントからの位置情報を出力
     * @param {number} i - 弾丸コンポーネントのインデックス番号
     * @param {number} s - 弾丸コンポーネントのサイズ
     * @param {number} x - 弾丸コンポーネントの位置(x座標)
     * @param {number} y - 弾丸コンポーネントの位置(y座標)
     */
    updatePosition(i, s, x, y){
    //   console.log(`${i} ${s} ${x} ${y}`);
      this.checkCollision(i, s, x, y);
    },

    /**
     * 衝突判定(弾丸コンポーネント/ターゲット)
     * @param {number} i - 弾丸コンポーネントのインデックス番号
     * @param {number} s - 弾丸コンポーネントのサイズ
     * @param {number} x - 弾丸コンポーネントの位置(x座標)
     * @param {number} y - 弾丸コンポーネントの位置(y座標)
     */    
    checkCollision(i, s, x, y){
      // 衝突判定を追加
      if(x + s >= this.target.x && x <= this.target.x + this.target.size){
        if(y + s >= this.target.y && y <= this.target.y + this.target.size){
          if(!this.bullets[i].isHit){
            this.bullets[i].isHit = true;
            console.log(`${i} is hit`);
          }
        }else{
          this.bullets[i].isHit = false;          
        }
      }else{
        this.bullets[i].isHit = false;
      }
    },

    /**
     * アニメーションの設定を切り替え(クリック毎にスタート・ストップに状態を変更)
     */
    setRunState(){
      for(let i = 0, cnt = this.bullets.length; i < cnt; i++){
        this.bullets[i].isRun = !this.bullets[i].isRun;
      }
    },

    /**
     * ターゲットコンポーネントの情報をデータに保持
     * @param {number} s - ターゲットのサイズ
     * @param {number} x - ターゲットの位置(x座標)
     * @param {number} y - ターゲットの位置(y座標)
     */
    noticePosition(s, x, y){
      this.target.size = s;
      this.target.x = x;
      this.target.y = y;
    }    
  }
});