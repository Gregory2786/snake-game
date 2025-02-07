const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const playerNameDisplay = document.querySelector(".player-name > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const playerNameInput = document.getElementById("playerName");
const startGameButton = document.getElementById("startGame");

const size = 30;
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];
let playerName = "";

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = food;

    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd";
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "red"
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
}

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y });
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y });
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size });
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size });
    }

    snake.shift();
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

const chackEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        incrementScore();
        snake.push(head);

        let x = randomPosition();
        let y = randomPosition();

        // Gera nova posição para a comida que não colida com a cobrinha
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor(); // Gera nova cor para a comida
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver(); // Chama a função gameOver se houver colisão
    }
}

const gameOver = () => {
    direction = undefined; // Para a cobrinha

    menu.style.display = "flex"; // Exibe a tela de game over
    finalScore.innerText = score.innerText; // Mostra a pontuação final
    playerNameDisplay.innerText = playerName; // Mostra o nome do jogador
    canvas.style.filter = "blur(2px)"; // Aplica um efeito de desfoque ao canvas
}

const gameLoop = () => {
    clearInterval(loopId); // Limpa o loop anterior

    ctx.clearRect(0, 0, 600, 600); // Limpa o canvas
    drawGrid(); // Desenha a grade
    drawFood(); // Desenha a comida
    moveSnake(); // Move a cobrinha
    drawSnake(); // Desenha a cobrinha
    chackEat(); // Verifica se a cobrinha comeu
    checkCollision(); // Verifica colisões

    loopId = setTimeout(() => {
        gameLoop(); // Chama o loop novamente
    }, 300); // Define a velocidade do jogo
}


// Inicia o jogo ao clicar no botão "Iniciar Jogo"
startGameButton.addEventListener("click", () => {
    playerName = playerNameInput.value; // Captura o nome do jogador
    if (playerName) {
        score.innerText = "00"; // Reinicia a pontuação
        menu.style.display = "none"; // Esconde a tela de game over
        canvas.style.filter = "none"; // Remove o desfoque do canvas

        // Oculta a área de entrada
        document.querySelector(".name-input").style.display = "none";

        snake = [initialPosition]; // Reinicia a cobrinha
        direction = undefined; // Reseta a direção
        gameLoop(); // Inicia o loop do jogo
    } else {
        alert("Por favor, insira seu nome!"); // Alerta se o nome não for inserido
    }
});

// Controle de direção
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"; // Muda a direção para a direita
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"; // Muda a direção para a esquerda
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"; // Muda a direção para baixo
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"; // Muda a direção para cima
    }
});