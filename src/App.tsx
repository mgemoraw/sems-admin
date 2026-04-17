import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { token } = useContext(AuthContext);

  return token ? <Dashboard /> : <Auth />;
}