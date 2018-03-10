/**
 * 弾丸とターゲットの衝突サンプル
 * - 弾丸とターゲットが接触したらターゲット消滅
 */

/**
 * 弾丸コンポーネント
 */
let Bullet = {
  props: ['bullet', 'current', 'x', 'y'],
  data: function(){
    return {
      timer: null,
      speed: 10,
      position: { x: 0, y: 0 },
      size: { w: 20, h: 20 }
    }
  },
  computed: {
    style: function(){
      return {
        top: this.position.y + 'px',
        left: this.position.x + 'px',
        width: this.size.w + 'px',
        height: this.size.h + 'px',
      }
    }
  },
  watch: {
    current: function(){
      let i = parseInt(this.$el.getAttribute('data-index'), 10);
      if(this.current === i){
        this.fire();
      }
    }
  },
  template: `
    <div class="bullet" v-show="bullet.isShow" :style="style"></div>
  `,
  methods: {
    /**
     * 弾丸発火(初期位置設定および表示)
     */
    fire(){
      this.position.x = this.x + 5;
      this.position.y = this.y + 5;
      this.move();
    },

    /**
     * 弾丸の移動(位置更新に伴い親に通知)
     */
    move(){
      this.timer = setTimeout( () => {
        let i = parseInt(this.$el.getAttribute('data-index'), 10);

        this.position.y -= this.speed;
        if(this.position.y + this.size.h <= 0){
          this.position.x = 0;
          this.position.y = 0;
          clearTimeout(this.timer);

          this.$emit('resetState', i, false);
        }else{
          this.$emit('updatePosition', i, this.size.w, this.size.h, this.position.x, this.position.y);

          this.move();
        }
      }, 1000/30);
    }
  }
};



let Player = {
  props: ['bullets'],
  data: function(){
    return {
      position: { x: 0, y: 0 },
      size: { w: 30, h: 30 },
      bulletNum: -1,
    }
  },
  computed: {
    style: function(){
      return {
        top: this.position.y + 'px',
        left: this.position.x + 'px',
        width: this.size.w + 'px',
        height: this.size.h + 'px',
      }
    }
  },
  mounted(){
    this.position.x = window.innerWidth / 2;
    this.position.y = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      this.position.x = e.pageX - this.size.w/2;
      this.position.y = e.pageY - this.size.h/2;
    }, false);

    window.addEventListener('keydown', (e) => {
      // console.log(e.keyCode);
      switch(e.keyCode){
        case 32:
          let current = this.bulletNum + 1;
          if(current >= this.bullets.length){
            current = 0;
          }

          if(!this.bullets[current].isShow){
            this.bulletNum = current;
            this.$emit('setState', this.bulletNum, true);
          }
          break;
      }
    }, false);
  },
  components: {
    Bullet
  },
  template: `
    <div class="player-container">
      <div class="player" :style="style"></div>

      <div class="bullet-container">
        <Bullet v-for="bullet, i in bullets" :data-index="i" :bullet="bullet" :current="bulletNum" :x="position.x" :y="position.y" @resetState="resetState" @updatePosition="updatePosition" />
      </div>
    </div>
  `,
  methods: {
    resetState(i, show){
      this.$emit('setState', i, show);
    },

    /**
     * 弾丸コンポーネントから受け取った情報をゲームコンポーネントに通知
     * @param {number} i - 弾丸のインデックス番号
     * @param {number} w - 弾丸の幅
     * @param {number} h - 弾丸の高さ
     * @param {number} x - 弾丸の位置(x座標)
     * @param {number} y - 弾丸の位置(y座標)
     */
    updatePosition(i, w, h, x, y){
      this.$emit('updatePosition', i, w, h, x, y);
    }
  }
};



/**
 * エネミーコンポーネント
 */
let Enemy = {
  props: ['show', 'index'],
  data: function(){
    return {
      id: 0,
      position: { x: 0, y: 0 },
      size: { w: 30, h: 30 }
    }
  },
  computed: {
    style: function(){
      return {
        width: this.size.w + 'px',
        height: this.size.h + 'px',
        top: this.position.y + 'px',
        left: this.position.x + 'px',
      }
    }
  },
  mounted(){
    this.position.x = 50 + (Math.random() * window.innerWidth - 50);
    this.position.y = Math.random() * window.innerHeight * 0.3;

    this.$emit('setPoistion', this.index, this.size.w, this.size.h, this.position.x, this.position.y)
  },
  template: `
    <div class="enemy" v-show="show" :id="index" :style="style"></div>
  `
};



let Game = {
  data: function(){
    return {
      bullets: [
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false},
        {w: 0, h: 0, x: 0, y: 0, isShow: false}
      ],
      enemies: [
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
        {w: 0, h: 0, x: 0, y: 0, isShow: true},
      ]
    }
  },
  components: {
    Player,
    Enemy
  },
  template: `
    <div>
      <Player :bullets="bullets" @setState="setBulletState" @updatePosition="updateBulletPosition" />
      <Enemy v-for="e, i in enemies" :show="e.isShow" :index="i" @setPoistion="setEnemyPosition" />
    </div>
  `,
  methods: {

    setBulletState(i, show){
      this.bullets[i].isShow = show;
    },

    /**
     * 弾丸 -> プレイヤーから渡された弾丸のサイズ・位置をデータに格納
     * @param {number} i - 弾丸のインデックス番号
     * @param {number} w - 弾丸の幅
     * @param {number} h - 弾丸の高さ
     * @param {number} x - 弾丸の位置(x座標)
     * @param {number} y - 弾丸の位置(y座標)
     */
    updateBulletPosition(i, w, h, x, y){
      this.bullets[i].w = w;
      this.bullets[i].h = h;
      this.bullets[i].x = x;
      this.bullets[i].y = y;
      this.checkBulletCollision();
    },

    setEnemyPosition(i, w, h, x, y){
      this.enemies[i].w = w;
      this.enemies[i].h = h;
      this.enemies[i].x = x;
      this.enemies[i].y = y;
    },

    /**
     * 弾丸とエネミーの衝突判定
     */
    checkBulletCollision(){
      for(let i = 0, icnt = this.bullets.length; i < icnt; i++){
        for(let k = 0, kcnt = this.enemies.length; k < kcnt; k++){

          if(this.enemies[k].isShow && this.bullets[i].isShow){
            // 弾丸・エネミー両方表示されている場合

            if(this.bullets[i].y <= this.enemies[k].y + this.enemies[k].h && this.bullets[i].y > this.enemies[k].y){
              if(this.bullets[i].x < this.enemies[k].x + this.enemies[k].w && this.bullets[i].x + this.bullets[i].w > this.enemies[k].x){
                // 弾丸・エネミーの領域が重なる場合
                this.enemies[k].isShow = false;
                this.bullets[i].isShow = false;
              }
            }  
          }
        }          
      }
    }
  }
};


new Vue({
  el: '#app',
  components: {
    Game
  },
  template: `
    <div class="container">
      <Game />
    </div>   
  `
});