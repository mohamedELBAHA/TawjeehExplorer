import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  School, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Award,
  BookOpen,
  Filter,
  Zap,
  Globe,
  TrendingUp,
  Shield,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const stats = [
    { number: "150+", label: "Établissements", icon: School },
    { number: "500K+", label: "Étudiants", icon: Users },
    { number: "12", label: "Villes", icon: MapPin },
    { number: "98%", label: "Satisfaction", icon: Star }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Géolocalisation Précise",
      description: "Trouvez les écoles par ville, région ou proximité géographique avec notre carte interactive avancée."
    },
    {
      icon: Filter,
      title: "Filtres Intelligents",
      description: "Filtrez par filière, seuil d'entrée, ville et bien plus pour trouver l'école qui correspond à votre niveau."
    },
    {
      icon: Award,
      title: "Informations Complètes",
      description: "Accédez aux programmes, critères d'admission, contacts et infrastructures de chaque établissement."
    },
    {
      icon: Zap,
      title: "Recherche Instantanée",
      description: "Résultats en temps réel avec notre moteur de recherche optimisé et interface fluide."
    }
  ];

  const testimonials = [
    {
      name: "Fatima Zahra",
      role: "Étudiante en Médecine",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      content: "Grâce à Afaqi, j'ai trouvé l'université parfaite qui correspondait à mon profil et mes ambitions."
    },
    {
      name: "Ahmed Benali",
      role: "Parent d'élève",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      content: "Une plateforme indispensable pour aider nos enfants à choisir leur orientation avec toutes les informations nécessaires."
    },
    {
      name: "Youssef El Idrissi",
      role: "Conseiller d'orientation",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      content: "L'outil de référence que j'utilise quotidiennement pour guider mes étudiants vers les meilleures formations."
    }
  ];

  // Animation des statistiques
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setLoadingPercent(0);
    let percent = 0;
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 15) + 10; // random jump for "huge" effect
      if (percent >= 100) {
        percent = 100;
        setLoadingPercent(percent);
        clearInterval(interval);
        setTimeout(() => {
          navigate('/platform');
          setIsLoading(false);
        }, 400);
      } else {
        setLoadingPercent(percent);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex flex-col items-start">
                <span className="text-xl font-bold bg-gradient-to-r from-[#004235] to-[#cda86b] bg-clip-text text-transparent">
                  Tawjeeh Explorer
                </span>
                <span className="mt-1 text-xs italic text-gray-500">powered by Tawjeeh</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors">
                  Fonctionnalités
                </a>
                <a href="#about" className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors">
                  À Propos
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors">
                  Témoignages
                </a>
                <button 
                  onClick={startLoading}
                  className="bg-[#004235] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#cda86b] hover:text-white"
                >
                  Commencer
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#004235] p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-[#004235] font-medium">
                Fonctionnalités
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#004235] font-medium">
                À Propos
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-[#004235] font-medium">
                Témoignages
              </a>
              <button 
                onClick={startLoading}
                className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-[#004235] text-white hover:bg-[#cda86b] hover:text-white"
              >
                Commencer
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column - Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-black">
                      Trouvez
                    </span>
                    <br />
                    <span className="text-black">
                      votre école idéale
                    </span>
                    <br />
                    <span className="text-black">
                      au Maroc
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Découvrez et comparez plus de 150 établissements d'enseignement supérieur avec notre plateforme interactive et intelligente.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={startLoading}
                    className="group bg-[#004235] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#cda86b] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
                  >
                    <span>Explorer la carte</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group bg-white text-[#004235] px-8 py-4 rounded-xl font-semibold border-2 border-[#004235] hover:bg-[#cda86b] hover:text-white transition-all duration-300 flex items-center justify-center">
                    <Play className="mr-2 w-5 h-5" />
                    <span>Voir la démo</span>
                  </button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className={`text-center transform transition-all duration-500 ${
                          currentStat === index ? 'scale-110' : 'scale-100'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                          currentStat === index 
                            ? 'bg-[#cda86b] text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right column - Visual */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* Mock interface */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Carte Interactive</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Search bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Rechercher une école..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>

                    {/* Mock map replaced with real map */}
                    <div className="h-48 rounded-lg overflow-hidden">
                      <MapContainer center={[31.7917, -7.0926]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[34.0209, -6.8416]}>
                          <Popup>Rabat</Popup>
                        </Marker>
                      </MapContainer>
                    </div>

                    {/* Mock results */}
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <School className="w-5 h-5 text-blue-700 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">École Mohammadia d'Ingénieurs</div>
                          <div className="text-xs text-gray-500">Rabat • Ingénierie</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600">16.5/20</div>
                          <div className="text-xs text-gray-400">Seuil</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <School className="w-5 h-5 text-gray-500 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-600 text-sm">Université Mohammed V</div>
                          <div className="text-xs text-gray-400">Casablanca • Médecine</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-600">18.0/20</div>
                          <div className="text-xs text-gray-400">Seuil</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-20 mt-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Choisissez votre expérience</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Freemium Plan */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 max-w-md mx-auto md:mx-0">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🔥</span>
              <span className="text-xl font-bold text-[#004235]">Freemium</span>
              <span className="ml-2 text-sm text-gray-500">Basic Access</span>
            </div>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Basic search and filters</li>
              <li>• Essential profiles</li>
              <li>• Limited AI recommendations <span className="text-xs text-gray-400">(5/day)</span></li>
              <li>• Basic chatbot</li>
              <li>• Public scholarship info</li>
            </ul>
            <div className="text-3xl font-bold text-[#004235] mb-2">Gratuit</div>
            <button className="w-full bg-[#004235] text-white py-3 rounded-lg font-semibold hover:bg-[#cda86b] hover:text-white transition-colors">Get Started Free</button>
          </div>
          {/* Premium Plan */}
          <div className="flex-1 bg-[#004235] rounded-xl shadow-lg p-8 border-2 border-[#004235] hover:shadow-2xl transition-shadow duration-300 max-w-md mx-auto md:mx-0 text-white relative overflow-hidden">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">💎</span>
              <span className="text-xl font-bold">Premium</span>
              <span className="ml-2 text-sm text-[#cda86b]">Enhanced Experience</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li>• Unlimited AI recommendations</li>
              <li>• Advanced filtering (scores, cost, satisfaction)</li>
              <li>• Premium personalized chatbot</li>
              <li>• Multiple shortlist management</li>
              <li>• SMS/email deadline reminders</li>
              <li>• Scholarship and real-time seat alerts</li>
            </ul>
            <div className="text-3xl font-bold mb-2">49 <span className="text-lg font-medium">MAD/an</span></div>
            <button className="w-full bg-white text-[#004235] py-3 rounded-lg font-semibold hover:bg-[#cda86b] hover:text-white transition-colors">Upgrade to Premium</button>
            <div className="absolute top-0 right-0 bg-[#cda86b] text-[#004235] text-xs font-bold px-3 py-1 rounded-bl-xl">Populaire</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir <span className="bg-gradient-to-r from-[#004235] to-[#cda86b] bg-clip-text text-transparent">Tawjeeh Explorer</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète qui révolutionne la recherche d'établissements d'enseignement au Maroc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-[#cda86b] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                L'avenir de l'orientation étudiante au Maroc
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tawjeeh Explorer est né de la volonté de démocratiser l'accès à l'information sur l'enseignement supérieur marocain. Notre plateforme centralise toutes les données essentielles pour aider les étudiants et leurs familles à prendre des décisions éclairées.
              </p>
              
              <div className="space-y-4">
                {[
                  "Base de données exhaustive mise à jour en temps réel",
                  "Interface intuitive adaptée à tous les profils",
                  "Algorithmes de recommandation personnalisés",
                  "Support multilingue (Arabe, Français, Anglais)"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/platform')}
                className="bg-[#004235] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#cda86b] hover:text-white transition-all duration-300"
              >
                En savoir plus
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop"
                  alt="Université"
                  className="rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=200&fit=crop"
                  alt="Étudiants"
                  className="rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-[#004235] to-[#cda86b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-[#cda86b] max-w-3xl mx-auto">
              Découvrez les témoignages de ceux qui ont trouvé leur voie grâce à Tawjeeh Explorer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <p className="text-white leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-blue-100 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-4">
            Prêt à découvrir votre future école ?
          </h2>
          <p className="text-xl text-[#cda86b] mb-8">
            Rejoignez des milliers d'étudiants qui ont déjà trouvé leur voie avec Afaqi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={startLoading}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-[#004235] text-white hover:bg-[#cda86b] hover:text-white"
            >
              Commencer maintenant
            </button>
            <button className="bg-transparent text-[#004235] px-8 py-4 rounded-xl font-semibold border-2 border-[#004235] hover:bg-[#cda86b] hover:text-white transition-all duration-300">
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004235]">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-white text-sm font-medium">
            © 2024 Tawjeeh Explorer. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white bg-opacity-95 transition-all">
          <div className="text-3xl font-bold text-[#004235] mb-6">Chargement de la plateforme...</div>
          <div className="w-80 h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#cda86b] to-[#004235] rounded-full transition-all duration-200"
              style={{ width: `${loadingPercent}%` }}
            ></div>
          </div>
          <div className="text-xl font-semibold text-[#cda86b]">{loadingPercent}%</div>
          <div className="mt-6 text-gray-500 text-sm">Préparation des données, intelligence artificielle, et carte interactive...</div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;