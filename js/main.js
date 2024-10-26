
document.addEventListener('DOMContentLoaded', function () {
    // Ensure GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded correctly.');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    // Cada cop que entres a la web comencis de dalt
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);
    // funcions
    iniciarPantallaCarga();
    iniciarBotonScroll();
    iniciarAparecerLetras();    
    iniciarAnimacionAbout();
    iniciarSliderHistories();
    iniciarSnapSecciones(); // Añadimos la función aquí
});



// Define CSS variables for colors directly
const colorsBySection = {
    home: {
        headerTextColor: 'var(--color-text)',
        textColor: 'var(--color-text-secondary)',
        backgroundColor: '',
        navColor: '#57160b'
    },
    phrases: {
        headerTextColor: 'var(--color-text)',
        textColor: 'var(--color-text-secondary)',
        backgroundColor: '',
        navColor: '#57160b'
    },
    about: {
        headerTextColor: 'var(--color-text)',
        textColor: 'var(--color-background-secondary)',
        backgroundColor: 'var(--color-text-secondary)',
        navColor: '#57160b'
    },
    projects: {
        headerTextColor: 'var(--color-background-secondary)',
        textColor: 'var(--color-text)',
        backgroundColor: 'white',
        navColor: '#57160b'
    },
    contact: {
        headerTextColor: 'var(--color-text)',
        textColor: 'var(--color-text-secondary)',
        backgroundColor: 'var(--color-background)',
        navColor: '#57160b'
    }
};

function iniciarPantallaCarga() {
    // Loading animation
    let loadingNumber = 0;
    const maxLoadingNumber = 10;
    const loadingInterval = 100; // 0.1 seconds 100 ms
    const currentNumberElement = document.querySelector('#current-number');
    const letterV = document.querySelector('.initials:first-child');
    const letterI = document.querySelector('.initials:last-child');
    const loadingNumberElement = document.querySelector('.loading-number');

    function updateLoading() {
        if (loadingNumber <= maxLoadingNumber) {
            let displayNumber = loadingNumber < 10 ? '0' + loadingNumber : loadingNumber;
            currentNumberElement.textContent = displayNumber;
            loadingNumber++;
            setTimeout(updateLoading, loadingInterval);
        } else {
            gsap.to(loadingNumberElement, {
                duration: 0.3,
                opacity: 0,
                onComplete: function () {
                    loadingNumberElement.style.display = 'none';

                    // Append and animate 'lada' to 'V'
                    const vText = 'lada'.split(''); // lada -> ['l','a','d','a']
                    vText.forEach(letter => {
                        const span = document.createElement('span');
                        span.textContent = letter;
                        span.classList.add('fade-letter');
                        letterV.appendChild(span);
                    });

                    // Append and animate 'vaniv' to 'I'
                    const iText = 'vaniv'.split('');
                    iText.forEach(letter => {
                        const span = document.createElement('span');
                        span.textContent = letter;
                        span.classList.add('fade-letter');
                        letterI.appendChild(span);
                    });

                    // Animate 'Designer' text
                    const designerText = 'Designer'.split('');
                    designerText.forEach(letter => {
                        const span = document.createElement('span');
                        span.textContent = letter;
                        span.classList.add('fade-letter-designer');
                        document.querySelector('.profession-text').appendChild(span);
                    });

                    gsap.fromTo(
                        '.fade-letter-designer',
                        { opacity: 0, y: -100 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'bounce.in',
                            stagger: 0.2,
                            onComplete: function () {
                                setTimeout(function () {
                                    gsap.to('#loading-screen', {
                                        duration: 0.5,
                                        opacity: 0,
                                        ease: "power2.out",
                                        onComplete: function () {
                                            document.getElementById('loading-screen').style.display = 'none';
                                            // Show the header and main content
                                            gsap.to('header', { duration: 1, opacity: 1, ease: "power2.out" });
                                            gsap.to('main', { duration: 1, opacity: 1, ease: "power2.out", delay: 0.5 });
                                            gsap.to('footer', { duration: 1, opacity: 1, ease: "power2.out", delay: 0.7 });
                                            // Re-enable scrolling
                                            document.body.style.overflowY = 'auto';
                                        }
                                    });
                                }, loadingInterval * 3);
                            }
                        }
                    );

                    gsap.fromTo(
                        '.fade-letter',
                        { opacity: 0, y: -100 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'bounce.in',
                            stagger: 0.2
                        }
                    );
                }
            });
        }
    }

    // Start the loading animation
    updateLoading();
}

