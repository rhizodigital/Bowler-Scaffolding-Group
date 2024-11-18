<?php
// Define cors config
$allowedOrigins = [
    'http://localhost:4321',
    'https://www.miltonkeynesscaffolding.co.uk',
];
// handle CORS
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");

    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
} else {
    header("HTTP/1.1 403 Origin Denied");
    exit('Access Denied');
}

// Rate Limiting
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $file = "../../writable/rate_limits.json";
    $timeFrame = 60; // 1 hour
    $maxAttempts = 5;  // Allow 5 attempts per hour

    // Load existing rate limits
    $limits = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    // Initialize the IP's array if not present
    if (!isset($limits[$ip])) {
        $limits[$ip] = [];
    }

    // Clean old entries for this IP
    $now = time();
    $limits[$ip] = array_filter($limits[$ip], fn($timestamp) => $timestamp > ($now - $timeFrame));

    // Check if the IP has exceeded the maximum number of attempts
    if (count($limits[$ip]) >= $maxAttempts) {
        http_response_code(429); // Too Many Requests

        // Output a JSON response with a custom message
        header('Content-Type: application/json');
        echo json_encode([
            "status" => false,
            "message" => "Too many attempts. Please try again later."
        ]);
        exit();
    }

    // Add the current attempt's timestamp for this IP
    $limits[$ip][] = $now;

    // Save the updated limits back to the file
    file_put_contents($file, json_encode($limits));
}

checkRateLimit();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../../php/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Company Details
$companyName = 'MK Scaffolding';
$companyAddress = '21, Shenley Pavilions, Milton Keynes MK5 6LB';
$companyPhone = '01908 410 598';
$companyEmail = 'info@mkscaffolding.com';
$companyWebsite = 'https://mkscaffolding.com';
$companyLogo = 'https://mkscaffolding.com/images/logo.png';

// Settings
// Who message will be sent from. Use a fixed address in your own domain or
// it can cause your message to fail SPF checks
$fromEmail = 'michael.sables@omnific.studio';
$fromName = 'Michael Sables';
// Who message will be sent to
$toEmail = 'rhizodigital@gmail.com';
$toName = 'MK Scaffolding';
// The message subject line
$subject = 'Message from Milton Keynes Scaffolding Contact Form';


// SMTP Settings

// Hostname of SMTP server
$smtpHost = $_ENV['MAIL_HOST'];
// Set the SMTP port number - likely to be 25, 465 or 587
$smtpPort = $_ENV['MAIL_PORT'];
// Username for SMTP Autentication
$smtpUser = $_ENV['MAIL_USER'];
// Password for SMTP Authentication
$smtpPass = $_ENV['MAIL_PASSWORD'];
$smtpSecure = 'ssl'; // Enable TLS or SSL encryption
$smtpAutoTLS = false; // Enable Auto TLS


$sendAutoReply = true;

//======================================================

$name = $phone = $email = $subject = $message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = test_input($_POST['name']);
    $email = test_input($_POST['email']);
    $phone = test_input($_POST['phone']);
    $subject = test_input($_POST['subject']) . ' - ' . $companyName;
    $message = test_input($_POST['message']);
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

$adminTextEmail = <<<EOT
Subject: $subject
Name: $name
Email: $email
Phone: $phone
Message: $message
EOT;

$adminHtmlEmail = <<<EOT
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Message sent from {$companyName} website.</title>
</head>
<body>
<div style="width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 14px;">
    <h2>{$subject} from {$name}</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Message:</strong> $message</p>
</div>
</body>
</html>
EOT;

$autoReplyText = <<<EOT
Hi {$name},

Thank you for contacting us. We will get back to you as soon as possible.

Best Regards,
{$companyName}
EOT;

$autoReplyHtml = <<<EOT
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Thank you for contacting {$companyName}</title>
</head>
<body style="background-color: #fffffe; margin: 0; padding: 0; width: 100%; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" style="width: 100%; max-width: 640px; margin: 0 auto; background-color: #fffffe; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center;">
                <div style="width:200px; margin-left:auto; margin-right:auto; text-align: center;">
                    <img src="cid:logo" alt="Company Logo" style="max-width: 220px; height: auto;" width="300" height="62" />
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h2 style="font-size: 18px; color: #333333;">Thank you for contacting {$companyName}</h2>
                <p style="font-size: 14px; color: #333333; line-height: 1.5;">We will get back to you as soon as possible.</p>
                <p style="font-size: 14px; color: #333333; line-height: 1.5;">Best Regards,</p>
                <p style="font-size: 14px; color: #333333; line-height: 1.5;">{$companyName}</p>
            </td>
        </tr>
    </table>
</body>
</html>
EOT;


// Dont run unless we have a email
if (array_key_exists('email', $_POST) && PHPMailer::validateAddress($_POST['email'])) {
    $data = $_POST;
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    // Create PHPMailer Instance for Admin Email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->Password = $smtpPass;
    $mail->Username = $smtpUser;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = $smtpSecure;
    $mail->SMTPAutoTLS = $smtpAutoTLS;

    // Recipients
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail, $toName);

    if ($mail->addReplyTo($data['email'], $data['name'])) {
        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $adminHtmlEmail;
        $mail->AltBody = $adminTextEmail;

        if ($mail->send()) {
            http_response_code(200); // Email sent successfully
            $response = ["status" => true, "message" => 'Message sent! Thanks for contacting us.'];

            // Send Auto-Reply if $sendAutoReply is true
            if ($sendAutoReply) {
                $autoReplyMail = new PHPMailer();
                $autoReplyMail->isSMTP();
                $autoReplyMail->Host = $smtpHost;
                $autoReplyMail->Port = $smtpPort;
                $autoReplyMail->Password = $smtpPass;
                $autoReplyMail->Username = $smtpUser;
                $autoReplyMail->SMTPAuth = true;
                $autoReplyMail->SMTPSecure = $smtpSecure;
                $autoReplyMail->SMTPAutoTLS = $smtpAutoTLS;

                $autoReplyMail->setFrom($fromEmail, $companyName);
                $autoReplyMail->addAddress($data['email'], $data['name']);
                $autoReplyMail->CharSet = 'UTF-8';
                $autoReplyMail->addEmbeddedImage('logo.png', 'logo');
                $autoReplyMail->isHTML(true);
                $autoReplyMail->Subject = "Thank you for contacting {$companyName}";
                $autoReplyMail->Body = $autoReplyHtml;
                $autoReplyMail->AltBody = $autoReplyText;

                $autoReplyMail->send();
            } // End of Auto-Reply
        } else {
            http_response_code(500); // Internal Server Error
            $response = ["status" => false, "message" => 'Sorry, something went wrong. Please try again later.'];
        } // End of $mail->send()
    } else {
        http_response_code(400); // Bad Request (Invalid email address)
        $response = ["status" => false, "message" => 'Invalid email address, message ignored'];
    } // End of $mail->addReplyTo()

    if ($isAjax) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($response);
        exit();
    }
} // End of $_POST check

?>
