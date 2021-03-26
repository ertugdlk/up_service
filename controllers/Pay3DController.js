const _ = require("lodash")
var execPhp = require('exec-php');
const fetch = require("node-fetch");
const axios = require('axios')
const Balance = require('up_core/models/Balance')
const User = require('up_core/models/User')
const Transaction = require('up_core/models/Transaction')




async function getSipayToken(){
    var reqparams = { app_id : "d5419a8b78f7ff64ec50bd1b531ba3c6",
                        app_secret : "2cabc9bf1b40f5faf976db7941892fdb"}
    
    var postUrl = "https://app.sipay.com.tr" + "/ccpayment/api/token"
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    const token = await fetch(postUrl, {
        method: 'POST',
        body: JSON.stringify(reqparams),
        headers: headers
    }).then(res => res.json())
    .then(json => {return json.data.token});
    var s = "Bearer "
    s += "" + token + ""
    return s
    //console.log(token)
}



async function getResponse(requestData,token){
    var reqparams = requestData
    
    var postUrl =  "https://app.sipay.com.tr" + "/ccpayment/api/paySmart2D";
    var header = {"Accept": "application/json", "Content-Type": "application/json", "Authorization":token};
    var body = JSON.stringify(reqparams)
    // const response = await fetch(postUrl, {
    //     method: 'POST',
    //     body: body,
    //     headers: header
    // }).then(res =>  res.json())
    // .then(json => {return json.data});
    
    // return response
    axios.post(postUrl, reqparams,{headers:header
    })
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })
    //console.log(token)
}

class Pay2DController{
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
    



     

