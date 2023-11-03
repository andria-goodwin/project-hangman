document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      closeAllModals();
    }
  });
});

$("#start-game-btn").click(() => {
  var difficulty = $("#difficulty-selection").val();
  var topic = $("#topic-selection").val();

  localStorage.setItem("topic", topic);
  localStorage.setItem("difficulty", difficulty);
});

// Using local storage to add high scores onto the modal
function showHighscores() {
  // getItem "highscores" from localStorage or set to an empty array
  var highscore = JSON.parse(window.localStorage.getItem("highscores")) || [];

  // sorts highscores from highest to lowest
  highscore.sort(function (a, b) {
    return b.score - a.score;
  });

  for (var i = 0; i < highscore.length; i += 1) {
    // create list item for each highscore
    var liEl = document.createElement("li");
    liEl.textContent = highscore[i].name + " - " + highscore[i].score;

    // display highscores to the page
    var olEl = document.querySelector("#highscore-list");
    olEl.appendChild(liEl);
  }
}

showHighscores();
