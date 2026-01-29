import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            {/* Hero Section with Gradient Blobs */}
            <section className="relative py-20 px-6 overflow-hidden">
                {/* Gradient Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-[600px] h-[600px] bg-blue-200/70 rounded-full blur-[120px] -top-32 -left-40"></div>
                    <div className="absolute w-[500px] h-[500px] bg-yellow-200/70 rounded-full blur-[120px] top-0 right-[10%]"></div>
                    <div className="absolute w-[400px] h-[400px] bg-orange-200/60 rounded-full blur-[100px] top-20 -right-20"></div>
                    <div className="absolute w-[300px] h-[300px] bg-pink-200/50 rounded-full blur-[80px] bottom-0 right-[30%]"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(59,104,252,0.3)]">
                        <i className="fas fa-building text-3xl text-white"></i>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-4">
                        Civil Engineering<br /><span className="text-[#3B68FC]">Calculator</span>
                    </h1>
                    <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">
                        Your trusted companion for all civil engineering calculations
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-6 bg-white rounded-t-[40px] -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    {/* About Card */}
                    <div className="bg-[#f8f9fa] rounded-2xl p-8 md:p-12 mb-8 border border-[#e5e7eb]">
                        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6 flex items-center gap-3">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            About Us
                        </h2>

                        <div className="text-[#0A0A0A] leading-relaxed space-y-5">
                            <p>
                                Mathematics equations play a vital role for Civil Engineers to study various prospects such as <strong>cost factor</strong>, <strong>blending of aggregates</strong>, <strong>sieve analysis</strong>, <strong>soil test</strong>, and <strong>environmental engineering tests</strong>. A simple Civil Engineering Calculator tool is a collection of Civil Engineering calculations for Civil Engineers and Students to calculate different types of civil-related units which are of utmost importance before implementing any project.
                            </p>

                            <p>
                                The planning phase of the project and the financial budget allocation is purely based on mathematics of several factors. <strong>Concrete technology</strong> allows the construction of structures that would last for decades, if not centuries. Thus the lifespan of a building is completely based on the type of concrete technology used.
                            </p>

                            <p>
                                The entire weight of the structure is to be held by the soil. <strong>Soil testing</strong> is the first and most prior step for any good reputed construction company. Many factors are considered in soil testing such as <strong>liquid limit of soil</strong>, <strong>water content determination</strong>, <strong>sieve analysis of soil</strong>, and many other factors.
                            </p>

                            <p>
                                <strong>Sieve analysis of aggregate</strong> plays an important role in determining particle size. Large samples of aggregate are necessary to ensure that aggregates perform as intended for their specified use.
                            </p>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 border border-[#3B68FC]/20 rounded-2xl p-8 mb-8">
                        <h2 className="text-xl font-bold text-[#3B68FC] mb-4 flex items-center gap-2">
                            <i className="fas fa-star"></i>
                            Why Choose Us?
                        </h2>
                        <p className="text-[#0A0A0A] leading-relaxed">
                            With Construction Calculators you could do tedious tasks simply in a few clicks. Our calculator is <strong>fast</strong>, <strong>accurate</strong>, <strong>user-friendly</strong>, and <strong>free to use</strong>. Along with the description of each test, it becomes easy to understand for beginners as well.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                            { icon: 'fa-bolt', title: 'Fast & Accurate', desc: 'Get instant results with precise calculations' },
                            { icon: 'fa-user-friends', title: 'User Friendly', desc: 'Simple interface designed for everyone' },
                            { icon: 'fa-gift', title: 'Free to Use', desc: 'All calculators available at no cost' },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl p-6 text-center hover:shadow-lg hover:border-[#3B68FC] transition-all">
                                <div className="w-14 h-14 mx-auto mb-4 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
                                    <i className={`fas ${feature.icon} text-2xl text-[#3B68FC]`}></i>
                                </div>
                                <h3 className="font-bold text-[#0A0A0A] mb-2">{feature.title}</h3>
                                <p className="text-sm text-[#6b7280]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Categories We Cover */}
                    <div className="bg-[#f8f9fa] rounded-2xl p-8 md:p-12 mb-8 border border-[#e5e7eb]">
                        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6 flex items-center gap-3">
                            <i className="fas fa-th-large text-[#3B68FC]"></i>
                            Categories We Cover
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: 'Structural Analysis', icon: 'fa-building' },
                                { name: 'Concrete Design', icon: 'fa-cubes' },
                                { name: 'Soil Testing', icon: 'fa-mountain' },
                                { name: 'Hydraulics', icon: 'fa-water' },
                                { name: 'Surveying', icon: 'fa-compass' },
                                { name: 'Steel Design', icon: 'fa-drafting-compass' },
                                { name: 'Foundation', icon: 'fa-layer-group' },
                                { name: 'Construction', icon: 'fa-hard-hat' },
                            ].map((cat) => (
                                <div key={cat.name} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#3B68FC] transition-all">
                                    <i className={`fas ${cat.icon} text-[#3B68FC]`}></i>
                                    <span className="text-sm font-medium text-[#0A0A0A]">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center">
                        {/* CTA Background Blobs */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute w-[300px] h-[300px] bg-blue-300/50 rounded-full blur-[80px] -top-20 -left-20"></div>
                            <div className="absolute w-[250px] h-[250px] bg-indigo-300/50 rounded-full blur-[80px] -bottom-10 -right-10"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">Ready to Calculate?</h2>
                            <p className="text-[#6b7280] mb-6">Start using our free civil engineering calculators today!</p>
                            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-[#3B68FC] text-white font-semibold rounded-xl hover:bg-[#2a4add] hover:shadow-lg transition-all">
                                <i className="fas fa-calculator"></i>
                                Explore Calculators
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
