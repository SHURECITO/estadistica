import { NextRequest, NextResponse } from 'next/server';
import { calculateDistribution, DISTRIBUTION_METAS } from '@/lib/distributions';
import { DistributionType, CalculationMode } from '@/types/distributions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, params, mode, x, x1, x2, alpha } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'El parámetro "type" de distribución es obligatorio.' },
        { status: 400 }
      );
    }

    const meta = DISTRIBUTION_METAS.find((m) => m.id === type);
    if (!meta) {
      return NextResponse.json(
        { error: `Distribución "${type}" no soportada.` },
        { status: 400 }
      );
    }

    const calculationResult = calculateDistribution(
      type as DistributionType,
      params || {},
      (mode || 'left') as CalculationMode,
      { x, x1, x2, alpha }
    );

    return NextResponse.json({
      success: true,
      meta,
      result: calculationResult,
    });
  } catch (error) {
    console.error('Error calculating distribution:', error);
    return NextResponse.json(
      { error: 'Error procesando el cálculo de la distribución.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') || 'normal') as DistributionType;
  const mode = (searchParams.get('mode') || 'left') as CalculationMode;
  const x = searchParams.get('x') ? parseFloat(searchParams.get('x')!) : 0;
  const x1 = searchParams.get('x1') ? parseFloat(searchParams.get('x1')!) : -1;
  const x2 = searchParams.get('x2') ? parseFloat(searchParams.get('x2')!) : 1;
  const alpha = searchParams.get('alpha') ? parseFloat(searchParams.get('alpha')!) : 0.05;

  const meta = DISTRIBUTION_METAS.find((m) => m.id === type);
  if (!meta) {
    return NextResponse.json({ error: `Distribución "${type}" no encontrada.` }, { status: 404 });
  }

  // Build default params from meta
  const params: Record<string, number> = {};
  for (const [key, p] of Object.entries(meta.parameterLabels)) {
    const queryVal = searchParams.get(key);
    params[key] = queryVal ? parseFloat(queryVal) : p.default;
  }

  const result = calculateDistribution(type, params, mode, { x, x1, x2, alpha });
  return NextResponse.json({
    success: true,
    meta,
    params,
    result,
  });
}
