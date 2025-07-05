import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const productos = await prisma.producto.findMany({
    where: { activo: true }
  })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Inventario')

  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Código de Barras', key: 'codigoBarra', width: 25 },
    { header: 'Precio', key: 'precio', width: 15 },
    { header: 'Stock', key: 'stock', width: 10 }
  ]

  productos.forEach(p => {
    sheet.addRow({
      id: p.id,
      nombre: p.nombre,
      codigoBarra: p.codigoBarra,
      precio: p.precio,
      stock: p.stock
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=inventario.xlsx'
    }
  })
}
