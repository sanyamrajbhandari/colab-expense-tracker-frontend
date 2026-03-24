import routes from "./routes/Routes";
import { RouterProvider } from "react-router-dom";

import React from 'react'

const App = () => {
  return <RouterProvider router={routes} />;
}

export default App