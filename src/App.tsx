import "./global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context";
import { routes } from "@/routes";
import { Header } from "@/components";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
