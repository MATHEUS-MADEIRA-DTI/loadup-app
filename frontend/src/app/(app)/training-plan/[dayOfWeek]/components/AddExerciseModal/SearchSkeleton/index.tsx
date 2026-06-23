"use client";

import { SkeletonContainer, SkeletonItem } from "./styles";

interface SearchSkeletonProps {
  count?: number;
}

export function SearchSkeleton({ count = 3 }: SearchSkeletonProps) {
  return (
    <SkeletonContainer>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </SkeletonContainer>
  );
}
