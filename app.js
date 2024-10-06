const bunny = ["./pics/Captain_Cutler.webp", "Captain Cutler"];
const butch = ["./pics/Space_Kook.webp", "Space Kook"];
const gimp = ["./pics/Miner.webp", "The Miner"];
const jules = ["./pics/Volt_Ghost.webp", "10,000 Volt Ghost"];
const koons = ["./pics/Headless_Horseman.webp", "Headless Horseman"];
const marsellus = ["./pics/Headless_Specter.webp", "Headless Specter"];
const vince = ["./pics/Neon_Phantom.webp", "Neon Phantom"];
const wolf = ["./pics/Snow_Ghost.webp", "Snow Ghost"];
const lance = ["./pics/Ghost_Clown.webp", "Ghost Clown"];
const front = "./pics/card.avif";
const namesArr = [
  bunny,
  butch,
  gimp,
  jules,
  koons,
  marsellus,
  vince,
  wolf,
  lance,
];
let board = document.getElementById("game");
let isPaused = false;
let firstPick;
let matches = 0;
let imagesArr = [];

if (window.screen.width < 900) {
  while (imagesArr.length < 6) {
    let index = Math.floor(Math.random() * namesArr.length);
    if (!imagesArr.includes(namesArr[index])) {
      imagesArr = [...imagesArr, namesArr[index]];
    }
  }
  console.log(imagesArr);
} else {
  imagesArr = namesArr;
}

const gameArray = [...imagesArr, ...imagesArr];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startGame() {
  shuffleArray(gameArray);
  let player = gameArray
    .map((player) => {
      return `<div class="card" onclick="handleClick(event)" data-name="${player[1]}">
                <div class="front"></div>
                <div class="back rotated">
                <div class="image">
                  <img src="${player[0]}" alt="${player[1]}" />
                <h2>${player[1]}</h2>
                </div>
                </div>
      </div>`;
    })
    .join("");
  board.innerHTML = player;
}
function handleClick(event) {
  const card = event.currentTarget;
  const [front, back] = getFrontAndBack(card);
  const audio = document.getElementById("match");
  if (front.classList.contains("rotated") || isPaused) return;

  isPaused = true;

  rotateElements([front, back]);

  if (!firstPick) {
    firstPick = card;
    isPaused = false;
  } else {
    const firstName = firstPick.dataset.name;
    const secondName = card.dataset.name;
    if (firstName !== secondName) {
      const [firstFront, firstBack] = getFrontAndBack(firstPick);
      audio.src = "./sounds/error.mp3";
      audio.currentTime = 0;
      audio.play();
      setTimeout(() => {
        rotateElements([front, back, firstFront, firstBack]);
        isPaused = false;
        firstPick = "";
      }, 1000);
    } else {
      matches++;
      audio.src = "./sounds/match.mp3";
      audio.currentTime = 0;
      audio.play();
      firstPick = null;
      isPaused = false;
    }
  }
}

function rotateElements(elements) {
  if (typeof elements !== "object" || !elements.length) return;
  elements.forEach((element) => {
    element.classList.toggle("rotated");
  });
}

function getFrontAndBack(card) {
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");
  return [front, back];
}

function resetGame() {
  board.innerHTML = "";
  matches = 0;
  isPaused = true;
  firstPick = null;
  startGame();
  isPaused = false;
}
document.getElementById("start").addEventListener("click", resetGame);
startGame();
