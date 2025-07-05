import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const productos = await prisma.producto.findMany({
    orderBy: { creadoEn: 'desc' },
  })
  return NextResponse.json(productos)
}

export async function POST(req: NextRequest) {
  const { nombre, precio, stock, codigoBarra } = await req.json()

  if (!nombre || !precio || !stock || !codigoBarra) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  try {
    const nuevo = await prisma.producto.create({
      data: { nombre, precio, stock, codigoBarra },
    })
    return NextResponse.json(nuevo, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al crear producto', detalles: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { id, nombre, precio, stock } = await req.json()

  if (!id || !nombre || !precio || !stock) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  try {
    const actualizado = await prisma.producto.update({
      where: { id },
      data: { nombre, precio, stock },
    })
    return NextResponse.json(actualizado)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return NextResponse.json({ error: 'No se pudo actualizar', detalles: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  try {
    await prisma.producto.delete({ where: { id } })
    return NextResponse.json({ message: 'Producto eliminado' })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return NextResponse.json({ error: 'No se pudo eliminar', detalles: message }, { status: 500 })
  }
}
