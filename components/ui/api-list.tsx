"use client";

import { UseOrigin } from "@/hooks/use-origin";

import APIAlert from "./api-alert";

interface APIListProps {
  entityName: string;
  entityId: string;
}

const APIList: React.FC<APIListProps> = ({ entityName, entityId }) => {
  const origin = UseOrigin();

  const baseUrl = `${origin}/api`;

  return (
    <div className="space-y-2 mb-10">
      <APIAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <APIAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/<${entityId}>`}
      />
      <APIAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <APIAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/<${entityId}>`}
      />
      <APIAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/<${entityId}>`}
      />
    </div>
  );
};

export default APIList;
