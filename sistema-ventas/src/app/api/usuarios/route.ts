/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      creadoEn: true
    }
  })

  return NextResponse.json(usuarios)
}

export async function POST(req: NextRequest) {
  const { nombre, email, password, rol } = await req.json()

  if (!nombre || !email || !password || !rol) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  try {
    const hashed = await bcrypt.hash(password, 10)

    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashed,
        rol
      }
    })

    return NextResponse.json({
      id: nuevo.id,
      nombre: nuevo.nombre,
      email: nuevo.email,
      rol: nuevo.rol
    }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: 'Error al crear usuario', detalles: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { id, nombre, rol } = await req.json()

  if (!id || !nombre || !rol) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  try {
    const actualizado = await prisma.usuario.update({
      where: { id },
      data: { nombre, rol }
    })

    return NextResponse.json(actualizado)
  } catch (e: any) {
    return NextResponse.json({ error: 'No se pudo actualizar', detalles: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  try {
    const desactivado = await prisma.usuario.update({
      where: { id },
      data: { activo: false }
    })

    return NextResponse.json({ message: 'Usuario desactivado', usuario: desactivado })
  } catch (e: any) {
    return NextResponse.json({ error: 'Error al desactivar usuario', detalles: e.message }, { status: 500 })
  }
}
