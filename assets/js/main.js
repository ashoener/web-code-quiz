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

const game = {
  started: false,
  question: 0,
  timer: 0,
  gameInterval: 0,
  answerStateTimeout: 0,
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
};

/**
 * @param {HTMLElement} el
 */
function toggleElementDisplay(el) {
  el.classList.toggle("hidden");
}

startButton.addEventListener("click", () => game.start());
