/* ============================================
   ROADMAP - Animação de Progresso no Scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const roadmapContainer = document.querySelector('.roadmap-container');
    const roadmapProgress = document.getElementById('roadmapProgress');
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    
    if (!roadmapContainer || !roadmapProgress) return;
    
    // Função que atualiza o progresso da linha
    function updateProgress() {
        const containerRect = roadmapContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Ponto de referência: 60% da altura da tela
        const referencePoint = windowHeight * 0.6;
        
        // Calcula quanto da linha já foi "percorrido"
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        
        // Progresso de 0 a 1
        let progress = (referencePoint - containerTop) / containerHeight;
        progress = Math.max(0, Math.min(1, progress));
        
        // Aplica a altura da barra de progresso
        roadmapProgress.style.height = (progress * 100) + '%';
        
        // Ativa os markers conforme o scroll
        roadmapItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2;
            
            if (itemCenter < referencePoint + 50) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Listener de scroll com throttle
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Atualiza no carregamento
    updateProgress();
    window.addEventListener('resize', updateProgress);
});