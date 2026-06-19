import Phaser from "phaser";
import "./styles.css";

let WIDTH = Math.max(360, window.innerWidth || 540);
let HEIGHT = Math.max(640, window.innerHeight || 840);
const PLAYER_SPEED = 360;
const SCORE_KEY = "neon1945-score-records";
const WEAPONS = [
  { name: "VULCAN", color: 0x83faff },
  { name: "SPREAD", color: 0xfff06a },
  { name: "CRUISE", color: 0x9cff7f },
];
const BOSS_SPECS = [
  { texture: "boss-orbit", body: [150, 78], y: 118, sway: 115, speed: 820 },
  { texture: "boss-plasma", body: [110, 120], y: 132, sway: 86, speed: 620 },
  { texture: "boss-abyss", body: [176, 102], y: 126, sway: 68, speed: 980 },
  { texture: "boss-forge", body: [184, 96], y: 128, sway: 96, speed: 760 },
  { texture: "boss-quantum", body: [138, 126], y: 132, sway: 120, speed: 540 },
  { texture: "boss-null", body: [198, 118], y: 124, sway: 54, speed: 1120 },
];
const CAPTURED_KEYS = [
  Phaser.Input.Keyboard.KeyCodes.UP,
  Phaser.Input.Keyboard.KeyCodes.DOWN,
  Phaser.Input.Keyboard.KeyCodes.LEFT,
  Phaser.Input.Keyboard.KeyCodes.RIGHT,
  Phaser.Input.Keyboard.KeyCodes.W,
  Phaser.Input.Keyboard.KeyCodes.A,
  Phaser.Input.Keyboard.KeyCodes.S,
  Phaser.Input.Keyboard.KeyCodes.D,
  Phaser.Input.Keyboard.KeyCodes.SPACE,
  Phaser.Input.Keyboard.KeyCodes.Q,
  Phaser.Input.Keyboard.KeyCodes.E,
  Phaser.Input.Keyboard.KeyCodes.C,
  Phaser.Input.Keyboard.KeyCodes.B,
  Phaser.Input.Keyboard.KeyCodes.F,
  Phaser.Input.Keyboard.KeyCodes.ONE,
  Phaser.Input.Keyboard.KeyCodes.TWO,
  Phaser.Input.Keyboard.KeyCodes.THREE,
];

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
  {
    name: "Solar Foundry",
    palette: { bg: 0x080504, grid: 0xffb02e, accent: 0xffef64, enemy: 0xff643d },
    enemies: ["basic", "side", "gunship"],
    boss: {
      name: "SOLAR ANVIL DREADNOUGHT",
      hp: 1720,
      tint: 0xffb02e,
      modes: ["lineStorm", "splitShot", "arcWall"],
    },
  },
  {
    name: "Quantum Reef",
    palette: { bg: 0x02120c, grid: 0x66ffbd, accent: 0x36f5ff, enemy: 0x9cff7f },
    enemies: ["tracker", "spread", "sniper"],
    boss: {
      name: "QUANTUM SERAPH",
      hp: 2050,
      tint: 0x66ffbd,
      modes: ["spiral", "summon", "weakPoint"],
    },
  },
  {
    name: "Event Horizon",
    palette: { bg: 0x020208, grid: 0xb7c9ff, accent: 0xffffff, enemy: 0xff4778 },
    enemies: ["shield", "gunship", "elite"],
    boss: {
      name: "NULL STAR EMPEROR",
      hp: 2550,
      tint: 0xb7c9ff,
      modes: ["fullScreen", "sideLasers", "eliteSummon"],
    },
  },
];

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    syncGameSize(this);
    setupKeyboardCapture(this);
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
      g.fillStyle(0x031826, 1);
      g.fillPoints([
        { x: w / 2, y: 3 },
        { x: 39, y: 22 },
        { x: 58, y: 44 },
        { x: 45, y: 50 },
        { x: 39, y: 66 },
        { x: w / 2, y: 58 },
        { x: 25, y: 66 },
        { x: 19, y: 50 },
        { x: 6, y: 44 },
        { x: 25, y: 22 },
      ], true);
      g.lineStyle(3, 0x9fffff, 1);
      g.strokePoints([
        { x: w / 2, y: 3 },
        { x: 39, y: 22 },
        { x: 58, y: 44 },
        { x: 45, y: 50 },
        { x: 39, y: 66 },
        { x: w / 2, y: 58 },
        { x: 25, y: 66 },
        { x: 19, y: 50 },
        { x: 6, y: 44 },
        { x: 25, y: 22 },
      ], true);
      g.fillStyle(0x0b4f68, 1).fillTriangle(w / 2, 8, 41, 48, 23, 48);
      g.fillStyle(0xeaffff, 0.95).fillTriangle(w / 2, 15, 38, 36, 26, 36);
      g.lineStyle(2, 0x20e7ff, 0.95).lineBetween(w / 2, 8, w / 2, 58);
      g.lineStyle(2, 0x55f7ff, 0.65).lineBetween(13, 43, 28, 48).lineBetween(51, 43, 36, 48);
      g.fillStyle(0x49f4ff, 0.95).fillCircle(25, 62, 4).fillCircle(39, 62, 4);
      g.fillStyle(0xffffff, 0.8).fillCircle(w / 2, 31, 3);
    }, 64, 72);

    make("bullet", (g, w, h) => {
      g.fillStyle(0xeaffff, 1).fillRoundedRect(12, 2, 8, 24, 4);
      g.lineStyle(3, 0x27e7ff, 0.75).strokeRoundedRect(9, 0, 14, 28, 7);
    }, 32, 32);

    make("laser", (g) => {
      g.fillStyle(0xf9ffff, 1).fillRoundedRect(11, 0, 10, 46, 5);
      g.lineStyle(4, 0x2fefff, 0.9).strokeRoundedRect(7, 0, 18, 46, 9);
    }, 32, 48);

    make("missile", (g, w, h) => {
      g.fillStyle(0xeaffff, 1).fillTriangle(w / 2, 2, 8, h - 8, w - 8, h - 8);
      g.fillStyle(0x52ff85, 1).fillRect(12, 22, 8, 16);
      g.lineStyle(3, 0x9cff7f, 0.95).strokeTriangle(w / 2, 2, 8, h - 8, w - 8, h - 8);
      g.fillStyle(0xfff06a, 0.95).fillCircle(w / 2, h - 5, 5);
    }, 32, 44);

    make("wingman", (g, w, h) => {
      g.fillStyle(0x10120a, 1);
      g.fillPoints([
        { x: w / 2, y: 3 },
        { x: 25, y: 17 },
        { x: 34, y: 28 },
        { x: 24, y: 31 },
        { x: 21, y: 39 },
        { x: w / 2, y: 35 },
        { x: 15, y: 39 },
        { x: 12, y: 31 },
        { x: 2, y: 28 },
        { x: 11, y: 17 },
      ], true);
      g.lineStyle(2, 0xfff06a, 0.95).strokePoints([
        { x: w / 2, y: 3 },
        { x: 25, y: 17 },
        { x: 34, y: 28 },
        { x: 24, y: 31 },
        { x: 21, y: 39 },
        { x: w / 2, y: 35 },
        { x: 15, y: 39 },
        { x: 12, y: 31 },
        { x: 2, y: 28 },
        { x: 11, y: 17 },
      ], true);
      g.fillStyle(0x83faff, 1).fillCircle(w / 2, 23, 3);
      g.fillStyle(0xfff06a, 0.9).fillCircle(14, h - 7, 3).fillCircle(22, h - 7, 3);
    }, 36, 42);

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
        const heavy = type === "gunship" || type === "shield" || type === "elite";
        const narrow = type === "sniper" || type === "suicide" || type === "dive";
        g.fillStyle(0x150811, 1);
        if (heavy) {
          g.fillRoundedRect(10, 12, w - 20, h - 22, 10);
          g.fillStyle(0x230b1a, 1).fillTriangle(w / 2, h - 3, 12, 22, w - 12, 22);
          g.lineStyle(4, c, 1).strokeRoundedRect(10, 12, w - 20, h - 22, 10);
          g.lineStyle(3, c, 0.82).strokeTriangle(w / 2, h - 3, 12, 22, w - 12, 22);
          g.fillStyle(c, 0.85).fillCircle(w / 2, h / 2, type === "gunship" ? 11 : 8);
          g.fillStyle(0xffffff, 0.65).fillCircle(22, 25, 4).fillCircle(w - 22, 25, 4);
          g.lineStyle(2, c, 0.7).lineBetween(18, h - 18, w - 18, h - 18);
        } else if (narrow) {
          g.fillPoints([
            { x: w / 2, y: h - 3 },
            { x: 36, y: 34 },
            { x: w - 7, y: 16 },
            { x: 35, y: 20 },
            { x: w / 2, y: 5 },
            { x: 19, y: 20 },
            { x: 7, y: 16 },
            { x: 18, y: 34 },
          ], true);
          g.lineStyle(3, c, 1).strokePoints([
            { x: w / 2, y: h - 3 },
            { x: 36, y: 34 },
            { x: w - 7, y: 16 },
            { x: 35, y: 20 },
            { x: w / 2, y: 5 },
            { x: 19, y: 20 },
            { x: 7, y: 16 },
            { x: 18, y: 34 },
          ], true);
          g.fillStyle(c, 0.85).fillCircle(w / 2, h / 2 + 3, type === "sniper" ? 5 : 6);
          g.lineStyle(2, 0xffffff, 0.55).lineBetween(w / 2, 10, w / 2, h - 8);
        } else {
          g.fillPoints([
            { x: w / 2, y: h - 4 },
            { x: 38, y: 35 },
            { x: w - 6, y: 27 },
            { x: 36, y: 17 },
            { x: w / 2, y: 7 },
            { x: 18, y: 17 },
            { x: 6, y: 27 },
            { x: 16, y: 35 },
          ], true);
          g.lineStyle(3, c, 1).strokePoints([
            { x: w / 2, y: h - 4 },
            { x: 38, y: 35 },
            { x: w - 6, y: 27 },
            { x: 36, y: 17 },
            { x: w / 2, y: 7 },
            { x: 18, y: 17 },
            { x: 6, y: 27 },
            { x: 16, y: 35 },
          ], true);
          g.fillStyle(c, 0.8).fillCircle(w / 2, h / 2, type === "spread" ? 8 : 6);
          g.fillStyle(0xffffff, 0.55).fillCircle(w / 2, 19, 3);
          g.lineStyle(2, c, 0.55).lineBetween(13, 32, 25, 37).lineBetween(w - 13, 32, w - 25, 37);
        }
      }, type === "gunship" ? 76 : 54, type === "gunship" ? 70 : 54);
    });

    make("boss-orbit", (g, w, h) => {
      g.fillStyle(0x0d0d18, 1).fillRoundedRect(8, 18, w - 16, h - 34, 14);
      g.lineStyle(5, 0x35ddff, 0.95).strokeRoundedRect(8, 18, w - 16, h - 34, 14);
      g.fillStyle(0x35ddff, 0.3).fillRoundedRect(28, 34, w - 56, h - 66, 9);
      g.fillStyle(0xffffff, 0.75).fillCircle(w / 2, h / 2, 22);
      g.lineStyle(3, 0x9fffff, 0.85).lineBetween(22, h / 2, w - 22, h / 2);
      g.lineBetween(w / 2, 12, w / 2, h - 12);
      g.fillStyle(0x55f7ff, 0.9).fillCircle(32, h / 2, 8).fillCircle(w - 32, h / 2, 8);
    }, 184, 126);

    make("boss-plasma", (g, w, h) => {
      g.fillStyle(0x16051f, 1).fillCircle(w / 2, h / 2, 42);
      g.lineStyle(5, 0xff40df, 0.95).strokeCircle(w / 2, h / 2, 42);
      g.lineStyle(4, 0xb955ff, 0.9);
      g.strokeTriangle(w / 2, 5, 20, h - 15, w - 20, h - 15);
      g.strokeTriangle(w / 2, h - 5, 20, 15, w - 20, 15);
      g.fillStyle(0xffffff, 0.75).fillCircle(w / 2, h / 2, 18);
      g.fillStyle(0xff40df, 0.5).fillCircle(w / 2, h / 2, 30);
      g.lineStyle(3, 0xff8a2b, 0.85).lineBetween(18, h / 2, w - 18, h / 2);
      g.fillStyle(0xff40df, 0.9).fillCircle(24, 24, 7).fillCircle(w - 24, 24, 7).fillCircle(24, h - 24, 7).fillCircle(w - 24, h - 24, 7);
    }, 164, 164);

    make("boss-abyss", (g, w, h) => {
      g.fillStyle(0x120006, 1).fillRoundedRect(12, 22, w - 24, h - 44, 18);
      g.fillStyle(0x25020c, 1).fillTriangle(w / 2, h - 4, 22, 42, w - 22, 42);
      g.lineStyle(5, 0xff2544, 0.96).strokeRoundedRect(12, 22, w - 24, h - 44, 18);
      g.lineStyle(4, 0xff6a7c, 0.8).strokeTriangle(w / 2, h - 4, 22, 42, w - 22, 42);
      g.fillStyle(0xffffff, 0.78).fillCircle(w / 2, h / 2, 24);
      g.fillStyle(0xff2544, 0.45).fillCircle(w / 2, h / 2, 38);
      g.lineStyle(3, 0xffdf47, 0.75);
      g.lineBetween(30, 46, w - 30, 46);
      g.lineBetween(40, h - 42, w - 40, h - 42);
      g.fillStyle(0xff2544, 0.9).fillCircle(35, h / 2, 10).fillCircle(w - 35, h / 2, 10);
      g.fillStyle(0xa55cff, 0.9).fillCircle(w / 2 - 42, h / 2 + 32, 7).fillCircle(w / 2 + 42, h / 2 + 32, 7);
    }, 220, 152);

    make("boss-forge", (g, w, h) => {
      g.fillStyle(0x1b0b02, 1).fillRoundedRect(8, 26, w - 16, h - 46, 12);
      g.fillStyle(0x2a1103, 1).fillTriangle(w / 2, h - 4, 16, 34, w - 16, 34);
      g.lineStyle(5, 0xffb02e, 0.96).strokeRoundedRect(8, 26, w - 16, h - 46, 12);
      g.lineStyle(4, 0xffef64, 0.75).strokeTriangle(w / 2, h - 4, 16, 34, w - 16, 34);
      g.fillStyle(0xffef64, 0.82).fillCircle(w / 2, h / 2, 24);
      g.fillStyle(0xff643d, 0.48).fillCircle(w / 2, h / 2, 40);
      g.fillStyle(0xffb02e, 0.9).fillRect(28, 32, 30, 12).fillRect(w - 58, 32, 30, 12);
      g.lineStyle(3, 0xffef64, 0.65).lineBetween(24, h - 34, w - 24, h - 34);
      g.fillStyle(0xffffff, 0.7).fillCircle(34, h / 2 + 22, 5).fillCircle(w - 34, h / 2 + 22, 5);
    }, 214, 142);

    make("boss-quantum", (g, w, h) => {
      g.fillStyle(0x031d14, 1).fillCircle(w / 2, h / 2, 34);
      g.fillStyle(0x052823, 1).fillTriangle(w / 2, 6, w - 14, h / 2, w / 2, h - 6);
      g.fillTriangle(w / 2, 6, 14, h / 2, w / 2, h - 6);
      g.lineStyle(4, 0x66ffbd, 0.95).strokeCircle(w / 2, h / 2, 34);
      g.lineStyle(3, 0x36f5ff, 0.85).strokeTriangle(w / 2, 6, w - 14, h / 2, w / 2, h - 6);
      g.strokeTriangle(w / 2, 6, 14, h / 2, w / 2, h - 6);
      g.fillStyle(0xffffff, 0.75).fillCircle(w / 2, h / 2, 16);
      g.fillStyle(0x66ffbd, 0.55).fillCircle(w / 2, h / 2, 27);
      g.lineStyle(3, 0x9cff7f, 0.72).strokeCircle(w / 2, h / 2, 52);
      g.fillStyle(0x36f5ff, 0.9).fillCircle(w / 2, 12, 6).fillCircle(w / 2, h - 12, 6);
    }, 172, 172);

    make("boss-null", (g, w, h) => {
      g.fillStyle(0x020208, 1).fillRoundedRect(10, 18, w - 20, h - 34, 20);
      g.fillStyle(0x090b18, 1).fillTriangle(w / 2, h - 4, 18, 48, w - 18, 48);
      g.lineStyle(5, 0xb7c9ff, 0.95).strokeRoundedRect(10, 18, w - 20, h - 34, 20);
      g.lineStyle(4, 0xffffff, 0.72).strokeTriangle(w / 2, h - 4, 18, 48, w - 18, 48);
      g.fillStyle(0x000000, 1).fillCircle(w / 2, h / 2, 35);
      g.lineStyle(5, 0xffffff, 0.95).strokeCircle(w / 2, h / 2, 35);
      g.lineStyle(3, 0xb7c9ff, 0.8).strokeCircle(w / 2, h / 2, 51);
      g.fillStyle(0xff4778, 0.88).fillCircle(38, h / 2, 9).fillCircle(w - 38, h / 2, 9);
      g.fillStyle(0xffffff, 0.72).fillCircle(w / 2 - 46, 40, 5).fillCircle(w / 2 + 46, 40, 5);
      g.lineStyle(3, 0xb7c9ff, 0.6).lineBetween(30, h - 32, w - 30, h - 32);
    }, 236, 160);
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    syncGameSize(this);
    setupKeyboardCapture(this);
    const records = loadScoreRecords();
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x03040c).setOrigin(0);
    addStarfield(this, 0x15d9ff);
    this.add.text(WIDTH / 2, HEIGHT * 0.2, "NEON 1945", hudText(56, "#8ffcff")).setOrigin(0.5).setShadow(0, 0, "#21e7ff", 18);
    this.add.text(WIDTH / 2, HEIGHT * 0.28, "ABYSS RUN", hudText(24, "#ff5cf7")).setOrigin(0.5).setShadow(0, 0, "#ff3df2", 14);
    this.add.text(WIDTH / 2, HEIGHT * 0.44, "方向鍵 / WASD 移動\nSpace 或滑鼠左鍵射擊，1/2/3 或 Q/E 換武器\nC 發射巡弋飛彈，突破 6 關霓虹戰線", hudText(19, "#dffcff", "center")).setOrigin(0.5);
    this.add.text(WIDTH / 2, HEIGHT * 0.55, `BEST ${records.best}    LAST ${records.last}`, hudText(18, "#fff2a8", "center")).setOrigin(0.5);
    const startGame = () => {
      playSfx(this, "start");
      this.scene.start("GameScene", { levelIndex: 0, score: 0, power: 1, lives: 3, weaponType: 0, wingmen: 0, missiles: 3 });
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
    setupKeyboardCapture(this);
    const win = this.dataIn.mode === "win";
    const clear = this.dataIn.mode === "clear";
    const records = saveScoreRecord({
      score: this.dataIn.score || 0,
      stage: clear ? LEVELS.length : this.dataIn.stage || this.dataIn.nextLevel || 1,
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
          weaponType: this.dataIn.weaponType,
          wingmen: this.dataIn.wingmen,
          missiles: this.dataIn.missiles,
        });
      } else {
        this.scene.start("GameScene", { levelIndex: 0, score: 0, power: 1, lives: 3, weaponType: 0, wingmen: 0, missiles: 3 });
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
    this.weaponType = data.weaponType ?? 0;
    this.wingmanCount = data.wingmen ?? 0;
    this.missiles = data.missiles ?? 3;
  }

  create() {
    syncGameSize(this);
    setupKeyboardCapture(this);
    this.records = loadScoreRecords();
    this.level = LEVELS[this.levelIndex];
    this.isGameOver = false;
    this.bossActive = false;
    this.bossDead = false;
    this.spawnCount = 0;
    this.enemyFireTimer = 0;
    this.lastShot = 0;
    this.lastMissile = 0;
    this.pointerDown = false;
    this.shieldUntil = 0;
    this.foregroundOffset = 0;

    this.add.rectangle(0, 0, WIDTH, HEIGHT, this.level.palette.bg).setOrigin(0);
    this.bg = this.add.graphics();
    this.gridOffset = 0;
    this.drawBackground();

    this.playerBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize: 180, runChildUpdate: false });
    this.enemyBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize: 180, runChildUpdate: false });
    this.enemies = this.physics.add.group();
    this.pickups = this.physics.add.group();

    this.player = this.physics.add.image(WIDTH / 2, HEIGHT - 105, "player").setDepth(10);
    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
    this.player.setCollideWorldBounds(true).setCircle(20, 12, 18);
    this.player.invulnUntil = 0;
    this.player.body.setSize(34, 42).setOffset(15, 18);
    this.shield = this.add.circle(this.player.x, this.player.y, 42, 0x52faff, 0.12).setStrokeStyle(2, 0x8fffff, 0.85).setDepth(9).setVisible(false);
    this.wingmanSprites = [
      this.add.image(this.player.x - 58, this.player.y + 16, "wingman").setDepth(9).setBlendMode(Phaser.BlendModes.ADD).setVisible(false),
      this.add.image(this.player.x + 58, this.player.y + 16, "wingman").setDepth(9).setBlendMode(Phaser.BlendModes.ADD).setVisible(false),
    ];

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      Q: Phaser.Input.Keyboard.KeyCodes.Q,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      C: Phaser.Input.Keyboard.KeyCodes.C,
      ONE: Phaser.Input.Keyboard.KeyCodes.ONE,
      TWO: Phaser.Input.Keyboard.KeyCodes.TWO,
      THREE: Phaser.Input.Keyboard.KeyCodes.THREE,
    });
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
    this.input.keyboard.on("keydown-Q", () => this.cycleWeapon(-1));
    this.input.keyboard.on("keydown-E", () => this.cycleWeapon(1));
    this.input.keyboard.on("keydown-ONE", () => this.setWeapon(0));
    this.input.keyboard.on("keydown-TWO", () => this.setWeapon(1));
    this.input.keyboard.on("keydown-THREE", () => this.setWeapon(2));
    this.input.keyboard.on("keydown-C", () => this.launchCruiseMissile(this.player.x, this.player.y - 20, true));
    this.scale.on("resize", (gameSize) => this.handleResize(gameSize));
  }

  update(time, delta) {
    if (this.isGameOver) return;
    this.gridOffset = (this.gridOffset + delta * 0.18) % 72;
    this.foregroundOffset = (this.foregroundOffset + delta * 0.11) % WIDTH;
    this.drawBackground();
    this.updatePlayer(time);
    this.updateWingmen(time);
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
    this.drawBottomSpace(p);
  }

  drawBottomSpace(p) {
    const baseY = HEIGHT - 118;
    this.bg.fillStyle(0x02040b, 0.82).fillRect(0, baseY, WIDTH, 118);
    this.bg.fillStyle(p.accent, 0.09).fillEllipse(WIDTH * 0.18, HEIGHT + 38, WIDTH * 0.62, 176);
    this.bg.lineStyle(2, p.accent, 0.28);
    for (let x = -160 - this.foregroundOffset; x < WIDTH + 220; x += 140) {
      const hullY = HEIGHT - 44 - ((x / 140) % 2) * 18;
      this.bg.strokeTriangle(x, HEIGHT - 12, x + 72, hullY, x + 156, HEIGHT - 12);
      this.bg.lineBetween(x + 18, HEIGHT - 30, x + 132, HEIGHT - 30);
      this.bg.fillStyle(0xffffff, 0.36).fillCircle(x + 72, hullY + 16, 2);
      this.bg.fillStyle(p.grid, 0.4).fillRect(x + 34, HEIGHT - 24, 28, 3);
      this.bg.fillStyle(0xfff06a, 0.38).fillRect(x + 95, HEIGHT - 24, 22, 3);
    }
    for (let i = 0; i < 9; i++) {
      const x = (i * 97 - this.foregroundOffset * (1.4 + i * 0.02)) % (WIDTH + 120);
      const y = HEIGHT - 100 + (i % 4) * 22;
      this.bg.fillStyle(i % 2 ? 0x33445f : 0x1c2638, 0.78).fillCircle(x < -40 ? x + WIDTH + 120 : x, y, 8 + (i % 3) * 5);
    }
    this.bg.lineStyle(3, p.accent, 0.48).lineBetween(0, baseY, WIDTH, baseY - 18);
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
    this.hud.setText(`LIFE ${this.lives}  PWR ${this.power}  ${WEAPONS[this.weaponType].name}  WING ${this.wingmanCount}  MSL ${this.missiles}  SCORE ${this.score}`);
    this.stageText.setText(`STAGE ${this.levelIndex + 1}/${LEVELS.length}`);
    if (this.bossActive && this.boss?.active) {
      const ratio = Phaser.Math.Clamp(this.boss.hp / this.boss.maxHp, 0, 1);
      this.bossBar.width = (WIDTH - 90) * ratio;
      this.bossBar.fillColor = ratio < 0.35 ? 0xffdf47 : 0xff315d;
    }
  }

  updatePlayer(time) {
    const left = this.cursors.left.isDown || this.keys.A.isDown || pressed("ArrowLeft", "KeyA", "a", "A");
    const right = this.cursors.right.isDown || this.keys.D.isDown || pressed("ArrowRight", "KeyD", "d", "D");
    const up = this.cursors.up.isDown || this.keys.W.isDown || pressed("ArrowUp", "KeyW", "w", "W");
    const down = this.cursors.down.isDown || this.keys.S.isDown || pressed("ArrowDown", "KeyS", "s", "S");
    const vx = (right ? 1 : 0) - (left ? 1 : 0);
    const vy = (down ? 1 : 0) - (up ? 1 : 0);
    const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(PLAYER_SPEED);
    this.player.setVelocity(v.x || 0, v.y || 0);
    this.player.setAlpha(time < this.player.invulnUntil && Math.floor(time / 90) % 2 ? 0.35 : 1);
    if ((this.keys.C.isDown || pressed("KeyC", "c", "C")) && time > this.lastMissile + 520) this.launchCruiseMissile(this.player.x, this.player.y - 20, true);
    if ((this.keys.SPACE.isDown || pressed("Space", " ", "Spacebar") || this.pointerDown) && time > this.lastShot + Math.max(78, 170 - this.power * 18)) {
      this.firePlayer(time);
    }
  }

  updateWingmen(time) {
    const offsets = [
      { x: -54 - Math.sin(time / 260) * 7, y: 18 + Math.cos(time / 300) * 6 },
      { x: 54 + Math.sin(time / 260) * 7, y: 18 + Math.cos(time / 300) * 6 },
    ];
    this.wingmanSprites.forEach((sprite, i) => {
      sprite.setVisible(i < this.wingmanCount);
      if (i < this.wingmanCount) sprite.setPosition(this.player.x + offsets[i].x, this.player.y + offsets[i].y);
    });
  }

  firePlayer(time) {
    this.lastShot = time;
    const shots = this.makeWeaponShots();
    shots.forEach(([ox, oy, vx, vy, tex, homing]) => {
      this.spawnPlayerShot(this.player.x + ox, this.player.y + oy, vx, vy, tex, homing);
    });
    this.wingmanSprites.forEach((sprite, i) => {
      if (i >= this.wingmanCount) return;
      this.spawnPlayerShot(sprite.x, sprite.y - 20, i === 0 ? -75 : 75, -620, "bullet", false, 7);
    });
    if (this.weaponType === 2 && this.missiles > 0 && time > this.lastMissile + 780) {
      this.launchCruiseMissile(this.player.x, this.player.y - 20, true);
    }
    playSfx(this, this.weaponType === 2 ? "missile" : this.power >= 4 || this.weaponType === 0 ? "laser" : "shoot", 0.75 + this.power * 0.05);
  }

  makeWeaponShots() {
    const shots = [];
    const p = this.power;
    if (this.weaponType === 0) {
      const speed = p >= 4 ? -820 : -700;
      shots.push([0, -16, 0, speed, p >= 4 ? "laser" : "bullet"]);
      if (p >= 2) shots.push([-14, -6, 0, -690, "bullet"], [14, -6, 0, -690, "bullet"]);
      if (p >= 4) shots.push([-30, 8, -45, -660, "bullet"], [30, 8, 45, -660, "bullet"]);
    } else if (this.weaponType === 1) {
      shots.push([0, -10, 0, -640, "bullet"]);
      const spread = p >= 4 ? [-240, -140, 140, 240] : [-145, 145];
      spread.forEach((vx, i) => shots.push([vx < 0 ? -18 - i * 4 : 18 + i * 4, 0, vx, -560, "bullet"]));
      if (p >= 3) shots.push([-34, 10, -300, -500, "bullet"], [34, 10, 300, -500, "bullet"]);
      if (p >= 5) shots.push([0, -18, 0, -730, "laser"]);
    } else {
      shots.push([-10, -8, 0, -610, "bullet"], [10, -8, 0, -610, "bullet"]);
      if (p >= 2) shots.push([-26, 8, -90, -570, "bullet"], [26, 8, 90, -570, "bullet"]);
      if (p >= 4) shots.push([0, -18, 0, -720, "laser"]);
    }
    return shots;
  }

  spawnPlayerShot(x, y, vx, vy, tex, homing = false, damage = null) {
    const b = this.playerBullets.get(x, y, tex);
    if (!b) return null;
    b.setActive(true).setVisible(true).setDepth(8).setBlendMode(Phaser.BlendModes.ADD).setTint(WEAPONS[this.weaponType].color);
    b.body.enable = true;
    b.body.setSize(tex === "laser" ? 12 : tex === "missile" ? 18 : 10, tex === "laser" ? 44 : tex === "missile" ? 34 : 24);
    b.setVelocity(vx, vy);
    b.damage = damage ?? (tex === "missile" ? 42 : tex === "laser" ? 18 : 10);
    b.homing = !!homing;
    b.missile = tex === "missile";
    return b;
  }

  launchCruiseMissile(x, y, spendAmmo = false) {
    if (spendAmmo && this.missiles <= 0) return;
    if (spendAmmo) this.missiles--;
    this.lastMissile = this.time.now;
    const dir = this.missiles % 2 ? -95 : 95;
    const b = this.spawnPlayerShot(x, y, dir, -430, "missile", true, 48 + this.power * 4);
    if (b) b.setTint(0x9cff7f);
    playSfx(this, "missile", 0.95);
  }

  updateBullets() {
    this.playerBullets.children.each((b) => {
      if (!b.active) return;
      if (b.homing) {
        const target = this.closestEnemy(b.x, b.y);
        if (target) this.physics.moveToObject(b, target, 680);
      }
      if (b.missile) b.rotation = Phaser.Math.Angle.Between(0, 0, b.body.velocity.x, b.body.velocity.y) + Math.PI / 2;
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
    if (Phaser.Math.Between(1, 100) <= 30) this.dropPickup(x, y);
    this.killSprite(e);
    playSfx(this, e.type === "gunship" || e.type === "elite" ? "bigExplosion" : "explosion");
  }

  dropPickup(x, y, forcedType) {
    const roll = Phaser.Math.Between(1, 100);
    const type = forcedType || (roll <= 28 ? "P" : roll <= 40 ? "W" : roll <= 52 ? "O" : roll <= 64 ? "M" : roll <= 74 ? "H" : roll <= 84 ? "B" : roll <= 93 ? "S" : "G");
    const tex = type === "G" ? "gem" : "gem";
    const p = this.pickups.create(x, y, tex);
    p.pickupType = type;
    p.setDepth(9).setBlendMode(Phaser.BlendModes.ADD);
    p.body.setCircle(13, 3, 3);
    p.setTint({ P: 0x55f7ff, W: 0xfff06a, O: 0xffffff, M: 0x9cff7f, H: 0x44ff7d, B: 0xffef64, S: 0xa76bff, G: 0xff5cf7 }[type]);
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
    if (type === "W") this.cycleWeapon(1);
    if (type === "O") this.wingmanCount = Math.min(2, this.wingmanCount + 1);
    if (type === "M") this.missiles = Math.min(12, this.missiles + 3);
    if (type === "H") this.lives = Math.min(6, this.lives + 1);
    if (type === "B") this.clearEnemyBullets(true);
    if (type === "S") this.shieldUntil = this.time.now + 6500;
    if (type === "G") this.score += 650;
    p.label?.destroy();
    this.killSprite(p);
    playSfx(this, type === "P" || type === "W" || type === "O" ? "powerUp" : type === "H" ? "heal" : type === "B" ? "bomb" : type === "S" ? "shield" : type === "M" ? "missile" : "gem");
  }

  setWeapon(type) {
    this.weaponType = Phaser.Math.Wrap(type, 0, WEAPONS.length);
    this.addWeaponToast();
    playSfx(this, "menu");
  }

  cycleWeapon(delta) {
    this.setWeapon(this.weaponType + delta);
  }

  addWeaponToast() {
    const t = this.add.text(WIDTH / 2, 112, WEAPONS[this.weaponType].name, hudText(20, "#fff2a8", "center"))
      .setOrigin(0.5)
      .setDepth(70)
      .setShadow(0, 0, "#fff06a", 12);
    this.tweens.add({ targets: t, y: 92, alpha: 0, duration: 650, ease: "Sine.easeOut", onComplete: () => t.destroy() });
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
    const bossSpec = BOSS_SPECS[this.levelIndex];
    this.boss = this.physics.add.image(WIDTH / 2, -120, bossSpec.texture).setDepth(12).setTint(this.level.boss.tint).setBlendMode(Phaser.BlendModes.ADD);
    this.boss.hp = this.level.boss.hp;
    this.boss.maxHp = this.level.boss.hp;
    this.boss.modeIndex = 0;
    this.boss.nextAttack = this.time.now + 1800;
    this.boss.spec = bossSpec;
    this.boss.body.setSize(bossSpec.body[0], bossSpec.body[1]);
    this.tweens.add({ targets: this.boss, y: bossSpec.y, duration: 1800, ease: "Sine.easeOut" });
    this.bossBarBg.setVisible(true);
    this.bossBar.setVisible(true);
    this.bossLabel.setText(this.level.boss.name).setVisible(true);
    this.physics.add.overlap(this.playerBullets, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.player, this.boss, this.hitPlayer, null, this);
  }

  updateBoss(time) {
    this.boss.x = WIDTH / 2 + Math.sin(time / this.boss.spec.speed) * this.boss.spec.sway;
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
      this.dropPickup(boss.x + 40, boss.y + 45, "O");
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
          weaponType: this.weaponType,
          wingmen: this.wingmanCount,
          missiles: this.missiles,
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
  missile: {
    duration: 0.24,
    tones: [
      { from: 220, to: 520, duration: 0.18, type: "sawtooth", gain: 0.45 },
      { from: 90, to: 55, duration: 0.22, type: "triangle", gain: 0.25 },
    ],
  },
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

function setupKeyboardCapture(scene) {
  CAPTURED_KEYS.forEach((keyCode) => scene.input.keyboard.addCapture(keyCode));
  const canvas = scene.game.canvas;
  canvas.setAttribute("tabindex", "0");
  canvas.style.outline = "none";
  canvas.focus();
  scene.input.on("pointerdown", () => canvas.focus());
  installGlobalKeyBlocker();
}

function installGlobalKeyBlocker() {
  if (window.__neon1945KeyBlockerInstalled) return;
  window.__neon1945KeyBlockerInstalled = true;
  const blocked = new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    " ",
    "Spacebar",
    "Space",
  ]);
  const blockedCodes = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);
  window.__neon1945PressedKeys = window.__neon1945PressedKeys || {};
  const syncKey = (event, isDown) => {
    window.__neon1945PressedKeys[event.code] = isDown;
    window.__neon1945PressedKeys[event.key] = isDown;
    if (blocked.has(event.key) || blockedCodes.has(event.code)) event.preventDefault();
  };
  window.addEventListener("keydown", (event) => syncKey(event, true), { capture: true, passive: false });
  window.addEventListener("keyup", (event) => syncKey(event, false), { capture: true, passive: false });
  window.addEventListener("blur", () => {
    window.__neon1945PressedKeys = {};
  });
}

function pressed(...codes) {
  const keys = window.__neon1945PressedKeys || {};
  return codes.some((code) => !!keys[code]);
}

function syncGameSize(scene, gameSize = scene.scale.gameSize) {
  const viewport = getViewportSize();
  WIDTH = Math.max(320, Math.floor(gameSize?.width || viewport.width));
  HEIGHT = Math.max(480, Math.floor(gameSize?.height || viewport.height));
}

function getViewportSize() {
  return {
    width: Math.max(320, Math.floor(window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 540)),
    height: Math.max(480, Math.floor(window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 840)),
  };
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

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: getViewportSize().width,
  height: getViewportSize().height,
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

function forceGameResize() {
  const size = getViewportSize();
  game.scale.resize(size.width, size.height);
}

window.addEventListener("resize", forceGameResize);
window.visualViewport?.addEventListener("resize", forceGameResize);
window.addEventListener("orientationchange", () => setTimeout(forceGameResize, 120));
setTimeout(forceGameResize, 0);
