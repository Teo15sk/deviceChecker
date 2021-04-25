import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { useState } from "react";
import "./scss/deviceChecker.scss";
import DevicesList from "./components/DevicesList";
import Login from "./components/Login";
import CreateDevice from "./components/CreateDevice";
import Header from "./components/Header";

function setCurrentUserData(userData) {
    localStorage.setItem("currentUser", JSON.stringify(userData));
}

function getToken() {
    const currentUserString = localStorage.getItem("currentUser");
    const userData = JSON.parse(currentUserString);
    console.log(userData);
    return userData?.token;
}

function getCurrentUser() {
    const currentUserString = localStorage.getItem("currentUser");
    const userData = JSON.parse(currentUserString);
    if (userData) {
        return userData;
    }
}

function App() {
    const [token, setToken] = useState(getToken());
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    // console.log(currentUser);
    // const token = getToken();
    console.log(token);

    return (
        <div className="App">
            <Header token={token} currentUser={currentUser} />
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Login
                            token={token}
                            currentUser={currentUser}
                            setCurrentUserData={setCurrentUserData}
                        />
                    </Route>
                    <Route exact path="/devices">
                        <DevicesList token={token} currentUser={currentUser} />
                    </Route>
                    <Route exact path="/create-device">
                        <CreateDevice token={token} currentUser={currentUser} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}
// }
export default App;
