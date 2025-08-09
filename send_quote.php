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
    $communication = filter_var(trim($_POST['communication']), FILTER_SANITIZE_STRING);
    $service_type = filter_var(trim($_POST['service_type']), FILTER_SANITIZE_STRING);
    $guest_count = filter_var(trim($_POST['guest_count']), FILTER_SANITIZE_STRING);
    $budget_range = filter_var(trim($_POST['budget_range']), FILTER_SANITIZE_STRING);
    $event_date = filter_var(trim($_POST['event_date']), FILTER_SANITIZE_STRING);
    $venue = filter_var(trim($_POST['venue']), FILTER_SANITIZE_STRING);
    $additional_info = filter_var(trim($_POST['additional_info']), FILTER_SANITIZE_STRING);
    
    // Validate required fields
    if (empty($fullname) || empty($email) || empty($phone) || empty($communication) || empty($service_type) || empty($guest_count) || empty($budget_range)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
        exit;
    }
    
    // Format service type for display
    $service_display = str_replace('_', ' ', ucwords($service_type, '_'));
    
    // Create email subject
    $subject = "New Quote Request from " . $fullname;
    
    // Create email body
    $message = "
    <html>
    <head>
        <title>New Quote Request - RAIVE Events</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #5cb85c; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #5cb85c; }
            .value { margin-bottom: 10px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Quote Request - RAIVE Events</h2>
        </div>
        
        <div class='content'>
            <div class='section'>
                <h3>Contact Information</h3>
                <div class='value'><span class='label'>Full Name:</span> $fullname</div>
                <div class='value'><span class='label'>Email:</span> $email</div>
                <div class='value'><span class='label'>Phone:</span> $phone</div>
                <div class='value'><span class='label'>Preferred Communication:</span> " . ucfirst($communication) . "</div>
            </div>
            
            <div class='section'>
                <h3>Event Details</h3>
                <div class='value'><span class='label'>Service Type:</span> $service_display</div>
                <div class='value'><span class='label'>Number of Guests:</span> $guest_count</div>
                <div class='value'><span class='label'>Budget Range:</span> $budget_range</div>
                <div class='value'><span class='label'>Event Date:</span> " . ($event_date ? date('F j, Y', strtotime($event_date)) : 'Not specified') . "</div>
                <div class='value'><span class='label'>Venue:</span> " . ($venue ? $venue : 'Not specified') . "</div>
            </div>
            
            " . ($additional_info ? "
            <div class='section'>
                <h3>Additional Information</h3>
                <div class='value'>$additional_info</div>
            </div>
            " : "") . "
        </div>
        
        <div class='footer'>
            <p>This quote request was submitted through the RAIVE Events website.</p>
            <p>Please respond to the client within 24 hours.</p>
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
        echo json_encode(['success' => true, 'message' => 'Quote request sent successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send quote request. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>