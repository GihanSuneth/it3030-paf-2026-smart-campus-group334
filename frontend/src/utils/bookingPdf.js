import { formatDate, formatDateTime } from './formatters'

function escapePdfText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function getExpectedAttendance(booking) {
  return booking.expectedAttendance ?? booking.expectedAttendees ?? '-'
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

function buildPdfCommands(booking, resourceName) {
  const bookingId = booking.bookingCode || booking.id
  const expectedAttendance = getExpectedAttendance(booking)
  const generatedAt = formatDateTime(new Date().toISOString())

  return [
    '0.11 0.16 0.23 rg',
    drawFilledBox(36, 744, 523, 62, 0.93, 0.95, 1),
    drawMutedText('v2.0 Smart Campus', 52, 792, 10),
    drawText('Nexora Workspace.', 52, 770, 22),
    drawMutedText('Smart Campus booking confirmation and reservation summary', 52, 749, 10),
    drawFilledBox(420, 756, 123, 32, 0.31, 0.27, 0.9),
    '1 1 1 rg',
    drawText(bookingId, 444, 768, 14),
    '0.11 0.16 0.23 rg',

    drawBox(36, 586, 252, 138),
    drawText('Booking Details', 52, 701, 14),
    drawMutedText(`Booking ID`, 52, 679),
    drawText(bookingId, 52, 664, 12),
    drawMutedText('Booking Date', 52, 642),
    drawText(formatDate(booking.date), 52, 627, 12),
    drawMutedText('Time Window', 52, 605),
    drawText(`${booking.startTime} - ${booking.endTime}`, 52, 590, 12),

    drawBox(307, 586, 252, 138),
    drawText('Requester Details', 323, 701, 14),
    drawMutedText('Booked By', 323, 679),
    drawText(booking.userName || '-', 323, 664, 12),
    drawMutedText('Status', 323, 642),
    drawText(booking.status || '-', 323, 627, 12),
    drawMutedText('Expected Attendees', 323, 605),
    drawText(String(expectedAttendance), 323, 590, 12),

    drawBox(36, 430, 523, 130),
    drawText('Resource Summary', 52, 537, 14),
    drawMutedText('Resource', 52, 515),
    drawText(resourceName || '-', 52, 500, 12),
    drawMutedText('Resource Code', 52, 478),
    drawText(booking.resourceCode || '-', 52, 463, 12),
    drawMutedText('Resource Type', 300, 515),
    drawText(booking.resourceType || '-', 300, 500, 12),
    drawMutedText('Review Comment', 300, 478),
    drawText(booking.reviewComment || 'Pending admin review', 300, 463, 12),

    drawBox(36, 250, 523, 150),
    drawText('Purpose of Booking', 52, 377, 14),
    drawText(booking.purpose || '-', 52, 352, 12),

    drawMutedText(`Generated on ${generatedAt}`, 52, 220, 10),
    drawMutedText('This PDF can be used as a booking reference during approval and follow-up.', 52, 202, 10),
  ].join('\n')
}

export function downloadBookingPdf(booking, resourceName) {
  const content = buildPdfCommands(booking, resourceName)

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
  link.download = `${booking.bookingCode || booking.id}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
