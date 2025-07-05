import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

  const ventas = await prisma.venta.findMany({
    where: { fecha: { gte: inicioMes } },
    include: { usuario: true }
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Ventas del Mes')

  sheet.columns = [
    { header: 'ID Venta', key: 'id', width: 10 },
    { header: 'Fecha', key: 'fecha', width: 20 },
    { header: 'Total', key: 'total', width: 15 },
    { header: 'Usuario', key: 'usuario', width: 25 }
  ]

  ventas.forEach(v => {
    sheet.addRow({
      id: v.id,
      fecha: v.fecha.toISOString(),
      total: v.total,
      usuario: v.usuario.nombre
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=ventas.xlsx'
    }
  })
}
