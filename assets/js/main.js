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
    this.timer = questions.length * 10;
    this.updateTimer();
    toggleElementDisplay(mainHeaderEl);
    toggleElementDisplay(questionsEl);
    game.showQuestion(0);
    this.gameInterval = setInterval(() => {
      this.timer--;
      this.updateTimer();
    }, 1000);
  },
  end() {
    if (!this.started) return;
    this.started = false;
    clearInterval(this.gameInterval);
    finalScoreEl.innerText = this.timer;
    toggleElementDisplay(questionsEl);
    toggleElementDisplay(gameEndEl);
  },
  updateTimer() {
    timeRemainingEl.innerText = this.timer;
  },
  showQuestion(index) {
    this.question = index;
    const question = questions[index];
    questionsEl.querySelector("h3").innerText = question.name;
    questionsList.innerHTML = "";
    for (let i in question.answers) {
      const answer = question.answers[i];
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.innerText = answer;
      button.addEventListener("click", (e) => {
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
    if (!correct) {
      this.timer -= 10;
      if (this.timer <= 0) {
        this.timer += 10;
        this.end();
      }
      this.updateTimer();
    }
    if (this.answerStateTimeout) clearTimeout(this.answerStateTimeout);
    this.answerStateTimeout = setTimeout(() => {
      toggleElementDisplay(answerTypeEl);
      this.answerStateTimeout = 0;
    }, 1000);
    if (this.question == questions.length - 1) {
      this.end();
    } else {
      this.question++;
      this.showQuestion(this.question);
    }
  },
  loadScores() {
    const scores = JSON.parse(localStorage.getItem("scores"));
    this.scores = scores ? scores : [];
    this.sortScores();
  },
  sortScores() {
    this.scores.sort((a, b) => a.score - b.score);
  },
  saveScore(initials) {
    this.loadScores();
    if (this.scores.length == 5) this.scores.pop();
    this.scores.push({ initials, score: this.timer });
    this.sortScores();
    localStorage.setItem("scores", JSON.stringify(this.scores));
  },
};

/**
 * @param {HTMLElement} el
 */
function toggleElementDisplay(el) {
  el.classList.toggle("hidden");
}

startButton.addEventListener("click", () => game.start());
initialsEl.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.key == "Backspace" && initialsEl.value.length) {
    initialsEl.value = initialsEl.value.slice(0, -1);
  }
  if (initialsEl.value.length == initialsEl.maxLength) return;
  const key = e.key.toUpperCase();
  if (key.length > 1) return;
  if (!key.match(/[A-Z]/)) return;
  initialsEl.value += key;
});
gameEndFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (initialsEl.value.length != 2) return;
  game.saveScore(initialsEl.value);
});
