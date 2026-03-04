import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { mediaId } = await req.json();
    
    // TODO: Check if user already voted (IP-based or session)
    // TODO: Increment vote in Supabase
    
    console.log(`Vote received for media: ${mediaId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Vote recorded' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
