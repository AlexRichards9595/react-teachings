import './App.css';
import TeachingsSearchPage from "./pages/TeachingsSearchPage/TeachingsSearchPage";
import TeachingPage from "./pages/TeachingPage/TeachingPage";
import { BrowserRouter, Routes , Route} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";

function App() {
    const theme = createTheme({
        palette: {
            primary: {main: '#515E61'},
            secondary: {main: '#72DB2B'},
        },
    });

  return (
    <div className="App">
      <header>Header</header>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/teaching/:id" element={<TeachingPage/>} />
                    <Route path="/" element={<TeachingsSearchPage/>} />
                </Routes>
            </BrowserRouter>
        </ ThemeProvider>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
