/**
 * 弾丸が左から右に動くサンプル
 * 
 * - 画面左端から右端へ等速で移動
 * - 画面外まで行ったら、左端に戻る
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



new Vue({
  el: '#app',
  data: function(){
    return {
      bullets: [
        {isRun: true},
      ],
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
  },
  template: `
    <div class="container" @click="setRunState">
      <Bullet v-for="b, i in bullets" :data-num="i" :run="b.isRun" :w="winW" :h="winH" @updatePosition="updatePosition" />
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
     */
    updatePosition(i, s, x, y){
    //   console.log(`${i} ${s} ${x} ${y}`);
    },

    /**
     * アニメーションの設定を切り替え(クリック毎にスタート・ストップに状態を変更)
     */
    setRunState(){
      for(let i = 0, cnt = this.bullets.length; i < cnt; i++){
        this.bullets[i].isRun = !this.bullets[i].isRun;
      }
    }
  }
});