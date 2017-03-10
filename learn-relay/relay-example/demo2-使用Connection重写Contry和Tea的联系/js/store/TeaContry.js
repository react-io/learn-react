/**
 * Created by simon on 2017/3/8.
 */

import React from 'react';
import Relay from 'react-relay';
import Tea from '../components/Tea'

class TeaContry extends React.Component {
  render() {
    return (
      <ul>
        {this.props.contry.teas.edges.map(({ node }) =>
          <Tea tea={node}></Tea>
        )}
      </ul>
    )
  }
}

export default Relay.createContainer(TeaContry, {
  fragments: {
    contry: () => Relay.QL`
      fragment on Contry{
        id
        name
        teas(first: 5){
          edges{
            node{
              ${Tea.getFragment('tea')}
            }
          }
        }
      }
    `
  }
})
