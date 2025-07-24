import DetailedVideoView from "@/components/main/Video/DetailedVideoView";

export default async function DetailedVideoPage({ params }) {
  const { id } = await params;

  return <DetailedVideoView postId={id} />;
}
