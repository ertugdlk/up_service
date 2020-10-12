const Defer = require('config/defer').deferConfig;

const defaultConfig = 
{
    "port": () => process.env.PORT || 5555,
	"database":
	{

    }
}

module.exports = defaultConfig