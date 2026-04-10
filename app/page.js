"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [slugText, setSlugText] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    
    const finalSlug = slugText.trim();
    
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: url.trim(),
          slug: finalSlug
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar o link');
      }
      
      const domain = typeof window !== 'undefined' ? window.location.origin : '';
      setStatus({ 
        type: 'success', 
        text: 'Redirecionamento gerado com sucesso!',
        link: `${domain}/${finalSlug}`
      });
      setSlugText('');
      setUrl('');
      
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="animate-in">
      <header>
        <h1>Redirecionador Pro</h1>
        <p>Crie links limpos e monitore seus acessos em tempo real.</p>
      </header>

      <nav className="nav-links">
        <Link href="/">Criar Novo Link</Link>
        <Link href="/dashboard">Meus Links (Dashboard)</Link>
      </nav>

      <div className="glass-panel">
        <h2>Novo Redirecionamento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">Qual URL grande o usuário vai acessar?</label>
            <input 
              id="url"
              type="url" 
              placeholder="https://exemplo.com/produto/12301923" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Qual será o seu link curto personalizado?</label>
            <div className="input-wrapper">
              <span className="prefix">/</span>
              <input 
                id="slug"
                type="text" 
                placeholder="meutexto" 
                value={slugText}
                onChange={(e) => setSlugText(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                required 
              />
            </div>
          </div>

          <button type="submit">Criar Magic Link 🚀</button>
        </form>

        {status && (
          <div className={`message ${status.type}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>{status.text}</div>
            {status.link && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={status.link} 
                  style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.9rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => {
                    navigator.clipboard.writeText(status.link);
                    const btn = document.getElementById('copyBtn');
                    if(btn) { btn.innerText = 'Copiado! ✓'; setTimeout(() => btn.innerText = 'Copiar Link', 2500); }
                  }}
                  id="copyBtn"
                  style={{ width: 'auto', padding: '10px 16px', margin: '0', background: 'rgba(46, 160, 67, 0.2)', color: 'var(--success)', border: '1px solid rgba(46, 160, 67, 0.4)' }}
                >
                  Copiar Link
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
