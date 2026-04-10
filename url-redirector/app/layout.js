import './globals.css';

export const metadata = {
  title: 'Gerenciador de Links do Dr. Tigre',
  description: 'O sistema privado de links do Instituto Dr. Tigre',
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
