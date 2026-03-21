import type { AssessmentResult } from './types';

/**
 * Full V2 demo assessment — used when the API key is missing or the user clicks "Try Demo".
 * Represents a 20-year-old who just aged out, has some documents, goal is community college.
 */
export const DEMO_RESULT: AssessmentResult = {
  key_insight:
    "You qualify for up to $12,395 in grant funding this year — money that doesn't need to be repaid. The Pell Grant ($7,395) plus the ETV ($5,000) together cover most of a community college year, and the Arizona Tuition Waiver covers whatever tuition remains. FAFSA is the first move that unlocks everything.",

  readiness: {
    overall: 52,
    academic: {
      score: 60,
      summary:
        "You have a clear education goal — that's the foundation. Getting your transcripts together is the next piece, and gaps from school changes are completely normal and not a barrier.",
    },
    financial_aid: {
      score: 40,
      summary:
        "Three major funding sources are available to you — the Pell Grant, ETV, and Arizona Tuition Waiver. Together they can cover over $12,000 per year. You haven't applied yet — that's where the work is.",
    },
    application: {
      score: 35,
      summary:
        "A few key documents are still needed. Proof of foster care and your FAFSA are the two that unlock everything else — once those are in hand, the rest follows quickly.",
    },
    timeline: {
      score: 75,
      summary:
        "You just aged out — you're in the best window to act. The ETV deadline is July 31, 2026. Filing FAFSA now keeps every door open and positions you for Fall 2026 enrollment.",
    },
    overall_summary:
      "You're more than halfway there. The funding exists — three programs covering over $12,000/year. The work now is paperwork, not eligibility. Completing your FAFSA alone will move your score up by 12 points and unlock two more programs.",
  },

  matched_programs: [
    {
      id: "federal_pell",
      name: "Federal Pell Grant",
      what_it_covers: "Tuition, fees, room and board, books, supplies, transportation",
      max_amount: "$7,395/year",
      confidence: "eligible",
      confidence_reason:
        "Foster youth automatically qualify as independent students — no parental income required. Answer YES to the foster care question on the FAFSA.",
      deadline: "January 1, 2027 (recommended)",
      days_until_deadline: 287,
      next_action:
        "Complete FAFSA at studentaid.gov — takes about 30 minutes. Use school code 001081 for ASU or 001073 for Mesa CC.",
      source_url: "https://studentaid.gov/h/apply-for-aid/fafsa",
      verify_with: "Mesa CC Financial Aid Office: 480-461-7400 | financialaid.mesacc.edu",
    },
    {
      id: "az_etv",
      name: "Arizona Education and Training Voucher (ETV)",
      what_it_covers:
        "Tuition, housing, books, student loan repayments, qualified living expenses",
      max_amount: "$5,000/year (up to 10 semesters)",
      confidence: "likely_eligible",
      confidence_reason:
        "You appear to meet the core criteria (foster care after 16, under 26), but your exact foster care entry age and asset level need verification before confirming eligibility.",
      deadline: "July 31, 2026",
      days_until_deadline: 133,
      next_action:
        "Apply at Foster Success Education Services portal. First-come, first-served — apply as soon as your transcripts and proof of foster care are ready.",
      source_url: "https://fseducation.fostersuccess.org/arizona-etv/",
      verify_with: "Foster Success Education Services: fseducation.fostersuccess.org",
    },
    {
      id: "az_tuition_waiver",
      name: "Arizona Tuition Waiver (Foster Youth Award)",
      what_it_covers:
        "Remaining tuition and mandatory fees after all other grants/scholarships applied",
      max_amount: "Full remaining tuition",
      confidence: "likely_eligible",
      confidence_reason:
        "Requires FAFSA completion, enrollment at an AZ public college, and 30 volunteer hours. Complete FAFSA first — the waiver is applied after Pell Grant.",
      deadline: "Rolling — apply after FAFSA is processed",
      days_until_deadline: null,
      next_action:
        "Complete FAFSA first. Then apply through Foster Success. This covers whatever tuition Pell doesn't — which can mean $0 tuition at community colleges.",
      source_url: "https://www.azleg.gov/ars/15/01809-01.htm",
      verify_with:
        "Bridging Success Champion at Mesa CC: mesacc.edu/bridging-success | 480-461-7000",
    },
  ],

  school_matches: [
    {
      id: "mesa_cc",
      name: "Mesa Community College",
      type: "community_college",
      fit_score: 88,
      fit_label: "Strong match",
      fit_reasons: [
        "Lowest estimated out-of-pocket cost — tuition is fully covered by Pell + Tuition Waiver, leaving only living costs for ETV to address",
        "Has a dedicated Bridging Success campus champion who helps foster youth navigate funding and enrollment step-by-step",
        "Light Rail stop is adjacent to campus, making it highly accessible without a car",
      ],
      cost_breakdown: {
        annual_tuition: 2610,
        pell_grant_applied: 2610,
        tuition_after_waiver: 0,
        mandatory_fees: 240,
        books_supplies: 800,
        housing_estimate: 11400,
        transportation: 600,
        personal: 1200,
        total_cost_of_attendance: 14240,
        etv_applied: 5000,
        other_scholarships: 500,
        estimated_out_of_pocket: 8740,
        cost_note:
          "Tuition and fee estimates are for 2025-2026. Verify current rates at mesacc.edu/paying-for-college",
      },
      foster_support: {
        program_name: "Bridging Success Program",
        has_champion: true,
        contact:
          "Bridging Success Champion at Mesa CC: mesacc.edu/bridging-success | 480-461-7000",
        program_url: "https://www.maricopa.edu/students/student-support/foster-youth",
        services: [
          "Dedicated campus champion",
          "Tutoring",
          "Mentoring",
          "Basic needs assistance",
          "Career exploration",
          "Transfer planning to ASU/U of A/NAU",
          "Emergency funds",
          "Textbook support",
        ],
      },
      housing_options: {
        on_campus_available: false,
        on_campus_cost: null,
        avg_nearby_rent: 950,
        housing_note:
          "Estimated range: $800–$1,100/month near campus. No on-campus housing. Contact Mesa CC's housing resource coordinator for off-campus options.",
      },
      why_this_school:
        "Mesa CC makes the most financial sense for your situation — tuition is fully covered by the grants you qualify for, the Bridging Success champion knows the exact steps to get your ETV and waiver processed, and the Light Rail stop makes it accessible without a car.",
      source_urls: [
        "https://www.mesacc.edu/",
        "https://www.mesacc.edu/paying-for-college/tuition-fees",
      ],
    },
    {
      id: "phoenix_college",
      name: "Phoenix College",
      type: "community_college",
      fit_score: 75,
      fit_label: "Good match",
      fit_reasons: [
        "Same Maricopa district tuition rate as Mesa CC — Pell Grant fully covers tuition, waiver covers any remainder",
        "Central Phoenix location with direct Light Rail access at 19th Ave/Camelback station",
        "Bridging Success campus champion available to coordinate all foster youth benefits",
      ],
      cost_breakdown: {
        annual_tuition: 2610,
        pell_grant_applied: 2610,
        tuition_after_waiver: 0,
        mandatory_fees: 240,
        books_supplies: 800,
        housing_estimate: 12000,
        transportation: 600,
        personal: 1200,
        total_cost_of_attendance: 14840,
        etv_applied: 5000,
        other_scholarships: 500,
        estimated_out_of_pocket: 9340,
        cost_note:
          "Tuition and fee estimates are for 2025-2026. Verify current rates at phoenixcollege.edu",
      },
      foster_support: {
        program_name: "Bridging Success Program",
        has_champion: true,
        contact:
          "Bridging Success Champion at Phoenix College: phoenixcollege.edu | Student Services",
        program_url: "https://www.maricopa.edu/students/student-support/foster-youth",
        services: [
          "Dedicated campus champion",
          "Tutoring and academic support",
          "Mentoring",
          "Basic needs assistance",
          "Career exploration",
          "Transfer planning",
          "Emergency funds",
        ],
      },
      housing_options: {
        on_campus_available: false,
        on_campus_cost: null,
        avg_nearby_rent: 1000,
        housing_note:
          "Estimated range: $800–$1,200/month near campus. Contact Phoenix College's student services for housing resources.",
      },
      why_this_school:
        "Phoenix College is a solid option if you prefer a central Phoenix location — the Light Rail access is excellent and the Bridging Success program offers the same foster youth support as Mesa CC. Slightly higher nearby rent is the main difference.",
      source_urls: ["https://www.phoenixcollege.edu/"],
    },
    {
      id: "asu",
      name: "Arizona State University",
      type: "university",
      fit_score: 62,
      fit_label: "Worth exploring",
      fit_reasons: [
        "Has a dedicated Foster Youth Programs office (UCENT 240, Tempe) with advisors who specialize in stacking the Pell, ETV, and Tuition Waiver",
        "The Tuition Waiver covers remaining tuition after Pell, meaning tuition cost approaches $0 for eligible foster youth",
        "ASU Online offers 300+ degrees — a fully remote option if in-person attendance is a barrier",
      ],
      cost_breakdown: {
        annual_tuition: 11822,
        pell_grant_applied: 7395,
        tuition_after_waiver: 0,
        mandatory_fees: 588,
        books_supplies: 1000,
        housing_estimate: 13200,
        transportation: 800,
        personal: 1500,
        total_cost_of_attendance: 17088,
        etv_applied: 5000,
        other_scholarships: 1000,
        estimated_out_of_pocket: 11088,
        cost_note:
          "Tuition and fee estimates are for 2025-2026. Verify current rates at students.asu.edu/tuition",
      },
      foster_support: {
        program_name: "ASU Foster Youth Programs",
        has_champion: true,
        contact:
          "Foster Youth Programs: fosteryouth.asu.edu | UCENT 240, Tempe campus | 480-965-0550",
        program_url: "https://fosteryouth.asu.edu/",
        services: [
          "Dedicated foster youth advisor",
          "Tuition waiver coordination",
          "ETV application assistance",
          "Priority registration",
          "Emergency funds",
          "Food pantry access",
          "Housing support",
          "Textbook lending",
        ],
      },
      housing_options: {
        on_campus_available: true,
        on_campus_cost: 13200,
        avg_nearby_rent: 1100,
        housing_note:
          "Estimated range: $900–$1,300/month near campus. On-campus housing available. Contact ASU Housing at housing.asu.edu for foster youth priority options.",
      },
      why_this_school:
        "ASU is worth exploring if your goal is a 4-year degree — the dedicated Foster Youth Programs office handles all the paperwork to stack your benefits, and the Tuition Waiver means tuition can reach $0. The higher living costs in Tempe are the main trade-off versus a community college start.",
      source_urls: [
        "https://fosteryouth.asu.edu/",
        "https://students.asu.edu/tuition",
      ],
    },
  ],

  other_options_note:
    "The Arizona Tuition Waiver applies at ALL Arizona public colleges and universities — not just the three listed here. This includes U of A, NAU, all Maricopa colleges, Pima CC, and more. Ask your caseworker or any school's financial aid office about options not shown here.",

  action_plan: [
    {
      step_number: 1,
      title: "Complete FAFSA",
      why_this_is_next:
        "The Pell Grant ($7,395/yr) and the Arizona Tuition Waiver both require FAFSA. Without it, those doors are closed — and this is the fastest step that moves the most money.",
      deadline: "January 1, 2027 recommended",
      days_until_deadline: 287,
      urgency_note: null,
      documents_needed: [
        {
          name: "Social Security Number",
          status: "need",
          how_to_get:
            "If lost, get a free replacement at ssa.gov/myaccount — takes about 10 minutes online.",
        },
        {
          name: "State ID or Driver's License",
          status: "need",
          how_to_get:
            "Arizona MVD at azmvdnow.gov — bring birth cert + SSN + AZ address proof. Takes about 1 hour.",
        },
      ],
      specific_action:
        "Go to studentaid.gov, create an FSA ID, then complete the FAFSA. Answer YES to the foster care question — it's on page 3.",
      where_to_go: "studentaid.gov/h/apply-for-aid/fafsa",
      what_to_bring: "Your SSN, State ID, and any income information (if any)",
      estimated_time: "30–45 minutes",
      confidence: "certain",
      verify_with: "Mesa CC Financial Aid: 480-461-7400 | financialaid.mesacc.edu",
      source_url: "https://studentaid.gov/h/apply-for-aid/fafsa",
    },
    {
      step_number: 2,
      title: "Get Proof of Foster Care",
      why_this_is_next:
        "This document unlocks both the ETV and the Tuition Waiver — and it's often the hardest to get, so start now while working on FAFSA.",
      deadline: null,
      days_until_deadline: null,
      urgency_note: null,
      documents_needed: [
        {
          name: "DCS Letter or Court Records",
          status: "need",
          how_to_get:
            "Call DCS at 1-888-767-2445 and request a letter verifying your foster care history. Or contact your former caseworker. Court records available at Superior Court.",
        },
      ],
      specific_action:
        "Call Arizona DCS (1-888-767-2445) and ask for a verification letter confirming your foster care history. Reference ARS 15-1809.01 if they ask what it's for.",
      where_to_go: "Arizona DCS: 1-888-767-2445 | Arizona Superior Court Records",
      what_to_bring:
        "Your full name, date of birth, and any case numbers you have",
      estimated_time: "1–2 hours (phone call + waiting for letter)",
      confidence: "high",
      verify_with: "Arizona DCS: 1-888-767-2445",
      source_url: "https://www.azleg.gov/ars/15/01809-01.htm",
    },
    {
      step_number: 3,
      title: "Apply for Arizona ETV",
      why_this_is_next:
        "The ETV deadline is July 31, 2026 — it's first-come, first-served and can run out. Apply as soon as you have your foster care proof and transcripts.",
      deadline: "July 31, 2026",
      days_until_deadline: 133,
      urgency_note: null,
      documents_needed: [
        {
          name: "Proof of Foster Care",
          status: "need",
          how_to_get: "Complete Step 2 first — DCS verification letter or court records.",
        },
        {
          name: "School Transcripts",
          status: "need",
          how_to_get:
            "Contact your last high school. Gaps from school changes are expected — they're not a barrier. Ask for unofficial transcripts to start.",
        },
      ],
      specific_action:
        "Apply at fseducation.fostersuccess.org/arizona-etv/ — have your foster care proof and transcripts ready before starting.",
      where_to_go: "fseducation.fostersuccess.org/arizona-etv/",
      what_to_bring:
        "Proof of foster care (DCS letter or court document), school transcripts, SSN",
      estimated_time: "45 minutes",
      confidence: "high",
      verify_with:
        "Foster Success Education Services: fseducation.fostersuccess.org",
      source_url: "https://fseducation.fostersuccess.org/arizona-etv/",
    },
    {
      step_number: 4,
      title: "Connect with Bridging Success",
      why_this_is_next:
        "The Mesa CC Bridging Success campus champion can coordinate all three funding sources on your behalf — they've done this hundreds of times.",
      deadline: null,
      days_until_deadline: null,
      urgency_note: null,
      documents_needed: [],
      specific_action:
        "Visit mesacc.edu/bridging-success or call 480-461-7000 and ask for the Bridging Success coordinator. Tell them you just aged out of foster care and want to enroll.",
      where_to_go:
        "mesacc.edu/bridging-success | Mesa Community College, Southern & Dobson campus",
      what_to_bring:
        "Any documents you already have — they can help figure out what's missing",
      estimated_time: "1 hour (first meeting)",
      confidence: "certain",
      verify_with:
        "Bridging Success at Mesa CC: mesacc.edu/bridging-success | 480-461-7000",
      source_url:
        "https://www.maricopa.edu/students/student-support/foster-youth",
    },
    {
      step_number: 5,
      title: "Apply for Arizona Tuition Waiver",
      why_this_is_next:
        "Once FAFSA is processed (Step 1), you can apply for the Tuition Waiver. This covers whatever tuition Pell doesn't — which at Mesa CC means $0 tuition.",
      deadline: "Rolling — apply after FAFSA is processed",
      days_until_deadline: null,
      urgency_note: null,
      documents_needed: [
        {
          name: "FAFSA Confirmation",
          status: "need",
          how_to_get: "Complete Step 1 first. You'll receive a Student Aid Report (SAR) by email.",
        },
        {
          name: "Proof of Foster Care",
          status: "need",
          how_to_get: "Complete Step 2 first.",
        },
        {
          name: "Enrollment Confirmation",
          status: "need",
          how_to_get:
            "Apply and get accepted to Mesa CC (or your chosen school) first. Enrollment confirmation is issued after acceptance.",
        },
      ],
      specific_action:
        "Apply through Foster Success Education Services at fseducation.fostersuccess.org/arizona-etv/ after FAFSA is processed.",
      where_to_go: "fseducation.fostersuccess.org/arizona-etv/",
      what_to_bring:
        "FAFSA Student Aid Report, proof of foster care, enrollment confirmation",
      estimated_time: "30 minutes",
      confidence: "high",
      verify_with:
        "Bridging Success Champion at Mesa CC | Foster Success: fseducation.fostersuccess.org",
      source_url: "https://www.azleg.gov/ars/15/01809-01.htm",
    },
  ],

  semester_roadmap: {
    recommended_start: "Fall 2026",
    total_semesters_to_degree: 4,
    based_on_school: "mesa_cc",
    phases: [
      {
        name: "Pre-enrollment: Now → August 2026",
        phase_type: "preparation",
        tasks: [
          {
            task: "Create FSA ID and complete FAFSA at studentaid.gov",
            why: "Unlocks Pell Grant ($7,395) and the Arizona Tuition Waiver — the two biggest funding sources",
            deadline: "March 1, 2026 (priority) — sooner is better",
            depends_on: null,
            estimated_time: "30–45 minutes",
            help_from: "Mesa CC Financial Aid: 480-461-7400",
            category: "financial",
          },
          {
            task: "Request proof of foster care from DCS (1-888-767-2445)",
            why: "Required for both ETV and Tuition Waiver applications — the earlier you start, the better",
            deadline: null,
            depends_on: null,
            estimated_time: "1–2 hours (phone + wait for letter)",
            help_from: "Arizona DCS: 1-888-767-2445",
            category: "administrative",
          },
          {
            task: "Request transcripts from your last high school",
            why: "Required for ETV application and Mesa CC admission",
            deadline: null,
            depends_on: null,
            estimated_time: "20 minutes online or by phone",
            help_from: "Bridging Success at Mesa CC can assist: 480-461-7000",
            category: "academic",
          },
          {
            task: "Apply for Arizona ETV at fseducation.fostersuccess.org/arizona-etv/",
            why: "First-come, first-served — apply as soon as you have foster care proof and transcripts",
            deadline: "July 31, 2026",
            depends_on: ["Request proof of foster care from DCS", "Request transcripts from your last high school"],
            estimated_time: "45 minutes",
            help_from: "Foster Success Education Services: fseducation.fostersuccess.org",
            category: "financial",
          },
          {
            task: "Apply to Mesa Community College at mesacc.edu/admissions",
            why: "You need an acceptance letter before enrolling and receiving financial aid disbursements",
            deadline: "August 1, 2026",
            depends_on: null,
            estimated_time: "30 minutes",
            help_from: "Bridging Success Champion at Mesa CC: 480-461-7000",
            category: "administrative",
          },
          {
            task: "Contact Bridging Success champion at Mesa CC",
            why: "They coordinate all three funding sources on your behalf and can flag any missing pieces",
            deadline: null,
            depends_on: null,
            estimated_time: "1 hour (first meeting)",
            help_from: "Bridging Success: mesacc.edu/bridging-success",
            category: "support",
          },
          {
            task: "Research off-campus housing options near Mesa CC campus",
            why: "No on-campus housing — securing housing before the semester starts reduces stress",
            deadline: "July 2026",
            depends_on: null,
            estimated_time: "2–3 hours over multiple days",
            help_from: "Mesa CC Student Life office for housing resources",
            category: "housing",
          },
        ],
        semester_cost_estimate: null,
        funding_applied:
          "Pre-enrollment — applying for funding, not yet disbursing",
      },
      {
        name: "Semester 1: Fall 2026",
        phase_type: "active_semester",
        tasks: [
          {
            task: "Confirm FAFSA award and Pell Grant disbursement with financial aid",
            why: "Pell Grant ($3,697 per semester) covers your full tuition and then some — confirm it's applied before the semester bill is due",
            deadline: "Before semester billing deadline",
            depends_on: null,
            estimated_time: "30 minutes",
            help_from: "Mesa CC Financial Aid: 480-461-7400",
            category: "financial",
          },
          {
            task: "Apply for Arizona Tuition Waiver through Foster Success",
            why: "Covers remaining tuition after Pell Grant — can bring your tuition bill to $0",
            deadline: "Before semester start",
            depends_on: ["Create FSA ID and complete FAFSA at studentaid.gov"],
            estimated_time: "30 minutes",
            help_from: "Foster Success: fseducation.fostersuccess.org",
            category: "financial",
          },
          {
            task: "Confirm ETV disbursement for housing and living costs",
            why: "ETV covers up to $2,500 this semester for housing, books, and living expenses",
            deadline: "Within first 2 weeks of semester",
            depends_on: ["Apply for Arizona ETV at fseducation.fostersuccess.org/arizona-etv/"],
            estimated_time: "20 minutes",
            help_from: "Bridging Success Champion: 480-461-7000",
            category: "financial",
          },
          {
            task: "Connect with a campus mentor through Bridging Success",
            why: "First-generation college students who connect with mentors are significantly more likely to complete their degree",
            deadline: null,
            depends_on: null,
            estimated_time: "1 hour",
            help_from: "Bridging Success Program: mesacc.edu/bridging-success",
            category: "support",
          },
        ],
        semester_cost_estimate: 7120,
        funding_applied:
          "Pell Grant ($3,697) + ETV ($2,500) + Tuition Waiver (covers remaining tuition) — estimated out-of-pocket: ~$923",
      },
      {
        name: "Semester 2: Spring 2027",
        phase_type: "active_semester",
        tasks: [
          {
            task: "Re-verify ETV for spring semester disbursement",
            why: "ETV is disbursed per-semester — confirm renewal and submit any required documentation",
            deadline: "January 2027",
            depends_on: null,
            estimated_time: "20 minutes",
            help_from: "Foster Success Education Services",
            category: "financial",
          },
          {
            task: "Meet with academic advisor to plan transfer track (if pursuing 4-year degree)",
            why: "Completing the right courses at Mesa CC ensures your credits transfer cleanly to ASU, U of A, or NAU",
            deadline: null,
            depends_on: null,
            estimated_time: "1 hour",
            help_from: "Mesa CC Academic Advising: mesacc.edu/advising",
            category: "academic",
          },
          {
            task: "Complete 30 volunteer hours for Tuition Waiver renewal",
            why: "The Arizona Tuition Waiver requires 30 community service hours per year for renewal",
            deadline: "Before end of spring semester",
            depends_on: null,
            estimated_time: "30 hours total (spread over semester)",
            help_from: "Bridging Success can help find approved opportunities",
            category: "administrative",
          },
        ],
        semester_cost_estimate: 7120,
        funding_applied:
          "Pell Grant ($3,697) + ETV ($2,500) + Tuition Waiver renewal — same coverage as Semester 1",
      },
      {
        name: "Year 2 & Transfer Planning",
        phase_type: "graduation",
        tasks: [
          {
            task: "Complete Associate's degree requirements or transfer prerequisites",
            why: "An Associate's degree or transfer-ready transcript opens doors to 4-year universities",
            deadline: "Spring 2028",
            depends_on: null,
            estimated_time: "Ongoing — 2 semesters",
            help_from: "Mesa CC Academic Advisor + Bridging Success",
            category: "academic",
          },
          {
            task: "Apply to transfer university (ASU, U of A, or NAU) if pursuing 4-year degree",
            why: "Transfer applications open in Fall 2027 for Spring/Fall 2028 admission",
            deadline: "November 2027",
            depends_on: ["Complete Associate's degree requirements or transfer prerequisites"],
            estimated_time: "3–4 hours",
            help_from: "Mesa CC Transfer Center: mesacc.edu/transfer",
            category: "academic",
          },
          {
            task: "Verify Tuition Waiver continues at transfer university",
            why: "The Arizona Tuition Waiver applies at all AZ public universities — but you need to re-apply at the new school",
            deadline: "Before transfer semester",
            depends_on: ["Apply to transfer university (ASU, U of A, or NAU) if pursuing 4-year degree"],
            estimated_time: "30 minutes",
            help_from: "Foster Youth Programs at transfer institution",
            category: "financial",
          },
        ],
        semester_cost_estimate: null,
        funding_applied:
          "Pell Grant + ETV (if still eligible) + Tuition Waiver at transfer institution",
      },
    ],
  },

  score_deltas: {
    1: { academic: 0, financial_aid: 20, application: 15, timeline: 5, overall: 12, unlocks: [3, 5] },
    2: { academic: 0, financial_aid: 0, application: 25, timeline: 0, overall: 8, unlocks: [3] },
    3: { academic: 0, financial_aid: 20, application: 20, timeline: 0, overall: 14, unlocks: [5] },
    4: { academic: 10, financial_aid: 5, application: 5, timeline: 5, overall: 7, unlocks: [] },
    5: { academic: 0, financial_aid: 15, application: 10, timeline: 0, overall: 8, unlocks: [] },
  },
};
