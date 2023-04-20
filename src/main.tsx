import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { ContextProvider } from "@app/context";
import App from "@app/App";
import theme from "@app/theme";
import Fonts from "@app/theme.fonts";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Fonts />
      <Container>
        <Router>
          <ContextProvider>
            <App />
            {/* <ToastContainer /> */}
          </ContextProvider>
        </Router>
      </Container>
    </ChakraProvider>
  </StrictMode>
);
