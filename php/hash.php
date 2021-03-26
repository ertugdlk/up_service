<?php
$params = explode(",", $argv[1]);
//echo $params[0] ." - " . $params[1] . " - " . $params[2];
$mk = $params[3].$params[4].$params[5].$params[6];

$total = $params[0];
$installment = $params[1];
$currency_code = $params[2];
$merchant_key = $mk;
$invoice_id =$params[7];
$app_secret = $params[8];

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
echo $msg_encrypted_bundle;


?>