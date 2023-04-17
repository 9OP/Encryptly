import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ContextProvider } from "@/context";
import App from "@/App";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ChakraProvider>
      <Router>
        <ContextProvider>
          <App />
          {/* <ToastContainer /> */}
        </ContextProvider>
      </Router>
    </ChakraProvider>
  </StrictMode>
);
