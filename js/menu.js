
document.addEventListener('DOMContentLoaded', ()=>{
  const container = document.getElementById('menu-items');
  if(!container) return;
  
  // استخدام MENU_ITEMS مباشرة
  const menuItems = MENU_ITEMS;
  
  menuItems.forEach(item=>{
    const div = document.createElement('div');
    div.className='menu-item';
    div.setAttribute('data-category', item.category);
    
    const imgSrc = item.img;
    const price = item.price.replace('$', '');
    
    const lang = document.documentElement.getAttribute('data-lang') || 'en';
    const btnText = lang === 'ar' ? 'اطلب الآن' : 'Order Now';
    
    div.innerHTML = `
      <img src="${imgSrc}" alt="${item.name_en}" loading="lazy">
      <h4 class="mi-name" data-name-en="${item.name_en}" data-name-ar="${item.name_ar}">${item.name_en}</h4>
      <p class="mi-desc" data-desc-en="${item.desc_en}" data-desc-ar="${item.desc_ar}">${item.desc_en}</p>
      <p class="mi-price">${item.price}</p>
      <button class="add-to-cart-btn" data-id="${item.id}" data-btn-ar="اطلب الآن" data-btn-en="Order Now">${btnText}</button>
    `;
    
    container.appendChild(div);
  });

  // تحديث اللغة
  function localizeMenu(){
    const lang = document.documentElement.getAttribute('data-lang');
    document.querySelectorAll('.menu-item').forEach(el=>{
      const nameEl = el.querySelector('.mi-name');
      const descEl = el.querySelector('.mi-desc');
      const btnEl = el.querySelector('.add-to-cart-btn');
      
      if(lang === 'ar'){
        nameEl.innerText = nameEl.getAttribute('data-name-ar');
        descEl.innerText = descEl.getAttribute('data-desc-ar');
        if(btnEl) btnEl.innerText = btnEl.getAttribute('data-btn-ar');
      } else {
        nameEl.innerText = nameEl.getAttribute('data-name-en');
        descEl.innerText = descEl.getAttribute('data-desc-en');
        if(btnEl) btnEl.innerText = btnEl.getAttribute('data-btn-en');
      }
    });
  }

  window.addEventListener('nova-lang-changed', localizeMenu);
  localizeMenu();

  // ربط أزرار الإضافة للسلة
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      addToCart(id);
    });
  });
});
