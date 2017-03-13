// 引入函式库
import {
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
  nodeDefinitions,
} from 'graphql-relay';


import {
  createTea,
  getContries,
  getContry,
  getContryByName,
  getTeas,
  getTea,
  getTeasByContryId,
} from './database'


// ================================  ================================
// == node definition
// ================================  ================================

const { nodeInterface, nodeField } = nodeDefinitions((globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Contry') {
      const contry = getContry(id)
      return contry;
    } else if (type === 'Tea') {
      const tea = getTea(id)
      return tea;
    } else {
      return null;
    }
  }, (obj) => {
    return obj.teas ? ContryType : TeaType;
  }
);


// ================================  ================================
// == Type
// ================================  ================================

var TeaType = new GraphQLObjectType({
  name: 'Tea',
  fields: () => ({
    id: globalIdField('Tea'),
    name: {
      type: GraphQLString,
      description: '茶叶的名字'
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * type Contry implements Node {
 *  id: ID!
 *  name: String
 *  teas(after: String, first: Int, before: String, last: Int): TeaConnection
 * }
 */
var ContryType = new GraphQLObjectType({
  name: 'Contry',
  description: '国家',
  fields: () => ({
    id: globalIdField('Contry'),
    contryId: {
      type: GraphQLString,
      resolve: (contry) => contry.id
    },
    name: {
      type: GraphQLString,
      description: '国家名称'
    },
    teas: {
      type: teaConnection,
      description: '属于这个国家的著名茶叶',
      args: connectionArgs,

      resolve: (contry, args) => connectionFromArray(
        contry.teaIds.map((id) => getTea(id)),
        args
      )
    },
  }),
  interfaces: [nodeInterface],
});


// ================================  ================================
// == Connection
// ================================  ================================


/**
 * type TeaConnection {
 *   pageInfo: PageInfo!
 *   edges: [TeaEdge]
 * }
 *
 * type TeaEdge {
 *   node: Tea
 *   cursor: String!
 * }
 *
 */
const {
  connectionType: teaConnection,
  edgeType: TeaEdge,
} = connectionDefinitions({ name: 'Tea', nodeType: TeaType });


// ================================  ================================
// == Query
// ================================  ================================

var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    contry: {
      type: ContryType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (root, { id }) => getContry(id)
    },
  }),
})


// ================================  ================================
// == Mutation
// ================================  ================================

/**
 *
 type CreateTeaPayload {
  newTeaEdge: TeaEdge
  contry: Contry
  clientMutationId: String
 }

 input CreateTeaInput {
  teaName: String!
  contryId: ID!
  clientMutationId: String
}
 */
const TeaMutation = mutationWithClientMutationId({
  name: 'CreateTea',
  inputFields: {
    teaName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    contryId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    newTeaEdge: {
      type: TeaEdge,
      resolve: (newTea) => {
        console.debug('newTeaEdge: ' + newTea)
        // newTeaEdge.node.
        const tea = getTea(newTea.teaId)
        return {
          cursor: cursorForObjectInConnection(getTeasByContryId(newTea.contryId), tea),
          node: tea
        }
      }
    },
    contry: {
      type: ContryType,
      resolve: ({ teaId, contryId }) => getContry(contryId)
    },
  },

  mutateAndGetPayload: ({ teaName, contryId }) => { // 固定格式，这个方法就是用来处理创建与返回逻辑的
    const createTea = createTea(teaName, contryId)
    return createTea
  },
})

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({ createTea: TeaMutation })
})


// 输出 GraphQL Schema
export var Schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});




























