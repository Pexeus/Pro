import Spacer from './components/Spacer'
import Views from "./components/Views"
import Head from "./components/Head";

function App() {
  return (
    <div className="app">
      <div className="header">
        <Head/>
      </div>
      <div className="content">
        <Spacer/>
        <Views/>
      </div>
    </div>
  );
}

export default App;
