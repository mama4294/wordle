import "./App.css";
import { useState } from "react";
import { acceptableWords } from "./constants/acceptableWords";
import { answerWords } from "./constants/answerWords";
import Modal from "./components/modal";
import Header from "./components/header";
import Game from "./components/game";
import Keyboard from "./components/keyboard";
import { initialInputs, initalLetters } from "./constants/initial-values";
import useEventLister, { isLetter } from "./helpers/helper-functions";

function App() {
  const [answerWord, setAnswerWord] = useState(() => newAnswer());
  const [stageInt, setStageInt] = useState(1);
  const [inputs, setInputs] = useState(initialInputs);
  const [letters, setLetters] = useState(initalLetters);
  const [showModal, setShowModal] = useState({ visible: false, status: "win" });
  const [error, setError] = useState("");
  let answerArr = answerWord.toUpperCase().split("");

  const handleKeyPress = (event) => {
    event.preventDefault();
    handleLetter(event.key, "keyboard");
  };

  function changeLetterStatus(letter, status) {
    const letterIndex = letters.findIndex((obj) => obj.value === letter);
    if (letters[letterIndex].status === "correct" || status === "correct")
      letters[letterIndex].status = "correct";
    else if (status === "close") {
      letters[letterIndex].status = "close";
    } else if (status === "incorrect") {
      letters[letterIndex].status = "incorrect";
    }
  }

  function validateWord(word) {
    let valid = true;
    if (word.length !== 5) valid = false;
    if (!acceptableWords.includes(word.toLowerCase())) valid = false;

    return valid;
  }

  //Event listener for key presses. Special cases for enter and delete
  const handleLetter = (letter, loc) => {
    console.log(`Handling ${letter} from ${loc}`);
    let currentInputs = [...inputs];
    let currentStageInput = currentInputs[stageInt - 1];
    if (letter === "Enter") {
      //Special case: Submit for grading
      console.log("submitting");
      const wordValid = validateWord(currentStageInput.values.join(""));
      if (wordValid) {
        for (let i = 0; i < 5; i++) {
          if (currentStageInput.values[i] === answerArr[i]) {
            currentStageInput.status[i] = "correct";
            changeLetterStatus(currentStageInput.values[i], "correct");
          } else if (answerArr.includes(currentStageInput.values[i])) {
            currentStageInput.status[i] = "close";
            changeLetterStatus(currentStageInput.values[i], "close");
          } else {
            currentStageInput.status[i] = "incorrect";
            changeLetterStatus(currentStageInput.values[i], "incorrect");
          }
        }
        if (currentStageInput.values.join("") === answerArr.join("")) {
          //Winner winner
          setShowModal({ visible: true, status: "win" });
        } else if (stageInt > 5) {
          //Loser Loser
          setShowModal({ visible: true, status: "false" });
        } else {
          //Advance to next stage
          setStageInt((prevInt) => prevInt + 1);
        }
      } else {
        showError("Invalid Word");
      }
    } else if (letter === "Backspace") {
      //Special case: Delete
      console.log("deleating");
      currentStageInput.values.pop();
    } else if (isLetter(letter) && currentStageInput.values.length < 5) {
      //Pressed key is a letter and there is space avalible
      console.log(`Adding ${letter}`);
      currentStageInput.values.push(letter.toUpperCase());
    }
    currentInputs[stageInt - 1] = currentStageInput;
    setInputs(currentInputs);
  };

  function newAnswer() {
    const length = answerWords.length;
    //Select a random index of acceptable words
    const index = Math.floor(Math.random() * length);
    return answerWords[index];
  }

  function showError(errorMsg) {
    setTimeout(() => {
      setError("");
    }, 2000);
    setError(errorMsg); // show for 2 second
  }

  function newGame() {
    setAnswerWord(newAnswer());
    setInputs(initialInputs);
    setLetters(initalLetters);
    setStageInt(1);
    setShowModal({ visible: false, status: "win" });
    window.location.reload(false);
    // console.log(inputs);
    // console.log(letters);
    // console.log(stageInt);
  }

  useEventLister("keydown", handleKeyPress);

  return (
    <div className="App">
      <Header />
      {showModal.visible && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          newGame={newGame}
          answerWord={answerWord}
        />
      )}
      <Game
        letters={letters}
        setLetters={setLetters}
        stageInt={stageInt}
        setStageInt={setStageInt}
        inputs={inputs}
        error={error}
      />
      <Keyboard letters={letters} handleLetter={handleLetter} />
    </div>
  );
}

export default App;

// const validWords = [];
