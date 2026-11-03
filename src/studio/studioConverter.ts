/**
 * Converts CVData or Template layouts into editable Canva-style Studio Document elements
 */

import { CVData, TemplateId } from '../types/cv';
import { StudioDocument, StudioElement, StudioPage } from '../types/studio';
import { translations } from '../i18n/translations';
export { createBlankStudioDocument } from '../storage/studioStorage';

export function convertCvDataToStudioDocument(cvData: CVData, title = 'Custom CV Design'): StudioDocument {
  const lang = cvData.cvLanguage || 'en';
  const dict = translations[lang] || translations.en;
  const elements: StudioElement[] = [];

  let nextZ = 1;
  const makeId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Header background shape (Modern clean banner)
  elements.push({
    id: makeId('shape_header'),
    type: 'shape',
    shapeType: 'rectangle',
    x: 0,
    y: 0,
    width: 794,
    height: 140,
    zIndex: nextZ++,
    fillColor: '#1e3a8a',
    borderRadius: 0
  });

  // Candidate Name
  elements.push({
    id: makeId('text_name'),
    type: 'text',
    text: cvData.personal.fullName || 'Candidate Name',
    role: 'heading',
    x: 48,
    y: 28,
    width: 500,
    height: 44,
    zIndex: nextZ++,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: 'extrabold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#ffffff'
  });

  // Candidate Job Title
  if (cvData.personal.jobTitle) {
    elements.push({
      id: makeId('text_title'),
      type: 'text',
      text: cvData.personal.jobTitle,
      role: 'subheading',
      x: 48,
      y: 72,
      width: 500,
      height: 24,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 'medium',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#bfdbfe'
    });
  }

  // Profile Photo (if available)
  if (cvData.personal.photoUrl) {
    const pShape = cvData.personal.photoShape || 'circle';
    elements.push({
      id: makeId('img_photo'),
      type: 'image',
      src: cvData.personal.photoUrl,
      shape: pShape === 'square' ? 'rectangle' : (pShape as any),
      x: 640,
      y: 20,
      width: 100,
      height: 100,
      zIndex: nextZ++,
      borderRadius: pShape === 'circle' ? 9999 : pShape === 'rounded' ? 18 : 0,
      borderWidth: 3,
      borderColor: '#ffffff'
    });
  }

  // Contact Info Strip
  const contactParts = [
    cvData.personal.email,
    cvData.personal.phone,
    [cvData.personal.city, cvData.personal.country].filter(Boolean).join(', ')
  ].filter(Boolean);

  if (contactParts.length > 0) {
    elements.push({
      id: makeId('text_contact'),
      type: 'text',
      text: contactParts.join('  •  '),
      role: 'caption',
      x: 48,
      y: 102,
      width: 560,
      height: 20,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#e2e8f0'
    });
  }

  let currentY = 165;

  // Professional Summary
  if (cvData.personal.summary) {
    elements.push({
      id: makeId('sec_summary_title'),
      type: 'text',
      text: dict.cvSecSummary.toUpperCase(),
      role: 'subheading',
      x: 48,
      y: currentY,
      width: 698,
      height: 22,
      zIndex: nextZ++,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 13,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#1e3a8a'
    });

    elements.push({
      id: makeId('div_summary'),
      type: 'divider',
      x: 48,
      y: currentY + 24,
      width: 698,
      height: 2,
      zIndex: nextZ++,
      color: '#cbd5e1',
      thickness: 1.5,
      style: 'solid'
    });

    elements.push({
      id: makeId('text_summary_content'),
      type: 'text',
      text: cvData.personal.summary,
      role: 'body',
      x: 48,
      y: currentY + 34,
      width: 698,
      height: 60,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 11.5,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'justify',
      color: '#334155',
      lineHeight: 1.5
    });

    currentY += 105;
  }

  // Work Experience
  if (cvData.experiences.length > 0) {
    elements.push({
      id: makeId('sec_exp_title'),
      type: 'text',
      text: dict.cvSecExperience.toUpperCase(),
      role: 'subheading',
      x: 48,
      y: currentY,
      width: 698,
      height: 22,
      zIndex: nextZ++,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 13,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#1e3a8a'
    });

    elements.push({
      id: makeId('div_exp'),
      type: 'divider',
      x: 48,
      y: currentY + 24,
      width: 698,
      height: 2,
      zIndex: nextZ++,
      color: '#cbd5e1',
      thickness: 1.5,
      style: 'solid'
    });

    currentY += 34;

    cvData.experiences.slice(0, 3).forEach((exp) => {
      const dates = exp.isCurrent
        ? `${exp.startDate || ''} – ${dict.cvPresent}`
        : `${exp.startDate || ''} – ${exp.endDate || ''}`;

      elements.push({
        id: makeId('exp_title'),
        type: 'text',
        text: `${exp.jobTitle} — ${exp.company}`,
        role: 'subheading',
        x: 48,
        y: currentY,
        width: 500,
        height: 20,
        zIndex: nextZ++,
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#0f172a'
      });

      elements.push({
        id: makeId('exp_dates'),
        type: 'text',
        text: dates,
        role: 'caption',
        x: 550,
        y: currentY,
        width: 196,
        height: 20,
        zIndex: nextZ++,
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: 'medium',
        fontStyle: 'normal',
        textAlign: 'right',
        color: '#64748b'
      });

      if (exp.description) {
        elements.push({
          id: makeId('exp_desc'),
          type: 'text',
          text: exp.description,
          role: 'body',
          x: 48,
          y: currentY + 22,
          width: 698,
          height: 55,
          zIndex: nextZ++,
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
          color: '#475569',
          lineHeight: 1.45
        });
        currentY += 85;
      } else {
        currentY += 30;
      }
    });
  }

  // Education & Skills 2-Column Section
  if (cvData.education.length > 0 || cvData.skills.length > 0) {
    const leftColX = 48;
    const rightColX = 410;
    const colWidth = 336;

    // Left Column: Education
    if (cvData.education.length > 0) {
      elements.push({
        id: makeId('sec_edu_title'),
        type: 'text',
        text: dict.cvSecEducation.toUpperCase(),
        role: 'subheading',
        x: leftColX,
        y: currentY,
        width: colWidth,
        height: 22,
        zIndex: nextZ++,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 13,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#1e3a8a'
      });

      elements.push({
        id: makeId('div_edu'),
        type: 'divider',
        x: leftColX,
        y: currentY + 24,
        width: colWidth,
        height: 2,
        zIndex: nextZ++,
        color: '#cbd5e1',
        thickness: 1.5,
        style: 'solid'
      });

      let eduY = currentY + 34;
      cvData.education.slice(0, 2).forEach((edu) => {
        elements.push({
          id: makeId('edu_degree'),
          type: 'text',
          text: edu.degree + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''),
          role: 'body',
          x: leftColX,
          y: eduY,
          width: colWidth,
          height: 18,
          zIndex: nextZ++,
          fontFamily: 'Inter',
          fontSize: 11.5,
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'left',
          color: '#0f172a'
        });

        elements.push({
          id: makeId('edu_inst'),
          type: 'text',
          text: edu.institution + (edu.endDate ? ` (${edu.endDate})` : ''),
          role: 'caption',
          x: leftColX,
          y: eduY + 18,
          width: colWidth,
          height: 18,
          zIndex: nextZ++,
          fontFamily: 'Inter',
          fontSize: 10.5,
          fontWeight: 'normal',
          fontStyle: 'italic',
          textAlign: 'left',
          color: '#64748b'
        });

        eduY += 42;
      });
    }

    // Right Column: Skills
    if (cvData.skills.length > 0) {
      elements.push({
        id: makeId('sec_sk_title'),
        type: 'text',
        text: dict.cvSecSkills.toUpperCase(),
        role: 'subheading',
        x: rightColX,
        y: currentY,
        width: colWidth,
        height: 22,
        zIndex: nextZ++,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 13,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#1e3a8a'
      });

      elements.push({
        id: makeId('div_sk'),
        type: 'divider',
        x: rightColX,
        y: currentY + 24,
        width: colWidth,
        height: 2,
        zIndex: nextZ++,
        color: '#cbd5e1',
        thickness: 1.5,
        style: 'solid'
      });

      const skillListText = cvData.skills.map(s => s.name).join('  •  ');
      elements.push({
        id: makeId('text_skills'),
        type: 'text',
        text: skillListText,
        role: 'body',
        x: rightColX,
        y: currentY + 34,
        width: colWidth,
        height: 70,
        zIndex: nextZ++,
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: 'medium',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#334155',
        lineHeight: 1.5
      });
    }
  }

  const firstPage: StudioPage = {
    id: makeId('page_1'),
    pageNumber: 1,
    backgroundColor: '#ffffff',
    elements
  };

  return {
    id: 'studio_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: [firstPage],
    width: 794,
    height: 1123,
    sourceTemplateId: 'modern-blue'
  };
}

