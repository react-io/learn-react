import 'babel-polyfill';

import TeaContry from './store/TeaContry'
import TeaHomeRoute from './routes/TeaHomeRoute'

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

ReactDOM.render(
  <Relay.Renderer
    environment={Relay.Store}
    Container={TeaContry}
    queryConfig={new TeaHomeRoute({ contryId: 1 })}
  />,
  document.getElementById('root')
);
