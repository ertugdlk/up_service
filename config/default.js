const defaultConfig = 
{
	"database":
	{
        "url":"mongodb+srv://"+process.env.NODE_DATABASE_USERNAME+":"+process.env.NODE_DATABASE_PASSWORD+"@upcluster.qyf6n.mongodb.net/test?retryWrites=true&w=majority"
    },
    "jwt":
	{
		"secret": "cukubik",
        "expiresIn": "7 days",
        "is": 
        {
            "active": true // To make token system disable, set this to `false`
        }
	}
}

module.exports = defaultConfig