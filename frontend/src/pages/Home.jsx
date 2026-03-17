import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Brain, Zap, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTextareaChange = (e) => {
    setFormData(prev => ({ ...prev, message: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:8000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your message has been sent successfully!'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.detail || 'Something went wrong. Please try again later.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to connect to the server. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex flex-col font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar omitted for brevity in thought, but I'll replace everything correctly */}
      <nav className="flex justify-between items-center p-6 lg:px-12 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400 font-extrabold text-2xl tracking-tight">
          <img src="/logo.png" alt="AccessTech Logo" className="h-10 w-10 object-contain drop-shadow-md" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400">AccessTech</span>
        </div>
    <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
          >
            {t('login')}
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-indigo-600 text-white font-medium hover:bg-indigo-700 dark:bg-indigo-500 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            {t('signup')}
          </Button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Dynamic Hero Section */}
        <section className="relative px-6 lg:px-20 py-20 overflow-hidden flex flex-col items-center text-center mx-auto">
          {/* Background Glows */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-900/50 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-8 animate-fade-in-up">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
              {t('hero_subtitle', 'Revolutionary AI Learning Experience')}
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-tight drop-shadow-sm transition-colors duration-300">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x">
                {t('welcome')}
              </span>
            </h1>

            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl leading-relaxed font-medium transition-colors duration-300">
              A single platform integrating multilingual support, adaptive intelligence, and an engaging ecosystem to maximize your potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-16 w-full justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 h-16 px-10"
              >
                {t('get_started')}
                <Zap className="w-6 h-6 text-yellow-400 dark:text-indigo-600" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-xl font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 flex items-center gap-3 h-16 px-10"
              >
                {t('login')}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-transparent px-6 lg:px-20 relative z-20 -mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white">{t('features')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Feature 1: LuminaTutor */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl pt-1">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">LuminaTutor</h3>
              <p className="text-gray-600 dark:text-gray-400">Illuminates any topic in your native language with tailored explanations.</p>
            </div>
            {/* Feature 2: PathPilot */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-sky-100 dark:border-sky-900/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/50 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">PathPilot</h3>
              <p className="text-gray-600 dark:text-gray-400">Your career navigation co-pilot. Get clear roadmaps and skill requirements.</p>
            </div>
            {/* Feature 3: TermCrystal */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">TermCrystal</h3>
              <p className="text-gray-600 dark:text-gray-400">Crystal-clear definitions for complex technical terms, with real analogies.</p>
            </div>
            {/* Feature 4: SyntaxSage */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group md:col-span-3 lg:col-span-1 lg:max-w-none md:max-w-md md:mx-auto lg:mx-0">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">SyntaxSage</h3>
              <p className="text-gray-600 dark:text-gray-400">Wise, line-by-line code wisdom. Paste code and get it explained from basics.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 lg:px-20 max-w-4xl mx-auto">
          <div className="bg-indigo-900 dark:bg-gray-900 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden dark:border dark:border-gray-800">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 dark:bg-indigo-950 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500 dark:bg-purple-950 rounded-full opacity-20 blur-3xl"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 relative z-10">{t('contact')}</h2>
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="flex flex-col gap-6">
                <p className="text-indigo-100 dark:text-gray-300 text-lg">Have questions about AccessTech? We're here to help you get started on your learning journey.</p>
                <div className="flex items-center gap-4 text-indigo-50 dark:text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-6 h-6 text-indigo-300 dark:text-indigo-500" />
                  <span>supportaccesstech@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-indigo-50 dark:text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-6 h-6 text-indigo-300 dark:text-indigo-500" />
                  <span>+91 6380906053</span>
                </div>
                <div className="flex items-center gap-4 text-indigo-50 dark:text-gray-400 hover:text-white transition-colors">
                  <MapPin className="w-6 h-6 text-indigo-300 dark:text-indigo-500" />
                  <span>Chennai, Tamil Nadu, India</span>
                </div>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    id="name"
                    placeholder={t('name')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white/90 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-400 placeholder-gray-500 h-12 dark:border-gray-700"
                  />
                  <Input
                    type="email"
                    id="email"
                    placeholder={t('email')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white/90 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-400 placeholder-gray-500 h-12 dark:border-gray-700"
                  />
                  <textarea
                    placeholder="Message"
                    id="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleTextareaChange}
                    required
                    className="px-4 py-3 bg-white/90 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 resize-none dark:border-gray-700 border"
                  ></textarea>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-400 dark:hover:bg-indigo-500 text-white font-bold h-12 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </Button>

                  {submitStatus.message && (
                    <div className={`mt-2 p-3 rounded-lg text-sm font-medium ${submitStatus.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                      }`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-100 dark:border-gray-800">
        <p>&copy; {new Date().getFullYear()} AccessTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
