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

$url        = strip_tags(trim($_POST['url'] ?? 'No URL provided'));
$timestamp  = strip_tags(trim($_POST['timestamp'] ?? date('Y-m-d H:i:s')));
$states_raw = $_POST['states'] ?? '[]';
$states     = json_decode($states_raw, true) ?: [];

$state_labels = ['0' => '○ Not evaluated', '1' => '✓ Pass', '2' => '⚠ Needs work', '3' => '✕ Fail'];

$categories = [
    'First Impression & Clarity' => [
        'Can someone tell what we do within 5 seconds of landing on our homepage?',
        'Is our current season, event, or film front and center?',
        'Is there one clear action we want visitors to take?',
        'Does the page guide the eye — or does everything compete for attention?',
        'Is the language clear and free of internal jargon?',
    ],
    'Consistency & Brand' => [
        'Are our fonts, colors, and tone the same across every page?',
        'Do our logos and images look sharp — not stretched, blurry, or oddly cropped?',
        'Does our copy feel like it came from one voice?',
        'Do interactive elements (buttons/links) look distinctly clickable?',
    ],
    'Accessibility' => [
        'Do our images have descriptions for screen readers?',
        'Can someone navigate our site without using a mouse?',
        'Does it still work if someone zooms in or increases text size?',
        'Is there sufficient color contrast between text and backgrounds?',
        'Are form fields clearly labeled?',
    ],
    'Practical Utility' => [
        'Is key info — dates, prices, descriptions — easy to copy, screenshot, or share?',
        'Do our pages print cleanly?',
        'Are links to tickets, social, and press materials easy to find?',
        'Does our site work on a phone without zooming or sideways scrolling?',
        'Are error messages helpful and allow easy recovery?',
        'Do pages load quickly on a standard connection?',
    ],
    'Trust & Credibility' => [
        'Do we have press assets available — photos, bios, logos?',
        'Does our site look current, or are there stale dates or broken links?',
        'Does our site show a padlock (https) in the browser bar?',
        'Is contact information or support easy to find?',
    ],
];

// Build readable summary
$body  = "UX Checklist Export\n";
$body .= str_repeat("─", 50) . "\n\n";
$body .= "URL Evaluated: {$url}\n";
$body .= "Exported:      {$timestamp}\n\n";
$body .= str_repeat("─", 50) . "\n\n";

$item_index = 0;
foreach ($categories as $category => $items) {
    $body .= strtoupper($category) . "\n";
    foreach ($items as $item) {
        $state     = isset($states[$item_index]) ? (string)$states[$item_index] : '0';
        $label     = $state_labels[$state] ?? '○ Not evaluated';
        $body     .= "  {$label}  {$item}\n";
        $item_index++;
    }
    $body .= "\n";
}

$body .= str_repeat("─", 50) . "\n";
$body .= "Sent via heathernew.com UX Checklist\n";

$to      = 'contact@heathernew.com';
$subject = "UX Checklist Export — " . parse_url($url, PHP_URL_HOST) . " — {$timestamp}";
$headers = "From: UX Checklist <no-reply@heathernew.com>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

echo json_encode(['success' => (bool)$sent]);
?>
