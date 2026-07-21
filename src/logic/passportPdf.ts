// Многостраничный PDF-паспорт стиля, генерится на клиенте (jsPDF + фирменные шрифты).
// Вся информация из итогового экрана: профиль, стили с фото, причёски, аксессуары,
// цвета, борода, посадка, зона роста.

import { jsPDF } from 'jspdf';
import { playfair, playfairItalic, inter, interBold } from '../assets/fonts/fonts';

export interface PdfStyle {
  name: string;
  description: string;
  whyFits: string;
  image: string; // путь к фото стиля
}

export interface PdfPalette {
  name: string;
  note: string;
  colors: { hex: string; name: string }[][]; // группы свотчей (основная/контраст)
}

export interface PdfData {
  archetypeNames: string[];
  comboTitle: string | null;
  scoreRows: { name: string; score: number; dominant: boolean }[];
  bodyName: string;
  faceName: string;
  shapeName: string;
  styles: PdfStyle[];
  hairRules: string[];
  accessories: string[];
  palette: PdfPalette;
  beardRules: string[];
  fitRules: string[];
  growthTitle: string | null;
  growthStyles: string[];
  refs: { handle: string; note: string }[];
}

const WINE: [number, number, number] = [146, 20, 12];
const INK: [number, number, number] = [30, 30, 36];
const NAVY: [number, number, number] = [17, 29, 74];
const PEACH: [number, number, number] = [255, 207, 153];
const CREAM: [number, number, number] = [255, 248, 240];
const MUTED: [number, number, number] = [138, 130, 117];
const LINE: [number, number, number] = [231, 222, 207];

function loadImageCropped(
  src: string,
  tw: number,
  th: number
): Promise<string | null> {
  return new Promise((res) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const scale = 3;
        const c = document.createElement('canvas');
        c.width = tw * scale;
        c.height = th * scale;
        const ctx = c.getContext('2d')!;
        const sw = img.naturalWidth,
          sh = img.naturalHeight;
        const ir = sw / sh,
          r = tw / th;
        let cw = sw,
          ch = sh,
          cx = 0,
          cy = 0;
        if (ir > r) {
          cw = sh * r;
          cx = (sw - cw) / 2;
        } else {
          ch = sw / r;
          cy = (sh - ch) / 2;
        }
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.82));
      } catch {
        res(null);
      }
    };
    img.onerror = () => res(null);
    img.src = src;
  });
}

