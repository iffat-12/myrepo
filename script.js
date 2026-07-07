/* 
   script.js 
   Portfolio Interactivity
   Handles Light/Dark Mode toggling, Formspree email submission, and active nav states.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Load saved theme or match system settings
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
  } else {
    const defaultTheme = systemPrefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', defaultTheme);
    updateToggleIcon(defaultTheme);
  }
  
  // Theme Toggle Listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon(newTheme);
    });
  }
  
  function updateToggleIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = '☀️'; // Sun icon for light mode option
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggleBtn.innerHTML = '🌙'; // Moon icon for dark mode option
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Active Menu Link Highlighting based on current filename
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll('.nav-item a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split("/").pop();
    if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
      link.parentElement.classList.add('active');
    } else {
      link.parentElement.classList.remove('active');
    }
  });

  // Contact Form Handling (AJAX Submission to Formspree)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const actionUrl = contactForm.action;
      
      // Validation check
      const email = formData.get('email');
      const name = formData.get('name');
      const message = formData.get('message');
      
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      
      showStatus('Sending your message...', 'info');
      
      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          showStatus('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          const data = await response.json();
          if (data && data.errors) {
            showStatus(data.errors.map(err => err.message).join(', '), 'error');
          } else {
            showStatus('Oops! There was a problem submitting your form.', 'error');
          }
        }
      } catch (error) {
        // Fallback for firewall blocks / local connection errors
        showStatus('Network connection error. Opening your default mail client instead...', 'error');
        
        // Open default mail client fallback
        const subject = encodeURIComponent(formData.get('_subject') || 'Contact Portfolio Form');
        const bodyText = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:iffatfatima445@gmail.com?subject=${subject}&body=${bodyText}`;
      }
    });
  }
  
  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status'; // Reset classes
    
    if (type === 'success') {
      formStatus.classList.add('success');
    } else if (type === 'error') {
      formStatus.classList.add('error');
    } else {
      // Info style
      formStatus.style.display = 'block';
      formStatus.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
      formStatus.style.color = 'var(--primary-color)';
    }
  }
});
