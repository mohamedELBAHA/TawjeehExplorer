import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Play,
  School,
  MapPin,
  Users,
  Star,
  Search,
  Filter,
  Award,
  Zap,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const stats = [
    { number: "90+", label: "Établissements", icon: School },
    { number: "100+", label: "Étudiants", icon: Users },
    { number: "12", label: "Villes", icon: MapPin },
    { number: "98%", label: "Satisfaction", icon: Star }
  ];

  const features = [
    {
      icon: Search,
      title: "Recherche Intelligente",
      description: "Trouvez instantanément l'école parfaite avec notre moteur de recherche avancé."
    },
    {
      icon: MapPin,
      title: "Géolocalisation",
      description: "Explorez les établissements par ville avec notre carte interactive."
    },
    {
      icon: Filter,
      title: "Filtres Avancés",
      description: "Personnalisez votre recherche selon vos critères spécifiques."
    },
    {
      icon: Award,
      title: "Informations Complètes",
      description: "Accédez à toutes les données essentielles de chaque établissement."
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/platform');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100/50 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900 tracking-tight">
                Tawjeeh Navigator
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
                Fonctionnalités
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
                À Propos
              </a>
              <button 
                onClick={startLoading}
                disabled={isLoading}
                className="bg-[#004235] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-[#006b4f] hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </div>
                ) : (
                  'Commencer'
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100/50 px-6 py-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              Fonctionnalités
            </a>
            <a href="#about" className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              À Propos
            </a>
            <button 
              onClick={startLoading}
              className="w-full bg-[#004235] text-white px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:bg-[#006b4f]"
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
        <div 
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-[#004235]/10 to-[#cda86b]/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-teal-500/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20">
          <div className="text-center space-y-8">
            {/* Hero Text */}
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-none">
                <span className="block">Trouvez</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#004235] to-[#cda86b]">
                  votre école
                </span>
                <span className="block">idéale</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                Découvrez et comparez plus de 90 établissements d'enseignement supérieur au Maroc avec notre plateforme intelligente.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button 
                onClick={startLoading}
                disabled={isLoading}
                className="group bg-[#004235] text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:bg-[#006b4f] hover:scale-105 active:scale-95 hover:shadow-xl disabled:opacity-50 flex items-center"
              >
                <span>Explorer maintenant</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center">
                <Play className="mr-2 w-5 h-5 text-gray-600" />
                <span>Voir la démo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center group transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#004235] to-[#cda86b] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fonctionnalités
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004235] to-[#cda86b]"> avancées</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils puissants pour vous aider à prendre la meilleure décision pour votre avenir académique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#004235] to-[#cda86b] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#004235] to-[#006b4f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIGZpbGwtcnVsZT0ibm9uemVybyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui ont trouvé leur école idéale grâce à notre plateforme.
          </p>
          <button 
            onClick={startLoading}
            className="bg-white text-[#004235] px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl"
          >
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-4">Tawjeeh Navigator</div>
          <p className="text-gray-600 mb-6">Votre guide vers l'excellence académique</p>
          <div className="text-sm text-gray-500">
            © 2025 Tawjeeh Navigator. Tous droits réservés.
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
