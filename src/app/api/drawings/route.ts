import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data, strokes } = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }
    if (!session.user.id) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }
    const drawing = await prisma.drawing.create({
      data: {
        data,
        strokes: JSON.stringify(strokes), // Store strokes as a JSON string
        userId: session.user.id,
      },
    });
    return NextResponse.json(drawing, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const drawings = await prisma.drawing.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        data: true,
        strokes: true,
        createdAt: true
      }
    });
    // Parse strokes JSON for each drawing
    const parsedDrawings = drawings.map(drawing => ({
      ...drawing,
      strokes: drawing.strokes ? JSON.parse(drawing.strokes) : []
    }));
    return NextResponse.json(parsedDrawings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}