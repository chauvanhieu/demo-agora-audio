import { Link, Route, Routes } from "react-router-dom";
import Room from "./room";

function App() {
  return (
    <>
      <Routes>
        <Route path="/:room_id" element={<Room />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to={`/4324324`}>Room</Link>
    </>
  );
};
