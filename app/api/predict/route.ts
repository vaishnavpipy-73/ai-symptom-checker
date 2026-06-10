import { NextResponse } from 'next/server';
import { predictDiseases } from '@/lib/mlClassifier';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms, customDiseases } = body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { error: 'Invalid input. "symptoms" must be an array of symptom IDs.' },
        { status: 400 }
      );
    }

    const predictions = predictDiseases(symptoms, customDiseases);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      predictions,
    });
  } catch (error: any) {
    console.error('API Error in /api/predict:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
