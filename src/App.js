import React from 'react';
import Authorization from "./Authorization";
import WallPost from "./WallPost";

import { Router, Route, Link } from "react-router-dom";
import {createBrowserHistory} from "history";

function changePage() {

}

const history = createBrowserHistory();
function App() {
    return (
        <Router history={history}>
            <div>
                <Route exact path="/" component={Authorization}/>
                <Route  path="/WallPost" component={WallPost}/>

            </div>
        </Router>
    );
}

export default App;
