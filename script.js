// Wait for DOM to be fully loaded
document.title = "Aayush Swami - Portfolio";

document.addEventListener("DOMContentLoaded", () => {
  // Debounce function to improve performance for scroll and resize events
  function debounce(func, delay) {
    let timeoutId
    return function () {
      const args = arguments
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  }

  // Mobile menu toggle with improved accessibility
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileMenuClose = document.querySelector(".mobile-menu-close")
  let isMenuOpen = false

  if (mobileMenuBtn && mobileMenu) {
    // Set initial ARIA attributes
    mobileMenuBtn.setAttribute("aria-expanded", "false")
    mobileMenuBtn.setAttribute("aria-controls", "mobile-menu")
    mobileMenu.id = "mobile-menu"

    mobileMenuBtn.addEventListener("click", () => {
      isMenuOpen = true
      mobileMenu.classList.add("active")
      mobileMenuBtn.setAttribute("aria-expanded", "true")
      document.body.style.overflow = "hidden" // Prevent body scrolling
    })

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", () => {
        isMenuOpen = false
        mobileMenu.classList.remove("active")
        mobileMenuBtn.setAttribute("aria-expanded", "false")
        document.body.style.overflow = "" // Restore body scrolling
      })
    }

    // Close menu when clicking on mobile menu links
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        isMenuOpen = false
        mobileMenu.classList.remove("active")
        mobileMenuBtn.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        isMenuOpen = false
        mobileMenu.classList.remove("active")
        mobileMenuBtn.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }
    })
  }

  // Smooth scrolling with performance optimization
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")

      // Check if the target element exists
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        e.preventDefault()

        // Use requestAnimationFrame for smoother performance
        const scrollToElement = () => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }

        requestAnimationFrame(scrollToElement)

        // Close mobile menu if open
        if (isMenuOpen) {
          isMenuOpen = false
          mobileMenu.classList.remove("active")
          mobileMenuBtn.setAttribute("aria-expanded", "false")
          document.body.style.overflow = ""
        }
      }
    })
  })

  // Scroll to top button with debouncing
  const scrollToTopBtn = document.querySelector(".scroll-to-top")

  if (scrollToTopBtn) {
    // Toggle button visibility with debouncing
    const handleScroll = debounce(() => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("active")
        scrollToTopBtn.setAttribute("aria-hidden", "false")
      } else {
        scrollToTopBtn.classList.remove("active")
        scrollToTopBtn.setAttribute("aria-hidden", "true")
      }
    }, 100)

    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Header scroll effect
  const header = document.querySelector("header")

  if (header) {
    const handleHeaderScroll = debounce(() => {
      if (window.pageYOffset > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }, 100)

    window.addEventListener("scroll", handleHeaderScroll)

    // Initial check
    handleHeaderScroll()
  }

  // IMPROVED: Animation on scroll with Intersection Observer
  function setupAnimations() {
    // Elements to animate
    const elements = document.querySelectorAll(
      ".skill-card, .project-card, .timeline-item, .section-title, .about-image, .about-text p, .about-text .btn, .contact-info, .contact-method, .contact-form, .form-group, .social-icon, .footer-content",
    )

    // Check if IntersectionObserver is supported
    if ("IntersectionObserver" in window) {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // IMPROVED: Add animation classes when element is visible with delay
              setTimeout(() => {
                entry.target.classList.add("animated")

                // Add specific animation classes based on element type
                if (entry.target.classList.contains("timeline-item") && entry.target.classList.contains("right")) {
                  entry.target.style.animation = "fadeInSide 0.8s forwards ease-out"
                } else if (entry.target.classList.contains("timeline-item")) {
                  entry.target.style.animation = "fadeInSide 0.8s forwards ease-out"
                } else {
                  entry.target.style.animation = "fadeInUp 0.8s forwards ease-out"
                }
              }, 100) // Small delay to ensure animations are visible

              // IMPROVED: Don't unobserve immediately to prevent flickering
              setTimeout(() => {
                animationObserver.unobserve(entry.target)
              }, 1000)
            }
          })
        },
        {
          root: null,
          threshold: 0.15, // IMPROVED: Lower threshold to trigger earlier
          rootMargin: "0px 0px -50px 0px", // IMPROVED: Adjusted for better visibility
        },
      )

      elements.forEach((element, index) => {
        // IMPROVED: Add staggered delay based on position
        const staggerDelay = index * 0.1
        element.style.setProperty('--animation-delay', `${staggerDelay}s`)
        
        // Add initial state classes
        element.classList.add("animation-ready")
        
        animationObserver.observe(element)
      })
    }
  }

  // IMPROVED: Wait a bit to ensure DOM is fully rendered before setting up animations
  setTimeout(() => {
    setupAnimations()
  }, 200)

  // Contact form submission with validation and feedback
  const contactForm = document.getElementById("contactForm")
  const responseMessage = document.getElementById("responseMessage")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault() // Prevent default form submission

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      // Capture form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      }

      // Send data to the backend using fetch
      fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
          return response.json()
        })
        .then((data) => {
          // Display response message
          if (responseMessage) {
            responseMessage.textContent = data.message
            responseMessage.className = data.success ? "success-message" : "error-message"
            responseMessage.style.display = "block"

            // Hide message after 5 seconds
            setTimeout(() => {
              responseMessage.style.display = "none"
            }, 5000)
          }

          if (data.success) {
            // Reset form on success
            contactForm.reset()
            // Show success popup
            showPopup(data.message, "success")
          } else {
            // Show error popup
            showPopup(data.message || "Something went wrong", "error")
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
          showPopup("An error occurred. Please try again.", "error")

          // Display error in the form
          if (responseMessage) {
            responseMessage.textContent = "An error occurred. Please try again."
            responseMessage.className = "error-message"
            responseMessage.style.display = "block"
          }
        })
        .finally(() => {
          // Restore button state
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        })
    })
  }

  // Function to show a popup notification
  function showPopup(message, type) {
    // Remove any existing popups
    const existingPopup = document.querySelector(".popup")
    if (existingPopup) {
      existingPopup.remove()
    }

    const popup = document.createElement("div")
    popup.className = `popup ${type}`
    popup.textContent = message

    document.body.appendChild(popup)

    // Automatically close the popup after 3 seconds
    setTimeout(() => {
      popup.style.opacity = "0"
      setTimeout(() => {
        popup.remove()
      }, 300)
    }, 3000)
  }

  // Handle window resize events (debounced)
  const handleResize = debounce(() => {
    // Adjust mobile menu state if window is resized beyond mobile breakpoint
    if (window.innerWidth >= 768 && isMenuOpen) {
      isMenuOpen = false
      mobileMenu.classList.remove("active")
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
    
    // NEW: Center education and project sections on mobile
    centerMobileElements();
  }, 200)

  window.addEventListener("resize", handleResize)

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.classList.add("reduced-motion")
  }
  
  // NEW: Function to center education items and projects on mobile
  function centerMobileElements() {
    const isMobile = window.innerWidth < 768;
    
    // Center education timeline items on mobile
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      if (isMobile) {
        item.style.transform = 'none';  // Reset any transform
        item.style.margin = '0 auto';   // Center with auto margins
        item.style.left = '0';          // Reset left position
        item.style.right = '0';         // Reset right position
        item.classList.add('mobile-centered'); // Add class for additional styling
      } else {
        item.style.margin = '';         // Reset margins
        item.style.left = '';           // Reset left to CSS default
        item.style.right = '';          // Reset right to CSS default
        item.classList.remove('mobile-centered'); // Remove mobile class
      }
    });
    
    // Center project cards on mobile
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      if (isMobile) {
        card.style.transform = 'none';  // Reset any transform
        card.style.margin = '0 auto 2rem auto';  // Center with auto margins (and bottom margin)
        card.style.float = 'none';      // Remove float
        card.classList.add('mobile-centered'); // Add class for additional styling
      } else {
        card.style.margin = '';         // Reset margins
        card.style.float = '';          // Reset float to CSS default
        card.classList.remove('mobile-centered'); // Remove mobile class
      }
    });
    
    // Apply specific animation for centered mobile elements
    if (isMobile) {
      document.querySelectorAll('.mobile-centered').forEach(element => {
        // Change animation to fade in from bottom for mobile centered elements
        element.dataset.animation = 'fade-in-up-center';
      });
    }
  }
  
  // Call center function on initial load
  setTimeout(centerMobileElements, 300);
})

