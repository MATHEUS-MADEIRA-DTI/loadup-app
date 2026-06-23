"use client";

import { useState } from "react";

import { strings } from "@/constants/strings";
import { useRegister } from "@/hooks/useAuth";

import {
  StyledError,
  StyledEyeButton,
  StyledFieldWrapper,
  StyledFloatingLabel,
  StyledForm,
  StyledInput,
  StyledInputIcon,
  StyledInputRow,
  StyledSubmitButton,
} from "./styles";

interface RegisterFormProps {
  onSuccess: () => void;
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  );
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwMismatch, setPwMismatch] = useState(false);
  const register = useRegister({ onSuccess });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPwMismatch(true);
      return;
    }
    setPwMismatch(false);
    register.mutate({ name, email, password });
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      {(register.error || pwMismatch) && (
        <StyledError>
          {pwMismatch
            ? strings.auth.errorPasswordMismatch
            : register.error?.message || strings.auth.errorGeneric}
        </StyledError>
      )}

      <StyledFieldWrapper>
        <StyledFloatingLabel>{strings.auth.nameLabel}</StyledFloatingLabel>
        <StyledInputRow>
          <StyledInputIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </StyledInputIcon>
          <StyledInput
            type="text"
            placeholder={strings.auth.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </StyledInputRow>
      </StyledFieldWrapper>

      <StyledFieldWrapper>
        <StyledFloatingLabel>{strings.auth.emailLabel}</StyledFloatingLabel>
        <StyledInputRow>
          <StyledInputIcon>
            <svg width="18" height="14" viewBox="0 0 20 16" fill="currentColor">
              <path d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V2l8 5 8-5v2z" />
            </svg>
          </StyledInputIcon>
          <StyledInput
            type="email"
            placeholder={strings.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </StyledInputRow>
      </StyledFieldWrapper>

      <StyledFieldWrapper>
        <StyledFloatingLabel>{strings.auth.passwordLabel}</StyledFloatingLabel>
        <StyledInputRow>
          <StyledInputIcon>
            <svg width="14" height="18" viewBox="0 0 14 20" fill="currentColor">
              <path d="M12 8h-1V6c0-2.76-2.24-5-5-5S1 3.24 1 6v2H0v12h14V8h-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H2.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
            </svg>
          </StyledInputIcon>
          <StyledInput
            type={showPw ? "text" : "password"}
            placeholder={strings.auth.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
          <StyledEyeButton
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon visible={showPw} />
          </StyledEyeButton>
        </StyledInputRow>
      </StyledFieldWrapper>

      <StyledFieldWrapper>
        <StyledFloatingLabel>
          {strings.auth.confirmPasswordLabel}
        </StyledFloatingLabel>
        <StyledInputRow>
          <StyledInputIcon>
            <svg width="14" height="18" viewBox="0 0 14 20" fill="currentColor">
              <path d="M12 8h-1V6c0-2.76-2.24-5-5-5S1 3.24 1 6v2H0v12h14V8h-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H2.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
            </svg>
          </StyledInputIcon>
          <StyledInput
            type={showConfirmPw ? "text" : "password"}
            placeholder={strings.auth.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPwMismatch(false);
            }}
            required
            autoComplete="new-password"
            minLength={6}
          />
          <StyledEyeButton
            type="button"
            onClick={() => setShowConfirmPw((v) => !v)}
            aria-label={showConfirmPw ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon visible={showConfirmPw} />
          </StyledEyeButton>
        </StyledInputRow>
      </StyledFieldWrapper>

      <StyledSubmitButton type="submit" disabled={register.isPending}>
        {register.isPending
          ? strings.common.loading
          : strings.auth.registerButton}
      </StyledSubmitButton>
    </StyledForm>
  );
}
