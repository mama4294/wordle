import "./App.css";
import {useEffect, useState, useRef} from 'react';

function App() {
  const answerWord = "genny"
  let answerArr = answerWord.toUpperCase().split("")
  const [stageInt, setStageInt] = useState(1);
  const [inputs, setInputs] = useState([
    {stage: "1", values: [], status:[]}, 
    {stage: "2", values: [], status:[]}, 
    {stage: "3", values: [], status:[]}, 
    {stage: "4", values: [], status:[]}, 
    {stage: "5", values: [], status:[]}, 
    {stage: "6", values: [], status:[]},
  ]);
  const [letters, setLetters]=useState([
    {value: "Q", status: "", row: "top"}, 
    {value: "W", status: "", row: "top"}, 
    {value: "E", status: "", row: "top"}, 
    {value: "R", status: "", row: "top"}, 
    {value: "T", status: "", row: "top"}, 
    {value: "Y", status: "", row: "top"}, 
    {value: "U", status: "", row: "top"}, 
    {value: "I", status: "", row: "top"}, 
    {value: "O", status: "", row: "top"}, 
    {value: "P", status: "", row: "top"}, 
    {value: "A", status: "", row: "middle"}, 
    {value: "S", status: "", row: "middle"}, 
    {value: "D", status: "", row: "middle"}, 
    {value: "F", status: "", row: "middle"}, 
    {value: "G", status: "", row: "middle"}, 
    {value: "H", status: "", row: "middle"}, 
    {value: "J", status: "", row: "middle"}, 
    {value: "K", status: "", row: "middle"}, 
    {value: "L", status: "", row: "middle"}, 
    {value: "Z", status: "", row: "bottom"}, 
    {value: "X", status: "", row: "bottom"}, 
    {value: "C", status: "", row: "bottom"}, 
    {value: "V", status: "", row: "bottom"}, 
    {value: "B", status: "", row: "bottom"}, 
    {value: "N", status: "", row: "bottom"}, 
    {value: "M", status: "", row: "bottom"}, 
  ])

  function useEventLister(eventName, handler, element=window){
    const savedHandler = useRef();

    // Update saved handler if handler changes
    useEffect(()=>{
      savedHandler.current = handler
    },[handler])

    useEffect(()=>{
      const isSupported = element && element.addEventListener
      if(!isSupported) return;

      const eventListener = event => savedHandler.current(event)
      element.addEventListener(eventName, eventListener)

      //Cleanup
      return()=>{
        element.removeEventListener(eventName,eventListener)
      }
    },[eventName,element])

  }

 const handleKeyPress = (event) =>{
    handleLetter(event.key, "keyboard")
  }

  function isLetter(c) {
    return /^[A-Z]$/i.test(c);
  }

  function changeLetterStatus(letter, status){
    const letterIndex = letters.findIndex((obj) => obj.value === letter)
    if(letters[letterIndex].status==="correct"|| status==='correct')
      letters[letterIndex].status="correct"

    else if(status === "close"){
      letters[letterIndex].status="close"

    }else if(status === "incorrect"){
      letters[letterIndex].status="incorrect"

    }
  }

  function validateWord(word){
    let valid = true;
    if(word.length != 5) valid= false;

    return valid
  }


  const handleLetter = (letter, loc) =>{
    console.log(`Handling ${letter} from ${loc}`)
    let currentInputs = [...inputs];
    let currentStageInput = currentInputs[stageInt-1]
    console.log(currentInputs)
    if(letter === "Enter"){
      console.log("submitting")
      const wordValid = validateWord(currentStageInput.values.join(''))
      if(wordValid){
        for (let i = 0; i<5; i++){  
          if(currentStageInput.values[i]===answerArr[i]){
           currentStageInput.status[i]="correct"
           changeLetterStatus(currentStageInput.values[i],"correct")
          }else if(answerArr.includes(currentStageInput.values[i])){
           currentStageInput.status[i]="close"
           changeLetterStatus(currentStageInput.values[i],"close")
          }else{
            currentStageInput.status[i]="incorrect"
            changeLetterStatus(currentStageInput.values[i],"incorrect")
          }
        }
        setStageInt(prevInt => prevInt + 1)
      }else{
        alert("Invalid Word")
      }



    }
    else if(letter === "Backspace"){
      console.log("deleating")
      currentStageInput.values.pop();
    }
    else if(isLetter(letter) && currentStageInput.values.length < 5){
      console.log(`Adding ${letter}`)
      currentStageInput.values.push(letter.toUpperCase());
    }
    currentInputs[stageInt-1] = currentStageInput;
    setInputs(currentInputs)
  }

  useEventLister('keydown', handleKeyPress)



  return (
    <div className="App">
      <Header />
      <Game letters={letters} setLetters={setLetters} stageInt={stageInt} setStageInt={setStageInt} inputs={inputs}/>
      <Keyboard letters={letters} handleLetter={handleLetter}/>
    </div>
  );
}

