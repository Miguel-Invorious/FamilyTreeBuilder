import { Provider } from "react-redux";
import FlowContainer from "./components/flow-container/FlowContainer";
import store from "./redux/store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <FlowContainer />
    </Provider>
  );
}

export default App;
