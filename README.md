# TawjeehExplorer

A comprehensive platform for Moroccan students to discover and compare universities and educational programs.

## Features

- 🗺️ Interactive map with 90+ educational institutions
- 🎯 AI-powered student matching system  
- 📊 Advanced filtering and search capabilities
- 💬 Educational chatbot assistant
- 📱 Responsive design for all devices
- 🎓 Detailed school profiles and programs

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account (for database)


### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohamedELBAHA/TawjeehExplorer.git
   cd TawjeehExplorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase:**
   
   Create a `.env` file in the project root by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Then update the values in `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   **How to get Supabase credentials:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project or select existing one
   - Go to **Settings** → **API**
   - Copy the **Project URL** → use as `VITE_SUPABASE_URL`
   - Copy the **Project API Key** (anon/public) → use as `VITE_SUPABASE_ANON_KEY`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Start the backend server (optional - for chatbot):**
   ```bash
   npm run server
   ```

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── data/               # Static data files
├── lib/                # Library configurations
│   └── supabase.ts     # Supabase client setup
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Technologies Used

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Map:** React Leaflet, OpenStreetMap
- **Backend:** Express.js, Node.js
- **Database:** Supabase
- **Build Tool:** Vite
- **Deployment:** Ready for Vercel, Netlify, or any static host

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact us at contact@tawjeehexplorer.com.
