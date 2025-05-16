import * as anchor from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PorNft } from "../target/types/por_nft";
import { createInitializeMintInstruction } from "@solana/spl-token";

describe("nft-marketplace", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const testNftTitle = "POR NFT";
  const testNftSymbol = "POR";
  const testNftUri =
    "https://64ecaegqumlgkazch64q5ekoqhgmxlskvblkxnoji7yoxcojrtja.arweave.net/9wggENCjFmUDIj-5DpFOgczLrkqoVqu1yUfw64nJjNI";

  const program = anchor.workspace.PorNft as anchor.Program<PorNft>;

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  it("mints an NFT", async () => {
    const mintKeypair = anchor.web3.Keypair.generate();
    // 4wgs7FATwWwmPeQR3JL6stAL9k8cjhwNCA7Qr3NvsQRh
    // Create mint account manually
    const lamports = await connection.getMinimumBalanceForRentExemption(82);
    const createMintTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: 82,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    await anchor.web3.sendAndConfirmTransaction(connection, createMintTx, [
      wallet.payer,
      mintKeypair,
    ]);

    const initializeMintIx = createInitializeMintInstruction(
      mintKeypair.publicKey,
      0,
      wallet.publicKey,
      wallet.publicKey
    );

    const initializeTx = new anchor.web3.Transaction().add(initializeMintIx);
    await anchor.web3.sendAndConfirmTransaction(connection, initializeTx, [
      wallet.payer,
    ]);

    // Get associated token address
    const tokenAccount = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey
    );

    // Derive metadata + edition PDAs
    const [metadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [masterEdition] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Call your program
    const txSig = await program.methods
      .mintNft(testNftTitle, testNftSymbol, testNftUri)
      .accounts({
        mint: mintKeypair.publicKey,
        tokenAccount,
        metadata,
        masterEdition,
        mintAuthority: wallet.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([wallet.payer])
      .rpc();

    console.log("✅ NFT minted in tx:", txSig);
  });
});
