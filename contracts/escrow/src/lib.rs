use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("FLBYEscrow11111111111111111111111111111111");

#[program]
pub mod flutterbye_escrow {
    use super::*;

    /// Initialize escrow account for high-value transactions
    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        amount: u64,
        recipient_pubkey: Pubkey,
        timeout_timestamp: i64,
        escrow_id: String,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.authority = ctx.accounts.authority.key();
        escrow.recipient = recipient_pubkey;
        escrow.amount = amount;
        escrow.mint = ctx.accounts.mint.key();
        escrow.vault = ctx.accounts.vault.key();
        escrow.timeout_timestamp = timeout_timestamp;
        escrow.escrow_id = escrow_id;
        escrow.status = EscrowStatus::Active;
        escrow.created_at = Clock::get()?.unix_timestamp;
        escrow.bump = *ctx.bumps.get("escrow").unwrap();

        // Transfer tokens to vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.authority_token_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        emit!(EscrowCreated {
            escrow_id: escrow.escrow_id.clone(),
            authority: escrow.authority,
            recipient: escrow.recipient,
            amount: escrow.amount,
            timeout: escrow.timeout_timestamp,
        });

        Ok(())
    }

    /// Release escrow funds to recipient (only by authority)
    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.status == EscrowStatus::Active,
            EscrowError::EscrowNotActive
        );

        // Transfer tokens from vault to recipient
        let seeds = &[
            b"escrow",
            escrow.authority.as_ref(),
            escrow.escrow_id.as_bytes(),
            &[escrow.bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, escrow.amount)?;

        escrow.status = EscrowStatus::Released;
        escrow.released_at = Some(Clock::get()?.unix_timestamp);

        emit!(EscrowReleased {
            escrow_id: escrow.escrow_id.clone(),
            recipient: escrow.recipient,
            amount: escrow.amount,
        });

        Ok(())
    }

    /// Cancel escrow and return funds to authority (only if not expired)
    pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.status == EscrowStatus::Active,
            EscrowError::EscrowNotActive
        );

        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < escrow.timeout_timestamp,
            EscrowError::EscrowExpired
        );

        // Transfer tokens back to authority
        let seeds = &[
            b"escrow",
            escrow.authority.as_ref(),
            escrow.escrow_id.as_bytes(),
            &[escrow.bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.authority_token_account.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, escrow.amount)?;

        escrow.status = EscrowStatus::Cancelled;
        escrow.cancelled_at = Some(Clock::get()?.unix_timestamp);

        emit!(EscrowCancelled {
            escrow_id: escrow.escrow_id.clone(),
            authority: escrow.authority,
            amount: escrow.amount,
        });

        Ok(())
    }

    /// Claim expired escrow (anyone can call this after timeout)
    pub fn claim_expired_escrow(ctx: Context<ClaimExpiredEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.status == EscrowStatus::Active,
            EscrowError::EscrowNotActive
        );

        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= escrow.timeout_timestamp,
            EscrowError::EscrowNotExpired
        );

        // Transfer tokens back to authority after expiration
        let seeds = &[
            b"escrow",
            escrow.authority.as_ref(),
            escrow.escrow_id.as_bytes(),
            &[escrow.bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.authority_token_account.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, escrow.amount)?;

        escrow.status = EscrowStatus::Expired;
        escrow.expired_at = Some(Clock::get()?.unix_timestamp);

        emit!(EscrowExpired {
            escrow_id: escrow.escrow_id.clone(),
            authority: escrow.authority,
            amount: escrow.amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount: u64, recipient_pubkey: Pubkey, timeout_timestamp: i64, escrow_id: String)]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", authority.key().as_ref(), escrow_id.as_bytes()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = escrow,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = authority
    )]
    pub authority_token_account: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(mut, has_one = authority)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", authority.key().as_ref(), escrow.escrow_id.as_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.mint,
        address = escrow.recipient @ EscrowError::InvalidRecipient
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelEscrow<'info> {
    #[account(mut, has_one = authority)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", authority.key().as_ref(), escrow.escrow_id.as_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.mint,
        token::authority = authority
    )]
    pub authority_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimExpiredEscrow<'info> {
    /// Anyone can call this instruction
    pub caller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", escrow.authority.as_ref(), escrow.escrow_id.as_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.mint,
        address = escrow.authority @ EscrowError::InvalidAuthority
    )]
    pub authority_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub authority: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub timeout_timestamp: i64,
    #[max_len(50)]
    pub escrow_id: String,
    pub status: EscrowStatus,
    pub created_at: i64,
    pub released_at: Option<i64>,
    pub cancelled_at: Option<i64>,
    pub expired_at: Option<i64>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum EscrowStatus {
    Active,
    Released,
    Cancelled,
    Expired,
}

#[event]
pub struct EscrowCreated {
    pub escrow_id: String,
    pub authority: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timeout: i64,
}

#[event]
pub struct EscrowReleased {
    pub escrow_id: String,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[event]
pub struct EscrowCancelled {
    pub escrow_id: String,
    pub authority: Pubkey,
    pub amount: u64,
}

#[event]
pub struct EscrowExpired {
    pub escrow_id: String,
    pub authority: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum EscrowError {
    #[msg("Escrow is not active")]
    EscrowNotActive,
    #[msg("Escrow has expired")]
    EscrowExpired,
    #[msg("Escrow has not expired yet")]
    EscrowNotExpired,
    #[msg("Invalid recipient")]
    InvalidRecipient,
    #[msg("Invalid authority")]
    InvalidAuthority,
}