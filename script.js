// Mobile menu toggle with improved accessibility
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
let isMenuOpen = false;

if (mobileMenuBtn && navLinks) {
  // Set initial ARIA attributes
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
  navLinks.id = 'nav-links';
  
  mobileMenuBtn.addEventListener('click', function() {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    
    // Update ARIA attributes
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen.toString());
    
    // Use classes instead of inline styles for better maintainability
    // The CSS should handle display: flex/none based on the .active class
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (isMenuOpen && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      isMenuOpen = false;
      navLinks.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// Smooth scrolling with performance optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    
    // Check if the target element exists
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      e.preventDefault();
      
      // Use requestAnimationFrame for smoother performance
      const scrollToElement = () => {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      };
      
      requestAnimationFrame(scrollToElement);
      
      // Close mobile menu if open
      if (isMenuOpen && window.innerWidth < 768) {
        isMenuOpen = false;
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });
});

// Scroll to top button with debouncing
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (scrollToTopBtn) {
  // Debounce function to improve scroll performance
  function debounce(func, delay) {
    let timeoutId;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
  }
  
  // Toggle button visibility with debouncing
  const handleScroll = debounce(function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('active');
      scrollToTopBtn.setAttribute('aria-hidden', 'false');
    } else {
      scrollToTopBtn.classList.remove('active');
      scrollToTopBtn.setAttribute('aria-hidden', 'true');
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll);
  
  // Initial check
  handleScroll();
  
  scrollToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animation on scroll with Intersection Observer
function setupAnimations() {
  // Elements to animate
  const elements = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .section-title');
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Unobserve after animation is triggered
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    elements.forEach(element => {
      animationObserver.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    elements.forEach(element => {
      element.classList.add('animated');
    });
  }
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAnimations);
} else {
  setupAnimations();
}
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
  
    // Capture form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };
  
    // Send data to the backend using fetch
    fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        showPopup(data.message, 'success');
        document.getElementById('contactForm').reset(); // Clear the form
      } else {
        showPopup(data.message || 'Something went wrong', 'error');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      showPopup('An error occurred. Please try again.', 'error');
    });
  });
  
  // Function to show a popup
  function showPopup(message, type) {
    const popup = document.createElement('div');
    popup.className = `popup ${type}`;
    popup.textContent = message;
  
    document.body.appendChild(popup);
  
    // Automatically close the popup after 3 seconds
    setTimeout(() => {
      popup.remove();
    }, 3000);
  }
  

// Handle window resize events (debounced)
const handleResize = debounce(function() {
  // Adjust mobile menu state if window is resized beyond mobile breakpoint
  if (window.innerWidth >= 768 && isMenuOpen) {
    isMenuOpen = false;
    navLinks.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}, 200);

window.addEventListener('resize', handleResize);