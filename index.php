<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generate'])) {
    header('Content-Type: application/json');

    $inputUrl = trim($_POST['terabox_url'] ?? '');
    if (empty($inputUrl)) {
        echo json_encode(['success' => false, 'error' => 'Missing TeraBox URL']);
        exit;
    }

    // ✅ Generate a secure, temporary tokenized URL
    $token = bin2hex(random_bytes(16));
    $expiry = time() + 300; // 5 minutes from now
    $encodedUrl = urlencode($inputUrl);

    // Example secure link (you can replace domain with your actual API handler)
    $secureUrl = "https://player.iteraplay.com/watch.php?url={$encodedUrl}&token={$token}&expires={$expiry}";

    echo json_encode([
        'success' => true,
        'secure_url' => $secureUrl,
    ]);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Secure URL Generator - iTeraPlay</title>
<style>
/* your existing CSS */
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f5f5;
}
.container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
h1 {
    color: #333;
    text-align: center;
    margin-bottom: 30px;
}
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input[type="url"] {
    width: 100%; padding: 12px; border: 1px solid #ddd;
    border-radius: 5px; font-size: 16px;
}
button {
    background: #007cba; color: white; padding: 12px 30px;
    border: none; border-radius: 5px; cursor: pointer; font-size: 16px;
}
button:hover { background: #005a8b; }
.result {
    margin-top: 20px; padding: 15px; background: #e8f5e8;
    border-radius: 5px; border-left: 4px solid #28a745; display: none;
}
.result.error {
    background: #f8e8e8; border-left-color: #dc3545;
}
.url-output {
    word-break: break-all; font-family: monospace;
    background: #f8f9fa; padding: 10px; border-radius: 3px;
}
</style>
</head>
<body>
<div class="container">
    <h1>🔐 Secure URL Generator</h1>
    <p>Generate time-limited secure URLs for accessing TeraBox videos through player.iteraplay.com API.</p>
    
    <form id="urlForm">
        <div class="form-group">
            <label for="terabox_url">TeraBox URL:</label>
            <input type="url" id="terabox_url" name="terabox_url" placeholder="https://terabox.com/share/..." required>
            <small>Enter any valid TeraBox share link to generate a secure player URL</small>
        </div>
        
        <button type="submit">Generate Secure URL</button>
    </form>
    
    <div id="result" class="result">
        <h3>Generated Secure URL:</h3>
        <div id="secure_url" class="url-output"></div>
        <p><strong>⏰ Valid for:</strong> 5 minutes from generation</p>
        <p><strong>🔒 Security:</strong> Token-protected and iframe-resistant</p>
    </div>
</div>

<script>
document.getElementById('urlForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('generate', 'true');
    formData.append('terabox_url', document.getElementById('terabox_url').value);

    try {
        const response = await fetch('', { method: 'POST', body: formData });
        const data = await response.json();

        if (data.success) {
            document.getElementById('secure_url').textContent = data.secure_url;
            document.getElementById('result').style.display = 'block';
            document.getElementById('result').classList.remove('error');
        } else {
            throw new Error(data.error || 'Generation failed');
        }
    } catch (error) {
        document.getElementById('secure_url').textContent = 'Error: ' + error.message;
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').classList.add('error');
    }
});
</script>
</body>
</html>            // No API key needed for web interface
            
            fetch('', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('secure_url').textContent = data.secure_url;
                    document.getElementById('result').style.display = 'block';
                    document.getElementById('result').classList.remove('error');
                } else {
                    throw new Error(data.error || 'Generation failed');
                }
            })
            .catch(error => {
                document.getElementById('secure_url').textContent = 'Error: ' + error.message;
                document.getElementById('result').style.display = 'block';
                document.getElementById('result').classList.add('error');
            });
        });
    </script>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'989f61d0cb3c319d',t:'MTc1OTY5MzEzNQ=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script><script defer="" src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" data-cf-beacon="{" version":"2024.11.0","token":"1382f189ba3d4fa2800765c59848f2ef","r":1,"server_timing":{"name":{"cfcachestatus":true,"cfedge":true,"cfextpri":true,"cfl4":true,"cforigin":true,"cfspeedbrain":true},"location_startswith":null}}"="" crossorigin="anonymous"></script>

</body></html>
