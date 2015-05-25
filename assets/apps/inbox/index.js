import React, {Component} from 'react';
import {Link, RouteHandler} from 'react-router';


/**
 * inbox app
 */
export default class Inbox extends Component {
  render() {
    return (
      <div>
        <h3>Inbox</h3>
        <ul>
          <li><Link to='message' params={{id:1}}>#1</Link></li>
          <li><Link to='message' params={{id:2}}>#2</Link></li>
          <li><Link to='message' params={{id:3}}>#3</Link></li>
        </ul>
        <RouteHandler/>
        <Link to="home">back to home</Link>
      </div>
    );
  }
}