// IMPROVED: Particle Background Animation with better timing
document.addEventListener("DOMContentLoaded", () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    return // Don't create particles if user prefers reduced motion
  }

  // IMPROVED: Delay particle creation to prevent initial performance issues
  setTimeout(() => {
    // Create particle container
    const particlesContainer = document.createElement("div")
    particlesContainer.className = "particles-background"
    document.body.prepend(particlesContainer)

    // IMPROVED: Reduced particle count for better performance
    const particleCount = 60 // Total number of particles
    const directions = ["down", "up", "left", "right"] // Possible movement directions

    // Create initial particles in batches to improve performance
    function createParticlesBatch(container, count, batchSize, delay) {
      let created = 0;
      
      function createBatch() {
        const batchCount = Math.min(batchSize, count - created);
        
        for (let i = 0; i < batchCount; i++) {
          createParticle(container);
          created++;
        }
        
        if (created < count) {
          setTimeout(createBatch, delay);
        }
      }
      
      createBatch();
    }

    // Start creating particles in batches (10 particles every 100ms)
    createParticlesBatch(particlesContainer, particleCount, 10, 100);

    // Function to create a single particle
    function createParticle(container) {
      const particle = document.createElement("div")
      particle.className = "particle"

      // Random particle size
      const sizeClasses = ["particle-tiny", "particle-small", "particle-medium", "particle-large"]
      const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)]
      particle.classList.add(sizeClass)

      // Random position based on direction
      const direction = directions[Math.floor(Math.random() * directions.length)]

      // Random starting position
      let xPos, yPos

      switch (direction) {
        case "down":
          xPos = Math.random() * 100
          yPos = -10
          break
        case "up":
          xPos = Math.random() * 100
          yPos = 110
          break
        case "right":
          xPos = -10
          yPos = Math.random() * 100
          break
        case "left":
          xPos = 110
          yPos = Math.random() * 100
          break
      }

      // Set particle position
      particle.style.left = `${xPos}%`
      particle.style.top = `${yPos}%`

      // Random drift (perpendicular movement)
      const drift = Math.random() * 100 - 50
      particle.style.setProperty("--drift", `${drift}px`)

      // IMPROVED: Longer animation duration for better visibility
      const duration = Math.random() * 25 + 15

      // Set animation based on direction
      switch (direction) {
        case "down":
          particle.style.animation = `float-down ${duration}s linear infinite`
          break
        case "up":
          particle.style.animation = `float-up ${duration}s linear infinite`
          break
        case "right":
          particle.style.animation = `float-right ${duration}s linear infinite`
          break
        case "left":
          particle.style.animation = `float-left ${duration}s linear infinite`
          break
      }

      // Add particle to container
      container.appendChild(particle)

      // Remove and recreate particle after animation completes
      setTimeout(() => {
        if (particle.parentNode === container) {
          container.removeChild(particle)
          createParticle(container)
        }
      }, duration * 1000)
    }
  }, 500); // Delay particle creation to prevent initial performance issues
})

