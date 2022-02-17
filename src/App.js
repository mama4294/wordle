import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Game />
      <Keyboard />
    </div>
  );
}

export default App;

const validWords = [];

function Header() {
  return (
    <div className="w-full border border-slate-100 p-2">
      <h1 className="text-3xl font-bold">Wordle</h1>
    </div>
  );
}

function Game() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Game</h1>
      <div className="flex flex-inline bg-slate-100 justify-center">
        <div className="gameTile">[]</div>
        <div className="gameTile">[]</div>
        <div className="gameTile">[]</div>
        <div className="gameTile">[]</div>
        <div className="gameTile">[]</div>
      </div>
    </>
  );
}

function Keyboard() {
  return <h1 className="text-3xl font-bold underline">Keyboard</h1>;
}
