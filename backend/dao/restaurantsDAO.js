import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectID

//this is to store a reference to the database
let restaurants;

export default class RestaurantsDAO {
    //how we initially connect to the database, call this method when server starts
    static async injectDB(conn) {
        if (restaurants) {
            return 
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
        } catch (e) {
            console.error(
                `Unable to establish a connection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    //we will call this when we want a list of data in the database
    static async getRestaurants({
        filters = null,
        page = 0,                     //defaults to page 0 and 20 restaurants per page
        restaurantsPerPage = 20,
    } = {}) {
        let query
        //you can search by filters
        if (filters) {
            if ('name' in filters) {
                //search for anywhere in the text with that name
                query = { $text : {$search: filters['name'] } }
            }   else if ('cuisine' in filters) {
                //if 'cuisine' from the entry in the database equals the cuisine that was passed in. same with zipcode
                query = { 'cuisine': { $eq: filters['cuisine'] } }
            } else if ('zipcode' in filters) {
                query = { 'address.zipcode': { $eq: filters['zipcode'] } }
            }
        }

        let cursor

        try {
            cursor = await restaurants
            //finds all the restaurants from the database that go along with query we passed in or return all restaurants
            .find (query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
        
        //limits the results as curosr returns all results, limits to restaurants per page which is 20 by default. And skips to the page
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try {
            //sets restaurants to an array
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return { restaurantsList, totalNumRestaurants }
        }   catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }

    static async getRestaurantById(id) {
        try {
            //creates a pipeline to match different collections together
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                    {
                        $lookup: {
                            from: 'reviews',
                            let: {
                                id: '$id',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['restaurant_id', '$$id'],
                                        },
                                    },
                                },
                                {
                                    $sort : {
                                        date: -1,
                                    },
                                },
                            ],
                            as: 'reviews',
                        },
                    },
                    {
                        $addFields: {
                            reviews: '$reviews',
                        },
                    },
            ]
            return await restaurants.aggregate(pipeline).next()
        }   catch (e) {
            console.error(`Something went wrong in the getRestaurantsByID: ${e}`)
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct('cuisine')
            return cuisines
        } catch (e) {
            console.error (`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
} 