import "./App.css";
import { useEffect, useState, useRef } from "react";
import { acceptableWords } from "./acceptableWords";
import { answerWords } from "./answerWords";

function App() {
  //Inital values
  const initialInputs = [
    { stage: "1", values: [], status: [] },
    { stage: "2", values: [], status: [] },
    { stage: "3", values: [], status: [] },
    { stage: "4", values: [], status: [] },
    { stage: "5", values: [], status: [] },
    { stage: "6", values: [], status: [] },
  ];
  const initalLetters = [
    { value: "Q", status: "", row: "top" },
    { value: "W", status: "", row: "top" },
    { value: "E", status: "", row: "top" },
    { value: "R", status: "", row: "top" },
    { value: "T", status: "", row: "top" },
    { value: "Y", status: "", row: "top" },
    { value: "U", status: "", row: "top" },
    { value: "I", status: "", row: "top" },
    { value: "O", status: "", row: "top" },
    { value: "P", status: "", row: "top" },
    { value: "A", status: "", row: "middle" },
    { value: "S", status: "", row: "middle" },
    { value: "D", status: "", row: "middle" },
    { value: "F", status: "", row: "middle" },
    { value: "G", status: "", row: "middle" },
    { value: "H", status: "", row: "middle" },
    { value: "J", status: "", row: "middle" },
    { value: "K", status: "", row: "middle" },
    { value: "L", status: "", row: "middle" },
    { value: "Z", status: "", row: "bottom" },
    { value: "X", status: "", row: "bottom" },
    { value: "C", status: "", row: "bottom" },
    { value: "V", status: "", row: "bottom" },
    { value: "B", status: "", row: "bottom" },
    { value: "N", status: "", row: "bottom" },
    { value: "M", status: "", row: "bottom" },
  ];

  const [answerWord, setAnswerWord] = useState(() => newAnswer());
  let answerArr = answerWord.toUpperCase().split("");
  const [stageInt, setStageInt] = useState(1);
  const [inputs, setInputs] = useState(initialInputs);
  const [letters, setLetters] = useState(initalLetters);
  const [showModal, setShowModal] = useState({ visible: false, status: "win" });
  const [error, setError] = useState("");

  function useEventLister(eventName, handler, element = window) {
    const savedHandler = useRef();

    // Update saved handler if handler changes
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = (event) => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);

      //Cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    }, [eventName, element]);
  }

  const handleKeyPress = (event) => {
    handleLetter(event.key, "keyboard");
  };

  function isLetter(c) {
    return /^[A-Z]$/i.test(c);
  }

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

function Modal({ showModal, setShowModal, newGame, answerWord }) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                {showModal.status === "win" ? "Congratulations" : "So sorry"}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                {showModal.status === "win"
                  ? `You Won! The word was ${answerWord}`
                  : `You lost. The word was ${answerWord}`}
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => newGame()}
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

function Header() {
  return (
    <div className="w-full border-b border-slate-500 p-2 mb-6 pb-4">
      <h1 className="text-3xl font-bold">Wordle</h1>
    </div>
  );
}

function Game({ inputs, error }) {
  return (
    <div className="mb-6">
      {error && (
        <div className="flex justify-center">
          <p className="absolute top-16 rounded p-2 mx-1 font-bold bg-slate-800 text-white">
            {error}
          </p>
        </div>
      )}
      <GridRow inputs={inputs[0]} />
      <GridRow inputs={inputs[1]} />
      <GridRow inputs={inputs[2]} />
      <GridRow inputs={inputs[3]} />
      <GridRow inputs={inputs[4]} />
      <GridRow inputs={inputs[5]} />
    </div>
  );
}

function GridRow({ inputs }) {
  const values = inputs.values;
  const status = inputs.status;

  return (
    <div className="flex flex-inline justify-center">
      {/* <p className="absolute top-0">Not in word list</p> */}
      <GameTile value={values[0]} status={status[0]} />
      <GameTile value={values[1]} status={status[1]} />
      <GameTile value={values[2]} status={status[2]} />
      <GameTile value={values[3]} status={status[3]} />
      <GameTile value={values[4]} status={status[4]} />
    </div>
  );
}

function GameTile({ value, status }) {
  let bgColor = "";
  if (status === "correct") {
    bgColor = "bg-green-400 text-white border-0";
  } else if (status === "close") {
    bgColor = "bg-yellow-400 text-white border-0";
  } else if (status === "incorrect") {
    bgColor = "bg-slate-500 text-white border-0";
  }

  return (
    <p
      className={` border h-12 w-12 md:h-16 md:w-16 border-slate-300 m-1 text-4xl font-bold flex items-center justify-center ${bgColor}`}
    >
      {value}
    </p>
  );
}

function Keyboard({ letters, handleLetter }) {
  return (
    <div className="max-w-md m-auto">
      <Row letters={letters} handleLetter={handleLetter} row="top" />
      <Row letters={letters} handleLetter={handleLetter} row="middle" />
      <Row letters={letters} handleLetter={handleLetter} row="bottom" />
    </div>
  );
}

function Row({ row, letters, handleLetter }) {
  return (
    <div className="w-full">
      <div className="w-full flex justify-center p-1">
        {row === "bottom" && (
          <Key output="Enter" handleLetter={handleLetter} width="w-14" />
        )}
        {letters.map((letter) => {
          return (
            letter.row === row && (
              <Key
                key={letter.value}
                output={letter.value}
                status={letter.status}
                handleLetter={handleLetter}
                width="w-10"
              />
            )
          );
        })}
        {row === "bottom" && (
          <Key
            output="Backspace"
            handleLetter={handleLetter}
            width="w-14"
            display={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
}

function Key({ output, status, handleLetter, width, display }) {
  let bgColor = "bg-slate-200";
  if (status === "correct") {
    bgColor = "bg-green-400 text-white";
  } else if (status === "close") {
    bgColor = "bg-yellow-400";
  } else if (status === "incorrect") {
    bgColor = "bg-slate-500 text-white";
  }
  return (
    <button
      className={`h-12 rounded p-2 mx-1 font-bold ${bgColor} ${width}`}
      onClick={() => {
        handleLetter(output, "screen keyboard");
      }}
    >
      {display || output}
    </button>
  );
}
