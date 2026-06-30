"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { ArrowLeft, Camera, ImageDown, Share2, X } from "lucide-react";
import html2canvas from "html2canvas";

import WorkoutShareCard, { WorkoutShareCardProps } from "./WorkoutShareCard";
import CardBold from "./templates/CardBold";
import CardMinimal from "./templates/CardMinimal";
import CardStats from "./templates/CardStats";

const TEMPLATES = [
  { id: "classic" as const, label: "Clássico", Component: WorkoutShareCard },
  { id: "bold" as const, label: "Impacto", Component: CardBold },
  { id: "minimal" as const, label: "Minimal", Component: CardMinimal },
  { id: "stats" as const, label: "Estatísticas", Component: CardStats },
];

type TemplateId = (typeof TEMPLATES)[number]["id"];

interface ShareSheetProps extends WorkoutShareCardProps {
  onClose: () => void;
}

export default function ShareSheet({
  dayName,
  date,
  stats,
  topExercises,
  onClose,
}: ShareSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("classic");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [startY, setStartY] = useState(0);
  const [dragY, setDragY] = useState(0);

  const sheetRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Clear generated image when user edits template/photo
  useEffect(() => {
    setGeneratedUrl(null);
  }, [selectedTemplate, photoUrl]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startY;
    if (delta > 0) setDragY(delta);
  };

  const handleTouchEnd = () => {
    if (dragY > 100) onClose();
    setDragY(0);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      await document.fonts.ready;

      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#020617",
        width: 360,
        height: 640,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      setGeneratedUrl(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    if (!generatedUrl) return;
    const response = await fetch(generatedUrl);
    const blob = await response.blob();
    const file = new File([blob], "loadup-treino.png", { type: "image/png" });
    try {
      if (
        typeof navigator.share === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Meu treino no LoadUp",
          text: `${dayName} · ${stats.exercises} exercícios · ${stats.kg}kg`,
        });
      } else {
        downloadBlob(blob);
      }
    } catch {
      // user cancelled or not supported
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    const response = await fetch(generatedUrl);
    const blob = await response.blob();
    downloadBlob(blob);
  };

  if (!mounted) return null;

  const cardProps: WorkoutShareCardProps = {
    dayName,
    date,
    stats,
    topExercises,
    photoUrl,
  };

  const ActiveTemplate = TEMPLATES.find(
    (t) => t.id === selectedTemplate,
  )!.Component;

  return createPortal(
    <>
      <Backdrop onClick={onClose} />
      <Sheet
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${dragY}px)`,
          transition:
            dragY > 0
              ? "none"
              : "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Handle />

        <SheetHeader>
          {generatedUrl ? (
            <BackBtn type="button" onClick={() => setGeneratedUrl(null)}>
              <ArrowLeft size={16} />
              Editar
            </BackBtn>
          ) : (
            <SheetTitle>Compartilhar Treino</SheetTitle>
          )}
          <CloseBtn onClick={onClose} aria-label="Fechar">
            <X size={16} />
          </CloseBtn>
        </SheetHeader>

        {generatedUrl ? (
          /* ── Generated image view ── */
          <>
            <GeneratedPreviewArea>
              <GeneratedImg src={generatedUrl} alt="Card do treino" />
            </GeneratedPreviewArea>
            <SaveHint>
              <SaveHintIcon>👆</SaveHintIcon>
              <SaveHintText>
                Pressione e segure a imagem para salvar na galeria
              </SaveHintText>
            </SaveHint>
            <ShareRow>
              <DownloadBtn
                type="button"
                onClick={() => {
                  void handleDownload();
                }}
                aria-label="Baixar"
              >
                <ImageDown size={18} />
              </DownloadBtn>
              <ShareBtn
                type="button"
                onClick={() => {
                  void handleShare();
                }}
              >
                <Share2 size={16} />
                Compartilhar
              </ShareBtn>
            </ShareRow>
          </>
        ) : (
          /* ── Edit view ── */
          <>
            {/* Card preview — scrollable so it doesn't push controls off screen */}
            <ScrollableContent>
              <PreviewScroll>
                <PreviewWrapper>
                  <ActiveTemplate ref={cardRef} {...cardProps} />
                </PreviewWrapper>
              </PreviewScroll>
            </ScrollableContent>

            {/* Template selector — always visible near the bottom */}
            <TemplateSelectorScroll>
              <TemplateSelectorRow>
                {TEMPLATES.map((t) => (
                  <TemplatePill
                    key={t.id}
                    type="button"
                    $active={selectedTemplate === t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                  >
                    {t.label}
                  </TemplatePill>
                ))}
              </TemplateSelectorRow>
            </TemplateSelectorScroll>

            {/* Photo + Generate — always visible */}
            <ActionsRow>
              <PhotoBtn
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
                {photoUrl ? "Trocar foto" : "Adicionar foto"}
              </PhotoBtn>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
              <GenerateBtn
                type="button"
                onClick={() => {
                  void handleGenerate();
                }}
                disabled={isCapturing}
              >
                {isCapturing ? "Gerando..." : "Gerar imagem"}
              </GenerateBtn>
            </ActionsRow>
          </>
        )}
      </Sheet>
    </>,
    document.body,
  );
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "loadup-treino.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Styles ─────────────────────────────────────────── */

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  z-index: 999;
`;

const Sheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: 24px 24px 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding: 12px 0 40px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${slideUp} 320ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.4);
  max-height: 90vh;
  overflow: hidden;
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: transparent;
  margin: 0 auto;
  @media (max-width: 768px) {
    background: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const SheetTitle = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 900;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 0;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  @media (max-width: 768px) {
    display: none;
  }
`;

/* ── Generated view ── */

const GeneratedPreviewArea = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 20px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const GeneratedImg = styled.img`
  display: block;
  width: 100%;
  max-width: 360px;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const SaveHint = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  margin: 0 20px;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

const SaveHintIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const SaveHintText = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.4;
`;

const ShareRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 20px;
`;

const DownloadBtn = styled.button`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 150ms ease,
    color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ShareBtn = styled.button`
  flex: 1;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 900;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.primary};
`;

/* ── Edit view ── */

const TemplateSelectorScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 20px;
  padding-bottom: 20px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TemplateSelectorRow = styled.div`
  display: flex;
  gap: 8px;
  width: max-content;
`;

const TemplatePill = styled.button<{ $active: boolean }>`
  height: 34px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primaryContainer : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  white-space: nowrap;
  transition: all 150ms ease;
`;

const ScrollableContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PreviewScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 20px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PreviewWrapper = styled.div`
  display: inline-block;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 20px;
`;

const PhotoBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 18px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 150ms ease,
    color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GenerateBtn = styled.button`
  flex: 1;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 900;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.primary};
  transition: opacity 150ms ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
