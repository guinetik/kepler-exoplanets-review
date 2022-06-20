import { Outlet, Link } from "react-router-dom";
import StarsBg from "./components/bg";
import KeplerNav from "./components/nav";


export default function App() {
  return (
    <div>
      
      <KeplerNav/>
      <Outlet />
      <StarsBg/>
    </div>
  );
}
