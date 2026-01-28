export default function AdSlot({ type = 'sidebar', size = '300x250' }) {
    const isInline = type === 'inline';

    return (
        <div className={`bg-bg-card border border-dashed border-border-color rounded-lg p-6 text-center flex flex-col items-center justify-center ${isInline ? 'my-8 min-h-[100px]' : 'mt-4 min-h-[300px]'}`}>
            <span className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                Advertisement
            </span>
            <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center text-text-secondary text-sm ${isInline ? 'w-full max-w-[728px] h-[90px]' : 'w-[300px] h-[250px]'}`}>
                {size} Ad Space
            </div>
        </div>
    );
}
