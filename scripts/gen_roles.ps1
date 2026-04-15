$base = "C:\Users\mingjwan\.openclaw\agents\ray-cto\workspace\agent-roles\roles"

$roles = @(
  @{cat="customer-service"; id="customer-service-rep"; name="Customer Service Representative"; zh="客服代表"; skills=@("ticket-management","knowledge-base-search","sentiment-analysis","response-templating","escalation-routing"); metrics=@("first-response-time","customer-satisfaction-score","resolution-rate")}
  @{cat="customer-service"; id="complaint-handler"; name="Complaint Handler"; zh="投诉处理专员"; skills=@("complaint-classification","root-cause-analysis","compensation-calculator","escalation-management","follow-up-tracking"); metrics=@("complaint-resolution-time","repeat-complaint-rate","compensation-accuracy")}
  @{cat="customer-service"; id="live-chat-agent"; name="Live Chat Agent"; zh="在线客服"; skills=@("real-time-response","multi-session-management","quick-reply-templates","product-knowledge","chat-transfer"); metrics=@("average-response-time","concurrent-chats-handled","chat-satisfaction-score")}
  @{cat="sales"; id="sales-development-rep"; name="Sales Development Representative"; zh="销售拓展代表"; skills=@("lead-qualification","cold-outreach","crm-management","pipeline-tracking","meeting-scheduling"); metrics=@("qualified-leads-per-month","outreach-response-rate","meetings-booked")}
  @{cat="sales"; id="account-executive"; name="Account Executive"; zh="客户经理"; skills=@("deal-negotiation","proposal-generation","stakeholder-mapping","demo-presentation","contract-management"); metrics=@("quota-attainment","average-deal-size","win-rate")}
  @{cat="sales"; id="sales-analyst"; name="Sales Analyst"; zh="销售分析师"; skills=@("sales-data-analysis","pipeline-reporting","forecast-modeling","territory-analysis","competitive-tracking"); metrics=@("forecast-accuracy","report-delivery-time","insight-actionability-score")}
  @{cat="marketing"; id="social-media-manager"; name="Social Media Manager"; zh="社媒运营"; skills=@("content-scheduling","audience-analytics","platform-optimization","community-management","trend-monitoring"); metrics=@("engagement-rate","follower-growth","content-reach")}
  @{cat="marketing"; id="seo-specialist"; name="SEO Specialist"; zh="SEO专员"; skills=@("keyword-research","on-page-optimization","technical-seo-audit","backlink-analysis","rank-tracking"); metrics=@("organic-traffic-growth","keyword-rankings","domain-authority")}
  @{cat="marketing"; id="content-marketer"; name="Content Marketer"; zh="内容营销"; skills=@("content-strategy","blog-writing","lead-magnet-creation","content-distribution","performance-analytics"); metrics=@("content-leads-generated","organic-traffic-from-content","content-engagement-rate")}
  @{cat="finance"; id="accounts-payable-clerk"; name="Accounts Payable Clerk"; zh="应付账款专员"; skills=@("invoice-processing","vendor-management","payment-scheduling","expense-categorization","reconciliation"); metrics=@("invoice-processing-time","payment-accuracy-rate","early-payment-discount-capture")}
  @{cat="finance"; id="financial-analyst"; name="Financial Analyst"; zh="财务分析师"; skills=@("financial-modeling","budget-analysis","variance-reporting","scenario-planning","kpi-dashboarding"); metrics=@("forecast-accuracy","report-turnaround-time","budget-variance-explanation-rate")}
  @{cat="finance"; id="tax-preparer"; name="Tax Preparer"; zh="税务专员"; skills=@("tax-calculation","compliance-checking","deduction-optimization","filing-management","regulatory-monitoring"); metrics=@("filing-accuracy-rate","on-time-filing-rate","tax-savings-identified")}
  @{cat="hr"; id="recruiter"; name="Recruiter"; zh="招聘专员"; skills=@("candidate-sourcing","resume-screening","interview-coordination","offer-management","employer-branding"); metrics=@("time-to-fill","quality-of-hire","offer-acceptance-rate")}
  @{cat="hr"; id="onboarding-specialist"; name="Onboarding Specialist"; zh="入职引导专员"; skills=@("onboarding-workflow","documentation-management","training-coordination","buddy-matching","feedback-collection"); metrics=@("new-hire-satisfaction-score","onboarding-completion-rate","time-to-productivity")}
  @{cat="hr"; id="hr-coordinator"; name="HR Coordinator"; zh="HR协调员"; skills=@("employee-records-management","benefits-administration","policy-compliance","event-coordination","hr-reporting"); metrics=@("record-accuracy-rate","query-response-time","compliance-audit-score")}
  @{cat="tech"; id="code-reviewer"; name="Code Reviewer"; zh="代码审查员"; skills=@("static-analysis","security-scanning","best-practice-enforcement","performance-review","documentation-review"); metrics=@("review-turnaround-time","defect-detection-rate","review-thoroughness-score")}
  @{cat="tech"; id="devops-engineer"; name="DevOps Engineer"; zh="运维工程师"; skills=@("ci-cd-pipeline","infrastructure-as-code","monitoring-alerting","container-orchestration","incident-response"); metrics=@("deployment-frequency","mean-time-to-recovery","change-failure-rate")}
  @{cat="data"; id="data-analyst"; name="Data Analyst"; zh="数据分析师"; skills=@("sql-querying","data-visualization","statistical-analysis","ab-testing","etl-management"); metrics=@("insight-delivery-time","analysis-accuracy","stakeholder-satisfaction")}
  @{cat="data"; id="report-generator"; name="Report Generator"; zh="报表专员"; skills=@("report-templating","data-aggregation","scheduled-reporting","cross-system-integration","format-conversion"); metrics=@("report-delivery-timeliness","data-accuracy-rate","report-automation-rate")}
  @{cat="content"; id="copywriter"; name="Copywriter"; zh="文案"; skills=@("brand-voice-writing","headline-crafting","ad-copywriting","email-copy","a-b-copy-testing"); metrics=@("conversion-rate","click-through-rate","brand-consistency-score")}
)

foreach ($r in $roles) {
    $dir = "$base\$($r.cat)\$($r.id)"
    $promptDir = "$dir\prompts"
    New-Item -ItemType Directory -Path $promptDir -Force | Out-Null

    $skillsYaml = ($r.skills | ForEach-Object { "  - $_" }) -join "`n"
    $metricsYaml = ($r.metrics | ForEach-Object { "  - $_" }) -join "`n"
    @"
id: $($r.id)
name: $($r.name)
name_zh: $($r.zh)
category: $($r.cat)
version: "1.0.0"

skills:
$skillsYaml

metrics:
$metricsYaml

triggers:
  - type: manual
    description: Activated by user request

constraints:
  - Follow company policies and guidelines
  - Maintain data confidentiality
  - Escalate issues beyond scope
"@ | Set-Content -Path "$dir\oad.yaml" -Encoding UTF8

    @"
# $($r.name) ($($r.zh))

**Category:** $($r.cat)

## Use Cases

1. Daily operations and routine task handling
2. Process automation for repetitive workflows
3. Quality assurance and compliance checks
4. Role-specific reporting and metrics
5. Team onboarding with consistent processes

## Skills

$($r.skills | ForEach-Object { "- ``$_``" } | Out-String)
## Metrics

$($r.metrics | ForEach-Object { "- ``$_``" } | Out-String)
"@ | Set-Content -Path "$dir\README.md" -Encoding UTF8
}

Write-Output "Created $($roles.Count) role directories with oad.yaml and README.md"
