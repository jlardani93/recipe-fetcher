import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IngredientsSchema = new Schema({
  _id: { 
    type: String,
    validate: {
      validator: function(v) { return this.model('Ingredient').countDocuments({ _id: v }).then(count => count < 1) }
    }
  },
  label: String,
  recipes: [{ type: mongoose.Schema.ObjectId, ref: 'Recipe'}],
}, { timestamps: true });

export default mongoose.model('Ingredient', IngredientsSchema);