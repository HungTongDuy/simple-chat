import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';

import createHistory from 'history/createBrowserHistory';
import { Route, Switch, Router } from 'react-router-dom';

//import routes from './views/routes';
import Home from './views/screens/Home';
import Login from './views/screens/Login';

ReactDOM.render(
    <Router history={createHistory()}>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/t/:conversationId" exact component={Home} />
            <Route path="/login" exact component={Login} />
        </Switch>
    </Router>, 
    document.getElementById('root')
);

registerServiceWorker();
