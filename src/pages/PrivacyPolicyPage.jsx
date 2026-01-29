export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-r from-blue-50/80 via-yellow-50/50 to-orange-50/60">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute top-20 right-[30%] w-64 h-64 bg-yellow-200 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full blur-[100px] opacity-40"></div>

            {/* Hero */}
            <div className="relative z-10 py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-[#e5e7eb] rounded-full mb-6">
                        <i className="fas fa-shield-alt text-[#3B68FC]"></i>
                        <span className="text-sm text-[#6b7280]">Legal</span>
                    </div>
                    <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2">Privacy Policy</h1>
                    <p className="text-[#6b7280]">Last updated: January 2024</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
                <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl p-8 space-y-8">

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            Introduction
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            Civil Engineering Calculators, developed by ASWDC at Darshan University, respects your privacy. This policy explains how we collect, use, and protect your information when you use our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-database text-[#3B68FC]"></i>
                            Information We Collect
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed mb-3">We may collect the following types of information:</p>
                        <ul className="list-disc list-inside text-[#6b7280] space-y-2 ml-4">
                            <li><strong className="text-[#0A0A0A]">Usage Data:</strong> Pages visited, time spent, calculator usage patterns</li>
                            <li><strong className="text-[#0A0A0A]">Device Information:</strong> Browser type, operating system, screen resolution</li>
                            <li><strong className="text-[#0A0A0A]">Cookies:</strong> Small files stored on your device for improved experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-cogs text-[#3B68FC]"></i>
                            How We Use Information
                        </h2>
                        <ul className="list-disc list-inside text-[#6b7280] space-y-2 ml-4">
                            <li>To improve our calculators and website functionality</li>
                            <li>To analyze usage patterns and optimize performance</li>
                            <li>To fix bugs and technical issues</li>
                            <li>To develop new features based on user needs</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-cookie text-[#3B68FC]"></i>
                            Cookies
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            We use cookies to enhance your browsing experience. You can disable cookies in your browser settings, but some features may not work properly. We use both session cookies (deleted when you close browser) and persistent cookies (remain for a set period).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-share-alt text-[#3B68FC]"></i>
                            Third-Party Services
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            We may use third-party services like Google Analytics for website analytics. These services have their own privacy policies. We do not sell or share your personal information with third parties for marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-lock text-[#3B68FC]"></i>
                            Data Security
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-user-check text-[#3B68FC]"></i>
                            Your Rights
                        </h2>
                        <ul className="list-disc list-inside text-[#6b7280] space-y-2 ml-4">
                            <li>Access the information we have about you</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of cookies and tracking</li>
                            <li>Contact us with privacy concerns</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-child text-[#3B68FC]"></i>
                            Children's Privacy
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            Our website is not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-[#e5e7eb]">
                        <p className="text-sm text-[#6b7280] text-center">
                            For privacy questions, contact us at <a href="mailto:aswdc@darshan.ac.in" className="text-[#3B68FC] hover:underline">aswdc@darshan.ac.in</a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
