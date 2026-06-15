import { AppRoutes } from "./routes/AppRoutes";
import { Container as ModalContainer } from "react-modal-promise";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <ModalContainer />
      <AppRoutes />
    </>
  );
}

export default App;
