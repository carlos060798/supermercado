import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  // Buscar usuario activo por email
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  })

  if (!usuario || !usuario.activo) {
    return NextResponse.json({ error: 'Usuario no encontrado o inactivo' }, { status: 403 })
  }

  const valido = await bcrypt.compare(password, usuario.password)

  if (!valido) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  // Devuelve los datos básicos
  return NextResponse.json({
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  })
}
