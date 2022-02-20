import "./App.css";
import {useState} from 'react';

function App() {
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

  return (
    <div className="App">
      <Header />
      <Game letters={letters} setLetters={setLetters}/>
      <Keyboard letters={letters}/>
    </div>
  );
}

export default App;

// const validWords = [];

function Header() {
  return (
    <div className="w-full border-b border-slate-500 p-2 mb-10 pb-4">
      <h1 className="text-3xl font-bold">Wordle</h1>
    </div>
  );
}

function Game({letters, setLetters}) {
  const [stageInt, setStageInt] = useState(1);
  return (
    <div className="mb-10">
    <GridRow active={stageInt===1} setStageInt={setStageInt} stageInt={stageInt} setLetters={setLetters} letters={letters}/>
    <GridRow active={stageInt===2} setStageInt={setStageInt} stageInt={stageInt} setLetters={setLetters} letters={letters}/>
    <GridRow active={stageInt===3} setStageInt={setStageInt} stageInt={stageInt} setLetters={setLetters} letters={letters}/>
    <GridRow active={stageInt===4} setStageInt={setStageInt} stageInt={stageInt} setLetters={setLetters} letters={letters}/>
    <GridRow active={stageInt===5} setStageInt={setStageInt} stageInt={stageInt} setLetters={setLetters} letters={letters}/>
    </div>
  );
}

function GridRow({active, setStageInt, stageInt, setLetters, letters}){

  const [letter1, setLetter1] = useState("")
  const [letter2, setLetter2] = useState("")
  const [letter3, setLetter3] = useState("")
  const [letter4, setLetter4] = useState("")
  const [letter5, setLetter5] = useState("")
  const [guess, setGuess] = useState('')
  const [resultsArr, setResultArr]=useState(["unknown","unknown","unknown","unknown","unknown"])

  const handleSubmit = (event) =>{
    event.preventDefault();
    const answerWord = "genny"
    let answerArr = answerWord.toUpperCase().split("")
    const guessArr = [letter1, letter2, letter3, letter4, letter5]

    setGuess(guessArr.join(''))

    //determine if the letters are correct
    let tempArr = [];
    let lettersCopy = [...letters];
    let letterGuesses = [];
    for (let i = 0; i<5; i++){  
      
       //create copy of letters
      const objIndex = lettersCopy.findIndex(letter => letter.value == guessArr[i])
      if(guessArr[i]===answerArr[i]){
        tempArr[i]="correct"
        lettersCopy[objIndex].status = "correct"
      }else if(answerArr.includes(guessArr[i])){
        tempArr[i]="close"
        lettersCopy[objIndex].status = "close"
      }else{
        tempArr[i]="incorrect"
        lettersCopy[objIndex].status = "incorrect"
      }
    }

    setLetters(lettersCopy)
    setResultArr(tempArr)
    setStageInt(prevInt => prevInt + 1)

    //Set focus to next grid
    const forms = document.querySelectorAll("form");
    console.log(forms[stageInt].elements[0])
    forms[stageInt].elements[0].focus();
  }

  const changeTileFocus = (int,dir) =>{
    if (dir === "inc" && int < 4){
      return int + 1
    }
    else if (dir === "dec" && int >0 ){
      return int - 1
    }
    else return int;
  }

  const handleKeyUp = (event) => {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);
    if (event.key.toLowerCase() === "backspace") {
      form.elements[changeTileFocus(index, "dec")].focus();
    }else if (event.key.toLowerCase() === "enter") {
      handleSubmit(event)
    }else if (event.key.toLowerCase() === "tab") {
      //nothing
    }else{
      form.elements[changeTileFocus(index, "inc")].focus();
    }
  }


  return(
  <div className="flex flex-inline justify-center">
    <form onSubmit={handleSubmit}>
      {/* <p className="absolute top-0">Not in word list</p> */}
      <GameTile handleKeyUp={handleKeyUp} value ={letter1} onChange={(e)=>setLetter1(e.target.value.toUpperCase())} status={resultsArr[0]} locked={!active}/>
      <GameTile handleKeyUp={handleKeyUp} value ={letter2} onChange={(e)=>setLetter2(e.target.value.toUpperCase())} status={resultsArr[1]} locked={!active}/>
      <GameTile handleKeyUp={handleKeyUp} value ={letter3} onChange={(e)=>setLetter3(e.target.value.toUpperCase())} status={resultsArr[2]} locked={!active}/>
      <GameTile handleKeyUp={handleKeyUp} value ={letter4} onChange={(e)=>setLetter4(e.target.value.toUpperCase())} status={resultsArr[3]} locked={!active}/>
      <GameTile handleKeyUp={handleKeyUp} value ={letter5} onChange={(e)=>setLetter5(e.target.value.toUpperCase())} status={resultsArr[4]} locked={!active}/>
      {/* {active && <button type="sumbit">Enter</button>} */}
  </form>
</div>
  )
}

function GameTile({handleKeyUp, onChange, value, status, locked}){

  return(
    <input
    type="text"
    className={`border h-16 w-16 md:h-24 md:w-24 border-slate-500 m-1 text-center text-4xl font-bold ${status==="correct" ? "bg-green-400" : "" } ${status==="incorrect" ? "bg-slate-400" : "" }  ${status==="close" ? "bg-yellow-400" : "" }`}
    onKeyUp={handleKeyUp}
    onChange={onChange}
    value={value}
    maxLength='1'
    disabled={locked}
    />  
  )
}

function Keyboard({letters}){
  return (
    <>
      <Row letters={letters} row="top"/>
      <Row letters={letters} row="middle"/>
      <Row letters={letters} row="bottom"/>
    </>

  )
}

function Row({row, letters}){
return (
  <div className="w-full">
    <div className="w-full flex justify-between p-2">
      {letters.map((letter) =>{
          return ( letter.row === row && <Key key={letter.value} value={letter.value} status={letter.status} />)
      })}
    </div>
  </div>
)
}

function Key({value, status}){
  let bgColor = "bg-slate-200"
  if(status==="correct"){
    bgColor = "bg-green-400"
  }else if (status==="close"){
    bgColor = "bg-yellow-400"
  }else if (status==="incorrect"){
    bgColor = "bg-slate-500"
  }
  return (
    <button className={`w-8 h-10 rounded ${bgColor}`}
    onClick={() =>{console.log(value)}}>
      {value}
    </button>
  )
}

