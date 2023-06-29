import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const isLogged = window.localStorage.getItem("LoggedIn");

  return (
    <div className="App">
      <Router>
        {isLogged == "true" ? <Dashboard /> : <Login />}
        <Routes>
          {/* routes should display in the login page will be here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
