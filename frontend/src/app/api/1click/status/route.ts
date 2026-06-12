import { NextRequest, NextResponse } from "next/server";
import { OneClickService } from "@defuse-protocol/one-click-sdk-typescript";

export async function GET(req: NextRequest) {
  try {
    const depositAddress = req.nextUrl.searchParams.get("depositAddress");
    if (!depositAddress) {
      return NextResponse.json({ error: "depositAddress required" }, { status: 400 });
    }
    const result = await OneClickService.getExecutionStatus(depositAddress);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = (err as any)?.status ?? 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
