const questions = [
  {
    name: "What kind of object does the document.querySelector() method return?",
    answers: ["String", "HTMLElement", "Array", "Boolean"],
    correct: 1,
  },
  {
    name: "Which method is used to display information in the javascript console?",
    answers: [
      "console.log",
      "console.warn",
      "console.error",
      "All of the above",
    ],
    correct: 3,
  },
  {
    name: "Which property of an array contains the amount of items inside?",
    answers: ["count", "size", "length"],
    correct: 2,
  },
  {
    name: "Which method reloads the page?",
    answers: [
      "window.reload()",
      "window.location.reload()",
      "document.reload()",
      "window.refresh()",
    ],
    correct: 1,
  },
  {
    name: "Which method adds an item to an array?",
    answers: ["push()", "unshift()", "add()", "pop()"],
    correct: 0,
  },
];

const viewScoresButton = document.getElementById("view-scores");
const timeRemainingEl = document.getElementById("time-remaining");
const mainHeaderEl = document.getElementById("main-header");
const startButton = document.getElementById("start-game");
const questionsEl = document.getElementById("game-questions");
const questionsList = questionsEl.querySelector("ol");
const gameEndEl = document.getElementById("game-end");
const answerTypeEl = document.getElementById("answer-type");
const answerStateEl = document.getElementById("answer-state");
const finalScoreEl = document.getElementById("final-score");
const gameEndFormEl = document.getElementById("game-end-form");
const initialsEl = document.getElementById("initials");
const gameEndFormButton = gameEndFormEl.querySelector("button");
const scoreDisplayEl = document.getElementById("score-display");
const scoresList = scoreDisplayEl.querySelector("ol");
const restartGameButton = document.getElementById("restart-game");
const clearHighscoresButton = document.getElementById("clear-highscores");

const game = {
  started: false,
  ended: true,
  question: 0,
  timer: 0,
  gameInterval: 0,
  answerStateTimeout: 0,
  scores: {},
  start() {
    if (this.started) return;
    this.started = true;
    this.ended = false;
    //   10 seconds per question
    this.timer = questions.length * 10;
    this.updateTimer();
    //   Hide game header
    toggleElementDisplay(mainHeaderEl);
    //   Show questions
    toggleElementDisplay(questionsEl);
    game.showQuestion(0);
    //   Update the timer every second
    this.gameInterval = setInterval(() => {
      this.timer--;
      this.updateTimer();
      // End game when timer reaches 0
      if (this.timer == 0) this.end();
    }, 1000);
  },
  end() {
    if (!this.started) return;
    this.started = false;
    clearInterval(this.gameInterval);
    finalScoreEl.innerText = this.timer;
    //   Hide questions
    toggleElementDisplay(questionsEl);
    //   Show end game screen
    toggleElementDisplay(gameEndEl);
  },
  //   Update timer in the header
  updateTimer() {
    timeRemainingEl.innerText = this.timer;
  },
  showQuestion(index) {
    this.question = index;
    const question = questions[index];
    //   Set the header to question name
    questionsEl.querySelector("h3").innerText = question.name;
    //   Reset questions list
    questionsList.innerHTML = "";
    for (let i in question.answers) {
      const answer = question.answers[i];
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.innerText = answer;
      button.addEventListener("click", () => {
        this.answerQuestion(i);
      });
      li.appendChild(button);
      questionsList.appendChild(li);
    }
  },
  answerQuestion(id) {
    const correct = questions[this.question].correct == id;
    answerStateEl.innerText = correct ? "Correct!" : "Wrong!";
    if (!this.answerStateTimeout) toggleElementDisplay(answerTypeEl);
    // If the answer is incorrect, decrease timer by 10
    if (!correct) {
      this.timer -= 10;
      //   If the timer went below 0, end the game and put the time back
      if (this.timer <= 0) {
        this.timer += 10;
        this.end();
      }
      this.updateTimer();
    }
    //   Hide the answer state after 1000ms
    if (this.answerStateTimeout) clearTimeout(this.answerStateTimeout);
    this.answerStateTimeout = setTimeout(() => {
      toggleElementDisplay(answerTypeEl);
      this.answerStateTimeout = 0;
    }, 1000);
    //   If this was the last question, end the game
    if (this.question == questions.length - 1) {
      this.end();
    } else {
      // Otherwise, move on to the next question
      this.question++;
      this.showQuestion(this.question);
    }
  },
  //   Load the scores from localStorage
  loadScores() {
    const scores = JSON.parse(localStorage.getItem("scores"));
    this.scores = scores ? scores : [];
  },
  //   Sort scores so the highest displays first
  sortScores() {
    this.scores.sort((a, b) => b.score - a.score);
  },
  saveScore(initials) {
    this.loadScores();
    this.sortScores();
    //   Maximum of 5 scores.
    //   Remove lowest score if it is lower than this one
    //   Otherwise, no changes are needed
    if (this.scores.length == 5) {
      if (this.scores[this.scores.length - 1].score > this.timer) {
        this.updateScoreDisplay();
        return;
      }
      this.scores.pop();
    }
    this.scores.push({ initials, score: this.timer });
    this.sortScores();
    this.saveScores();
    this.updateScoreDisplay();
  },
  saveScores() {
    //   Save scores to localStorage
    localStorage.setItem("scores", JSON.stringify(this.scores));
  },
  resetScores() {
    this.scores = [];
    this.saveScores();
    this.updateScoreDisplay();
  },
  updateScoreDisplay() {
    //   Reset questions list
    scoresList.innerHTML = "";
    for (let score of this.scores) {
      const li = document.createElement("li");
      li.innerText = `${score.initials} - ${score.score}`;
      scoresList.appendChild(li);
    }
  },
};

/**
 * Toggles whether an element is hidden or visible
 * @param {HTMLElement} el
 */
function toggleElementDisplay(el) {
  el.classList.toggle("hidden");
}

viewScoresButton.addEventListener("click", (e) => {
  if (!scoreDisplayEl.classList.contains("hidden")) return;
  if (game.started || !game.ended) return;
  game.loadScores();
  game.updateScoreDisplay();
  toggleElementDisplay(scoreDisplayEl);
  toggleElementDisplay(mainHeaderEl);
});

// Start the game when the start button is clicked
startButton.addEventListener("click", () => game.start());

initialsEl.addEventListener("keydown", (e) => {
  // Prevent keys from being added normally
  e.preventDefault();
  // Remove a key when backspace is pressed
  if (e.key == "Backspace" && initialsEl.value.length) {
    initialsEl.value = initialsEl.value.slice(0, -1);
  }
  // Don't allow more than maximum amount of characters
  if (initialsEl.value.length == initialsEl.maxLength) return;
  const key = e.key.toUpperCase();
  // Ensure this is an alphabetical character only
  if (key.length > 1) return;
  if (!key.match(/[A-Z]/)) return;
  // Add key to input
  initialsEl.value += key;
});

gameEndFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (initialsEl.value.length != 2) return;
  // Save initials to database
  game.saveScore(initialsEl.value);
  game.ended = true;
  toggleElementDisplay(scoreDisplayEl);
  toggleElementDisplay(gameEndEl);
});

restartGameButton.addEventListener("click", (e) => {
  toggleElementDisplay(scoreDisplayEl);
  toggleElementDisplay(mainHeaderEl);
});
clearHighscoresButton.addEventListener("click", (e) => game.resetScores());
