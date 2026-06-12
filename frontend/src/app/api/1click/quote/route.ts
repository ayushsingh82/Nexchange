import { NextRequest, NextResponse } from "next/server";
import { OneClickService } from "@defuse-protocol/one-click-sdk-typescript";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await OneClickService.getQuote(body);
    return NextResponse.json(result.quote);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = (err as any)?.status ?? 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
