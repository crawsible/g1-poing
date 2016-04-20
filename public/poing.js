var game = new Phaser.Game(600, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var p1Paddle
var p2Paddle
var paddles
var ball

function preload() {}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  paddles = game.add.group();

  var paddleGraphics = new Phaser.Graphics(null, 0, 0);
  paddleGraphics.beginFill(0xFFFF88, 1);
  paddleGraphics.drawRect(0, 0, 10, 50);
  var paddleTexture = paddleGraphics.generateTexture();
  p1Paddle = paddles.create(20, 125, paddleTexture);
  p2Paddle = paddles.create(570, 125, paddleTexture);

  var ballGraphics = new Phaser.Graphics(null, 0, 0);
  ballGraphics.beginFill(0xFFFFFF, 1);
  ballGraphics.drawRect(0, 0, 10, 10);
  var ballTexture = ballGraphics.generateTexture();
  ball = game.add.sprite(295, 145, ballTexture);

  game.physics.arcade.enable(p1Paddle);
  game.physics.arcade.enable(p2Paddle);
  game.physics.arcade.enable(ball);

  paddles.enableBody = true;

  ball.enableBody = true;
  ball.body.bounce.x = 1.1;
  ball.body.bounce.y = 1;
  ball.body.collideWorldBounds = true;

  ball.body.velocity.x = 50;
}

function update() {
  checkForActivation(p1Paddle, Phaser.KeyCode.Z);
  checkForActivation(p2Paddle, Phaser.KeyCode.PERIOD);

  game.physics.arcade.collide(ball, paddles);
}

// private methods
function checkForActivation(paddle, key) {
  paddle.body.immovable = false;
  paddle.tint = 0xFFFFFF;

  if (game.input.keyboard.isDown(key)) {
    paddle.body.immovable = true;
    paddle.tint = 0xFF0000;
  }
}
