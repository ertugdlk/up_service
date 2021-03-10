const _ = require("lodash")
const crypto = require('crypto');
const CryptoJS = require('crypto-js')
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

class Pay2DController{
    endpoint = "https://app.sipay.com.tr"
    merchant_key = "$2y$10$Rv/hx97L85vyk75v8Q3Npuztx6SxP1NccuH6qte6Xmt4muN1lVXya";//for production, use production merchant key
    app_id = "d5419a8b78f7ff64ec50bd1b531ba3c6";// for production, use production app_key
    app_secret = "2cabc9bf1b40f5faf976db7941892fdb";// for production, use production app_secret
    requestData = null;
    token = '';
    postUrl = '';
    header = []; 
    status_code = '';
    status_message = '';
    response = null;
    





    static async paySmart2D(req,res,next){
        let invoice_id = Math.random()*1000000
        let currency_code = req.body.currency_code
        let total = 0
        let installment = 0

        let cart = req.body.cart //array of objects every object represents a product and the quantity,price,description of that product

        cart.forEach(item => {
            let productPrice = item.price * item.quantity
            total = total + productPrice
        });

        let name = req.body.customer_name
        let surname = req.body.surname
        let sale_web_hook = '' //What is sale web hook?

        if(!req.body.installments_number 
            || (req.body.installments_number && req.body.installments_number < 1)){
                installment = 1
            }else{
                installment = req.body.installments_number
            }
        
        let hash_key = this.generateHashKey(total, installment,currency_code,
            this.merchant_key, invoice_id, this.app_secret)

        let invoice = {
            'merchant_key' : this.merchant_key,
            'invoice_id' : invoice_id,
            'total' : total,
            'items' : cart,
            'currency_code' : currency_code,
            'cc_holder_name' : req.body.cc_holder_name,

            'cc_no' :  $req.body.cc_no,
            'expiry_month' : req.body.expiry_month,
            'expiry_year' : req.body.expiry_year,
            'cvv' :  $request['cvv'],
            'installments_number' : installment,
            'hash_key' : hash_key,
            'name' : name,
            'surname' : surname,
        }
        
    }


    getSipayToken = async function(){
        var reqparams = { app_id : this.app_id,
                            app_secret : this.app_secret}
        
        this.postUrl = this.endpoint + "/ccpayment/api/token"
        this.headers = {'Accept': 'application/json', 'Content-Type': 'pplication/json'}
        const token = await fetch(this.postUrl, {
            method: 'POST',
            body: JSON.stringify(reqparams),
            headers: this.headers
        }).then(res => res.json())
        .then(json => {return json.data.token});
        return token
        //console.log(token)
    }


    generateHashKey = function(total, installemnt, currency_code, invoice_id, app_secret){
        const data = total + "|" + installment + "|"+ currency_code + "|" +  
        info.merchant_key+"|"+  invoice_id 

        const iv = crypto.createHash("sha1")
                        .update((Math.random()*100000 + 1)
                        .toString())
                        .digest('hex')
                        .substr(0,16);

        const password = crypto.createHash("sha1")
                        .update(info.app_secret)
                        .digest("hex");

        const salt = crypto.createHash("sha1")
                        .update((Math.random()*10).toString())
                        .digest("hex").substr(0,4);

        var saltedpw = "" + password + "" + salt

        const saltWithPassword = crypto.createHash("sha256")
                                        .update(saltedpw)
                                        .digest("hex");

        const encrypted = CryptoJS.AES.encrypt(data,  saltWithPassword, { iv:  iv });


        var msg_encrypted_bundle = ""+iv+":"+salt+":"+encrypted.toString()
        msg_encrypted_bundle= msg_encrypted_bundle.replace('/\//g','__')//replace all

        return msg_encrypted_bundle
        //console.log(msg_encrypted_bundle.toString());
    }


}

var x = new Pay2DController()
x.getSipayToken()