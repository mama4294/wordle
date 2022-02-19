import "./App.css";
import {useState} from 'react';

function App() {
  return (
    <div className="App">
      <Header />
      <Game />
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

function Game() {
  const [stageInt, setStageInt] = useState(1);
  return (
    <>
    <GridRow active={stageInt===1} setStageInt={setStageInt} stageInt={stageInt}/>
    <GridRow active={stageInt===2} setStageInt={setStageInt} stageInt={stageInt}/>
    <GridRow active={stageInt===3} setStageInt={setStageInt} stageInt={stageInt}/>
    <GridRow active={stageInt===4} setStageInt={setStageInt} stageInt={stageInt}/>
    <GridRow active={stageInt===5} setStageInt={setStageInt} stageInt={stageInt}/>
    </>
  );
}

function GridRow({active, setStageInt, stageInt}){

  const [letter1, setLetter1] = useState("")
  const [letter2, setLetter2] = useState("")
  const [letter3, setLetter3] = useState("")
  const [letter4, setLetter4] = useState("")
  const [letter5, setLetter5] = useState("")
  const [word, setWord] = useState('')
  const [resultsArr, setResultArr]=useState(["unknown","unknown","unknown","unknown","unknown"])

  const handleSubmit = (event) =>{
    event.preventDefault();
    const answerWord = "genny"
    let answerArr = answerWord.toUpperCase().split("")
    const guessArr = [letter1, letter2, letter3, letter4, letter5]

    setWord(guessArr.join(''))
    console.log(answerArr)
    console.log(guessArr)   
    console.log(word)

    //determine if the letters are correct
    let tempArr = [];
    for (let i = 0; i<5; i++){  
      if(guessArr[i]===answerArr[i]){
        tempArr[i]="correct"
      }else if(answerArr.includes(guessArr[i])){
        tempArr[i]="close"
      }else{
        tempArr[i]="incorrect"
      }
    }
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

