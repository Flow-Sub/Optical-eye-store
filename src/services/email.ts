interface AppointmentEmailData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  store_location: string;
  store_phone: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
}

export const sendAppointmentEmail = async (data: AppointmentEmailData): Promise<boolean> => {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '568d3b0c-8449-48ec-b065-7f9674686c51',
        subject: `✅ Appointment Confirmed - ${data.appointment_date}`,
        from_name: 'Optieye Care',
        from_email: 'eyeoptical007@gmail.com',
        to_email: data.customer_email,
        message: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👓 APPOINTMENT CONFIRMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi ${data.customer_name},

Your eye care appointment has been confirmed! 

📅 APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${data.customer_name}
📧 Email: ${data.customer_email}
📞 Phone: ${data.customer_phone}

📍 Location: ${data.store_location}
🏥 Service: ${data.service_type}

📅 Date: ${data.appointment_date}
⏰ Time: ${data.appointment_time}

📝 Notes: ${data.notes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 BEFORE YOUR APPOINTMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Bring your current glasses/contacts
✓ List any medications you're taking  
✓ Arrive 10 minutes early
✓ Bring insurance card (if applicable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED TO RESCHEDULE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 Call: ${data.store_phone}
📧 Email: eyeoptical007@gmail.com

We look forward to seeing you! 👋

Best regards,
The Optieye Care Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2024 Optieye Care. All rights reserved.
        `.trim()
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Email sent successfully:', result);
      return true;
    } else {
      console.error('❌ Email failed:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};