/**
 * UFOを動かして攻撃から避けきるゲーム
 */


/**
 * 弾丸コンポーネント
 */
let Bullet = {
  props: ['run', 'show', 'winW', 'winH'],
  data: function(){
    return {
      timer: null,
      isMove: false,
      isShow: true,
      w: 0,
      h: 0,
      x: -30,
      y: 0
    }
  },
  mounted(){
    this.y = 30 +(Math.random() * this.winH) * 2/3;
    this.w = 30 + Math.random() * 50;
    this.h = 304/(408/(30 + Math.random() * 50));
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
    },
    show: function(){
      if(!this.show && this.isShow){
        this.isShow = false;
      }
    }
  },
  template: `
    <div class="rect" v-if="isShow" :style="{top: y + 'px', left: x + 'px', width: w + 'px', height: h + 'px'}"></div>
  `,
  methods: {
    /**
     * 移動
     */
    move(){
      this.timer = setTimeout( () => {
        if(this.x >= this.winW){
          // 右端までいったら左端に戻る
          this.x = -this.w;
          this.y = 30 +(Math.random() * this.winH) * 2/3;
          this.w = 30 + Math.random() * 50;
          this.h = 304/(408/(30 + Math.random() * 50));
          this.speed = 3 + Math.random() * 10;
          // this.setColor();
          this.isShow = true;
        }else{
          this.x += this.speed;
        }
        this.move();

        // 親コンポーネントに位置情報更新を通知
        try{
          if(this.isShow){
            this.$emit('updatePosition', parseInt(this.$el.getAttribute('data-num'), 10), this.w, this.h, this.x, this.y);
          }  
        }catch(e){}
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
 * プレイヤーコンポーネント
 */
let Player = {
  props: ['finished', 'winW', 'winH'],
  data: function(){
    return {
      w: 100,
      h: 78,
      x: 0,
      y: 0
    }
  },
  watch: {
    winW: function(){
      this.x = this.winW/2 - this.w/2;
      this.notice();
    }
  },
  mounted(){
    this.setPosition();
    this.notice();

    // window.addEventListener('keydown', (e) => {
    //   switch(e.keyCode){
    //     case 38:
    //       console.log(this.y , this.winH * 0.05);
    //       if(this.y <= 30) return;
    //       this.y -= 5;
    //       break;
    //     case 40:
    //       if(this.y >= this.winH - 60) return;
    //       this.y += 5;
    //       break;
    //   }
    //   this.notice();
    // }, false);
    window.addEventListener('mousemove', (e) => {
      if(this.finished) return;
      if(e.pageY <= 30 || e.pageY >= this.winH - 100) return;
      this.y = e.pageY;
      this.notice();
    }, false);

  },
  template: `
    <div class="player" :style="{top: y + 'px', left: x + 'px', width: w + 'px', height: h + 'px'}">
      <img src="./assets/img/ufo.png" alt="ufo">
    </div>
  `,
  methods: {
    setPosition(){
      this.x = this.winW / 2 - this.w/2;
      this.y = this.winH / 2 - this.h/2;
    },
    notice(){
      this.$emit('noticePosition', this.w, this.h, this.x, this.y);
    }
  }
};

/**
 * ステータスコンポーネント
 */
let Status = {
  props: ['count', 'left'],
  data: function(){
    return {
      timer: null,
    }
  },
  mounted(){
    this.setTimer();
  },
  template: `
    <div class="status">
      <p class="status__count">HIT COUNT: {{ count }}</p>
      <p class="status__timer">TIME: {{ left }}s</p>
    </div>
  `,
  methods: {
    setTimer(){
      this.timer = setTimeout( () => {
        let left = this.left - 1;
        this.$emit('countTimer', left);

        if(left <= 0){
          this.stopTimer();
        }else{
          this.setTimer();
        }
      }, 1000);
    },
    stopTimer(){
      clearTimeout(this.timer);
      this.$emit('endGame');
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
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
        {isHit: false, isRun: true},
      ],

      // プレイヤーコンポーネントから送られる情報を以下に格納
      player: {
        w: 0,
        h: 0,
        x: 0,
        y: 0
      },

      // ゲーム終了
      hasFinished: false,

      // 被弾数
      hitCount: 0,
      // 残り時間
      timeLeft: 30,

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
    Player,
    Status
  },

  // テンプレート側は、弾丸がターゲットに接触した際の色付けに
  // 弾丸コンポーネントに対し、':class="b.isHit? 'is-hit': ''"' を追加
  template: `
    <div class="container" @click="setRunState">
      <Bullet v-for="b, i in bullets" :class="b.isHit? 'is-hit': ''" :show="b.isHit" :data-num="i" :run="b.isRun" :winW="winW" :winH="winH" @updatePosition="updatePosition" />
      <Player :finished="hasFinished" :winW="winW" :winH="winH" @noticePosition="noticePosition" />
      <Status :count="hitCount" :left="timeLeft" @countTimer="countTimer" @endGame="endGame" />
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
     * @param {number} w - 弾丸コンポーネントの幅
     * @param {number} h - 弾丸コンポーネントの高さ
     * @param {number} x - 弾丸コンポーネントの位置(x座標)
     * @param {number} y - 弾丸コンポーネントの位置(y座標)
     */
    updatePosition(i, w, h, x, y){
    //   console.log(`${i} ${s} ${x} ${y}`);
      this.checkCollision(i, w, h, x, y);
    },

    /**
     * 衝突判定(弾丸コンポーネント/ターゲット)
     * @param {number} i - 弾丸コンポーネントのインデックス番号
     * @param {number} s - 弾丸コンポーネントのサイズ
     * @param {number} x - 弾丸コンポーネントの位置(x座標)
     * @param {number} y - 弾丸コンポーネントの位置(y座標)
     */    
    checkCollision(i, w, h, x, y){
      // 衝突判定を追加
      if(x + w >= this.player.x && x <= this.player.x + this.player.w){
        if(y + h >= this.player.y && y <= this.player.y + this.player.h){
          if(!this.bullets[i].isHit){
            this.bullets[i].isHit = true;
            console.log(`${i} is hit`);
            this.hitCount++;
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
        if(!this.hasFinished){
          // ゲーム終了前
          this.bullets[i].isRun = !this.bullets[i].isRun;
        }
      }
    },

    /**
     * ターゲットコンポーネントの情報をデータに保持
     * @param {number} s - ターゲットのサイズ
     * @param {number} x - ターゲットの位置(x座標)
     * @param {number} y - ターゲットの位置(y座標)
     */
    noticePosition(w, h, x, y){
      this.player.w = w;
      this.player.h = h;
      this.player.x = x;
      this.player.y = y;
    },
    
    
    countTimer(time){
      this.timeLeft = time;
    },

    endGame(){
      this.hasFinished = true;
      for(let i = 0, cnt = this.bullets.length; i < cnt; i++){
        // ゲーム終了時には強制停止
        this.bullets[i].isRun = false;
      }
    }
  }
});