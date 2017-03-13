/**
 * Created by simon on 2017/3/8.
 */

import React from 'react';
import Relay from 'react-relay';
import Tea from '../components/Tea'
import AddTeaMutaion from '../mutation/AddTeaMutation'

class TeaContry extends React.Component {
  constructor() {
    super();
    this.state = {
      teaName: ''
    }
  }

  handleAddTea() {
    this.props.relay.commitUpdate(new AddTeaMutaion({
      teaName: this.state.teaName,
      contry: this.props.contry
    }))
  }

  cleanInput() {
    this.setState({
      teaName: ''
    })
  }

  handleInputChange(e) {
    this.setState({
      teaName: e.target.value
    })
  }

  render() {
    const teas = this.props.contry.teas // 所有的 teas
    console.info('=========TeaContry======')
    console.info(JSON.stringify(teas))
    return (
      <div>
        <ul>
          {teas.edges.map(({ node }) =>
            <Tea tea={node}></Tea>
          )}
        </ul>
        Tea Name: <input type="text"
                         onChange={this.handleInputChange.bind(this)}
                         value={this.state.teaName}></input>

        <button onClick={this.handleAddTea(this)}>添加</button>
      </div>
    )
  }
}

export default Relay.createContainer(TeaContry, {
  fragments: {
    contry: () => Relay.QL`
      fragment on Contry{
        teas(first: 10){
          edges{
            node{
              ${Tea.getFragment('tea')}
            }
          }
        }
        ${AddTeaMutaion.getFragment('contry')}
      }
    `
  }
})
