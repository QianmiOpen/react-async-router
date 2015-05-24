import React, {Component} from 'react';
import {Link} from 'react-router';


/**
 * inbox app
 */
export default class Inbox extends Component {
  render() {
    return (
      <div>
        <h3>Inbox</h3>
        <Link to="home">back to home</Link>
      </div>
    );
  }
}
