import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SendTransactionError,
} from "@solana/web3.js";

export type TxLineNetwork = "devnet" | "mainnet";

export interface TxLineNetworkConfig {
  rpcUrl: string;
  apiOrigin: string;
  programId: PublicKey;
  txlTokenMint: PublicKey;
}

export interface WalletLike {
  publicKey: PublicKey | null;
  connect?: () => Promise<{ publicKey?: { toString(): string } }>;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export interface SubscribeParams {
  network: TxLineNetwork;
  wallet: WalletLike;
  serviceLevelId: number;
  durationWeeks: number;
}

const CONFIG: Record<TxLineNetwork, TxLineNetworkConfig> = {
  mainnet: {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    apiOrigin: "https://txline.txodds.com",
    programId: new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA"),
    txlTokenMint: new PublicKey("Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL"),
  },
  devnet: {
    rpcUrl: "https://api.devnet.solana.com",
    apiOrigin: "https://txline-dev.txodds.com",
    programId: new PublicKey("6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J"),
    txlTokenMint: new PublicKey("4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG"),
  },
};

export function getTxLineNetworkConfig(
  network: TxLineNetwork
): TxLineNetworkConfig {
  return CONFIG[network];
}

export function getTxLineDefaultNetwork(): TxLineNetwork {
  const configured = process.env.NEXT_PUBLIC_TXLINE_NETWORK;
  return configured === "mainnet" ? "mainnet" : "devnet";
}

export function getTxLineApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_TXLINE_API_BASE_URL ?? "http://localhost:3001";
}

export async function connectWallet(wallet: WalletLike): Promise<PublicKey> {
  if (wallet.publicKey) {
    return new PublicKey(wallet.publicKey.toString());
  }

  const response = await wallet.connect?.();
  const connectedPublicKey = response?.publicKey;

  if (connectedPublicKey) {
    return new PublicKey(connectedPublicKey.toString());
  }

  throw new Error("Wallet connection did not return a public key.");
}

export async function sendTxLineSubscribeTransaction(
  params: SubscribeParams
): Promise<string> {
  const config = getTxLineNetworkConfig(params.network);
  const connection = new Connection(config.rpcUrl, "confirmed");
  const walletPublicKey = await connectWallet(params.wallet);
  const walletBalanceLamports = await connection.getBalance(walletPublicKey, "confirmed");

  const [tokenTreasuryPda] = PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("token_treasury_v2")],
    config.programId
  );

  const [pricingMatrixPda] = PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("pricing_matrix")],
    config.programId
  );

  let userTokenAccount: PublicKey;
  let tokenTreasuryVault: PublicKey;

  try {
    userTokenAccount = getAssociatedTokenAddressSync(
      config.txlTokenMint,
      walletPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    tokenTreasuryVault = getAssociatedTokenAddressSync(
      config.txlTokenMint,
      tokenTreasuryPda,
      true,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  } catch (error) {
    throw new Error(
      `TxLINE account derivation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (walletBalanceLamports === 0) {
    throw new Error(
      `Your wallet has 0 SOL on ${params.network}. Devnet still needs devnet SOL for fees and account creation.`
    );
  }

  const subscribeData = await encodeSubscribeInstructionData(
    params.serviceLevelId,
    params.durationWeeks
  );

  const setupInstructions: TransactionInstruction[] = [];
  const userTokenAccountInfo = await connection.getAccountInfo(userTokenAccount, "confirmed");
  const tokenTreasuryVaultInfo = await connection.getAccountInfo(
    tokenTreasuryVault,
    "confirmed"
  );

  if (!userTokenAccountInfo) {
    setupInstructions.push(
      createAssociatedTokenAccountInstruction(
        walletPublicKey,
        userTokenAccount,
        walletPublicKey,
        config.txlTokenMint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  if (!tokenTreasuryVaultInfo) {
    setupInstructions.push(
      createAssociatedTokenAccountInstruction(
        walletPublicKey,
        tokenTreasuryVault,
        tokenTreasuryPda,
        config.txlTokenMint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  const instruction = new TransactionInstruction({
    programId: config.programId,
    keys: [
      { pubkey: walletPublicKey, isSigner: true, isWritable: true },
      { pubkey: pricingMatrixPda, isSigner: false, isWritable: false },
      { pubkey: config.txlTokenMint, isSigner: false, isWritable: false },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: tokenTreasuryVault, isSigner: false, isWritable: true },
      { pubkey: tokenTreasuryPda, isSigner: false, isWritable: false },
      { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: subscribeData,
  });

  try {
    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    const transaction = new Transaction({
      feePayer: walletPublicKey,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    }).add(instruction);

    if (!params.wallet.signTransaction) {
      throw new Error("Wallet does not support transaction signing.");
    }

    const signedTransaction = await params.wallet.signTransaction(transaction);
    const txSig = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
    });

    await connection.confirmTransaction(
      {
        signature: txSig,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "confirmed"
    );

    return txSig;
  } catch (error) {
    const txError = error as SendTransactionError & {
      getLogs?: (connectionArg: Connection) => Promise<string[] | undefined>;
    };
    let detailedMessage = txError instanceof Error ? txError.message : String(error);

    if (typeof txError.getLogs === "function") {
      try {
        const logs = await txError.getLogs(connection);
        if (logs?.length) {
          detailedMessage = `${detailedMessage}\nLogs:\n${logs.join("\n")}`;
        }
      } catch (logError) {
        if (logError instanceof Error) {
          detailedMessage = `${detailedMessage}\nLog lookup failed: ${logError.message}`;
        }
      }
    }

    throw new Error(`TxLINE subscribe transaction failed: ${detailedMessage}`);
  }
}

async function encodeSubscribeInstructionData(
  serviceLevelId: number,
  durationWeeks: number
): Promise<Buffer> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Cryptography API is unavailable in this browser.");
  }

  const discriminatorInput = new TextEncoder().encode("global:subscribe");
  const digest = await globalThis.crypto.subtle.digest("SHA-256", discriminatorInput);
  const discriminator = Buffer.from(digest).subarray(0, 8);
  const payload = Buffer.alloc(3);

  payload.writeUInt16LE(serviceLevelId, 0);
  payload.writeUInt8(durationWeeks, 2);

  return Buffer.concat([discriminator, payload]);
}
