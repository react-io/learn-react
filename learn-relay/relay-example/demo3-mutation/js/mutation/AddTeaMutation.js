/**
 * Created by simon on 2017/3/11.
 */

import Relay from 'react-relay';
import Tea from '../components/Tea'

export default class AddTeaMutation extends Relay.Mutation {

  /**
   * 与 schema.js 当中的 Mutation 定义相对应
   * @returns {*}
   */
  getMutation() {
    return Relay.QL`mutation { createTea }`;
  }

  getVariables() {
    return {
      teaName: this.props.teaName,
      contryId: this.props.contry.id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateTeaPayload {
        contry {
          id
          teas (first: 10){
            edges {
              node {
                ${Tea.getFragment('tea')}
              }
            }
          }
        }
        newTeaEdge
      }
    `;
  }

  // These configurations advise Relay on how to handle the LikeStoryPayload
  // returned by the server. Here, we tell Relay to use the payload to
  // change the fields of a record it already has in the store. The
  // key-value pairs of ‘fieldIDs’ associate field names in the payload
  // with the ID of the record that we want updated.
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'contry',
      parentID: this.props.contry.id,
      connectionName: 'teas',
      edgeName: 'newTeaEdge',
      rangeBehaviors: {
        '': 'append',
        'orderby(oldest)': 'prepend',
      },
    }];
  }

  static fragments = {
    contry: () => Relay.QL`
        fragment on Contry{
            id
        }
    `,
  };

  /**
   * 设置期待服务器返回的结果的数据结构
   */
  getOptimisticResponse() {
    return {
      newTeaEdge: {
        node: {
          name: this.props.name,
        },
      },
      contry: {
        id: this.props.contry.id,
      },
    };
  }
}
