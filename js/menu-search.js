let currentFilter = 'all';
let currentSearch = '';

function filterMenuItems() {
  const menuItems = document.querySelectorAll('.menu-item');
  const noResults = document.getElementById('no-results');
  let visibleCount = 0;
  
  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  
  menuItems.forEach(menuItem => {
    const itemId = menuItem.querySelector('button').getAttribute('data-id');
    const item = MENU_ITEMS.find(x => x.id == itemId);
    
    if (!item) {
      menuItem.style.display = 'none';
      return;
    }
    
    let matchesFilter = currentFilter === 'all' || item.category === currentFilter;
    
    let matchesSearch = true;
    if (currentSearch.trim() !== '') {
      const searchLower = currentSearch.toLowerCase();
      const name = lang === 'ar' ? item.name_ar : item.name_en;
      const desc = lang === 'ar' ? item.desc_ar : item.desc_en;
      
      matchesSearch = name.toLowerCase().includes(searchLower) || 
                     desc.toLowerCase().includes(searchLower);
    }
    
    if (matchesFilter && matchesSearch) {
      menuItem.style.display = 'block';
      visibleCount++;
    } else {
      menuItem.style.display = 'none';
    }
  });
  
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

function setFilter(filter) {
  currentFilter = filter;
  
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  filterMenuItems();
}

function setSearch(searchText) {
  currentSearch = searchText;
  filterMenuItems();
}

function updateSearchPlaceholder() {
  const searchInput = document.getElementById('menu-search');
  if (!searchInput) return;
  
  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  if (translations[lang] && translations[lang].search_placeholder) {
    searchInput.placeholder = translations[lang].search_placeholder;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('menu-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      setSearch(e.target.value);
    });
  }
  
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setFilter(filter);
    });
  });
  
  window.addEventListener('nova-lang-changed', () => {
    updateSearchPlaceholder();
    filterMenuItems();
  });
  
  updateSearchPlaceholder();
  
  setTimeout(() => {
    filterMenuItems();
  }, 100);
});
