import Landing from "./components/Landing";
import KanjiTrainer from "./components/KanjiTrainer/KanjiTrainer";
import Results from "./components/Results";
import Error from "./components/Error";


import { Route, Routes } from "react-router-dom";

function App() {
  
  return (
    <Routes>
      <Route index element = { <Landing /> } />
      <Route path="/train" element = { <KanjiTrainer /> } />
      <Route path="/results" element = { <Results /> } />
      <Route path="/error" element = { <Error /> } />
    </Routes>
  );
}

export default App;
