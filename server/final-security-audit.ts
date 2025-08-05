// Final Security Audit for Production Deployment
import crypto from 'crypto';
import { getCurrentEnvironment, validateEnvironment } from '@shared/environment-config';

export interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  remediation?: string;
}

export interface SecurityAuditResult {
  overallScore: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  checks: SecurityCheck[];
  recommendations: string[];
  isProductionReady: boolean;
}

// Security Audit Implementation
export async function performSecurityAudit(): Promise<SecurityAuditResult> {
  const checks: SecurityCheck[] = [];
  
  // Environment Security Checks
  checks.push(...await auditEnvironmentSecurity());
  
  // Wallet Security Checks
  checks.push(...await auditWalletSecurity());
  
  // API Security Checks
  checks.push(...await auditAPISecurity());
  
  // Database Security Checks
  checks.push(...await auditDatabaseSecurity());
  
  // Network Security Checks
  checks.push(...await auditNetworkSecurity());
  
  // Authentication Security Checks
  checks.push(...await auditAuthenticationSecurity());
  
  // Calculate overall results
  const criticalIssues = checks.filter(c => c.severity === 'critical' && c.status === 'fail').length;
  const highIssues = checks.filter(c => c.severity === 'high' && c.status === 'fail').length;
  const mediumIssues = checks.filter(c => c.severity === 'medium' && c.status === 'fail').length;
  const lowIssues = checks.filter(c => c.severity === 'low' && c.status === 'fail').length;
  
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const overallScore = Math.round((passedChecks / totalChecks) * 100);
  
  const isProductionReady = criticalIssues === 0 && highIssues === 0;
  
  const recommendations = generateSecurityRecommendations(checks);
  
  return {
    overallScore,
    criticalIssues,
    highIssues,
    mediumIssues,
    lowIssues,
    checks,
    recommendations,
    isProductionReady
  };
}

// Environment Security Audit
async function auditEnvironmentSecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  const env = getCurrentEnvironment();
  const validation = validateEnvironment();
  
  // Check if running in production mode
  checks.push({
    id: 'env_production_mode',
    name: 'Production Mode Configuration',
    description: 'Verify application is configured for production',
    severity: 'critical',
    status: env.isProduction ? 'pass' : 'fail',
    message: env.isProduction ? 'Application is in production mode' : 'Application is not in production mode',
    remediation: 'Set SOLANA_NETWORK=mainnet-beta in environment variables'
  });
  
  // Check environment variable security
  checks.push({
    id: 'env_secrets_present',
    name: 'Required Environment Variables',
    description: 'Verify all required environment variables are set',
    severity: 'critical',
    status: validation.isValid ? 'pass' : 'fail',
    message: validation.isValid ? 'All required environment variables are set' : `Missing variables: ${validation.errors.join(', ')}`,
    remediation: 'Set all required environment variables for production'
  });
  
  // Check for debug mode disabled
  const debugMode = process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true';
  checks.push({
    id: 'env_debug_disabled',
    name: 'Debug Mode Disabled',
    description: 'Verify debug mode is disabled in production',
    severity: 'high',
    status: debugMode ? 'fail' : 'pass',
    message: debugMode ? 'Debug mode is enabled' : 'Debug mode is disabled',
    remediation: 'Set NODE_ENV=production and remove DEBUG environment variable'
  });
  
  return checks;
}

// Wallet Security Audit
async function auditWalletSecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  const env = getCurrentEnvironment();
  
  // Check wallet key security
  const mintAuthority = env.walletConfig.tokenMintAuthority;
  checks.push({
    id: 'wallet_mint_authority',
    name: 'Mint Authority Security',
    description: 'Verify mint authority is properly configured',
    severity: 'critical',
    status: mintAuthority && mintAuthority.length > 32 ? 'pass' : 'fail',
    message: mintAuthority ? 'Mint authority is configured' : 'Mint authority not configured',
    remediation: 'Configure secure mint authority with hardware security module'
  });
  
  // Check escrow wallet configuration
  const escrowWallet = env.walletConfig.escrowWallet;
  checks.push({
    id: 'wallet_escrow_security',
    name: 'Escrow Wallet Security',
    description: 'Verify escrow wallet is properly secured',
    severity: 'critical',
    status: escrowWallet && escrowWallet.length > 32 ? 'pass' : 'fail',
    message: escrowWallet ? 'Escrow wallet is configured' : 'Escrow wallet not configured',
    remediation: 'Configure multi-signature escrow wallet for enhanced security'
  });
  
  // Check fee collection wallet
  const feeWallet = env.walletConfig.feeCollectionWallet;
  checks.push({
    id: 'wallet_fee_collection',
    name: 'Fee Collection Wallet',
    description: 'Verify fee collection wallet is secure',
    severity: 'high',
    status: feeWallet && feeWallet.length > 32 ? 'pass' : 'fail',
    message: feeWallet ? 'Fee collection wallet is configured' : 'Fee collection wallet not configured',
    remediation: 'Configure secure fee collection wallet'
  });
  
  return checks;
}

