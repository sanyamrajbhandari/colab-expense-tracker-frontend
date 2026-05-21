import routes from "./routes/Routes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
  // return(
  //   <AddTransaction/>
  // );
};

export default App;
