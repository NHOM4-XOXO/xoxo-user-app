import DetailedPostView from "@/components/main/Post/DetailPostView";


export default async function DetailedVideoPage({ params }) {
    const { id } = await params;

    return <DetailedPostView postId={id} />;
}
