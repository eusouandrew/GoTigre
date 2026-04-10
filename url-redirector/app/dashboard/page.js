"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(data => {
        setLinks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-in">
      <header>
        <h1>Links Ativos</h1>
        <p>Acompanhe aqui o seu contador de cliques em tempo real.</p>
      </header>

      <nav className="nav-links">
        <Link href="/">Criar Novo Link</Link>
        <Link href="/dashboard" style={{ color: 'var(--accent-color)' }}>Meus Links (Dashboard)</Link>
      </nav>

      <div className="glass-panel">
        <h2>Seus Redirecionamentos</h2>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Carregando dados...</p>
        ) : links.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Você ainda não criou nenhum link.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Link Curto Personalizado</th>
                  <th>URL de Destino Original</th>
                  <th>Cliques Contabilizados</th>
                  <th>Atalho</th>
                </tr>
              </thead>
              <tbody>
                {links.map(link => {
                  const domain = typeof window !== 'undefined' ? window.location.origin : '';
                  const shortLink = `${domain}/${link.slug}`;
                  return (
                    <tr key={link.id}>
                      <td style={{ fontWeight: '600' }}>/{link.slug}</td>
                      <td>
                        <span style={{ 
                          maxWidth: '200px', 
                          display: 'inline-block', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }} title={link.targetUrl}>
                          {link.targetUrl}
                        </span>
                      </td>
                      <td>
                        <span className="badge">🔥 {link.clicks} clicks</span>
                      </td>
                      <td>
                        <a href={shortLink} target="_blank" rel="noopener noreferrer">Testar Acesso</a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
