import React from 'react';
import { Eye, Award, Users, Heart, Clock, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export function AboutPage() {
  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Lead Optometrist', experience: '15+ years', specialties: ['Comprehensive Eye Care', 'Contact Lens Fitting', 'Pediatric Optometry'], image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Dr. Michael Chen', role: 'Senior Optometrist', experience: '12+ years', specialties: ['Glaucoma Management', 'Diabetic Eye Care', 'Low Vision Rehabilitation'], image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Emily Rodriguez', role: 'Optical Manager', experience: '8+ years', specialties: ['Frame Styling', 'Lens Technology', 'Customer Service'], image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=600' }
  ];

  const values = [
    { icon: Eye, title: 'Vision Excellence', description: 'We use the latest technology for accurate, comfortable vision.' },
    { icon: Heart, title: 'Compassionate Care', description: 'Every patient receives personalized attention and care.' },
    { icon: Award, title: 'Professional Excellence', description: 'Our team is continuously trained to the highest standards.' },
    { icon: Users, title: 'Community Focus', description: 'We build lasting relationships with families in our community.' }
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
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-6">
                About OpticalStore
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                For nearly four decades, we've been your trusted partner in eye care, combining traditional values with modern technology.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">39+</div>
                  <div className="text-gray-600 text-sm">Years of Service</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">15,000+</div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Eye examination"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  OpticalStore began in 1985 when Dr. Robert Smith opened a small practice with a simple mission: to provide exceptional eye care with a personal touch.
                </p>
                <p>
                  Over the years, we've embraced new technologies and expanded our services, but our core values remain unchanged.
                </p>
                <p>
                  Today, our team continues Dr. Smith's legacy, combining decades of experience with the latest advances in eye care.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-light text-gray-900 mb-6">Our Journey</h3>
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-light">
                      {m.year}
                    </div>
                    <p className="text-gray-700">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">These principles guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <v.icon className="h-7 w-7 text-gray-700" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dedicated professionals delivering the best eye care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-light text-gray-900 mb-1">{m.name}</h3>
                  <p className="text-gray-600 mb-2">{m.role}</p>
                  <p className="text-sm text-gray-500 mb-4">{m.experience} experience</p>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-gray-900">Specialties:</p>
                    {m.specialties.map((s, idx) => (
                      <p key={idx} className="text-sm text-gray-600">• {s}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Visit Our Store</h2>
              <p className="text-gray-600 mb-8">
                We'd love to meet you in person. Our modern facility is equipped with the latest eye care technology.
              </p>
              <div className="space-y-6">
                {[
                  { Icon: MapPin, title: 'Address', lines: ['123 Vision Street', 'City, State 12345'] },
                  { Icon: Phone, title: 'Phone', lines: ['(555) 123-4567'] },
                  { Icon: Mail, title: 'Email', lines: ['info@opticalstore.com'] },
                  { Icon: Clock, title: 'Hours', lines: ['Mon–Fri: 9AM–7PM', 'Sat: 9AM–6PM', 'Sun: 11AM–5PM'] }
                ].map((c, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <c.Icon className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-light text-gray-900 mb-1">{c.title}</h3>
                      {c.lines.map((l, j) => <p key={j} className="text-gray-600">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-light text-gray-900 mb-6">What Makes Us Different</h3>
              {[
                'State-of-the-art diagnostic equipment',
                'Extensive selection of designer & budget frames',
                'On-site lens lab – fast turnaround',
                'Comprehensive insurance & payment options',
                'Lifetime frame adjustments & cleaning'
              ].map((t, i) => (
                <div key={i} className="flex items-start space-x-3 mb-4">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}