import FlowContainer from "./components/flow-container/FlowContainer";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ReactFlowProvider } from "react-flow-renderer";
import "./App.css";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ReactFlowProvider>
        <FlowContainer></FlowContainer>
      </ReactFlowProvider>
    </LocalizationProvider>
  );
}

export default App;
