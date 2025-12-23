// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Set active nav link based on current page path (multi-page site)
    function setActiveNavLinkByPath() {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === current || (current === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveNavLinkByPath();

    // CTA Button Actions (prefer data-action to avoid coupling to text)
    const ctaButtons = document.querySelectorAll('.cta-button, .info-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const buttonText = (this.textContent || '').trim();

            if (action === 'join') {
                window.location.href = 'join.html';
                return;
            }
            if (action === 'contact') {
                window.location.href = 'join.html#contact';
                return;
            }

            // Fallback to text-based routing for existing content
            if (buttonText === 'Join Now' || buttonText === 'Join GIN Today') {
                window.location.href = 'join.html';
            } else if (
                buttonText === 'Get Membership Info' ||
                buttonText === 'Contact Us' ||
                buttonText === 'View FAQ'
            ) {
                window.location.href = 'join.html#contact';
            }
        });
    });

    // EmailJS init (if config and sdk present)
    if (window.EMAILJS_CONFIG && window.emailjs) {
        try {
            emailjs.init(window.EMAILJS_CONFIG.PUBLIC_KEY);
        } catch (e) {
            console.warn('EmailJS init failed:', e);
        }
    }

    // Contact form via EmailJS
    const contactForm = document.querySelector('.contact-form form');
    const emailStatus = document.getElementById('emailjs-status');
    const configLooksUnset = window.EMAILJS_CONFIG && (
        window.EMAILJS_CONFIG.PUBLIC_KEY.includes('REPLACE_WITH') ||
        window.EMAILJS_CONFIG.SERVICE_ID.includes('REPLACE_WITH') ||
        window.EMAILJS_CONFIG.TEMPLATE_ID.includes('REPLACE_WITH')
    );
    if (emailStatus && (!window.EMAILJS_CONFIG || !window.emailjs || configLooksUnset)) {
        emailStatus.textContent = 'Message sending is not configured yet. Please email lucafujiwara9@gmail.com directly.';
        emailStatus.classList.add('error');
    }

    if (contactForm && window.EMAILJS_CONFIG && window.emailjs && !configLooksUnset) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : '';

            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                await emailjs.send(
                    window.EMAILJS_CONFIG.SERVICE_ID,
                    window.EMAILJS_CONFIG.TEMPLATE_ID,
                    {
                        from_name: name,
                        from_email: email,
                        message: message,
                        to_email: window.EMAILJS_CONFIG.TO_EMAIL,
                        subject: 'GIN Club Website Message'
                    }
                );
                if (window.fireConfetti) {
                    const rect = contactForm.getBoundingClientRect();
                    window.fireConfetti(rect.left + rect.width/2, rect.top + window.scrollY + 40, {count: 40});
                }
                alert('Thanks! Your message was sent.');
                this.reset();
            } catch (err) {
                console.error('EmailJS send error:', err);
                alert('Sorry, there was a problem sending your message. Please email lucafujiwara9@gmail.com directly.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        });
    } else {
        // As a fallback, keep the direct email link below the form
        console.warn('EmailJS not configured. Please set keys in emailjs.config.js');
    }

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.event-card, .stat, .membership-form');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
    
    // Run animation check on load
    animateOnScroll();

    // Live clock in navbar and tab title
    const navClock = document.querySelector('.nav-clock');
    const originalTitle = document.title;
    function formatTime(date) {
        let h = date.getHours();
        const m = date.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    }
    function updateClock() {
        const now = new Date();
        const t = formatTime(now);
        if (navClock) navClock.textContent = t;
        document.title = `${originalTitle} | ${t}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Apply typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }

    // Add parallax effect to hero section
    function parallaxEffect() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }

    // Add scroll event listener for parallax (optional, can be removed if too much)
    // window.addEventListener('scroll', parallaxEffect);

    // Section reveal animations (generic)
    const revealSelectors = [
        '.section .section-title',
        '.event-card',
        '.stat',
        '.membership-form',
        '.photo',
        '.project-card',
        '.info-card',
        '.team-member',
        '.mission-card',
        '.vision-card',
        '.team-info',
        '.join-cta'
    ];
    const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(',')));
    revealElements.forEach(el => el.classList.add('will-reveal'));

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => io.observe(el));

    // Add hover effects for event cards
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Counter animation for statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''));
            const increment = target / 50; // Animation duration
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            // Start counter animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter.parentElement);
        });
    }

    // Initialize counter animations
    animateCounters();

    // Winter Fest Countdown
    function initWinterFestCountdown() {
        // Target date: December 6th, 2025
        const targetDate = new Date("2025-12-06T00:00:00").getTime();

        const countdown = () => {
            const now = new Date().getTime();
            let distance = targetDate - now;

            if (distance < 0) distance = 0;

            // Approximate months calculation (30 days per month)
            const totalMonths = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
            const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update countdown elements if they exist
            const monthsEl = document.getElementById("months");
            const daysEl = document.getElementById("days");
            const hoursEl = document.getElementById("hours");
            const minutesEl = document.getElementById("minutes");
            const secondsEl = document.getElementById("seconds");

            if (monthsEl) monthsEl.textContent = totalMonths;
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        };

        // Only start countdown if countdown elements exist
    if (document.getElementById("countdown")) {
            countdown(); // Initial call
            setInterval(countdown, 1000);
        }
    }

    // Initialize Winter Fest countdown
    initWinterFestCountdown();

    // Ensure hero video attempts autoplay with fallbacks
    function initHeroVideoAutoplay() {
        const v = document.querySelector('.hero-video');
        if (!v) return;
        v.muted = true;
        v.setAttribute('muted','');
        v.setAttribute('playsinline','');
        const hero = v.closest('.hero');
        const fallbackToImage = () => {
            if (!hero) return;
            hero.classList.remove('hero-has-video');
            hero.style.background = "linear-gradient(135deg, rgba(59,83,139,0.82), rgba(59,83,139,0.82)), url('assets/gin-hero.png')";
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        };
        const tryPlay = () => {
            const p = v.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => fallbackToImage());
            }
        };
        tryPlay();
        document.addEventListener('click', tryPlay, { once: true });
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        tryPlay();
                        io.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            io.observe(v);
        }
    }
    initHeroVideoAutoplay();

    // Mini‑Quiz (SDG / Sustainability)
    function initSdgQuiz() {
        const host = document.querySelector('#sdg-quiz');
        if (!host) {
            console.warn('Quiz container #sdg-quiz not found');
            return;
        }
        console.log('Initializing quiz...');
        const qn = [
            {
                q: 'Roughly what share of global carbon emissions comes from the fashion industry?',
                options: ['About 1%', 'About 10%', 'About 25%'],
                correct: 1,
                explain: 'Fast fashion has a big footprint — around 10% of global emissions.'
            },
            {
                q: 'About how much water can a single cotton t‑shirt take to produce?',
                options: ['270 liters', '2,700 liters', '27,000 liters'],
                correct: 1,
                explain: 'Around 2,700 liters — roughly what one person drinks in 3 years.'
            },
            {
                q: 'Best practice when donating clothes?',
                options: ['Any condition is fine', 'Only new clothes', 'Clean items with no rips or stains'],
                correct: 2,
                explain: 'Please donate clean items in good condition (no rips or stains).'
            },
            {
                q: 'How long can a typical plastic bottle take to decompose?',
                options: ['~50 years', '~150 years', '~450 years'],
                correct: 2,
                explain: 'Plastic bottles can persist for hundreds of years—often around 450 years.'
            },
            {
                q: 'Roughly what share of food produced is lost or wasted globally?',
                options: ['About 8%', 'About 17%', 'About 33%'],
                correct: 2,
                explain: 'About one‑third of food is lost or wasted worldwide.'
            },
            {
                q: 'For short trips, which option is usually most eco‑friendly?',
                options: ['Driving alone', 'Public transit', 'Walking or biking'],
                correct: 2,
                explain: 'Walking or biking produce zero direct emissions and improve health.'
            },
            {
                q: 'How many UN Sustainable Development Goals (SDGs) are there?',
                options: ['12', '17', '21'],
                correct: 1,
                explain: 'There are 17 SDGs adopted by UN member states.'
            },
            {
                q: 'Which household change usually saves the most energy?',
                options: ['Switching to LED bulbs', 'Unplugging phone chargers', 'Lowering heating/AC by 1–2°C (or 2–3°F)'],
                correct: 2,
                explain: 'Space heating/cooling is a major energy use—small thermostat changes can save a lot.'
            },
            {
                q: 'E‑waste (old electronics) can contain valuable metals like…',
                options: ['Gold and copper', 'Lead only', 'Tin only'],
                correct: 0,
                explain: 'Recycling e‑waste can recover gold, copper and other materials.'
            },
            {
                q: 'Which meat has the highest average carbon footprint per kg?',
                options: ['Chicken', 'Beef', 'Pork'],
                correct: 1,
                explain: 'Beef typically has the largest footprint due to feed, land use and methane.'
            },
            {
                q: 'Which of these is a renewable energy source?',
                options: ['Coal', 'Natural gas', 'Solar'],
                correct: 2,
                explain: 'Solar, wind, and hydro are renewable sources.'
            },
            {
                q: 'An easy water‑saving habit at home is…',
                options: ['Shorter showers', 'Run tap while brushing', 'Water lawn at noon'],
                correct: 0,
                explain: 'Shorter showers save a lot of hot water and energy.'
            },
            {
                q: 'Recycling one metric ton of paper saves about how many trees?',
                options: ['~17', '~3', '~50'],
                correct: 0,
                explain: 'Around 17 mature trees on average.'
            },
            {
                q: 'How can you reduce microfiber pollution from washing synthetics?',
                options: ['Use hotter water', 'Wash full loads and use a laundry bag', 'Use longer cycles'],
                correct: 1,
                explain: 'Full loads, gentler cycles, and a filter or laundry bag can reduce shedding.'
            },
            {
                q: 'Buying local, seasonal produce mainly helps reduce…',
                options: ['Water usage only', 'Transport emissions (food miles)', 'Soil nutrients'],
                correct: 1,
                explain: 'Shorter transport routes cut emissions from refrigeration and trucking.'
            }
        ];
        let i = 0, score = 0, answered = false, selected = -1;
        host.innerHTML = '';

        const ui = {
            progress: document.createElement('div'),
            question: document.createElement('div'),
            options: document.createElement('div'),
            explain: document.createElement('div'),
            actions: document.createElement('div')
        };
        ui.progress.className = 'progress';
        ui.question.className = 'question';
        ui.options.className = 'options';
        ui.explain.className = 'explain';
        ui.actions.className = 'actions';
        host.appendChild(ui.progress);
        host.appendChild(ui.question);
        host.appendChild(ui.options);
        host.appendChild(ui.explain);
        host.appendChild(ui.actions);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'cta-button secondary';
        nextBtn.type = 'button';
        nextBtn.textContent = 'Next';
        const submitBtn = document.createElement('button');
        submitBtn.className = 'cta-button';
        submitBtn.type = 'button';
        submitBtn.textContent = 'Submit';
        submitBtn.style.display = 'none'; // Simplify UX: auto-submit on option click
        ui.actions.appendChild(submitBtn);
        ui.actions.appendChild(nextBtn);

        function render() {
            answered = false; selected = -1; ui.explain.textContent = '';
            ui.progress.textContent = `Question ${i+1} of ${qn.length}`;
            ui.question.textContent = qn[i].q;
            ui.options.innerHTML = '';
            qn[i].options.forEach((opt, idx) => {
                const div = document.createElement('div');
                div.className = 'option';
                div.tabIndex = 0;
                div.textContent = opt;
                div.addEventListener('click', () => select(idx, div));
                div.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); select(idx, div);} });
                ui.options.appendChild(div);
            });
            submitBtn.disabled = false;
            nextBtn.disabled = true;
        }

        function select(idx, el) {
            if (answered) return;
            selected = idx;
            ui.options.querySelectorAll('.option').forEach(o=> o.classList.remove('selected'));
            el.classList.add('selected');
            // Auto-submit upon selection
            submit();
        }

        function submit() {
            if (answered || selected === -1) return;
            answered = true;
            const correct = qn[i].correct;
            const opts = ui.options.querySelectorAll('.option');
            opts.forEach((o, idx)=>{
                if (idx === correct) o.classList.add('correct');
                if (idx === selected && selected !== correct) o.classList.add('incorrect');
            });
            ui.explain.textContent = qn[i].explain;
            if (selected === correct) score++;
            submitBtn.disabled = true;
            nextBtn.disabled = false;
            nextBtn.focus();
        }

        function next() {
            if (!answered) return;
            i++;
            if (i < qn.length) {
                render();
            } else {
                // done
                host.classList.add('done');
                host.innerHTML = '';
                const scoreEl = document.createElement('div');
                scoreEl.className = 'score';
                scoreEl.textContent = `Score: ${score}/${qn.length}`;
                const msg = document.createElement('p');
                msg.textContent = score === qn.length ? 'Perfect! You’re a GIN changemaker.' : 'Nice! Want to learn more and make impact?';
                const actions = document.createElement('div');
                actions.className = 'actions';
                const joinBtn = document.createElement('button');
                joinBtn.className = 'cta-button';
                joinBtn.textContent = 'Join GIN';
                joinBtn.addEventListener('click', ()=> window.location.href = 'join.html');
                actions.appendChild(joinBtn);
                host.appendChild(scoreEl);
                host.appendChild(msg);
                host.appendChild(actions);
                if (window.fireConfetti) window.fireConfetti(window.innerWidth/2, window.innerHeight/3, {count: 36});
            }
        }

        submitBtn.addEventListener('click', submit);
        nextBtn.addEventListener('click', next);
        render();
        console.log('Quiz initialized successfully');
    }
    
    // Call quiz initialization
    initSdgQuiz();

    // Members-only email allowlist + one-time code (client-side gate)
    const loginRoot = document.getElementById('member-login');
    const emailInput = document.getElementById('member-email');
    const codeInput = document.getElementById('member-code');
    const sendBtn = document.getElementById('send-code');
    const verifyBtn = document.getElementById('verify-code');
    const statusEl = document.getElementById('member-status');

    const DEFAULT_ALLOWLIST = [
        'dwilley@asij.ac.jp',
        '30fujiwaral@asij.ac.jp',
        '30goldenl@asij.ac.jp'
    ];
    const DEFAULT_ALLOWED_DOMAINS = ['asij.ac.jp'];
    const ALLOW_KEY = 'gin_allowlist_v1';
    function getAllowlist(){
        try { const v = JSON.parse(localStorage.getItem(ALLOW_KEY)); if (Array.isArray(v)) return v; } catch(_) {}
        return DEFAULT_ALLOWLIST;
    }
    function setAllowlist(list){ try { localStorage.setItem(ALLOW_KEY, JSON.stringify(list)); } catch(_) {} }
    function isAllowedEmail(email){
        const e = String(email).toLowerCase();
        const list = getAllowlist().map(v=>String(v).toLowerCase());
        if (list.includes(e)) return true;
        return DEFAULT_ALLOWED_DOMAINS.some(d => e.endsWith('@' + d.toLowerCase()));
    }

    const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
    const RESEND_DELAY_MS = 30 * 1000; // 30 seconds
    const SHOW_CODE_IF_EMAIL_FAILS = true; // show fallback code if email delivery fails, so you can still test

    function setStatus(msg, ok=false){
        if (!statusEl) return; statusEl.textContent = msg; statusEl.classList.toggle('error', !ok); statusEl.classList.toggle('success', ok);
    }
    function generateCode(){ return String(Math.floor(100000 + Math.random()*900000)); }

    async function sendCode(){
        if (!emailInput) return;
        const email = (emailInput.value || '').trim().toLowerCase();
        // Validate email format (fix: use \s in JS only once in regex literals)
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setStatus('Enter a valid email'); return; }
        // Enforce allowlist/domain restriction
        if (!isAllowedEmail(email)) { setStatus('Email not allowed (use your @asij.ac.jp email)'); return; }
        const last = +sessionStorage.getItem('gin_code_last') || 0;
        if (Date.now() - last < RESEND_DELAY_MS) { setStatus('Please wait before resending'); return; }
        // Disable send button only after passing validations
        if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Sending...'; }
        const code = String(Math.floor(100000 + Math.random()*900000));
        const payload = { code, email, exp: Date.now() + CODE_TTL_MS };
        sessionStorage.setItem('gin_pending_code', JSON.stringify(payload));
        sessionStorage.setItem('gin_code_last', String(Date.now()));

        try {
            if (window.emailjs && window.EMAILJS_CONFIG) {
                try { emailjs.init(window.EMAILJS_CONFIG.PUBLIC_KEY); } catch(_){ }
                const localPart = email.split('@')[0] || 'Member';
                const expiryText = '10 minutes';
                const payloadUser = {
                    from_name: 'GIN Members Login',
                    to_name: localPart,
                    reply_to: window.EMAILJS_CONFIG.TO_EMAIL,
                    from_email: window.EMAILJS_CONFIG.TO_EMAIL,
                    to_email: email, // requires your EmailJS template to route to {{to_email}}
                    subject: `Your GIN Login Code: ${code}`,
                    message: `Your one-time code is ${code}. It expires in ${expiryText}.`,
                    code: code,
                    otp: code,
                    login_code: code,
                    code_expiry: expiryText
                };
                const payloadAdmin = {
                    from_name: 'GIN Members Login (copy)',
                    to_name: 'Admin',
                    reply_to: window.EMAILJS_CONFIG.TO_EMAIL,
                    from_email: window.EMAILJS_CONFIG.TO_EMAIL,
                    to_email: window.EMAILJS_CONFIG.TO_EMAIL, // backup to admin email
                    subject: `GIN OTP backup copy: ${code}`,
                    message: `Backup: ${email} requested a code. OTP: ${code}. Expires in ${expiryText}.`,
                    code: code,
                    otp: code,
                    login_code: code,
                    code_expiry: expiryText
                };
                const sendUser = emailjs.send(
                    window.EMAILJS_CONFIG.SERVICE_ID,
                    window.EMAILJS_CONFIG.TEMPLATE_ID,
                    payloadUser
                );
                const sendAdmin = emailjs.send(
                    window.EMAILJS_CONFIG.SERVICE_ID,
                    window.EMAILJS_CONFIG.TEMPLATE_ID,
                    payloadAdmin
                ).catch(()=>{});

                let ok = false;
                try { await sendUser; ok = true; } catch(e) { console.warn('User email send failed', e); }
                try { await sendAdmin; } catch(e) { console.warn('Admin backup send failed', e); }

                if (ok) {
                    setStatus('Code sent to your email', true);
                    try { showToast('Code sent'); } catch(_){ }
                    if (window.fireConfetti) window.fireConfetti(window.innerWidth/2, 120, {count: 16, spread: 70});
                    try { codeInput && codeInput.focus(); } catch(_){ }
                } else {
                    if (SHOW_CODE_IF_EMAIL_FAILS) {
                        setStatus(`Dev fallback code: ${code}`);
                        try { showToast('Use fallback code shown below'); } catch(_){ }
                        if (codeInput) { codeInput.value = code; codeInput.focus(); }
                    } else {
                        setStatus('Could not send email. Please contact an admin.');
                    }
                }
            } else {
                setStatus('Email not configured; please contact an admin');
            }
        } catch (e) {
            console.warn('Email send failed', e);
            if (SHOW_CODE_IF_EMAIL_FAILS) {
                setStatus(`Dev fallback code: ${code}`);
                try { showToast('Use fallback code shown below'); } catch(_){ }
                if (codeInput) { codeInput.value = code; codeInput.focus(); }
            } else {
                setStatus('Could not send email. Please try again later.');
            }
        } finally {
            if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Send Code'; }
        }
    }

    function verifyCode(){
        const entered = (codeInput.value || '').trim();
        const stored = sessionStorage.getItem('gin_pending_code');
        if (!stored) { setStatus('No code requested yet'); return; }
        try {
            const data = JSON.parse(stored);
            if (Date.now() > data.exp) { setStatus('Code expired'); return; }
            if (entered !== data.code) { setStatus('Incorrect code'); return; }
            sessionStorage.setItem('gin_access', 'ok');
            sessionStorage.setItem('gin_email', data.email);
            setStatus('Verified!', true);
            try { showToast('Email verified'); } catch(_){ }
            if (window.fireConfetti) window.fireConfetti(window.innerWidth/2, window.innerHeight/3, {count: 28, spread: 80});
            setTimeout(()=>{ window.location.href = 'members.html'; }, 500);
        } catch (_) {
            setStatus('Invalid session');
        }
    }

    if (loginRoot) {
        sendBtn && sendBtn.addEventListener('click', sendCode);
        verifyBtn && verifyBtn.addEventListener('click', verifyCode);
    }

    // Hook EmailJS success to confetti (if available later)
    document.addEventListener('emailjs:success', (e) => {
        const cx = window.innerWidth/2, cy = window.innerHeight/3;
        if (window.fireConfetti) window.fireConfetti(cx, cy, {count: 36});
    });

    // Back-to-top button and scroll progress bar
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label','Back to top');
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
        const h = document.documentElement;
        const scrolled = (h.scrollTop || document.body.scrollTop);
        const height = h.scrollHeight - h.clientHeight;
        const pct = height > 0 ? scrolled / height : 0;
        progressBar.style.transform = `scaleX(${pct})`;
    }

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 400);
        updateProgress();
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    updateProgress();

    // Theme toggle button injected into navbar
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle';
        themeBtn.type = 'button';
        themeBtn.title = 'Toggle theme';
        themeBtn.textContent = 'Theme';
        navContainer.appendChild(themeBtn);

        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const saved = localStorage.getItem('theme');
        const initialTheme = saved || (prefersDark ? 'dark' : 'light');

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            localStorage.setItem('theme', theme);
            themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        }

        applyTheme(initialTheme);
        themeBtn.addEventListener('click', (ev) => {
            const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(next);
            if (window.fireConfetti) window.fireConfetti(ev.clientX, ev.clientY, {count: 20, spread: 80});
        });
    }
});

// Add CSS for active nav links
const style = document.createElement('style');
style.textContent = `
    /* Active nav link without background box */
    .nav-link.active {
        color: white;
        text-shadow: 0 0 6px rgba(255,255,255,0.35);
    }
    
    .animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .event-card,
    .stat {
        opacity: 0.8;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }

    /* Reveal animation */
    .will-reveal {
        opacity: 0;
        transform: translateY(18px);
        transition: opacity 600ms ease, transform 600ms ease;
    }
    .will-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;

document.head.appendChild(style);

// Extra styles for back-to-top button, scroll progress bar, ripple, scroll hint, toast, navbar animations
const extraStyle = document.createElement('style');
extraStyle.textContent = `
    .back-to-top {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: #3b538b;
        color: #fff;
        font-size: 20px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 2000;
    }
    .back-to-top.show {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
    }
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, #3b538b, #4a63a0);
        transform-origin: 0 0;
        transform: scaleX(0);
        z-index: 1500;
    }
    /* Navbar scroll states */
    .navbar {
        transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, height 0.2s ease;
    }
    .navbar.scrolled {
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        background-color: #334a7a;
    }
    .navbar.nav-hide { transform: translateY(-100%); }

    /* Nav link underline animation */
    .nav-link { position: relative; }
    .nav-link::after {
        content: '';
        position: absolute;
        left: 12px; right: 12px; bottom: 6px;
        height: 2px;
        background: rgba(255,255,255,0.9);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
    }
    .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

    /* Ripple effect */
    .cta-button, .info-button, button { position: relative; overflow: hidden; }
    .ripple {
        position: absolute; border-radius: 50%;
        background: rgba(255,255,255,0.5);
        transform: scale(0);
        animation: ripple 600ms ease-out;
        pointer-events: none;
    }
    @keyframes ripple {
        to { transform: scale(3); opacity: 0; }
    }

    /* Hero scroll hint */
    .scroll-hint {
        position: absolute;
        bottom: 20px; left: 50%; transform: translateX(-50%);
        width: 40px; height: 40px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.9);
        color: #fff; background: transparent; cursor: pointer;
        display: grid; place-items: center; font-size: 22px;
        animation: bounce 1.8s infinite;
        z-index: 10;
    }
    @keyframes bounce {
        0%, 100% { transform: translate(-50%, 0); }
        50% { transform: translate(-50%, -6px); }
    }

    /* Floating decorative dots inside hero */
    .floaty-dot {
        position: absolute; width: 10px; height: 10px; border-radius: 50%;
        background: rgba(255,255,255,0.25);
        animation: floatUp linear infinite;
        pointer-events: none; z-index: 0;
    }
    @keyframes floatUp {
        0% { transform: translateY(20px); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(-160px); opacity: 0; }
    }

    /* Copy email pill */
    .copy-email {
        margin-left: 8px; padding: 4px 8px; font-size: 0.8rem;
        border-radius: 999px; border: 1px solid #3b538b; color: #3b538b; background: #fff;
        cursor: pointer;
    }
    body.dark-theme .copy-email { background: #0f1217; color: #8fb0ff; border-color: #8fb0ff; }

    /* Toast */
    .toast {
        position: fixed; left: 50%; bottom: 80px; transform: translateX(-50%) translateY(10px);
        background: #3b538b; color: #fff; padding: 10px 14px; border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2); opacity: 0; transition: opacity .25s ease, transform .25s ease;
        z-index: 3000;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* Cursor glow */
    .cursor-glow {
        position: fixed; left: 0; top: 0;
        width: 180px; height: 180px; border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none; filter: blur(30px); opacity: 0.35;
        background: radial-gradient(circle, rgba(79,121,209,0.65), transparent 60%);
        mix-blend-mode: screen; z-index: 1400;
        transition: opacity .2s ease;
    }

    /* Lightbox */
    .lightbox {
        position: fixed; inset: 0; background: rgba(0,0,0,0.75);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity .25s ease; z-index: 3500;
    }
    .lightbox.open { opacity: 1; }
    .lightbox .lb-inner { text-align: center; padding: 12px; }
    .lightbox img { max-width: 90vw; max-height: 85vh; border-radius: 12px; box-shadow: 0 24px 80px rgba(0,0,0,0.5); transform: scale(0.96); transition: transform .25s ease; }
    .lightbox.open img { transform: scale(1); }
    .lightbox .lb-caption { color: #fff; margin-top: 10px; font-weight: 600; }

    /* Card glare overlay */
    .glare { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .2s ease; }
    .event-card:hover .glare, .project-card:hover .glare, .team-member:hover .glare, .photo:hover .glare { opacity: 1; }

`;
document.head.appendChild(extraStyle);

// Minimal styles for Kanban and Polls
const kanbanStyle = document.createElement('style');
kanbanStyle.textContent = `
  .kanban-board { display:grid; grid-template-columns: repeat(4, minmax(220px, 1fr)); gap: 0.75rem; }
  .kanban-col { background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:12px; padding:0.5rem; }
  body.dark-theme .kanban-col { background:#111827; border-color: rgba(255,255,255,0.06); }
  .kanban-col h4 { margin: 0 0 0.5rem 0; color:#3b538b; }
  .kanban-list { min-height: 120px; display:grid; gap:0.5rem; }
  .kanban-card { background:#fafafa; border:1px solid #eee; border-radius:10px; padding:0.5rem; }
  body.dark-theme .kanban-card { background:#0f1217; border-color: rgba(255,255,255,0.08); }
  .kanban-card.dragging { opacity:0.6; }
  .kanban-card .k-meta { display:flex; gap:0.5rem; margin-top:0.4rem; }
  .kanban-card input[type="text"], .kanban-card input[type="date"] { flex:1; padding:8px 10px; border:2px solid #eee; border-radius:8px; font-size:0.95rem; }
  body.dark-theme .kanban-card input { background:#0f1217; color:#e5e7eb; border-color: rgba(255,255,255,0.08); }
  .kanban-card .k-actions { margin-top:0.4rem; }

  .poll { background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:12px; padding:0.75rem; margin-bottom:0.6rem; }
  body.dark-theme .poll { background:#111827; border-color: rgba(255,255,255,0.06); }
  .poll-row { display:grid; grid-template-columns: 1fr 3fr auto; gap:0.5rem; align-items:center; margin: 6px 0; }
  .poll-bar { background:#f0f3fa; border-radius:8px; height:14px; overflow:hidden; }
  .poll-bar span { display:block; height:100%; background:#3b538b; }
`;
document.head.appendChild(kanbanStyle);

// Global confetti helper
window.fireConfetti = (x, y, {count=22, spread=60, colors=["#ffd60a","#3b538b","#4a63a0","#ffffff"]}={}) => {
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = '8px';
    el.style.height = '12px';
    el.style.background = colors[i % colors.length];
    el.style.borderRadius = '2px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = 4000;
    el.style.transform = `translate(-50%, -50%) rotate(${Math.random()*360}deg)`;
    el.style.opacity = '1';
    document.body.appendChild(el);
    const angle = (Math.random() - 0.5) * (Math.PI * (spread/180));
    const velocity = 6 + Math.random() * 8;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - (Math.random()*4);
    const gravity = 0.25 + Math.random()*0.2;
    let life = 0;
    function step(){
      life += 1;
      const nx = x + vx * life;
      const ny = y + vy * life + 0.5 * gravity * life * life;
      el.style.left = nx + 'px';
      el.style.top = ny + 'px';
      el.style.opacity = String(Math.max(0, 1 - life/90));
      el.style.transform = `translate(-50%, -50%) rotate(${life*10}deg)`;
      if (life < 90) requestAnimationFrame(step); else el.remove();
    }
    requestAnimationFrame(step);
    pieces.push(el);
  }
  return pieces;
};

// Style for theme toggle button
const themeStyle = document.createElement('style');
themeStyle.textContent = `
  .theme-toggle {
    margin-left: 8px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.6);
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
  }
  body.dark-theme .theme-toggle {
    border-color: rgba(255,255,255,0.3);
  }
`;
document.head.appendChild(themeStyle);

// Page-wide interactive enhancements after full load
window.addEventListener('load', () => {
  // Announcement banner (dismissible)
  (function(){
    const KEY = 'gin_announce_dismissed_v1';
    const bar = document.getElementById('announce');
    const msg = document.getElementById('announce-msg');
    const btn = document.getElementById('announce-close');
    if (!bar || !msg || !btn) return;
    const text = localStorage.getItem('gin_announce_text') || '';
    if (text && !localStorage.getItem(KEY)){
      msg.textContent = text;
      bar.style.display = '';
    }
    btn.addEventListener('click', ()=>{ bar.style.display='none'; localStorage.setItem(KEY, '1'); });
  })();

  // Global search (current-page filter)
  (function(){
    const host = document.getElementById('site-search');
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    if (!host || !input || !clearBtn) return;
    // Show the search on pages with content sections and keep it at top
    host.style.display = '';
    document.body.classList.add('search-active');
    function setSearchHeight(){
      const h = host.offsetHeight || 0;
      document.body.style.setProperty('--search-h', h + 'px');
    }
    setSearchHeight();
    window.addEventListener('resize', setSearchHeight);

    // Build a list of content containers to show/hide
    const containers = Array.from(new Set(Array.from(document.querySelectorAll(`
      .project-card, .event-card, .team-member, .info-card, .text-panel,
      .photo, .mission-card, .vision-card, .team-info, .membership-info,
      .membership-form, .contact-content, .poll, .kanban-card, .date-card,
      .link-row, .check-row, .allow-row, .section
    `)).map(el => el.closest('.project-card, .event-card, .team-member, .info-card, .text-panel, .photo, .mission-card, .vision-card, .team-info, .membership-info, .membership-form, .contact-content, .poll, .kanban-card, .date-card, .link-row, .check-row, .allow-row, .section') || el)));

    function textOf(el){
      return (el.textContent || '').toLowerCase();
    }

    function apply(){
      const q = (input.value || '').trim().toLowerCase();
      containers.forEach(c => {
        if (!q) { c.style.display = ''; return; }
        const hay = textOf(c);
        c.style.display = hay.includes(q) ? '' : 'none';
      });
    }

    input.addEventListener('input', apply);
    clearBtn.addEventListener('click', ()=>{ input.value=''; apply(); input.focus(); });
    // Keyboard focus shortcut
    window.addEventListener('keydown', (e)=>{
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA'){ e.preventDefault(); input.focus(); }
    });
  })();

  // Footer subscribe (EmailJS)
  (function(){
    const form = document.getElementById('subscribe-form');
    if (!form || !window.EMAILJS_CONFIG || !window.emailjs) return;
    try { emailjs.init(window.EMAILJS_CONFIG.PUBLIC_KEY); } catch(_){}
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = (form.querySelector('input[name="email"]').value||'').trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ showToast('Enter a valid email'); return; }
      const btn = form.querySelector('button[type="submit"]');
      const t = btn && btn.textContent;
      if (btn){ btn.disabled = true; btn.textContent = 'Subscribing…'; }
      try {
        await emailjs.send(
          window.EMAILJS_CONFIG.SERVICE_ID,
          window.EMAILJS_CONFIG.TEMPLATE_ID,
          { to_email: window.EMAILJS_CONFIG.TO_EMAIL, from_email: email, subject: 'New GIN website subscriber', message: `Subscribe: ${email}` }
        );
        form.reset(); showToast('Subscribed!');
      } catch(_) { showToast('Could not subscribe'); }
      finally { if (btn){ btn.disabled=false; btn.textContent=t; } }
    });
  })();

  // Next Meeting: Add-to-Calendar
  (function(){
    const KEY = 'gin_next_meeting_v1';
    const info = document.getElementById('meeting-info');
    const btnG = document.getElementById('add-google-cal');
    const btnI = document.getElementById('download-ics');
    const editBtn = document.getElementById('edit-meeting');
    const form = document.getElementById('meeting-form');
    const fTitle = document.getElementById('mf-title');
    const fStart = document.getElementById('mf-start');
    const fEnd = document.getElementById('mf-end');
    const fLoc = document.getElementById('mf-location');
    const fDesc = document.getElementById('mf-desc');
    const fSave = document.getElementById('mf-save');
    const fCancel = document.getElementById('mf-cancel');
    const fClear = document.getElementById('mf-clear');

    if (!info || !btnG || !btnI || !editBtn || !form) return;

    function read(){ try { return JSON.parse(localStorage.getItem(KEY)); } catch(_) { return null; } }
    function write(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(_){} }

    function fmt(dt){
      try { const d = new Date(dt); return d.toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'}); } catch(_){ return dt; }
    }
    function fmtGoogle(dt){
      const d = new Date(dt);
      const iso = d.toISOString().replace(/[-:]/g,'').replace(/\.[0-9]{3}Z$/,'Z');
      return iso;
    }
    function icsEscape(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }

    function render(){
      const m = read();
      if (!m){
        info.textContent = 'Next meeting not set yet.';
        return;
      }
      info.textContent = `${m.title || 'Meeting'} — ${fmt(m.start)} to ${fmt(m.end)} @ ${m.location || ''}`;
    }

    function openGoogle(){
      const m = read(); if (!m) { showToast('Set the meeting first'); return; }
      const params = new URLSearchParams({
        action:'TEMPLATE',
        text: m.title || 'GIN Meeting',
        dates: `${fmtGoogle(m.start)}/${fmtGoogle(m.end)}`,
        details: m.description || 'GIN at ASIJ meeting',
        location: m.location || 'ASIJ',
      });
      window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    }

    function downloadICS(){
      const m = read(); if (!m) { showToast('Set the meeting first'); return; }
      const uid = `gin-${Date.now()}@asij`;
      const dtstamp = fmtGoogle(new Date());
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GIN@ASIJ//Calendar//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtstamp}\nDTSTART:${fmtGoogle(m.start)}\nDTEND:${fmtGoogle(m.end)}\nSUMMARY:${icsEscape(m.title||'GIN Meeting')}\nDESCRIPTION:${icsEscape(m.description||'GIN at ASIJ meeting')}\nLOCATION:${icsEscape(m.location||'ASIJ')}\nEND:VEVENT\nEND:VCALENDAR`;
      try {
        const blob = new Blob([ics], {type:'text/calendar'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download='gin-meeting.ics'; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 400);
      } catch(_){ showToast('Could not download .ics'); }
    }

    function toggleEdit(show){ form.style.display = show ? 'grid' : 'none'; }

    function loadIntoForm(){
      const m = read() || {};
      fTitle.value = m.title || 'GIN Meeting';
      fStart.value = m.start ? new Date(m.start).toISOString().slice(0,16) : '';
      fEnd.value = m.end ? new Date(m.end).toISOString().slice(0,16) : '';
      fLoc.value = m.location || 'MS 306, ASIJ';
      fDesc.value = m.description || 'Student-led projects and planning.';
    }

    editBtn.addEventListener('click', ()=>{ loadIntoForm(); toggleEdit(true); });
    fCancel.addEventListener('click', ()=> toggleEdit(false));
    fClear.addEventListener('click', ()=>{ localStorage.removeItem(KEY); render(); toggleEdit(false); });
    fSave.addEventListener('click', ()=>{
      const title = fTitle.value.trim() || 'GIN Meeting';
      const start = fStart.value ? new Date(fStart.value).toISOString() : '';
      const end = fEnd.value ? new Date(fEnd.value).toISOString() : '';
      if (!start || !end){ showToast('Pick start and end'); return; }
      const data = { title, start, end, location: fLoc.value.trim(), description: fDesc.value.trim() };
      write(data); render(); toggleEdit(false); showToast('Meeting saved');
    });

    btnG.addEventListener('click', openGoogle);
    btnI.addEventListener('click', downloadICS);
    render();
  })();

  // Navbar stays fixed; only add subtle shadow after scrolling
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
  });

  // Cursor glow follower
  let glow; let rafId;
  function moveGlow(e){
    if (!glow) return;
    const x = e.clientX, y = e.clientY;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(()=>{
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
    });
  }
  function ensureGlow(){
    if (!glow){
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      document.body.appendChild(glow);
    }
  }
  ensureGlow();
  window.addEventListener('mousemove', moveGlow);
  window.addEventListener('mouseenter', ()=> glow && (glow.style.opacity = '0.35'));
  window.addEventListener('mouseleave', ()=> glow && (glow.style.opacity = '0'));

  // Ripple effect for buttons
  function createRipple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    btn.appendChild(span);
    setTimeout(() => span.remove(), 600);
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cta-button, .info-button, button');
    if (!btn) return;
    createRipple(btn, e);
  });

  // Magnetic buttons (cta only)
  document.querySelectorAll('.cta-button').forEach(btn => {
    let raf;
    function onMove(e){
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = e.clientX - cx; const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxPull = 12; const radius = 120;
      const pull = Math.max(0, 1 - dist / radius) * maxPull;
      const angle = Math.atan2(dy, dx);
      const tx = Math.cos(angle) * pull;
      const ty = Math.sin(angle) * pull;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        btn.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }
    function reset(){ btn.style.transform = ''; }
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', reset);
  });

  // 3D tilt for cards
  function attachTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
      if (card.classList.contains('no-tilt')) return; // Opt-out
      const max = 8; const persp = 600;
      function move(e){
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * max;
        const ry = (x - 0.5) * max;
        card.style.transform = `perspective(${persp}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        const glare = card.querySelector('.glare');
        if (glare) glare.style.background = `radial-gradient(300px circle at ${x*100}% ${y*100}%, rgba(255,255,255,0.25), transparent 45%)`;
      }
      function leave(){ card.style.transform = 'perspective(600px)'; }
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
    });
  }
  // Ensure glare overlays exist and update with tilt
  document.querySelectorAll('.event-card, .project-card, .team-member, .photo').forEach(card => {
    if (card.classList.contains('no-tilt')) return;
    if (!card.querySelector('.glare')) {
      const g = document.createElement('div');
      g.className = 'glare';
      card.style.position = card.style.position || 'relative';
      card.appendChild(g);
    }
  });
  attachTilt('.event-card, .project-card, .team-member, .photo');

  // Scroll hint + floating dots in hero
  document.querySelectorAll('.hero').forEach(hero => {
    const hint = document.createElement('button');
    hint.className = 'scroll-hint';
    hint.setAttribute('aria-label','Scroll to content');
    hint.innerHTML = '⌄';
    hero.appendChild(hint);
    hint.addEventListener('click', () => {
      const next = hero.nextElementSibling || document.querySelector('.section');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });

    // spawn decorative dots
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'floaty-dot';
      d.style.left = Math.random() * 100 + '%';
      d.style.bottom = Math.random() * 40 + 'px';
      d.style.animationDuration = 5 + Math.random() * 6 + 's';
      d.style.animationDelay = (Math.random() * 2) + 's';
      d.style.opacity = 0.15 + Math.random() * 0.25;
      hero.appendChild(d);
    }
  });

  // Text scramble on hover for titles
  function scrambleText(el, duration=600){
    const original = el.getAttribute('data-original') || el.textContent;
    if (!el.getAttribute('data-original')) el.setAttribute('data-original', original);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let frame = 0; const total = Math.max(20, Math.floor(duration/16));
    const target = original.split('');
    const revealAt = target.map((_, i)=> Math.floor(Math.random()*total));
    const timer = setInterval(()=>{
      const out = target.map((ch, i)=> frame >= revealAt[i] ? ch : chars[Math.floor(Math.random()*chars.length)]);
      el.textContent = out.join('');
      frame++;
      if (frame > total) { clearInterval(timer); el.textContent = original; }
    }, 16);
  }
  document.querySelectorAll('.section-title, .logo h1').forEach(el=>{
    el.addEventListener('mouseenter', ()=> scrambleText(el));
  });

  // Lightbox for photo gallery
  let lightbox;
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.photo img');
    if (!img) return;
    e.preventDefault();
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = '<div class="lb-inner"><img alt="" /><div class="lb-caption"></div></div>';
      document.body.appendChild(lightbox);
      lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
      document.addEventListener('keydown', (ev)=>{ if(ev.key==='Escape') lightbox.classList.remove('open'); });
    }
    const cap = img.closest('.photo')?.querySelector('.caption')?.textContent || '';
    lightbox.querySelector('img').src = img.src;
    lightbox.querySelector('.lb-caption').textContent = cap;
    requestAnimationFrame(()=> lightbox.classList.add('open'));
  });

  // Copy-to-clipboard buttons for email addresses
  function showToast(msg){
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, 1800);
  }
  document.querySelectorAll('.contact-info a[href^="mailto:"]').forEach(a => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-email';
    btn.textContent = 'Copy';
    a.insertAdjacentElement('afterend', btn);
    btn.addEventListener('click', async () => {
      const email = (a.getAttribute('href') || '').replace('mailto:', '');
      try {
        await navigator.clipboard.writeText(email);
        showToast('Copied: ' + email);
      } catch (_) {
        showToast('Could not copy');
      }
    });
  });

  // Member Timeline Board logic
  function initDateBoard(){
    const board = document.getElementById('date-board');
    if (!board) return;
    const addBtn = document.getElementById('add-date-card');
    const saveBtn = document.getElementById('save-date-board');

    const KEY = 'gin_date_board_v1';
    const read = () => {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(_) { return []; }
    };
    const write = (data) => { try { localStorage.setItem(KEY, JSON.stringify(data)); showToast('Saved'); } catch(_) {} };

    function cardToData(card){
      return {
        date: card.querySelector('.date-input').value.trim(),
        status: card.querySelector('.status-select').value,
        desc: card.querySelector('.desc-input').value.trim(),
      };
    }

    function setStatusClass(card, status){
      card.classList.remove('status-upcoming','status-progress','status-done');
      if (status === 'done') card.classList.add('status-done');
      else if (status === 'progress') card.classList.add('status-progress');
      else card.classList.add('status-upcoming');
    }

    function makeCard(data={date:'', status:'upcoming', desc:''}){
      const card = document.createElement('div');
      card.className = 'date-card';
      card.innerHTML = `
        <div class="date-row">
          <input type="text" class="date-input" placeholder="YYYY-MM-DD" value="${data.date.replace(/"/g,'&quot;')}">
          <select class="status-select">
            <option value="upcoming">Upcoming</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <textarea class="desc-input" placeholder="Description / details">${(data.desc || '').replace(/</g,'&lt;')}</textarea>
        <div class="card-actions">
          <button type="button" class="cta-button secondary save-card">Save</button>
          <button type="button" class="cta-button secondary delete-card">Delete</button>
        </div>
      `;
      const sel = card.querySelector('.status-select');
      sel.value = data.status || 'upcoming';
      setStatusClass(card, sel.value);
      sel.addEventListener('change', ()=> setStatusClass(card, sel.value));

      card.querySelector('.save-card').addEventListener('click', ()=> save());
      card.querySelector('.delete-card').addEventListener('click', ()=> { card.remove(); save(); });

      return card;
    }

    function render(){
      board.innerHTML = '';
      const data = read();
      if (data.length === 0){
        // Start with 3 empty cards
        for (let i=0;i<3;i++) board.appendChild(makeCard());
      } else {
        data.forEach(item => board.appendChild(makeCard(item)));
      }
    }

    function save(){
      const cards = Array.from(board.querySelectorAll('.date-card'));
      const data = cards.map(cardToData);
      write(data);
    }

    addBtn && addBtn.addEventListener('click', ()=> {
      board.appendChild(makeCard());
    });
    saveBtn && saveBtn.addEventListener('click', save);

    render();
  }
  initDateBoard();

  // Editable Quick Links
  function initLinksBoard(){
    const board = document.getElementById('links-board');
    if (!board) return;
    const addBtn = document.getElementById('add-link');
    const saveBtn = document.getElementById('save-links');
    const KEY = 'gin_links_v1';

    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(_) { return []; } };
    const write = (data) => { try { localStorage.setItem(KEY, JSON.stringify(data)); showToast('Links saved'); } catch(_){} };

    function rowToData(row){
      return {
        name: row.querySelector('.link-input').value.trim(),
        url: row.querySelector('.url-input').value.trim(),
      };
    }

    function makeRow(data={name:'', url:''}){
      const row = document.createElement('div');
      row.className = 'link-row';
      row.innerHTML = `
        <input type="text" class="link-input" placeholder="Name (e.g., Edsby)" value="${(data.name||'').replace(/"/g,'&quot;')}">
        <input type="url" class="url-input" placeholder="https://..." value="${(data.url||'').replace(/"/g,'&quot;')}">
        <div class="link-actions">
          <button type="button" class="cta-button secondary save-link">Save</button>
          <button type="button" class="cta-button secondary delete-link">Delete</button>
        </div>
      `;
      row.querySelector('.save-link').addEventListener('click', save);
      row.querySelector('.delete-link').addEventListener('click', ()=> { row.remove(); save(); });
      return row;
    }

    function render(){
      board.innerHTML = '';
      const data = read();
      if (data.length === 0) {
        ['Edsby','Drive','Docs'].forEach(n=> board.appendChild(makeRow({name:n, url:''})));
      } else data.forEach(item => board.appendChild(makeRow(item)));
    }

    function save(){
      const rows = Array.from(board.querySelectorAll('.link-row'));
      const data = rows.map(rowToData);
      write(data);
    }

    addBtn && addBtn.addEventListener('click', ()=> board.appendChild(makeRow()));
    saveBtn && saveBtn.addEventListener('click', save);
    render();
  }
  initLinksBoard();

  // Checklist
  function initChecklist(){
    const root = document.getElementById('checklist');
    if (!root) return;
    const addBtn = document.getElementById('add-task');
    const saveBtn = document.getElementById('save-tasks');
    const stats = document.getElementById('task-stats');
    const KEY = 'gin_tasks_v1';

    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(_) { return []; } };
    const write = (data) => { try { localStorage.setItem(KEY, JSON.stringify(data)); showToast('Tasks saved'); } catch(_){} };

    function rowToData(row){
      return {
        done: row.querySelector('input[type="checkbox"]').checked,
        text: row.querySelector('input[type="text"]').value.trim(),
      };
    }

    function updateStats(){
      const rows = Array.from(root.querySelectorAll('.check-row'));
      const total = rows.length;
      const done = rows.filter(r => r.querySelector('input[type="checkbox"]').checked).length;
      if (stats) stats.textContent = `${done}/${total} completed`;
    }

    function makeRow(data={done:false, text:''}){
      const row = document.createElement('div');
      row.className = 'check-row';
      row.innerHTML = `
        <input type="checkbox" ${data.done ? 'checked' : ''}>
        <input type="text" placeholder="Task description" value="${(data.text||'').replace(/"/g,'&quot;')}">
        <button type="button" class="cta-button secondary remove">Delete</button>
      `;
      row.querySelector('input[type="checkbox"]').addEventListener('change', ()=> { updateStats(); save(); });
      row.querySelector('.remove').addEventListener('click', ()=> { row.remove(); updateStats(); save(); });
      row.querySelector('input[type="text"]').addEventListener('change', save);
      return row;
    }

    function render(){
      root.innerHTML = '';
      const data = read();
      if (data.length === 0) {
        ['Plan next meeting','Prepare booth materials','Post update on Edsby'].forEach(t=> root.appendChild(makeRow({text:t})));
      } else data.forEach(item => root.appendChild(makeRow(item)));
      updateStats();
    }

    function save(){
      const rows = Array.from(root.querySelectorAll('.check-row'));
      const data = rows.map(rowToData);
      write(data);
      updateStats();
    }

    addBtn && addBtn.addEventListener('click', ()=> { root.appendChild(makeRow()); updateStats(); });
    saveBtn && saveBtn.addEventListener('click', save);
    render();
  }
  initChecklist();

  // Kanban Project Board
  function initKanban(){
    const root = document.getElementById('kanban-board');
    if (!root) return;
    const addBtn = document.getElementById('kanban-add');
    const saveBtn = document.getElementById('kanban-save');
    const exportBtn = document.getElementById('kanban-export');
    const importBtn = document.getElementById('kanban-import');
    const fileInput = document.getElementById('kanban-import-file');
    const KEY = 'gin_kanban_v1';

    const columns = ['todo','progress','blocked','done'];
    function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || {todo:[],progress:[],blocked:[],done:[]}; } catch(_) { return {todo:[],progress:[],blocked:[],done:[]}; } }
    function write(data){ try { localStorage.setItem(KEY, JSON.stringify(data)); showToast('Board saved'); } catch(_){} }

    function cardDataFromEl(card){
      return {
        title: card.querySelector('.k-title').value.trim(),
        owner: card.querySelector('.k-owner').value.trim(),
        due: card.querySelector('.k-due').value,
      };
    }

    function makeCard(data={title:'',owner:'',due:''}){
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.draggable = true;
      card.innerHTML = `
        <input class="k-title" type="text" placeholder="Task title" value="${(data.title||'').replace(/"/g,'&quot;')}">
        <div class="k-meta">
          <input class="k-owner" type="text" placeholder="Owner" value="${(data.owner||'').replace(/"/g,'&quot;')}" />
          <input class="k-due" type="date" value="${data.due||''}" />
        </div>
        <div class="k-actions">
          <button type="button" class="cta-button secondary k-del">Delete</button>
        </div>`;
      card.querySelector('.k-del').addEventListener('click', ()=> card.remove());
      card.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain','drag'); card.classList.add('dragging'); });
      card.addEventListener('dragend', ()=> card.classList.remove('dragging'));
      return card;
    }

    function render(){
      const state = read();
      columns.forEach(col=>{
        const list = document.getElementById('kanban-'+col);
        if (!list) return;
        list.innerHTML = '';
        (state[col]||[]).forEach(item=> list.appendChild(makeCard(item)));
      });
    }

    function save(){
      const data = {todo:[],progress:[],blocked:[],done:[]};
      columns.forEach(col=>{
        const list = document.getElementById('kanban-'+col);
        const cards = Array.from(list.querySelectorAll('.kanban-card'));
        data[col] = cards.map(cardDataFromEl);
      });
      write(data);
    }

    root.querySelectorAll('.kanban-list').forEach(list=>{
      list.addEventListener('dragover', e=>{ e.preventDefault(); const dragging = root.querySelector('.dragging'); if (dragging && e.target.closest('.kanban-list')===list){ list.appendChild(dragging); }});
      list.addEventListener('drop', e=>{ e.preventDefault(); save(); });
    });

    addBtn && addBtn.addEventListener('click', ()=>{
      const list = document.getElementById('kanban-todo');
      list && list.appendChild(makeCard());
    });
    saveBtn && saveBtn.addEventListener('click', save);
    exportBtn && exportBtn.addEventListener('click', async ()=>{
      try {
        const json = JSON.stringify(read(), null, 2);
        const blob = new Blob([json], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download='gin-kanban.json'; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 400);
        try { await navigator.clipboard.writeText(json); showToast('Exported + copied'); } catch(_) { showToast('Exported'); }
      } catch(_) { showToast('Export failed'); }
    });
    importBtn && importBtn.addEventListener('click', ()=> fileInput && fileInput.click());
    fileInput && fileInput.addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = ()=>{ try { const data = JSON.parse(r.result); if (!data || typeof data !== 'object') throw 0; localStorage.setItem(KEY, JSON.stringify(data)); render(); showToast('Board imported'); } catch(_) { showToast('Import failed'); } };
      r.readAsText(f);
    });

    render();
  }
  initKanban();

  // Polls / Voting
  function initPolls(){
    const root = document.getElementById('polls-root');
    if (!root) return;
    const qEl = document.getElementById('poll-q');
    const optsEl = document.getElementById('poll-opts');
    const multiEl = document.getElementById('poll-multi');
    const addBtn = document.getElementById('poll-add');
    const listEl = document.getElementById('poll-list');
    const exportBtn = document.getElementById('poll-export');
    const importBtn = document.getElementById('poll-import');
    const fileInput = document.getElementById('poll-import-file');

    const KEY = 'gin_polls_v1';
    function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(_) { return []; } }
    function write(data){ try { localStorage.setItem(KEY, JSON.stringify(data)); showToast('Polls saved'); } catch(_){} }

    function render(){
      const polls = read();
      listEl.innerHTML='';
      polls.forEach((p, idx)=> listEl.appendChild(renderPoll(p, idx)));
    }

    function renderPoll(poll, idx){
      const wrap = document.createElement('div');
      wrap.className = 'poll';
      wrap.innerHTML = `
        <h4 class="poll-q">${poll.q.replace(/</g,'&lt;')}</h4>
        <div class="poll-opts"></div>
        <div class="poll-actions" style="margin-top:0.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;"></div>`;
      const optsHost = wrap.querySelector('.poll-opts');
      const name = `poll_${idx}`;
      const votedKey = `${KEY}_voted_${idx}`;
      const voted = localStorage.getItem(votedKey);
      const results = poll.results || Array(poll.options.length).fill(0);
      function saveResults(){ const polls = read(); polls[idx].results = results; write(polls); drawResults(); }

      function drawVoteUI(){
        optsHost.innerHTML='';
        poll.options.forEach((opt, i)=>{
          const id = `${name}_${i}`;
          const label = document.createElement('label');
          label.style.display='flex'; label.style.gap='0.5rem'; label.style.alignItems='center'; label.style.marginBottom='0.25rem';
          const input = document.createElement('input');
          input.type = poll.multi ? 'checkbox' : 'radio';
          input.name = name; input.value = String(i);
          const span = document.createElement('span'); span.textContent = opt;
          label.appendChild(input); label.appendChild(span); optsHost.appendChild(label);
        });
        const actions = wrap.querySelector('.poll-actions'); actions.innerHTML='';
        const submit = document.createElement('button'); submit.className='cta-button'; submit.type='button'; submit.textContent='Vote';
        submit.addEventListener('click', ()=>{
          const inputs = Array.from(optsHost.querySelectorAll('input'));
          const chosen = inputs.filter(i=>i.checked).map(i=> parseInt(i.value,10));
          if (chosen.length===0){ showToast('Select an option'); return; }
          chosen.forEach(i=> results[i] = (results[i]||0)+1);
          localStorage.setItem(votedKey, '1');
          saveResults();
        });
        actions.appendChild(submit);
      }

      function drawResults(){
        optsHost.innerHTML='';
        const total = results.reduce((a,b)=>a+b,0) || 1;
        poll.options.forEach((opt, i)=>{
          const pct = Math.round((results[i]||0) * 100 / total);
          const row = document.createElement('div'); row.className='poll-row';
          row.innerHTML = `<div class="poll-opt">${opt.replace(/</g,'&lt;')}</div>
                           <div class="poll-bar"><span style="width:${pct}%;"></span></div>
                           <div class="poll-pct">${pct}%</div>`;
          optsHost.appendChild(row);
        });
        const actions = wrap.querySelector('.poll-actions'); actions.innerHTML='';
        const reset = document.createElement('button'); reset.className='cta-button secondary'; reset.type='button'; reset.textContent='Reset Votes';
        reset.addEventListener('click', ()=>{ results.fill(0); localStorage.removeItem(votedKey); saveResults(); });
        const closeBtn = document.createElement('button'); closeBtn.className='cta-button secondary'; closeBtn.type='button'; closeBtn.textContent='Close Poll';
        closeBtn.addEventListener('click', ()=>{ const polls = read(); polls.splice(idx,1); write(polls); render(); });
        actions.appendChild(reset); actions.appendChild(closeBtn);
      }

      if (voted) drawResults(); else drawVoteUI();
      return wrap;
    }

    addBtn && addBtn.addEventListener('click', ()=>{
      const q = (qEl.value||'').trim();
      const opts = (optsEl.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
      const multi = !!multiEl.checked;
      if (!q || opts.length<2){ showToast('Add a question and at least 2 options'); return; }
      const polls = read();
      polls.push({ q, options: opts, multi, results: Array(opts.length).fill(0) });
      write(polls);
      qEl.value=''; optsEl.value=''; multiEl.checked=false; render();
    });

    exportBtn && exportBtn.addEventListener('click', async ()=>{
      try {
        const json = JSON.stringify(read(), null, 2);
        const blob = new Blob([json], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download='gin-polls.json'; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 400);
        try { await navigator.clipboard.writeText(json); showToast('Exported + copied'); } catch(_) { showToast('Exported'); }
      } catch(_) { showToast('Export failed'); }
    });

    importBtn && importBtn.addEventListener('click', ()=> fileInput && fileInput.click());
    fileInput && fileInput.addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = ()=>{ try { const data = JSON.parse(r.result); if (!Array.isArray(data)) throw 0; localStorage.setItem(KEY, JSON.stringify(data)); render(); showToast('Polls imported'); } catch(_) { showToast('Import failed'); } };
      r.readAsText(f);
    });

    render();
  }
  initPolls();

  // Allowlist Admin UI
  function initAllowlistAdmin(){
    const listEl = document.getElementById('allowlist-list');
    if (!listEl) return;
    const addBtn = document.getElementById('add-allow');
    const saveBtn = document.getElementById('save-allow');
    const resetBtn = document.getElementById('reset-allow');
    const exportBtn = document.getElementById('export-allow');
    const importBtn = document.getElementById('import-allow');
    const fileInput = document.getElementById('import-allow-file');
    const input = document.getElementById('allow-email');

    function render(){
      listEl.innerHTML = '';
      const arr = getAllowlist();
      arr.forEach(email => {
        const row = document.createElement('div');
        row.className = 'allow-row';
        row.innerHTML = `<span class="email"></span><div class="actions"><button type="button" class="cta-button secondary rm">Remove</button></div>`;
        row.querySelector('.email').textContent = email;
        row.querySelector('.rm').addEventListener('click', ()=>{
          const next = getAllowlist().filter(e => e !== email);
          setAllowlist(next);
          render();
        });
        listEl.appendChild(row);
      });
    }

    function add(){
      const email = (input.value || '').trim().toLowerCase();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showToast('Enter a valid email'); return; }
      const arr = getAllowlist().map(e=>String(e).toLowerCase());
      if (arr.includes(email)) { showToast('Email already in allowlist'); return; }
      arr.push(email);
      setAllowlist(arr);
      input.value = '';
      render();
    }

    function save(){ showToast('Allowlist saved'); }
    function reset(){ setAllowlist(DEFAULT_ALLOWLIST.map(e=>e.toLowerCase())); render(); showToast('Allowlist reset'); }

    async function doExport(){
      const data = getAllowlist();
      const json = JSON.stringify(data, null, 2);
      // Try Blob download first
      try {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gin-allowlist.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 500);
        try { await navigator.clipboard.writeText(json); showToast('Exported + copied to clipboard'); } catch(_) { showToast('Exported'); }
        return;
      } catch(_){ /* fall through */ }
      // Fallback to data URL
      try {
        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
        a.download = 'gin-allowlist.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('Exported (alt mode)');
        return;
      } catch(_){ /* fall through */ }
      // Last resort: open a new tab with the JSON so it can be copied
      try {
        const w = window.open('about:blank', '_blank');
        if (w && w.document) {
          w.document.write('<pre style="white-space:pre-wrap;word-wrap:break-word;">'+json.replace(/</g,'&lt;')+'</pre>');
          w.document.close();
          showToast('Opened JSON in new tab');
          return;
        }
      } catch(_){ }
      showToast('Export failed');
    }

    function doImportFile(file){
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (!Array.isArray(parsed)) throw new Error('Invalid format');
          const emails = Array.from(new Set(parsed.map(e=>String(e).trim().toLowerCase()).filter(e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))));
          if (emails.length === 0) throw new Error('No valid emails');
          setAllowlist(emails);
          render();
          showToast('Allowlist imported');
        } catch (e) {
          showToast('Import failed');
        }
      };
      reader.readAsText(file);
    }

    addBtn && addBtn.addEventListener('click', add);
    saveBtn && saveBtn.addEventListener('click', save);
    resetBtn && resetBtn.addEventListener('click', reset);
    exportBtn && exportBtn.addEventListener('click', doExport);
    importBtn && importBtn.addEventListener('click', ()=> fileInput && fileInput.click());
    fileInput && fileInput.addEventListener('change', (e)=> doImportFile(e.target.files && e.target.files[0]));
    render();
  }
  initAllowlistAdmin();

  // Meeting Notes (auto-save)
  function initNotes(){
    const pad = document.getElementById('notes-pad');
    const status = document.getElementById('notes-status');
    if (!pad) return;
    const KEY = 'gin_notes_v1';
    try { pad.value = localStorage.getItem(KEY) || ''; } catch(_) {}

    let timer;
    function setSaved(ts){ if (status) status.textContent = `Saved ${new Date(ts).toLocaleTimeString()}`; }

    pad.addEventListener('input', ()=>{
      clearTimeout(timer);
      timer = setTimeout(()=>{
        try { localStorage.setItem(KEY, pad.value); setSaved(Date.now()); } catch(_) {}
      }, 500);
    });
  }
  initNotes();

  // About page games
  function initWasteSorterAt(rootId){
    const root = document.getElementById(rootId);
    if (!root) return;
    const itemsHost = root.querySelector('.waste-items') || document.getElementById('waste-items');
    const status = root.querySelector('.waste-status') || document.getElementById('waste-status');
    const resetBtn = root.querySelector('.waste-reset') || document.getElementById('waste-reset');
    const bins = root.querySelectorAll('.bin');
    const data = [
      {label:'Paper cup (clean)', bin:'recycle'},
      {label:'Banana peel', bin:'compost'},
      {label:'Plastic bottle', bin:'recycle'},
      {label:'Styrofoam tray', bin:'trash'},
      {label:'Aluminum can', bin:'recycle'},
      {label:'Napkin (used)', bin:'compost'},
      {label:'Chip bag', bin:'trash'},
      {label:'Apple core', bin:'compost'},
      {label:'Glass jar', bin:'recycle'},
      {label:'Plastic wrap', bin:'trash'},
      {label:'Cardboard box', bin:'recycle'},
      {label:'Pizza box (greasy)', bin:'trash'},
      {label:'Coffee grounds', bin:'compost'},
      {label:'Egg shells', bin:'compost'},
      {label:'Foil wrapper', bin:'trash'},
      {label:'Newspaper', bin:'recycle'},
      {label:'Tissue (clean)', bin:'trash'},
      {label:'Vegetable scraps', bin:'compost'}
    ];
    let placed = 0;

    function makeChip(item){
      const c = document.createElement('div');
      c.className='chip'; c.textContent=item.label; c.draggable=true; c.dataset.bin=item.bin;
      c.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', item.bin+'|'+item.label); });
      return c;
    }

    function renderItems(){
      itemsHost.innerHTML=''; placed = 0; status.textContent='';
      // Clear all bins too
      bins.forEach(bin=>{
        const chips = bin.querySelectorAll('.chip');
        chips.forEach(c=> c.remove());
      });
      data.sort(()=>Math.random()-0.5).forEach(it=> itemsHost.appendChild(makeChip(it)));
    }

    bins.forEach(bin=>{
      bin.addEventListener('dragover', e=>{ e.preventDefault(); bin.classList.add('dragover'); });
      bin.addEventListener('dragleave', ()=> bin.classList.remove('dragover'));
      bin.addEventListener('drop', e=>{
        e.preventDefault(); bin.classList.remove('dragover');
        const [expected,label] = (e.dataTransfer.getData('text/plain')||'').split('|');
        if (!expected) return;
        const ok = (bin.dataset.bin === expected);
        status.textContent = ok ? 'Nice!' : 'Try again';
        if (ok){
          const chip = Array.from(itemsHost.children).find(el=>el.textContent===label);
          if (chip){ 
            chip.draggable=false; 
            chip.style.opacity='0.6'; 
            chip.classList.add('placed');
            chip.remove(); // remove from itemsHost
            bin.appendChild(chip); 
            placed++; 
          }
          if (placed === data.length){ status.textContent='Perfect sorting!'; if (window.fireConfetti) window.fireConfetti(window.innerWidth/2, 150, {count:24}); }
        }
      });
    });

    resetBtn && resetBtn.addEventListener('click', renderItems);
    renderItems();
  }

  function initImpactEstimator(){
    const root = document.getElementById('impact-game');
    if (!root) return;
    const shower = document.getElementById('im-shower');
    const bulbs = document.getElementById('im-bulbs');
    const bike = document.getElementById('im-bike');
    const vShower = document.getElementById('im-shower-val');
    const vBulbs = document.getElementById('im-bulbs-val');
    const vBike = document.getElementById('im-bike-val');
    const out = document.getElementById('impact-result');
    function calc(){
      if (vShower) vShower.textContent = shower.value;
      if (vBulbs) vBulbs.textContent = bulbs.value;
      if (vBike) vBike.textContent = bike.value;
      // Very rough estimates for demo purposes
      const showerMin = Number(shower.value||0); // minutes per shower
      const showersPerWeek = 7; // assume daily
      const waterPerMin = 9; // liters/min efficient shower head
      const kgCO2perKWh = 0.45; // JP grid approx
      const kWhPerLiterHot = 0.0015; // rough
      const showerCO2 = showerMin * showersPerWeek * 52 * waterPerMin * kWhPerLiterHot * kgCO2perKWh;

      const bulbCount = Number(bulbs.value||0);
      const kWhSavedPerBulbYear = 40; // incandescent -> LED rough
      const bulbCO2 = bulbCount * kWhSavedPerBulbYear * kgCO2perKWh;

      const bikeKmWeek = Number(bike.value||0);
      const carKgPerKm = 0.2; // small car
      const bikeCO2 = bikeKmWeek * 52 * carKgPerKm;

      const total = Math.round((showerCO2 + bulbCO2 + bikeCO2));
      out.textContent = `Estimated savings: ~${total} kg CO₂/year`;
    }
    [shower, bulbs, bike].forEach(i=> i.addEventListener('input', calc));
    calc();
  }

  initWasteSorterAt('waste-game');
  initWasteSorterAt('waste-game-spirit');
  initImpactEstimator();

  // SDG badges: click to reveal description (calmer UX)
  (function(){
    const badges = document.querySelectorAll('.sdg-badge[data-sdg]');
    const detail = document.getElementById('sdg-detail');
    if (!badges.length || !detail) return;
    const NAMES = {
      1:'No Poverty',2:'Zero Hunger',3:'Good Health and Well‑being',4:'Quality Education',5:'Gender Equality',6:'Clean Water and Sanitation',7:'Affordable and Clean Energy',8:'Decent Work and Economic Growth',9:'Industry, Innovation and Infrastructure',10:'Reduced Inequalities',11:'Sustainable Cities and Communities',12:'Responsible Consumption and Production',13:'Climate Action',14:'Life Below Water',15:'Life on Land',16:'Peace, Justice and Strong Institutions',17:'Partnerships for the Goals'
    };
    const DESCS = {
      1: 'End poverty in all its forms. Ensure access to basic services, social protection, and opportunities for everyone to thrive.',
      2: 'End hunger and improve nutrition by supporting resilient, sustainable food systems and reducing waste.',
      3: 'Ensure healthy lives and promote well‑being for all at all ages—prevention, care, and mental health matter.',
      4: 'Guarantee inclusive, equitable education and lifelong learning for all learners.',
      5: 'Achieve equality and empower women and girls in life, school, and leadership.',
      6: 'Ensure safe water and sanitation for all while protecting watersheds and using water wisely.',
      7: 'Provide reliable, modern energy while scaling renewables and efficiency.',
      8: 'Promote sustainable growth and decent work, including youth opportunities.',
      9: 'Build resilient infrastructure, enable innovation, and support sustainable industry.',
      10: 'Reduce inequality within and among countries through inclusion and fair opportunity.',
      11: 'Make cities and communities inclusive, safe, resilient and sustainable.',
      12: 'Use resources responsibly; design out waste with circular systems.',
      13: 'Take urgent action on climate—cut emissions and build resilience to impacts.',
      14: 'Protect oceans and marine biodiversity; reduce pollution.',
      15: 'Protect and restore ecosystems and biodiversity on land.',
      16: 'Promote peace, justice, and strong, accountable institutions.',
      17: 'Strengthen partnerships to mobilize resources and share solutions.'
    };
    function show(id){
      const n = NAMES[id] || `SDG ${id}`;
      const d = DESCS[id] || 'Sustainable Development Goal';
      detail.innerHTML = `<h4>SDG ${id}: ${n}</h4><p style="color:#555;">${d}</p>`;
    }
    badges.forEach(b=>{
      b.addEventListener('click', ()=> show(Number(b.dataset.sdg)));
      b.addEventListener('keydown', (e)=>{ if (e.key==='Enter' || e.key===' '){ e.preventDefault(); show(Number(b.dataset.sdg)); } });
    });
    // Default selection
    show(12);
  })();
});
