import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function GET() {
  const caja = await prisma.caja.findFirst({
    where: { cierre: { not: null } },
    orderBy: { cierre: 'desc' },
    include: { usuario: true }
  })

  if (!caja) {
    return NextResponse.json({ error: 'No hay cajas cerradas' }, { status: 404 })
  }

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([600, 300])
  const font = await pdf.embedFont(StandardFonts.Helvetica)

  page.drawText('Corte de Caja', { x: 50, y: 250, size: 20, font })
  page.drawText(`ID Caja: ${caja.id}`, { x: 50, y: 220, size: 12, font })
  page.drawText(`Apertura: ${caja.apertura.toISOString()}`, { x: 50, y: 200, size: 12, font })
  page.drawText(`Cierre: ${caja.cierre?.toISOString()}`, { x: 50, y: 180, size: 12, font })
  page.drawText(`Total: $${caja.total?.toFixed(2) || '0.00'}`, { x: 50, y: 160, size: 12, font })
  page.drawText(`Usuario: ${caja.usuario.nombre}`, { x: 50, y: 140, size: 12, font })

  const bytes = await pdf.save()

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=corte_caja.pdf'
    }
  })
}
