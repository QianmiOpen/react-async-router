import React from 'react';
import {Route, DefaultRoute, HashLocation, run} from 'react-router';
import asyncLoader from './async-loader';
import App from './app';
import Home from './home';
import About from 'bundle?lazy!./about';
import Inbox from 'bundle?lazy!./inbox';


let routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={Home}/>
    <Route name="about" handler={asyncLoader(About)}/>
    <Route name="inbox" handler={asyncLoader(Inbox)}/>
  </Route>
);


run(routes, HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});
