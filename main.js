document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. Dynamic Unified Navigation (V1.1)
    //    Generates the same header/nav in ALL pages from a single source.
    // =========================================================================
    const navLinks = [
        { href: 'index.html', label: 'الرئيسية' },
        { href: 'about.html', label: 'من نحن' },
        { href: 'services.html', label: 'الخدمات' },
        { href: 'gallery.html', label: 'معرض الصور' },
        { href: 'booking.html', label: 'الحجز' },
        { href: 'contact.html', label: 'اتصل بنا' },
        { href: 'faq.html', label: 'الأسئلة الشائعة' },
        { href: 'blog.html', label: 'المدونة' }
    ];

    // Detect current page from URL
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    // Build nav items HTML
    const navItemsHTML = navLinks.map(link => {
        const isActive = (currentPage === link.href) ? ' active' : '';
        return `<li><a href="${link.href}" class="nav-link${isActive}">${link.label}</a></li>`;
    }).join('\n                    ');

    // Full header HTML
    const headerHTML = `
        <div class="container nav-container">
            <a href="index.html" class="logo" aria-label="لوفنج هومز الرئيسية">
                <i class="fa-solid fa-paw"></i>
                لوفنج هومز
            </a>

            <nav>
                <ul class="nav-menu">
                    ${navItemsHTML}
                </ul>
            </nav>

            <div class="mobile-toggle" aria-label="تبديل القائمة">
                <i class="fa-solid fa-bars"></i>
            </div>
        </div>`;

    // Inject into the header element
    const headerEl = document.querySelector('.header');
    if (headerEl) {
        headerEl.innerHTML = headerHTML;
    }

    // =========================================================================
    // 1. Mobile Menu Toggle
    // =========================================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change icon based on state
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // =========================================================================
    // 2. Form Validation & Submission (V1.1 Enhanced)
    // =========================================================================
    const forms = document.querySelectorAll('form');

    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear previous error messages
    function clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.form-error').forEach(el => el.classList.remove('form-error'));
    }

    // Show error below a field
    function showFieldError(field, message) {
        field.classList.add('form-error');
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        field.parentNode.appendChild(errorEl);
    }

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors(form);

            let isValid = true;
            let firstInvalid = null;

            // Validate all required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const value = field.value.trim();

                // Skip checkboxes that are checked
                if (field.type === 'checkbox') {
                    if (!field.checked) {
                        isValid = false;
                        showFieldError(field, 'يجب الموافقة على هذا الحقل');
                        if (!firstInvalid) firstInvalid = field;
                    }
                    return;
                }

                // Empty check
                if (!value) {
                    isValid = false;
                    showFieldError(field, 'هذا الحقل مطلوب');
                    if (!firstInvalid) firstInvalid = field;
                    return;
                }

                // Email validation
                if (field.type === 'email' && !emailRegex.test(value)) {
                    isValid = false;
                    showFieldError(field, 'البريد الإلكتروني غير صحيح');
                    if (!firstInvalid) firstInvalid = field;
                }
            });

            if (!isValid) {
                if (firstInvalid) firstInvalid.focus();
                alert('الرجاء ملء جميع الحقول الإجبارية');
                return;
            }

            // Valid — simulate submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;

            setTimeout(() => {
                console.log('Form submitted successfully!');
                alert('تم إرسال طلبك بنجاح. سنتواصل معك قريباً!');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    });

    // =========================================================================
    // 3. Set minimum date for DatePicker to today
    // =========================================================================
    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (dateInputs.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        dateInputs.forEach(input => {
            input.setAttribute('min', today);
        });
    }

    // =========================================================================
    // 4. Search Functionality (V1.1)
    // =========================================================================
    const searchFloat = document.querySelector('.search-float');
    const searchOverlay = document.getElementById('searchOverlay');

    if (searchFloat && searchOverlay) {
        const searchInput = searchOverlay.querySelector('.search-input');
        const searchClose = searchOverlay.querySelector('.search-close');
        const searchResults = searchOverlay.querySelector('.search-results');

        // Search data — titles and links across the site
        const searchData = [
            { title: 'الرئيسية - فندق كلاب فاخر في هونغ كونغ', url: 'index.html' },
            { title: 'من نحن - قصة لوفنج هومز', url: 'about.html' },
            { title: 'الخدمات - الإقامة الفاخرة', url: 'services.html#boarding' },
            { title: 'الخدمات - الحلاقة والعناية', url: 'services.html#grooming' },
            { title: 'الخدمات - المشي اليومي', url: 'services.html#walking' },
            { title: 'الخدمات - رعاية بيطرية 24/7', url: 'services.html#vet' },
            { title: 'الخدمات والباقات', url: 'services.html' },
            { title: 'معرض الصور', url: 'gallery.html' },
            { title: 'الحجز - احجز موعدك', url: 'booking.html' },
            { title: 'اتصل بنا', url: 'contact.html' },
            { title: 'الأسئلة الشائعة', url: 'faq.html' },
            { title: 'المدونة - نصائح العناية بالكلاب', url: 'blog.html' },
            { title: 'أهمية المشي اليومي لكلبك', url: 'blog.html' },
            { title: 'كيف تختار أفضل الأطعمة الغذائية لكلبك', url: 'blog.html' },
            { title: 'نصائح لتدريب الجراء على الطاعة', url: 'blog.html' },
            { title: 'باقة يومية Day Care', url: 'services.html#packages' },
            { title: 'باقة مميزة Premium', url: 'services.html#packages' },
            { title: 'باقة كلاسيكية Classic', url: 'services.html#packages' }
        ];

        // Open search
        searchFloat.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
        });

        // Close search
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            });
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });

        // Search logic
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '<p class="search-hint">اكتب كلمتين على الأقل للبحث...</p>';
                return;
            }

            const results = searchData.filter(item =>
                item.title.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                searchResults.innerHTML = '<p class="search-no-result">لا توجد نتائج مطابقة</p>';
            } else {
                searchResults.innerHTML = results.map(item =>
                    `<a href="${item.url}" class="search-result-item">
                        <i class="fa-solid fa-arrow-left"></i>
                        ${item.title}
                    </a>`
                ).join('');
            }
        });
    }

    // =========================================================================
    // 5. Dark Mode Toggle (V2.0)
    // =========================================================================
    const headerNavContainer = document.querySelector('.nav-container');
    if (headerNavContainer) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'dark-toggle';
        toggleBtn.setAttribute('aria-label', 'تبديل الوضع الليلي');

        // Check current state from root html
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        toggleBtn.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

        // Insert toggle before mobile menu toggle
        const mobileToggleEl = document.querySelector('.mobile-toggle');
        if (mobileToggleEl) {
            headerNavContainer.insertBefore(toggleBtn, mobileToggleEl);
        } else {
            headerNavContainer.appendChild(toggleBtn);
        }

        toggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const newIsDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('darkMode', newIsDark ? 'true' : 'false');
            toggleBtn.innerHTML = newIsDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }

    // =========================================================================
    // 6. Font Size Changer (V2.0)
    // =========================================================================
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        const fontChangerHTML = `
            <div class="font-changer">
                <button class="font-btn" id="fontIncrease" aria-label="تكبير الخط">+</button>
                <button class="font-btn" id="fontReset" aria-label="الخط الافتراضي">A</button>
                <button class="font-btn" id="fontDecrease" aria-label="تصغير الخط">-</button>
            </div>
        `;
        footerBottom.insertAdjacentHTML('beforeend', fontChangerHTML);

        let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
        document.documentElement.style.fontSize = currentFontSize + 'px';

        document.getElementById('fontIncrease').addEventListener('click', () => {
            if (currentFontSize < 22) {
                currentFontSize += 2;
                document.documentElement.style.fontSize = currentFontSize + 'px';
                localStorage.setItem('fontSize', currentFontSize);
            }
        });

        document.getElementById('fontDecrease').addEventListener('click', () => {
            if (currentFontSize > 14) {
                currentFontSize -= 2;
                document.documentElement.style.fontSize = currentFontSize + 'px';
                localStorage.setItem('fontSize', currentFontSize);
            }
        });

        document.getElementById('fontReset').addEventListener('click', () => {
            currentFontSize = 16;
            document.documentElement.style.fontSize = currentFontSize + 'px';
            localStorage.setItem('fontSize', currentFontSize);
        });
    }

    // =========================================================================
    // 7. Booking Step Wizard (V2.0)
    // =========================================================================
    const wizardForm = document.getElementById('fullBookingForm');
    if (wizardForm && wizardForm.classList.contains('wizard-form')) {
        const steps = wizardForm.querySelectorAll('.wizard-step');
        const indicators = wizardForm.querySelectorAll('.step-indicator');
        const btnNext = document.getElementById('btnNext');
        const btnPrev = document.getElementById('btnPrev');
        const btnSubmit = document.getElementById('btnSubmit');
        let currentStep = 0;

        function updateWizard() {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
            indicators.forEach((ind, index) => {
                ind.classList.toggle('active', index === currentStep);
                ind.classList.toggle('completed', index < currentStep);
            });
            if (btnPrev) {
                btnPrev.style.display = currentStep === 0 ? 'none' : 'inline-block';
            }
            if (currentStep === steps.length - 1) {
                if (btnNext) btnNext.style.display = 'none';
                if (btnSubmit) btnSubmit.style.display = 'inline-block';
                populateSummary();
            } else {
                if (btnNext) btnNext.style.display = 'inline-block';
                if (btnSubmit) btnSubmit.style.display = 'none';
            }
        }

        function validateStep() {
            const inputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    valid = false;
                    input.reportValidity();
                }
            });
            return valid;
        }

        function populateSummary() {
            if (document.getElementById('sumName')) {
                document.getElementById('sumName').textContent = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
                document.getElementById('sumPhone').textContent = document.getElementById('phone').value;
                document.getElementById('sumDogName').textContent = document.getElementById('dogName').value;
                const serviceSelect = document.getElementById('mainService');
                document.getElementById('sumService').textContent = serviceSelect.options[serviceSelect.selectedIndex]?.text || '';
                document.getElementById('sumDate').textContent = document.getElementById('bStartDate').value;
            }
        }

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.preventDefault();
                if (validateStep()) {
                    currentStep++;
                    updateWizard();
                }
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.preventDefault();
                currentStep--;
                updateWizard();
            });
        }

        // Override default form submit handling to use our existing V1.1 generic submit style, but for Wizard
        wizardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            btnSubmit.textContent = 'جاري الإرسال...';
            btnSubmit.disabled = true;
            setTimeout(() => {
                alert('تم تأكيد حجزك بنجاح. سنتواصل معك قريباً!');
                wizardForm.reset();
                currentStep = 0;
                updateWizard();
                btnSubmit.textContent = 'تأكيد الحجز';
                btnSubmit.disabled = false;
            }, 1500);
        });

        // initial execution
        updateWizard();
    }

    // =========================================================================
    // 8. Lightbox Gallery (V2.0)
    // =========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
        // Create lightbox HTML
        const lbHTML = `
            <div class="lightbox-overlay" id="lightbox">
                <button class="lb-nav-btn lb-close" id="lbClose" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>
                <button class="lb-nav-btn lb-prev" id="lbPrev" aria-label="السابق"><i class="fa-solid fa-chevron-left"></i></button>
                <img src="" alt="Gallery Image Macro" class="lightbox-img" id="lbImg">
                <button class="lb-nav-btn lb-next" id="lbNext" aria-label="التالي"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lbHTML);

        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lbImg');
        const lbClose = document.getElementById('lbClose');
        const lbPrev = document.getElementById('lbPrev');
        const lbNext = document.getElementById('lbNext');

        let currentIndex = 0;
        const images = Array.from(galleryItems);

        function showImage(index) {
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;
            currentIndex = index;
            lbImg.src = images[currentIndex].src;
            lightbox.classList.add('active');
        }

        galleryItems.forEach((img, idx) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => showImage(idx));
        });

        if (lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
        if (lbPrev) lbPrev.addEventListener('click', () => showImage(currentIndex - 1));
        if (lbNext) lbNext.addEventListener('click', () => showImage(currentIndex + 1));

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.classList.remove('active');
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!lightbox || !lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') lightbox.classList.remove('active');
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1); // RTL, left might be next, but mapping intuitively
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    // =========================================================================
    // 9. Blog Filtering and Search (V2.0)
    // =========================================================================
    const blogFilterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const blogSearchInput = document.getElementById('blogLocalSearch');

    function filterBlogs(category, searchQuery) {
        if (!blogCards) return;
        const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
        blogCards.forEach(card => {
            const cardCat = card.getAttribute('data-cat');
            const matchCat = (category === 'all' || cardCat === category);

            const titleEl = card.querySelector('.blog-title');
            const descEl = card.querySelector('.blog-desc');
            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            const desc = descEl ? descEl.textContent.toLowerCase() : '';
            const matchQuery = title.includes(query) || desc.includes(query);

            if (matchCat && matchQuery) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (blogFilterBtns.length > 0 && blogCards.length > 0) {
        blogFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active class toggle
                blogFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-cat');
                filterBlogs(filter, blogSearchInput ? blogSearchInput.value : '');
            });
        });
    }

    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.filter-btn.active');
            const activeFilter = activeBtn ? activeBtn.getAttribute('data-cat') : 'all';
            filterBlogs(activeFilter, e.target.value);
        });
    }

});
