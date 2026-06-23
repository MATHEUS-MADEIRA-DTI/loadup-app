"use client";

import { useState } from "react";

import { strings } from "@/constants/strings";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import {
  StyledSuccess,
  StyledTabBar,
  StyledTabButton,
  StyledTabContent,
  StyledTabIndicator,
  StyledWrapper,
} from "./styles";

type Tab = "login" | "register";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleTabSwitch = (next: Tab) => {
    setTab(next);
    setRegisterSuccess(false);
  };

  const handleRegisterSuccess = () => {
    setTab("login");
    setRegisterSuccess(true);
  };

  return (
    <StyledWrapper>
      <StyledTabBar>
        <StyledTabButton
          type="button"
          $active={tab === "login"}
          onClick={() => handleTabSwitch("login")}
        >
          {strings.auth.loginTitle}
        </StyledTabButton>
        <StyledTabButton
          type="button"
          $active={tab === "register"}
          onClick={() => handleTabSwitch("register")}
        >
          {strings.auth.registerTitle}
        </StyledTabButton>
        <StyledTabIndicator $right={tab === "register"} />
      </StyledTabBar>

      <StyledTabContent key={tab}>
        {tab === "login" && registerSuccess && (
          <StyledSuccess>{strings.auth.registerSuccess}</StyledSuccess>
        )}
        {tab === "login" ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}
      </StyledTabContent>
    </StyledWrapper>
  );
}
