import express from 'express'
import cors from 'cors'
import restaurants from './api/restaurants.route.js'


//use to make server
const app = express()

//middleware //no longer need to use body parser
app.use(cors())
app.use(express.json())


//routes
app.use('/api/v1/restaurants', restaurants)
//routes that dont exist
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }))

export default app