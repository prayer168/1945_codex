import Phaser from "phaser";
import "./styles.css";

let WIDTH = Math.max(360, window.innerWidth || 540);
let HEIGHT = Math.max(640, window.innerHeight || 840);
const PLAYER_SPEED = 360;
const SCORE_KEY = "neon1945-score-records";

const LEVELS = [
  {
    name: "Neon Orbit",
    palette: { bg: 0x050816, grid: 0x15d9ff, accent: 0x55f7ff, enemy: 0xff4b7d },
    enemies: ["basic", "dive", "spread"],
    boss: {
      name: "ORBITAL DEFENSE ARK",
      hp: 780,
      tint: 0x35ddff,
      modes: ["lineStorm", "sideLasers", "summon"],
    },
  },
  {
    name: "Plasma Grid",
    palette: { bg: 0x10051e, grid: 0xff3df2, accent: 0xb955ff, enemy: 0xff8a2b },
    enemies: ["side", "tracker", "shield"],
    boss: {
      name: "PLASMA CORE MECH",
      hp: 1040,
      tint: 0xff40df,
      modes: ["spiral", "arcWall", "splitShot"],
    },
  },
  {
    name: "Abyss Citadel",
    palette: { bg: 0x070004, grid: 0xff1838, accent: 0xff3947, enemy: 0xa55cff },
    enemies: ["suicide", "gunship", "sniper"],
    boss: {
      name: "ABYSS MOTHERSHIP",
      hp: 1450,
      tint: 0xff2544,
      modes: ["fullScreen", "weakPoint", "eliteSummon"],
    },
  },
];

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    syncGameSize(this);
    this.makeTextures();
    this.scene.start("MenuScene");
  }

  makeTextures() {
    const make = (key, draw, w = 64, h = 64) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      draw(g, w, h);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    make("player", (g, w, h) => {
      g.fillStyle(0x062f45, 1).fillTriangle(w / 2, 4, 9, h - 10, w - 9, h - 10);
      g.lineStyle(3, 0x9fffff, 1).strokeTriangle(w / 2, 4, 9, h - 10, w - 9, h - 10);
      g.fillStyle(0xffffff, 1).fillTriangle(w / 2, 13, 25, h - 13, 39, h - 13);
      g.lineStyle(2, 0x20e7ff, 0.9).lineBetween(w / 2, 9, w / 2, h - 13);
      g.fillStyle(0x49f4ff, 0.9).fillCircle(w / 2, h - 12, 5);
    }, 64, 72);

    make("bullet", (g, w, h) => {
      g.fillStyle(0xeaffff, 1).fillRoundedRect(12, 2, 8, 24, 4);
      g.lineStyle(3, 0x27e7ff, 0.75).strokeRoundedRect(9, 0, 14, 28, 7);
    }, 32, 32);

    make("laser", (g) => {
      g.fillStyle(0xf9ffff, 1).fillRoundedRect(11, 0, 10, 46, 5);
      g.lineStyle(4, 0x2fefff, 0.9).strokeRoundedRect(7, 0, 18, 46, 9);
    }, 32, 48);

    make("enemyBullet", (g) => {
      g.fillStyle(0xfff0da, 1).fillCircle(16, 16, 5);
      g.lineStyle(3, 0xff326c, 0.95).strokeCircle(16, 16, 9);
    }, 32, 32);

    make("gem", (g) => {
      g.fillStyle(0x95fff5, 1).fillPoints([{ x: 16, y: 2 }, { x: 30, y: 16 }, { x: 16, y: 30 }, { x: 2, y: 16 }], true);
      g.lineStyle(2, 0xffffff, 1).strokePoints([{ x: 16, y: 2 }, { x: 30, y: 16 }, { x: 16, y: 30 }, { x: 2, y: 16 }], true);
    }, 32, 32);

    ["basic", "dive", "spread", "side", "tracker", "shield", "suicide", "gunship", "sniper", "elite"].forEach((type, i) => {
      make(`enemy-${type}`, (g, w, h) => {
        const colors = [0xff4778, 0xff8a2b, 0xc95dff, 0x37f0ff, 0xffdf47, 0x9d74ff, 0xff364a, 0xff643d, 0xff3df2, 0xffffff];
        const c = colors[i];
        g.fillStyle(0x120816, 1).fillTriangle(w / 2, h - 4, 7, 7, w - 7, 7);
        g.lineStyle(type === "gunship" || type === "shield" ? 4 : 3, c, 1).strokeTriangle(w / 2, h - 4, 7, 7, w - 7, 7);
        g.fillStyle(c, 0.9).fillCircle(w / 2, h / 2, type === "gunship" ? 10 : 6);
      }, type === "gunship" ? 76 : 54, type === "gunship" ? 70 : 54);
    });

    make("boss", (g, w, h) => {
      g.fillStyle(0x0d0d18, 1).fillRoundedRect(8, 18, w - 16, h - 34, 14);
      g.lineStyle(5, 0xffffff, 0.95).strokeRoundedRect(8, 18, w - 16, h - 34, 14);
      g.fillStyle(0xffffff, 0.55).fillCircle(w / 2, h / 2, 24);
      g.lineStyle(3, 0xffffff, 0.75).lineBetween(24, h / 2, w - 24, h / 2);
      g.lineBetween(w / 2, 12, w / 2, h - 12);
    }, 180, 128);
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    syncGameSize(this);
    const records = loadScoreRecords();
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x03040c).setOrigin(0);
    addStarfield(this, 0x15d9ff);
    this.add.text(WIDTH / 2, HEIGHT * 0.2, "NEON 1945", hudText(56, "#8ffcff")).setOrigin(0.5).setShadow(0, 0, "#21e7ff", 18);
    this.add.text(WIDTH / 2, HEIGHT * 0.28, "ABYSS RUN", hudText(24, "#ff5cf7")).setOrigin(0.5).setShadow(0, 0, "#ff3df2", 14);
    this.add.text(WIDTH / 2, HEIGHT * 0.44, "方向鍵 / WASD 移動\nSpace 或滑鼠左鍵射擊\n撿取 P/H/B/S/G 強化並突破三關", hudText(20, "#dffcff", "center")).setOrigin(0.5);
    this.add.text(WIDTH / 2, HEIGHT * 0.55, `BEST ${records.best}    LAST ${records.last}`, hudText(18, "#fff2a8", "center")).setOrigin(0.5);
    const startGame = () => {
      playSfx(this, "start");
      this.scene.start("GameScene", { levelIndex: 0, score: 0, power: 1, lives: 3 });
    };
    neonButton(this, WIDTH / 2, HEIGHT * 0.68, "START", startGame);
    neonButton(this, WIDTH / 2, HEIGHT * 0.78, "FULLSCREEN", () => toggleFullscreen(this));
    this.input.keyboard.once("keydown-SPACE", startGame);
    this.scale.on("resize", () => this.scene.restart());
  }
}

