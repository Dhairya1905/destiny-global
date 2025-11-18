const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite default
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      // Add your production domain here
      'https://yourdomain.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware - ORDER MATTERS!
app.use(cors(corsOptions));
// REMOVED: app.options('*', cors(corsOptions)); - This line was causing the error
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.get('origin'));
  next();
});

// Email configuration
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration on startup
transport.verify(function (error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Destiny Global Import Export API is running!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'email-api',
    timestamp: new Date().toISOString()
  });
});

// Enquiry submission endpoint
app.post('/api/enquiry', async (req, res) => {
  try {
    console.log('Received enquiry:', req.body);
    
    const { name, email, phone, company, country, message, product } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields (name, email, phone, message)' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Email to seller
    const sellerMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'support@destinyglobalimportexport.com',
      subject: `New Enquiry from ${name} - Destiny Global`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #f97316; margin-bottom: 5px; }
            .value { color: #374151; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 New Product Enquiry</h1>
              <p>Destiny Global Import Export</p>
            </div>
            <div class="content">
              <h2>Customer Details</h2>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${phone}</div>
              </div>
              ${company ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${company}</div>
              </div>
              ` : ''}
              ${country ? `
              <div class="field">
                <div class="label">Country:</div>
                <div class="value">${country}</div>
              </div>
              ` : ''}
              ${product ? `
              <div class="field">
                <div class="label">Product Interest:</div>
                <div class="value">${product}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message}</div>
              </div>
              <div class="footer">
                <p>This enquiry was submitted through Destiny Global Import Export website</p>
                <p>Please respond to the customer at: ${email}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Acknowledgment email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Your Enquiry - Destiny Global Import Export',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .contact-info { background: white; padding: 20px; border-radius: 5px; margin-top: 20px; }
            .contact-item { margin: 10px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Thank You for Your Enquiry!</h1>
              <p>Destiny Global Import Export</p>
            </div>
            <div class="content">
              <div class="message">
                <h2>Dear ${name},</h2>
                <p>Thank you for your interest in our products. We have received your enquiry and our team will get back to you within 24 hours.</p>
                <p>We specialize in premium organic products including cow dung compost and pellets, serving customers across 12+ countries with a commitment to sustainability and quality.</p>
              </div>
              <div class="contact-info">
                <h3>Contact Information</h3>
                <div class="contact-item">
                  <strong>📞 Phone:</strong> +91 8200391265
                </div>
                <div class="contact-item">
                  <strong>📧 Email:</strong> support@destinyglobalimportexport.com
                </div>
                <div class="contact-item">
                  <strong>💬 WhatsApp:</strong> +91 8200391265
                </div>
                <div class="contact-item">
                  <strong>✉️ Sales:</strong> dhairyamehta1905@gmail.com
                </div>
              </div>
              <div class="footer">
                <p>Pioneering sustainable export solutions from India to the world</p>
                <p>&copy; 2025 Destiny Global Import Export. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send emails
    console.log('Sending emails...');
    await transport.sendMail(sellerMailOptions);
    console.log('✅ Seller email sent');
    
    await transport.sendMail(customerMailOptions);
    console.log('✅ Customer email sent');

    res.status(200).json({ 
      success: true, 
      message: 'Enquiry submitted successfully! We will contact you soon.' 
    });

  } catch (error) {
    console.error('❌ Error processing enquiry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process enquiry. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Email service configured`);
  console.log(`🌐 CORS enabled for development`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/enquiry`);
});

module.exports = app;