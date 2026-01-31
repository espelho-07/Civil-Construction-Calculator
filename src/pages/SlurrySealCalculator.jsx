import { useState, useEffect } from 'react';
import CategoryNav from '../components/CategoryNav';
import { getThemeClasses } from '../constants/categories';

export default function SlurrySealCalculator() {
    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="sieve-analysis-aggregates" />
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900">Slurry Seal Calculator</h1>
                <p className="text-gray-600 mt-2">Coming Soon...</p>
            </div>
        </main>
    );
}
