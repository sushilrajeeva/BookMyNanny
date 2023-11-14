import { GraphQLError } from "graphql";

const error = {
  BAD_REQUEST: {
    code: 400,
    status: "BAD_REQUEST",
    message: "Invalid request parameter",
  },
  UNAUTHORIZED: {
    code: 401,
    status: "UNAUTHORIZED",
    message: "Invalid or no JWT provided",
  },
  FORBIDDEN: {
    code: 403,
    status: "FORBIDDEN",
    message: "You are not authorized to perform this action",
  },
  NOT_FOUND: {
    code: 404,
    status: "NOT_FOUND",
    message: "Not Found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    status: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error",
  },
};
Object.freeze(error);

const createError = (err, message) => {
  if (!err || !err.code || !err.message)
    return {
      code: `${error.INTERNAL_SERVER_ERROR.code}: ${error.INTERNAL_SERVER_ERROR.status}`,
      message: error.INTERNAL_SERVER_ERROR.message,
    };
  return {
    code: `${err.code}: ${err.status}`,
    message: message || err.message,
  };
};

const badRequestError = (message) => createError(error.BAD_REQUEST, message);
const unauthorizedError = (message) => createError(error.UNAUTHORIZED, message);
const forbiddenError = (message) => createError(error.FORBIDDEN, message);
const notFoundError = (message) => createError(error.NOT_FOUND, message);
const internalServerError = (message) =>
  createError(error.INTERNAL_SERVER_ERROR, message);

const throwGraphQLError = ({ code, message }) => {
  throw new GraphQLError(message ? message : "", {
    extensions: {
      code: code
        ? code
        : `${error.INTERNAL_SERVER_ERROR.code}:${error.INTERNAL_SERVER_ERROR.status}`,
    },
  });
};

/*Usage Example
try {
  const genre = args.genre;
  if (genre.trim().length === 0)
  // Throw the kind of error and give a custom message
    throw badRequestError("Genre cannot be empty");
  const books = await booksCollection();
  allBooks = await books
    .find({ genres: { $regex: `^${genre}$`, $options: "i" } })
    .toArray();
} catch (e) {
  throwGraphQLError(e);
}*/

export {
  throwGraphQLError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  badRequestError,
  internalServerError,
};
