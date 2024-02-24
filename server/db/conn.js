const { MongoClient } = require("mongodb");
const uri = process.env.ATLAS_URI;

let _db;

module.exports = {
  connectToServer: async function (callback) {
    try {
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();
      _db = client.db("todoList");
      console.log("Successfully connected to MongoDB.");
      callback();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      callback(error);
    }
  },

  getDb: function () {
    if (!_db) {
      throw new Error("Database not connected.");
    }
    return _db;
  },
};
