import React, {Component} from 'react';


export default class Message extends Component {
  render() {
    return (
      <div>
        <h3>message</h3>
        <p>
          {this.props.params.id}
        </p>
      </div>
    );
  }
}
