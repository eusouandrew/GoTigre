import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    // 1. Encontra a URL associada ao slug
    const link = await prisma.link.findUnique({
      where: { slug }
    });

    if (!link) {
      // Retorna 404 customizado se não encontrar
      return new NextResponse('<html><body><h1>404 - Link Quebrado ou Removido</h1><p>O atalho que você tentou acessar não existe mais.</p></body></html>', {
        status: 404,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // 2. Incrementa o contador de cliques assíncronamente no background (nós tentamos!)
    // O await aqui garante a integridade no Vercel que mata tasks soltas se nao tiver await
    await prisma.link.update({
      where: { slug },
      data: { clicks: { increment: 1 } }
    });

    // 3. O redirecionamento 302 que vai funcionar em milisegundos online 24/7
    return NextResponse.redirect(link.targetUrl, { status: 302 });

  } catch (error) {
    return new NextResponse('Erro Interno de Roteamento', { status: 500 });
  }
}
