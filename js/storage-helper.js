function initializeMenuItems() {
  if (!localStorage.getItem('menuItems')) {
    const defaultItems = MENU_ITEMS.map(item => ({
      id: item.id,
      name: item.name_en,
      description: item.desc_en,
      price: parseFloat(item.price.replace('$', '')),
      category: item.category,
      image: item.img
    }));
    localStorage.setItem('menuItems', JSON.stringify(defaultItems));
  }
}

function getMenuItems() {
  const stored = localStorage.getItem('menuItems');
  if (stored) {
    return JSON.parse(stored);
  }
  return MENU_ITEMS;
}

function getMenuItemById(id) {
  const items = getMenuItems();
  return items.find(item => item.id === parseInt(id));
}