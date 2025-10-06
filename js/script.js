
document.addEventListener('DOMContentLoaded', ()=>{
  let idx=0;
  const slides = document.querySelectorAll('.carousel .slide');
  if(slides.length){
    slides[0].classList.add('active');
    setInterval(()=>{
      slides[idx].classList.remove('active');
      idx = (idx+1)%slides.length;
      setTimeout(() => {
        slides[idx].classList.add('active');
      }, 100);
    },3500);
  }

  const resForm = document.getElementById('reservation-form');
  if(resForm){
    resForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      
      const dateField = document.getElementById('res-date');
      const timeField = document.getElementById('res-time');
      const nameField = document.getElementById('res-name');
      const phoneField = document.getElementById('res-phone');
      const peopleField = document.getElementById('res-people');
      
      if (!dateField || !timeField || !nameField || !phoneField || !peopleField) {
        return;
      }
      
      if (!dateField.value || !timeField.value || !nameField.value || !phoneField.value) {
        alert('Please fill in all fields');
        return;
      }
      
      const reservation = {
        date: dateField.value,
        time: timeField.value,
        name: nameField.value,
        phone: phoneField.value,
        guests: peopleField.value
      };
      
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      reservations.push(reservation);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      
      document.getElementById('reservation-success').style.display='block';
      setTimeout(()=>{ document.getElementById('reservation-success').style.display='none'; resForm.reset(); },2500);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      document.getElementById('contact-success').style.display='block';
      setTimeout(()=>{ document.getElementById('contact-success').style.display='none'; contactForm.reset(); },2500);
    });
  }

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if(mobileMenuToggle && mainNav){
    mobileMenuToggle.addEventListener('click', ()=>{
      mainNav.classList.toggle('active');
      mobileMenuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', ()=>{
        mainNav.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
      });
    });
  }
});