// IMPROVED: Animation System - Detect elements with better timing
document.addEventListener("DOMContentLoaded", () => {
  // Delay animation setup to ensure DOM is fully populated
  setTimeout(() => {
    // Function to check if IntersectionObserver is supported
    if ("IntersectionObserver" in window) {
      // Create animation observer with improved settings
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If element is in viewport
            if (entry.isIntersecting) {
              // Get animation type from data attribute
              const animationType = entry.target.dataset.animation || "fade-in"
              
              // IMPROVED: Add a small delay before applying animations
              setTimeout(() => {
                // Add animation class
                entry.target.classList.add(animationType)
                
                // IMPROVED: Mark as animated to prevent re-animation
                entry.target.dataset.animated = "true";
              }, 100);

              // IMPROVED: Delay unobserving to ensure animation completes
              setTimeout(() => {
                animationObserver.unobserve(entry.target)
              }, 1000);
            }
          })
        },
        {
          root: null,
          threshold: 0.15, // IMPROVED: Lower threshold to trigger earlier
          rootMargin: "0px 0px -100px 0px", // IMPROVED: Adjusted for better visibility
        },
      )

      // Select all elements to animate
      const elementsToAnimate = document.querySelectorAll(".animate-element")

      // Observe each element
      elementsToAnimate.forEach((element, index) => {
        // IMPROVED: Add initial state and delay
        element.style.opacity = "0";
        element.style.setProperty('--animation-delay', `${index * 0.05}s`);
        element.style.animationFillMode = "forwards";
        
        animationObserver.observe(element)
      })

      // Special handling for timeline items
      const timelineItems = document.querySelectorAll(".timeline-item")
      timelineItems.forEach((item, index) => {
        // NEW: On mobile, use centered animation instead of left/right animations
        if (window.innerWidth < 768) {
          item.dataset.animation = "fade-in-up-center";
        } else {
          // Set animation type based on position for desktop
          if (item.classList.contains("left")) {
            item.dataset.animation = "slide-in-left";
          } else {
            item.dataset.animation = "slide-in-right";
          }
        }

        // IMPROVED: Longer staggered delay for better visibility
        item.style.animationDelay = `${0.3 * index}s`
        item.style.opacity = "0";
        item.style.animationFillMode = "forwards";

        // Add to animation observer
        animationObserver.observe(item)
      })

      // Special handling for skill cards
      const skillCards = document.querySelectorAll(".skill-card")
      skillCards.forEach((card, index) => {
        card.dataset.animation = "fall-in"
        // IMPROVED: Add staggered delay based on position
        card.style.animationDelay = `${0.15 * index}s`
        card.style.opacity = "0";
        card.style.animationFillMode = "forwards";
        
        animationObserver.observe(card)
      })

      // Special handling for project cards
      const projectCards = document.querySelectorAll(".project-card")
      projectCards.forEach((card, index) => {
        // NEW: On mobile, use centered animation
        if (window.innerWidth < 768) {
          card.dataset.animation = "fade-in-up-center";
        } else {
          // Alternate between left and right animations on desktop
          if (index % 2 === 0) {
            card.dataset.animation = "slide-in-left";
          } else {
            card.dataset.animation = "slide-in-right";
          }
        }
        
        // IMPROVED: Add staggered delay based on position
        card.style.animationDelay = `${0.25 * index}s`
        card.style.opacity = "0";
        card.style.animationFillMode = "forwards";

        animationObserver.observe(card)
      })

      // Hero section elements
      const heroElements = document.querySelectorAll(".hero-content > *")
      heroElements.forEach((element, index) => {
        element.classList.add("animate-element")
        element.dataset.animation = "fall-in"
        // IMPROVED: Longer delay for hero elements
        element.style.animationDelay = `${0.3 * index}s`
        element.style.opacity = "0";
        element.style.animationFillMode = "forwards";
        
        animationObserver.observe(element)
      })

      // About section
      const aboutImage = document.querySelector(".about-image")
      if (aboutImage) {
        aboutImage.classList.add("animate-element")
        aboutImage.dataset.animation = "slide-in-left"
        aboutImage.style.opacity = "0";
        aboutImage.style.animationFillMode = "forwards";
        
        animationObserver.observe(aboutImage)
      }

      const aboutTextElements = document.querySelectorAll(".about-text > *")
      aboutTextElements.forEach((element, index) => {
        element.classList.add("animate-element")
        element.dataset.animation = "slide-in-right"
        // IMPROVED: More noticeable staggered delay
        element.style.animationDelay = `${0.2 * index}s`
        element.style.opacity = "0";
        element.style.animationFillMode = "forwards";
        
        animationObserver.observe(element)
      })

      // Contact section
      const contactInfo = document.querySelector(".contact-info")
      if (contactInfo) {
        contactInfo.classList.add("animate-element")
        contactInfo.dataset.animation = "slide-in-left"
        contactInfo.style.opacity = "0";
        contactInfo.style.animationFillMode = "forwards";
        
        animationObserver.observe(contactInfo)
      }

      const contactForm = document.querySelector(".contact-form")
      if (contactForm) {
        contactForm.classList.add("animate-element")
        contactForm.dataset.animation = "slide-in-right"
        contactForm.style.opacity = "0";
        contactForm.style.animationFillMode = "forwards";
        
        animationObserver.observe(contactForm)
      }

      // Section titles
      const sectionTitles = document.querySelectorAll(".section-title, .timeline-title")
      sectionTitles.forEach((title) => {
        title.classList.add("animate-element")
        title.dataset.animation = "fall-in"
        title.style.opacity = "0";
        title.style.animationFillMode = "forwards";
        
        animationObserver.observe(title)
      })
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      document.querySelectorAll(".animate-element").forEach((element) => {
        element.style.opacity = "1"
        element.style.transform = "none"
      })
    }

    // Add typing effect to hero heading
    const heroHeading = document.querySelector(".hero h1")
    if (heroHeading) {
      // Create wrapper for typing effect
      const headingText = heroHeading.innerHTML
      heroHeading.innerHTML = `<span class="typing-effect">${headingText}</span>`
    }

    // IMPROVED: Add falling particles with delayed start
    setTimeout(() => {
      createFallingParticles()
    }, 1000);
    
  }, 300); // Delay to ensure DOM is fully populated
})

