let balls = [];
let circleRadius;
const ballRadius = 20;
const gravity = 0.1;
const protectionTime = 200; // 0.2 секунды защиты от исчезновения
let restartButton; // Кнопка для перезапуска

function setup() {
  createCanvas(windowWidth, windowHeight);
  circleRadius = min(width, height) * 0.4;
  addBall();

  // Создаем кнопку для перезапуска
  restartButton = createButton("Начать заново");
  styleButton(restartButton);
  positionButton();
  restartButton.hide();
  restartButton.mousePressed(restartGame);
}

function draw() {
  // Закрашиваем фон с прозрачностью, чтобы оставить след
  background(240, 240, 240, 50);

  // Рисуем круг с толстой линией
  noFill();
  stroke(0);
  strokeWeight(6);
  ellipse(width / 2, height / 2, circleRadius * 2);

  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    ball.applyGravity();
    ball.update();
    ball.display();

    if (ball.checkBoundaryCollision()) {
      addBall();
    }

    for (let j = balls.length - 1; j > i; j--) {
      if (ball.checkCollision(balls[j])) {
        balls.splice(j, 1);
        balls.splice(i, 1);
        break;
      }
    }
  }

  // Показываем кнопку, если все шарики исчезли
  if (balls.length === 0) {
    restartButton.show();
  } else {
    restartButton.hide();
  }
}

function addBall() {
  let x = width / 2;
  let y = height / 2;
  balls.push(new Ball(x, y, ballRadius));
}

function restartGame() {
  balls = [];
  addBall();
}

class Ball {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 4));
    this.r = r;
    this.hasCollided = false;
    this.spawnTime = millis();
  }

  applyGravity() {
    this.vel.y += gravity;
  }

  update() {
    this.pos.add(this.vel);
    this.checkEdges();
  }

  display() {
    fill(50, 150, 250);
    stroke(0);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  checkBoundaryCollision() {
    let distToCenter = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    if (!this.hasCollided && distToCenter >= circleRadius - this.r) {
      this.hasCollided = true;
      return true;
    } else if (distToCenter < circleRadius - this.r) {
      this.hasCollided = false;
    }
    return false;
  }

  checkCollision(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (
      d < this.r + other.r &&
      millis() - this.spawnTime > protectionTime &&
      millis() - other.spawnTime > protectionTime
    ) {
      return true;
    }
    return false;
  }

  checkEdges() {
    let distToCenter = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    if (distToCenter >= circleRadius - this.r) {
      let normal = p5.Vector.sub(this.pos, createVector(width / 2, height / 2)).normalize();
      this.vel.reflect(normal);
      this.vel.mult(1.1);
    }
  }
}

// Проверка устройства и адаптивность кнопки
function styleButton(button) {
  button.style("font-size", isMobileDevice() ? "18px" : "24px");
  button.style("font-weight", "bold");
  button.style("background-color", "#ff7f50");
  button.style("color", "#ffffff");
  button.style("border", "none");
  button.style("padding", isMobileDevice() ? "10px 20px" : "15px 30px");
  button.style("border-radius", "10px");
}

function positionButton() {
  restartButton.position(width / 2.15 - restartButton.width / 2, height / 2 - restartButton.height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  circleRadius = min(width, height) * 0.4;
  positionButton();
}

// Проверка на мобильное устройство
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
