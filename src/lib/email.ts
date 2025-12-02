/**
 * Email utility for sending notifications
 * 
 * To use this, you'll need to install an email service:
 * 
 * Option 1: Resend (Recommended - Easy setup)
 * npm install resend
 * 
 * Option 2: SendGrid
 * npm install @sendgrid/mail
 * 
 * Option 3: Nodemailer (for SMTP)
 * npm install nodemailer
 * 
 * Then add your API key to .env.local:
 * RESEND_API_KEY=your_key_here
 * or
 * SENDGRID_API_KEY=your_key_here
 */

interface ContractInquiryEmailData {
  firstName: string
  lastName: string
  companyName: string
  workEmail: string
  country?: string
  message?: string
  agreeToCommunications: boolean
  submittedAt: string
}

export function generateContractInquiryEmailTemplate(data: ContractInquiryEmailData): string {
  const { firstName, lastName, companyName, workEmail, country, message, agreeToCommunications, submittedAt } = data
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #262262; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #262262; }
          .value { margin-top: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contract Publishing Inquiry</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${firstName} ${lastName}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${companyName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${workEmail}">${workEmail}</a></div>
            </div>
            ${country ? `
            <div class="field">
              <div class="label">Country/Region:</div>
              <div class="value">${country}</div>
            </div>
            ` : ''}
            ${message ? `
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Agreed to Communications:</div>
              <div class="value">${agreeToCommunications ? 'Yes' : 'No'}</div>
            </div>
            <div class="field">
              <div class="label">Submitted At:</div>
              <div class="value">${new Date(submittedAt).toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>This inquiry has been saved to Sanity CMS and can be managed from the admin panel.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Example implementation with Resend
 * Uncomment and configure when ready
 */
/*
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContractInquiryEmail(data: ContractInquiryEmailData) {
  try {
    await resend.emails.send({
      from: 'Finance Abu Dhabi <noreply@financeabudhabi.com>',
      to: 'marcom@radcommgroup.com',
      subject: `New Contract Publishing Inquiry from ${data.firstName} ${data.lastName}`,
      html: generateContractInquiryEmailTemplate(data),
      replyTo: data.workEmail,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
*/