class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.dataIn = data;
  }

  create() {
    syncGameSize(this);
    const win = this.dataIn.mode === "win";
    const clear = this.dataIn.mode === "clear";
    const records = saveScoreRecord({
      score: this.dataIn.score || 0,
      stage: clear ? 3 : this.dataIn.stage || this.dataIn.nextLevel || 1,
      result: clear ? "CLEAR" : win ? "STAGE CLEAR" : "GAME OVER",
    });
    playSfx(this, clear ? "final" : win ? "stageClear" : "gameOver");
    this.add.rectangle(0, 0, WIDTH, HEIGHT, clear ? 0x04000a : 0x050816).setOrigin(0);
    addStarfield(this, clear ? 0xff3947 : 0x15d9ff);
    const title = clear ? "FINAL CLEAR" : win ? "LEVEL COMPLETE" : "GAME OVER";
    this.add.text(WIDTH / 2, HEIGHT * 0.25, title, hudText(44, clear ? "#ffd6df" : "#dffcff", "center")).setOrigin(0.5).setShadow(0, 0, clear ? "#ff244a" : "#21e7ff", 18);
    this.add.text(WIDTH / 2, HEIGHT * 0.36, `SCORE ${this.dataIn.score || 0}`, hudText(24, "#fff2a8")).setOrigin(0.5);
    this.add.text(WIDTH / 2, HEIGHT * 0.41, `BEST ${records.best}    LAST ${records.last}`, hudText(17, records.isNewBest ? "#79fff2" : "#dffcff", "center")).setOrigin(0.5);
    if (records.isNewBest) {
      this.add.text(WIDTH / 2, HEIGHT * 0.45, "NEW RECORD", hudText(18, "#ff5cf7", "center")).setOrigin(0.5).setShadow(0, 0, "#ff3df2", 12);
    }
    const recent = records.history.slice(0, 3).map((r, i) => `${i + 1}. ${r.score}  ${r.result}`).join("\n");
    this.add.text(WIDTH / 2, HEIGHT * 0.52, recent, hudText(15, "#bfefff", "center")).setOrigin(0.5);
    const label = clear || !win ? "RESTART" : "NEXT LEVEL";
    neonButton(this, WIDTH / 2, HEIGHT * 0.66, label, () => {
      playSfx(this, "start");
      if (win && !clear) {
        this.scene.start("GameScene", {
          levelIndex: this.dataIn.nextLevel,
          score: this.dataIn.score,
          power: this.dataIn.power,
          lives: this.dataIn.lives,
        });
      } else {
        this.scene.start("GameScene", { levelIndex: 0, score: 0, power: 1, lives: 3 });
      }
    });
    neonButton(this, WIDTH / 2, HEIGHT * 0.77, "MENU", () => {
      playSfx(this, "menu");
      this.scene.start("MenuScene");
    });
    this.scale.on("resize", () => this.scene.restart(this.dataIn));
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.score = data.score ?? 0;
    this.power = data.power ?? 1;
    this.lives = data.lives ?? 3;
  }

  create() {
    syncGameSize(this);
    this.records = loadScoreRecords();
    this.level = LEVELS[this.levelIndex];
    this.isGameOver = false;
    this.bossActive = false;
    this.bossDead = false;
    this.spawnCount = 0;
    this.enemyFireTimer = 0;
    this.lastShot = 0;
    this.pointerDown = false;
    this.shieldUntil = 0;

    this.add.rectangle(0, 0, WIDTH, HEIGHT, this.level.palette.bg).setOrigin(0);
    this.bg = this.add.graphics();
    this.gridOffset = 0;
    this.drawBackground();

    this.playerBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize: 120, runChildUpdate: false });
    this.enemyBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize: 180, runChildUpdate: false });
    this.enemies = this.physics.add.group();
    this.pickups = this.physics.add.group();

    this.player = this.physics.add.image(WIDTH / 2, HEIGHT - 105, "player").setDepth(10);
    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
    this.player.setCollideWorldBounds(true).setCircle(20, 12, 18);
    this.player.invulnUntil = 0;
    this.player.body.setSize(34, 42).setOffset(15, 18);
    this.shield = this.add.circle(this.player.x, this.player.y, 42, 0x52faff, 0.12).setStrokeStyle(2, 0x8fffff, 0.85).setDepth(9).setVisible(false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE");
    this.input.on("pointerdown", () => {
      resumeAudio(this);
      this.pointerDown = true;
    });
    this.input.on("pointerup", () => (this.pointerDown = false));

    this.makeParticles();
    this.createHud();
    this.addWarning(`${this.level.name}`);

    this.spawnEvent = this.time.addEvent({ delay: 780, callback: this.spawnEnemy, callbackScope: this, loop: true });
    this.time.delayedCall(42000, () => this.startBoss());

    this.physics.add.overlap(this.playerBullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.playerBullets, this.enemyBullets, this.hitEnemyBullet, null, this);
    this.physics.add.overlap(this.playerBullets, this.pickups, this.hitPickupWithBullet, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.pickups, this.collectPickup, null, this);

    this.input.keyboard.on("keydown-B", () => this.clearEnemyBullets(true));
    this.input.keyboard.on("keydown-F", () => toggleFullscreen(this));
    this.scale.on("resize", (gameSize) => this.handleResize(gameSize));
  }

  update(time, delta) {
    if (this.isGameOver) return;
    this.gridOffset = (this.gridOffset + delta * 0.18) % 72;
    this.drawBackground();
    this.updatePlayer(time);
    this.updateBullets();
    this.updateEnemies(time, delta);
    this.updatePickups();
    this.updateHud();
    this.shield.setPosition(this.player.x, this.player.y).setVisible(time < this.shieldUntil);

    if (!this.bossActive && this.spawnCount >= 54) this.startBoss();
    if (this.bossActive && this.boss?.active) this.updateBoss(time);
  }

  drawBackground() {
    this.bg.clear();
    const p = this.level.palette;
    this.bg.lineStyle(1, p.grid, 0.18);
    for (let y = -72 + this.gridOffset; y < HEIGHT; y += 72) this.bg.lineBetween(0, y, WIDTH, y + 24);
    for (let x = -120; x < WIDTH + 120; x += 90) this.bg.lineBetween(x, 0, x + 190, HEIGHT);
    this.bg.lineStyle(3, p.accent, 0.34);
    this.bg.lineBetween(80, 0, 145, HEIGHT);
    this.bg.lineBetween(WIDTH - 80, 0, WIDTH - 145, HEIGHT);
    for (let i = 0; i < 42; i++) {
      const y = (i * 137 + this.gridOffset * (1.3 + (i % 3))) % HEIGHT;
      const x = (i * 73) % WIDTH;
      this.bg.fillStyle(i % 2 ? p.accent : 0xffffff, 0.45).fillCircle(x, y, i % 3 === 0 ? 2 : 1);
    }
  }

  makeParticles() {
    this.explosions = this.add.particles(0, 0, "enemyBullet", {
      speed: { min: 50, max: 260 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.95, end: 0 },
      lifespan: 420,
      quantity: 0,
      blendMode: "ADD",
      tint: [0x22eaff, 0xff3668, 0xffe45d, 0xffffff],
    });
  }

  createHud() {
    this.hudBg = this.add.rectangle(WIDTH / 2, 22, WIDTH - 28, 40, 0x061221, 0.58).setStrokeStyle(1, this.level.palette.accent, 0.9).setDepth(50);
    this.hud = this.add.text(22, 10, "", hudText(16, "#dffcff")).setDepth(51);
    this.stageText = this.add.text(WIDTH - 22, 10, "", hudText(16, "#fff2a8", "right")).setOrigin(1, 0).setDepth(51);
    this.bossBarBg = this.add.rectangle(WIDTH / 2, 64, WIDTH - 90, 14, 0x220814, 0.85).setDepth(51).setVisible(false);
    this.bossBar = this.add.rectangle(45, 64, WIDTH - 90, 14, 0xff315d, 1).setOrigin(0, 0.5).setDepth(52).setVisible(false);
    this.bossLabel = this.add.text(WIDTH / 2, 77, "", hudText(13, "#ffd6df", "center")).setOrigin(0.5, 0).setDepth(52).setVisible(false);
  }

  handleResize(gameSize) {
    syncGameSize(this, gameSize);
    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
    this.player?.setCollideWorldBounds(true);
    this.hudBg?.setPosition(WIDTH / 2, 22).setSize(WIDTH - 28, 40);
    this.stageText?.setPosition(WIDTH - 22, 10);
    this.bossBarBg?.setPosition(WIDTH / 2, 64).setSize(WIDTH - 90, 14);
    if (this.bossBar) this.bossBar.setPosition(45, 64);
    this.bossLabel?.setPosition(WIDTH / 2, 77);
  }

  updateHud() {
    this.hud.setText(`LIFE ${this.lives}  POWER Lv.${this.power}  SCORE ${this.score}  BEST ${Math.max(this.records.best, this.score)}`);
    this.stageText.setText(`STAGE ${this.levelIndex + 1}/3`);
    if (this.bossActive && this.boss?.active) {
      const ratio = Phaser.Math.Clamp(this.boss.hp / this.boss.maxHp, 0, 1);
      this.bossBar.width = (WIDTH - 90) * ratio;
      this.bossBar.fillColor = ratio < 0.35 ? 0xffdf47 : 0xff315d;
    }
  }

  updatePlayer(time) {
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;
    const vx = (right ? 1 : 0) - (left ? 1 : 0);
    const vy = (down ? 1 : 0) - (up ? 1 : 0);
    const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(PLAYER_SPEED);
    this.player.setVelocity(v.x || 0, v.y || 0);
    this.player.setAlpha(time < this.player.invulnUntil && Math.floor(time / 90) % 2 ? 0.35 : 1);
    if ((this.keys.SPACE.isDown || this.pointerDown) && time > this.lastShot + Math.max(78, 170 - this.power * 18)) {
      this.firePlayer(time);
    }
  }

  firePlayer(time) {
    this.lastShot = time;
    const shots = [];
    const mainSpeed = this.power >= 4 ? -720 : -620;
    if (this.power === 1) shots.push([0, -6, 0, mainSpeed, "bullet"]);
    if (this.power >= 2) shots.push([-12, -4, 0, mainSpeed, "bullet"], [12, -4, 0, mainSpeed, "bullet"]);
    if (this.power >= 3) shots.push([-22, 2, -120, -570, "bullet"], [22, 2, 120, -570, "bullet"]);
    if (this.power >= 4) shots.push([0, -14, 0, -780, "laser"], [-28, 8, -210, -545, "bullet"], [28, 8, 210, -545, "bullet"]);
    if (this.power >= 5) shots.push([-38, 14, -70, -650, "bullet", true], [38, 14, 70, -650, "bullet", true]);
    shots.forEach(([ox, oy, vx, vy, tex, homing]) => {
      const b = this.playerBullets.get(this.player.x + ox, this.player.y + oy, tex);
      if (!b) return;
      b.setActive(true).setVisible(true).setDepth(8).setBlendMode(Phaser.BlendModes.ADD).setTint(0x83faff);
      b.body.enable = true;
      b.body.setSize(tex === "laser" ? 12 : 10, tex === "laser" ? 44 : 24);
      b.setVelocity(vx, vy);
      b.damage = tex === "laser" ? 18 : 10;
      b.homing = !!homing;
    });
    playSfx(this, this.power >= 4 ? "laser" : "shoot", 0.75 + this.power * 0.05);
  }

  updateBullets() {
    this.playerBullets.children.each((b) => {
      if (!b.active) return;
      if (b.homing) {
        const target = this.closestEnemy(b.x, b.y);
        if (target) this.physics.moveToObject(b, target, 680);
      }
      if (b.y < -60 || b.y > HEIGHT + 80 || b.x < -80 || b.x > WIDTH + 80) this.killSprite(b);
    });
    this.enemyBullets.children.each((b) => {
      if (b.active && (b.y > HEIGHT + 80 || b.y < -80 || b.x < -80 || b.x > WIDTH + 80)) this.killSprite(b);
    });
  }

  spawnEnemy() {
    if (this.bossActive || this.isGameOver) return;
    const pool = this.level.enemies;
    const type = pool[this.spawnCount % pool.length];
    const x = Phaser.Math.Between(50, WIDTH - 50);
    const y = -40;
    this.createEnemy(type, x, y);
    if (this.spawnCount % 7 === 5) this.createEnemy(pool[(this.spawnCount + 1) % pool.length], Phaser.Math.Between(50, WIDTH - 50), -90);
    this.spawnCount++;
  }

  createEnemy(type, x, y) {
    const e = this.enemies.create(x, y, `enemy-${type}`);
    e.type = type;
    e.hp = { basic: 18, dive: 24, spread: 35, side: 28, tracker: 30, shield: 58, suicide: 22, gunship: 95, sniper: 48, elite: 120 }[type] || 25;
    e.score = e.hp * 9;
    e.fireAt = this.time.now + Phaser.Math.Between(700, 1600);
    e.setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
    e.body.setSize(e.width * 0.72, e.height * 0.72);
    if (type === "side") {
      e.setPosition(x < WIDTH / 2 ? -40 : WIDTH + 40, Phaser.Math.Between(120, 440));
      e.setVelocity(x < WIDTH / 2 ? 210 : -210, 80);
    } else if (type === "dive" || type === "suicide") {
      this.physics.moveToObject(e, this.player, type === "suicide" ? 255 : 220);
    } else if (type === "tracker") {
      e.setVelocity(0, 95);
    } else if (type === "gunship") {
      e.setVelocity(Phaser.Math.Between(-45, 45), 72);
    } else if (type === "sniper") {
      e.setVelocity(Phaser.Math.Between(-80, 80), 65);
    } else {
      e.setVelocity(Phaser.Math.Between(-40, 40), type === "spread" || type === "shield" ? 88 : 135);
    }
    return e;
  }

  updateEnemies(time) {
    this.enemies.children.each((e) => {
      if (!e.active) return;
      if (e.type === "tracker") this.physics.moveToObject(e, this.player, 110);
      if (e.x < 28 && e.body.velocity.x < 0) e.setVelocityX(Math.abs(e.body.velocity.x));
      if (e.x > WIDTH - 28 && e.body.velocity.x > 0) e.setVelocityX(-Math.abs(e.body.velocity.x));
      if (e.y > HEIGHT + 90) this.killSprite(e);
      if (time > e.fireAt) {
        this.enemyShoot(e);
        e.fireAt = time + ({ spread: 1400, gunship: 800, sniper: 1300, shield: 1500 }[e.type] || 1900);
      }
    });
  }

  enemyShoot(e) {
    if (!e.active || e.y < 0) return;
    playSfx(this, "enemyShoot", 0.5);
    if (["spread", "gunship"].includes(e.type)) {
      for (let i = -2; i <= 2; i++) this.fireEnemyBullet(e.x, e.y + 18, i * 80, 195 + Math.abs(i) * 22);
    } else if (e.type === "sniper") {
      const a = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
      this.fireEnemyBullet(e.x, e.y + 18, Math.cos(a) * 300, Math.sin(a) * 300);
    } else if (["shield", "tracker", "side"].includes(e.type)) {
      const a = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
      this.fireEnemyBullet(e.x, e.y + 18, Math.cos(a) * 205, Math.sin(a) * 205);
    }
  }

  fireEnemyBullet(x, y, vx, vy, tint = this.level.palette.enemy) {
    const b = this.enemyBullets.get(x, y, "enemyBullet");
    if (!b) return;
    b.setActive(true).setVisible(true).setDepth(6).setTint(tint).setBlendMode(Phaser.BlendModes.ADD);
    b.body.enable = true;
    b.body.setCircle(7, 9, 9);
    b.setVelocity(vx, vy);
  }

  hitEnemy(b, e) {
    if (!b.active || !e.active) return;
    e.hp -= b.damage || 10;
    if (e.hp > 0 && Phaser.Math.Between(1, 4) === 1) playSfx(this, "hit", 0.45);
    b.homing ? this.killSprite(b) : this.killSprite(b);
    e.setTintFill(0xffffff);
    this.time.delayedCall(45, () => e.active && e.clearTint());
    if (e.hp <= 0) this.destroyEnemy(e);
  }

  hitEnemyBullet(b, eb) {
    if (b.damage >= 18 && eb.active) {
      this.killSprite(eb);
      this.score += 2;
    }
  }

  destroyEnemy(e) {
    const x = e.x;
    const y = e.y;
    this.explode(x, y, e.type === "gunship" || e.type === "elite" ? 32 : 18);
    this.score += e.score || 100;
    if (Phaser.Math.Between(1, 100) <= 22) this.dropPickup(x, y);
    this.killSprite(e);
    playSfx(this, e.type === "gunship" || e.type === "elite" ? "bigExplosion" : "explosion");
  }

  dropPickup(x, y, forcedType) {
    const roll = Phaser.Math.Between(1, 100);
    const type = forcedType || (roll <= 45 ? "P" : roll <= 61 ? "H" : roll <= 76 ? "B" : roll <= 88 ? "S" : "G");
    const tex = type === "G" ? "gem" : "gem";
    const p = this.pickups.create(x, y, tex);
    p.pickupType = type;
    p.setDepth(9).setBlendMode(Phaser.BlendModes.ADD);
    p.body.setCircle(13, 3, 3);
    p.setTint({ P: 0x55f7ff, H: 0x44ff7d, B: 0xffef64, S: 0xa76bff, G: 0xff5cf7 }[type]);
    p.setVelocity(Phaser.Math.Between(-25, 25), 118);
    p.label = this.add.text(x, y, type, hudText(15, "#02050a", "center")).setOrigin(0.5).setDepth(10);
  }

  updatePickups() {
    this.pickups.children.each((p) => {
      if (!p.active) return;
      p.label?.setPosition(p.x, p.y - 1);
      if (p.y > HEIGHT + 40) {
        p.label?.destroy();
        this.killSprite(p);
      }
    });
  }

  hitPickupWithBullet(b, p) {
    if (p.pickupType === "B" && b.active) this.killSprite(b);
  }

  collectPickup(player, p) {
    const type = p.pickupType;
    if (type === "P") this.power = Math.min(5, this.power + 1);
    if (type === "H") this.lives = Math.min(6, this.lives + 1);
    if (type === "B") this.clearEnemyBullets(true);
    if (type === "S") this.shieldUntil = this.time.now + 6500;
    if (type === "G") this.score += 650;
    p.label?.destroy();
    this.killSprite(p);
    playSfx(this, type === "P" ? "powerUp" : type === "H" ? "heal" : type === "B" ? "bomb" : type === "S" ? "shield" : "gem");
  }

  hitPlayer(player, threat) {
    if (this.time.now < this.player.invulnUntil || this.time.now < this.shieldUntil) {
      if (threat?.texture?.key === "enemyBullet") this.killSprite(threat);
      return;
    }
    if (threat && threat !== player) {
      if (threat.texture?.key === "enemyBullet") this.killSprite(threat);
      else if (threat.type) this.destroyEnemy(threat);
    }
    this.lives--;
    this.power = Math.max(1, this.power - 1);
    this.player.invulnUntil = this.time.now + 1800;
    this.cameras.main.shake(180, 0.012);
    this.explode(player.x, player.y, 34);
    this.clearEnemyBullets(false);
    playSfx(this, "damage");
    if (this.lives <= 0) this.gameOver();
  }

  clearEnemyBullets(score) {
    this.enemyBullets.children.each((b) => {
      if (b.active) {
        this.explode(b.x, b.y, 5);
        this.killSprite(b);
        if (score) this.score += 4;
      }
    });
    if (score) playSfx(this, "bomb");
  }

  startBoss() {
    if (this.bossActive || this.bossDead) return;
    this.bossActive = true;
    this.spawnEvent?.remove();
    this.enemies.children.each((e) => this.killSprite(e));
    this.clearEnemyBullets(false);
    this.addWarning("WARNING");
    playSfx(this, "warning");
    this.boss = this.physics.add.image(WIDTH / 2, -100, "boss").setDepth(12).setTint(this.level.boss.tint).setBlendMode(Phaser.BlendModes.ADD);
    this.boss.hp = this.level.boss.hp;
    this.boss.maxHp = this.level.boss.hp;
    this.boss.modeIndex = 0;
    this.boss.nextAttack = this.time.now + 1800;
    this.boss.body.setSize(145, 86);
    this.tweens.add({ targets: this.boss, y: 122, duration: 1800, ease: "Sine.easeOut" });
    this.bossBarBg.setVisible(true);
    this.bossBar.setVisible(true);
    this.bossLabel.setText(this.level.boss.name).setVisible(true);
    this.physics.add.overlap(this.playerBullets, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.player, this.boss, this.hitPlayer, null, this);
  }

  updateBoss(time) {
    this.boss.x = WIDTH / 2 + Math.sin(time / 820) * 105;
    const rage = this.boss.hp < this.boss.maxHp * 0.45;
    if (time > this.boss.nextAttack) {
      const mode = this.level.boss.modes[this.boss.modeIndex++ % this.level.boss.modes.length];
      this.bossAttack(mode, rage);
      this.boss.nextAttack = time + (rage ? 900 : 1350);
    }
  }

  bossAttack(mode, rage) {
    const x = this.boss.x;
    const y = this.boss.y + 50;
    if (mode === "lineStorm") {
      for (let i = -3; i <= 3; i++) this.fireEnemyBullet(x + i * 30, y, i * 22, rage ? 300 : 235);
    } else if (mode === "sideLasers") {
      [-90, 90].forEach((ox) => this.fireEnemyBullet(x + ox, y, 0, rage ? 390 : 320, 0xff45ff));
      for (let i = -1; i <= 1; i++) this.fireEnemyBullet(x, y, i * 90, 230);
    } else if (mode === "summon") {
      this.createEnemy("basic", x - 95, y);
      this.createEnemy("dive", x + 95, y);
    } else if (mode === "spiral") {
      for (let i = 0; i < (rage ? 18 : 12); i++) {
        const a = i * (Math.PI * 2 / (rage ? 18 : 12)) + this.time.now / 400;
        this.fireEnemyBullet(x, y, Math.cos(a) * 190, Math.sin(a) * 190, 0xff3df2);
      }
    } else if (mode === "arcWall") {
      for (let i = 0; i < 8; i++) this.fireEnemyBullet(55 + i * 62, y, Math.sin(i) * 70, rage ? 250 : 205, 0xb955ff);
    } else if (mode === "splitShot") {
      for (let i = -2; i <= 2; i++) this.fireEnemyBullet(x, y, i * 70, 210, 0xff8a2b);
      this.time.delayedCall(430, () => {
        for (let i = -4; i <= 4; i++) this.fireEnemyBullet(x + i * 18, y + 100, i * 42, 220, 0xff8a2b);
      });
    } else if (mode === "fullScreen") {
      for (let i = 0; i < 15; i++) this.fireEnemyBullet(25 + i * 35, y, (i % 2 ? 42 : -42), rage ? 280 : 230, 0xff244a);
    } else if (mode === "weakPoint") {
      this.boss.setTintFill(0xffffff);
      this.time.delayedCall(240, () => this.boss?.active && this.boss.setTint(this.level.boss.tint));
      for (let i = -4; i <= 4; i++) this.fireEnemyBullet(x, y, i * 55, 250, 0xffdf47);
    } else if (mode === "eliteSummon") {
      this.createEnemy("elite", x - 115, y);
      this.createEnemy("sniper", x + 115, y);
      if (rage) this.createEnemy("suicide", WIDTH / 2, y);
    }
  }

  hitBoss(b, boss) {
    if (!b.active || !boss.active) return;
    boss.hp -= b.damage || 10;
    if (Phaser.Math.Between(1, 5) === 1) playSfx(this, "bossHit", 0.5);
    this.killSprite(b);
    if (boss.hp <= boss.maxHp * 0.5 && !boss.dropped) {
      boss.dropped = true;
      this.dropPickup(boss.x, boss.y + 45, "P");
      this.dropPickup(boss.x - 40, boss.y + 45, "S");
    }
    if (boss.hp <= 0) this.defeatBoss();
  }

  defeatBoss() {
    if (this.bossDead) return;
    this.bossDead = true;
    this.score += 5000 + this.levelIndex * 2500;
    this.explode(this.boss.x, this.boss.y, 90);
    this.killSprite(this.boss);
    this.clearEnemyBullets(true);
    this.cameras.main.flash(550, 255, 255, 255);
    playSfx(this, "bossDown");
    this.time.delayedCall(1200, () => {
      if (this.levelIndex >= LEVELS.length - 1) {
        this.scene.start("ResultScene", { mode: "clear", score: this.score });
      } else {
        this.scene.start("ResultScene", {
          mode: "win",
          score: this.score,
          power: this.power,
          lives: this.lives,
          stage: this.levelIndex + 1,
          nextLevel: this.levelIndex + 1,
        });
      }
    });
  }

  addWarning(text) {
    const t = this.add.text(WIDTH / 2, HEIGHT / 2, text, hudText(text === "WARNING" ? 42 : 32, text === "WARNING" ? "#ff3864" : "#dffcff", "center"))
      .setOrigin(0.5)
      .setDepth(80)
      .setShadow(0, 0, text === "WARNING" ? "#ff3864" : "#21e7ff", 18);
    this.tweens.add({ targets: t, alpha: 0, scale: 1.18, duration: 1350, ease: "Sine.easeIn", onComplete: () => t.destroy() });
  }

  explode(x, y, quantity = 20) {
    this.explosions.explode(quantity, x, y);
    const flash = this.add.circle(x, y, 12 + quantity * 0.45, 0xffffff, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(20);
    this.tweens.add({ targets: flash, scale: 1.9, alpha: 0, duration: 180, onComplete: () => flash.destroy() });
  }

  closestEnemy(x, y) {
    let best = null;
    let bestD = Infinity;
    [...this.enemies.getChildren(), this.boss].forEach((e) => {
      if (!e?.active) return;
      const d = Phaser.Math.Distance.Squared(x, y, e.x, e.y);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    });
    return best;
  }

  killSprite(s) {
    if (!s) return;
    s.setActive(false).setVisible(false);
    if (s.body) {
      s.body.stop();
      s.body.enable = false;
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.player.setVisible(false).setActive(false);
    this.time.delayedCall(900, () => this.scene.start("ResultScene", { mode: "gameover", score: this.score, stage: this.levelIndex + 1 }));
  }
}

function loadScoreRecords() {
  try {
    const raw = window.localStorage.getItem(SCORE_KEY);
    if (!raw) return { best: 0, last: 0, history: [] };
    const parsed = JSON.parse(raw);
    return {
      best: Number(parsed.best) || 0,
      last: Number(parsed.last) || 0,
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 5) : [],
    };
  } catch {
    return { best: 0, last: 0, history: [] };
  }
}

