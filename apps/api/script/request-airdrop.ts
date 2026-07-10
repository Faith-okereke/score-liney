import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

async function main() {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const walletAddress = "8z9k8kSDMChxX5W8C3R5uBHrU1MeJKSjPQ897Bt564gW";

  console.log("Requesting airdrop...");
  const balance = await connection.getBalance(
    new PublicKey(walletAddress)
  );

  console.log(balance);
  const signature = await connection.requestAirdrop(
    new PublicKey(walletAddress),
    LAMPORTS_PER_SOL
  );

  console.log("Transaction Signature:", signature);

  await connection.confirmTransaction(signature);

  console.log("✅ Airdrop successful!");
}

main().catch(console.error);