export async function buildPassportPdf(d: PdfData): Promise<Blob> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  doc.addFileToVFS('Playfair.ttf', playfair);
  doc.addFont('Playfair.ttf', 'playfair', 'normal');
  doc.addFileToVFS('PlayfairIt.ttf', playfairItalic);
  doc.addFont('PlayfairIt.ttf', 'playfair', 'italic');
  doc.addFileToVFS('Inter.ttf', inter);
  doc.addFont('Inter.ttf', 'inter', 'normal');
  doc.addFileToVFS('InterB.ttf', interBold);
  doc.addFont('InterB.ttf', 'inter', 'bold');

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48; // поля
  const CW = W - M * 2;
  let y = 0;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);

  // разрядка заголовков секций
  const spaced = (t: string) => t.toUpperCase().split('').join('\u2009');

  function pageBreakIf(need: number) {
    if (y + need > H - 60) {
      footer();
      doc.addPage();
      y = 60;
    }
  }

  function footer() {
    setText(MUTED);
    doc.setFont('playfair', 'italic');
    doc.setFontSize(12);
    doc.text('Michele Aleer', W / 2, H - 34, { align: 'center' });
  }

  function sectionTitle(t: string) {
    pageBreakIf(60);
    setText(WINE);
    doc.setFont('inter', 'bold');
    doc.setFontSize(10);
    doc.text(spaced(t), M, y);
    y += 22;
  }

  function rulesList(items: string[]) {
    doc.setFont('inter', 'normal');
    doc.setFontSize(10.5);
    for (const it of items) {
      const lines = doc.splitTextToSize(it, CW - 16) as string[];
      pageBreakIf(lines.length * 14 + 6);
      setFill(WINE);
      doc.circle(M + 3, y - 3, 1.6, 'F');
      setText(INK);
      doc.text(lines, M + 16, y);
      y += lines.length * 14 + 6;
    }
    y += 10;
  }

  // ── ШАПКА (герой) ──
  setFill(NAVY);
  doc.rect(0, 0, W, 180, 'F');
  setText(PEACH);
  doc.setFont('inter', 'bold');
  doc.setFontSize(10);
  doc.text(spaced('Стилевой паспорт'), M, 66);
  setText(CREAM);
  doc.setFont('playfair', 'normal');
  const title = d.archetypeNames.join(' + ');
  doc.setFontSize(title.length > 18 ? 30 : 38);
  doc.text(title, M, 112);
  if (d.comboTitle) {
    setText(PEACH);
    doc.setFont('playfair', 'italic');
    doc.setFontSize(17);
    doc.text(`«${d.comboTitle}»`, M, 142);
  }
  y = 230;

  // ── ПРОФИЛЬ ──
  sectionTitle('Архетипный профиль');
  const maxScore = Math.max(...d.scoreRows.map((r) => r.score), 1);
  const bx = M + 140;
  const bw = CW - 140 - 40;
  for (const row of d.scoreRows) {
    setText(row.dominant ? INK : MUTED);
    doc.setFont('playfair', 'italic');
    doc.setFontSize(13);
    doc.text(row.name, M, y + 3);
    setFill(LINE);
    doc.roundedRect(bx, y - 6, bw, 7, 3.5, 3.5, 'F');
    setFill(row.dominant ? WINE : PEACH);
    doc.roundedRect(bx, y - 6, Math.max(7, (row.score / maxScore) * bw), 7, 3.5, 3.5, 'F');
    setText(row.dominant ? WINE : MUTED);
    doc.setFont('inter', 'bold');
    doc.setFontSize(11);
    doc.text(String(row.score), W - M, y + 3, { align: 'right' });
    y += 28;
  }
  y += 6;

  // внешность в строку
  setText(MUTED);
  doc.setFont('inter', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Фигура: ${d.bodyName}    ·    Лицо: ${d.faceName}    ·    Форма: ${d.shapeName}`,
    M,
    y
  );
  y += 30;

  // ── СТИЛИ (с фото) ──
  sectionTitle('Твои стили');
  for (const st of d.styles) {
    const imgH = 96;
    const imgW = 130;
    pageBreakIf(imgH + 18);
    const boxY = y - 12;
    const cropped = await loadImageCropped(st.image, imgW, imgH);
    if (cropped) {
      doc.addImage(cropped, 'JPEG', M, boxY, imgW, imgH);
    } else {
      setFill([220, 210, 195]);
      doc.rect(M, boxY, imgW, imgH, 'F');
      setText(CREAM);
      doc.setFont('playfair', 'italic');
      doc.setFontSize(30);
      doc.text(st.name.charAt(0), M + imgW / 2, boxY + imgH / 2 + 8, { align: 'center' });
    }
    const tx = M + imgW + 16;
    const tw = CW - imgW - 16;
    setText(INK);
    doc.setFont('playfair', 'italic');
    doc.setFontSize(15);
    doc.text(st.name, tx, boxY + 18);
    setText(MUTED);
    doc.setFont('inter', 'normal');
    doc.setFontSize(9.5);
    const desc = doc.splitTextToSize(st.description, tw) as string[];
    doc.text(desc, tx, boxY + 36);
    setText(WINE);
    doc.setFont('playfair', 'italic');
    doc.setFontSize(9.5);
    const why = doc.splitTextToSize(`Почему тебе: ${st.whyFits}`, tw) as string[];
    doc.text(why, tx, boxY + 36 + desc.length * 12 + 8);
    y = boxY + imgH + 20;
  }
  y += 4;

  // ── ПРИЧЁСКИ ──
  sectionTitle('Причёски');
  rulesList(d.hairRules);

  // ── АКСЕССУАРЫ ──
  sectionTitle('Аксессуары');
  rulesList(d.accessories);

  // ── ЦВЕТА ──
  sectionTitle('Цвета');
  doc.setFont('inter', 'normal');
  doc.setFontSize(10.5);
  setText(INK);
  {
    const noteLines = doc.splitTextToSize(d.palette.note, CW) as string[];
    pageBreakIf(noteLines.length * 14 + 10);
    doc.text(noteLines, M, y);
    y += noteLines.length * 14 + 14;
  }
  for (const group of d.palette.colors) {
    pageBreakIf(60);
    const sw = 46;
    const gap = 10;
    let x = M;
    for (const c of group) {
      const rgb = hexToRgb(c.hex);
      setFill(rgb);
      doc.roundedRect(x, y, sw, 34, 3, 3, 'F');
      setText(MUTED);
      doc.setFont('inter', 'normal');
      doc.setFontSize(7);
      doc.text(c.name, x + sw / 2, y + 46, { align: 'center', maxWidth: sw + 6 });
      x += sw + gap;
      if (x + sw > W - M) {
        x = M;
        y += 66;
      }
    }
    y += 74;
  }

  // ── БОРОДА ──
  sectionTitle('Борода');
  rulesList(d.beardRules);

  // ── ПОСАДКА ──
  sectionTitle('Посадка вещей');
  rulesList(d.fitRules);

  // ── ЗОНА РОСТА ──
  if (d.growthTitle) {
    pageBreakIf(100);
    setFill([255, 240, 220]);
    doc.roundedRect(M, y - 8, CW, 78, 8, 8, 'F');
    setText(WINE);
    doc.setFont('inter', 'bold');
    doc.setFontSize(10);
    doc.text(spaced('Направление роста'), M + 20, y + 16);
    setText(INK);
    doc.setFont('playfair', 'italic');
    doc.setFontSize(16);
    doc.text(`«${d.growthTitle}»`, M + 20, y + 40);
    if (d.growthStyles.length) {
      setText(MUTED);
      doc.setFont('inter', 'normal');
      doc.setFontSize(9.5);
      doc.text(d.growthStyles.join('  ·  '), M + 20, y + 58);
    }
    y += 90;
  }

  // ── НАСМОТРЕННОСТЬ (референсы) ──
  if (d.refs.length) {
    sectionTitle('Насмотренность');
    doc.setFont('inter', 'normal');
    doc.setFontSize(10);
    setText(INK);
    const intro = doc.splitTextToSize(
      'Подпишись на этих мужчин — их эстетика резонирует с твоим архетипом. Ссылки кликабельны.',
      CW
    ) as string[];
    doc.text(intro, M, y);
    y += intro.length * 14 + 12;
    for (const r of d.refs) {
      pageBreakIf(34);
      setText(WINE);
      doc.setFont('playfair', 'italic');
      doc.setFontSize(13);
      // @ts-ignore textWithLink есть в рантайме jsPDF
      doc.textWithLink(`@${r.handle}`, M, y, { url: `https://instagram.com/${r.handle}` });
      setText(MUTED);
      doc.setFont('inter', 'normal');
      doc.setFontSize(9.5);
      const note = doc.splitTextToSize(r.note, CW - 160) as string[];
      doc.text(note, M + 160, y);
      y += Math.max(20, note.length * 12) + 8;
    }
    y += 6;
  }

  footer();
  return doc.output('blob');
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}


