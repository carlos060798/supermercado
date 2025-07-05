import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const ventas = await prisma.venta.findMany({
    include: {
      usuario: true,
      detalles: {
        include: { producto: true }
      }
    },
    orderBy: { fecha: 'desc' }
  })
  return NextResponse.json(ventas)
}

export async function POST(req: NextRequest) {
  const { usuarioId, productos } = await req.json()

  if (!usuarioId || !Array.isArray(productos) || productos.length === 0) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  try {
    const detallesVenta = []
    let total = 0

    for (const item of productos) {
      const producto = await prisma.producto.findUnique({ where: { id: item.id } })
      if (!producto || producto.stock < item.cantidad) {
        return NextResponse.json({ error: `Stock insuficiente para ${producto?.nombre}` }, { status: 400 })
      }

      // Calcula subtotal y acumula
      total += producto.precio * item.cantidad
      detallesVenta.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precio: producto.precio
      })
    }

    // Crea venta y detalles
    const venta = await prisma.venta.create({
      data: {
        usuarioId,
        total,
        detalles: {
          create: detallesVenta
        }
      },
      include: {
        detalles: true
      }
    })

    // Descuenta stock por producto
    for (const item of productos) {
      await prisma.producto.update({
        where: { id: item.id },
        data: { stock: { decrement: item.cantidad } }
      })
    }

    return NextResponse.json(venta, { status: 201 })

  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Error al registrar venta', detalles: errorMessage }, { status: 500 })
  }
}
