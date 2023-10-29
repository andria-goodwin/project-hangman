

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });


//   document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        closeAllModals();
      }
    });

//   });


  
 


    $('#show-hint-btn').click(()=>{
        var hintEl = document.createElement('p')
        // COLLIN this is where the definition text will go for the hint
        hintEl.textContent = "definition text here";
        document.querySelector('.box').appendChild(hintEl);
    })
  });



  
// datamuse api link currently showing relative things to animals
var randomWordApi = "https://api.datamuse.com/words?rel_trg=animals";

// dictionary api currently ready to add a word onto the end of the string
var definitionApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Pretend element for the word on the page that will be displaying the blank spaces Ex.) (_ _ _) for dog
// var guessingWordText = document.getElementById("guessingWord");

// fetch using the random word api and then passing the data to the storeData function
fetch(randomWordApi)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    storeData(data);
    console.log(data);
  });

//   Declaring variables that all the function will be using to set up the guessing portion of the game
var guessingWord = "";
var score = 0;
var guessingWordLetters = [];
var numOfBlankSpots = 0;
var wordDisplayed = [];

// Takes the data from the random word array and then uses math.random to get only one word from the long array
function storeData(randomWord) {
  var animals = [];
  for (var i = 0; i < randomWord.length - 1; i++) {
    animals[i] = randomWord[i];
  }
  guessingWord = animals[Math.floor(Math.random() * (animals.length - 1))];
  definitionApi += guessingWord.word;
  getDefinition();
  blankSpaces();
}

// blankSpaces function creates the (_ _ _) to show how many letters the word to guess is
function blankSpaces() {
  guessingWordLetters = guessingWord.word.split("");
  numOfBlankSpots = guessingWordLetters.length;
  wordDisplayed = [];

  for (var i = 0; i < numOfBlankSpots; i++) {
    wordDisplayed.push("_");
  }

  console.log(wordDisplayed.join(" "));
}

// Currently the getDefinition function is temporary just to show that it works to give a definition to the console
function getDefinition() {
  fetch(definitionApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

// Temporary spot for testing the keyboard element going onto the screen (not correctly linked to the right element/it doesn't exist yet)
var box = document.getElementById("box");
var c;
for (var i = 65; 90 >= i; i++) {
  // A-65, Z-90
  c = String.fromCharCode(i);
  var button = document.createElement("button");
  button.textContent = c;
  button.setAttribute("class", "button");
  box.append(button);
}

// Changes the color of the button currently to red (later this will have a function to check if it was correct or incorrect and put the color to display accordingly)
box.addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    var buttonEl = event.target;
    buttonEl.disabled = "true";
    $(buttonEl).addClass("is-danger");
    console.log($(buttonEl).text());
  }
});