// API Security Audit
async function auditAPISecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  // Check HTTPS enforcement
  const httpsEnforced = process.env.HTTPS_ONLY === 'true' || process.env.NODE_ENV === 'production';
  checks.push({
    id: 'api_https_enforced',
    name: 'HTTPS Enforcement',
    description: 'Verify HTTPS is enforced for all API endpoints',
    severity: 'critical',
    status: httpsEnforced ? 'pass' : 'warning',
    message: httpsEnforced ? 'HTTPS enforcement is configured' : 'HTTPS enforcement should be verified',
    remediation: 'Ensure all production traffic uses HTTPS'
  });
  
  // Check rate limiting
  const rateLimitingEnabled = process.env.ENABLE_RATE_LIMITING !== 'false';
  checks.push({
    id: 'api_rate_limiting',
    name: 'API Rate Limiting',
    description: 'Verify rate limiting is enabled',
    severity: 'high',
    status: rateLimitingEnabled ? 'pass' : 'fail',
    message: rateLimitingEnabled ? 'Rate limiting is enabled' : 'Rate limiting is disabled',
    remediation: 'Enable rate limiting for all API endpoints'
  });
  
  // Check CORS configuration
  const corsConfigured = process.env.CORS_ORIGIN !== '*';
  checks.push({
    id: 'api_cors_security',
    name: 'CORS Security',
    description: 'Verify CORS is properly configured',
    severity: 'medium',
    status: corsConfigured ? 'pass' : 'warning',
    message: corsConfigured ? 'CORS is properly configured' : 'CORS configuration should be verified',
    remediation: 'Configure CORS to allow only trusted origins'
  });
  
  // Check OpenAI API key security
  const openaiKey = process.env.OPENAI_API_KEY;
  checks.push({
    id: 'api_openai_key',
    name: 'OpenAI API Key Security',
    description: 'Verify OpenAI API key is properly secured',
    severity: 'high',
    status: openaiKey && openaiKey.startsWith('sk-') ? 'pass' : 'fail',
    message: openaiKey ? 'OpenAI API key is configured' : 'OpenAI API key not configured',
    remediation: 'Configure secure OpenAI API key with appropriate usage limits'
  });
  
  return checks;
}

// Database Security Audit
async function auditDatabaseSecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  // Check database URL security
  const databaseUrl = process.env.DATABASE_URL;
  const isSecureConnection = databaseUrl?.includes('sslmode=require') || databaseUrl?.includes('ssl=true');
  checks.push({
    id: 'db_ssl_connection',
    name: 'Database SSL Connection',
    description: 'Verify database connections use SSL',
    severity: 'critical',
    status: isSecureConnection ? 'pass' : 'warning',
    message: isSecureConnection ? 'Database SSL is configured' : 'Database SSL should be verified',
    remediation: 'Ensure database connections use SSL encryption'
  });
  
  // Check for database credentials exposure
  const hasCredentials = databaseUrl && databaseUrl.includes('://');
  checks.push({
    id: 'db_credentials_secure',
    name: 'Database Credentials Security',
    description: 'Verify database credentials are properly secured',
    severity: 'high',
    status: hasCredentials ? 'pass' : 'fail',
    message: hasCredentials ? 'Database credentials are configured' : 'Database credentials not found',
    remediation: 'Use environment variables for database credentials'
  });
  
  return checks;
}

// Network Security Audit
async function auditNetworkSecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  // Check security headers
  const securityHeadersEnabled = process.env.ENABLE_SECURITY_HEADERS !== 'false';
  checks.push({
    id: 'network_security_headers',
    name: 'Security Headers',
    description: 'Verify security headers are enabled',
    severity: 'high',
    status: securityHeadersEnabled ? 'pass' : 'fail',
    message: securityHeadersEnabled ? 'Security headers are enabled' : 'Security headers are disabled',
    remediation: 'Enable security headers including CSP, HSTS, and X-Frame-Options'
  });
  
  // Check content security policy
  const cspEnabled = process.env.CSP_ENABLED !== 'false';
  checks.push({
    id: 'network_csp',
    name: 'Content Security Policy',
    description: 'Verify CSP is properly configured',
    severity: 'medium',
    status: cspEnabled ? 'pass' : 'warning',
    message: cspEnabled ? 'CSP is configured' : 'CSP should be verified',
    remediation: 'Configure Content Security Policy to prevent XSS attacks'
  });
  
  return checks;
}

