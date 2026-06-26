"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, X } from "lucide-react";
import styled from "styled-components";

import {
  useFriends,
  useFriendStatus,
  useSearchUsers,
  useSendFriendRequest,
} from "@/hooks/useFriendship";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function UserActionBtn({ userId }: { userId: string }) {
  const status = useFriendStatus(userId);
  const sendRequest = useSendFriendRequest();
  const router = useRouter();

  if (status.isLoading)
    return (
      <ActionBtn $variant="outlined" disabled>
        ...
      </ActionBtn>
    );

  const s = status.data?.status ?? "none";

  if (s === "accepted") {
    return (
      <ActionBtn
        $variant="filled"
        onClick={() => router.push(`/friends/${userId}`)}
      >
        Ver treino
      </ActionBtn>
    );
  }

  if (s === "pending") {
    return <PendingBadge>Aguardando</PendingBadge>;
  }

  return (
    <ActionBtn
      $variant="outlined"
      onClick={() => sendRequest.mutate(userId)}
      disabled={sendRequest.isPending}
    >
      Adicionar
    </ActionBtn>
  );
}
export default function FriendsTab() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const friends = useFriends();
  const search = useSearchUsers(query);
  const sendRequest = useSendFriendRequest();
  const showSearch = query.trim().length >= 2;

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchIconWrap size={18} />
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pessoas por nome..."
        />
        {query && (
          <ClearBtn onClick={() => setQuery("")}>
            <X size={16} />
          </ClearBtn>
        )}
      </SearchWrapper>

      {showSearch && (
        <Section>
          <SectionLabel>Resultados</SectionLabel>
          {search.isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : search.data?.length === 0 ? (
            <EmptyText>Nenhum resultado para "&ldquo;{query}&rdquo;"</EmptyText>
          ) : (
            search.data?.map((user) => (
              <UserCard key={user._id}>
                <Avatar>{getInitials(user.name)}</Avatar>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserSub>
                    {user.isPublic ? "Perfil público" : "Perfil privado"}
                  </UserSub>
                </UserInfo>
                <UserActionBtn userId={user._id} />
              </UserCard>
            ))
          )}
        </Section>
      )}

      {!showSearch && (
        <Section>
          <SectionLabel>Meus amigos</SectionLabel>
          {friends.isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : friends.data?.length === 0 ? (
            <EmptyState>
              <Users size={40} strokeWidth={1.5} />
              <EmptyTitle>Nenhum amigo ainda</EmptyTitle>
              <EmptySubtitle>
                Busque por nome para adicionar pessoas
              </EmptySubtitle>
            </EmptyState>
          ) : (
            friends.data?.map((f) => (
              <UserCard key={f.friendshipId}>
                <Avatar>{getInitials(f.friend.name)}</Avatar>
                <UserInfo>
                  <UserName>{f.friend.name}</UserName>
                  <UserSub>
                    {f.friend.isPublic ? "Perfil público" : "Perfil privado"}
                  </UserSub>
                </UserInfo>
                <ActionBtn
                  onClick={() => router.push(`/friends/${f.friend._id}`)}
                  $variant="filled"
                >
                  Ver treino
                </ActionBtn>
              </UserCard>
            ))
          )}
        </Section>
      )}
    </Wrapper>
  );
}

/* ─── Styled Components ─────────────────────────── */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 100%;
  padding: 24px 0 4%;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrap = styled(Search)`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 48px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  font-family: var(--font-inter), sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurface};
  outline: none;
  transition: border-color 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  padding-left: 4px;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: 12px 16px;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 16px;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.onSurface};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const UserSub = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin: 2px 0 0;
`;

const ActionBtn = styled.button<{ $variant: "filled" | "outlined" }>`
  height: 36px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 150ms ease;
  background: ${({ theme, $variant }) =>
    $variant === "filled" ? theme.colors.primary : "transparent"};
  color: ${({ theme, $variant }) =>
    $variant === "filled" ? theme.colors.onPrimary : theme.colors.primary};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
  border: 1px dashed ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

const EmptyTitle = styled.p`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 20px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

const EmptySubtitle = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  margin: 0;
`;

const EmptyText = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: 24px 0;
  margin: 0;
`;

const SkeletonCard = styled.div`
  height: 68px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  opacity: 0.5;
`;
const PendingBadge = styled.span`
  height: 36px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  display: flex;
  align-items: center;
`;
