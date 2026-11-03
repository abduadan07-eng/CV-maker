/**
 * Centralized Internationalization Dictionary for CV Maker
 * Complete English & Somali (Af Soomaali) translations
 */

import { InterfaceLanguage } from '../types/cv';

export interface TranslationDictionary {
  // App brand & common
  appName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  createCvBtn: string;
  loadSampleBtn: string;
  myCvsTitle: string;
  myCvsSubtitle: string;
  noCvsTitle: string;
  noCvsDesc: string;
  createFirstCv: string;
  lastEdited: string;
  createdOn: string;
  templateLabel: string;
  languageLabel: string;
  interfaceLanguage: string;
  cvDocumentLanguage: string;
  openBtn: string;
  editBtn: string;
  renameBtn: string;
  duplicateBtn: string;
  deleteBtn: string;
  cancelBtn: string;
  saveBtn: string;
  confirmBtn: string;
  backBtn: string;
  nextBtn: string;
  previewBtn: string;
  saveDraftBtn: string;
  savedSuccessfully: string;
  draftUpdated: string;
  draftDeleted: string;
  draftDuplicated: string;

  // Local storage notice
  storageNoticeTitle: string;
  storageNoticeDesc: string;

  // Delete modal
  deleteModalTitle: string;
  deleteModalText: string;
  renameModalTitle: string;
  newTitlePlaceholder: string;

  // Form Steps
  stepPersonal: string;
  stepExperience: string;
  stepEducation: string;
  stepSkills: string;
  stepLanguages: string;
  stepAdditional: string;
  stepTemplates: string;

  // Step A: Personal
  personalTitle: string;
  personalSubtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  jobTitle: string;
  jobTitlePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  city: string;
  cityPlaceholder: string;
  country: string;
  countryPlaceholder: string;
  summary: string;
  summaryPlaceholder: string;
  summaryPromptsTitle: string;
  useThisSummary: string;
  photoUploadTitle: string;
  photoUploadHint: string;
  removePhoto: string;
  changePhoto: string;
  uploadPhotoBtn: string;
  photoShapeLabel: string;
  photoShapeCircle: string;
  photoShapeRounded: string;
  photoShapeSquare: string;
  photoShapeOval: string;
  photoShapeHexagon: string;
  photoShapeBadge: string;
  photoBorderLabel: string;
  photoBorderNone: string;
  photoBorderThin: string;
  photoBorderAccent: string;
  photoBorderDouble: string;
  imageShapeTitle: string;
  addPhotoCircle: string;
  addPhotoRounded: string;
  addPhotoSquare: string;

  // Step B: Experience
  experienceTitle: string;
  experienceSubtitle: string;
  addExperienceBtn: string;
  noExperienceTitle: string;
  noExperienceDesc: string;
  companyName: string;
  companyPlaceholder: string;
  location: string;
  locationPlaceholder: string;
  startDate: string;
  endDate: string;
  currentPositionCheckbox: string;
  responsibilities: string;
  responsibilitiesPlaceholder: string;
  responsibilitiesHint: string;
  moveUp: string;
  moveDown: string;

  // Step C: Education
  educationTitle: string;
  educationSubtitle: string;
  addEducationBtn: string;
  noEducationTitle: string;
  noEducationDesc: string;
  institutionName: string;
  institutionPlaceholder: string;
  degree: string;
  degreePlaceholder: string;
  fieldOfStudy: string;
  fieldOfStudyPlaceholder: string;
  educationDesc: string;
  educationDescPlaceholder: string;

  // Step D: Skills
  skillsTitle: string;
  skillsSubtitle: string;
  skillName: string;
  skillNamePlaceholder: string;
  skillLevel: string;
  addSkillBtn: string;
  quickAddSkills: string;
  noSkillsTitle: string;
  noSkillsDesc: string;
  levelBeginner: string;
  levelIntermediate: string;
  levelAdvanced: string;
  levelExpert: string;

  // Step E: Languages
  languagesTitle: string;
  languagesSubtitle: string;
  languageName: string;
  languageNamePlaceholder: string;
  proficiencyLevel: string;
  addLanguageBtn: string;
  profNative: string;
  profFluent: string;
  profProfessional: string;
  profIntermediate: string;
  profBasic: string;

  // Step F: Additional
  additionalTitle: string;
  additionalSubtitle: string;
  tabProjects: string;
  tabCertifications: string;
  tabAwards: string;
  tabVolunteer: string;
  tabReferences: string;
  addProjectBtn: string;
  projectTitle: string;
  projectRole: string;
  projectLink: string;
  projectDesc: string;
  addCertBtn: string;
  certName: string;
  certIssuer: string;
  certDate: string;
  addAwardBtn: string;
  awardTitle: string;
  awardIssuer: string;
  awardDate: string;
  awardDesc: string;
  addVolunteerBtn: string;
  volunteerRole: string;
  volunteerOrg: string;
  volunteerDesc: string;
  addRefBtn: string;
  refName: string;
  refCompany: string;
  refTitle: string;
  refEmail: string;
  refPhone: string;
  referencesNotice: string;