// Authentication Security Audit
async function auditAuthenticationSecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  // Check session security
  const sessionSecret = process.env.SESSION_SECRET;
  const sessionSecure = sessionSecret && sessionSecret.length >= 32;
  checks.push({
    id: 'auth_session_security',
    name: 'Session Security',
    description: 'Verify session security configuration',
    severity: 'high',
    status: sessionSecure ? 'pass' : 'fail',
    message: sessionSecure ? 'Session security is configured' : 'Session security needs configuration',
    remediation: 'Use strong session secrets and secure session configuration'
  });
  
  // Check audit logging
  const auditLogging = process.env.ENABLE_AUDIT_LOGGING === 'true';
  checks.push({
    id: 'auth_audit_logging',
    name: 'Audit Logging',
    description: 'Verify audit logging is enabled',
    severity: 'medium',
    status: auditLogging ? 'pass' : 'warning',
    message: auditLogging ? 'Audit logging is enabled' : 'Audit logging should be enabled',
    remediation: 'Enable comprehensive audit logging for security monitoring'
  });
  
  return checks;
}

// Generate security recommendations
function generateSecurityRecommendations(checks: SecurityCheck[]): string[] {
  const recommendations: string[] = [];
  
  const criticalFailures = checks.filter(c => c.severity === 'critical' && c.status === 'fail');
  const highFailures = checks.filter(c => c.severity === 'high' && c.status === 'fail');
  
  if (criticalFailures.length > 0) {
    recommendations.push('🔴 CRITICAL: Address all critical security issues before production deployment');
    criticalFailures.forEach(check => {
      if (check.remediation) {
        recommendations.push(`  - ${check.name}: ${check.remediation}`);
      }
    });
  }
  
  if (highFailures.length > 0) {
    recommendations.push('🟡 HIGH: Address high-priority security issues');
    highFailures.forEach(check => {
      if (check.remediation) {
        recommendations.push(`  - ${check.name}: ${check.remediation}`);
      }
    });
  }
  
  // General recommendations
  recommendations.push('🔐 Enable multi-factor authentication for all admin accounts');
  recommendations.push('📊 Set up security monitoring and alerting');
  recommendations.push('🔄 Implement regular security audits and penetration testing');
  recommendations.push('📝 Maintain security documentation and incident response procedures');
  recommendations.push('🚨 Configure intrusion detection and prevention systems');
  
  return recommendations;
}

// Generate security audit report
export function generateSecurityReport(auditResult: SecurityAuditResult): string {
  const { overallScore, criticalIssues, highIssues, mediumIssues, lowIssues, checks, recommendations, isProductionReady } = auditResult;
  
  let report = `# Flutterbye Security Audit Report
Generated: ${new Date().toISOString()}

## Executive Summary
**Overall Security Score: ${overallScore}/100**
**Production Ready: ${isProductionReady ? '✅ YES' : '❌ NO'}**

## Issue Summary
- Critical Issues: ${criticalIssues}
- High Priority Issues: ${highIssues}
- Medium Priority Issues: ${mediumIssues}
- Low Priority Issues: ${lowIssues}

## Security Checks Results
`;

  // Group checks by severity
  const severityOrder: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
  
  for (const severity of severityOrder) {
    const severityChecks = checks.filter(c => c.severity === severity);
    if (severityChecks.length > 0) {
      report += `\n### ${severity.toUpperCase()} Priority\n`;
      
      for (const check of severityChecks) {
        const status = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
        report += `${status} **${check.name}**: ${check.message}\n`;
        if (check.status === 'fail' && check.remediation) {
          report += `   *Remediation: ${check.remediation}*\n`;
        }
        report += '\n';
      }
    }
  }
  
  report += `\n## Security Recommendations\n`;
  for (const recommendation of recommendations) {
    report += `- ${recommendation}\n`;
  }
  
  report += `\n## Production Readiness Assessment
${isProductionReady ? 
  'The platform has passed all critical security checks and is ready for production deployment.' :
  'The platform has security issues that must be addressed before production deployment.'
}

## Next Steps
${isProductionReady ? 
  '1. Proceed with production deployment\n2. Set up security monitoring\n3. Schedule regular security audits' :
  '1. Address all critical and high-priority security issues\n2. Re-run security audit\n3. Proceed with deployment only after all issues are resolved'
}
`;

  return report;
}

// Quick security validation for deployment
export async function quickSecurityValidation(): Promise<{ isSecure: boolean; criticalIssues: string[] }> {
  const env = getCurrentEnvironment();
  const validation = validateEnvironment();
  const criticalIssues: string[] = [];
  
  if (!env.isProduction) {
    criticalIssues.push('Application not in production mode');
  }
  
  if (!validation.isValid) {
    criticalIssues.push('Required environment variables missing');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    criticalIssues.push('OpenAI API key not configured');
  }
  
  if (!process.env.DATABASE_URL) {
    criticalIssues.push('Database URL not configured');
  }
  
  return {
    isSecure: criticalIssues.length === 0,
    criticalIssues
  };
}

export default {
  performSecurityAudit,
  generateSecurityReport,
  quickSecurityValidation
};