function saveScoreRecord(entry) {
  const records = loadScoreRecords();
  const score = Number(entry.score) || 0;
  const isNewBest = score > records.best;
  const next = {
    best: Math.max(records.best, score),
    last: score,
    history: [
      {
        score,
        stage: entry.stage || 1,
        result: entry.result || "RUN",
        at: new Date().toISOString(),
      },
      ...records.history,
    ].slice(0, 5),
  };
  try {
    window.localStorage.setItem(SCORE_KEY, JSON.stringify(next));
  } catch {
    // Browsers can disable storage in private or restricted modes.
  }
  return { ...next, isNewBest };
}

function resumeAudio(scene) {
  try {
    const ctx = scene.sound.context;
    if (ctx?.state === "suspended") ctx.resume();
  } catch {
    // Audio can be blocked before the first user gesture.
  }
}

function playSfx(scene, name, volume = 1) {
  try {
    resumeAudio(scene);
    const ctx = scene.sound.context;
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.035 * volume, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + (SFX[name]?.duration || 0.15));
    master.connect(ctx.destination);

    for (const tone of SFX[name]?.tones || SFX.hit.tones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tone.type || "triangle";
      osc.frequency.setValueAtTime(tone.from, now);
      osc.frequency.exponentialRampToValueAtTime(tone.to || tone.from, now + tone.duration);
      gain.gain.setValueAtTime(tone.gain ?? 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + (tone.delay || 0));
      osc.stop(now + tone.duration + (tone.delay || 0.01));
    }
  } catch {
    // Keep gameplay running even when Web Audio is unavailable.
  }
}

