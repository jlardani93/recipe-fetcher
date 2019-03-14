import mongoose from 'mongoose'
const Schema = mongoose.Schema
import { logError } from '../../utils'

const FoodSearchSchema = new Schema({
  id: String,
  query: String, //search input
  foodId: String, //real food Id
}, { timestamps: true });

/**
 * @param {*} queries
 * @returns Promise<{ queries: [String], docs: { [query]: FoodSearch } }>
 */
FoodSearchSchema.statics.getExistingQueries = function(queries) {
  return this.find({ query: { $in: queries } }).exec()
    .then( docs => ({ 
      queries,
      docs: docs.reduce((acc, d) => ({...acc, [d.query]: d }), {})
    }))
    .catch(logError)
}

export default mongoose.model('FoodSearch', FoodSearchSchema);