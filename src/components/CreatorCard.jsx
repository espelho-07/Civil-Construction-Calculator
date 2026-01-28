export default function CreatorCard({ name, initials, title, bio, links = {} }) {
    return (
        <span className="relative group inline-block">
            {/* Trigger - Name Link */}
            <a href="#" className="text-[#3B68FC] font-medium hover:underline">
                {name}
            </a>

            {/* Hover Card */}
            <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto border border-[#e5e7eb]">
                {/* Card Header */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#3B68FC] to-[#5B7EFC] rounded-t-xl">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl font-bold text-[#3B68FC] border-2 border-white/30 shrink-0">
                        {initials}
                    </div>
                    <div className="text-white">
                        <div className="font-bold text-lg">{name}</div>
                        <div className="text-white/85 text-sm">{title}</div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                    <p className="text-sm text-[#0A0A0A] leading-relaxed mb-4">{bio}</p>

                    {/* Social Links */}
                    <div className="flex gap-2">
                        {links.linkedin && (
                            <a href={links.linkedin} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077b5] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity">
                                <i className="fab fa-linkedin-in"></i> LinkedIn
                            </a>
                        )}
                        {links.twitter && (
                            <a href={links.twitter} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1da1f2] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity">
                                <i className="fab fa-twitter"></i> Twitter
                            </a>
                        )}
                    </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 border-t border-[#e5e7eb] flex justify-between text-xs">
                    <a href="#" className="text-[#3B68FC] hover:underline">See full profile →</a>
                    <a href="#" className="text-[#3B68FC] hover:underline">Editorial policy</a>
                </div>
            </div>
        </span>
    );
}
