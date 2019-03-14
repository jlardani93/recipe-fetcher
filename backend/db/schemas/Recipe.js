import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RecipesSchema = new Schema({
  _id: { 
    type: String,
    validate: {
      validator: function(v) { return this.model('Recipe').countDocuments({ _id: v }).then(count => count < 1) }
    }},
  label: String,
  image: String,
  url: String,
  ingredientInfo: [{ text: String, weight: String }],
  ingredients: [{type: mongoose.Schema.ObjectId, ref: 'Ingredient'}]
}, { timestamps: true })

export default mongoose.model('Recipe', RecipesSchema);