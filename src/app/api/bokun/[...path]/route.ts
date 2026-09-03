import { NextRequest, NextResponse } from "next/server";
import { bokunFetch } from "@/lib/bokun";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest("GET", request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest("POST", request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest("PUT", request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest("DELETE", request, params);
}

async function proxyRequest(
  method: string,
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>,
) {
  try {
    const { path: segments } = await paramsPromise;
    const queryString = request.nextUrl.searchParams.toString();
    const apiPath =
      "/" + segments.join("/") + (queryString ? `?${queryString}` : "");

    let body: unknown = undefined;
    if (method !== "GET" && method !== "HEAD") {
      try {
        body = await request.json();
      } catch {
        body = undefined;
      }
    }

    const result = await bokunFetch(method, apiPath, body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bokun proxy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
