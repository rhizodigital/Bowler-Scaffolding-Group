<?php 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

// Settings
// Who message will be sent from. Use a fixed address in your own domain or 
// it can cause your message to fail SPF checks
$fromEmail = 'website@mkscaffolding.com';
$fromName = 'MK Scaffolding Website Contact Form';
// Who message will be sent to
$toEmail = 'info@mkscaffolding.com';
$toName = 'MK Scaffolding';
// The message subject line
$subject = 'Message from Milton Keynes Scaffolding Contact Form';


// SMTP Settings

// Hostname of SMTP server
$smtpHost = 'smtp.office365.com';
// Set the SMTP port number - likely to be 25, 465 or 587
$smtpPort = 587;
// Username for SMTP Autentication
$smtpUser = 'website@mkscaffolding.com';
// Password for SMTP Authentication
$smtpPass = 'Asq78424';
$smtpSecure = 'SSL'; // Enable TLS or SSL encryption
$smtpAutoTLS = false; // Enable Auto TLS

//======================================================
    if (isset($_POST)) {
    $data = json_decode(file_get_contents('php://input'), true);
    }

// Dont run unless we have a email
if (array_key_exists('email', $data)) {

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    // Create PHPMailer Instance
    $mail = new PHPMailer();
    // Tell PHPMailer to use SMTP;
    $mail->isSMTP();

    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->Password = $smtpPass;
    $mail->Username = $smtpUser;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = $smtpSecure;
    $mail->SMTPAutoTLS = $smtpAutoTLS;
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail, $toName);

    if ($mail->addReplyTo($data['email'], $data['name'])) {

        $mail->CharSet = 'UTF-8';
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = <<<EOT
Name: {$data['name']}
Email: {$data['email']}
Message: {$data['message']}
Phone: {$data['phone']}
EOT;

        //send the message, check for errors
        if (!$mail->send()) {
            if ($isAjax) {
                http_response_code(500);
            }

            $response = [
                "status" => "failed",
                "message" => 'Sorry, something went wrong, Please try again later.'
            ];
        } else {
            $response = [
                "status" => "success",
                "message" => 'Message sent! Thanks for contacting us.'
            ];
        };

    } else {
        $response = [
            "status" => "failed",
            "message" => 'Invalid email address, message ignored'
        ];
    }

    if ($isAjax) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($response);
        exit();
    }
    
}

?>