const SFX = {
  shoot: { duration: 0.09, tones: [{ from: 620, to: 880, duration: 0.08, type: "square", gain: 0.45 }] },
  laser: {
    duration: 0.13,
    tones: [
      { from: 760, to: 1240, duration: 0.1, type: "sawtooth", gain: 0.35 },
      { from: 1520, to: 1100, duration: 0.08, type: "triangle", gain: 0.25 },
    ],
  },
  enemyShoot: { duration: 0.1, tones: [{ from: 280, to: 190, duration: 0.09, type: "sawtooth", gain: 0.25 }] },
  hit: { duration: 0.08, tones: [{ from: 190, to: 120, duration: 0.07, type: "triangle", gain: 0.25 }] },
  explosion: {
    duration: 0.22,
    tones: [
      { from: 140, to: 45, duration: 0.18, type: "sawtooth", gain: 0.65 },
      { from: 70, to: 38, duration: 0.22, type: "square", gain: 0.35 },
    ],
  },
  bigExplosion: {
    duration: 0.34,
    tones: [
      { from: 180, to: 35, duration: 0.3, type: "sawtooth", gain: 0.8 },
      { from: 92, to: 42, duration: 0.26, type: "square", gain: 0.45 },
    ],
  },
  powerUp: {
    duration: 0.22,
    tones: [
      { from: 620, to: 980, duration: 0.1, type: "triangle", gain: 0.45 },
      { from: 980, to: 1480, duration: 0.12, delay: 0.06, type: "triangle", gain: 0.35 },
    ],
  },
  heal: { duration: 0.18, tones: [{ from: 520, to: 780, duration: 0.16, type: "sine", gain: 0.35 }] },
  bomb: { duration: 0.28, tones: [{ from: 230, to: 55, duration: 0.25, type: "sawtooth", gain: 0.75 }] },
  shield: { duration: 0.26, tones: [{ from: 360, to: 720, duration: 0.23, type: "sine", gain: 0.4 }] },
  gem: { duration: 0.12, tones: [{ from: 940, to: 1320, duration: 0.1, type: "triangle", gain: 0.38 }] },
  damage: {
    duration: 0.3,
    tones: [
      { from: 180, to: 70, duration: 0.23, type: "sawtooth", gain: 0.7 },
      { from: 90, to: 50, duration: 0.3, type: "square", gain: 0.35 },
    ],
  },
  warning: {
    duration: 0.65,
    tones: [
      { from: 210, to: 210, duration: 0.22, type: "square", gain: 0.55 },
      { from: 210, to: 210, duration: 0.22, delay: 0.28, type: "square", gain: 0.55 },
    ],
  },
  bossHit: { duration: 0.08, tones: [{ from: 260, to: 170, duration: 0.07, type: "sawtooth", gain: 0.3 }] },
  bossDown: { duration: 0.7, tones: [{ from: 260, to: 38, duration: 0.65, type: "sawtooth", gain: 0.95 }] },
  start: { duration: 0.2, tones: [{ from: 440, to: 880, duration: 0.17, type: "triangle", gain: 0.45 }] },
  menu: { duration: 0.12, tones: [{ from: 540, to: 380, duration: 0.1, type: "triangle", gain: 0.3 }] },
  stageClear: { duration: 0.45, tones: [{ from: 520, to: 1040, duration: 0.4, type: "sine", gain: 0.55 }] },
  final: {
    duration: 0.8,
    tones: [
      { from: 440, to: 880, duration: 0.3, type: "sine", gain: 0.45 },
      { from: 660, to: 1320, duration: 0.45, delay: 0.14, type: "triangle", gain: 0.4 },
    ],
  },
  gameOver: { duration: 0.55, tones: [{ from: 360, to: 80, duration: 0.5, type: "sawtooth", gain: 0.55 }] },
};

