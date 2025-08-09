<?php
header('Content-Type: application/json');

// Email configuration
$to_email = "harunk3570@gmail.com";
$from_email = "noreply@raiveevents.com";
$from_name = "RAIVE Events Website";

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input data
    $fullname = filter_var(trim($_POST['fullname']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST['phone']), FILTER_SANITIZE_STRING);
    $message_content = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);
    
    // Validate required fields
    if (empty($fullname) || empty($email) || empty($message_content)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
        exit;
    }
    
    // Create email subject
    $subject = "New Contact Message from " . $fullname;
    
    // Create email body
    $message = "
    <html>
    <head>
        <title>New Contact Message - RAIVE Events</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #5cb85c; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #5cb85c; }
            .value { margin-bottom: 10px; }
            .message-box { background: #f8f9fa; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Contact Message - RAIVE Events</h2>
        </div>
        
        <div class='content'>
            <div class='section'>
                <h3>Contact Information</h3>
                <div class='value'><span class='label'>Full Name:</span> $fullname</div>
                <div class='value'><span class='label'>Email:</span> $email</div>
                " . ($phone ? "<div class='value'><span class='label'>Phone:</span> $phone</div>" : "") . "
            </div>
            
            <div class='section'>
                <h3>Message</h3>
                <div class='message-box'>
                    " . nl2br(htmlspecialchars($message_content)) . "
                </div>
            </div>
        </div>
        
        <div class='footer'>
            <p>This message was submitted through the RAIVE Events website contact form.</p>
            <p>Please respond to the client as soon as possible.</p>
        </div>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $from_name <$from_email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    // Send email
    if (mail($to_email, $subject, $message, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>