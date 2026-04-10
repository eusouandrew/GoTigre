import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const { targetUrl, slug } = await request.json();

    if (!targetUrl || !slug) {
      return NextResponse.json({ error: 'URL Mestre e o Texto Personalizado são obrigatórios' }, { status: 400 });
    }
    
    // Testa se ja tem o https ou http:
    let formattedUrl = targetUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const existingLink = await prisma.link.findUnique({
      where: { slug }
    });

    if (existingLink) {
      return NextResponse.json({ error: 'Este atalho customizado já existe. Tente outro!' }, { status: 409 });
    }

    const link = await prisma.link.create({
      data: {
        targetUrl: formattedUrl,
        slug
      }
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Erro interno ao processar o link' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao buscar links' }, { status: 500 });
  }
}
