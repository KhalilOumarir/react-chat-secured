import Home from './directories/home/Home';
import SignUp from './directories/Sign-up/Sign-up';
import Chat from "./directories/Chat/Chat";
import TempDir from "./directories/temporary/TempDir";
import './App.css';
import {Route,Switch,NavLink} from "react-router-dom";
import UsernameProvider from "./contexts/userData.context";

function App() {
  return (
    <UsernameProvider>
      <div className="App">
      <Switch>
        <Route exact path="/sign-in" render={(routerProps)=>(<TempDir {...routerProps} />)} />
        <Route  exact path="/" render={(routerProps)=>(<Home {...routerProps} />)}  />
        <Route  exact path="/sign-up" render={()=>(<SignUp />)}  />
        <Route exact path="/chat" render={()=>(<Chat />)} />
      </Switch>
    </div>
    </UsernameProvider>
  );
}

export default App;
