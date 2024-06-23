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
        strokes: true,
        createdAt: true
      }
    });

    if (!drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 });
    }

    // Parse strokes JSON
    const parsedDrawing = {
      ...drawing,
      strokes: drawing.strokes ? JSON.parse(drawing.strokes) : []
    };

    return NextResponse.json(parsedDrawing);
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

    const { data, strokes } = await request.json();
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
        strokes: JSON.stringify(strokes), // Store strokes as a JSON string
      },
    });

    // Parse strokes JSON before sending response
    const parsedDrawing = {
      ...updatedDrawing,
      strokes: updatedDrawing.strokes ? JSON.parse(updatedDrawing.strokes) : []
    };

    return NextResponse.json(parsedDrawing);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
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
        }
      });
  
      if (!drawing) {
        return NextResponse.json({ error: 'Drawing not found' }, { status: 404 });
      }
  
      await prisma.drawing.delete({
        where: {
          id: params.id,
          userId: session.user.id
        }
      });
  
      return NextResponse.json({ message: 'Drawing deleted successfully' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }