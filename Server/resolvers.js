import { GraphQLError } from "graphql";
import validation from "./helpers.js";
import redis from "redis";
import moment from "moment";
import { validate } from "uuid";
import {
  authors as authorCollection,
  books as bookCollection,
} from "./config/mongoCollections.js";

import { v4 as uuid } from "uuid"; //Use uuid or mongo obj id?
let client = redis.createClient();
client.connect().then(() => {});

export const resolvers = {
  //TODO: Add resolvers for typedefs
  Query: {},
  Parent: {},
  Admin: {},
  Nanny: {},
  Listing: {},
  Message: {},
  Mutation: {},
};
