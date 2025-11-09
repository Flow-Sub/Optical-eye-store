import React from 'react';
import { Eye, Award, Users, Heart, Clock, MapPin, Phone, Mail, Calendar, AlertCircle, User } from 'lucide-react';
import { useTeamMembers } from '../hooks/useTeamMembers';

export function AboutPage() {
  const { teamMembers, loading, error } = useTeamMembers(true); // Only active members

  const values = [
    { icon: Eye, title: 'Vision Excellence', description: 'We use the latest technology for accurate, comfortable vision.' },
    { icon: Heart, title: 'Compassionate Care', description: 'Every patient receives personalized attention and care.' },
    { icon: Award, title: 'Professional Excellence', description: 'Our team is continuously trained to the highest standards.' },
    { icon: Users, title: 'Community Focus', description: 'We build lasting relationships with families in our community.' }
  ];

  const milestones = [
    { year: '1985', event: 'Optieye Care founded by Dr. Robert Smith' },
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
                About Optieye Care
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
                  Optieye Care began in 1985 when Dr. Robert Smith opened a small practice with a simple mission: to provide exceptional eye care with a personal touch.
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

      {/* TEAM - Updated Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dedicated professionals delivering the best eye care</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600 font-light">Loading team...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-light">Failed to load team members</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-light">
              No team members available at the moment
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                  {/* Image */}
                  <div className="relative h-72 bg-gray-100 overflow-hidden">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-20 w-20 text-gray-300" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-light text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-gray-600 mb-2">{member.designation}</p>
                    
                    {member.experience && (
                      <p className="text-sm text-gray-500 mb-4">{member.experience} experience</p>
                    )}

                    {member.specialization && (
                      <div className="space-y-1 mb-4">
                        <p className="text-sm font-light text-gray-900">Specialization:</p>
                        <p className="text-sm text-gray-600">• {member.specialization}</p>
                      </div>
                    )}

                    {member.about && (
                      <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-3">
                        {member.about}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  { Icon: Mail, title: 'Email', lines: ['info@optieyecare.co.uks'] },
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