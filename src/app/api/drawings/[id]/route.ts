import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const drawing = await prisma.drawing.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      },
      select: {
        id: true,
        data: true,
        createdAt: true
      }
    });

    if (!drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 });
    }

    return NextResponse.json(drawing);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data } = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const updatedDrawing = await prisma.drawing.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        data,
      },
    });

    return NextResponse.json(updatedDrawing);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}