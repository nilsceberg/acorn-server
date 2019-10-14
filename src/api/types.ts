import { gql } from "apollo-server-koa";

export interface Screen {
	name: string;
}

export const typeDefs = gql`
type Screen {
	name: String!
}

type Query {
	screens: [Screen]!
}
`;
