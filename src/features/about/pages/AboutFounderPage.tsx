import React, { useState } from 'react';
import {
  GraduationCap,
  Globe,
  Award,
  BookOpen,
  Heart,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Building,
  Sparkles,
  Clock,
  Send,
  Calendar,
  ChevronRight,
  Maximize2,
  Check,
  Copy,
  FileText,
  ShieldCheck,
  Users,
  Compass,
  ArrowUpRight,
  Plane,
} from 'lucide-react';

interface AboutFounderPageProps {
  onNavigate?: (tab: string) => void;
  initialTab?: 'bio' | 'representation' | 'consultation';
}

export const AboutFounderPage: React.FC<AboutFounderPageProps> = ({
  onNavigate,
  initialTab = 'bio',
}) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'representation' | 'consultation'>(initialTab);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Consultation form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: 'Australia',
    degree: "Bachelor's Degree",
    targetBand: '7.5',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    // Prepare WhatsApp message
    const waText = encodeURIComponent(
      `*New Study Abroad Consultation Inquiry*\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `📧 *Email:* ${formData.email || 'N/A'}\n` +
      `🌍 *Destination:* ${formData.country}\n` +
      `🎓 *Degree Level:* ${formData.degree}\n` +
      `🎯 *Target Band:* ${formData.targetBand}\n` +
      `💬 *Note:* ${formData.message || 'I would like an admission & visa assessment.'}`
    );

    // Save to local storage
    try {
      const existing = JSON.parse(localStorage.getItem('akhl_consultation_leads') || '[]');
      existing.unshift({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('akhl_consultation_leads', JSON.stringify(existing));
    } catch {
      // Ignore local storage error
    }

    setIsSubmitted(true);

    // Open WhatsApp directly to Dr. Asif's helpline
    window.open(`https://wa.me/8801313529988?text=${waText}`, '_blank');
  };

  const representedCountries = [
    {
      country: 'Malaysia',
      flag: '🇲🇾',
      image: '/images/malaysia.jpg',
      landmark: 'Petronas Twin Towers, Kuala Lumpur',
      degrees: 'Foundation • Bachelor • Master & PhD',
      highlights: [
        'Official counselor for University of Kuala Lumpur (UniKL) & premier private universities',
        'Direct branch campuses: Monash Malaysia, Taylor’s, Sunway, APU, Curtin',
        'Swift EMGS student visa approval with affordable living and high graduate employability',
        'No IELTS required for select foundation & credit-transfer pathways',
      ],
      popularFields: ['Agro-Marketing & Business', 'Computer Science / AI', 'Engineering', 'Hospitality'],
      accentColor: 'from-amber-600/20 via-slate-900 to-[#0A1128]',
      badgeBorder: 'border-amber-500/40 text-amber-300',
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      image: '/images/australia.jpg',
      landmark: 'Sydney Opera House & Harbour',
      degrees: 'Foundation • Bachelor • Master & PhD',
      highlights: [
        'Partnered with Student World Australia (studentworld.com.au) head office in Sydney',
        'Comprehensive admissions for Group of Eight (Go8) & Australian Technology Network (ATN)',
        'Genuine Student (GS) statement of purpose vetting & financial documentation scrutiny',
        'Post-Study Work Visa (Subclass 485) and Skilled PR migration pathways guidance',
      ],
      popularFields: ['Nursing & Public Health', 'IT / Cybersecurity', 'Accounting', 'Engineering & Mining'],
      accentColor: 'from-blue-600/20 via-slate-900 to-[#0A1128]',
      badgeBorder: 'border-sky-500/40 text-sky-300',
    },
    {
      country: 'USA',
      flag: '🇺🇸',
      image: '/images/usa.jpg',
      landmark: 'Statue of Liberty & Manhattan Skyline',
      degrees: 'Bachelor • Master & PhD',
      highlights: [
        'Placement into Tier-1 and Top 100 National Research Universities',
        'Graduate Research Assistantship (GRA) & Teaching Assistantship (GTA) full funding support',
        '36-Month STEM OPT Work Authorization for international graduates',
        '1-on-1 F-1 Visa Mock Interview coaching with Dr. Asif Kibria',
      ],
      popularFields: ['Data Science / AI', 'Biomedical Sciences', 'Finance & MBA', 'Mechanical Engineering'],
      accentColor: 'from-red-600/20 via-slate-900 to-[#0A1128]',
      badgeBorder: 'border-red-500/40 text-red-300',
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      image: '/images/canada.jpg',
      landmark: 'CN Tower & Toronto Financial Center',
      degrees: 'Foundation • Bachelor • Master & PhD',
      highlights: [
        'Direct representation across top Public Universities & Designated Learning Institutions (DLI)',
        '3-Year Post-Graduation Work Permit (PGWP) eligibility guidance',
        'Comprehensive Provincial Nominee Program (PNP) and Express Entry roadmapping',
        'High visa success through rigorous GIC & financial asset justification',
      ],
      popularFields: ['Software Engineering', 'Business Analytics', 'Environmental Studies', 'Supply Chain'],
      accentColor: 'from-rose-600/20 via-slate-900 to-[#0A1128]',
      badgeBorder: 'border-rose-500/40 text-rose-300',
    },
    {
      country: 'Cyprus',
      flag: '🇨🇾',
      image: '/images/cyprus.jpg',
      landmark: 'Mediterranean Coast & Kyrenia Harbour',
      degrees: 'Foundation • Bachelor • Master & PhD',
      highlights: [
        'Fastest European university admission and visa clearance in months',
        'Affordable European tuition with generous initial scholarships (up to 50%)',
        'Gateway to Schengen & European higher research institutions',
        'High approval rates for South Asian and developing nation students',
      ],
      popularFields: ['International Business', 'Hotel Management', 'Maritime Studies', 'Computer Engineering'],
      accentColor: 'from-orange-600/20 via-slate-900 to-[#0A1128]',
      badgeBorder: 'border-orange-500/40 text-orange-300',
    },
    {
      country: 'United Kingdom & Europe',
      flag: '🇬🇧',
      image: '/images/uk.jpg',
      landmark: 'University of Essex London & Oxford/Cambridge',
      degrees: 'Bachelor • Master & PhD',
      highlights: [
        'Led by Dr. Asif Kibria (Former International Research Trainer, University of Essex, UK)',
        '1-Year Master’s Degree fast-track options across prestigious Russell Group universities',
        'Tuition-free public universities across Germany (TU9) and Nordic scholarships (Sweden, Denmark)',
        'Graduate Route 2-year post-study work visa support in the UK',
      ],
      popularFields: ['Economics & Econometrics', 'Law (LLM)', 'Public Policy', 'Applied Biotechnology'],
      accentColor: 'from-indigo-600/20 via-slate-900 to-[#0A1128]',
      badgeBorder: 'border-indigo-500/40 text-indigo-300',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 pb-28">
      {/* Top Institutional Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#1A0B1A] via-[#0F172A] to-[#0A1128] p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-amber-500/40 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL ACADEMIC LEADERSHIP & GLOBAL ADMISSIONS</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Dr. ABM Asif Kibria
            </h1>
            <p className="text-sm md:text-base text-sky-300 font-medium leading-relaxed">
              Founder & CEO • Asif Kibria Help Line (AKHL) | Official Partner: Student World Australia
            </p>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
              PhD (UniKL) • Former Research Trainer (University of Essex, UK) • Associate Professor for MBA Program (UODA) • 
              Global University Counselor for 138+ Prestigious Institutions worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="tel:+8801313529988"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: +88 01313529988</span>
              </a>
              <a
                href="tel:+8801749307575"
                className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call: +88 01749307575</span>
              </a>
              <a
                href="https://asifkibriahelpline.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>asifkibriahelpline.com</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="grid grid-cols-2 gap-3 lg:w-72 shrink-0">
            <div className="bg-slate-900/90 border border-sky-500/30 p-3.5 rounded-2xl text-center shadow-md">
              <span className="text-2xl font-black text-sky-400 block">138+</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mt-0.5">Global Universities</span>
              <span className="text-[10px] text-slate-400">Direct Counseling</span>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/30 p-3.5 rounded-2xl text-center shadow-md">
              <span className="text-2xl font-black text-emerald-400 block">70+</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mt-0.5">PhD Placements</span>
              <span className="text-[10px] text-slate-400">USA, UK, Aus, EU</span>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl text-center shadow-md">
              <span className="text-2xl font-black text-amber-400 block">14+</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mt-0.5">Full Grants</span>
              <span className="text-[10px] text-slate-400">100% Scholarship</span>
            </div>

            <div className="bg-slate-900/90 border border-purple-500/30 p-3.5 rounded-2xl text-center shadow-md">
              <span className="text-2xl font-black text-purple-400 block">Fast</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mt-0.5">In Months</span>
              <span className="text-[10px] text-slate-400">Visa Processing</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md rounded-2xl p-1.5 gap-2 sticky top-16 z-30 shadow-lg">
        <button
          onClick={() => setActiveTab('bio')}
          className={`flex-1 flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'bio'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Dr. Asif Kibria Biography</span>
        </button>

        <button
          onClick={() => setActiveTab('representation')}
          className={`flex-1 flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'representation'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Global University Representation</span>
          <span className="hidden sm:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            Official Poster
          </span>
        </button>

        <button
          onClick={() => setActiveTab('consultation')}
          className={`flex-1 flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'consultation'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Book Free Consultation</span>
          <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            WhatsApp Live
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FOUNDER & CEO BIOGRAPHY */}
      {/* ========================================================================= */}
      {activeTab === 'bio' && (
        <div className="space-y-6">
          {/* Quote Card */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 border border-sky-500/30 p-6 rounded-2xl relative shadow-md">
            <p className="text-base md:text-lg text-slate-200 italic leading-relaxed text-center font-serif">
              “A scholar, researcher, trainer, social worker, and mentor driven by a lifelong passion for academic excellence, empowerment, and positive transformation.”
            </p>
            <p className="text-xs text-sky-400 font-bold text-center mt-3 tracking-wider uppercase">
              — Dr. ABM Asif Kibria, Founder & CEO
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Academic Journey & Scholarship */}
            <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center space-x-3 text-sky-400 border-b border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <GraduationCap className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Academic Journey & Scholarship</h3>
                  <p className="text-[11px] text-slate-400">Bangalore • Malaysia • UK • Bangladesh</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start space-x-2.5">
                  <span className="text-sky-400 font-black mt-0.5">•</span>
                  <span><strong>Early Roots & Bangalore:</strong> Born in Dhaka, Bangladesh (1983); completed secondary schooling in Bangalore, India (1998) and graduated with Bachelor's Degree from Bangalore University (2003) with academic distinction.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-sky-400 font-black mt-0.5">•</span>
                  <span><strong>Doctorate in Malaysia:</strong> Master's Degree by Research and PhD in Agro-Product Marketing from University of Kuala Lumpur (UniKL, 2015).</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-sky-400 font-black mt-0.5">•</span>
                  <span><strong>International Research Trainer in the UK:</strong> Joined University of Essex London post-PhD as an international research trainer, lecturing global cohorts.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-sky-400 font-black mt-0.5">•</span>
                  <span><strong>University Leadership in Dhaka:</strong> Returned to Dhaka in 2016 to join University of Development Alternative (UODA) as Associate Professor for the MBA Program.</span>
                </li>
              </ul>
            </div>

            {/* Section 2: Global University Placement & PhD Counseling */}
            <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center space-x-3 text-emerald-400 border-b border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Global University Counseling & PhDs</h3>
                  <p className="text-[11px] text-slate-400">138+ Partner Universities Worldwide</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start space-x-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">•</span>
                  <span><strong>Global University Network:</strong> Official counseling coverage across 138+ premier universities in Malaysia, Australia, USA, Canada, Cyprus, UK, Germany, Netherlands, Sweden, Denmark, Korea, Singapore, and China.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">•</span>
                  <span><strong>70+ PhD Placements:</strong> Personally guided over 70 PhD scholars into doctoral fellowships and funded research programs worldwide.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">•</span>
                  <span><strong>14 Full International Scholarships:</strong> Secured 100% tuition waivers and living stipends for talented students from developing countries.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">•</span>
                  <span><strong>Proprietary IELTS Pedagogy:</strong> Author and architect of the 16-Class Master IELTS Curriculum and 2,070+ practice ecosystem powering AKHL IELTS.</span>
                </li>
              </ul>
            </div>

            {/* Section 3: Social Impact — Uttaran Foundation */}
            <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center space-x-3 text-rose-400 border-b border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Heart className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Social Impact — Uttaran Foundation</h3>
                  <p className="text-[11px] text-slate-400">Director of Field & Operations</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-black mt-0.5">•</span>
                  <span><strong>Grassroots Operations:</strong> Serves as Director of Field and Operations for Uttaran Foundation, spearheading community welfare projects across Bangladesh.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-black mt-0.5">•</span>
                  <span><strong>Marginalized Communities:</strong> Dedicated champion for education, healthcare, and employment rights for river gypsy (Bede) communities, third-gender individuals, and underprivileged youths.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-black mt-0.5">•</span>
                  <span><strong>Vocational Transformation:</strong> Establishing skill training facilities and micro-entrepreneurship programs for poverty alleviation.</span>
                </li>
              </ul>
            </div>

            {/* Section 4: Literary & Creative Works */}
            <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center space-x-3 text-purple-400 border-b border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Literary & Creative Works</h3>
                  <p className="text-[11px] text-slate-400">Author • Poet • Filmmaker</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start space-x-2.5">
                  <span className="text-purple-400 font-black mt-0.5">•</span>
                  <span><strong>Published Author:</strong> Authored multiple books on Economics and published poetry collections widely read in Bangladesh, Malaysia, and India.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-purple-400 font-black mt-0.5">•</span>
                  <span><strong>Documentary & Television Director:</strong> Directed thought-provoking television dramas and socio-economic documentaries broadcast across national media in Bangladesh and India.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-purple-400 font-black mt-0.5">•</span>
                  <span><strong>Educational Visionary:</strong> Continues to author analytical articles on higher education reform, graduate career trajectories, and cross-border research funding.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: Official Physical Address & Direct Touchpoints */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#131E3A] to-[#0F172A] border border-sky-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/40 px-3 py-0.5 rounded-full">
                  OFFICIAL HELPLINE & HEADQUARTERS
                </span>
                <h3 className="text-lg md:text-xl font-black text-white mt-1.5">
                  Asif Kibria Help Line (AKHL) — Education Consultancy
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('consultation')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book In-Person Appointment</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Address */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-400">
                  <MapPin className="w-4 h-4" />
                  <span>Physical Head Office</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Flat 6A, 121/5 Auto One AC Market (Opposite Janakantha Bhaban), New Eskaton Road, Dhaka, Bangladesh.
                </p>
                <button
                  onClick={() => copyToClipboard('Flat 6A, 121/5 Auto One AC Market, New Eskaton Road, Dhaka', 'address')}
                  className="text-[11px] text-sky-400 hover:text-white flex items-center space-x-1 pt-1 font-semibold"
                >
                  {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'address' ? 'Address Copied!' : 'Copy Office Address'}</span>
                </button>
              </div>

              {/* Hotlines */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Phone className="w-4 h-4" />
                  <span>Direct Hotline & WhatsApp</span>
                </div>
                <div className="space-y-1 text-xs">
                  <a href="tel:+8801313529988" className="block text-white font-bold hover:text-sky-300">
                    +88 01313529988 <span className="text-[10px] text-slate-400 font-normal">(Direct / WhatsApp)</span>
                  </a>
                  <a href="tel:+8801749307575" className="block text-white font-bold hover:text-sky-300">
                    +88 01749307575 <span className="text-[10px] text-slate-400 font-normal">(Direct / WhatsApp)</span>
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard('+8801313529988', 'phone')}
                  className="text-[11px] text-sky-400 hover:text-white flex items-center space-x-1 pt-1 font-semibold"
                >
                  {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'phone' ? 'Number Copied!' : 'Copy Primary Hotline'}</span>
                </button>
              </div>

              {/* Email & Web */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Mail className="w-4 h-4" />
                  <span>Official Email & Web Portal</span>
                </div>
                <div className="space-y-1 text-xs">
                  <a href="mailto:info@asifkibriahelpline.com" className="block text-slate-200 hover:text-white font-medium">
                    info@asifkibriahelpline.com
                  </a>
                  <a href="https://asifkibriahelpline.com" target="_blank" rel="noreferrer" className="block text-sky-400 hover:underline font-medium">
                    asifkibriahelpline.com
                  </a>
                  <a href="https://studentworld.com.au" target="_blank" rel="noreferrer" className="block text-purple-300 hover:underline font-medium">
                    studentworld.com.au (Global Partner)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GLOBAL UNIVERSITY REPRESENTATION (THE OFFICIAL POSTER SHOWCASE) */}
      {/* ========================================================================= */}
      {activeTab === 'representation' && (
        <div className="space-y-8">
          {/* Official Poster Spotlight Banner */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
              {/* Poster Visual Preview */}
              <div className="relative group shrink-0 cursor-pointer" onClick={() => setIsPosterModalOpen(true)}>
                <div className="w-72 md:w-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-950 transition-transform group-hover:scale-[1.02]">
                  <img
                    src="/images/asif_kibria_study_abroad_poster.jpg"
                    alt="Asif Kibria Help Line Education Consultancy Official Study Abroad Poster"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white font-bold text-xs">
                    <Maximize2 className="w-4 h-4" />
                    <span>Click to Expand Full Poster</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-[11px] text-slate-400 hover:text-sky-300 font-semibold inline-flex items-center space-x-1">
                    <Maximize2 className="w-3 h-3" />
                    <span>View High-Res Poster</span>
                  </span>
                </div>
              </div>

              {/* Poster Story & Core Value Proposition */}
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-amber-500/50 px-3.5 py-1 rounded-full text-xs font-black text-amber-300 tracking-wide uppercase">
                  <Plane className="w-3.5 h-3.5 text-amber-400" />
                  <span>WE CONVERT YOUR STUDY ABROAD DREAMS INTO REALITY</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  Direct Representation for Hundreds of Premier Universities
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  As an officially accredited education consultancy led by Dr. ABM Asif Kibria, <strong>Asif Kibria Help Line</strong> provides authorized institutional representation, transparent counseling, and end-to-end visa settlement for students across South Asia.
                </p>

                {/* Key Pillars from Poster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/90 border border-white/10 p-3.5 rounded-xl flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400 font-bold text-xs shrink-0">
                      DEG
                    </div>
                    <div>
                      <strong className="text-white text-xs block font-bold">ALL DEGREE LEVELS</strong>
                      <span className="text-[11px] text-slate-400">Foundation • Bachelor • Master & PhD programs with full institutional accreditation.</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-xl flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-amber-300 text-xs block font-bold">FASTEST PROCESSING</strong>
                      <span className="text-[11px] text-slate-400">Expedited admission offer letters and visa filing processed in record months.</span>
                    </div>
                  </div>
                </div>

                {/* Quick Call Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href="https://wa.me/8801313529988?text=Hello%20Dr.%20Asif,%20I%20saw%20your%20study%20abroad%20poster%20and%20would%20like%20to%20apply."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp Direct: 01313-529988</span>
                  </a>

                  <button
                    onClick={() => setActiveTab('consultation')}
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book In-Depth Profile Evaluation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Country Grid (Malaysia, Australia, USA, Canada, Cyprus, UK) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <span>Countries & Educational Systems Represented</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select any destination below to view admission standards, degree levels, and visa guidelines.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full w-fit">
                6 Major Global Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {representedCountries.map((c) => (
                <div
                  key={c.country}
                  className="bg-[#0D1527] border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <h4 className="text-base font-black text-white">{c.country}</h4>
                          <span className="text-[11px] text-slate-400 block font-medium">{c.landmark}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase border px-2.5 py-0.5 rounded-full ${c.badgeBorder}`}>
                        Official Direct
                      </span>
                    </div>

                    <div className="bg-slate-900/80 border border-white/5 p-2.5 rounded-xl text-xs text-slate-300 font-semibold">
                      <span className="text-amber-400 font-bold block text-[10px] uppercase">Degree Offerings:</span>
                      <span>{c.degrees}</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Institutional Advantages:</span>
                      <ul className="space-y-1.5">
                        {c.highlights.map((h, i) => (
                          <li key={i} className="flex items-start space-x-2 text-[11px] text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, country: c.country }));
                        setActiveTab('consultation');
                      }}
                      className="text-xs font-bold text-sky-400 hover:text-white flex items-center space-x-1"
                    >
                      <span>Apply for {c.country}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">Fast Track</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STUDENT WORLD PARTNERSHIP & CONSULTATION BOOKING FORM */}
      {/* ========================================================================= */}
      {activeTab === 'consultation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Partner Credibility Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D1527] border border-sky-500/30 rounded-3xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center space-x-3 text-sky-400 border-b border-slate-800 pb-4">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <Plane className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Student World Australia</h3>
                  <p className="text-xs text-slate-400 font-medium">Official Global Education & Migration Partner</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Asif Kibria Help Line operates in direct affiliation with <strong>Student World Australia</strong> (headquartered in Sydney, Australia).
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">100% Impartial Guidance:</strong>
                    Direct, unbiased match-making based on student academic scores and financial profile.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">On-Shore Australian Support:</strong>
                    Assistance upon arrival in Sydney, Melbourne, Brisbane, and Adelaide with bank accounts, accommodation, and Subclass 485 visas.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Comprehensive Visa Scrutiny:</strong>
                    Stringent statement of purpose (SOP) vetting to avoid visa refusals under genuine student rules.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-white/10 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Website:</span>
                <a
                  href="https://studentworld.com.au"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-sky-400 hover:underline inline-flex items-center space-x-1"
                >
                  <span>studentworld.com.au</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Helpline Box */}
            <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <Phone className="w-4 h-4" />
                <span>Immediate Consultation Hotline</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prefer speaking directly to Dr. Asif or our senior admissions director? Call us directly at:
              </p>
              <div className="space-y-1 pt-1 font-bold text-white text-sm">
                <div>+88 01313529988</div>
                <div>+88 01749307575</div>
              </div>
            </div>
          </div>

          {/* Consultation Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0D1527] border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  FREE ADMISSION & VISA EVALUATION
                </span>
                <h3 className="text-xl font-black text-white mt-2">Book Your Counseling Session</h3>
                <p className="text-xs text-slate-400">
                  Fill out your academic details below. We will immediately assess your eligibility for top universities and scholarships.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Consultation Request Received!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your assessment has been queued and opened in WhatsApp. Our admissions team will review your target destination and contact you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 text-xs text-emerald-400 font-bold hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +880 1712 345678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. student@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Destination Country & Degree Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Target Country</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
                      >
                        <option value="Australia">Australia 🇦🇺</option>
                        <option value="Malaysia">Malaysia 🇲🇾</option>
                        <option value="USA">USA 🇺🇸</option>
                        <option value="Canada">Canada 🇨🇦</option>
                        <option value="Cyprus">Cyprus 🇨🇾</option>
                        <option value="United Kingdom">United Kingdom 🇬🇧</option>
                        <option value="Germany / Europe">Germany / Europe 🇪🇺</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Degree Level</label>
                      <select
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
                      >
                        <option value="Foundation / Pathway">Foundation / College Pathway</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree (Coursework)">Master's Degree (Coursework)</option>
                        <option value="Master's by Research / PhD">Master's by Research / PhD Fellowship</option>
                      </select>
                    </div>
                  </div>

                  {/* Target IELTS Band */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Target / Current IELTS Band</label>
                    <select
                      value={formData.targetBand}
                      onChange={(e) => setFormData({ ...formData, targetBand: e.target.value })}
                      className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
                    >
                      <option value="6.0">Band 6.0 (Foundation & Select Diplomas)</option>
                      <option value="6.5">Band 6.5 (Standard Bachelor's & Master's)</option>
                      <option value="7.0">Band 7.0 (Top Tier Universities / Canada SDS)</option>
                      <option value="7.5">Band 7.5+ (Direct Nursing, Law, Medicine & PhD)</option>
                      <option value="Not taken yet">Have not taken IELTS yet</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Additional Notes / Educational Background</label>
                    <textarea
                      rows={3}
                      placeholder="Mention your previous degree (e.g. HSC GPA 5.0, or BBA from North South University) and any questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Open WhatsApp Assessment</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    🔒 Your information is confidential. Directly reviewed by Dr. Asif Kibria and our senior education counselors.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Poster Lightbox Modal */}
      {isPosterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 bg-slate-950 p-2 shadow-2xl">
            <button
              onClick={() => setIsPosterModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-slate-900/90 text-white hover:text-rose-400 p-2 rounded-full border border-white/20 transition-all"
            >
              ✕
            </button>
            <img
              src="/images/asif_kibria_study_abroad_poster.jpg"
              alt="Asif Kibria Help Line Education Consultancy Poster Full"
              className="max-h-[85vh] w-auto object-contain mx-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
