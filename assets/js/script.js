// document.addEventListener("DOMContentLoaded", function () {
//   var elems = document.querySelectorAll(".modal");
//   var instances = M.Modal.init(elems);
// });

//   document.addEventListener('DOMContentLoaded', () => {
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

  async function showHint() {
    $(".hint-text").remove();
    $("#hint-question").addClass("hide");
    $("#hint-text-container").removeClass("hide");
    var hintEl = document.createElement("p");
    // this is where the definition text will go for the hint
    hintEl.textContent = await getDefinition();
    $(hintEl).addClass("hint-text");
    document.querySelector("#hint-text-container").appendChild(hintEl);
    updateStrikes();
  }

  $("#show-hint-btn").click(showHint);

  // dictionary api currently ready to add a word onto the end of the string
  var definitionApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  // Calls the random word api and starts the storeData function
  getRandomWords();

  // fetch using the random word api and then passing the data to the storeData function
  function getRandomWords() {
    var randomWordApi = "https://api.datamuse.com/words?rel_trg=";
    var topic = localStorage.getItem("topic");
    randomWordApi += topic;

    $("#game-topic").text(topic);

    fetch(randomWordApi)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        storeData(data);
      });
  }
  //   Declaring variables that all the function will be using to set up the guessing portion of the game
  var guessingWord = {
    word: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    score: 0,
  };
  var score = 0;
  var guessingWordLetters = [];
  var numOfBlankSpots = 0;
  var wordDisplayed = [];
  var definition = "";
  var strikes = 7;
  $("#strikes").text(strikes);

  // Takes the data from the random word array and then uses math.random to get only one word from the long array
  function storeData(wordArray) {
    var targetLength;
    var difficulty = localStorage.getItem("difficulty");
    if (strikes === 0) {
      setTimeout(() => {
        gameOver();
        document.getElementById("answer").innerHTML =
          "The answer was " + guessingWord.word;
      }, 500);
    }
    // }

    $("#game-mode").text(difficulty);

    switch (difficulty) {
      case "Easy":
        targetLength = [2, 5];
        break;

      case "Medium":
        targetLength = [6, 8];
        break;

      case "Hard":
        targetLength = [9, 25];
        break;
    }

    // Checks to see if the word meets the criteria and gets another word if it does not meet it
    while (
      guessingWord.word.length < targetLength[0] ||
      guessingWord.word.length > targetLength[1]
    ) {
      guessingWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    }
    definitionApi += guessingWord.word;
    guessingWord.word = guessingWord.word.toUpperCase();
    getDefinition();
    blankSpaces();
  }

  // Takes a strike away and updates text element
  function updateStrikes() {
    if (strikes != 0) {
      strikes--;
    }
    updateStrikesPicture();
    $("#strikes").text(strikes);

    if (strikes === 0) {
      $("#btn-box").empty();
      setTimeout(() => {
        gameOver();
        document.getElementById("answer").innerHTML =
          "The answer was " + guessingWord.word;
      }, 500);
    }
  }

  // Changes the picture according to the amount of strikes
  function updateStrikesPicture() {
    switch (strikes) {
      case 7:
        $(".strike-images").addClass("hide");
        $("#start-game-picture").removeClass("hide");
        break;
      case 6:
        $(".strike-images").addClass("hide");
        $("#strike1").removeClass("hide");
        break;
      case 5:
        $(".strike-images").addClass("hide");
        $("#strike2").removeClass("hide");
        break;
      case 4:
        $(".strike-images").addClass("hide");
        $("#strike3").removeClass("hide");
        break;
      case 3:
        $(".strike-images").addClass("hide");
        $("#strike4").removeClass("hide");
        break;
      case 2:
        $(".strike-images").addClass("hide");
        $("#strike5").removeClass("hide");
        break;
      case 1:
        $(".strike-images").addClass("hide");
        $("#strike6").removeClass("hide");
        break;
      case 0:
        $(".strike-images").addClass("hide");
        $("#game-over").removeClass("hide");
        break;
    }
  }

  // Function to end the game when the strikes hit 0
  function gameOver() {
    $("#modal-js-high-scores").addClass("is-active");
    $("#leaderboard-score").text(score);
  }

  // save scores to local storage
  $("#leaderboard-submission").on("submit", function (e) {
    e.preventDefault();

    var name = $("#first-name").val().trim();

    // make sure they enter a name
    if (name === "") {
      alert("You must enter a name to save your score.");
    } else {
      var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];

      var newHighscore = {
        score: $("#leaderboard-score").text(),
        name: name,
      };
      highscores.push(newHighscore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
      window.location.replace("index.html");
    }
  });

  // blankSpaces function creates the (_ _ _) to show how many letters the word to guess is
  function blankSpaces() {
    guessingWordLetters = guessingWord.word.split("");
    numOfBlankSpots = guessingWordLetters.length;
    wordDisplayed = [];

    for (var i = 0; i < numOfBlankSpots; i++) {
      wordDisplayed.push("_");
    }

    $("#letter-box").text(wordDisplayed.join(" "));
  }

  // Currently the getDefinition function is temporary just to show that it works to give a definition to the console
  function getDefinition() {
    // console.log(definitionApi);
    return fetch(definitionApi)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // If the api cannot find a word this error message will display instead
        if (data.title == "No Definitions Found") {
          return "Sorry we couldn't find a definition for your word (blame max)";
        } else {
          return data[0].meanings[0].definitions[0].definition;
        }
      });

    // return definition;
  }

  // Temporary spot for testing the keyboard element going onto the screen (not correctly linked to the right element/it doesn't exist yet)
  var box = document.getElementById("btn-box");
  function createButtons() {
    var c;
    for (var i = 65; 90 >= i; i++) {
      // A-65, Z-90
      c = String.fromCharCode(i);
      var button = document.createElement("button");
      button.textContent = c;
      button.setAttribute("class", "button font-metal-mania");
      button.setAttribute("id", "ltr-btn");
      box.append(button);
    }
  }

  createButtons();

  // Setting variables back so user can play again without refreshing
  function reset() {
    setTimeout(() => {
      $("#hint-text-container").addClass("hide");
      $(".strike-images").addClass("hide");
      $("#hint-question").removeClass("hide");
      updateStrikesPicture();
      $("#btn-box").empty();
      createButtons();
      $(".button").removeAttr("disabled");
      getRandomWords();
      guessingWord = {
        word: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        score: 0,
      };
      definitionApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    }, 1000);
  }

  // Changes the color of the button currently to red (later this will have a function to check if it was correct or incorrect and put the color to display accordingly)
  box.addEventListener("click", function (event) {
    if (event.target.matches("button")) {
      var buttonEl = event.target;
      buttonEl.disabled = "true";
      checkIfMatches(buttonEl);
    }
  });

  // Function to check if the key pressed matches any of the letters in the word.
  function checkIfMatches(buttonEl) {
    var letterInWord = false;

    var letter = $(buttonEl).text();

    for (var i = 0; i < numOfBlankSpots; i++) {
      if (letter == guessingWord.word[i]) {
        letterInWord = true;
      }
    }

    if (letterInWord) {
      for (var j = 0; j < numOfBlankSpots; j++) {
        if (guessingWord.word[j] === letter) {
          wordDisplayed[j] = letter;
        }
      }
      $(buttonEl).removeAttr("id");
      $(buttonEl).addClass("is-success");
    } else {
      updateStrikes();
      $(buttonEl).removeAttr("id");
      $(buttonEl).addClass("is-danger");
    }

    $("#letter-box").text(wordDisplayed.join(" "));
    checkWin();
  }

  // Checks if the word is complete
  function checkWin() {
    var difficulty = localStorage.getItem("difficulty");

    if (guessingWord.word === wordDisplayed.join("")) {
      $("#modal-js-correct-word").addClass("is-active");

      switch (difficulty) {
        case "Easy":
          score++;
          break;
        case "Medium":
          score += 2;
          break;
        case "Hard":
          score += 3;
      }
      reset();
    }
  }
});
