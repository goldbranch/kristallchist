document.addEventListener('DOMContentLoaded', () => {
    // --- District Popover ---
    const districtBtns = document.querySelectorAll('[data-popover-target="district-popover"]');
    const headerWrapper = document.querySelector('.header__district-wrapper');
    const template = document.getElementById('district-popover-template');
    const districtPopover = template.content.cloneNode(true);
    
    // Append popover to header wrapper (for desktop positioning)
    headerWrapper.appendChild(districtPopover);
    
    // Now get references to the cloned elements
    const popoverEl = document.getElementById('district-popover');
    const districtClose = popoverEl.querySelector('[data-popover-close]');
    const districtItems = popoverEl.querySelectorAll('.district-item');
    const townItems = popoverEl.querySelectorAll('.town-item');
    const districtNames = document.querySelectorAll('.header__district-name, .promo__district-name');
    const tabs = popoverEl.querySelectorAll('.popover__tab');
    const tabContents = popoverEl.querySelectorAll('.popover__tab-content');
    const searchInput = popoverEl.querySelector('.popover__search-input');

    // Load saved district from localStorage
    const savedDistrict = localStorage.getItem('selectedDistrict');
    if (savedDistrict) {
        districtNames.forEach(name => {
            name.textContent = savedDistrict;
        });
        districtItems.forEach(item => {
            if (item.dataset.district === savedDistrict) {
                item.classList.add('active');
            }
        });
        townItems.forEach(item => {
            if (item.dataset.town === savedDistrict) {
                item.classList.add('active');
            }
        });
    }

    // Search filter
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const activeTab = document.querySelector('.popover__tab.popover__tab--active');
        const activeTabContent = activeTab ? activeTab.dataset.tab : 'districts';

        const items = activeTabContent === 'districts' ? districtItems : townItems;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Toggle tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('popover__tab--active'));
            tab.classList.add('popover__tab--active');

            tabContents.forEach(content => {
                content.classList.remove('popover__tab-content--active');
                if (content.dataset.tabContent === tabId) {
                    content.classList.add('popover__tab-content--active');
                }
            });

            // Apply current search filter to new tab
            const query = searchInput.value.toLowerCase().trim();
            const items = tabId === 'districts' ? districtItems : townItems;

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Toggle popover
    let activeBtn = null;
    
    const updatePopoverPosition = () => {
        if (!activeBtn) {
            return;
        }
        
        if (window.innerWidth > 768) {
            // Desktop: CSS handles positioning relative to header wrapper
            popoverEl.style.position = '';
            popoverEl.style.top = '';
            popoverEl.style.left = '';
            popoverEl.style.transform = '';
            popoverEl.style.right = '';
            popoverEl.style.maxWidth = '';
            popoverEl.style.zIndex = '';
            popoverEl.style.bottom = '';
            return;
        }
        
        // Mobile: position below the promo button
        const btnRect = activeBtn.getBoundingClientRect();
        
        popoverEl.style.position = 'fixed';
        popoverEl.style.top = (btnRect.bottom + 10) + 'px';
        popoverEl.style.left = '10px';
        popoverEl.style.right = '10px';
        popoverEl.style.bottom = 'auto';
        popoverEl.style.transform = 'none';
        popoverEl.style.maxWidth = (window.innerWidth - 20) + 'px';
        popoverEl.style.zIndex = '10000';
    };

    districtBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = popoverEl.classList.contains('popover--active');

            // Close first if already open
            popoverEl.classList.remove('popover--active');
            districtBtns.forEach(b => b.classList.remove('active'));

            // Open if was closed
            if (!isActive) {
                popoverEl.classList.add('popover--active');
                btn.classList.add('active');
                activeBtn = btn;
                updatePopoverPosition();
                searchInput.focus();
            }
        });
    });
    
    // Update position on resize and scroll
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    // Close popover on close button
    districtClose.addEventListener('click', () => {
        popoverEl.classList.remove('popover--active');
        districtBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn = null;
        searchInput.value = '';
    });

    // Select district
    districtItems.forEach(item => {
        item.addEventListener('click', () => {
            const district = item.dataset.district;
            districtNames.forEach(name => {
                name.textContent = district;
            });
            localStorage.setItem('selectedDistrict', district);

            districtItems.forEach(i => i.classList.remove('active'));
            townItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            popoverEl.classList.remove('popover--active');
            districtBtns.forEach(btn => btn.classList.remove('active'));
            activeBtn = null;
            searchInput.value = '';
        });
    });

    // Select town
    townItems.forEach(item => {
        item.addEventListener('click', () => {
            const town = item.dataset.town;
            districtNames.forEach(name => {
                name.textContent = town;
            });
            localStorage.setItem('selectedDistrict', town);

            districtItems.forEach(i => i.classList.remove('active'));
            townItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            popoverEl.classList.remove('popover--active');
            districtBtns.forEach(btn => btn.classList.remove('active'));
            activeBtn = null;
            searchInput.value = '';
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (popoverEl.classList.contains('popover--active') &&
            !popoverEl.contains(e.target) &&
            !Array.from(districtBtns).some(btn => btn.contains(e.target))) {
            popoverEl.classList.remove('popover--active');
            districtBtns.forEach(btn => btn.classList.remove('active'));
            activeBtn = null;
            searchInput.value = '';
        }
    });

    // --- Modal Logic ---
    const modalOpenBtns = document.querySelectorAll('.js-open-review-modal, .js-open-qc-modal');
    const modalCloseBtns = document.querySelectorAll('.js-modal-close');
    const modals = document.querySelectorAll('.js-modal');

    // Open specific modal based on button class
    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let targetId;
            if (btn.classList.contains('js-open-review-modal')) {
                targetId = 'review-modal';
            } else if (btn.classList.contains('js-open-qc-modal')) {
                targetId = 'qc-modal';
            }

            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('modal--active');
            }
        });
    });

    // Close modal
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.js-modal').classList.remove('modal--active');
        });
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-modal')) {
            e.target.classList.remove('modal--active');
        }
    });

    // --- Form Submission Prevention (Demo) ---
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо! Ваша заявка отправлена.');
            // Close modal if inside one
            const modal = form.closest('.js-modal');
            if (modal) {
                modal.classList.remove('modal--active');
            }
            form.reset();
        });
    });

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq__item');
            faqItem.classList.toggle('active');
        });
    });
});