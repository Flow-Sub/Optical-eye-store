import { Award, Eye, Users, Shield } from 'lucide-react';

export const WHY_CHOOSE_US = [
  { 
    icon: Award, 
    title: 'Expert Optometrists', 
    description: 'Licensed professionals with years of experience.' 
  },
  { 
    icon: Eye, 
    title: 'Advanced Technology', 
    description: 'State-of-the-art diagnostic equipment.' 
  },
  { 
    icon: Users, 
    title: 'Personalized Care', 
    description: 'Tailored solutions for your unique needs.' 
  },
  { 
    icon: Shield, 
    title: 'Quality Guarantee', 
    description: 'Satisfaction guaranteed on all services.' 
  }
] as const;

export const FAQ_ITEMS = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment by visiting our booking page, calling any of our three clinics directly, or visiting us in person. We recommend booking online for the fastest service and to see real-time availability.'
  },
  {
    question: 'What should I bring to my appointment?',
    answer: 'Please bring your current glasses or contact lenses, any previous prescriptions, a list of current medications, your NHS card or insurance details, and a form of ID. If you\'re having an eye test, avoid wearing contact lenses for at least 2 hours before your appointment.'
  },
  {
    question: 'How long does an eye examination take?',
    answer: 'A comprehensive eye examination typically takes 30-45 minutes. This includes time for preliminary tests, the main examination, and discussing your results. If you\'re also selecting frames or discussing contact lenses, allow an additional 15-30 minutes.'
  },
  {
    question: 'Do you accept NHS and private insurance?',
    answer: 'Yes, we accept NHS vouchers and work with most major private insurance providers. We\'re happy to help you understand your coverage and can provide receipts for insurance claims. Please bring your insurance details to your appointment.'
  },
  {
    question: 'How often should I have an eye test?',
    answer: 'We recommend annual eye tests for most adults. If you\'re over 60, have diabetes, a family history of glaucoma, or other risk factors, you may need more frequent examinations. Children should have their eyes tested regularly, typically every 1-2 years.'
  },
  {
    question: 'Can you help with emergency eye problems?',
    answer: 'Yes, we offer emergency eye care services during business hours. For urgent issues like sudden vision loss, eye injuries, or severe pain, please call us immediately. For after-hours emergencies, we can advise you on the best course of action or direct you to appropriate emergency services.'
  },
  {
    question: 'Do you offer home visits or mobile services?',
    answer: 'We can arrange home visits for patients who are unable to visit our clinics due to mobility issues or health conditions. Please contact us to discuss your specific needs and arrange a convenient time. Additional charges may apply for home visits.'
  },
  {
    question: 'What makes Optieye Care different from other opticians?',
    answer: 'We\'re clinically led by a consultant ophthalmologist and focus on building long-term relationships with our patients. Our bespoke approach means we take time to understand your individual needs, lifestyle, and preferences. We also offer advanced technology like the iWellness OCT scan and welcome you to drop in for a chat and cup of tea anytime.'
  }
] as const;

export const DEFAULT_SERVICE_IMAGE = 'https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=600';

export const BOOKING_STEPS = {
  LOCATION: 'location',
  SERVICE: 'service',
  CALENDLY: 'calendly'
} as const;

export const CALENDLY_CONFIG = {
  scriptUrl: 'https://assets.calendly.com/assets/external/widget.js',
  cssUrl: 'https://assets.calendly.com/assets/external/widget.css'
} as const;

