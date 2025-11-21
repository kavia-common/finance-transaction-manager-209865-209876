import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { Header } from "./components/Header";
import { AccountSummary } from "./components/AccountSummary";
import { TransactionList } from "./components/TransactionList";
import { NewTransactionForm } from "./components/NewTransactionForm";
import { Account } from "./types";
import { colors, spacing } from "./styles/theme";
import { getAccounts } from "./api/client";

// Each <Composition> is an entry in the sidebar!

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [errorAccounts, setErrorAccounts] = useState<string | null>(null);

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    setErrorAccounts(null);
    try {
      const res = await getAccounts();
      setAccounts(res);
    } catch (e: any) {
      setErrorAccounts(e?.message || "Failed to load accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    void loadAccounts();
  }, []);

  return (
    <div style={{ background: colors.background, minHeight: "100%", color: colors.text }}>
      <Header onAuthChange={() => void loadAccounts()} />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: spacing(2) }}>
        <div>
          <AccountSummary accounts={accounts} loading={loadingAccounts} error={errorAccounts} />
          <TransactionList accounts={accounts} />
        </div>
        <div>
          <NewTransactionForm accounts={accounts} onCreated={() => void loadAccounts()} />
        </div>
      </div>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />

      {/* Banking dashboard as a mounted component for interactive preview inside Studio */}
      <Composition
        id="BankingDashboardPreview"
        component={() => (
          <AbsoluteFill>
            <Dashboard />
          </AbsoluteFill>
        )}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
