import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Check for loading parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('showLoading') === 'true' && user) {
      // User is already logged in and came from home page, redirect to platform
      navigate('/platform', { replace: true });
    }
  }, [user, location.search, navigate]);

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/platform" replace />;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Check for admin credentials first
      if (formData.email === 'admin@mail.com' && formData.password === 'admin') {
        // Create admin session in localStorage
        const adminUser = {
          id: 'admin-user',
          email: 'admin@mail.com',
          user_metadata: {
            name: 'Administrator'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {},
          aud: 'authenticated',
          role: 'admin'
        };
        
        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        
        // Trigger a storage event to notify AuthContext
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'admin_session',
          newValue: JSON.stringify(adminUser)
        }));
        
        // Check if user came from home page wanting to access platform
        const from = (location.state as any)?.from?.pathname;
        const shouldShowLoading = from === '/' || location.pathname === '/login';
        
        if (shouldShowLoading) {
          // Redirect to home with loading parameter
          navigate('/?showLoading=true', { replace: true });
        } else {
          // Direct access to platform
          navigate('/platform', { replace: true });
        }
        return;
      }

      // Regular Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        let errorMessage = 'Une erreur est survenue lors de la connexion';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
        } else if (error.message) {
          errorMessage = error.message;
        }

        setErrors({ submit: errorMessage });
        return;
      }

      if (data.user) {
        // Check if user came from home page wanting to access platform
        const from = (location.state as any)?.from?.pathname;
        const shouldShowLoading = from === '/' || location.pathname === '/login';
        
        if (shouldShowLoading) {
          // Redirect to home with loading parameter
          navigate('/?showLoading=true', { replace: true });
        } else {
          // Direct access to platform
          navigate('/platform', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrors({ 
        submit: 'Une erreur inattendue s\'est produite. Veuillez réessayer.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setErrors({ email: 'Veuillez saisir votre email pour réinitialiser le mot de passe' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Format d\'email invalide' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ 
          submit: 'Un email de réinitialisation a été envoyé à votre adresse email.' 
        });
        setShowForgotPassword(false);
      }
    } catch (err) {
      setErrors({ 
        submit: 'Erreur lors de l\'envoi de l\'email de réinitialisation' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004235] via-[#004235]/90 to-[#cda86b] flex items-center justify-center p-4 relative">
      {/* Background Elements for Glassmorphism */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#cda86b]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-md w-full relative">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            {/* Logo/Brand */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Tawjeeh Navigator</h1>
              <div className="w-12 h-1 bg-gradient-to-r from-white/60 to-[#cda86b] mx-auto rounded-full"></div>
            </div>
            <p className="text-white/70">
              Accédez à votre compte
            </p>
          </div>

        {showForgotPassword ? (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white">Mot de passe oublié</h3>
              <p className="text-sm text-white/70 mt-2">
                Saisissez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                id="resetEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#cda86b] focus:border-[#cda86b] transition-all ${
                  errors.email 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300' 
                    : ''
                }`}
                placeholder="votre.email@exemple.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {errors.submit && (
              <div className={`border rounded-xl p-4 backdrop-blur-sm ${
                errors.submit.includes('envoyé') 
                  ? 'bg-green-500/20 border-green-400/30' 
                  : 'bg-red-500/20 border-red-400/30'
              }`}>
                <p className={`text-sm ${
                  errors.submit.includes('envoyé') 
                    ? 'text-green-200' 
                    : 'text-red-200'
                }`}>
                  {errors.submit}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  isLoading
                    ? 'bg-white/20 cursor-not-allowed text-white/50'
                    : 'bg-[#cda86b] hover:bg-[#cda86b]/80 text-[#004235] focus:outline-none focus:ring-2 focus:ring-white/50'
                }`}
              >
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrors({});
                }}
                className="flex-1 py-3 px-4 bg-white/10 border border-white/30 rounded-xl font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#cda86b] focus:border-[#cda86b] transition-all ${
                  errors.email 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300' 
                    : ''
                }`}
                placeholder="votre.email@exemple.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#cda86b] focus:border-[#cda86b] transition-all ${
                  errors.password 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300' 
                    : ''
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#cda86b] hover:text-[#cda86b]/80 transition-all"
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-red-200">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                isLoading
                  ? 'bg-white/20 cursor-not-allowed text-white/50'
                  : 'bg-[#cda86b] hover:bg-[#cda86b]/80 text-[#004235] focus:outline-none focus:ring-2 focus:ring-white/50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-transparent rounded-full mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        )}

        {!showForgotPassword && (
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-white/70">
              Vous n'avez pas de compte ?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-[#cda86b] hover:text-[#cda86b]/80 transition-all"
              >
                Créer un compte
              </Link>
            </p>
            
            <p className="text-sm">
              <Link 
                to="/" 
                className="text-white/60 hover:text-white/80 transition-all"
              >
                ← Retour à l'accueil
              </Link>
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
