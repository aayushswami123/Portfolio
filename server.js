const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle form submissions
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Here you would typically send an email or save to a database
  console.log('Contact form submission:', { name, email, subject, message });
  
  // For now, just acknowledge receipt
  res.json({ success: true, message: 'Thank you for your message. I will get back to you soon!' });
});

// Serve index.html for all other routes (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${3000}`);
});