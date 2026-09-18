// app/api/mux/asset/route.ts
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    console.log(videoUrl)

    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    // Create the Mux Asset using the external video URL
    const asset = await mux.video.assets.create({
      inputs: [{ url: videoUrl }],
      playback_policy: ["public"],
      video_quality: "basic",
    });

    console.log(asset.id, "  asset ", asset.playback_ids)

    return NextResponse.json({
      muxAssetId: asset.id,
      muxPlaybackId: asset.playback_ids?.[0]?.id || null,
    });
  } catch (error: any) {
    console.error("Mux Asset Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Mux asset" },
      { status: 500 }
    );
  }
}