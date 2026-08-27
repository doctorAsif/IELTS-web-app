import React from 'react';
import { Plane, Phone, Globe, Mail, GraduationCap } from 'lucide-react';

export const StudyAbroadAd: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white text-gray-900 rounded-3xl border-2 border-gray-200 shadow-xl flex flex-col font-sans">
      
      {/* Top Section - Brand */}
      <div className="bg-[#00205B] text-white p-4 flex flex-col items-center justify-center relative">
        <Plane className="absolute top-2 right-4 w-6 h-6 text-white/50" />
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-black tracking-tight leading-none text-white uppercase">
            Asif Kibria
          </h2>
        </div>
        <h2 className="text-3xl font-black text-red-600 tracking-wider uppercase mb-1">
          Help Line
        </h2>
        <div className="bg-white text-[#00205B] text-[10px] font-bold px-4 py-0.5 rounded-full tracking-widest uppercase shadow-sm">
          Education Consultancy
        </div>
      </div>

      {/* Tagline */}
      <div className="p-4 text-center pb-2">
        <p className="text-[#00205B] text-sm italic font-medium">We Convert Your</p>
        <p className="text-red-600 font-black text-xl leading-tight">STUDY ABROAD DREAMS</p>
        <div className="inline-block bg-[#00205B] text-white text-xs font-bold px-3 py-1 mt-1 rounded-full italic transform -rotate-1">
          into Reality
        </div>
      </div>

      {/* Countries (Badges instead of full images to save space) */}
      <div className="px-3 py-2 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 flex justify-center gap-1.5 flex-wrap">
        {['Malaysia', 'Australia', 'USA', 'Canada', 'Cyprus'].map((country) => (
          <span key={country} className="text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/20">
            {country}
          </span>
        ))}
      </div>

      {/* Degrees */}
      <div className="bg-[#00205B] py-2 px-2 text-center text-white text-xs font-bold tracking-wide border-t border-white/20">
        <span className="text-yellow-400 mr-1">WITH</span>
        FOUNDATION • BACHELOR • MASTER & PhD
      </div>

      {/* Highlight Banner */}
      <div className="bg-red-600 text-white text-center py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 transform -skew-x-12 translate-x-4"></div>
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/90">Fastest Processing</p>
          <p className="text-yellow-400 font-black text-lg italic tracking-wider">IN MONTHS</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-[#00205B] p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2 border border-white/10">
          <div className="bg-yellow-400 p-1.5 rounded-full">
            <Phone className="w-4 h-4 text-[#00205B]" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none">+88 01313529988</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2 border border-white/10">
          <div className="bg-yellow-400 p-1.5 rounded-full">
            <Phone className="w-4 h-4 text-[#00205B]" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none">+88 01749307575</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-2 text-white/80 text-[10px]">
            <Mail className="w-3 h-3 text-red-500" />
            <span className="truncate">info@asifkibriahelpline.com</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-[10px]">
            <Globe className="w-3 h-3 text-red-500" />
            <span className="truncate">asifkibriahelpline.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
