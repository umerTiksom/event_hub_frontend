import "./App.css";
import Navbar from "./components/Navbar";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <MainLayout>
        <Home />
      </MainLayout>
    </>
  );
}

export default App;
