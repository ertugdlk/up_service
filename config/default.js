const defaultConfig = 
{
	"database":
	{
        "url":"mongodb+srv://"+process.env.NODE_DATABASE_USERNAME+":"+process.env.NODE_DATABASE_PASSWORD+"@upcluster.qyf6n.mongodb.net/test?retryWrites=true&w=majority"
    },
    "jwt":
	{
		"secret": "Rst.!bJTQEdf79",
        "expiresIn": "7 days",
        "is": 
        {
            "active": true // To make token system disable, set this to `false`
        }
    },
    "TCKN":
    {
        "url":"https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL"
    },
    "platforms":
    {
        "steam":
        {
            "name":"Steam",
            "apiKey": "3F7E7FF7EC5EC88290ECF9ED3C63F642",
            "_id" : '5f9a84fca1f0c0b83de7d696'
        }
    }
}

module.exports = defaultConfig