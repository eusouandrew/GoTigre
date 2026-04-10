import './globals.css';

export const metadata = {
  title: 'Gerenciador de Links Rápidos',
  description: 'Seu sistema privativo de encurtamento profissional',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
