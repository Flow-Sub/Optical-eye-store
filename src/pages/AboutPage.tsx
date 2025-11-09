import React from 'react';
import { Eye, Award, Users, Heart, Clock, MapPin, Phone, Mail, Calendar, AlertCircle, User, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useTeamMembers } from '../hooks/useTeamMembers';

export function AboutPage() {
  const { teamMembers, loading, error } = useTeamMembers(true);

  const values = [
    { icon: Eye, title: 'Vision Excellence', description: 'Latest technology for accurate, comfortable vision.' },
    { icon: Heart, title: 'Compassionate Care', description: 'Personalized attention for every patient.' },
    { icon: Award, title: 'Professional Excellence', description: 'Continuously trained to highest standards.' },
    { icon: Users, title: 'Community Focus', description: 'Building lasting family relationships.' }
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO - MASSIVE BOLD TEXT ON BLACK */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-light tracking-wider uppercase">Est. 1985</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-none">
              We See
              <br />
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                Your Vision
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              For nearly four decades, we've been your trusted partner in eye care, 
              combining traditional values with modern technology.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'Years of Service', value: '39+' },
                { label: 'Happy Customers', value: '15K+' },
                { label: 'Expert Team', value: '12+' },
                { label: 'Awards Won', value: '8+' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VALUES - WHITE SECTION WITH BLACK CARDS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-black text-white rounded-full px-4 py-2 mb-6">
              <Heart className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Core Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div 
                key={i} 
                className="group bg-black text-white p-8 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                  <v.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">{v.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TEAM - DARK WITH BOLD HEADING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Expert Team</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Meet The
              <br />
              <span className="bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent">
                Visionaries
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Dedicated professionals delivering the best eye care
            </p>
          </div>

          {/* Team Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-400">Loading team...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-400">Failed to load team members</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No team members available
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <div 
                  key={i} 
                  className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative h-80 bg-gray-800 overflow-hidden">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-24 w-24 text-gray-600" />
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Name on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gray-300">{member.designation}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {member.experience && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{member.experience} experience</span>
                      </div>
                    )}

                    {member.specialization && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Specialization:</p>
                        <p className="text-white font-medium">• {member.specialization}</p>
                      </div>
                    )}

                    {member.about && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CONTACT - SPLIT SECTION (BLACK LEFT, WHITE RIGHT) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Left - Black Background */}
          <div className="bg-black text-white p-12 lg:p-20">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-8">
              <MapPin className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Get in Touch</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Visit Our
              <br />
              <span className="text-gray-400">Modern Facility</span>
            </h2>

            <p className="text-gray-300 text-lg mb-12 leading-relaxed">
              Equipped with the latest eye care technology, we'd love to meet you in person.
            </p>

            <div className="space-y-8">
              {[
                { Icon: MapPin, title: 'Address', lines: ['123 Vision Street', 'City, State 12345'] },
                { Icon: Phone, title: 'Phone', lines: ['(555) 123-4567'] },
                { Icon: Mail, title: 'Email', lines: ['info@optieyecare.co.uk'] },
                { Icon: Clock, title: 'Hours', lines: ['Mon–Fri: 9AM–7PM', 'Sat: 9AM–6PM', 'Sun: 11AM–5PM'] }
              ].map((c, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <c.Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{c.title}</h3>
                    {c.lines.map((l, j) => <p key={j} className="text-gray-400">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - White Background */}
          <div className="bg-white p-12 lg:p-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              What Makes Us Different
            </h3>

            <div className="space-y-6">
              {[
                'State-of-the-art diagnostic equipment',
                'Extensive designer & budget frame selection',
                'On-site lens lab – fast turnaround',
                'Comprehensive insurance & payment options',
                'Lifetime frame adjustments & cleaning'
              ].map((t, i) => (
                <div key={i} className="flex items-start space-x-4 group">
                  <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700 text-lg pt-1">{t}</p>
                </div>
              ))}
            </div>

            <button className="mt-12 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-900 transition-all hover:scale-105 inline-flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA - FULL BLACK */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-black text-white py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to See
            <br />
            <span className="bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent">
              Clearly?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Schedule your comprehensive eye exam today
          </p>
          <button className="bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-110 inline-flex items-center space-x-3">
            <span>Book Now</span>
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>
    </div>
  );
}