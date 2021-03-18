<?php
function generate_hash_key($total, $installment, $currency_code, $merchant_key,  $invoice_id, $app_secret){

$data = $total.'|'.$installment.'|'.$currency_code.'|'.$merchant_key.'|'.$invoice_id;

$iv = substr(sha1(mt_rand()), 0, 16);
$password = sha1($app_secret);

$salt = substr(sha1(mt_rand()), 0, 4);
$saltWithPassword = hash('sha256', $password . $salt);

$encrypted = openssl_encrypt(
    "$data", 'aes-256-cbc', "$saltWithPassword", null, $iv
);
$msg_encrypted_bundle = "$iv:$salt:$encrypted";
$msg_encrypted_bundle = str_replace('/', '__', $msg_encrypted_bundle);
return $msg_encrypted_bundle;
}
?>