export default App;

// const validWords = [];

function Header() {
  return (
    <div className="w-full border-b border-slate-500 p-2 mb-6 pb-4">
      <h1 className="text-3xl font-bold">Wordle</h1>
    </div>
  );
}

function Game({inputs}) {

  return (
    <div className="mb-6">
    <GridRow inputs={inputs[0]}/>
    <GridRow inputs={inputs[1]}/>
    <GridRow inputs={inputs[2]}/>
    <GridRow inputs={inputs[3]}/>
    <GridRow inputs={inputs[4]}/>
    <GridRow inputs={inputs[5]}/>
    </div>
  );
}

function GridRow({inputs}){
  const values = inputs.values;
  const status = inputs.status;

  return(
  <div className="flex flex-inline justify-center">
      {/* <p className="absolute top-0">Not in word list</p> */}
      <GameTile value ={values[0]} status={status[0]}/>
      <GameTile value ={values[1]} status={status[1]}/>
      <GameTile value ={values[2]} status={status[2]}/>
      <GameTile value ={values[3]} status={status[3]}/>
      <GameTile value ={values[4]} status={status[4]}/>
</div>
  )
}

function GameTile({value, status}){

  let bgColor = ""
  if(status==="correct"){
    bgColor = "bg-green-400 text-white border-0"
  }else if (status==="close"){
    bgColor = "bg-yellow-400 text-white border-0"
  }else if (status==="incorrect"){
    bgColor = "bg-slate-500 text-white border-0"
  }

  return(
    <p
    className={` border h-16 w-16 md:h-24 md:w-24 border-slate-300 m-1 text-4xl font-bold flex items-center justify-center ${bgColor}`}
    >
    {value}
    </p>  
  )
}

function Keyboard({letters, handleLetter}){
  return (
    <div className="max-w-md m-auto">
      <Row letters={letters} handleLetter={handleLetter} row="top"/>
      <Row letters={letters} handleLetter={handleLetter} row="middle"/>
      <Row letters={letters} handleLetter={handleLetter} row="bottom"/>
    </div>

  )
}

function Row({row, letters, handleLetter}){
return (
  <div className="w-full">
    <div className="w-full flex justify-center p-1">

    {row==="bottom" && <Key  output="Enter" handleLetter={handleLetter} width="w-14"/> }
      {letters.map((letter) =>{
          return ( 
            letter.row === row && <Key key={letter.value} output={letter.value} status={letter.status} handleLetter={handleLetter} width="w-10"/>
            )
      })}
      {row==="bottom" && <Key output="Backspace" display="Del" handleLetter={handleLetter} width="w-14"/> }

    </div>
  </div>
)
}

function Key({output, status, handleLetter, width, display}){
  let bgColor = "bg-slate-200"
  if(status==="correct"){
    bgColor = "bg-green-400 text-white"
  }else if (status==="close"){
    bgColor = "bg-yellow-400"
  }else if (status==="incorrect"){
    bgColor = "bg-slate-500 text-white"
  }
  return (
    <button className={`h-12 rounded p-2 mx-1 font-bold ${bgColor} ${width}`}
    onClick={() =>{handleLetter(output, "screen keyboard")}}>
      {display || output}
    </button>
  )
}

