import React from 'react';
import { Eye, Award, Users, Heart, Clock, MapPin, Phone, Mail } from 'lucide-react';

export function AboutPage() {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Lead Optometrist',
      experience: '15+ years',
      specialties: ['Comprehensive Eye Care', 'Contact Lens Fitting', 'Pediatric Optometry'],
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Senior Optometrist',
      experience: '12+ years',
      specialties: ['Glaucoma Management', 'Diabetic Eye Care', 'Low Vision Rehabilitation'],
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Optical Manager',
      experience: '8+ years',
      specialties: ['Frame Styling', 'Lens Technology', 'Customer Service'],
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const values = [
    {
      icon: Eye,
      title: 'Vision Excellence',
      description: 'We are committed to providing the highest quality eye care using the latest technology and techniques.'
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Every patient receives personalized attention and care tailored to their unique needs and lifestyle.'
    },
    {
      icon: Award,
      title: 'Professional Excellence',
      description: 'Our team maintains the highest professional standards through continuous education and training.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We are proud to serve our community and build lasting relationships with our patients and their families.'
    }
  ];

  const milestones = [
    { year: '1985', event: 'OpticalStore founded by Dr. Robert Smith' },
    { year: '1992', event: 'Expanded to include contact lens services' },
    { year: '2001', event: 'Introduced digital eye examination technology' },
    { year: '2010', event: 'Added pediatric eye care specialization' },
    { year: '2018', event: 'Launched online shopping platform' },
    { year: '2024', event: 'Celebrating 39 years of exceptional eye care' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">About OpticalStore</h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                For nearly four decades, we've been your trusted partner in eye care, 
                combining traditional values with modern technology to deliver exceptional 
                vision solutions for our community.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">39+</div>
                  <div className="text-blue-200">Years of Service</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">15,000+</div>
                  <div className="text-blue-200">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Eye examination"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  OpticalStore began in 1985 when Dr. Robert Smith opened a small practice 
                  with a simple mission: to provide exceptional eye care with a personal touch. 
                  What started as a one-doctor office has grown into a comprehensive eye care 
                  center serving thousands of families in our community.
                </p>
                <p>
                  Over the years, we've embraced new technologies and expanded our services, 
                  but our core values remain unchanged. We believe that quality eye care should 
                  be accessible, affordable, and delivered with genuine care and attention.
                </p>
                <p>
                  Today, our team of experienced optometrists and eye care professionals 
                  continues Dr. Smith's legacy, combining decades of experience with the 
                  latest advances in eye care technology.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Our Journey</h3>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {milestone.year}
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape the experience we provide to every patient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are dedicated to providing you with the best possible eye care experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.experience} experience</p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties:</h4>
                    <div className="space-y-1">
                      {member.specialties.map((specialty, idx) => (
                        <div key={idx} className="text-sm text-gray-600">• {specialty}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Visit Our Store</h2>
              <p className="text-xl text-gray-300 mb-8">
                We'd love to meet you in person! Visit our modern facility equipped with 
                the latest eye care technology in a comfortable, welcoming environment.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Address</h3>
                    <p className="text-gray-300">123 Vision Street<br />City, State 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Phone</h3>
                    <p className="text-gray-300">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-300">info@opticalstore.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Hours</h3>
                    <div className="text-gray-300 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 11:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6">What Makes Us Different</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">State-of-the-art diagnostic equipment for accurate assessments</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Extensive selection of designer and budget-friendly frames</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">On-site lens laboratory for quick turnaround times</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Comprehensive insurance acceptance and flexible payment options</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Lifetime frame adjustments and cleaning services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}