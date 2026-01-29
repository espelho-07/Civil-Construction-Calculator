import nodemailer from 'nodemailer';
import config from '../config/env.js';

// Create transporter
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

// Email templates
const templates = {
    emailVerification: (name, verificationUrl) => ({
        subject: 'Verify Your Email - Civil Engineering Calculators',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3B68FC, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #3B68FC; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏗️ Civil Engineering Calculators</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>Welcome to Civil Engineering Calculators! Please verify your email address to complete your registration.</p>
                        <p style="text-align: center;">
                            <a href="${verificationUrl}" class="button">Verify Email</a>
                        </p>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
                        <p><strong>This link expires in 24 hours.</strong></p>
                        <p>If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Civil Engineering Calculators. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    passwordReset: (name, resetUrl) => ({
        subject: 'Reset Your Password - Civil Engineering Calculators',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                    .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>We received a request to reset your password. Click the button below to set a new password:</p>
                        <p style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </p>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px;">${resetUrl}</p>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong>
                            <ul>
                                <li>This link expires in 1 hour</li>
                                <li>If you didn't request this, ignore this email</li>
                                <li>Never share this link with anyone</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2024 Civil Engineering Calculators. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    accountLocked: (name, unlockTime) => ({
        subject: 'Account Locked - Civil Engineering Calculators',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>⚠️ Account Security Alert</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>Your account has been temporarily locked due to multiple failed login attempts.</p>
                        <p><strong>Your account will be unlocked at:</strong> ${unlockTime}</p>
                        <p>If this wasn't you, please reset your password immediately after the lockout period ends.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),
};

// Send email function
export async function sendEmail(to, template, data) {
    // Skip if email not configured
    if (!config.email.user || !config.email.pass) {
        console.log('📧 Email skipped (not configured):', template, to);
        return true;
    }

    try {
        const emailContent = templates[template](...data);

        await transporter.sendMail({
            from: config.email.from,
            to,
            subject: emailContent.subject,
            html: emailContent.html,
        });

        console.log('✅ Email sent:', template, to);
        return true;
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        return false;
    }
}

// Verify transporter connection
export async function verifyEmailConnection() {
    if (!config.email.user || !config.email.pass) {
        console.log('📧 Email service not configured');
        return false;
    }

    try {
        await transporter.verify();
        console.log('✅ Email service connected');
        return true;
    } catch (error) {
        console.error('❌ Email service connection failed:', error.message);
        return false;
    }
}