export function createStarterTemplateDocument(templateId: TemplateId, title = 'Template Design'): StudioDocument {
  const makeId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const elements: StudioElement[] = [];
  let nextZ = 1;

  if (templateId === 'two-column-sidebar') {
    // 35% Left Sidebar
    elements.push({
      id: makeId('sidebar_bg'),
      type: 'shape',
      shapeType: 'rectangle',
      x: 0,
      y: 0,
      width: 278,
      height: 1123,
      zIndex: nextZ++,
      fillColor: '#0f172a',
      borderRadius: 0
    });

    // Profile photo placeholder
    elements.push({
      id: makeId('photo'),
      type: 'shape',
      shapeType: 'circle',
      x: 79,
      y: 40,
      width: 120,
      height: 120,
      zIndex: nextZ++,
      fillColor: '#1e293b',
      borderColor: '#38bdf8',
      borderWidth: 3
    });

    // Name in sidebar
    elements.push({
      id: makeId('name'),
      type: 'text',
      text: 'JOHN DOE',
      role: 'heading',
      x: 20,
      y: 180,
      width: 238,
      height: 30,
      zIndex: nextZ++,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 20,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      color: '#ffffff'
    });

    elements.push({
      id: makeId('title'),
      type: 'text',
      text: 'SENIOR PRODUCT DESIGNER',
      role: 'subheading',
      x: 20,
      y: 215,
      width: 238,
      height: 20,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 'semibold',
      fontStyle: 'normal',
      textAlign: 'center',
      color: '#38bdf8'
    });

    // Main column summary
    elements.push({
      id: makeId('main_summary_title'),
      type: 'text',
      text: 'EXECUTIVE PROFILE',
      role: 'subheading',
      x: 310,
      y: 40,
      width: 440,
      height: 24,
      zIndex: nextZ++,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 14,
      fontWeight: 'extrabold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#0f172a'
    });

    elements.push({
      id: makeId('main_summary_div'),
      type: 'divider',
      x: 310,
      y: 68,
      width: 440,
      height: 2,
      zIndex: nextZ++,
      color: '#0284c7',
      thickness: 2,
      style: 'solid'
    });

    elements.push({
      id: makeId('main_summary_text'),
      type: 'text',
      text: 'Accomplished design leader with 8+ years crafting intuitive cross-platform experiences. Specializing in design systems, interaction architecture, and scaling creative engineering teams.',
      role: 'body',
      x: 310,
      y: 78,
      width: 440,
      height: 60,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'justify',
      color: '#334155'
    });
  } else {
    // Default Header + Clean Grid
    elements.push({
      id: makeId('hdr_bg'),
      type: 'shape',
      shapeType: 'rectangle',
      x: 32,
      y: 32,
      width: 730,
      height: 110,
      zIndex: nextZ++,
      fillColor: '#f8fafc',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderRadius: 12
    });

    elements.push({
      id: makeId('name'),
      type: 'text',
      text: 'ALEXANDER MORGAN',
      role: 'heading',
      x: 56,
      y: 50,
      width: 500,
      height: 38,
      zIndex: nextZ++,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 26,
      fontWeight: 'extrabold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#0f172a'
    });

    elements.push({
      id: makeId('role'),
      type: 'text',
      text: 'Lead Software Architect & Engineering Manager',
      role: 'subheading',
      x: 56,
      y: 92,
      width: 500,
      height: 22,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: 'medium',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#2563eb'
    });

    elements.push({
      id: makeId('contact'),
      type: 'text',
      text: 'alex.morgan@example.com  •  +1 (555) 019-2834  •  San Francisco, CA',
      role: 'caption',
      x: 56,
      y: 116,
      width: 500,
      height: 18,
      zIndex: nextZ++,
      fontFamily: 'Inter',
      fontSize: 10.5,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#64748b'
    });
  }

  return {
    id: 'studio_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: [{
      id: makeId('page_1'),
      pageNumber: 1,
      backgroundColor: '#ffffff',
      elements
    }],
    width: 794,
    height: 1123,
    sourceTemplateId: templateId
  };
}
