import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Subject } from 'rxjs';

export class CursorComponent extends React.Component {
  state = { cursor: null, unsubscribe: null };

  onSetupCursor = () => { };

  componentDidMount() {
    if (!this.state.cursor) {
      Meteor.setTimeout(() => {
        const unsubscribe = new Subject();
        const cursor = this.onSetupCursor(unsubscribe);
        this.setState({ cursor, unsubscribe });
      }, 0);
    }
  }

  componentWillUnmount() {
    const { unsubscribe } = this.state;

    if (unsubscribe) {
      unsubscribe.next();
      unsubscribe.complete();
    }
  }
}
