import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

function App() {
  return (
    <>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </>
  );
}

export default App;
