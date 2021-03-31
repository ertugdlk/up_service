const _ = require("lodash")
var exec = require('child_process').exec
var execPhp = require('exec-php');
const axios = require('axios')
const Balance = require('up_core/models/Balance')
const User = require('up_core/models/User')
const Transaction = require('up_core/models/Transaction')

class Pay3DController{
    endpoint = "https://app.sipay.com.tr"
    merchant_key = "$2y$10$Rv/hx97L85vyk75v8Q3Npuztx6SxP1NccuH6qte6Xmt4muN1lVXya";//for production, use production merchant key
    app_id = "d5419a8b78f7ff64ec50bd1b531ba3c6";// for production, use production app_key
    app_secret = "2cabc9bf1b40f5faf976db7941892fdb";// for production, use production app_secret
    requestData = null;
    token = '';
    postUrl = '';
    header = {}; 
    status_code = '';
    status_message = '';
    response = null;
    
    static async get3Dparams(req,res,next){
        try {
            let invoice_id = parseInt(Math.random()*1000000).toString()
            let currency_code = req.body.currency_code
            let total = 0
            let installment = 0
            const app_secret = "2cabc9bf1b40f5faf976db7941892fdb";
            let items = req.body.items //array of objects every object represents a product and the quantity,price,description of that product

            items.forEach(item => {
                let productPrice = parseFloat(item.price) * parseFloat(item.quantity)
                total = total + productPrice
            });
            let sale_web_hook = '' //What is sale web hook?

            if(!req.body.installments_number 
                || (req.body.installments_number && req.body.installments_number < 1)){
                    installment = 1
                }else{
                    installment = req.body.installments_number
                }

            var phpScriptPath = "php/hash.php";
            var m1 = '$',m2 = '2y$',m3 = '10$', m4 = 'Rv/hx97L85vyk75v8Q3Npuztx6SxP1NccuH6qte6Xmt4muN1lVXya'
            var mk = "" + m1+m2+m3+m4
            var argsString = `${total},${installment},${currency_code},` + m1 +","+ m2 +","+ m3 +","+ m4 +","+`${invoice_id}`+"," + `${app_secret}`;

            exec("php "+phpScriptPath+" "+argsString, async function(err, phpResponse, stderr){

                if(err) console.log(err); /* log error */
                
                
                console.log("Hash Key out of php script  :"+phpResponse)
                let invoice = {
                    'merchant_key' : '$2y$10$Rv/hx97L85vyk75v8Q3Npuztx6SxP1NccuH6qte6Xmt4muN1lVXya',
                    'invoice_id' : invoice_id,
                    'total' : total,
                    'items' : items,
                    'currency_code' : currency_code,
                    'installments_number' : installment,
                    'hash_key' : phpResponse,
                    'cancel_url': 'https://google.com',
                    'return_url': 'https://ertug-2.d4u99xidnqjcw.amplifyapp.com/dashboard'
                }

                /* implement later */
                // //billing info
                // $invoice['bill_address1'] = 'Address 1 should not more than 100'; //should not more than 100 characters
                // $invoice['bill_address2'] = 'Address 2'; //should not more than 100 characters
                // $invoice['bill_city'] = 'Istanbul';
                // $invoice['bill_postcode'] = '1111';
                // $invoice['bill_state'] = 'Istanbul';
                // $invoice['bill_country'] = 'TURKEY';
                // $invoice['bill_phone'] = '008801777711111';
                // $invoice['bill_email'] = 'demo@sipay.com.tr';
                // $invoice['sale_web_hook_key'] = $sale_web_hook;
                var requestData = invoice;
                var reqparams = requestData
                var postUrl =  "https://app.sipay.com.tr" + "/ccpayment/api/paySmart3D";
                res.send(invoice)

                /**
                 * not:
                 * //burada transaction a tüm bilgileri kaydet statusu waiting yap, sonra duruma göre success ya da fail dersin
                 * 
                 */
                

            });
        } catch (error) {
            throw error  
        }   
    }

}

module.exports = Pay3DController

