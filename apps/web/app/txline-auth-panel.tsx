"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  connectWallet,
  getTxLineApiBaseUrl,
  getTxLineDefaultNetwork,
  sendTxLineSubscribeTransaction,
  type TxLineNetwork,
  type WalletLike,
} from "./lib/txline";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiFailureResponse {
  success: false;
  message: string;
  error: string;
}

interface GuestSessionData {
  token: string;
}

interface ActivationData {
  token: string;
}

interface AuthStatusData {
  guestSessionActive: boolean;
  apiTokenStored: boolean;
  ready: boolean;
}

interface ApiStatusResponse {
  success: true;
  data: AuthStatusData;
}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect?: () => Promise<{ publicKey?: { toString(): string } }>;
      signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
      signTransaction?: (transaction: unknown) => Promise<unknown>;
      signAllTransactions?: (transactions: unknown[]) => Promise<unknown[]>;
      publicKey?: { toString(): string };
    };
  }
}

function parseLeagues(input: string): number[] {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && value >= 0);
}

function formatWalletSignature(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while talking to the API.";
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function TxLineAuthPanel() {
  const defaultNetwork = getTxLineDefaultNetwork();
  const apiBaseUrl = getTxLineApiBaseUrl();

  const [network, setNetwork] = useState<TxLineNetwork>(defaultNetwork);
  const [walletAddress, setWalletAddress] = useState("");
  const [jwtStatus, setJwtStatus] = useState("No guest session yet.");
  const [authStatus, setAuthStatus] = useState<AuthStatusData>({
    guestSessionActive: false,
    apiTokenStored: false,
    ready: false,
  });
  const [serviceLevelId, setServiceLevelId] = useState(1);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [txSig, setTxSig] = useState("");
  const [leaguesInput, setLeaguesInput] = useState("");
  const [walletSignature, setWalletSignature] = useState("");
  const [signingMessage, setSigningMessage] = useState("");
  const [busy, setBusy] = useState<
    "guest" | "sign" | "activate" | "refresh" | "connect" | "subscribe" | null
  >(null);
  const [feedback, setFeedback] = useState("");

  const leagues = useMemo(() => parseLeagues(leaguesInput), [leaguesInput]);

  const activationMessage = useMemo(() => {
    if (!txSig) {
      return "";
    }

    return `${txSig}:${leagues.join(",")}`;
  }, [leagues, txSig]);

  const fundingNote = useMemo(() => {
    if (network === "devnet") {
      return "Devnet transactions still need devnet SOL for fees. You can usually get it from the Solana devnet faucet or by using the Solana CLI airdrop command against devnet.";
    }

    return "Mainnet transactions need real SOL for fees and any on-chain account creation.";
  }, [network]);

  const refreshStatus = useCallback(async (): Promise<void> => {
    setBusy("refresh");
    setFeedback("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/txline/auth/status`);

      if (!response.ok) {
        throw new Error(`Status request failed with ${response.status}`);
      }

      const payload = (await readJson<ApiStatusResponse>(response)).data;
      setAuthStatus(payload);
      setJwtStatus(
        payload.guestSessionActive
          ? "Guest session is active."
          : "No guest session yet."
      );
    } catch (error) {
      setFeedback(readErrorMessage(error));
    } finally {
      setBusy(null);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  async function startGuestSession() {
    setBusy("guest");
    setFeedback("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/txline/auth/guest/start`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Guest session request failed with ${response.status}`);
      }

      const payload = (await readJson<ApiSuccessResponse<GuestSessionData>>(response)).data;
      setJwtStatus("Guest session started. Keep the JWT in the backend.");
      setFeedback(`Guest session started successfully (${payload.token.length} chars).`);
      await refreshStatus();
    } catch (error) {
      setFeedback(readErrorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function handleConnectWallet() {
    setBusy("connect");
    setFeedback("");

    try {
      const wallet = window.solana;

      if (!wallet) {
        throw new Error("No Solana wallet extension was found in this browser.");
      }

      const connectedPublicKey = await connectWallet(wallet as WalletLike);
      setWalletAddress(connectedPublicKey.toBase58());
      setFeedback("Wallet connected successfully.");
    } catch (error) {
      setFeedback(readErrorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function handleSubscribeTransaction() {
    setBusy("subscribe");
    setFeedback("Submitting subscribe transaction...");

    try {
      const wallet = window.solana;

      if (!wallet) {
        throw new Error("No Solana wallet extension was found in this browser.");
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const signature = await sendTxLineSubscribeTransaction({
        network,
        wallet: wallet as WalletLike,
        serviceLevelId,
        durationWeeks,
      });

      setTxSig(signature);
      setFeedback(`Subscribe transaction confirmed: ${signature}`);
    } catch (error) {
      setFeedback(readErrorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function signActivationMessage() {
    setBusy("sign");
    setFeedback("");

    try {
      if (!txSig) {
        throw new Error("Add the confirmed txSig first.");
      }

      const wallet = window.solana;

      if (!wallet?.signMessage) {
        throw new Error("No wallet signMessage provider found.");
      }

      if (!wallet.publicKey && wallet.connect) {
        await wallet.connect();
      }

      const messageText = `${txSig}:${leagues.join(",")}`;
      const encodedMessage = new TextEncoder().encode(messageText);
      const signatureBytes = await wallet.signMessage(encodedMessage);
      const signature = formatWalletSignature(signatureBytes);

      setSigningMessage(messageText);
      setWalletSignature(signature);
      setFeedback("Wallet message signed. You can activate the token now.");
    } catch (error) {
      setFeedback(readErrorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function activateToken() {
    setBusy("activate");
    setFeedback("");

    try {
      if (!txSig) {
        throw new Error("Add the confirmed txSig first.");
      }

      if (!walletSignature) {
        throw new Error("Sign the activation message first.");
      }

      const response = await fetch(`${apiBaseUrl}/api/v1/txline/token/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txSig,
          walletSignature,
          leagues,
        }),
      });

      if (!response.ok) {
        const failure = (await readJson<ApiFailureResponse>(response));
        throw new Error(failure.error || failure.message);
      }

      const payload = (await readJson<ApiSuccessResponse<ActivationData>>(response)).data;
      setFeedback(`API token activated successfully (${payload.token.length} chars).`);
      await refreshStatus();
    } catch (error) {
      setFeedback(readErrorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className={styles.shell}>
      <div className={styles.hero}>
        <p className={styles.kicker}>TxLINE Auth Workbench</p>
        <h1>Connect the wallet, send the subscribe transaction, and activate the API token.</h1>
        <p className={styles.intro}>
          This panel drives the browser side of the TxLINE flow: wallet connection,
          on-chain subscription, guest JWT, wallet signature, activation, and status checks.
        </p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>1. Wallet and network</h2>
          <label className={styles.field}>
            <span>Network</span>
            <select
              value={network}
              onChange={(event) => setNetwork(event.target.value as TxLineNetwork)}
            >
              <option value="devnet">Devnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </label>
          <div className={styles.helperRow}>
            <span>Wallet</span>
            <strong>{walletAddress || "Not connected"}</strong>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleConnectWallet}
            disabled={busy !== null}
          >
            {busy === "connect" ? "Connecting..." : "Connect wallet"}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleSubscribeTransaction}
            disabled={busy !== null}
            aria-busy={busy === "subscribe"}
          >
            {busy === "subscribe" ? "Submitting..." : "Send subscribe transaction"}
          </button>
        </section>

        <section className={styles.card}>
          <h2>2. Subscription settings</h2>
          <label className={styles.field}>
            <span>Service level</span>
            <input
              type="number"
              min={1}
              value={serviceLevelId}
              onChange={(event) => setServiceLevelId(Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>Duration weeks</span>
            <input
              type="number"
              min={4}
              step={4}
              value={durationWeeks}
              onChange={(event) => setDurationWeeks(Number(event.target.value))}
            />
          </label>
          <p className={styles.smallPrint}>
            The subscribe transaction uses the selected network, service level, and duration.
          </p>
        </section>

        <section className={styles.card}>
          <h2>3. Funding note</h2>
          <p>{fundingNote}</p>
          <p className={styles.smallPrint}>
            If you are testing on devnet, you do not need real money. You only need test SOL.
          </p>
        </section>

        <section className={styles.card}>
          <h2>4. Guest session</h2>
          <p>Starts the anonymous JWT session through your Fastify backend.</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={startGuestSession}
            disabled={busy !== null}
          >
            {busy === "guest" ? "Starting..." : "Start guest session"}
          </button>
          <p className={styles.status}>{jwtStatus}</p>
        </section>

        <section className={styles.card}>
          <h2>5. Activation inputs</h2>
          <label className={styles.field}>
            <span>Confirmed txSig</span>
            <input
              value={txSig}
              onChange={(event) => setTxSig(event.target.value)}
              placeholder="Confirmed Solana transaction signature"
            />
          </label>
          <label className={styles.field}>
            <span>Leagues</span>
            <input
              value={leaguesInput}
              onChange={(event) => setLeaguesInput(event.target.value)}
              placeholder="Comma separated league IDs, for example 1,4,9"
            />
          </label>
          <div className={styles.helperRow}>
            <span>Parsed leagues:</span>
            <strong>{leagues.length > 0 ? leagues.join(", ") : "None"}</strong>
          </div>
          <div className={styles.messageBox}>
            <span>Message to sign</span>
            <code>{activationMessage || "Add a txSig first."}</code>
          </div>
        </section>

        <section className={styles.card}>
          <h2>6. Wallet signature</h2>
          <p>
            If your wallet exposes <code>signMessage</code>, this button will create the
            base64 signature for you.
          </p>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={signActivationMessage}
            disabled={busy !== null}
          >
            {busy === "sign" ? "Signing..." : "Sign message with wallet"}
          </button>
          <label className={styles.field}>
            <span>Wallet signature</span>
            <textarea
              value={walletSignature}
              onChange={(event) => setWalletSignature(event.target.value)}
              placeholder="Base64 wallet signature"
              rows={4}
            />
          </label>
          <p className={styles.smallPrint}>
            {signingMessage
              ? `Signed message: ${signingMessage}`
              : "The signed message will appear here after you sign."}
          </p>
        </section>

        <section className={styles.card}>
          <h2>7. Activate token</h2>
          <p>Posts txSig, walletSignature, and leagues to your backend.</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={activateToken}
            disabled={busy !== null}
          >
            {busy === "activate" ? "Activating..." : "Activate token"}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={refreshStatus}
            disabled={busy !== null}
          >
            {busy === "refresh" ? "Refreshing..." : "Refresh status"}
          </button>
          <div className={styles.statusStack}>
            <div>
              <span>Guest session</span>
              <strong>{authStatus.guestSessionActive ? "Active" : "Inactive"}</strong>
            </div>
            <div>
              <span>API token</span>
              <strong>{authStatus.apiTokenStored ? "Stored" : "Missing"}</strong>
            </div>
            <div>
              <span>Ready</span>
              <strong>{authStatus.ready ? "Yes" : "No"}</strong>
            </div>
          </div>
        </section>
      </div>

      <p className={styles.feedback}>{feedback}</p>
    </section>
  );
}