  // Preview & Export
  previewScreenTitle: string;
  downloadPdfBtn: string;
  downloadingPdf: string;
  printBtn: string;
  shareBtn: string;
  changeTemplateBtn: string;
  returnToEditor: string;
  zoomIn: string;
  zoomOut: string;
  zoomFit: string;
  zoom100: string;
  exportSuccessMsg: string;
  exportErrorMsg: string;
  shareNotSupported: string;
  linkCopied: string;

  // Template names & descriptions
  templatesModalTitle: string;
  templatesModalDesc: string;
  selectTemplateBtn: string;
  currentTemplate: string;
  filterAll: string;
  filterProfessional: string;
  filterModern: string;
  filterCreative: string;
  filterAcademic: string;

  // Validation
  nameRequired: string;
  emailInvalid: string;
  fillRequiredFields: string;

  // Section Headers inside the CV itself
  cvSecSummary: string;
  cvSecExperience: string;
  cvSecEducation: string;
  cvSecSkills: string;
  cvSecLanguages: string;
  cvSecProjects: string;
  cvSecCertifications: string;
  cvSecAwards: string;
  cvSecVolunteer: string;
  cvSecReferences: string;
  cvPresent: string;

  // Phase 2: Design Studio
  designStudio: string;
  designCvManually: string;
  createCvAuto: string;
  startBlankDesign: string;
  importCvToDesign: string;
  openInStudio: string;
  studioTemplates: string;
  studioText: string;
  studioElements: string;
  studioBlocks: string;
  studioUploads: string;
  studioPages: string;
  undoBtn: string;
  redoBtn: string;
  addHeading: string;
  addSubheading: string;
  addBodyText: string;
  addRectangle: string;
  addCircle: string;
  addLine: string;
  addBadge: string;
  blockContact: string;
  blockSummary: string;
  blockExperience: string;
  blockEducation: string;
  blockSkills: string;
  blockLanguages: string;
  bringForward: string;
  sendBackward: string;
  duplicateElement: string;
  deleteElement: string;
  lockElement: string;
  unlockElement: string;
  addPageBtn: string;
  duplicatePageBtn: string;
  deletePageBtn: string;
  pageLabel: string;
  cannotDeleteLastPage: string;
  fontFamilyLabel: string;
  fontSizeLabel: string;
  textColorLabel: string;
  fillColorLabel: string;
  borderColorLabel: string;
  opacityLabel: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  emptyCanvasTitle: string;
  emptyCanvasDesc: string;
  exportStudioPdf: string;

  // Database & Cloud
  cloudDatabase: string;
  cloudConnected: string;
  cloudSyncing: string;
  cloudSaved: string;
  signInWithGoogle: string;
  signOut: string;
  syncToCloud: string;
  cloudBackupNotice: string;
  signInToBackup: string;
  cloudDrafts: string;
  saveToDatabase: string;
}

