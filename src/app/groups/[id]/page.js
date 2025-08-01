
import GroupDetailLayout from "@/components/groups/GroupDetailLayout";

export default async function GroupDetailPage({ params }) {
  const { id } = await params;
  return <GroupDetailLayout groupId={id} />;
}
