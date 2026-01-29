export default function TermsOfUsePage() {
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
                        <i className="fas fa-file-contract text-[#3B68FC]"></i>
                        <span className="text-sm text-[#6b7280]">Legal</span>
                    </div>
                    <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2">Terms of Use</h1>
                    <p className="text-[#6b7280]">Last updated: January 2024</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
                <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl p-8 space-y-8">

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-check-circle text-[#3B68FC]"></i>
                            Acceptance of Terms
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            By accessing and using Civil Engineering Calculators website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Use of Calculators
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed mb-3">
                            Our calculators are provided for educational and reference purposes only. While we strive for accuracy:
                        </p>
                        <ul className="list-disc list-inside text-[#6b7280] space-y-2 ml-4">
                            <li>Results should be verified by qualified professionals</li>
                            <li>We are not liable for any errors or damages resulting from calculator use</li>
                            <li>Calculations are estimates and may vary based on local conditions</li>
                            <li>Always consult with licensed engineers for critical projects</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-copyright text-[#3B68FC]"></i>
                            Intellectual Property
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            All content on this website, including calculators, formulas, text, graphics, and logos, is the property of Civil Engineering Calculators and ASWDC, Darshan University. Unauthorized reproduction or distribution is prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-user-shield text-[#3B68FC]"></i>
                            User Responsibilities
                        </h2>
                        <ul className="list-disc list-inside text-[#6b7280] space-y-2 ml-4">
                            <li>Use the website lawfully and responsibly</li>
                            <li>Do not attempt to hack, disrupt, or damage the website</li>
                            <li>Do not use automated systems to access the website excessively</li>
                            <li>Respect intellectual property rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-[#3B68FC]"></i>
                            Disclaimer
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            This website is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any calculations or information provided. Use at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                            <i className="fas fa-edit text-[#3B68FC]"></i>
                            Changes to Terms
                        </h2>
                        <p className="text-[#6b7280] leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-[#e5e7eb]">
                        <p className="text-sm text-[#6b7280] text-center">
                            For questions about these terms, contact us at <a href="mailto:aswdc@darshan.ac.in" className="text-[#3B68FC] hover:underline">aswdc@darshan.ac.in</a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