function iniciarBotonScroll() {
    // Get the scroll button and its SVG icon
    const scrollBtn = document.getElementById('scroll-btn');
    const scrollBtnSvg = scrollBtn.querySelector('svg');
    // Get all sections
    const sections = Array.from(document.querySelectorAll('.parallax'));
    let currentSectionIndex = 0;
    // Function to update styles for each section
    sections.forEach((section, index) => {
        const sectionId = section.id;
        const colors = colorsBySection[sectionId] || {};

        // Change section text color
        if (colors.textColor) {
            section.style.color = colors.textColor;
            const pTag = section.querySelector('p');
            if (pTag) {
                pTag.style.color = colors.textColor;
            }
        }

        // Change header text color
        if (colors.headerTextColor) {
            const h1 = section.querySelector('h1');
            const h3 = section.querySelector('h3');
            if (h1) {
                h1.style.color = colors.headerTextColor;
            }
            if (h3) {
                h3.style.color = colors.headerTextColor;
            }
        }

        // Change background color
        const bg = section.querySelector('.bg');
        if (bg && colors.backgroundColor) {
            bg.style.backgroundColor = colors.backgroundColor;
        }
    });

    // Create a single IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8 // Considered visible when 80% of the section is visible
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = sections.indexOf(entry.target);
                if (index !== -1) {
                    currentSectionIndex = index;
                    // Update scroll button icon rotation
                    if (currentSectionIndex === sections.length - 1) {
                        scrollBtnSvg.style.transform = 'rotate(180deg)';
                    } else {
                        scrollBtnSvg.style.transform = 'rotate(0deg)';
                    }
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach((section) => {
        observer.observe(section);
    });

    // Scroll button click event
    scrollBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let nextSectionIndex = (currentSectionIndex + 1) % sections.length;
        let nextSection = sections[nextSectionIndex];
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        currentSectionIndex = nextSectionIndex;

        // Update scroll button icon rotation
        if (currentSectionIndex === sections.length - 1) {
            scrollBtnSvg.style.transform = 'rotate(180deg)';
        } else {
            scrollBtnSvg.style.transform = 'rotate(0deg)';
        }
    });
}

function iniciarAparecerLetras() {
    const wrapLetters = (element) => {
        const htmlContent = element.innerHTML;
        let wrappedText = '';
        let insideTag = false;

        for (let i = 0; i < htmlContent.length; i++) {
            const char = htmlContent[i];

            if (char === '<') {
                insideTag = true;
                wrappedText += char;
            } else if (char === '>') {
                insideTag = false;
                wrappedText += char;
            } else if (!insideTag && char.trim() !== "") {
                // Wrap only visible characters (no spaces)
                wrappedText += `<span>${char}</span>`;
            } else {
                // Leave spaces and HTML tags as they are
                wrappedText += char;
            }
        }

        element.innerHTML = wrappedText;
    };
    const textElement = document.getElementById('animatedText');
    wrapLetters(textElement);
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#phrases",
            scrub: true,
            pin: true,
            start: "top top",
            end: "+=200%"
        }
    });
    tl.from("#phrases span", { color: "#F72E00", backgroundColor: '#F72E00', stagger: 0.1 });
}

function iniciarAnimacionAbout() {
    const aboutSectionTrigger = {
        trigger: 'section#about',
        start: 'top top', 
        end: '+=200%',
        scrub: true
    };

    gsap.fromTo('section#about', {
        borderTopLeftRadius: '25% 100%',
        borderTopRightRadius: '25% 100%',
    }, {
        borderTopLeftRadius: '0% 0%',
        borderTopRightRadius: '0% 0%',
        ease: 'none',
        scrollTrigger: aboutSectionTrigger
    });
    gsap.fromTo(
        '#about h2',
        { x: '-100vw' },
        { x: 0, scrollTrigger: aboutSectionTrigger }
    );
}

function iniciarSliderHistories() {
    // Select all project images
    const projectImages = gsap.utils.toArray('.project-image');

    // Create a timeline for the image sequence
    const imagesTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "section#projects",
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=200%", // Extend the scroll time for smoother transitions
        anticipatePin: 1 // Makes the pin smoother
    }
    });

    // Select the first and second project specific images to show initially
    const firstShowProject = document.querySelector('#projects .show-first');
    const secondShowProject = document.querySelector('#projects .show-second');

    // First and second project transitions
    imagesTimeline
    .set(secondShowProject, { autoAlpha: 0, display: 'none' }) // Asegura que el segundo proyecto esté oculto y no ocupe espacio
    .to(firstShowProject, {
    autoAlpha: 1,
    display: 'block', // Muestra el primer proyecto
    duration: 1,
    ease: "power2.inOut"
    })
    .to(firstShowProject, {
    autoAlpha: 0,
    display: 'none', // Oculta el primer proyecto y no ocupa espacio
    duration: 1,
    ease: "power2.inOut"
    })
    .set(secondShowProject, { autoAlpha: 1, display: 'flex' }); // Muestra el segundo proyecto


    // Animate through the rest of the project images
    const projectImagesLength = projectImages.length;
    projectImages.forEach((image, i) => {
    // Animate each image in sequence: fade in, slide from the right
    imagesTimeline.from(image, {
        autoAlpha: 0,
        x: 100, // Slide in from the right
        duration: 1, // Slightly increase duration for smoother transitions
        ease: "power2.inOut"
    }, i * 1.5); // Delay each image's animation

    // Animate the previous image out as the next one comes in
    imagesTimeline.to(projectImages[(i - 1 + projectImagesLength) % projectImagesLength], {
        autoAlpha: 0,
        x: -100, // Slide out to the left
        duration: 1,
        ease: "power2.inOut"
    }, i * 1.5);
    });
    // Now change order property of the iphone-frame and the story-marketing-text
    const iphoneFrame = document.querySelector('.iphone-frame');
    const storyMarketingText = document.querySelector('.story-marketing-text');
    imagesTimeline.fromTo(iphoneFrame, { order: 0 }, { order: 1 });
    imagesTimeline.fromTo(storyMarketingText, { order: 1, textAlign: 'right', 'paddingRight': '0%', 'paddingLeft': '20%' }, { order: 0, textAlign: 'left', 'paddingRight': '20%', 'paddingLeft': '0%'});
    

}
