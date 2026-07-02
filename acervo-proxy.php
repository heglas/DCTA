<?php
/**
 * Proxy Local para Acervo Digital
 * 
 * Salve este arquivo em seu servidor Joomla como: /acervo-proxy.php
 * Use em Joomla: <script src="/acervo-proxy.js"></script>
 */

header('Content-Type: application/javascript; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=3600');

// Mapeamento de IDs para nomes de arquivo
$acervoMap = array(
    'S33' => 'MAB_T_004_S33@ACERVO.html',
    'BAFG120' => 'MAB_D_002_BAFG120@ACERVO.html',
    'SBAT70' => 'MAB_D_003_SBAT70@ACERVO.html',
    'SMA1' => 'MAB_D_001_SMA1@ACERVO.html',
    'EMB01' => 'MAB_A_001_EMB01@ACERVO.html',
    'SONDAIV' => 'MAB_E_001_SONDAIV@ACERVO.html'
);

$id = isset($_GET['id']) ? strtoupper($_GET['id']) : null;

if ($id && isset($acervoMap[$id])) {
    $filename = $acervoMap[$id];
    $filePath = dirname(__FILE__) . '/acervo/' . $filename;
    
    // Se arquivo existe localmente, usar
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        echo "
(function() {
    const html = " . json_encode($content) . ";
    const container = document.querySelector('[data-mab-acervo=\"" . $id . "\"]') || document.getElementById('mab-acervo-' + Math.random());
    if (container) {
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') {
            setTimeout(() => lucide.createIcons(), 100);
        }
    }
})();
        ";
        exit;
    }
}

// Fallback: retornar erro
echo "console.error('Acervo não encontrado: " . ($id ? $id : 'ID não fornecido') . "');";
?>
