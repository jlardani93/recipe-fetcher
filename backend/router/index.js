import express from 'express'
import { ingredientSuggestions } from "./routes/ingredientSuggestions";
import { recipes } from './routes/recipes';

export const router = express.Router()

router.get('/ingredientSuggestions', ingredientSuggestions)
router.get('/recipes', recipes)
