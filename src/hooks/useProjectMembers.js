import { useCallback, useState } from "react";
import api from "@/api/api";

export default function useProjectMembers(projectId) {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberError, setMemberError] = useState("");

  const fetchMembers = useCallback(async () => {
    if (!projectId) {
      setMembers([]);
      return;
    }

    try {
      setLoadingMembers(true);
      setMemberError("");

      const res = await api.get(`/members/${projectId}`);
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setMembers(data);
    } catch (err) {
      setMemberError(err.response?.data?.message || "Failed to fetch members");
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [projectId]);

  const inviteMember = useCallback(async ({ user_id, invite_email, role = "member" }) => {
    if (!projectId) return;

    await api.post("/members/invite", {
      project_id: projectId,
      user_id: user_id || null,
      invite_email: invite_email || null,
      role,
    });
  }, [projectId]);

  return {
    members: Array.isArray(members) ? members : [],
    loadingMembers,
    memberError,
    fetchMembers,
    inviteMember,
    setMemberError,
  };
}
