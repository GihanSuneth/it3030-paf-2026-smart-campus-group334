import { formatDateTime } from './formatters'

function escapePdfText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function drawText(text, x, y, size = 12) {
  return `BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`
}

function drawMutedText(text, x, y, size = 10) {
  return `0.43 0.47 0.55 rg\n${drawText(text, x, y, size)}\n0.11 0.16 0.23 rg`
}

function drawFilledBox(x, y, width, height, r, g, b) {
  return `${r} ${g} ${b} rg\n${x} ${y} ${width} ${height} re f\n0.11 0.16 0.23 rg`
}

function drawBox(x, y, width, height) {
  return `0.86 0.89 0.94 RG\n${x} ${y} ${width} ${height} re S\n0.11 0.16 0.23 RG`
}

function buildBarLines(title, items, startY) {
  const lines = [drawText(title, 52, startY, 14)]
  let y = startY - 24

  items.forEach((item) => {
    lines.push(drawMutedText(item.label, 52, y + 12, 10))
    lines.push(drawBox(180, y + 2, 250, 10))
    lines.push(drawFilledBox(180, y + 2, Math.max(6, (item.percent / 100) * 250), 10, 0.31, 0.27, 0.9))
    lines.push(drawText(`${item.value}`, 445, y + 6, 10))
    y -= 28
  })

  return lines
}

function buildPdfCommands(summary) {
  const generatedAt = formatDateTime(new Date().toISOString())

  const commands = [
    '0.11 0.16 0.23 rg',
    drawFilledBox(36, 744, 523, 62, 0.93, 0.95, 1),
    drawMutedText('v2.0 Smart Campus', 52, 792, 10),
    drawText('Nexora Workspace.', 52, 770, 22),
    drawMutedText('Admin resource and equipment usage summary', 52, 749, 10),

    drawBox(36, 610, 252, 108),
    drawText('Space Usage', 52, 694, 14),
    drawMutedText('Tracked spaces', 52, 672),
    drawText(String(summary.space.total), 52, 657, 18),
    drawMutedText('Currently booked', 52, 633),
    drawText(String(summary.space.booked), 52, 618, 18),

    drawBox(307, 610, 252, 108),
    drawText('Equipment Usage', 323, 694, 14),
    drawMutedText('Tracked equipment', 323, 672),
    drawText(String(summary.equipment.total), 323, 657, 18),
    drawMutedText('Working / available', 323, 633),
    drawText(String(summary.equipment.working), 323, 618, 18),

    ...buildBarLines('Resource Type Mix', summary.typeBreakdown, 560),
    ...buildBarLines('Equipment Health', summary.equipmentBreakdown, 362),

    drawMutedText(`Generated on ${generatedAt}`, 52, 90, 10),
    drawMutedText('This report summarizes live resource and equipment usage from the admin dashboard.', 52, 72, 10),
  ]

  return commands.join('\n')
}

export function downloadResourceUsagePdf(summary) {
  const content = buildPdfCommands(summary)

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]

  for (const object of objects) {
    offsets.push(pdf.length)
    pdf += `${object}\n`
  }

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  const blob = new Blob([pdf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'resource-usage-summary.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
