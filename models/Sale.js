//Sajeel Malik
//Sale - mongoose schema

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var SaleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String. Can make unique:true ONLY if the scraping is done independently, since otherwise the root route will always throw an erro
  link: {
    type: String,
    required: true
  },
  // `image` is required and of type String
  image: {
    type: String,
    // required: true
  },
  // `price` is required and of type String
  price: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Sale with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Sale = mongoose.model("Sale", SaleSchema);

// Export the Sale model
module.exports = Sale;
