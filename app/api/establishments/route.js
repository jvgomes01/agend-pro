/**
 * API Route: Estabelecimentos (lista e criação)
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES, ESTABLISHMENT_TYPES } from '@/lib/constants/app'
import { sanitizeString, sanitizePhone, sanitizeHTML } from '@/lib/security/sanitize'
import { slugify } from '@/lib/utils/slug'
import { validateName, validateRequiredPhone, validateMultiple } from '@/lib/validators'

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

function validateEstablishmentPayload(data) {
  const { name, address, phone, type } = data

  return validateMultiple({
    name: () => validateName(name),
    address: () => ({ isValid: !!address, error: address ? null : ERROR_MESSAGES.REQUIRED_FIELD }),
    phone: () => validateRequiredPhone(phone),
    type: () => ({ isValid: !!type, error: type ? null : ERROR_MESSAGES.REQUIRED_FIELD }),
  })
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug
  let counter = 1

  // Garante unicidade do slug
  // Evita loop infinito com um limite razoável
  while (counter < 50) {
    const existing = await prisma.establishment.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) break

    counter += 1
    slug = `${baseSlug}-${counter}`
  }

  return slug
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    const establishments = await prisma.establishment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        type: true,
        bookingToken: true,
      },
    })

    return NextResponse.json(
      { success: true, establishments },
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[ESTABLISHMENTS_GET_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    const rawData = await request.json()

    const data = {
      name: sanitizeHTML(sanitizeString(rawData.name || '')),
      address: sanitizeHTML(sanitizeString(rawData.address || '')),
      phone: sanitizePhone(rawData.phone || ''),
      type: sanitizeString(rawData.type || ESTABLISHMENT_TYPES.BARBERSHOP),
    }

    const validation = validateEstablishmentPayload(data)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: validation.errors,
        },
        { status: HTTP_STATUS.BAD_REQUEST },
      )
    }

    const baseSlug = slugify(data.name)
    const uniqueSlug = await generateUniqueSlug(baseSlug)

    const establishment = await prisma.establishment.create({
      data: {
        name: data.name,
        description: null,
        address: data.address,
        phone: data.phone,
        email: null,
        type: data.type,
        openingHours: null,
        imageUrl: null,
        slug: uniqueSlug,
        bookingToken: null,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        type: true,
      },
    })

    return NextResponse.json(
      { success: true, establishment },
      { status: HTTP_STATUS.CREATED },
    )
  } catch (error) {
    console.error('[ESTABLISHMENTS_POST_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
