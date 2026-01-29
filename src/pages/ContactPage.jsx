import { Link } from 'react-router-dom';

export default function ContactPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-r from-blue-50/80 via-yellow-50/50 to-orange-50/60">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute top-20 right-[30%] w-64 h-64 bg-yellow-200 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full blur-[100px] opacity-40"></div>

            {/* Hero Section */}
            <div className="relative z-10 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-2">
                                Contact Us
                            </h1>
                            <p className="text-xl text-[#3B68FC] font-semibold mb-4">Darshan University</p>
                            <p className="text-[#6b7280] max-w-md">
                                Get in touch with Department of Civil Engineering, ASWDC, or Darshan University for any queries.
                            </p>
                        </div>
                        {/* Icon card */}
                        <div className="w-24 h-40 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-2xl flex flex-col items-center justify-center p-3 shadow-xl">
                            <i className="fas fa-envelope text-white text-xl mb-2"></i>
                            <i className="fas fa-phone text-white text-xl mb-2"></i>
                            <i className="fas fa-map-marker-alt text-white text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
                {/* Three Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    {/* Department of Civil Engineering */}
                    <a href="https://darshan.ac.in/engineering/civil/about" target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb]">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i className="fas fa-hard-hat text-white"></i>
                            </div>
                            <h2 className="font-bold text-[#0A0A0A]">Dept. of Civil Engineering</h2>
                        </div>
                        <div className="p-5">
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                                <img src="/images/civil-engineering-logo.png" alt="Department of Civil Engineering" className="h-20 object-contain" />
                            </div>
                            {/* Contact Persons */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-xl">
                                    <i className="fas fa-user text-[#3B68FC]"></i>
                                    <div>
                                        <p className="font-medium text-[#0A0A0A] text-sm">Prof. Manish Sanghani</p>
                                        <p className="text-xs text-[#6b7280]">+91-9824451162</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-xl">
                                    <i className="fas fa-user-tie text-[#3B68FC]"></i>
                                    <div>
                                        <p className="font-medium text-[#0A0A0A] text-sm">Dr. Ujjval Solanki</p>
                                        <p className="text-xs text-[#6b7280]">+91-9924100758</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-[#6b7280] leading-relaxed">
                                Real engineering means: <span className="font-semibold text-[#0A0A0A]">Institute Knowledge with Industrial Experience.</span>
                            </p>
                            <p className="text-xs text-[#3B68FC] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-external-link-alt mr-1"></i>darshan.ac.in/engineering/civil
                            </p>
                        </div>
                    </a>

                    {/* ASWDC */}
                    <a href="https://www.aswdc.in" target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb]">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i className="fas fa-laptop-code text-white"></i>
                            </div>
                            <div>
                                <h2 className="font-bold text-[#0A0A0A]">ASWDC</h2>
                                <p className="text-xs text-[#6b7280]">Apps, Software & Website Dev</p>
                            </div>
                        </div>
                        <div className="p-5">
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                                <img src="/images/aswdc-logo.png" alt="ASWDC" className="h-20 object-contain" />
                            </div>
                            {/* Contact Person */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-xl">
                                    <i className="fas fa-user-tie text-[#3B68FC]"></i>
                                    <div>
                                        <p className="font-medium text-[#0A0A0A] text-sm">Dr. Pradyumansinh Jadeja</p>
                                        <p className="text-xs text-[#6b7280]">+91-9879461848</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-[#6b7280] leading-relaxed">
                                Students work on <span className="font-semibold text-[#0A0A0A]">live projects</span> under guidance of staff and industry experts.
                            </p>
                            <p className="text-xs text-[#3B68FC] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-external-link-alt mr-1"></i>www.aswdc.in
                            </p>
                        </div>
                    </a>

                    {/* Darshan University */}
                    <a href="https://www.darshan.ac.in" target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb]">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i className="fas fa-university text-white"></i>
                            </div>
                            <div>
                                <h2 className="font-bold text-[#0A0A0A]">Darshan University</h2>
                                <p className="text-xs text-[#6b7280]">Est. 2009 • Rajkot, Gujarat</p>
                            </div>
                        </div>
                        <div className="p-5">
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                                <img src="/images/darshan-university-logo.png" alt="Darshan University" className="h-20 object-contain" />
                            </div>
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="p-3 bg-[#f8f9fa] rounded-xl text-center">
                                    <p className="text-xl font-bold text-[#3B68FC]">15+</p>
                                    <p className="text-[10px] text-[#6b7280]">Years of Excellence</p>
                                </div>
                                <div className="p-3 bg-[#f8f9fa] rounded-xl text-center">
                                    <p className="text-xl font-bold text-[#3B68FC]">19km</p>
                                    <p className="text-[10px] text-[#6b7280]">From Rajkot City</p>
                                </div>
                            </div>
                            <p className="text-xs text-[#6b7280] leading-relaxed">
                                Programs in <span className="font-semibold text-[#0A0A0A]">Engineering, Science & Technology</span>.
                            </p>
                            <p className="text-xs text-[#3B68FC] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-external-link-alt mr-1"></i>darshan.ac.in
                            </p>
                        </div>
                    </a>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Address */}
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=Darshan+University+Rajkot+Morbi+Highway"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i className="fas fa-map-marker-alt text-xl text-white"></i>
                        </div>
                        <h3 className="font-bold text-[#0A0A0A] mb-2">ADDRESS</h3>
                        <p className="text-sm text-[#6b7280]">Darshan University</p>
                        <p className="text-sm text-[#6b7280]">Rajkot - Morbi Highway</p>
                        <p className="text-sm text-[#3B68FC] font-medium">Rajkot - 363650</p>
                        <p className="text-xs text-[#3B68FC] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fas fa-external-link-alt mr-1"></i>Open in Google Maps
                        </p>
                    </a>

                    {/* Phone */}
                    <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl p-6 text-center hover:shadow-lg transition-all">
                        <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-xl flex items-center justify-center">
                            <i className="fas fa-phone-alt text-xl text-white"></i>
                        </div>
                        <h3 className="font-bold text-[#0A0A0A] mb-2">PHONE</h3>
                        <a href="tel:+919879461848" className="text-sm text-[#3B68FC] font-medium hover:underline block">(+91) 9879461848</a>
                    </div>

                    {/* Email */}
                    <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl p-6 text-center hover:shadow-lg transition-all">
                        <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-xl flex items-center justify-center">
                            <i className="fas fa-envelope text-xl text-white"></i>
                        </div>
                        <h3 className="font-bold text-[#0A0A0A] mb-2">EMAIL</h3>
                        <a href="mailto:aswdc@darshan.ac.in" className="text-sm text-[#3B68FC] font-medium hover:underline block">aswdc@darshan.ac.in</a>
                    </div>
                </div>
            </div>

            {/* Bottom Logos Bar */}
            <div className="relative z-10 bg-white/50 border-t border-[#e5e7eb] py-6">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-10 flex-wrap">
                        {/* ASWDC Logo */}
                        <a href="https://www.aswdc.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <img src="/images/aswdc-logo.png" alt="ASWDC" className="h-12 object-contain" />
                        </a>

                        {/* Department Logo */}
                        <a href="https://darshan.ac.in/engineering/civil/about" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <img src="/images/civil-engineering-logo.png" alt="Civil Engineering" className="h-12 object-contain" />
                        </a>

                        {/* DU Logo */}
                        <a href="https://www.darshan.ac.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <img src="/images/darshan-university-logo.png" alt="Darshan University" className="h-12 object-contain" />
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
