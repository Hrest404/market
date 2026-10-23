import { NextResponse } from "next/server";
import { getStorageClient, ASSETS_BUCKET } from "@/lib/storage";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
  const client = getStorageClient();
  if (!client) {
    return NextResponse.json(
      { error: "Object Storage credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const listRes = await client.send(
      new ListObjectsV2Command({
        Bucket: ASSETS_BUCKET,
      })
    );

    return NextResponse.json({
      success: true,
      bucket: ASSETS_BUCKET,
      objects: (listRes.Contents || []).map((c) => ({
        key: c.Key,
        size: c.Size,
        lastModified: c.LastModified,
      })),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to list objects in bucket", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const client = getStorageClient();
  if (!client) {
    return NextResponse.json(
      { error: "Object Storage credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const filename = body.filename || `test-upload-${Date.now()}.txt`;
    const content = body.content || "Hello from APEX TECH on Neon Object Storage!";

    await client.send(
      new PutObjectCommand({
        Bucket: ASSETS_BUCKET,
        Key: filename,
        Body: Buffer.from(content, "utf-8"),
        ContentType: "text/plain",
      })
    );

    return NextResponse.json({
      success: true,
      message: "Uploaded successfully to Neon Object Storage",
      bucket: ASSETS_BUCKET,
      key: filename,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to put object in bucket", details: String(err) },
      { status: 500 }
    );
  }
}
