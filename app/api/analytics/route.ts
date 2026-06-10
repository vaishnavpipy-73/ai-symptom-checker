import { NextResponse } from 'next/server';
import dataset from '@/data/dataset.json';

export async function GET() {
  try {
    // Generate pre-seeded analytics representing typical platform trends
    const stats = {
      predictionCount: 1420,
      activeUsers: 345,
      accuracyRate: 94.2,
      popularSymptoms: [
        { name: 'Persistent Cough', count: 480 },
        { name: 'High Fever', count: 320 },
        { name: 'Extreme Fatigue', count: 290 },
        { name: 'Muscle Body Aches', count: 210 },
        { name: 'Sore Throat', count: 180 }
      ],
      diseaseTrends: [
        { name: 'Common Cold', count: 410 },
        { name: 'Influenza (Flu)', count: 320 },
        { name: 'COVID-19', count: 280 },
        { name: 'GERD (Acid Reflux)', count: 190 },
        { name: 'Bronchial Asthma', count: 110 }
      ],
      monthlyPredictions: [
        { month: 'Jan', count: 120 },
        { month: 'Feb', count: 150 },
        { month: 'Mar', count: 220 },
        { month: 'Apr', count: 180 },
        { month: 'May', count: 280 },
        { month: 'Jun', count: 470 }
      ]
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('API Error in /api/analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
