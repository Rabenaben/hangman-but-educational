const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
const hintBtn = document.querySelector(".hint-btn");
const adaptiveHintBtn = document.querySelector(".adaptive-hint-btn");
const scoreDisplay = document.querySelector(".score-display span");
const timerText = document.querySelector(".timer-text span");

// Initialize game variables
let currentWord, correctLetters, wrongGuessCount, timerInterval;
const maxGuesses = 6;
let correctWordsCount = 0;
const wordsForDifficultyIncrease = 5;
let score = 0;
let difficulty = 1;
let timeLeft;

// Track used words for each difficulty
const usedWords = {
    1: [],
    2: [],
    3: [],
};

const updateScoreDisplay = () => {
    scoreDisplay.innerText = score;
}

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
    updateScoreDisplay();
    resetTimer(); // Reset the timer when the game resets
}

const gameOver = (isVictory) => {
    clearInterval(timerInterval); // Stop the timer
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;

    if (!isVictory) {
        gameModal.querySelector("p").innerHTML += `<br>Final Score: <b>${score}</b>`;
        difficulty = 1;
        correctWordsCount = 0;
    }

    gameModal.classList.add("show");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = true);

    if (isVictory) {
        correctWordsCount++;
        score += 1;
        checkForDifficultyIncrease();
    } else {
        score = 0;
        resetUsedWords();
    }
    updateScoreDisplay();
}

const resetUsedWords = () => {
    for (let key in usedWords) {
        usedWords[key] = [];
    }
}

const initGame = (button, clickedLetter) => {
    let found = false;
    [...currentWord].forEach((letter, index) => {
        if (letter.toLowerCase() === clickedLetter.toLowerCase()) {
            correctLetters.push(letter);
            wordDisplay.querySelectorAll("li")[index].innerText = letter;
            wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            found = true;
            if (button) {
                button.disabled = true;
            } else {
                const buttons = keyboardDiv.querySelectorAll("button");
                buttons.forEach(btn => {
                    if (btn.innerText === clickedLetter) {
                        btn.disabled = true;
                    }
                });
            }
        }
    });

    if (!found) {
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
        if (button) {
            button.disabled = true;
        }
    }

    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    button.addEventListener("click", () => initGame(button, button.innerText));
    keyboardDiv.appendChild(button);
}

const getRandomWord = () => {
    let filteredWords = wordList.filter(word => word.difficulty === difficulty && !usedWords[difficulty].includes(word.word));
    
    while (filteredWords.length === 0 && difficulty < Object.keys(usedWords).length) {
        difficulty++;
        alert(`No more questions available at difficulty ${difficulty - 1}. Increasing to difficulty ${difficulty}.`);
        filteredWords = wordList.filter(word => word.difficulty === difficulty && !usedWords[difficulty].includes(word.word));
    }

    if (filteredWords.length === 0) {
        usedWords[difficulty] = [];
        filteredWords = wordList.filter(word => word.difficulty === difficulty);
    }

    const { word, hint } = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    usedWords[difficulty].push(word);
    resetGame();
    startTimer(); // Start the timer when a new word is set
}

const checkForDifficultyIncrease = () => {
    if (correctWordsCount % wordsForDifficultyIncrease === 0) {
        const increaseDifficulty = confirm("You've answered 5 questions correctly. Would you like to increase the difficulty?");
        if (increaseDifficulty) {
            difficulty++;
            alert(`Increasing difficulty to ${difficulty}.`);
        }
    }
}

const revealHintLetter = () => {
    const hiddenLetters = currentWord.split("").map((letter, index) => {
        return wordDisplay.querySelectorAll("li")[index].innerText === "" ? letter : null;
    }).filter(letter => letter !== null);

    if (hiddenLetters.length > 0) {
        const randomLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];
        initGame(null, randomLetter);
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
        guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

        const keyboardButtons = keyboardDiv.querySelectorAll("button");
        keyboardButtons.forEach(btn => {
            if (btn.innerText.toLowerCase() === randomLetter.toLowerCase()) {
                btn.disabled = true;
            }
        });

        if (wrongGuessCount === maxGuesses) return gameOver(false);
    }
}

const startTimer = () => {
    timeLeft = difficulty === 1 ? 60 : difficulty === 2 ? 45 : 35;
    timerText.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver(false);
        }
    }, 1000);
}

const resetTimer = () => {
    clearInterval(timerInterval);
    timerText.innerText = difficulty === 1 ? 60 : difficulty === 2 ? 45 : 35;
}

playAgainBtn.addEventListener("click", getRandomWord);

hintBtn.addEventListener("click", () => {
    const useHint = confirm("Do you want to reveal a letter? This will count as an incorrect guess.");
    if (useHint) {
        revealHintLetter();
    }
});

adaptiveHintBtn.addEventListener("click", async () => {
    const hint = await getSynonymAndAntonym(currentWord);
    if (hint) {
        alert(`Hint: ${hint}`);
    } else {
        alert("No synonyms or antonyms found for this word.");
    }
});

const getSynonymAndAntonym = async (word) => {
    const apiKey = "3edba4a8-27fb-45ec-b46d-e274995d57c0";
    const endpoint = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKey}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.length > 0 && data[0].meta) {
            const synonyms = data[0].meta.syns[0];
            const antonyms = data[0].meta.ants[0];

            let hint = '';

            // Display up to 5 synonyms
            if (synonyms && synonyms.length > 0) {
                hint += `Synonyms: ${synonyms.slice(0, 5).join(", ")}`;
            }

            // Display up to 5 antonyms
            if (antonyms && antonyms.length > 0) {
                hint += hint ? '\n' : ''; // Add a newline if synonyms were displayed
                hint += `Antonyms: ${antonyms.slice(0, 5).join(", ")}`;
            }

            return hint || "No synonyms or antonyms found for this word.";
        }
    } catch (error) {
        console.error('Error fetching synonym/antonym:', error);
    }
    return "No synonyms or antonyms found for this word.";
}

getRandomWord();