function hudText(size, color, align = "left") {
  return {
    fontFamily: '"Segoe UI", "Noto Sans TC", Arial, sans-serif',
    fontSize: `${size}px`,
    fontStyle: "700",
    color,
    align,
    letterSpacing: 0,
  };
}

function neonButton(scene, x, y, label, onClick) {
  const box = scene.add.rectangle(x, y, 220, 58, 0x07101e, 0.82).setStrokeStyle(2, 0x27e7ff, 1);
  const text = scene.add.text(x, y, label, hudText(24, "#dffcff", "center")).setOrigin(0.5).setShadow(0, 0, "#21e7ff", 12);
  box.setInteractive({ useHandCursor: true });
  box.on("pointerover", () => box.setFillStyle(0x102a42, 0.9));
  box.on("pointerout", () => box.setFillStyle(0x07101e, 0.82));
  box.on("pointerdown", onClick);
  text.setInteractive({ useHandCursor: true }).on("pointerdown", onClick);
  return { box, text };
}

function addStarfield(scene, color) {
  const g = scene.add.graphics();
  for (let i = 0; i < 130; i++) {
    g.fillStyle(i % 4 ? 0xffffff : color, Phaser.Math.FloatBetween(0.25, 0.95));
    g.fillCircle(Phaser.Math.Between(0, WIDTH), Phaser.Math.Between(0, HEIGHT), Phaser.Math.Between(1, 3));
  }
}

function syncGameSize(scene, gameSize = scene.scale.gameSize) {
  WIDTH = Math.max(320, Math.floor(gameSize.width));
  HEIGHT = Math.max(480, Math.floor(gameSize.height));
}

function toggleFullscreen(scene) {
  resumeAudio(scene);
  playSfx(scene, "menu");
  if (scene.scale.isFullscreen) {
    scene.scale.stopFullscreen();
  } else {
    scene.scale.startFullscreen();
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#03040c",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
    fullscreenTarget: "game",
  },
  scene: [BootScene, MenuScene, GameScene, ResultScene],
});
