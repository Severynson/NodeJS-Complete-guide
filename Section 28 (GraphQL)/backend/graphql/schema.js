const { buildSchema } = require("graphql");

// type TestData {
//     text: String!
//     views: Int!
// }

// type RootQuery {
//     hello: TestData!
// }

// schema {
//     query: RootQuery
// }

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updateAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello: String
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
