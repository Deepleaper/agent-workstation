$base = "C:\Users\mingjwan\.openclaw\agents\ray-cto\workspace\agent-roles\roles"

$roles = @(
  @{cat="legal";id="contract-reviewer";name="Contract Reviewer";zh="合同审查"},
  @{cat="legal";id="compliance-officer";name="Compliance Officer";zh="合规专员"},
  @{cat="legal";id="legal-researcher";name="Legal Researcher";zh="法律研究员"},
  @{cat="operations";id="inventory-manager";name="Inventory Manager";zh="库存管理"},
  @{cat="operations";id="logistics-coordinator";name="Logistics Coordinator";zh="物流协调"},
  @{cat="operations";id="quality-inspector";name="Quality Inspector";zh="质检员"},
  @{cat="product";id="product-manager";name="Product Manager";zh="产品经理"},
  @{cat="product";id="ux-researcher";name="UX Researcher";zh="用户研究员"},
  @{cat="product";id="product-analyst";name="Product Analyst";zh="产品分析师"},
  @{cat="design";id="ui-designer";name="UI Designer";zh="UI设计师"},
  @{cat="design";id="brand-designer";name="Brand Designer";zh="品牌设计师"},
  @{cat="education";id="online-tutor";name="Online Tutor";zh="在线辅导"},
  @{cat="education";id="course-designer";name="Course Designer";zh="课程设计师"},
  @{cat="education";id="training-coordinator";name="Training Coordinator";zh="培训协调员"},
  @{cat="healthcare";id="patient-coordinator";name="Patient Coordinator";zh="患者协调员"},
  @{cat="healthcare";id="health-advisor";name="Health Advisor";zh="健康顾问"},
  @{cat="admin";id="office-manager";name="Office Manager";zh="行政经理"},
  @{cat="admin";id="executive-assistant";name="Executive Assistant";zh="行政助理"},
  @{cat="admin";id="travel-coordinator";name="Travel Coordinator";zh="差旅协调"},
  @{cat="customer-service";id="vip-account-manager";name="VIP Account Manager";zh="VIP客户经理"}
)

foreach ($r in $roles) {
  $dir = "$base\$($r.cat)\$($r.id)"
  New-Item -ItemType Directory -Path "$dir\prompts" -Force | Out-Null
  Write-Host "Created $($r.cat)/$($r.id)"
}
Write-Host "Directories created: $($roles.Count)"
