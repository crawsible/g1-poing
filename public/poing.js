var IMMOBILITY_FRAMES = 30;
var IMMOBILITY_RECHARGE = 60;
var VELOCITY_POW = 1.005;

var game = new Phaser.Game(600, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var p1Paddle;
var p2Paddle;
var p1LossArea;
var p2LossArea;
var paddles;
var ball;

function preload() {}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  paddles = game.add.group();

  p1Paddle = createPaddle(220, 75, 1, paddles, paddleTexture());
  p2Paddle = createPaddle(360, 75, -1, paddles, paddleTexture());

  ball = game.add.sprite(292.5, 142.5, ballTexture());
  ball.maxVelocity = 0;

  game.physics.arcade.enable(p1Paddle);
  game.physics.arcade.enable(p2Paddle);
  game.physics.arcade.enable(ball);

  paddles.enableBody = true;

  ball.enableBody = true;
  ball.body.bounce.x = 1.1;
  ball.body.collideWorldBounds = true;

  ball.body.velocity.x = 50;
}

function update() {
  catchExtremelyFastBall(ball);
  handleImmobility(p1Paddle, Phaser.KeyCode.Z);
  handleImmobility(p2Paddle, Phaser.KeyCode.PERIOD);

  handleBallLaunch(p1Paddle);
  handleBallLaunch(p2Paddle);

  updateMaxVelocity(ball);
  updatePaddleBallContact(ball);

  game.physics.arcade.collide(ball, paddles, function(ball, paddle) {
    if (paddle.body.immovable) {
      ball.body.velocity.x = 0;
      paddle.capturedBall = ball;
    } else {
      ball.body.velocity.x = paddle.body.velocity.x;
    }

    ball.inContact = true;
    ball.contactTime = 1;
  });
}

// private methods

function paddleTexture() {
  var paddleGraphics = new Phaser.Graphics(null, 0, 0);
  paddleGraphics.beginFill(0xFFFFFF, 1);
  paddleGraphics.drawRect(0, 0, 20, 150);

  return paddleGraphics.generateTexture();
}

function ballTexture() {
  var ballGraphics = new Phaser.Graphics(null, 0, 0);
  ballGraphics.beginFill(0x88CC44, 1);
  ballGraphics.drawRect(0, 0, 15, 15);

  return ballGraphics.generateTexture();
}

function createPaddle(x, y, direction, paddles, texture) {
  var paddle = paddles.create(x, y, texture);
  paddle.immobilityFrames = IMMOBILITY_FRAMES;
  paddle.immobilityRecharge = IMMOBILITY_RECHARGE;
  paddle.direction = direction;

  return paddle;
}

function handleImmobility(paddle, key) {
  paddle.body.immovable = false;
  paddle.tint = 0x4488CC;

  if (paddle.immobilityRecharge <= 0) {
    paddle.immobilityRecharge = IMMOBILITY_RECHARGE;
    paddle.immobilityFrames = IMMOBILITY_FRAMES;
  }

  if (paddle.immobilityFrames <= 0) {
    paddle.immobilityRecharge -= 1;
    return;
  }

  if (game.input.keyboard.isDown(key)) {
    paddle.immobilityFrames -= 1;

    paddle.body.velocity.x = 0;
    paddle.body.immovable = true;
    paddle.tint = 0xCCCCFF;
    return;
  }

  if (paddle.immobilityFrames < IMMOBILITY_FRAMES) {
    paddle.immobilityFrames += 1;
  }
}

function handleBallLaunch(paddle) {
  if (!paddle.capturedBall || paddle.body.immovable) return;
  ball.body.velocity.x = Math.pow(ball.maxVelocity + ball.contactTime, VELOCITY_POW) * paddle.direction;
  paddle.capturedBall = null;
  ball.inContact = false;
}

function updateMaxVelocity(ball) {
  ball.maxVelocity = Math.max(ball.maxVelocity, Math.abs(ball.body.velocity.x))
}

function updatePaddleBallContact(ball) {
  if (!ball.inContact) return;
  ball.contactTime += 1;
}

function catchExtremelyFastBall(ball) {
  ball.body.x = Math.min(Math.max(p1Paddle.body.x + 9, ball.body.x), p2Paddle.body.x - 9);
}
