const Defer = require('config/defer').deferConfig;

const defaultConfig = 
{
    "port": () => process.env.PORT || 5555,
	"database":
	{
        "url":"mongodb+srv://upErtug:rIkHZnclXxS2sdQe@staging.qyf6n.mongodb.net/stage?retryWrites=true&w=majority"
    }
}

module.exports = defaultConfig