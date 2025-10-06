
let MENU_ITEMS = [
  {id:1,name_en:'Grilled Chicken', name_ar:'دجاج مشوي', desc_en:'Herb-marinated with roasted vegetables.', desc_ar:'متبل بالأعشاب مع خضار مشوية.', price:'$12', img:'images/dish1.jpg', category:'main'},
  {id:2,name_en:'Beef Steak', name_ar:'ستيك لحم', desc_en:'Juicy beef steak with sauce.', desc_ar:'ستيك طري مع صوص الشيف.', price:'$18', img:'images/dish2.jpg', category:'main'},
  {id:3,name_en:'Vegetable Pasta', name_ar:'باستا خضار', desc_en:'Healthy veggie pasta.', desc_ar:'باستا بالخضار الصحية.', price:'$10', img:'images/dish3.jpg', category:'main'},
  {id:4,name_en:'Chocolate Cake', name_ar:'كيكة الشوكولاتة', desc_en:'Rich chocolate dessert.', desc_ar:'كيك شوكولاتة لذيذ.', price:'$6', img:'images/dish4.jpg', category:'dessert'}
];

// Sync menu items with localStorage on page load
if (typeof window !== 'undefined') {
  const storedItems = localStorage.getItem('menuItems');
  if (storedItems) {
    try {
      const parsed = JSON.parse(storedItems);
      // Merge stored items with default items
      parsed.forEach(item => {
        const exists = MENU_ITEMS.find(m => m.id === item.id);
        if (!exists) {
          MENU_ITEMS.push({
            id: item.id,
            name_en: item.name || item.name_en || 'Item',
            name_ar: item.name_ar || item.name || 'صنف',
            desc_en: item.description || item.desc_en || '',
            desc_ar: item.desc_ar || item.description || '',
            price: typeof item.price === 'string' ? item.price : `$${item.price}`,
            img: item.image || item.img || 'images/dish1.jpg',
            category: item.category || 'main'
          });
        }
      });
    } catch(e) {
    }
  }
}
