(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });


    // Hero Header carousel
    $(".header-carousel").owlCarousel({
        animateOut: 'fadeOut',
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 500,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });


    // attractions carousel
    $(".blog-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
    // Elementos da Galeria
    const galleryModalEl = document.getElementById('galleryModal');
    const modalTitle = document.getElementById('galleryModalLabel');
    const modalDesc = document.querySelector('.modal-description');
    const galleryGrid = document.getElementById('galleryImagesGrid');

    // Elementos do Lightbox
    const lightboxModalEl = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const btnPrev = document.getElementById('lightboxPrev');
    const btnNext = document.getElementById('lightboxNext');

    let currentImages = [];
    let currentIndex = 0;

    // Instâncias do Bootstrap
    const galleryModal = new bootstrap.Modal(galleryModalEl);
    const lightboxModal = new bootstrap.Modal(lightboxModalEl);

    // ============================================
    // 1. ABRIR A GALERIA (GRID)
    // ============================================
    if (galleryModalEl) {
        galleryModalEl.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;

            const title = button.getAttribute('data-title');
            const description = button.getAttribute('data-description');
            const imagesJson = button.getAttribute('data-images');

            modalTitle.textContent = title;
            modalDesc.textContent = description;
            galleryGrid.innerHTML = '';

            if (imagesJson) {
                try {
                    currentImages = JSON.parse(imagesJson);

                    currentImages.forEach((imgUrl, index) => {
                        const col = document.createElement('div');
                        col.className = 'col-6 col-md-4 col-lg-3';

                        const a = document.createElement('a');
                        a.href = 'javascript:void(0)'; // Evita pular para o topo
                        a.className = 'gallery-item';

                        const img = document.createElement('img');
                        img.src = imgUrl;
                        img.alt = 'Foto do evento';
                        img.loading = 'lazy';

                        // Clicou em uma foto: Abre o Lightbox POR CIMA da galeria
                        a.addEventListener('click', function (e) {
                            e.preventDefault();
                            currentIndex = index;
                            lightboxImage.src = currentImages[currentIndex];

                            // Abre o lightbox (A galeria NÃO fecha, ela fica no fundo)
                            lightboxModal.show();
                        });

                        a.appendChild(img);
                        col.appendChild(a);
                        galleryGrid.appendChild(col);
                    });
                } catch (e) {
                    console.error('Erro ao ler as imagens:', e);
                }
            }
        });
    }

    // ============================================
    // 2. FUNÇÕES DO LIGHTBOX
    // ============================================
    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImage.src = currentImages[currentIndex];
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImage.src = currentImages[currentIndex];
    }

    // Eventos das setas
    btnNext.addEventListener('click', showNextImage);
    btnPrev.addEventListener('click', showPrevImage);

    // Suporte para teclado (Setas esquerda/direita)
    document.addEventListener('keydown', function (e) {
        if (lightboxModalEl.classList.contains('show')) {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNavbar');
    const navOverlay = document.getElementById('navOverlay');
    const navbarCollapse = document.getElementById('navbarCollapse');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    // ============================================
    // 1. LÓGICA PARA ESCONDER/MOSTRAR NAVBAR NO SCROLL
    // ============================================
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Só começa a esconder depois de 50px de scroll

    window.addEventListener('scroll', function () {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Só aplica a lógica no mobile/tablet (largura menor que 992px)
        if (window.innerWidth < 992) {
            // Adiciona fundo branco se estiver rolado para baixo
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Lógica para esconder a navbar ao descer
            if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
                // Rolando para BAIXO - Esconde
                navbar.classList.add('navbar-hidden');
                navbar.classList.remove('navbar-visible');
            } else if (currentScroll < lastScrollTop) {
                // Rolando para CIMA - Mostra
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
        } else {
            // Se for desktop, garante que a navbar esteja sempre visível
            navbar.classList.remove('navbar-hidden');
            navbar.classList.remove('navbar-visible');
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // ============================================
    // 2. LÓGICA DO MENU LATERAL (OVERLAY)
    // ============================================
    // Ativar overlay quando o menu for aberto/fechado
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', function () {
            if (window.innerWidth < 992) {
                navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Trava o scroll da página atrás
            }
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function () {
            navOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Libera o scroll da página
        });
    }

    // Clicar no overlay fecha o menu
    if (navOverlay) {
        navOverlay.addEventListener('click', function () {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            bsCollapse.hide();
        });
    }

    // Clicar no botão X interno fecha o menu
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function () {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            bsCollapse.hide();
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // 1. Fecha o menu mobile ao clicar em qualquer link interno (âncora)
    const menuLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle), .navbar-nav .dropdown-item');
    const navbarCollapse = document.getElementById('navbarCollapse');

    if (navbarCollapse) {
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                // Verifica se o menu está aberto (comportamento mobile)
                if (navbarCollapse.classList.contains('show')) {
                    // Usa a API do Bootstrap 5 para esconder o menu suavemente
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Elementos
    const modalElement = document.getElementById('matriculaModal');
    const reopenBtn = document.getElementById('reopenMatriculaBtn');

    // Inicializa o modal do Bootstrap
    const matriculaModal = new bootstrap.Modal(modalElement);

    // Verifica se o usuário já fechou o modal antes
    const hasClosedModal = localStorage.getItem('matricula2027Fechada');

    if (hasClosedModal) {
        // Se já fechou, apenas mostra o botão discreto
        reopenBtn.classList.remove('d-none');
    } else {
        // Se não fechou, abre o modal após 1.5 segundos (para não atrapalhar o carregamento do PageSpeed)
        setTimeout(() => {
            matriculaModal.show();
        }, 1500);
    }

    // Quando o modal for fechado (pelo X ou clicando fora)
    modalElement.addEventListener('hidden.bs.modal', function () {
        // Salva no navegador do usuário que ele já viu
        localStorage.setItem('matricula2027Fechada', 'true');

        // Exibe o botão discreto
        reopenBtn.classList.remove('d-none');
    });

    // Quando o usuário clicar no botão discreto, abre o modal novamente
    reopenBtn.addEventListener('click', function () {
        matriculaModal.show();
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAcceptAll = document.getElementById('btn-accept-all');
    const btnEssential = document.getElementById('btn-essential');
    const btnClose = document.getElementById('btn-close-cookie');

    // Verifica se o usuário já fez uma escolha
    const consent = localStorage.getItem('zoe_cookie_consent');

    if (!consent) {
        // Se não houver escolha salva, mostra o banner após 1 segundo (para não atrapalhar o LCP)
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Função para fechar o banner e salvar a escolha
    function handleConsent(type) {
        localStorage.setItem('zoe_cookie_consent', type);
        cookieBanner.classList.remove('show');

        // Aguarda a animação de saída antes de esconder totalmente
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 400);
    }

    // Eventos dos botões
    btnAcceptAll.addEventListener('click', () => handleConsent('all'));
    btnEssential.addEventListener('click', () => handleConsent('essential'));

    // O botão "X" fecha o banner, mas por padrão salva como "essencial"
    btnClose.addEventListener('click', () => handleConsent('essential'));
});
