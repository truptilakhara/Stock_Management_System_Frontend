import { use } from "react";

export default function EditCategory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <div>{id}</div>;
}
