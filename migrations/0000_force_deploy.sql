CREATE TABLE "admin_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" varchar NOT NULL,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" varchar NOT NULL,
	"details" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar,
	CONSTRAINT "admin_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"email" text,
	"role" text DEFAULT 'admin' NOT NULL,
	"permissions" json,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "airdrop_signups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"wallet_address" text NOT NULL,
	"preferences" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "analysis_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"priority" integer DEFAULT 1,
	"status" text DEFAULT 'queued',
	"attempts" integer DEFAULT 0,
	"max_attempts" integer DEFAULT 3,
	"batch_id" varchar,
	"requested_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"metric" text NOT NULL,
	"value" numeric(18, 9) NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon_url" text,
	"category" text NOT NULL,
	"required_condition" text NOT NULL,
	"points_reward" integer DEFAULT 0,
	"rarity" text DEFAULT 'common' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "badges_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "blog_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"views" integer DEFAULT 0,
	"unique_views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"avg_read_time" integer DEFAULT 0,
	"bounce_rate" numeric(5, 2) DEFAULT '0',
	"organic_views" integer DEFAULT 0,
	"search_impressions" integer DEFAULT 0,
	"search_clicks" integer DEFAULT 0,
	"avg_position" numeric(4, 1),
	"social_shares" json,
	"comment_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text DEFAULT '#6366f1',
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"meta_description" text,
	"keywords" json,
	"featured_image" text,
	"tone" text DEFAULT 'professional',
	"target_audience" text DEFAULT 'general',
	"content_type" text DEFAULT 'blog',
	"readability_score" integer,
	"seo_score" integer,
	"engagement_potential" integer,
	"ai_recommendations" json,
	"seo_title" text,
	"internal_links" json,
	"heading_structure" json,
	"status" text DEFAULT 'draft',
	"published_at" timestamp,
	"scheduled_at" timestamp,
	"view_count" integer DEFAULT 0,
	"share_count" integer DEFAULT 0,
	"avg_read_time" integer,
	"category_id" varchar,
	"author_id" varchar,
	"generated_by_ai" boolean DEFAULT false,
	"ai_prompt" text,
	"ai_model" text DEFAULT 'gpt-4o',
	"ai_generated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_schedules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"frequency" text NOT NULL,
	"custom_cron_expression" text,
	"preferred_categories" json,
	"default_tone" text DEFAULT 'professional',
	"default_target_audience" text DEFAULT 'general',
	"default_content_type" text DEFAULT 'blog',
	"word_count_range" json,
	"topic_categories" json,
	"include_flutterbye_integration" boolean DEFAULT true,
	"keyword_focus" json,
	"auto_publish" boolean DEFAULT false,
	"requires_approval" boolean DEFAULT true,
	"posts_generated" integer DEFAULT 0,
	"posts_published" integer DEFAULT 0,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_title_variations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" varchar NOT NULL,
	"title" text NOT NULL,
	"is_active" boolean DEFAULT false,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"ctr" numeric(5, 2) DEFAULT '0',
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_wallet" text NOT NULL,
	"message" text NOT NULL,
	"message_type" text DEFAULT 'text',
	"blockchain_hash" text,
	"blockchain_status" text DEFAULT 'pending',
	"mint_address" text,
	"is_edited" boolean DEFAULT false,
	"edited_at" timestamp,
	"reply_to_message_id" varchar,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_participants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_address" text NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"last_seen_at" timestamp DEFAULT now(),
	"is_online" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT true,
	"max_participants" integer DEFAULT 50,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "code_redemptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"wallet_address" text NOT NULL,
	"token_id" varchar,
	"ip_address" text,
	"user_agent" text,
	"savings_amount" numeric(18, 9) DEFAULT '0',
	"original_cost" numeric(18, 9) DEFAULT '0',
	"referral_source" text,
	"geolocation" json,
	"metadata" json,
	"redeemed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custodial_wallet_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"transaction_type" varchar NOT NULL,
	"amount" numeric(18, 9) NOT NULL,
	"currency" varchar NOT NULL,
	"from_address" varchar,
	"to_address" varchar,
	"transaction_hash" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"confirmations" integer DEFAULT 0,
	"fee_amount" numeric(18, 9) DEFAULT '0' NOT NULL,
	"fee_currency" varchar DEFAULT 'FLBY' NOT NULL,
	"block_height" integer,
	"metadata" jsonb,
	"failure_reason" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "custodial_wallet_transactions_transaction_hash_unique" UNIQUE("transaction_hash")
);
--> statement-breakpoint
CREATE TABLE "custodial_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"currency" varchar NOT NULL,
	"wallet_address" varchar NOT NULL,
	"private_key_encrypted" text NOT NULL,
	"is_hot_wallet" boolean DEFAULT true NOT NULL,
	"balance" numeric(18, 9) DEFAULT '0' NOT NULL,
	"reserved_balance" numeric(18, 9) DEFAULT '0' NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"last_health_check" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "custodial_wallets_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "custom_badge_shares" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"badge_id" varchar NOT NULL,
	"shared_by" varchar NOT NULL,
	"shared_with" varchar,
	"platform" varchar(20),
	"share_count" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_badge_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(200),
	"category" varchar(30) NOT NULL,
	"background_color" varchar(7) NOT NULL,
	"text_color" varchar(7) NOT NULL,
	"border_color" varchar(7) NOT NULL,
	"icon" varchar(50) NOT NULL,
	"pattern" varchar(20) NOT NULL,
	"is_public" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_user_badges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(200),
	"background_color" varchar(7) DEFAULT '#1a1a1a',
	"text_color" varchar(7) DEFAULT '#ffffff',
	"border_color" varchar(7) DEFAULT '#8b5cf6',
	"icon" varchar(50) DEFAULT 'star',
	"pattern" varchar(20) DEFAULT 'solid',
	"mint_address" varchar,
	"is_nft" boolean DEFAULT false,
	"shareable_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_challenges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"challenge_type" text NOT NULL,
	"target_value" integer NOT NULL,
	"description" text NOT NULL,
	"points_reward" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emotional_interactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"interaction_type" text NOT NULL,
	"interaction_data" jsonb,
	"burn_transaction_sig" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enterprise_escrow_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" text NOT NULL,
	"multisig_address" text NOT NULL,
	"signatory_addresses" json,
	"required_signatures" integer NOT NULL,
	"contract_value" numeric(18, 9) NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'active',
	"compliance_level" text DEFAULT 'bank-level',
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "enterprise_escrow_wallets_multisig_address_unique" UNIQUE("multisig_address")
);
--> statement-breakpoint
CREATE TABLE "enterprise_wallet_audit_trail" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" varchar NOT NULL,
	"action" text NOT NULL,
	"actor" text NOT NULL,
	"transaction_hash" text,
	"amount" numeric(18, 9),
	"notes" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "escrow_fee_configs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"currency" text NOT NULL,
	"deposit_fee_percentage" numeric(5, 3) NOT NULL,
	"withdrawal_fee_percentage" numeric(5, 3) NOT NULL,
	"minimum_deposit_fee" numeric(18, 9) NOT NULL,
	"minimum_withdrawal_fee" numeric(18, 9) NOT NULL,
	"maximum_deposit_fee" numeric(18, 9) NOT NULL,
	"maximum_withdrawal_fee" numeric(18, 9) NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar,
	CONSTRAINT "escrow_fee_configs_currency_unique" UNIQUE("currency")
);
--> statement-breakpoint
CREATE TABLE "escrow_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"private_key" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"total_balance" numeric(18, 9) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "escrow_wallets_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "journey_insights" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"insight_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"data" json,
	"is_read" boolean DEFAULT false,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "journey_milestones" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"required_condition" text NOT NULL,
	"order" integer NOT NULL,
	"icon_url" text,
	"points_reward" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "limited_edition_sets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"base_message" text NOT NULL,
	"total_editions" integer NOT NULL,
	"minted_editions" integer DEFAULT 0,
	"price_per_edition" numeric(18, 9) DEFAULT '0.01',
	"is_active" boolean DEFAULT true,
	"category" text DEFAULT 'limited',
	"image_url" text,
	"edition_prefix" text DEFAULT '#',
	"rarity_tier" text DEFAULT 'rare',
	"special_properties" json,
	"sale_starts_at" timestamp,
	"sale_ends_at" timestamp,
	"max_purchase_per_wallet" integer DEFAULT 1,
	"master_mint_address" text,
	"royalty_percentage" numeric(5, 2) DEFAULT '5',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_listings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" varchar NOT NULL,
	"seller_id" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"price_per_token" numeric(18, 9) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "phone_wallet_mappings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text NOT NULL,
	"wallet_address" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verification_code" text,
	"verification_expiry" timestamp,
	"created_at" timestamp DEFAULT now(),
	"verified_at" timestamp,
	CONSTRAINT "phone_wallet_mappings_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "platform_fees" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fee_type" text NOT NULL,
	"fee_percentage" numeric(5, 2) NOT NULL,
	"minimum_fee" numeric(18, 9) DEFAULT '0',
	"maximum_fee" numeric(18, 9),
	"is_active" boolean DEFAULT true,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar,
	CONSTRAINT "platform_fees_fee_type_unique" UNIQUE("fee_type")
);
--> statement-breakpoint
CREATE TABLE "platform_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp DEFAULT now(),
	"total_users" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"total_value_escrowed" numeric(18, 9) DEFAULT '0',
	"total_redemptions" integer DEFAULT 0,
	"active_users_24h" integer DEFAULT 0,
	"revenue_today" numeric(18, 9) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "platform_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_type" text NOT NULL,
	"wallet_address" text NOT NULL,
	"private_key" text,
	"public_key" text NOT NULL,
	"network" text DEFAULT 'devnet' NOT NULL,
	"balance" numeric(18, 9) DEFAULT '0',
	"currency" text DEFAULT 'SOL' NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_primary" boolean DEFAULT false,
	"description" text,
	"last_balance_check" timestamp,
	"minimum_balance" numeric(18, 9) DEFAULT '0.1',
	"alerts_enabled" boolean DEFAULT true,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar,
	CONSTRAINT "platform_wallets_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "pricing_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_key" text NOT NULL,
	"config_value" numeric(18, 9) NOT NULL,
	"currency" text DEFAULT 'SOL',
	"description" text,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar,
	CONSTRAINT "pricing_config_config_key_unique" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE "pricing_tiers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier_name" text NOT NULL,
	"min_quantity" integer DEFAULT 1 NOT NULL,
	"max_quantity" integer,
	"base_price_per_token" numeric(18, 9) NOT NULL,
	"discount_percentage" numeric(5, 2) DEFAULT '0',
	"final_price_per_token" numeric(18, 9) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"gas_fee_included" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pricing_tiers_tier_name_unique" UNIQUE("tier_name")
);
--> statement-breakpoint
CREATE TABLE "redeemable_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(18, 9) DEFAULT '0',
	"max_uses" integer DEFAULT 1,
	"current_uses" integer DEFAULT 0,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar,
	CONSTRAINT "redeemable_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "redemption_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"max_uses" integer DEFAULT 1 NOT NULL,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "redemption_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "redemptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"burn_transaction_signature" text NOT NULL,
	"redeemed_amount" numeric(18, 9) NOT NULL,
	"platform_fee" numeric(18, 9) NOT NULL,
	"fee_percentage" numeric(5, 2) NOT NULL,
	"net_amount" numeric(18, 9) NOT NULL,
	"currency" text NOT NULL,
	"redemption_transaction_signature" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reward_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"action" text NOT NULL,
	"points_change" integer NOT NULL,
	"description" text NOT NULL,
	"related_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheduled_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bot_config_id" varchar,
	"platform" text DEFAULT 'twitter' NOT NULL,
	"content" text NOT NULL,
	"hashtags" json,
	"scheduled_time" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"is_ai_generated" boolean DEFAULT false,
	"ai_template" text,
	"custom_context" text,
	"posted_at" timestamp,
	"platform_post_id" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skye_conversation_analysis" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" varchar,
	"detected_topics" json,
	"sentiment_score" numeric(3, 2),
	"knowledge_gaps" json,
	"suggested_knowledge" json,
	"user_satisfaction" integer,
	"response_quality" numeric(3, 2),
	"analyzed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skye_conversation_threads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"title" text,
	"category" text,
	"priority" integer DEFAULT 5,
	"context" json,
	"status" text DEFAULT 'active',
	"last_message" text,
	"message_count" integer DEFAULT 0,
	"related_wallets" json,
	"related_knowledge" json,
	"started_at" timestamp DEFAULT now(),
	"last_activity" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "skye_conversations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"session_id" varchar NOT NULL,
	"wallet_address" text,
	"current_page" text NOT NULL,
	"page_context" json,
	"user_intent" text,
	"is_active" boolean DEFAULT true,
	"total_messages" integer DEFAULT 0,
	"last_interaction_at" timestamp DEFAULT now(),
	"user_preferences" json,
	"relationship_level" text DEFAULT 'new',
	"personality_insights" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skye_emotional_analysis" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"conversation_id" varchar,
	"detected_emotion" text,
	"emotion_confidence" numeric(3, 2),
	"emotion_intensity" integer,
	"sentiment_score" numeric(3, 2),
	"sentiment_label" text,
	"user_message" text,
	"message_length" integer,
	"response_time" integer,
	"overall_mood" text,
	"mood_trend" text,
	"stress_indicators" json,
	"recommended_approach" text,
	"adapted_personality" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skye_knowledge_base" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"priority" integer DEFAULT 1,
	"is_truth" boolean DEFAULT false,
	"tags" json DEFAULT '[]'::json,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_used" timestamp,
	"usage_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "skye_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" varchar NOT NULL,
	"message" text NOT NULL,
	"message_type" text NOT NULL,
	"page_context" text NOT NULL,
	"action_context" json,
	"ai_model" text DEFAULT 'gpt-4o',
	"token_usage" json,
	"contains_recommendations" boolean DEFAULT false,
	"recommendation_data" json,
	"response_time" integer,
	"user_satisfaction" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skye_personality_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"wallet_address" text,
	"communication_style" text DEFAULT 'friendly',
	"preferred_response_length" text DEFAULT 'medium',
	"help_level" text DEFAULT 'beginner',
	"topic_interests" json,
	"active_time_patterns" json,
	"avg_session_duration" integer,
	"question_types" json,
	"remembered_preferences" json,
	"past_recommendations" json,
	"engagement_score" numeric(3, 2) DEFAULT '0.5',
	"loyalty_score" numeric(3, 2) DEFAULT '0.5',
	"last_analyzed" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skye_personality_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_key" text NOT NULL,
	"setting_value" json,
	"description" text,
	"category" text DEFAULT 'general',
	"is_active" boolean DEFAULT true,
	"updated_by" varchar,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "skye_personality_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "skye_user_memory" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"wallet_address" text,
	"preferred_name" text,
	"communication_style" text,
	"interests" json,
	"goals" json,
	"typical_questions" json,
	"preferred_topics" json,
	"avoided_topics" json,
	"response_preferences" json,
	"trust_level" integer DEFAULT 5,
	"conversation_history" json,
	"personalized_insights" json,
	"last_interaction" timestamp DEFAULT now(),
	"total_interactions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sms_deliveries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sms_message_id" varchar NOT NULL,
	"token_id" varchar,
	"recipient_phone" text NOT NULL,
	"delivery_url" text,
	"notification_sent" boolean DEFAULT false,
	"notification_sid" text,
	"viewed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sms_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_phone" text NOT NULL,
	"to_phone" text NOT NULL,
	"message_body" text NOT NULL,
	"token_id" varchar,
	"emotion_type" text,
	"status" text DEFAULT 'pending',
	"twilio_sid" text,
	"delivery_status" text,
	"recipient_wallet" text,
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "social_bot_configurations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"platform" text DEFAULT 'twitter' NOT NULL,
	"is_active" boolean DEFAULT false,
	"posting_schedule" json,
	"configuration" json,
	"api_credentials" json,
	"last_activated" timestamp,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"category" text DEFAULT 'general',
	"description" text,
	"data_type" text DEFAULT 'string',
	"is_editable" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "token_holdings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token_id" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"purchase_price" numeric(18, 9),
	"acquired_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"symbol" text DEFAULT 'FLBY-MSG' NOT NULL,
	"mint_address" text NOT NULL,
	"creator_id" varchar NOT NULL,
	"total_supply" integer NOT NULL,
	"available_supply" integer NOT NULL,
	"value_per_token" numeric(18, 9) DEFAULT '0',
	"image_url" text,
	"metadata" json,
	"additional_messages" json,
	"links" json,
	"gifs" json,
	"solscan_metadata" json,
	"has_attached_value" boolean DEFAULT false,
	"attached_value" numeric(18, 9) DEFAULT '0',
	"currency" text DEFAULT 'SOL',
	"escrow_status" text DEFAULT 'none',
	"escrow_wallet" text,
	"expires_at" timestamp,
	"minting_cost_per_token" numeric(18, 9) DEFAULT '0.01',
	"gas_fee_included" boolean DEFAULT true,
	"bulk_discount_applied" numeric(5, 2) DEFAULT '0',
	"total_minting_cost" numeric(18, 9) DEFAULT '0',
	"sms_origin" boolean DEFAULT false,
	"sender_phone" text,
	"recipient_phone" text,
	"emotion_type" text,
	"is_time_locked" boolean DEFAULT false,
	"unlocks_at" timestamp,
	"is_burn_to_read" boolean DEFAULT false,
	"is_reply_gated" boolean DEFAULT false,
	"requires_reply" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"is_blocked" boolean DEFAULT false,
	"flagged_at" timestamp,
	"flagged_reason" text,
	"is_limited_edition" boolean DEFAULT false,
	"edition_number" integer,
	"limited_edition_set_id" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tokens_mint_address_unique" UNIQUE("mint_address")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"from_user_id" varchar,
	"to_user_id" varchar,
	"token_id" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"price_per_token" numeric(18, 9),
	"total_value" numeric(18, 9),
	"solana_signature" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"event" text NOT NULL,
	"data" json,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"badge_id" varchar NOT NULL,
	"earned_at" timestamp DEFAULT now(),
	"notification_shown" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "user_challenge_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"challenge_id" varchar NOT NULL,
	"current_progress" integer DEFAULT 0,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_journey_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"milestone_id" varchar NOT NULL,
	"achieved_at" timestamp DEFAULT now(),
	"notification_shown" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"dashboard_layout" text DEFAULT 'default',
	"notification_settings" json DEFAULT '{"milestones":true,"insights":true,"challenges":true,"badges":true}'::json,
	"favorite_categories" text[] DEFAULT ARRAY[]::text[],
	"privacy_level" text DEFAULT 'public',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_rewards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_points" integer DEFAULT 0,
	"current_level" integer DEFAULT 1,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"total_sms_messages" integer DEFAULT 0,
	"total_tokens_minted" integer DEFAULT 0,
	"total_value_attached" numeric(18, 9) DEFAULT '0',
	"last_activity_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_wallet_balances" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"available_balance" numeric(18, 9) DEFAULT '0' NOT NULL,
	"pending_balance" numeric(18, 9) DEFAULT '0' NOT NULL,
	"reserved_balance" numeric(18, 9) DEFAULT '0' NOT NULL,
	"total_deposited" numeric(18, 9) DEFAULT '0' NOT NULL,
	"total_withdrawn" numeric(18, 9) DEFAULT '0' NOT NULL,
	"total_fees_earned" numeric(18, 9) DEFAULT '0' NOT NULL,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_wallet_balances_user_id_currency_unique" UNIQUE("user_id","currency")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"email" text,
	"airdrop_preferences" json,
	"credits" numeric(18, 9) DEFAULT '0',
	"role" text DEFAULT 'user',
	"is_admin" boolean DEFAULT false,
	"admin_permissions" json,
	"admin_added_by" varchar,
	"admin_added_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "value_attachments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"product_type" varchar NOT NULL,
	"amount" numeric(18, 9) NOT NULL,
	"currency" varchar NOT NULL,
	"recipient_address" varchar,
	"recipient_user_id" varchar,
	"expires_at" timestamp,
	"message" text,
	"status" varchar DEFAULT 'active' NOT NULL,
	"redemption_code" varchar,
	"redeemed_at" timestamp,
	"redeemed_by" varchar,
	"transaction_hash" varchar,
	"fee_amount" numeric(18, 9) DEFAULT '0' NOT NULL,
	"fee_currency" varchar DEFAULT 'FLBY' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "value_attachments_redemption_code_unique" UNIQUE("redemption_code")
);
--> statement-breakpoint
CREATE TABLE "voice_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audio_url" text NOT NULL,
	"duration" integer NOT NULL,
	"type" text DEFAULT 'voice' NOT NULL,
	"transcription" text,
	"token_id" varchar,
	"chat_message_id" varchar,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" varchar NOT NULL,
	"alert_type" text NOT NULL,
	"severity" text DEFAULT 'medium' NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"current_balance" numeric(18, 9),
	"threshold_balance" numeric(18, 9),
	"is_resolved" boolean DEFAULT false,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"action_taken" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_batches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_name" text NOT NULL,
	"uploaded_by" varchar NOT NULL,
	"file_name" text,
	"total_wallets" integer DEFAULT 0,
	"processed_wallets" integer DEFAULT 0,
	"successful_analyses" integer DEFAULT 0,
	"failed_analyses" integer DEFAULT 0,
	"status" text DEFAULT 'processing',
	"processing_started" timestamp DEFAULT now(),
	"processing_completed" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_intelligence" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" varchar NOT NULL,
	"blockchain" varchar(20) DEFAULT 'solana' NOT NULL,
	"network" varchar(20) DEFAULT 'mainnet',
	"overall_score" integer DEFAULT 500,
	"score_grade" varchar(10) DEFAULT 'C',
	"score_percentile" numeric(5, 2) DEFAULT '50.00',
	"last_score_update" timestamp DEFAULT now(),
	"social_credit_score" integer DEFAULT 500,
	"risk_level" varchar(20) DEFAULT 'medium',
	"trading_behavior_score" integer DEFAULT 500,
	"portfolio_quality_score" integer DEFAULT 500,
	"liquidity_score" integer DEFAULT 500,
	"activity_score" integer DEFAULT 500,
	"defi_engagement_score" integer DEFAULT 500,
	"cross_chain_score" integer DEFAULT 500,
	"arbitrage_detection_score" integer DEFAULT 500,
	"wealth_indicator_score" integer DEFAULT 500,
	"influence_network_score" integer DEFAULT 500,
	"compliance_score" integer DEFAULT 500,
	"primary_chain" varchar(20) DEFAULT 'solana',
	"chain_distribution" json DEFAULT '{}'::json,
	"cross_chain_behavior" json DEFAULT '{"migrationPatterns":[],"arbitrageActivity":false,"multiChainStrategies":[],"bridgeUsage":{}}'::json,
	"marketing_segment" varchar(50) DEFAULT 'unknown',
	"communication_style" varchar(50) DEFAULT 'casual',
	"preferred_token_types" text[] DEFAULT ARRAY[]::text[],
	"risk_tolerance" varchar(30) DEFAULT 'moderate',
	"investment_profile" text,
	"trading_frequency" varchar(30) DEFAULT 'unknown',
	"portfolio_size" varchar(20) DEFAULT 'unknown',
	"influence_score" integer DEFAULT 0,
	"social_connections" integer DEFAULT 0,
	"marketing_insights" json DEFAULT '{"targetAudience":"general audience","messagingStrategy":"educational","bestContactTimes":[],"preferredCommunicationChannels":[],"interests":[],"behaviorPatterns":[],"marketingRecommendations":[]}'::json,
	"analysis_data" json,
	"source_platform" varchar(50),
	"collection_method" varchar(50),
	"last_analyzed" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_security_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"event_type" varchar NOT NULL,
	"severity" varchar NOT NULL,
	"ip_address" varchar,
	"user_agent" text,
	"location" varchar,
	"details" jsonb,
	"action_taken" varchar,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" varchar NOT NULL,
	"transaction_type" text NOT NULL,
	"amount" numeric(18, 9) NOT NULL,
	"currency" text DEFAULT 'SOL' NOT NULL,
	"from_address" text,
	"to_address" text,
	"transaction_signature" text,
	"blockchain_network" text DEFAULT 'solana',
	"status" text DEFAULT 'pending' NOT NULL,
	"purpose" text,
	"related_token_id" varchar,
	"related_user_id" varchar,
	"gas_used" numeric(18, 9),
	"fees" numeric(18, 9),
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_sections" (
	"id" varchar PRIMARY KEY NOT NULL,
	"section" varchar NOT NULL,
	"page" varchar NOT NULL,
	"title" text,
	"subtitle" text,
	"description" text,
	"button_text" text,
	"button_link" text,
	"image_url" text,
	"image_alt" text,
	"is_active" boolean DEFAULT true,
	"display_order" varchar DEFAULT '0',
	"custom_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "image_assets" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"original_name" varchar,
	"url" text NOT NULL,
	"alt_text" text,
	"category" varchar,
	"width" varchar,
	"height" varchar,
	"file_size" varchar,
	"usage_count" varchar DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "layout_configs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"page" varchar NOT NULL,
	"section" varchar NOT NULL,
	"layout_type" varchar NOT NULL,
	"grid_cols" varchar DEFAULT '1',
	"spacing" varchar DEFAULT 'medium',
	"alignment" varchar DEFAULT 'left',
	"background_color" varchar DEFAULT 'transparent',
	"text_color" varchar DEFAULT 'default',
	"custom_classes" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "text_content" (
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"category" varchar,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "text_content_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "theme_settings" (
	"id" varchar PRIMARY KEY DEFAULT 'default' NOT NULL,
	"primary_color" varchar DEFAULT '#8B5CF6',
	"secondary_color" varchar DEFAULT '#EC4899',
	"accent_color" varchar DEFAULT '#06B6D4',
	"background_color" varchar DEFAULT '#000000',
	"text_color" varchar DEFAULT '#FFFFFF',
	"font_family" varchar DEFAULT 'Inter',
	"border_radius" varchar DEFAULT '0.5rem',
	"custom_css" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_settings" ADD CONSTRAINT "admin_settings_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_queue" ADD CONSTRAINT "analysis_queue_batch_id_wallet_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."wallet_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_queue" ADD CONSTRAINT "analysis_queue_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_analytics" ADD CONSTRAINT "blog_analytics_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_title_variations" ADD CONSTRAINT "blog_title_variations_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_reply_to_message_id_chat_messages_id_fk" FOREIGN KEY ("reply_to_message_id") REFERENCES "public"."chat_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_redemptions" ADD CONSTRAINT "code_redemptions_code_id_redeemable_codes_id_fk" FOREIGN KEY ("code_id") REFERENCES "public"."redeemable_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_redemptions" ADD CONSTRAINT "code_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_redemptions" ADD CONSTRAINT "code_redemptions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custodial_wallet_transactions" ADD CONSTRAINT "custodial_wallet_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emotional_interactions" ADD CONSTRAINT "emotional_interactions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emotional_interactions" ADD CONSTRAINT "emotional_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enterprise_wallet_audit_trail" ADD CONSTRAINT "enterprise_wallet_audit_trail_wallet_id_enterprise_escrow_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."enterprise_escrow_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_fee_configs" ADD CONSTRAINT "escrow_fee_configs_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_insights" ADD CONSTRAINT "journey_insights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "limited_edition_sets" ADD CONSTRAINT "limited_edition_sets_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_listings" ADD CONSTRAINT "market_listings_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_listings" ADD CONSTRAINT "market_listings_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_fees" ADD CONSTRAINT "platform_fees_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_wallets" ADD CONSTRAINT "platform_wallets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing_config" ADD CONSTRAINT "pricing_config_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redeemable_codes" ADD CONSTRAINT "redeemable_codes_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemptions" ADD CONSTRAINT "redemptions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemptions" ADD CONSTRAINT "redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_bot_config_id_social_bot_configurations_id_fk" FOREIGN KEY ("bot_config_id") REFERENCES "public"."social_bot_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_conversation_threads" ADD CONSTRAINT "skye_conversation_threads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_conversations" ADD CONSTRAINT "skye_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_emotional_analysis" ADD CONSTRAINT "skye_emotional_analysis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_knowledge_base" ADD CONSTRAINT "skye_knowledge_base_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_messages" ADD CONSTRAINT "skye_messages_conversation_id_skye_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."skye_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_personality_profiles" ADD CONSTRAINT "skye_personality_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_personality_settings" ADD CONSTRAINT "skye_personality_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skye_user_memory" ADD CONSTRAINT "skye_user_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_deliveries" ADD CONSTRAINT "sms_deliveries_sms_message_id_sms_messages_id_fk" FOREIGN KEY ("sms_message_id") REFERENCES "public"."sms_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_deliveries" ADD CONSTRAINT "sms_deliveries_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_messages" ADD CONSTRAINT "sms_messages_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_bot_configurations" ADD CONSTRAINT "social_bot_configurations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_holdings" ADD CONSTRAINT "token_holdings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_holdings" ADD CONSTRAINT "token_holdings_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_limited_edition_set_id_limited_edition_sets_id_fk" FOREIGN KEY ("limited_edition_set_id") REFERENCES "public"."limited_edition_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_challenge_id_daily_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."daily_challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_journey_progress" ADD CONSTRAINT "user_journey_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_journey_progress" ADD CONSTRAINT "user_journey_progress_milestone_id_journey_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."journey_milestones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wallet_balances" ADD CONSTRAINT "user_wallet_balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_attachments" ADD CONSTRAINT "value_attachments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_attachments" ADD CONSTRAINT "value_attachments_recipient_user_id_users_id_fk" FOREIGN KEY ("recipient_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_attachments" ADD CONSTRAINT "value_attachments_redeemed_by_users_id_fk" FOREIGN KEY ("redeemed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_messages" ADD CONSTRAINT "voice_messages_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_messages" ADD CONSTRAINT "voice_messages_chat_message_id_chat_messages_id_fk" FOREIGN KEY ("chat_message_id") REFERENCES "public"."chat_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_messages" ADD CONSTRAINT "voice_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_alerts" ADD CONSTRAINT "wallet_alerts_wallet_id_platform_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."platform_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_alerts" ADD CONSTRAINT "wallet_alerts_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_batches" ADD CONSTRAINT "wallet_batches_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_security_logs" ADD CONSTRAINT "wallet_security_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_platform_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."platform_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_related_token_id_tokens_id_fk" FOREIGN KEY ("related_token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_related_user_id_users_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;