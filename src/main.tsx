import App from '@app/App';
import { ContextProvider } from '@app/context';
import theme from '@app/theme';
import Fonts from '@app/theme.fonts';
import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Fonts />
      <Router>
        <ContextProvider>
          <App />
        </ContextProvider>
      </Router>
    </ChakraProvider>
  </StrictMode>,
);
