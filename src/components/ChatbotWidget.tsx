import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

const initialMessages = [
	{
		from: 'bot',
		text: "Bonjour ! 👋 Je suis Afaqi AI, votre assistant intelligent pour l'orientation. Essayez : 'j'ai eu 16 au régional et je veux faire médecine, comment je peux faire ?'",
	},
];

const ChatbotWidget: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState(initialMessages);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (open && inputRef.current) {
			inputRef.current.focus();
		}
	}, [open]);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages, open]);

	const handleSend = async () => {
		if (!input.trim() || loading) return;
		setMessages([...messages, { from: 'user', text: input }]);
		const userMessage = input;
		setInput('');
		setLoading(true);
		try {
			const res = await fetch('http://localhost:5000/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userMessage }),
			});
			const data = await res.json();
			setMessages((msgs) => [
				...msgs,
				{
					from: 'bot',
					text: data.reply || "Désolé, je n'ai pas pu obtenir de réponse.",
				},
			]);
		} catch (err) {
			setMessages((msgs) => [
				...msgs,
				{
					from: 'bot',
					text: `Erreur de connexion au serveur IA: ${
						err instanceof Error ? err.message : String(err)
					}`,
				},
			]);
			console.error('Chatbot fetch error:', err);
		} finally {
			setLoading(false);
		}
	};

	// Centered modal for conversation
	return (
		<>
			{/* Floating AI Button */}
			{!open && (
				<div className={`fixed bottom-8 right-8 z-[9999]`}>
					<button
						onClick={() => setOpen(true)}
						className="bg-[#004235] text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-[#cda86b] transition-colors"
						style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
						aria-label="Ouvrir le chatbot"
					>
						<svg
							width="28"
							height="28"
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="14" cy="14" r="14" fill="#cda86b" />
							<path
								d="M9 14C9 11.7909 10.7909 10 13 10H15C17.2091 10 19 11.7909 19 14C19 16.2091 17.2091 18 15 18H13C10.7909 18 9 16.2091 9 14Z"
								fill="white"
							/>
							<circle cx="12" cy="14" r="1" fill="#004235" />
							<circle cx="16" cy="14" r="1" fill="#004235" />
						</svg>
					</button>
				</div>
			)}
			{/* Centered Chat Modal */}
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
					<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden relative animate-fade-in-up">
						<div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-teal-400 text-white px-6 py-4">
							<div className="flex items-center gap-2">
								<Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
								<span className="font-bold tracking-wide">Afaqi AI</span>
								<span className="ml-2 text-xs bg-yellow-300/80 text-blue-900 px-2 py-1 rounded font-semibold">
									BETA
								</span>
							</div>
							<button
								onClick={() => setOpen(false)}
								aria-label="Fermer"
								className="hover:text-blue-200"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div
							ref={chatRef}
							className="flex-1 px-5 py-4 space-y-3 overflow-y-auto max-h-96 min-h-[180px] bg-blue-50/10"
						>
							{messages.map((msg, i) => (
								<div
									key={i}
									className={`flex ${
										msg.from === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm ${
											msg.from === 'user'
												? 'bg-[#004235] text-white'
												: 'bg-[#cda86b] text-[#004235]'
										}`}
									>
										{msg.text}
									</div>
								</div>
							))}
						</div>
						<div className="p-4 border-t bg-white flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								className="flex-1 border border-[#cda86b] rounded-l-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004235]"
								placeholder="Posez votre question..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleSend();
								}}
								autoFocus
								disabled={loading}
							/>
							<button
								className="bg-[#004235] text-white px-5 py-2 rounded-r-xl font-semibold hover:bg-[#cda86b] hover:text-white transition-colors disabled:opacity-60"
								onClick={handleSend}
								disabled={loading}
							>
								{loading ? '...' : 'Envoyer'}
							</button>
						</div>
					</div>
				</div>
			)}
			<style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
        .drop-shadow-glow { filter: drop-shadow(0 0 8px #facc15); }
        .animate-fade-in { animation: fadeIn 0.3s; }
        .animate-fade-in-up { animation: fadeInUp 0.4s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
		</>
	);
};

export default ChatbotWidget;
