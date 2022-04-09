const Keyboard = ({ letters, handleLetter }) => {
    return (
      <div className="max-w-md m-auto">
        <Row letters={letters} handleLetter={handleLetter} row="top" />
        <Row letters={letters} handleLetter={handleLetter} row="middle" />
        <Row letters={letters} handleLetter={handleLetter} row="bottom" />
      </div>
    );
  }

  
  const Row = ({ row, letters, handleLetter }) => {
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
  
  const Key = ({ output, status, handleLetter, width, display }) => {
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
        className={`h-12 rounded p-2 mx-1 font-bold bg-white ${bgColor} ${width}`}
        onClick={() => {
          handleLetter(output, "screen keyboard");
        }}
      >
        {display || output}
      </button>
    );
  }

  export default Keyboard