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
const gameEndEl = document.getElementById("game-end");
const answerTypeEl = document.getElementById("answer-type");
const answerStateEl = document.getElementById("answer-state");

/**
 * @param {HTMLElement} el
 */
function toggleElementDisplay(el) {
  el.classList.toggle("hidden");
}