// IMPROVED: Function to create falling particles in the background with better performance
function createFallingParticles() {
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles-container"
  particlesContainer.style.position = "fixed"
  particlesContainer.style.top = "0"
  particlesContainer.style.left = "0"
  particlesContainer.style.width = "100%"
  particlesContainer.style.height = "100%"
  particlesContainer.style.overflow = "hidden"
  particlesContainer.style.pointerEvents = "none"
  particlesContainer.style.zIndex = "-1"

  document.body.prepend(particlesContainer)

  // IMPROVED: Create particles gradually for better performance
  let particleCount = 0;
  const maxParticles = 30; // IMPROVED: Reduced number of particles
  
  function addParticle() {
    if (particleCount < maxParticles) {
      createParticle(particlesContainer);
      particleCount++;
      setTimeout(addParticle, 200); // Add one particle every 200ms
    }
  }
  
  // Start adding particles
  addParticle();
}

// IMPROVED: Function to create particles with better animation parameters
function createParticle(container) {
  const particle = document.createElement("div")

  // Random size between 3px and 8px
  const size = Math.random() * 5 + 3

  // Random position
  const xPos = Math.random() * 100
  const yPos = Math.random() * -100 // Start above the viewport

  // IMPROVED: Longer fall duration for better visibility
  const fallDuration = Math.random() * 15 + 15

  // Random horizontal drift
  const drift = Math.random() * 50 - 25

  // Style the particle
  particle.style.position = "absolute"
  particle.style.width = `${size}px`
  particle.style.height = `${size}px`
  particle.style.borderRadius = "50%"
  particle.style.backgroundColor = "rgba(99, 102, 241, 0.2)"
  particle.style.top = `${yPos}%`
  particle.style.left = `${xPos}%`
  
  // IMPROVED: Use custom animation name to prevent conflicts
  const animationName = `fall-${Math.floor(Math.random() * 1000)}`;
  particle.style.animation = `${animationName} ${fallDuration}s ease-in infinite`;

  // Add keyframes for this specific particle
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes ${animationName} {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      90% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(${window.innerHeight * 1.5}px) translateX(${drift}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleElement);

  container.appendChild(particle)

  // Remove and recreate particle after animation completes
  setTimeout(() => {
    particle.remove()
    styleElement.remove()
    createParticle(container)
  }, fallDuration * 1000)
}

// Add CSS variables for animation control
document.documentElement.style.setProperty('--animation-duration', '1s');
document.documentElement.style.setProperty('--animation-timing', 'ease-out');

// IMPROVED: Add basic animation CSS if not already in stylesheet
