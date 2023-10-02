import { createGlobalStyle } from 'styled-components';
import { pangolin } from '../utils/fonts';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.colors.primary};
    padding: 0;
    margin: 0;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
    color: #0099ff;
  }

  button {
    // resets
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;

    font-family: ${pangolin.style.fontFamily};
    border: 4px solid black;
    border-radius: 4px;
    padding: 10px 20px
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
