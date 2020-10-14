const defaultConfig = 
{
	"database":
	{
        "url":"mongodb+srv://"+process.env.NODE_DATABASE_USERNAME+":"+process.env.NODE_DATABASE_PASSWORD+"@upcluster.qyf6n.mongodb.net/test?retryWrites=true&w=majority"
    }
}

module.exports = defaultConfig