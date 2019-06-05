//Sajeel Malik
//User - mongoose schema

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new User object
var UserSchema = new Schema({
  // `title` is required and of type String
  name: {
    type: String,
    required: true
  },
  // `link` is required and of type String. Can make unique:true ONLY if the scraping is done independently, since otherwise the root route will always throw an erro
  email: {
    type: String,
    required: true
  },
  // `image` is required and of type String
  password: {
    type: String,
    required: true
  },
  // `saves` is an object that stores a Save id
  // The ref property links the ObjectId to the Save model
  // This allows us to populate the User with an associated Save
  saves: [{
    type: Schema.Types.ObjectId,
    ref: "Save"
  }]
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;
