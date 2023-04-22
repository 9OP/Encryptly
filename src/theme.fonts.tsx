import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
      /* Cispeo */
      @font-face {
        font-family: 'Cispeo';
        src: url('./fonts/Cispeo-Regular.woff') format('woff'), url('./fonts/Cispeo-Regular.woff2') format('woff2');
        font-style: normal;
        font-weight: 400;
        font-display: swap;
      }
      `}
  />
);

export default Fonts;
