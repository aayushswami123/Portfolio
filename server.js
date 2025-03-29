const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer transporter (using Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aayushswami8@gmail.com', // Replace with your email
    pass: 'kdrp nlwn yzlf mzji' 
  }
});

// Handle form submission
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Log form data
  console.log('Contact form submission:', { name, email, subject, message });

  // Confirmation Email to User
  const userMailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Thank You for Contacting Me!',
    html: `<p>Hi ${name},</p>
           <p>Thank you for reaching out. I have received your message:</p>
           <blockquote>${message}</blockquote>
           <p>I will get back to you soon.</p>
           <p>Best Regards,<br>Aayush Swami</p>`
  };

  // Notification Email to Yourself
  const ownerMailOptions = {
    from: 'your-email@gmail.com',
    to: 'your-email@gmail.com', // Send to yourself
    subject: `New Contact Form Submission: ${subject}`,
    html: `<p>You have a new contact form submission:</p>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Message:</strong></p>
           <p>${message}</p>`
  };

  // Send Emails
  Promise.all([
    transporter.sendMail(userMailOptions),
    transporter.sendMail(ownerMailOptions)
  ])
    .then(() => {
      res.json({ success: true, message: 'Thank you for your message. I will get back to you soon!' });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.json({ success: false, message: 'There was an error. Please try again later.' });
    });
});

// Serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