export const translations: Record<InterfaceLanguage, TranslationDictionary> = {
  en: {
    appName: "CV Maker",
    tagline: "Automatic Professional CV Builder",
    heroTitle: "Build a Job-Winning CV in Minutes",
    heroSubtitle: "Mobile-first, beautifully designed, and completely free. Choose from 12 ATS-friendly templates and export to PDF instantly.",
    createCvBtn: "Create My CV",
    loadSampleBtn: "View Sample CV",
    myCvsTitle: "My Saved CVs",
    myCvsSubtitle: "All your CV drafts are saved safely in your device storage.",
    noCvsTitle: "No CV drafts found",
    noCvsDesc: "You haven't created any CV yet. Start creating one now or load a sample to see how it works!",
    createFirstCv: "Create Your First CV",
    lastEdited: "Last edited",
    createdOn: "Created",
    templateLabel: "Template",
    languageLabel: "Language",
    interfaceLanguage: "App Language",
    cvDocumentLanguage: "CV Content Language",
    openBtn: "Open",
    editBtn: "Edit Form",
    renameBtn: "Rename",
    duplicateBtn: "Duplicate",
    deleteBtn: "Delete",
    cancelBtn: "Cancel",
    saveBtn: "Save",
    confirmBtn: "Confirm",
    backBtn: "Back",
    nextBtn: "Next Step",
    previewBtn: "Live Preview",
    saveDraftBtn: "Save Draft",
    savedSuccessfully: "Draft saved successfully",
    draftUpdated: "Draft updated",
    draftDeleted: "Draft deleted",
    draftDuplicated: "Draft duplicated",

    storageNoticeTitle: "Local Browser Storage",
    storageNoticeDesc: "Your CVs are stored privately in your browser storage. No personal data is sent to external servers. Clearing your browser cache or site data will reset stored drafts.",

    deleteModalTitle: "Delete CV Draft",
    deleteModalText: "Are you sure you want to delete this CV draft? This action cannot be undone.",
    renameModalTitle: "Rename CV Draft",
    newTitlePlaceholder: "Enter new CV title...",

    stepPersonal: "Personal Info",
    stepExperience: "Experience",
    stepEducation: "Education",
    stepSkills: "Skills",
    stepLanguages: "Languages",
    stepAdditional: "Additional",
    stepTemplates: "Templates",

    personalTitle: "Personal Information",
    personalSubtitle: "Provide your primary contact details and professional summary.",
    fullName: "Full Name *",
    fullNamePlaceholder: "e.g. Ahmed Abdi Hassan",
    jobTitle: "Job Title or Desired Role *",
    jobTitlePlaceholder: "e.g. Senior Software Engineer / Project Manager",
    email: "Email Address *",
    emailPlaceholder: "e.g. ahmed.hassan@example.com",
    phone: "Phone Number",
    phonePlaceholder: "e.g. +252 61 555 1234",
    city: "City",
    cityPlaceholder: "e.g. Mogadishu / London",
    country: "Country",
    countryPlaceholder: "e.g. Somalia / United Kingdom",
    summary: "Professional Summary",
    summaryPlaceholder: "Write 2-4 sentences highlighting your background, core strengths, and what value you bring...",
    summaryPromptsTitle: "Helpful Summary Starters:",
    useThisSummary: "Use this template",
    photoUploadTitle: "Profile Photo (Optional)",
    photoUploadHint: "Recommended for Modern & Creative templates. Max 3MB.",
    removePhoto: "Remove photo",
    changePhoto: "Change photo",
    uploadPhotoBtn: "Upload Photo",
    photoShapeLabel: "Photo Shape & Style",
    photoShapeCircle: "Circle",
    photoShapeRounded: "Rounded",
    photoShapeSquare: "Square",
    photoShapeOval: "Oval",
    photoShapeHexagon: "Hexagon",
    photoShapeBadge: "Badge",
    photoBorderLabel: "Photo Border",
    photoBorderNone: "None",
    photoBorderThin: "Thin",
    photoBorderAccent: "Accent Color",
    photoBorderDouble: "Double Ring",
    imageShapeTitle: "Image Shape",
    addPhotoCircle: "Add Circle Photo",
    addPhotoRounded: "Add Rounded Photo",
    addPhotoSquare: "Add Square Photo",

    experienceTitle: "Work Experience",
    experienceSubtitle: "Add your previous and current roles in reverse chronological order.",
    addExperienceBtn: "Add Work Experience",
    noExperienceTitle: "No experience entries added yet",
    noExperienceDesc: "First-time job seeker or student? You can skip this step or include internships, part-time, or freelance work.",
    companyName: "Company / Organization *",
    companyPlaceholder: "e.g. SomTel / Tech Innovations Ltd",
    location: "Location",
    locationPlaceholder: "e.g. Mogadishu, Somalia (or Remote)",
    startDate: "Start Date",
    endDate: "End Date",
    currentPositionCheckbox: "I currently work here",
    responsibilities: "Key Responsibilities & Achievements",
    responsibilitiesPlaceholder: "• Spearheaded the development of new web services...\n• Improved system performance by 25%...\n• Mentored 4 junior developers...",
    responsibilitiesHint: "Tip: Use bullet points and action verbs (Led, Designed, Managed, Achieved).",
    moveUp: "Move Up",
    moveDown: "Move Down",

    educationTitle: "Education & Qualifications",
    educationSubtitle: "Add your university degrees, diplomas, high school, or training.",
    addEducationBtn: "Add Education",
    noEducationTitle: "No education entries added yet",
    noEducationDesc: "Add your educational background to show employers your qualifications.",
    institutionName: "Institution / University *",
    institutionPlaceholder: "e.g. Somali National University / Oxford University",
    degree: "Degree / Certificate *",
    degreePlaceholder: "e.g. Bachelor of Science / Diploma",
    fieldOfStudy: "Field of Study",
    fieldOfStudyPlaceholder: "e.g. Computer Science / Business Administration",
    educationDesc: "Honors, Coursework or Key Achievements",
    educationDescPlaceholder: "e.g. Graduated with First Class Honors, Dean's List, Head of Student Council",

    skillsTitle: "Skills & Competencies",
    skillsSubtitle: "Highlight your key technical and soft skills.",
    skillName: "Skill Name",
    skillNamePlaceholder: "e.g. JavaScript, Financial Analysis, Project Management",
    skillLevel: "Proficiency Level (Optional)",
    addSkillBtn: "Add Skill",
    quickAddSkills: "Quick Suggestions:",
    noSkillsTitle: "No skills added yet",
    noSkillsDesc: "Add 4-8 relevant skills that match the job you are targeting.",
    levelBeginner: "Beginner",
    levelIntermediate: "Intermediate",
    levelAdvanced: "Advanced",
    levelExpert: "Expert",

    languagesTitle: "Languages",
    languagesSubtitle: "List the languages you speak and your level of fluency.",
    languageName: "Language",
    languageNamePlaceholder: "e.g. Somali, English, Arabic",
    proficiencyLevel: "Proficiency Level",
    addLanguageBtn: "Add Language",
    profNative: "Native / Mother Tongue",
    profFluent: "Fluent / Full Professional",
    profProfessional: "Professional Working",
    profIntermediate: "Intermediate",
    profBasic: "Basic / Elementary",

    additionalTitle: "Additional Sections (Optional)",
    additionalSubtitle: "Stand out by adding projects, certifications, awards, volunteer experience, or references.",
    tabProjects: "Projects",
    tabCertifications: "Certifications",
    tabAwards: "Awards",
    tabVolunteer: "Volunteer",
    tabReferences: "References",
    addProjectBtn: "Add Project",
    projectTitle: "Project Title",
    projectRole: "Your Role (e.g. Lead Designer)",
    projectLink: "Link / URL (Optional)",
    projectDesc: "Project Description & Outcome",
    addCertBtn: "Add Certification",
    certName: "Certification Name",
    certIssuer: "Issuing Organization",
    certDate: "Date Earned",
    addAwardBtn: "Add Award or Honor",
    awardTitle: "Award Title",
    awardIssuer: "Issuing Body",
    awardDate: "Year / Date",
    awardDesc: "Brief Description (Optional)",
    addVolunteerBtn: "Add Volunteer Role",
    volunteerRole: "Role / Title",
    volunteerOrg: "Organization",
    volunteerDesc: "Activities and Contributions",
    addRefBtn: "Add Reference",
    refName: "Full Name",
    refCompany: "Company / Organization",
    refTitle: "Job Title",
    refEmail: "Email Address",
    refPhone: "Phone Number",
    referencesNotice: "Note: You can also write 'Available upon request' in references.",

    previewScreenTitle: "CV Document Preview",
    downloadPdfBtn: "Download PDF",
    downloadingPdf: "Generating PDF...",
    printBtn: "Print / Save PDF",
    shareBtn: "Share",
    changeTemplateBtn: "Change Template",
    returnToEditor: "Edit Content",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    zoomFit: "Fit View",
    zoom100: "100%",
    exportSuccessMsg: "PDF downloaded successfully!",
    exportErrorMsg: "Failed to generate PDF. Please try Print / Save PDF option.",
    shareNotSupported: "Direct sharing not supported on this browser. Use Download PDF.",
    linkCopied: "Link copied to clipboard",

    templatesModalTitle: "Choose a CV Template",
    templatesModalDesc: "Select from 12 distinct professional layouts. Switching templates keeps all your content intact.",
    selectTemplateBtn: "Select Template",
    currentTemplate: "Current Template",
    filterAll: "All (12)",
    filterProfessional: "Professional",
    filterModern: "Modern",
    filterCreative: "Creative",
    filterAcademic: "Academic",

    nameRequired: "Please enter your full name",
    emailInvalid: "Please enter a valid email address",
    fillRequiredFields: "Please fill in the required fields before continuing",

    cvSecSummary: "Professional Summary",
    cvSecExperience: "Work Experience",
    cvSecEducation: "Education",
    cvSecSkills: "Skills & Expertise",
    cvSecLanguages: "Languages",
    cvSecProjects: "Key Projects",
    cvSecCertifications: "Certifications",
    cvSecAwards: "Awards & Honors",
    cvSecVolunteer: "Volunteer Experience",
    cvSecReferences: "References",
    cvPresent: "Present",

    // Phase 2: Design Studio
    designStudio: "Design Studio",
    designCvManually: "Design CV (Studio)",
    createCvAuto: "Auto CV Builder",
    startBlankDesign: "Start Blank Design",
    importCvToDesign: "Open in Design Studio",
    openInStudio: "Open in Studio",
    studioTemplates: "Templates",
    studioText: "Text",
    studioElements: "Shapes",
    studioBlocks: "Sections",
    studioUploads: "Photos",
    studioPages: "Pages",
    undoBtn: "Undo",
    redoBtn: "Redo",
    addHeading: "Add Heading",
    addSubheading: "Add Subheading",
    addBodyText: "Add Body Text",
    addRectangle: "Rectangle",
    addCircle: "Circle",
    addLine: "Divider Line",
    addBadge: "Badge Box",
    blockContact: "Contact Strip",
    blockSummary: "Summary Block",
    blockExperience: "Experience Item",
    blockEducation: "Education Item",
    blockSkills: "Skills List",
    blockLanguages: "Languages Row",
    bringForward: "Bring Forward",
    sendBackward: "Send Backward",
    duplicateElement: "Duplicate",
    deleteElement: "Delete",
    lockElement: "Lock",
    unlockElement: "Unlock",
    addPageBtn: "Add Page",
    duplicatePageBtn: "Duplicate Page",
    deletePageBtn: "Delete Page",
    pageLabel: "Page",
    cannotDeleteLastPage: "Cannot delete the only page in the document.",
    fontFamilyLabel: "Font Family",
    fontSizeLabel: "Font Size",
    textColorLabel: "Text Color",
    fillColorLabel: "Fill Color",
    borderColorLabel: "Border",
    opacityLabel: "Opacity",
    alignLeft: "Align Left",
    alignCenter: "Align Center",
    alignRight: "Align Right",
    emptyCanvasTitle: "Blank Canvas",
    emptyCanvasDesc: "Select Text, Shapes, or Resume Blocks from the panel to begin designing your custom CV.",
    exportStudioPdf: "Export Design to PDF",

    // Database & Cloud
    cloudDatabase: "Cloud Database",
    cloudConnected: "Cloud Connected",
    cloudSyncing: "Syncing to Cloud...",
    cloudSaved: "Saved to Cloud",
    signInWithGoogle: "Sign in with Google",
    signOut: "Sign out",
    syncToCloud: "Sync to Cloud",
    cloudBackupNotice: "Your CVs and Studio designs are securely backed up in your cloud database.",
    signInToBackup: "Sign in with Google to securely sync your CVs to the database and access them anywhere.",
    cloudDrafts: "Cloud Database Drafts",
    saveToDatabase: "Save to Database"
  },

  so: {
    appName: "CV Maker",
    tagline: "Sameeyaha CV-yada Xirfadeed ee Tooska ah",
    heroTitle: "Ku Sameyso CV Guul Leh Daqiiqado Gudahood",
    heroSubtitle: "Loogu talagalay taleefannada gacanta, qaabeyn casri ah oo bilaash ah. Ka dooro 12 qaab (templates) oo ku habboon shaqo-doonka kuna soo degso PDF si degdeg ah.",
    createCvBtn: "Sameyso CV-gaaga",
    loadSampleBtn: "Fiiri CV Tusaale ah",
    myCvsTitle: "CV-yadayda La Keydiyey",
    myCvsSubtitle: "Dhammaan qabyooyinkaaga CV-ga waxay si ammaan ah ugu keydsan yihiin biraawsarkaaga.",
    noCvsTitle: "Weli ma lihid CV la keydiyey",
    noCvsDesc: "Weli ma aadan abuurin wax CV ah. Hadda bilow abuurista mid cusub ama tijaabi CV tusaale ah si aad u aragto sida uu u shaqeeyo!",
    createFirstCv: "Abuur CV-gaagii Koowaad",
    lastEdited: "Wax ka beddelkii u dambeeyey",
    createdOn: "La abuuray",
    templateLabel: "Qaabka (Template)",
    languageLabel: "Luuqadda",
    interfaceLanguage: "Luuqadda App-ka",
    cvDocumentLanguage: "Luuqadda Xogta CV-ga",
    openBtn: "Fur",
    editBtn: "Wax Ka Beddel",
    renameBtn: "Magaca Beddel",
    duplicateBtn: "Nuqul Ka Sameyso",
    deleteBtn: "Tir",
    cancelBtn: "Ka Noqo",
    saveBtn: "Keydi",
    confirmBtn: "Xaqiiji",
    backBtn: "Dib u Laabo",
    nextBtn: "Tallaabada Xigta",
    previewBtn: "Horudhac Toos ah",
    saveDraftBtn: "Keydi Qabyada",
    savedSuccessfully: "Qabyada si guul leh ayaa loo keydiyey",
    draftUpdated: "CV-ga waa la cusbooneysiiyey",
    draftDeleted: "CV-ga waa la tirtiray",
    draftDuplicated: "Nuqul cusub ayaa la sameeyey",

    storageNoticeTitle: "Kaydinta Biraawsarkaaga",
    storageNoticeDesc: "CV-yadaada waxaa si gaar ah loogu keydiyaa aaladdaada. Wax xog ah looma gudbiyo server dibadda ah. Haddii aad tirtirto xogta biraawsarkaaga, CV-yada waa la waayi karaa.",

    deleteModalTitle: "Tirtir CV-ga Qabyada ah",
    deleteModalText: "Ma hubtaa inaad tirtirto CV-gan qabyada ah? Ficilkan dib looma soo celin karo.",
    renameModalTitle: "Beddel Magaca CV-ga",
    newTitlePlaceholder: "Geli magaca cusub ee CV-ga...",

    stepPersonal: "Qofka",
    stepExperience: "Khibrad",
    stepEducation: "Waxbarasho",
    stepSkills: "Xirfado",
    stepLanguages: "Luuqado",
    stepAdditional: "Dheeraad",
    stepTemplates: "Qaababka",

    personalTitle: "Macluumaadka Qofka",
    personalSubtitle: "Geli macluumaadkaaga xiriirka iyo dulmar kooban oo ku saabsan xirfaddaada.",
    fullName: "Magacaaga Oo Buuxa *",
    fullNamePlaceholder: "tusaale: Axmed Cabdi Xasan",
    jobTitle: "Magaca Shaqada ama Jagada aad Dooneyso *",
    jobTitlePlaceholder: "tusaale: Injineerka Software-ka / Maamulaha Mashruuca",
    email: "Cinwaanka Email-ka *",
    emailPlaceholder: "tusaale: ahmed.hassan@example.com",
    phone: "Lambarka Taleefanka",
    phonePlaceholder: "tusaale: +252 61 555 1234",
    city: "Magaalada",
    cityPlaceholder: "tusaale: Muqdisho / Hargeysa",
    country: "Waddanka",
    countryPlaceholder: "tusaale: Soomaaliya",
    summary: "Dulmar Xirfadeed (Professional Summary)",
    summaryPlaceholder: "Qor 2-4 jumladood oo muujinaya khibraddaada, awoodahaaga muhiimka ah, iyo waxa aad ku kordhin karto shirkadda...",
    summaryPromptsTitle: "Tusaalooyin Dulmar ah oo Caawinaya:",
    useThisSummary: "Isticmaal tusaalahan",
    photoUploadTitle: "Sawirka Qofka (Ikhtiyaari)",
    photoUploadHint: "Waxaa lagu talinayaa qaababka Casriga ah iyo Naqshadeynta. Ugu badnaan 3MB.",
    removePhoto: "Ka saar sawirka",
    changePhoto: "Beddel sawirka",
    uploadPhotoBtn: "Soo Geli Sawir",
    photoShapeLabel: "Qaabka Sawirka (Circle & Shapes)",
    photoShapeCircle: "Goobo (Circle)",
    photoShapeRounded: "Geeso Wareegsan (Rounded)",
    photoShapeSquare: "Labajibbaaran (Square)",
    photoShapeOval: "Qalooc (Oval)",
    photoShapeHexagon: "Xagalley (Hexagon)",
    photoShapeBadge: "Gaashaan (Badge)",
    photoBorderLabel: "Xadka Sawirka (Border)",
    photoBorderNone: "La'aan (None)",
    photoBorderThin: "Khafiif (Thin)",
    photoBorderAccent: "Midabka Naqshadda",
    photoBorderDouble: "Labanlaab (Double)",
    imageShapeTitle: "Qaabka Sawirka",
    addPhotoCircle: "Ku Dar Sawir Goobo ah",
    addPhotoRounded: "Ku Dar Sawir Geeso ah",
    addPhotoSquare: "Ku Dar Sawir Labajibbaaran",

    experienceTitle: "Khibradda Shaqada",
    experienceSubtitle: "Ku dar shaqooyinkii aad soo qabatay ama aad hadda haysid.",
    addExperienceBtn: "Ku Dar Khibrad Shaqo",
    noExperienceTitle: "Weli wax khibrad ah lama gelin",
    noExperienceDesc: "Miyaad tahay arday ama qof shaqadii koowaad raadinaya? Waad dhaafi kartaa tallaabadan ama geli shaqo tabaruc/layli ah.",
    companyName: "Shirkadda / Hay'adda *",
    companyPlaceholder: "tusaale: Shirkadda Hormuud / Somnet Ltd",
    location: "Goobta",
    locationPlaceholder: "tusaale: Muqdisho, Soomaaliya",
    startDate: "Taariikhda Bilowga",
    endDate: "Taariikhda Dhammaadka",
    currentPositionCheckbox: "Hadda ayaan ka shaqeeyaa halkan",
    responsibilities: "Mas'uuliyadaha iyo Guulaha Shaqada",
    responsibilitiesPlaceholder: "• Hogaamiyey horumarinta nidaamka xogta...\n• Kordhiyey waxtarka shaqada 20%...\n• Tababaray 5 shaqaale cusub...",
    responsibilitiesHint: "Talo: Isticmaal qodobbo gaagaaban oo cadcad.",
    moveUp: "Kor u Qaad",
    moveDown: "Hoos u Dhig",

    educationTitle: "Waxbarashada iyo Shahaadooyinka",
    educationSubtitle: "Ku dar jaamacadaha, kulliyadaha, dugsiyada ama koorsooyinka aad baratay.",
    addEducationBtn: "Ku Dar Waxbarasho",
    noEducationTitle: "Weli wax waxbarasho ah lama gelin",
    noEducationDesc: "Geli heerkaaga waxbarasho si shaqo-bixiyeyaashu u ogaadaan aqoontaada.",
    institutionName: "Machadka / Jaamacadda *",
    institutionPlaceholder: "tusaale: Jaamacadda Ummadda Soomaaliyeed",
    degree: "Shahaadada *",
    degreePlaceholder: "tusaale: Shahaadada Koowaad (Bachelor) / Diploma",
    fieldOfStudy: "Takhasuska",
    fieldOfStudyPlaceholder: "tusaale: Sayniska Kumbuyuutarka / Maamulka Ganacsiga",
    educationDesc: "Darajooyinka ama Guulaha Gaarka ah",
    educationDescPlaceholder: "tusaale: Ka qalin-jabiyey kaalinta koowaad, Madaxa ardayda",

    skillsTitle: "Xirfadaha",
    skillsSubtitle: "Muuji xirfadahaaga farsamo iyo kuwa wada-shaqeynta.",
    skillName: "Magaca Xirfadda",
    skillNamePlaceholder: "tusaale: Maamulka Mashruuca, Xisaabaadka, Python",
    skillLevel: "Heerka Xirfadda (Ikhtiyaari)",
    addSkillBtn: "Ku Dar Xirfad",
    quickAddSkills: "Xirfado Lagu Taliyey:",
    noSkillsTitle: "Weli wax xirfado ah lama gelin",
    noSkillsDesc: "Ku dar 4-8 xirfadood oo la xiriira shaqada aad codsanayso.",
    levelBeginner: "Bilow",
    levelIntermediate: "Dhexdhexaad",
    levelAdvanced: "Heer Sare",
    levelExpert: "Khabiir",

    languagesTitle: "Luuqadaha",
    languagesSubtitle: "Qor luuqadaha aad taqaanno iyo heerka aad ku hadli karto.",
    languageName: "Luuqadda",
    languageNamePlaceholder: "tusaale: Soomaali, Ingiriisi, Carabi",
    proficiencyLevel: "Heerka Aqoonta",
    addLanguageBtn: "Ku Dar Luuqad",
    profNative: "Afka Hooyo",
    profFluent: "Aad u Fiican (Fasax)",
    profProfessional: "Heer Xirfadeed",
    profIntermediate: "Dhexdhexaad",
    profBasic: "Aasaasi",

    additionalTitle: "Qeybaha Dheeraadka ah (Ikhtiyaari)",
    additionalSubtitle: "Ka dhig CV-gaaga mid cajiib ah adigoo ku daraya mashaariic, shahaadooyin, abaalmarinno, ama tixraac.",
    tabProjects: "Mashaariic",
    tabCertifications: "Shahaadooyin",
    tabAwards: "Abaalmarinno",
    tabVolunteer: "Tabarucaad",
    tabReferences: "Tixraacyo",
    addProjectBtn: "Ku Dar Mashruuc",
    projectTitle: "Magaca Mashruuca",
    projectRole: "Doorkaaga (tusaale: Naqshadeeyaha)",
    projectLink: "Link-ga Mashruuca (Haddii uu jiro)",
    projectDesc: "Faahfaahinta Mashruuca",
    addCertBtn: "Ku Dar Shahaado",
    certName: "Magaca Shahaadada",
    certIssuer: "Hay'adda Bixisay",
    certDate: "Taariikhda",
    addAwardBtn: "Ku Dar Abaalmarin",
    awardTitle: "Magaca Abaalmarinta",
    awardIssuer: "Qofka/Hay'adda Bixisay",
    awardDate: "Sanadka",
    awardDesc: "Faahfaahin Kooban",
    addVolunteerBtn: "Ku Dar Shaqo Tabaruc ah",
    volunteerRole: "Doorkaaga",
    volunteerOrg: "Hay'adda",
    volunteerDesc: "Waxyaabihii aad ka qabatay",
    addRefBtn: "Ku Dar Tixraac",
    refName: "Magaca Qofka",
    refCompany: "Shirkadda / Hay'adda",
    refTitle: "Jagada",
    refEmail: "Email-ka",
    refPhone: "Taleefanka",
    referencesNotice: "Fiiro gaar ah: Waxaad sidoo kale qori kartaa 'Lama wadaagi karaa marka la codsado'.",

    previewScreenTitle: "Horudhaca CV-ga",
    downloadPdfBtn: "Soo Degso PDF",
    downloadingPdf: "PDF-ka ayaa la diyaarinayaa...",
    printBtn: "Daabac / Keydi PDF",
    shareBtn: "La Wadaag",
    changeTemplateBtn: "Beddel Qaabka (Template)",
    returnToEditor: "Ku Laabo Qorista",
    zoomIn: "Weyneey",
    zoomOut: "Yaree",
    zoomFit: "Waafaji Shaashadda",
    zoom100: "100%",
    exportSuccessMsg: "PDF-ka si guul leh ayaa loo soo dejiyey!",
    exportErrorMsg: "Waa lagu guuldareystay PDF-ka. Fadlan isticmaal ikhtiyaarka Daabac/Print.",
    shareNotSupported: "Biraawsarkani ma taageerayo wadaagista tooska ah. Fadlan soo degso PDF.",
    linkCopied: "Link-ga waa la koobiyeeyey",

    templatesModalTitle: "Dooro Qaabka CV-ga (Template)",
    templatesModalDesc: "Ka dooro 12 qaab oo xirfadeed. Beddelka qaabku ma tirtirayo xogtaada.",
    selectTemplateBtn: "Dooro Qaabkan",
    currentTemplate: "Qaabka Hadda",
    filterAll: "Dhammaan (12)",
    filterProfessional: "Xirfadeed",
    filterModern: "Casri ah",
    filterCreative: "Hal-abuur",
    filterAcademic: "Tacliin",

    nameRequired: "Fadlan geli magacaaga oo buuxa",
    emailInvalid: "Fadlan geli email sax ah",
    fillRequiredFields: "Fadlan buuxi meelaha muhiimka ah ka hor inta aadan hore u socon",

    cvSecSummary: "Dulmar Xirfadeed",
    cvSecExperience: "Khibradda Shaqada",
    cvSecEducation: "Waxbarashada",
    cvSecSkills: "Xirfadaha Muhiimka ah",
    cvSecLanguages: "Luuqadaha",
    cvSecProjects: "Mashaariicda Muhiimka ah",
    cvSecCertifications: "Shahaadooyinka Xirfadeed",
    cvSecAwards: "Abaalmarinnada iyo Maamuusyada",
    cvSecVolunteer: "Shaqooyinka Tabarucaadka",
    cvSecReferences: "Tixraacyada",
    cvPresent: "Hadda",

    // Phase 2: Design Studio
    designStudio: "Istudiyaha Naqshadda",
    designCvManually: "Naqshadee CV (Studio)",
    createCvAuto: "Sameyso Toos (Form)",
    startBlankDesign: "Bilow Bog Bannaan",
    importCvToDesign: "Ku Fur Istudiyaha Naqshadda",
    openInStudio: "Ku Fur Studio",
    studioTemplates: "Qaababka",
    studioText: "Qoraal",
    studioElements: "Muuqaallada",
    studioBlocks: "Qeybaha CV",
    studioUploads: "Sawirro",
    studioPages: "Boggaga",
    undoBtn: "Ka Noqo",
    redoBtn: "Dib u Samee",
    addHeading: "Ku Dar Cinwaan Weyn",
    addSubheading: "Ku Dar Cinwaan Dhexe",
    addBodyText: "Ku Dar Qoraal",
    addRectangle: "Laydi (Rectangle)",
    addCircle: "Goobo (Circle)",
    addLine: "Xariiq Qaybisa",
    addBadge: "Sanduuq Yar",
    blockContact: "Cinwaanka Xiriirka",
    blockSummary: "Sanduuqa Dulmarka",
    blockExperience: "Khibrad Shaqo",
    blockEducation: "Waxbarasho",
    blockSkills: "Qaybta Xirfadaha",
    blockLanguages: "Qaybta Luuqadaha",
    bringForward: "Hor Keen",
    sendBackward: "Dib u Celi",
    duplicateElement: "Nuqul Ka Samee",
    deleteElement: "Tir",
    lockElement: "Quful Meesha",
    unlockElement: "Fur Qufulka",
    addPageBtn: "Ku Dar Bog Cusub",
    duplicatePageBtn: "Nuqul Bogga",
    deletePageBtn: "Tir Bogga",
    pageLabel: "Bogga",
    cannotDeleteLastPage: "Ma tiri kartid bogga kaliya ee dukumeentiga ku haray.",
    fontFamilyLabel: "Nooca Farta",
    fontSizeLabel: "Cabbirka Farta",
    textColorLabel: "Midabka Qoraalka",
    fillColorLabel: "Midabka Gudaha",
    borderColorLabel: "Xariiqda Wareegsan",
    opacityLabel: "Daahfurnaanta",
    alignLeft: "Bidix ku Toosi",
    alignCenter: "Dhexda ku Toosi",
    alignRight: "Midig ku Toosi",
    emptyCanvasTitle: "Bog Bannaan",
    emptyCanvasDesc: "Ka dooro dhinaca bidix Qoraal, Muuqaallo, ama Qeybo CV si aad u bilowdo naqshadeyntaada.",
    exportStudioPdf: "Soo Degso PDF (Naqshadda)",

    // Database & Cloud
    cloudDatabase: "Database-ka Cloud-ka",
    cloudConnected: "Ku Xiran Cloud-ka",
    cloudSyncing: "U Diraya Database-ka...",
    cloudSaved: "Ku Kaydsan Database-ka",
    signInWithGoogle: "Ku Gal Google",
    signOut: "Ka Bax",
    syncToCloud: "Ku Kaydi Database-ka",
    cloudBackupNotice: "CV-yadaada iyo naqshadahaaga waxay si ammaan ah ugu kaydsan yihiin database-ka cloud-ka.",
    signInToBackup: "Ku gal akoonkaaga Google si CV-yadaada ugu kaydsanaadaan database-ka aadna uga hesho qalab kasta.",
    cloudDrafts: "Qabyooyinka Database-ka",
    saveToDatabase: "Ku Kaydi Database-ka"
  }
};
