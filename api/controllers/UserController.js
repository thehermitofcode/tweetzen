const { Client } = require('twitter-api-sdk')
const client = new Client(process.env.TWITTER_BEARER_TOKEN)

const viewDashboard = (req, res) => {
    if (req.user) {
        res.render('pages/user/dashboard', {
            user: req.user
        })
    } else {
        res.render('pages/user/dashboard', {
            user: {
                username: 'none'
            }
        })
    }
}

const getTweetByID = async (req, res) => {
    const user = await client.users.findUserByUsername('elonmusk', {
        "user.fields": ["name", "profile_image_url", "username", "verified"]
    })
    res.json(user)
}

const searchForCreatorNameInFollowingList = async (req, res) => {
    let searchString = req.query.search_string
    
    async function getUsersFollowedByLoggedInUser (loggedInUserID) {
        const following = await client.users.usersIdFollowing(loggedInUserID, {
            max_results: 1000,
            "user.fields": ['profile_image_url', 'name', 'username']
        })
        return following
    }
    const { data } = await getUsersFollowedByLoggedInUser('908614625171836929')
    let usersFollowedByLoggedInUserThatMatch = data.filter(following => {
        if (searchString.length === 0) {
            return []
        } else {
            const regex = new RegExp(`^${searchString}`, 'gi')
            return following.name.match(regex) || following.username.match(regex)
        }
    })
    res.json(usersFollowedByLoggedInUserThatMatch)
}

module.exports = {
    viewDashboard,
    getTweetByID,
    searchForCreatorNameInFollowingList
}