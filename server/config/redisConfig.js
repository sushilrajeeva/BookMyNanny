// import redis from "redis";
// let redClient = undefined;

// const connectToRedis = () => {
//   if (!redClient) {
//     redClient = redis.createClient({ host: "redis", port: 6379 });
//     redClient.on("error", (err) => {
//       console.log("Redis Client Error", err);
//     });
//     redClient.connect().then(() => {});
//   }
//   return redClient;
// };

// export const client = connectToRedis();
