<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

$relevance = strip_tags(trim($_POST['Relevance_Rating'] ?? 'No response'));
$overall   = strip_tags(trim($_POST['Overall_Rating']   ?? 'No response'));
$feedback  = strip_tags(trim($_POST['Additional_Feedback'] ?? ''));
$timestamp = date('Y-m-d H:i:s');

$stars = fn($n) => str_repeat('★', (int)$n) . str_repeat('☆', max(0, 5 - (int)$n));

$body  = "Post-Presentation UX Survey Response\n";
$body .= str_repeat("─", 50) . "\n\n";
$body .= "Received:          {$timestamp}\n\n";
$body .= str_repeat("─", 50) . "\n\n";
$body .= "Relevance & Value: {$relevance}/5  {$stars($relevance)}\n";
$body .= "Overall Experience: {$overall}/5  {$stars($overall)}\n\n";

if (!empty($feedback)) {
    $body .= "Additional Feedback:\n";
    $body .= $feedback . "\n\n";
} else {
    $body .= "Additional Feedback: (none provided)\n\n";
}

$body .= str_repeat("─", 50) . "\n";
$body .= "Sent via heathernew.com survey\n";

$to      = 'contact@heathernew.com';
$subject = "Survey Response — Relevance {$relevance}/5, Overall {$overall}/5 — {$timestamp}";
$headers  = "From: Survey <no-reply@heathernew.com>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

echo json_encode(['success' => (bool)$sent]);
?>
