export const RESOURCE_CATEGORIES = {
  EQUIPMENT: 'PHYSICAL_RESOURCE',
  SPACES: 'SPACE'
}

export const EQUIPMENT_TYPES = ['Smart Board', 'PCs and Monitors', 'Projector', 'Audio System']
export const SPACE_TYPES = ['PC Lab', 'Lecture Hall', 'Auditorium']
export const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE', 'MAINTENANCE']
export const EQUIPMENT_STOCK_TYPES = ['STANDARD', 'SPARE']

export const SPACE_LOCATIONS = [
  'Main Building - A405',
  'Main Building - A403',
  'Main Building - A404',
  'New Building - F1304',
  'New Building - G605',
  'New Building - F303',
  'New Building - G606',
  'Main Building - B405',
  'Main Building - B303',
  'Main Building Auditorium',
  'New Building - G1303',
  'New Building - F1303',
]

export const LOGISTIC_ROOM_LOCATION = 'Logistic Room - Main Building 3rd Floor'

export function getResourceCategory(type, category) {
  if (category === RESOURCE_CATEGORIES.EQUIPMENT || category === RESOURCE_CATEGORIES.SPACES) {
    return category
  }
  if (EQUIPMENT_TYPES.includes(type)) return RESOURCE_CATEGORIES.EQUIPMENT
  if (SPACE_TYPES.includes(type)) return RESOURCE_CATEGORIES.SPACES
  return RESOURCE_CATEGORIES.SPACES // Default to spaces
}
