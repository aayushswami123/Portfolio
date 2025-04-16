// Wait for DOM to be fully loaded
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
  const navLinks = document.querySelector(".nav-links")
  let isMenuOpen = false

  if (mobileMenuBtn && navLinks) {
    // Set initial ARIA attributes
    mobileMenuBtn.setAttribute("aria-expanded", "false")
    mobileMenuBtn.setAttribute("aria-controls", "nav-links")
    navLinks.id = "nav-links"

    mobileMenuBtn.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen
      navLinks.classList.toggle("active")

      // Update ARIA attributes
      mobileMenuBtn.setAttribute("aria-expanded", isMenuOpen.toString())

      // Prevent body scrolling when menu is open
      document.body.style.overflow = isMenuOpen ? "hidden" : ""
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (isMenuOpen && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        isMenuOpen = false
        navLinks.classList.remove("active")
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
        if (isMenuOpen && window.innerWidth < 768) {
          isMenuOpen = false
          navLinks.classList.remove("active")
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

  // Animation on scroll with Intersection Observer
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
              // Add animation classes when element is visible
              entry.target.classList.add("animated")

              // Add specific animation classes based on element type
              if (entry.target.classList.contains("timeline-item") && entry.target.classList.contains("right")) {
                entry.target.style.animation = "fadeInSide 0.6s forwards"
              } else if (entry.target.classList.contains("timeline-item")) {
                entry.target.style.animation = "fadeInSide 0.6s forwards"
              } else {
                entry.target.style.animation = "fadeInUp 0.6s forwards"
              }

              // Unobserve after animation is triggered
              animationObserver.unobserve(entry.target)
            }
          })
        },
        {
          root: null,
          threshold: 0.1,
          rootMargin: "0px 0px -100px 0px",
        },
      )

      elements.forEach((element) => {
        animationObserver.observe(element)
      })
    }
  }

  // Initialize animations
  setupAnimations()

  // Typing animation for hero section
  function setupTypingAnimation() {
    const heroTitle = document.querySelector(".hero h1")
    if (heroTitle) {
      // Create a wrapper for the typing animation instead of modifying the h1 directly
      const originalText = heroTitle.innerHTML
      heroTitle.innerHTML = `<span class="typing-text">${originalText}</span>`
    }
  }

  // Initialize typing animation
  setupTypingAnimation()

  // Parallax effect for hero section
  function parallaxEffect() {
    const hero = document.querySelector(".hero")
    if (hero) {
      window.addEventListener("scroll", () => {
        const scrollPosition = window.pageYOffset
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`
      })
    }
  }

  // Initialize parallax effect
  parallaxEffect()

  // Contact form submission
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault() // Prevent default form submission

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
          if (data.success) {
            showPopup(data.message, "success")
            contactForm.reset() // Clear the form
          } else {
            showPopup(data.message || "Something went wrong", "error")
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
          showPopup("An error occurred. Please try again.", "error")
        })
    })
  }

  // Function to show a popup
  function showPopup(message, type) {
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
      navLinks.classList.remove("active")
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  }, 200)

  window.addEventListener("resize", handleResize)
})
