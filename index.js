const { ApolloServer, gql, MockList } = require("apollo-server");
const faker = require('faker');

const typeDefs = gql`
  type Horse {
      id: ID!
      name: String!
      age: Int!
      description: String
  }

  type Cat {
    id: ID!
    name: String!
    age: Int!
    nice: Boolean
  }

  type Query {
    allCats: [Cat!]!
    allHorses: [Horse!]!
  }
`;

/**
 * `mockEntireSchema: false`과 추가시 resolver에서 제공되는 스펙에 맞춰 1개의 cat만 내려주고 결정되지 않은 필드(unresolved)는 mocks의 설정을 여전히 적용받는 형태
 */
const resolvers = {
  Query: {
    allCats: () => [{ id: 1, name: 'Meatball'}]
  }
}

const mocks = {
  Query: () => ({
    allCats: () => new MockList([1, 5]),
    allHorses: () => new MockList(4),
  }),
  Horse: () => ({
    description: () => faker.random.arrayElement(['majestic', 'honorable', 'street smart'])
  }),
  ID: () => faker.datatype.uuid(),
  Int: () => faker.datatype.number({ min: 1, max: 100}),
  name: () => faker.name.firstName(),
  Boolean: () => faker.datatype.boolean(), 
}

const server = new ApolloServer({
  typeDefs,
  mocks,
  resolvers,
  mockEntireSchema: false,
});

server.listen().then(({ url }) => console.log(`Server Running on port ${url}`));
