<?php
session_start();

// Configurações de segurança
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['url'])) {
    $url = filter_input(INPUT_GET, 'url', FILTER_SANITIZE_URL);
    if (filter_var($url, FILTER_VALIDATE_URL)) {
        $_SESSION['referer'] = $_SERVER['HTTP_REFERER'] ?? 'javascript:history.back()';
        header('Content-Security-Policy: script-src \'self\'');
        echo <<<HTML
<!DOCTYPE html>
<html>
<head>
    <script>
    (function() {
        try {
            const newWindow = window.open('{$url}', '_blank');
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                alert('Permita popups para usar esta função!');
                window.location.href = '{$_SESSION['referer']}';
                return;
            }
            if (window.history.state && window.history.state !== 'x-callback') {
                window.history.replaceState('x-callback', '');
            }
            window.history.back();
        } catch (e) {
            console.error('Erro:', e);
            window.location.href = '{$_SESSION['referer']}';
        }
    })();
    </script>
</head>
<body></body>
</html>
HTML;
        exit;
    }
    http_response_code(400);
    die("URL inválida!");
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abrir URL Externa</title>
    <style>
        .container { max-width: 600px; margin: 2rem auto; padding: 20px; }
        form { display: flex; gap: 10px; }
        input { flex: 1; padding: 8px; }
        button { padding: 8px 16px; background: #007bff; color: white; border: none; }
    </style>
</head>
<body>
    <div class="container">
        <form method="GET" onsubmit="document.getElementById('loading').style.display='block'">
            <input 
                type="url" 
                name="url" 
                placeholder="https://exemplo.com" 
                required
                pattern="https?://.+"
                title="Insira uma URL completa começando com http:// ou https://"
            >
            <button type="submit">Abrir em Nova Aba</button>
        </form>
        <div id="loading" style="display:none; margin-top:10px;">
            Processando...
        </div>
    </div>
</body>
</html>
