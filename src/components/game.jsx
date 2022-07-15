import {motion} from "framer-motion"
import { useState } from "react";

const Game = ({ inputs, error }) => {
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

  export default Game
  
  function GridRow({ inputs }) {
    const values = inputs.values;
    const status = inputs.status;
  
    return (
      <div className="flex flex-inline justify-center">
        {/* <p className="absolute top-0">Not in word list</p> */}
        <GameTile i={0} value={values[0]} status={status[0]} />
        <GameTile i={1} value={values[1]} status={status[1]} />
        <GameTile i={2} value={values[2]} status={status[2]} />
        <GameTile i={3} value={values[3]} status={status[3]} />
        <GameTile i={4} value={values[4]} status={status[4]} />
      </div>
    );
  }
  
  function GameTile({ value, status, i }) {
    let [halfFlipped, setHalfFlipped] = useState(false);
    let bgColor = "";
    let rotation = 0

    function onUpdate(latest) {
      if(latest.rotateX > 90){
        setHalfFlipped(true)
      }else{
        setHalfFlipped(false)
      }
    }

    if(status === 'correct' || status === 'close' || status === 'incorrect'){
      rotation = 180
    }

    if(halfFlipped){
      if (status === "correct") {
        bgColor = "bg-green-400 text-white border-0";
      } else if (status === "close") {
        bgColor = "bg-yellow-400 text-white border-0";
      } else if (status === "incorrect") {
        bgColor = "bg-slate-500 text-white border-0";
      }
    }


    return (
      <motion.div
        animate={{rotateX: rotation}}
        transition={{type:'spring', duration: 2, bounce: 0.3, delay: i*0.2}}
        onUpdate={onUpdate}>
          <div className={halfFlipped? "rotate-x-180":""}>
            <p
            className={`border h-12 w-12 md:h-16 md:w-16 border-slate-300 m-1 text-4xl font-bold flex items-center justify-center ${bgColor}`}
          >
            {value}
          </p>
          </div>
      </motion.div>
    );
  }
  

  
  