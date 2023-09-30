const questions = [
  {
    name: "Question 1",
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    correct: 0,
  },
  {
    name: "Question 2",
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    correct: 1,
  },
  {
    name: "Question 3",
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    correct: 2,
  },
  {
    name: "Question 4",
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    correct: 3,
  },
  {
    name: "Question 5",
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    correct: 0,
  },
];

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

const game = {
  started: false,
  question: 0,
  timer: 0,
  gameInterval: 0,
  answerStateTimeout: 0,
  scores: {},
  start() {
    if (this.started) return;
    this.started = true;
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
    this.scores.sort((a, b) => a.score - b.score);
  },
  saveScore(initials) {
    this.loadScores();
    this.sortScores();
    //   Maximum of 5 scores.
    //   Remove lowest score if it is lower than this one
    //   Otherwise, no changes are needed
    if (this.scores.length == 5) {
      if (this.scores[this.scores.length - 1].score > this.timer) return;
      this.scores.pop();
    }
    this.scores.push({ initials, score: this.timer });
    this.sortScores();
    //   Save scores to localStorage
    localStorage.setItem("scores", JSON.stringify(this.scores));
  },
};

/**
 * Toggles whether an element is hidden or visible
 * @param {HTMLElement} el
 */
function toggleElementDisplay(el) {
  el.classList.toggle("hidden");
}

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
});
