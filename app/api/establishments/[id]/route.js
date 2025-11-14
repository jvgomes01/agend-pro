/**
 * API Route: Estabelecimento (edição)
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/app'
import { sanitizeString, sanitizePhone, sanitizeHTML } from '@/lib/security/sanitize'
import { slugify } from '@/lib/utils/slug'

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    const { id } = params
    const existing = await prisma.establishment.findUnique({
      where: { id },
      select: { id: true, userId: true, slug: true },
    })

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND },
      )
    }

    const rawData = await request.json()

    const updates = {}

    if (rawData.name !== undefined) {
      updates.name = sanitizeHTML(sanitizeString(rawData.name))
    }
    if (rawData.address !== undefined) {
      updates.address = sanitizeHTML(sanitizeString(rawData.address))
    }
    if (rawData.phone !== undefined) {
      updates.phone = sanitizePhone(rawData.phone)
    }
    if (rawData.type !== undefined) {
      updates.type = sanitizeString(rawData.type)
    }
    if (rawData.slug !== undefined) {
      const baseSlug = slugify(rawData.slug || updates.name || existing.slug)
      updates.slug = baseSlug
    }

    const establishment = await prisma.establishment.update({
      where: { id },
      data: updates,
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
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[ESTABLISHMENT_PATCH_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
