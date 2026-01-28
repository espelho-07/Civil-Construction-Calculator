import { Link, useParams } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

const categoryData = {
    biology: {
        name: 'Biology', icon: 'fa-dna', color: 'text-[#1ABC9C]',
        calculators: [
            { name: 'BMI Calculator', slug: '/bmi', icon: 'fa-weight', desc: 'Calculate your Body Mass Index' },
            { name: 'Calorie Calculator', slug: '#', icon: 'fa-fire', desc: 'Find your daily calorie needs' },
            { name: 'Ideal Weight Calculator', slug: '#', icon: 'fa-balance-scale', desc: 'Find your ideal body weight' },
            { name: 'Body Fat Calculator', slug: '#', icon: 'fa-percentage', desc: 'Estimate your body fat percentage' },
            { name: 'Pregnancy Calculator', slug: '#', icon: 'fa-baby', desc: 'Track your pregnancy timeline' },
            { name: 'Ovulation Calculator', slug: '#', icon: 'fa-calendar-alt', desc: 'Predict your fertile days' },
        ]
    },
    math: {
        name: 'Math', icon: 'fa-square-root-alt', color: 'text-[#3B68FC]',
        calculators: [
            { name: 'Percentage Calculator', slug: '/percentage', icon: 'fa-percent', desc: 'Calculate percentages easily' },
            { name: 'Fraction Calculator', slug: '#', icon: 'fa-divide', desc: 'Add, subtract, multiply fractions' },
            { name: 'Scientific Calculator', slug: '#', icon: 'fa-calculator', desc: 'Advanced scientific functions' },
            { name: 'Average Calculator', slug: '#', icon: 'fa-chart-bar', desc: 'Calculate mean, median, mode' },
            { name: 'Square Root Calculator', slug: '#', icon: 'fa-square', desc: 'Find square roots instantly' },
        ]
    },
    'everyday-life': {
        name: 'Everyday life', icon: 'fa-sun', color: 'text-[#F59E0B]',
        calculators: [
            { name: 'Age Calculator', slug: '/age', icon: 'fa-birthday-cake', desc: 'Calculate your exact age' },
            { name: 'Tip Calculator', slug: '#', icon: 'fa-hand-holding-usd', desc: 'Calculate tips and split bills' },
            { name: 'Time Calculator', slug: '#', icon: 'fa-clock', desc: 'Add or subtract time' },
            { name: 'Sleep Calculator', slug: '#', icon: 'fa-bed', desc: 'Optimize your sleep schedule' },
            { name: 'Date Calculator', slug: '#', icon: 'fa-calendar', desc: 'Find days between dates' },
        ]
    },
    finance: {
        name: 'Finance', icon: 'fa-chart-line', color: 'text-emerald-500',
        calculators: [
            { name: 'Loan Calculator', slug: '#', icon: 'fa-hand-holding-usd', desc: 'Calculate loan payments' },
            { name: 'EMI Calculator', slug: '#', icon: 'fa-credit-card', desc: 'Monthly installment calculator' },
            { name: 'Interest Calculator', slug: '#', icon: 'fa-percentage', desc: 'Simple & compound interest' },
            { name: 'SIP Calculator', slug: '#', icon: 'fa-piggy-bank', desc: 'Systematic investment plan' },
        ]
    },
    health: {
        name: 'Health', icon: 'fa-heartbeat', color: 'text-pink-500',
        calculators: [
            { name: 'Heart Rate Calculator', slug: '#', icon: 'fa-heartbeat', desc: 'Calculate target heart rate' },
            { name: 'Blood Pressure', slug: '#', icon: 'fa-tint', desc: 'Monitor blood pressure' },
            { name: 'Water Intake Calculator', slug: '#', icon: 'fa-glass-water', desc: 'Daily water requirement' },
        ]
    },
    physics: {
        name: 'Physics', icon: 'fa-atom', color: 'text-indigo-500',
        calculators: [
            { name: 'Speed Calculator', slug: '#', icon: 'fa-tachometer-alt', desc: 'Calculate speed, distance, time' },
            { name: 'Force Calculator', slug: '#', icon: 'fa-fist-raised', desc: 'F = ma calculations' },
        ]
    }
};

const defaultCategory = { name: 'Calculators', icon: 'fa-calculator', color: 'text-gray-500', calculators: [] };

export default function CategoryPage() {
    const { categorySlug } = useParams();
    const category = categoryData[categorySlug] || defaultCategory;

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory={categorySlug} />

            <section className="bg-white border-b border-[#e5e7eb] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <i className={`fas ${category.icon} text-4xl ${category.color}`}></i>
                        <div>
                            <h1 className="text-4xl font-bold text-[#0A0A0A]">{category.name} Calculators</h1>
                            <p className="text-[#6b7280] mt-1">{category.calculators.length} calculators available</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.calculators.map((calc) => (
                            <Link key={calc.name} to={calc.slug} className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all group">
                                <div className="flex items-start gap-4">
                                    <i className={`fas ${calc.icon} text-2xl ${category.color} shrink-0 group-hover:scale-110 transition-transform`}></i>
                                    <div>
                                        <h3 className="font-semibold text-[#0A0A0A] group-hover:text-[#3B68FC]">{calc.name}</h3>
                                        <p className="text-sm text-[#6b7280] mt-1">{calc.desc}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {category.calculators.length === 0 && (
                        <div className="text-center py-16 text-[#6b7280]">
                            <i className="fas fa-calculator text-5xl mb-4 opacity-30"></i>
                            <p>No calculators found in this category.</p>
                            <Link to="/" className="text-[#3B68FC] hover:underline mt-2 inline-block">← Back to home</Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
