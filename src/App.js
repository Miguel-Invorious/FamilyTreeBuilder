import FlowContainer from "./components/flow-container/FlowContainer";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "./App.css";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FlowContainer />
    </LocalizationProvider>
  );
}

export default App;
