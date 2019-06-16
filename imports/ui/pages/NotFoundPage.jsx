import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';

class NotFoundPage extends BaseComponent {
  render() {
    return (
      <div className="page not-found">
        <nav>
        </nav>
        <div className="content-scrollable">
          Not found page
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