    static async paySmart2D(req,res,next){
        let invoice_id = parseInt(Math.random()*1000000).toString()
        let currency_code = req.body.currency_code
        let total = 0
        let installment = 0

        let items = req.body.items //array of objects every object represents a product and the quantity,price,description of that product

        items.forEach(item => {
            let productPrice = item.price * item.quantity
            total = total + productPrice
        });

        let name = req.body.name
        let surname = req.body.surname
        let sale_web_hook = '' //What is sale web hook?

        if(!req.body.installments_number 
            || (req.body.installments_number && req.body.installments_number < 1)){
                installment = 1
            }else{
                installment = req.body.installments_number
            }
        
        // let hash_key = this.generateHashKey(total, installment,currency_code,
        //     this.merchant_key, invoice_id, this.app_secret)

        execPhp('../php/hash.php', async function(error, php, outprint){
            // outprint is now `One'.
            
            var x = await php.generate_hash_key("0.10", "1","TRY","$2y$10$Rv/hx97L85vyk75v8Q3Npuztx6SxP1NccuH6qte6Xmt4muN1lVXya",invoice_id,"2cabc9bf1b40f5faf976db7941892fdb", async function(err, result, output, printed){
                let invoice = {
                    'merchant_key' : req.body.merchant_key,
                    'invoice_id' : invoice_id,
                    'total' : total,
                    'items' : items,
                    'currency_code' : currency_code,
                    'cc_holder_name' : req.body.cc_holder_name,
        
                    'cc_no' :  req.body.cc_no,
                    'expiry_month' : req.body.expiry_month,
                    'expiry_year' : req.body.expiry_year,
                    'cvv' :  req.body.cvv,
                    'installments_number' : installment,
                    'hash_key' : result,
                    'name' : name,
                    'surname' : surname,
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

                const token = await getSipayToken()
                //console.log(token)
                
                var requestData = invoice;
                
                // var response = await fetch(postUrl, {
                //     method: 'POST',
                //     body: JSON.stringify(requestData),
                //     headers: header
                // }).then(res => res.json())
                // .then(json => {return json.data.response});

                //await getResponse(requestData,token)

                var reqparams = requestData
    
                var postUrl =  "https://app.sipay.com.tr" + "/ccpayment/api/paySmart2D";
                var header = {"Accept": "application/json", "Content-Type": "application/json", "Authorization":token};
                // const response = await fetch(postUrl, {
                //     method: 'POST',
                //     body: body,
                //     headers: header
                // }).then(res =>  res.json())
                // .then(json => {return json.data});
                
                // return response
                axios.post(postUrl, reqparams,{headers:header
                })
                .then( async(resp)=>  {
                    console.log(`statusCode: ${resp.status}`)
                    console.log(resp.data)
                    if(resp.data.status_code === 100){
                        var user = await User.findOne({nickname:req.body.nickname}) 
                        var wallet = await Balance.findOne({user:user._id})
                        wallet.balance += parseInt(req.body.total)*10
                        await wallet.save()
                        var masked_cc_no = req.body.cc_no.substr(0,4)
                        masked_cc_no += " **** **** "
                        masked_cc_no += req.body.cc_no.substr(12,16)
                        var transaction = new Transaction({
                            user:user._id
                            ,cc_holder_name:req.body.cc_holder_name
                            ,masked_cc_no:masked_cc_no
                            ,currency_code:req.body.currency_code
                            ,invoice_id:invoice_id
                            ,invoice_description:req.body.invoice_description
                            ,total:req.body.total
                            ,items:items
                            ,status_msg:"Transaction Successful"
                            ,status_code:"100"
                            ,transaction_id:resp.data.data.order_id})
                        await transaction.save()
                }
                    res.send(resp.data)
                })
                .catch(error => {
                    console.error(error)
                })
        
                // if ((response.status_code) && response.status_code == 100){
                //     var status_code = 100;
                //     // this.status_message = 'Payment Successful';
                //     // this.invoice_id = response.data.invoice_id ;
                // }else{
                //     var x=1
                //     // this.status_code = response.status_code ;
                //     // this.status_message = response.status_description;
                // }
                // res.send(response)
                


            });
        });
        
        
    }


    // static async getSipayToken(){
    //     var reqparams = { app_id : this.app_id,
    //                         app_secret : this.app_secret}
        
    //     this.postUrl = this.endpoint + "/ccpayment/api/token"
    //     this.headers = {'Accept': 'application/json', 'Content-Type': 'pplication/json'}
    //     const token = await fetch(this.postUrl, {
    //         method: 'POST',
    //         body: JSON.stringify(reqparams),
    //         headers: this.headers
    //     }).then(res => res.json())
    //     .then(json => {return json.data.token});
    //     return token
    //     //console.log(token)
    // }


    // generateHashKey = function(total, installemnt, currency_code, invoice_id, app_secret){
    //     const data = total + "|" + installment + "|"+ currency_code + "|" +  
    //     info.merchant_key+"|"+  invoice_id 

    //     const iv = crypto.createHash("sha1")
    //                     .update((Math.random()*100000 + 1)
    //                     .toString())
    //                     .digest('hex')
    //                     .substr(0,16);

    //     const password = crypto.createHash("sha1")
    //                     .update(info.app_secret)
    //                     .digest("hex");

    //     const salt = crypto.createHash("sha1")
    //                     .update((Math.random()*10).toString())
    //                     .digest("hex").substr(0,4);

    //     var saltedpw = "" + password + "" + salt

    //     const saltWithPassword = crypto.createHash("sha256")
    //                                     .update(saltedpw)
    //                                     .digest("hex");

    //     const encrypted = CryptoJS.AES.encrypt(data,  saltWithPassword, { iv:  iv });


    //     var msg_encrypted_bundle = ""+iv+":"+salt+":"+encrypted.toString()
    //     msg_encrypted_bundle= msg_encrypted_bundle.replace('/\//g','__')//replace all

    //     return msg_encrypted_bundle
    //     //console.log(msg_encrypted_bundle.toString());
    // }


}

module.exports = Pay2DController

// var x = new Pay2DController()
// x.getSipayToken()