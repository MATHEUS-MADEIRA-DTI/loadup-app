"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Video,
  Lightbulb,
} from "lucide-react";

import { strings } from "@/constants/strings";
import { extractYouTubeId, getYouTubeThumbnailUrl } from "@/lib/youtube";

import {
  StyledSection,
  StyledHeader,
  StyledHeaderIcons,
  StyledTabContainer,
  StyledTabButton,
  StyledTabContent,
  StyledVideoContainer,
  StyledVideoThumbnail,
  StyledPlayButton,
  StyledExerciseName,
  StyledWatchLink,
  StyledNoVideo,
  StyledTipsList,
  StyledTipItem,
  StyledTipText,
  StyledNoTips,
} from "./styles";

interface VideoTipsSectionProps {
  videoUrl?: string;
  tip?: string;
  exerciseName: string;
}

export function VideoTipsSection({
  videoUrl,
  tip,
  exerciseName,
}: VideoTipsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "tips">("video");

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      toggleExpand();
    }
  };

  const parsedTips = tip
    ? tip
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : [];

  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;
  const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

  return (
    <StyledSection>
      <StyledHeader
        onClick={toggleExpand}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <StyledHeaderIcons>
          <span>{strings.videoTips.sectionLabel.replace("📹 ", "")}</span>
        </StyledHeaderIcons>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </StyledHeader>

      {isExpanded && (
        <>
          <StyledTabContainer>
            <StyledTabButton
              $isActive={activeTab === "video"}
              onClick={() => setActiveTab("video")}
              type="button"
            >
              <Video size={14} />
              {strings.videoTips.videoTab}
            </StyledTabButton>
            <StyledTabButton
              $isActive={activeTab === "tips"}
              onClick={() => setActiveTab("tips")}
              type="button"
            >
              <Lightbulb size={14} />
              {strings.videoTips.tipsTab}
              {parsedTips.length > 0 && ` (${parsedTips.length})`}
            </StyledTabButton>
          </StyledTabContainer>

          <StyledTabContent>
            {activeTab === "video" ? (
              videoUrl && videoId && thumbnailUrl ? (
                <>
                  <StyledVideoContainer
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <StyledVideoThumbnail
                      src={thumbnailUrl}
                      alt={`${exerciseName} video thumbnail`}
                    />
                    <StyledPlayButton>
                      <svg viewBox="0 0 68 48" fill="none">
                        <rect width="68" height="48" rx="14" fill="#FF0000" />
                        <path d="M27 15L49 24L27 33V15Z" fill="white" />
                      </svg>
                    </StyledPlayButton>
                  </StyledVideoContainer>
                  <StyledExerciseName>{exerciseName}</StyledExerciseName>
                  <StyledWatchLink
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} />
                    {strings.videoTips.watchLink}
                  </StyledWatchLink>
                </>
              ) : (
                <StyledNoVideo>{strings.videoTips.noVideo}</StyledNoVideo>
              )
            ) : parsedTips.length > 0 ? (
              <StyledTipsList>
                {parsedTips.map((tipText, idx) => (
                  <StyledTipItem key={idx}>
                    <CheckCircle2 size={18} />
                    <StyledTipText>{tipText}</StyledTipText>
                  </StyledTipItem>
                ))}
              </StyledTipsList>
            ) : (
              <StyledNoTips>{strings.videoTips.noTips}</StyledNoTips>
            )}
          </StyledTabContent>
        </>
      )}
    </StyledSection>
  );
}
