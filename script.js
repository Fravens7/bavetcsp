document.addEventListener('DOMContentLoaded', () => {

    // =======================================
    // 1. SCROLL REVEAL (JS de las clases .reveal)
    // =======================================

    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    window.addEventListener('load', reveal); 


    // =======================================
    // 2. PARALLAX DE FONDO
    // =======================================

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        // Selecciona elementos de fondo decorativos tanto fijos como de sección (decorative-element)
        const parallaxElements = document.querySelectorAll('.fixed > div, .decorative-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1); 
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });


    // =======================================
    // 3. GSAP SCROLLTRIGGER (Animación escalonada de las tarjetas de Servicios)
    // =======================================

    gsap.registerPlugin(ScrollTrigger);

    const serviceItems = gsap.utils.toArray(".service-grid > div");

    gsap.timeline({
        scrollTrigger: {
            trigger: ".service-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    })
    .to(serviceItems, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15
    });

    
    // =======================================
    // 4. SWIPER JS (Carrusel de Testimonios)
    // =======================================

    const swiper = new Swiper('.testimonialSlider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 2, spaceBetween: 40 },
            1280: { slidesPerView: 3, spaceBetween: 30 }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
        },
    });


    // =======================================
    // 5. EFECTOS HOVER INTERACTIVOS (3D Tilt)
    // =======================================

    // Función para añadir el efecto parallax 3D a las tarjetas
    function addTiltEffect(selector) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    addTiltEffect('.testimonial-card');
    addTiltEffect('.contact-card');


    // =======================================
    // 6. LÓGICA DE COMETAS EN EL HERO (Control de etiquetas)
    // =======================================

    const comets = document.querySelectorAll('.comet');
    const heroSection = document.querySelector('.hero');

    function checkCometPosition(comet) {
        const rect = comet.getBoundingClientRect();
        const heroRect = heroSection.getBoundingClientRect();
        if (rect.top > heroRect.top + heroRect.height / 2) {
            comet.classList.add('show-label');
        } else {
            comet.classList.remove('show-label');
        }
    }

    // Chequeo continuo para actualizar la posición de las etiquetas
    setInterval(() => { comets.forEach(checkCometPosition); }, 100);
    comets.forEach(checkCometPosition); 

    
    // =======================================
    // 7. EFECTO HOVER DE TEXTO EN RED SOCIAL
    // =======================================
    const socialTextElement = document.getElementById('social-text');
    if (socialTextElement) {
        const originalText = 'Neuron Tech Solutions'; // Manteniendo el texto largo por defecto
        const newText = 'Neuron Tech Solutions'; // Manteniendo el mismo, o puedes cambiarlo a "Visitar página"

        socialTextElement.parentElement.addEventListener('mouseenter', () => {
            socialTextElement.textContent = newText;
        });

        socialTextElement.parentElement.addEventListener('mouseleave', () => {
            socialTextElement.textContent = originalText;
        });
    }

});