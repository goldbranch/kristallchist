document.addEventListener('DOMContentLoaded', () => {
    // --- District Popover ---
    const districtBtn = document.querySelector('.header__district-btn');
    const districtPopover = document.getElementById('district-popover');
    const districtClose = document.querySelector('[data-popover-close]');
    const districtItems = document.querySelectorAll('.district-item');
    const townItems = document.querySelectorAll('.town-item');
    const districtName = document.querySelector('.header__district-name');
    const tabs = document.querySelectorAll('.popover__tab');
    const tabContents = document.querySelectorAll('.popover__tab-content');
    const searchInput = document.querySelector('.popover__search-input');

    // Load saved district from localStorage
    const savedDistrict = localStorage.getItem('selectedDistrict');
    if (savedDistrict) {
        districtName.textContent = savedDistrict;
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
    districtBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        districtPopover.classList.toggle('popover--active');
        districtBtn.classList.toggle('active');

        // Focus search input when opening
        if (districtPopover.classList.contains('popover--active')) {
            searchInput.focus();
        }
    });

    // Close popover on close button
    districtClose.addEventListener('click', () => {
        districtPopover.classList.remove('popover--active');
        districtBtn.classList.remove('active');
        searchInput.value = '';
    });

    // Select district
    districtItems.forEach(item => {
        item.addEventListener('click', () => {
            const district = item.dataset.district;
            districtName.textContent = district;
            localStorage.setItem('selectedDistrict', district);

            districtItems.forEach(i => i.classList.remove('active'));
            townItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            districtPopover.classList.remove('popover--active');
            districtBtn.classList.remove('active');
            searchInput.value = '';
        });
    });

    // Select town
    townItems.forEach(item => {
        item.addEventListener('click', () => {
            const town = item.dataset.town;
            districtName.textContent = town;
            localStorage.setItem('selectedDistrict', town);

            districtItems.forEach(i => i.classList.remove('active'));
            townItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            districtPopover.classList.remove('popover--active');
            districtBtn.classList.remove('active');
            searchInput.value = '';
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (districtPopover.classList.contains('popover--active') &&
            !districtPopover.contains(e.target) &&
            !districtBtn.contains(e.target)) {
            districtPopover.classList.remove('popover--active');
            districtBtn.classList.remove('active');
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