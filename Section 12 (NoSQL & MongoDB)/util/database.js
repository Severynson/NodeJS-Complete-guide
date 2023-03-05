const mongobd = require("mongodb");
const { MongoClient } = mongobd;

let _db;

async function mongoConnect() {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://user1:user1@nodejs-course-cluster.mkrye9p.mongodb.net/?retryWrites=true&w=majority"
    );
    _db = client.db("shop");
    console.log("Connected to DB successfully!");
  } catch (error) {
    console.error("!ERROR WHILE CONNECTING TO DATABASE ===>   ", error);
    throw error;
  }
}

const getDB = () => {
  if (_db) return _db;
  throw "No database found!";
}; 

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
