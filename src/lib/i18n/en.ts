/**
 * English dictionary.
 *
 * Typed as `Dictionary`, so TypeScript refuses to build whenever a key is
 * added to `id.ts` but not translated here. That check is the reason the
 * two files are allowed to be this long: nothing can silently fall back to
 * Indonesian text inside an English interface.
 */

import type { Dictionary } from "./id";

export const en: Dictionary = {
  common: {
    appName: "CV ATS Builder",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    close: "Close",
    back: "Back",
    next: "Next",
    loading: "Loading...",
    saving: "Saving...",
    saved: "Saved",
    error: "Something went wrong",
    tryAgain: "Try again",
    optional: "optional",
    recommended: "recommended",
    yes: "Yes",
    no: "No",
    of: "of",
    page: "Page",
    pages: "pages",
    example: "Example",
  },

  form: {
    personalTitle: "Personal details",
    personalHint:
      "The very top of the CV. Name, contact details and profile links - the first thing an ATS parser looks for.",

    fullName: "Full name",
    fullNameHint: "No academic titles in front. Post-nominals may go after the name.",
    fullNamePh: "Budi Santoso",
    headline: "Target job title",
    headlineHint: "Match the wording of the job you are applying for.",
    headlinePh: "Frontend Developer",
    email: "Email",
    emailHint: "Use a professional address you actually check.",
    emailPh: "budi.santoso@email.com",
    phone: "Phone number",
    phoneHint: "Include the country code so it reads as an international number.",
    phonePh: "+62 812-3456-7890",
    city: "City",
    cityPh: "Bontang",
    province: "Province / State",
    provincePh: "East Kalimantan",
    country: "Country",
    countryPh: "Indonesia",
    linkedin: "LinkedIn",
    linkedinPh: "linkedin.com/in/budisantoso",
    portfolio: "Portfolio / website",
    portfolioPh: "budisantoso.dev",
    github: "GitHub",
    githubPh: "github.com/budisantoso",
    showPhoto: "Show a photo",
    showPhotoHint:
      "Best left off. Most ATS parsers cannot read images, and the layout around a photo often scrambles the surrounding text. Turn it on only when the job ad asks for one.",
    photo: "Photo",
    photoHint:
      "JPG, PNG, or WebP. The photo is resized automatically to 3:4 print size, so a large file straight from a phone camera is fine. A plain background gives the best result.",
    photoChoose: "Choose a photo file",
    photoReplace: "Replace photo",
    photoRemove: "Remove photo",
    photoWorking: "Processing...",
    photoLinked:
      "This photo is still an image link from a CV built earlier. The link keeps working; choose a file if you would rather store the photo inside the CV itself.",
    photoErrorType: "That file is not an image. Choose a JPG, PNG, or WebP file.",
    photoErrorRead:
      "The image could not be read. The file may be damaged - try another one.",
    photoErrorTooBig:
      "The image is still too large after resizing. A photo on a plain background is far lighter than one on a busy background.",

    summary: "Professional summary",
    summaryHint:
      "A simple formula: role + years of experience + core skills + one achievement with a number. Avoid first-person pronouns.",
    summaryPh:
      "Frontend Developer with 4 years building production web applications in React and TypeScript. Cut homepage load time by 45% and led a team of 4 through a migration to a shared component architecture.",
    summaryWords: "words",
    summaryIdeal: "(ideal)",
    summaryIdealRange: "(ideal: 30-120 words)",

    experienceLabel: "Experience",
    experienceEmpty:
      "No work experience yet. If you are a fresh graduate, fill in Projects and Organisations instead - both count equally as evidence of what you can do.",
    experienceAdd: "Add work experience",
    jobTitle: "Job title",
    jobTitleHint: "As it appears on your appointment letter.",
    jobTitlePh: "Frontend Developer",
    company: "Company name",
    companyPh: "PT Digital Nusantara",
    workCityPh: "South Jakarta",
    employmentType: "Employment type",
    employmentUnset: "Not specified",
    stillWorking: "I still work here",

    educationLabel: "Education",
    educationAdd: "Add education",
    degree: "Level / degree",
    degreeHint: "For example: Bachelor, Diploma, High School.",
    degreePh: "Bachelor of Computer Science",
    fieldOfStudy: "Field of study",
    fieldOfStudyPh: "Informatics Engineering",
    institution: "Institution",
    institutionPh: "Mulawarman University",
    eduCityPh: "Samarinda",
    stillStudying: "I am still studying",
    gpa: "GPA",
    gpaHint: "Include it when it is 3.00 or above. Leave it blank otherwise.",
    gpaPh: "3.62",
    maxGpa: "GPA scale",
    maxGpaPh: "4.00",
    graduated: "Graduated",

    skillAdd: "Add skill",
    skillNamePh: "React",
    skillCategory: "Skill category",
    skillRemove: "Remove skill",
    skillCalloutLead: "Write the skill exactly as it is named -",
    skillCalloutGood: "JavaScript",
    skillCalloutMid: ", not",
    skillCalloutBad: "JavaScript (advanced)",
    skillCalloutTail:
      ". ATS software matches keywords literally, so anything added in brackets only lowers the match.",

    projectLabel: "Project",
    projectAdd: "Add project",
    projectName: "Project name",
    projectNamePh: "SIMAK PWA",
    projectRole: "Your role",
    projectRolePh: "Lead developer",
    projectUrl: "Link",
    projectUrlHint: "Repository, live demo, or where the project was published.",
    projectUrlPh: "github.com/budisantoso/simak-pwa",

    certificationLabel: "Certificate",
    certificationAdd: "Add certificate",
    certName: "Certificate name",
    certNamePh: "Meta Front-End Developer Professional Certificate",
    certIssuer: "Issuer",
    certIssuerPh: "Meta / Coursera",
    certIssueDate: "Issued",
    certExpiry: "Valid until",
    certExpiryHint: "Leave blank if it never expires.",
    certCredentialId: "Credential ID",
    certCredentialHint: "Makes it easy for a recruiter to verify.",
    certCredentialPh: "ABCD1234EFGH",
    certVerifyUrl: "Verification link",
    certVerifyPh: "coursera.org/verify/ABCD1234EFGH",

    organizationLabel: "Organisation",
    organizationAdd: "Add organisation",
    orgName: "Organisation name",
    orgNamePh: "Informatics Engineering Student Association",
    orgRole: "Position",
    orgRolePh: "Head of Research and Technology",
    stillActive: "Still active",

    awardLabel: "Award",
    awardAdd: "Add award",
    awardTitle: "Award name",
    awardTitleHint: "State the placing and the level of the competition.",
    awardTitlePh: "2nd place, Kaltim Digital Hackathon",
    awardIssuer: "Awarded by",
    awardIssuerPh: "East Kalimantan Communication and Informatics Office",
    awardDate: "Date",
    awardDescription: "Short description",
    awardDescriptionPh:
      "Built a prototype infrastructure-reporting app in 48 hours with a team of 3.",

    languageAdd: "Add language",
    languageNamePh: "English",
    languageLevel: "Proficiency",
    languageRemove: "Remove language",

    publicationLabel: "Publication",
    publicationAdd: "Add publication",
    pubTitle: "Title",
    pubTitlePh: "Applying Progressive Web Apps to an Academic Information System",
    pubPublisher: "Publisher / journal",
    pubPublisherPh: "Jurnal Informatika Mulawarman, Vol. 16 No. 2",
    pubDate: "Published",
    pubDoiPh: "10.30872/jim.v16i2.1234",
    pubUrl: "Link",
    pubUrlPh: "jurnal.unmul.ac.id/index.php/JIM/article/view/1234",

    customLabel: "Section",
    customAddSection: "Add a new section",
    customAddEntry: "Add entry",
    customRemoveEntry: "Remove this entry",
    customSectionTitle: "Section heading",
    customSectionTitleHint:
      "Use plain text without emoji so parsers can still read it.",
    customSectionTitlePh: "Training and workshops",
    customEntryTitle: "Title",
    customEntryTitlePh: "Introduction to Cyber Security",
    customEntrySubtitle: "Detail",
    customEntrySubtitlePh: "National Cyber and Crypto Agency - 24 contact hours",

    startDate: "From",
    endDate: "To",
    bulletsLabel: "Achievement bullets",
    bulletsHint:
      "Start with an action verb and include a number. This is what moves the content-quality score more than anything else.",
    bulletsAdd: "Add bullet",
    bulletsRemove: "Remove bullet",
    bulletPh1:
      "Example: Rebuilt the checkout flow, lifting conversion from 2.1% to 3.4% within 6 months.",
    bulletPh2:
      "Example: Led a team of 4 through a 60-component migration, cutting feature delivery time by 30%.",
    bulletPh3:
      "Example: Automated the deployment process, reducing release time from 40 minutes to 6.",

    entryMoveUp: "Move up",
    entryMoveDown: "Move down",
    entryRemove: "Remove entry",
    entryRemoveConfirm: "Remove this entry?",
    entryRemoveYes: "Yes, remove it",
    sectionMoveUp: "Move section up",
    sectionMoveDown: "Move section down",
  },

  guest: {
    metaTitle: "Build a CV without an account",
    metaDescription:
      "Build a complete ATS-friendly CV without signing up. It is stored in your own browser and downloads as PDF, Word, plain text, or JSON.",
    ctaTry: "Try without an account",
    ctaTryHint: "No sign-up, no email",
    loading: "Preparing the editor...",

    bannerTitle: "This CV lives only in this browser.",
    bannerBody:
      "Nothing is sent to a server, which is why no account is needed. The trade-off: opening it on another device, clearing site data, or using a private window means this CV is gone. Download the files, or move it into an account if you want it kept permanently.",
    savedLocal: "Saved in this browser",
    saveFailed:
      "The browser refused to save. The usual cause is that storage is full - the photo is by far the largest thing in a CV, so removing it is usually enough. The CV is still on screen; download the files now if that does not help.",
    moveToAccount: "Move to an account",
    moveHint:
      "You will be asked to sign in or sign up, and can then import this CV into that account.",

    importTitle: "There is a CV you built without an account",
    importBody:
      "It is still stored in this browser. Import it now so it is kept permanently in your account and reachable from any device.",
    importButton: "Import into my account",
    importDismiss: "Not now",
    importDone: "The CV has been imported into your account.",
    importFailed: "The CV could not be imported. Please try again.",
  },

  editor: {
    back: "Dashboard",
    backAria: "Back to dashboard",
    titleAria: "CV title",
    actionsMenu: "Actions menu",
    panelNav: "Editor panels",
    actionSampleLabel: "Fill with sample data",
    actionSampleHint: "Replace everything with a worked example",
    actionAppearanceLabel: "CV appearance",
    actionAppearanceHint: "Template, paper size, typeface, language",
    actionPdfLabel: "Download PDF",
    actionPdfHint: "The file you send to employers",
    actionWordLabel: "Download Word",
    actionWordHint: "When an application system asks for .docx",
    actionTxtLabel: "Download text",
    actionTxtHint: "For pasting into online forms",
    actionJsonLabel: "Download JSON",
    actionJsonHint: "A backup you can import again later",
    btnSample: "Sample data",
    btnAppearance: "Appearance",
    btnPdf: "PDF",
    btnWord: "Word",
    btnText: "Text",
    btnJson: "JSON",
    btnTextTitle: "Plain text for pasting into application forms",
    btnJsonTitle: "A data backup you can import again",
    saveNotYet: "Not saved yet",
    saveAuto: "Saves automatically",
    untitled: "Untitled CV",
    renameLabel: "CV title",
    appearance: "Appearance",
    fillSample: "Fill with sample",
    fillSampleConfirm:
      "Everything in this CV will be replaced with a complete worked example. Useful for seeing what a finished CV looks like and where each field appears - but anything you have typed will be lost.",
    fillSampleYes: "Yes, use the sample",
    matchJob: "Match against a job ad",
    moreActions: "More actions",
    print: "Print / PDF",
    downloadDocx: "Download Word (.docx)",
    downloadTxt: "Download text (.txt)",
    downloadJson: "Back up as JSON",
    tabPreview: "CV preview",
    tabScore: "ATS score",
    paneForm: "Edit",
    panePreview: "Preview",
    paneScore: "Score",
    saveIdle: "No changes yet",
    saveDirty: "Unsaved changes",
    saveSaving: "Saving...",
    saveSaved: "Saved",
    saveError: "Could not save",
    saveFailedTitle: "Could not save",
    saveFailedGeneric: "Your changes could not be saved.",
    saveFailedOffline:
      "Cannot reach the server. Your changes are still on screen - do not close this page until the connection is back.",
    sectionOrderHint:
      "Sections you leave empty never appear on the CV, so it is fine to skip them. Use the arrows beside a heading to change the order.",
  },

  appearance: {
    template: "Template",
    templateWithPhoto: "With photo",
    templateWithoutPhoto: "Without photo",
    font: "Typeface",
    fontHint: "Every option here is safe for ATS software.",
    fontSize: "Font size",
    lineHeight: "Line spacing",
    headingLanguage: "Section heading language",
    headingLanguageHint:
      "The language used for headings inside the CV itself - separate from the language of this interface.",
    accentColor: "Accent colour",
    margin: "Page margins",
    marginY: "Top and bottom",
    marginX: "Left and right",
    marginFollowTemplate: "template default",
    marginReset: "Back to the template default",
    marginHint:
      "The top and bottom margins are always equal, and apply to every page - not just the first. Below 10 mm some printers will clip the edges.",
    paperSize: "Paper size",
    photoUnsupported:
      "This template does not show a photo. Pick one of the photo templates if the job ad asks for one.",
  },

  flow: {
    metaTitle: "Flow and Architecture",
    metaDescription:
      "User flow, architecture, data flow and development workflow diagrams for CV ATS Builder - also available as SVG and PNG image files.",
    title: "Flow and architecture",
    subtitle:
      "Four diagrams: how people use it, how the data moves, and how a code change reaches production. The diagrams on this page and the image files are generated from the same source data, so the two can never tell different stories.",
    downloadTitle: "Download as an image",
    downloadNote:
      "For dropping into a report or a slide deck. SVG stays sharp at any size; PNG is handled more reliably by word processors.",
    downloadSvg: "Download SVG",
    downloadPng: "Download PNG",
    legendTitle: "Shape legend",
    legendNote:
      "Each box states its own type in words rather than relying on colour alone - so the diagram still reads when printed in black and white, and when read aloud by a screen reader.",
  },

  home: {
    skipToContent: "Skip to main content",
    heroBadge: "Free - no watermark - your data is saved",
    heroTitleLine1: "Fill in the fields.",
    heroTitleLine2: "A machine-readable CV",
    heroTitleLine3: "builds itself.",
    heroBody:
      "Many employers screen applications with software that reads CVs automatically. Files with complicated layouts - two columns, tables, text inside images - are often parsed into nonsense, so the qualifications you genuinely have never register. This app arranges your CV into a structure that machines can read safely, then scores it and shows you exactly what to fix.",
    heroCtaNew: "Sign in or create an account",
    heroCtaDashboard: "Go to dashboard",
    heroCtaCompare: "Compare CVs you already have",
    statSections: "CV sections",
    statDimensions: "scoring dimensions",
    statTemplates: "ATS templates",
    statFormats: "download formats",
    heroCaption: "Example output - Classic template",
    heroBadgeScore: "ATS score",
    heroBadgeGrade: "Grade A",
    heroBadgeSaved: "Saved automatically",

    pathsTitle: "Two ways to use it",
    pathsBody:
      "Start from nothing, or start from the CV you already have. Both run through the same scoring engine, so the scores are comparable.",
    pathBuildTitle: "Build a new CV",
    pathBuildBody:
      "Fill in structured fields, watch the result appear in a true-to-size paper preview, fix what the ATS score flags, then download as PDF, Word, plain text, or JSON.",
    pathBuildCta: "Sign in or create an account",
    pathCompareTitle: "Compare or scan a CV",
    pathCompareBody:
      "Upload one file to scan it, or up to five to compare them. Every CV gets a score, a list of strengths, and a list of weaknesses with how to fix them - and then which one is most ready to send. Files are processed in your browser and never uploaded.",
    pathCompareCta: "Compare now",

    stepsTitle: "Four steps, done",
    stepsBody:
      "All you do is fill things in. Layout, date formats, and the machine-readable structure are the app's job.",
    step1Title: "Fill the fields one by one",
    step1Body:
      "No intimidating blank page. Every piece of information has its own field - job title, employer, dates - each with a worked example inside the box.",
    step2Title: "See the result instantly",
    step2Body:
      "The CV on the right updates as you type, and can be shown cut into separate pages like a word processor. The field you are editing is highlighted on the CV, so you always know where it lands.",
    step3Title: "Fix what the ATS score flags",
    step3Body:
      "The app scores your CV across five dimensions and names what is missing along with how to fix it - rather than just handing you a number.",
    step4Title: "Download and apply",
    step4Body:
      "PDF and Word to send to employers. Your data stays saved, so the next CV is a duplicate away.",

    featuresTitle: "What makes it different from a Word template",
    featuresBody:
      "A template only gives you a look. This app keeps the structure machine-readable, scores the result, and stores your data.",
    feature1Title: "Structured fields, not a blank page",
    feature1Body:
      "11 CV sections with fields, guidance, and a real example in every box. Layout is handled for you.",
    feature2Title: "A true-to-size paper preview",
    feature2Body:
      "Choose A4, Letter, Legal or F4 - then view your CV as one continuous scroll or cut into separate pages, exactly as it will print.",
    feature3Title: "Saved automatically",
    feature3Body:
      "Changes reach the database less than a second after you stop typing. Close the browser, come back next month, carry on where you left off.",
    feature4Title: "An ATS score with its reasoning",
    feature4Body:
      "Five weighted dimensions, each with fixes you can click to jump straight to the field at fault.",
    feature5Title: "Matching against a job ad",
    feature5Body:
      "Paste the ad you are targeting and see which of its important keywords are still missing from your CV.",
    feature6Title: "Your data stays yours",
    feature6Body:
      "Download your whole CV as JSON at any time, import it back at any time, or delete your account along with everything in it.",

    templatesTitle: "Ten templates, one structure",
    templatesBody:
      "Every one is single-column, table-free, and uses standard section headings - so no template is riskier to parse than another. What differs is typography, spacing, rules, and where a photo sits. Switching template changes nothing about your data.",
    templatesWithoutPhoto: "Without photo",
    templatesWithPhoto: "With photo",
    templatesPhotoNote:
      "Two photo templates exist because some Indonesian job ads still ask for one. If yours does not, choose a template without a photo - ATS parsers cannot read images.",

    faqTitle: "Questions people ask",
    faqBody: "Including the things similar apps tend not to mention.",

    ctaTitle: "Build it once, reuse it many times",
    ctaBody:
      "Your data lives in your account. For the next job ad, duplicate an existing CV and adjust what needs adjusting - no starting from a blank page again.",
    ctaButton: "Sign in or create an account",
    ctaButtonSignedIn: "Open dashboard",
    ctaNote: "No cost, and no watermark on your CV.",
  },

  faq: [
    {
      q: "What is an ATS, and why should I care?",
      a: "An ATS (Applicant Tracking System) is the software many employers use to receive and screen applications. Before a person reads it, your CV file is parsed by a machine to pull out its data: name, contact details, experience, skills. A CV with a complicated layout - two columns, tables, text inside images - often parses into nonsense, so qualifications you genuinely have never reach the system.",
    },
    {
      q: "Does a CV from this app guarantee I pass the ATS?",
      a: "No app can promise that, and this one does not. Every employer uses a different ATS product with an unpublished parser. What this app does is make sure your CV follows the rules that hold generally: one column, no tables, standard section headings, consistent dates, and text that really is text. The score means it satisfies the rules that are checked - not that you will be hired.",
    },
    {
      q: "How many pages should my CV be?",
      a: "One. That is the right length for almost every applicant, experienced ones included - recruiters scan a CV in seconds, and anything on a second page is likely never read. Two pages only earn their keep when you have more than five years of experience that is all relevant to the role. If your CV has grown long, it is the content that needs cutting, not the font size.",
    },
    {
      q: "Which paper size should I use?",
      a: "A4. It is the standard in Indonesia and almost everywhere else, and it is this app's default. Letter is only needed when applying to companies in the US or Canada; Legal and F4 only when an institution specifically asks.",
    },
    {
      q: "Is it free? Any hidden cost?",
      a: "Entirely free. There is no paid tier, no limit on how many CVs you keep, no watermark on what you download, and no request for card details.",
    },
    {
      q: "Will my CV carry this app's name or logo?",
      a: "No. What you download contains only your own data - no logo, no watermark, no app name, no author name. The CV is your document.",
    },
    {
      q: "Are the CV files I upload for comparison stored on a server?",
      a: "No, and they are never sent to one. They are read and scored inside your own browser; closing the page discards everything. That is also why the comparison feature works without an account.",
    },
    {
      q: "If I close the browser, do I lose my data?",
      a: "No - for CVs you build inside this app. Every change is saved to the database less than a second after you stop typing. Sign in again from any device and your CV is there. You can also download a JSON backup.",
    },
    {
      q: "Why is a photo usually a bad idea on a CV?",
      a: "Most ATS parsers cannot read images, and the layout around a photo often scrambles the reading order of the surrounding text. In many countries photos are also avoided to reduce bias in screening. This app still offers two photo templates - some Indonesian job ads ask for one - but warns you when you switch a photo on.",
    },
    {
      q: "Can I have more than one CV?",
      a: "Yes, and you should. A CV works best when it is tailored to each job ad. Use the duplicate button, then adjust the summary and the order of your skills to match the role.",
    },
  ],

  compare: {
    metaTitle: "Compare & scan CVs",
    metaDescription:
      "Upload several CVs at once, see the strengths and weaknesses of each, and find out which one is most ready to send. Files are processed in your browser and never uploaded to a server.",
    title: "Compare CVs, or scan just one",
    subtitle:
      "Upload one file to scan it, or two to five files to compare them. Every CV gets a score, a list of strengths, a list of weaknesses with how to fix them - and at the end, which one is most ready to send.",
    privacyTitle: "Your files are not uploaded anywhere.",
    privacyBody:
      "All reading and scoring happens inside your own browser. Nothing is sent to this application's server or to any other service, and nothing is stored. Closing this page discards everything.",
    dropTitle: "Drop your CV files here",
    dropSubtitle: "or click to choose them from your device",
    dropFormats: "PDF, DOCX or TXT - up to 5 files, 8 MB each",
    chooseFiles: "Choose files",
    fileRemove: "Remove this file",
    tooMany: "Five files at a time is the maximum.",
    jobToggleShow: "Add a job advertisement (optional)",
    jobToggleHide: "Hide the job advertisement",
    jobHint:
      "When filled in, every CV is also scored on how well its keywords match this job - and that is the dimension that most determines which CV you should actually send for it.",
    analyze: "Analyse now",
    analyzing: "Analysing...",
    reset: "Start over",
    readingFile: "Reading",
    resultSingleTitle: "Scan result",
    resultCompareTitle: "Comparison result",
    winnerLabel: "Most ready to send",
    rankLabel: "Rank",
    reasonsTitle: "Why it wins",
    perDimensionTitle: "Dimension by dimension",
    dimensionColumn: "Dimension",
    bestColumn: "Highest",
    worstColumn: "Lowest",
    spreadColumn: "Gap",
    strengthsTitle: "Strengths",
    weaknessesTitle: "Weaknesses, and how to fix them",
    noWeakness: "No weaknesses were found against the rules that are checked.",
    noStrength: "No strengths could be recorded yet.",
    statPages: "Pages",
    statWords: "Words",
    statBullets: "Bullets",
    statColumns: "Columns",
    ctaTitle: "Want to fix it now?",
    ctaBody:
      "Rebuild your CV in this app's editor: every field carries a worked example, the score moves as you type, and the result downloads as PDF, Word, or plain text.",
    ctaButton: "Build a CV free",
    errorTitle: "The file could not be read",
    limitsNote:
      "An honest note on the limits: this analysis reads text, it does not understand meaning. It can tell you whether machines can read your CV, but not whether your experience fits a particular job. That judgement stays yours.",
  },

  ats: {
    severityError: "Must fix",
    severityWarning: "Worth fixing",
    severityInfo: "Polish",
    noCritical: "No critical problems",
    mustFixCount: "things to fix",
    suggestionCount: "suggestions",
    statPages: "Pages",
    statWords: "Word count",
    statActionVerbs: "Bullets with a verb",
    statQuantified: "Bullets with a number",
    breakdownTitle: "Score breakdown",
    breakdownHint: "The final score is a weighted average of these dimensions.",
    weight: "weight",
    notScored: "not scored yet",
    keywordsTitle: "Keywords from the job ad",
    keywordsMatchSuffix: "match",
    keywordsMissing: "Not in your CV yet",
    keywordsMatched: "Already present",
    keywordsWarning:
      "Only add keywords you can genuinely back up. Pasting in skills you do not have raises the score here, but it will surface in the interview.",
    noFindings:
      "Nothing to report. Your CV satisfies every rule that is checked.",
    openField: "Open the related field",
    gradePrefix: "Grade",
    jobTitle: "Match against a job ad",
    jobIntro:
      "Paste the text of the job ad you are targeting. Its keywords are extracted automatically and compared against your CV.",
    jobLabel: "Job advertisement text",
    jobPlaceholder:
      "Paste the whole job ad here - including the qualifications and responsibilities. The more complete the text, the more accurate the keyword extraction.",
    jobAnalyze: "Calculate the match",
    jobAnalyzing: "Calculating...",
    jobClear: "Clear",
    jobEmpty: "No job advertisement pasted yet.",
    pageTitle: "ATS analysis",
    pageSubtitle:
      "Paste a job advertisement to see which of its keywords are missing from your CV.",
    jobDescTitle: "Job description",
    jobDescHint:
      "Copy the whole job advertisement - including the qualifications and responsibilities - and paste it below. Keywords are extracted automatically.",
    wordsAnalyzed: "words analysed.",
    saveToHistory: "Save this result",
    historyTitle: "Score history",
    historyEmpty:
      "No history yet. Press Save this result to record the current score, then improve your CV and save again to watch it move.",
    historyBest: "Best score:",
    historySaved: "The result has been saved to your history.",
    historySaveFailed: "The result could not be saved.",
    historyOffline: "Cannot reach the server.",
    backToEditor: "Back to the editor",
  },

  print: {
    backToEditor: "Back to the editor",
    printNow: "Print / Save as PDF",
    openPrintPage: "Open the print page",
    openPrintPageHint: "If the print dialog does not appear on its own",
  },

  preview: {
    label: "Preview",
    viewLabel: "Preview mode",
    viewPaged: "Paged",
    viewContinuous: "Continuous",
    viewPagedHint: "Cut into separate sheets like Word - shows exactly where each page breaks.",
    viewContinuousHint: "One long scroll with no breaks - easier to skim while you edit.",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomFit: "Fit to width",
    pageLabel: "Page",
    paperSize: "Paper size",
    paperRecommended: "recommended",
    lengthIdeal: "Ideal length.",
    lengthAcceptable: "Still reasonable if you have more than five years of experience.",
    lengthTooLong: "Too long. Recruiters usually only scan the first page.",
    onePageAdvice:
      "One page is enough for almost every applicant. Cut experience that is not relevant to the role you are applying for rather than shrinking the type.",
  },

  prefs: {
    theme: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    language: "Language",
    languageToggleLabel: "Change interface language",
  },

  nav: {
    home: "Home",
    guide: "Guide",
    about: "About",
    flowNav: "Flow",
    compare: "Compare CVs",
    dashboard: "Dashboard",
    login: "Sign in",
    register: "Sign up free",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main",
    mobileNav: "Main (mobile)",
    breadcrumb: "Breadcrumb",
    backHome: "Back to home",
    backDashboard: "Back to dashboard",
    homeAria: "home",
  },

  app: {
    settings: "Settings",
    signOut: "Sign out",
    user: "User",
  },

  dashboard: {
    title: "My CVs",
    subtitleEmpty:
      "No CVs yet. Start from the sample so you can see what a finished one looks like.",
    subtitleCount: "CVs saved. Every change is saved automatically.",
    importJson: "Import JSON",
    startFromSample: "Start from sample",
    createNew: "Create a CV",
    startBlank: "Start from blank",
    emptyTitle: "This account has no CVs yet",
    emptyBodyLead: "Suggestion: choose",
    emptyBodyTail:
      ". The CV is filled with a complete worked example so you can see where every field ends up, then simply type over it with your own details.",
    nameEmpty: "Name not filled in",
    changedAt: "Edited",
    edit: "Edit CV",
    renameTitle: "Rename",
    duplicateTitle: "Duplicate",
    deleteTitle: "Delete",
    deleteConfirmLead: "Delete",
    deleteConfirmTail: "? Everything in it goes too, and it cannot be undone.",
    deleteYes: "Yes, delete it",
    tipsLabel: "Tip:",
    tips:
      "to apply for a different role, press duplicate and adjust the summary and the order of your skills. A CV tailored to one job ad scores far higher on keyword match.",
    errorGeneric: "Something went wrong. Please try again.",
    errorOffline: "Cannot reach the server.",
    justNow: "just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
  },

  settings: {
    title: "Account settings",
    savedCount: "CVs saved in this account.",
    identityTitle: "Identity",
    emailLabel: "Email",
    emailLocked: "The email address cannot be changed.",
    nameLabel: "Display name",
    saveName: "Save name",
    passwordChangeTitle: "Change password",
    passwordCreateTitle: "Create a password",
    passwordGoogleNote:
      "This account was created through Google and has no password yet. Creating one lets you sign in with your email and password as well.",
    passwordCurrent: "Current password",
    passwordNew: "New password",
    passwordHint: "At least 8 characters.",
    passwordSave: "Save password",
    dangerTitle: "Delete account",
    dangerBody:
      "Every CV and everything in it will be permanently removed and cannot be recovered. Download a JSON backup of each CV first.",
    dangerStart: "I want to delete my account",
    dangerConfirmLabel: 'Type "DELETE ACCOUNT" to confirm',
    dangerConfirmHint:
      "This step is deliberately inconvenient so it cannot happen by a mis-click.",
    dangerConfirmWord: "DELETE ACCOUNT",
    dangerButton: "Delete my account",
    saveFailed: "Could not save.",
    deleteFailed: "Could not delete the account.",
    saved: "Your changes have been saved.",
    offline: "Cannot reach the server.",
  },

  auth: {
    loginTitle: "Sign in",
    loginSubtitle: "Pick up where you left off on a saved CV.",
    registerTitle: "Sign up",
    registerSubtitle:
      "Free. Your CV data is stored and stays editable at any time.",
    google: "Sign in with Google",
    divider: "OR",
    nameLabel: "Full name",
    namePh: "Budi Santoso",
    emailLabel: "Email",
    emailPh: "name@email.com",
    passwordLabel: "Password",
    passwordHint: "At least 8 characters.",
    submitLogin: "Sign in",
    submitRegister: "Create account",
    registeredNotice:
      "Your account has been created. Sign in with your email and password.",
    signInFailed: "Sign-in failed. Please try again.",
    invalidCredentials: "That email or password is not right.",
    registerFailed: "Sign-up failed. Please try again.",
    toRegister: "No account yet?",
    toRegisterLink: "Sign up free",
    toLogin: "Already have an account?",
    toLoginLink: "Sign in here",
  },

  legal: {
    updatedAt: "Last updated:",
    seeAlso: "See also",
    and: "and",
  },

  errors: {
    errorTitle: "Something went wrong",
    errorBody:
      "This page failed to render. Any CV you have already saved is safe - every change is written to the database as soon as you stop typing.",
    errorCode: "Error code:",
    notFoundTitle: "Page not found",
    notFoundBody:
      "The address you opened does not exist, or the CV it points to does not belong to the account you are signed in with.",
    retry: "Try again",
    openDashboard: "Open dashboard",
    backHome: "Back to home",
    loading: "Loading page...",
  },

  footer: {
    pagesHeading: "Pages",
    authorHeading: "Built by",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    registerFree: "Sign up free",
    madeBy: "built by",
    rights: "All rights reserved.",
  },
};
