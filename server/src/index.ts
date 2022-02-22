import { createServer } from "@graphql-yoga/node";
import { createMessage, getMessages } from "./client";

const server = createServer({
	schema: {
		typeDefs: /* GraphQL */ `
			type Query {
				hello: String
			}

			type Mutation {
				createMessage(text: String!): String!
			}

			type Subscription {
				countdown(from: Int!): Int!
				messages: [String!]
			}
		`,
		resolvers: {
			Query: {
				hello: () => "world",
			},
			Mutation: {
				createMessage: async (_, { text }) => {
					await createMessage(text);
					return text;
				},
			},
			Subscription: {
				countdown: {
					subscribe: async function* (_, { from }) {
						for (let i = from; i >= 0; i--) {
							await new Promise((resolve) => setTimeout(resolve, 1000));
							yield { countdown: i };
						}
					},
				},
				messages: {
					subscribe: async function* () {
						const data = await getMessages();
						console.log(data);
						yield { messages: data };
					},
				},
			},
		},
	},
});

server.start();
