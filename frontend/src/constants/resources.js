export const RESOURCE_CATEGORIES = {
  EQUIPMENT: 'PHYSICAL_RESOURCE',
  SPACES: 'SPACE'
}

export const EQUIPMENT_TYPES = ['Audio System', 'Projector', 'Smart Board']
export const SPACE_TYPES = ['Innovation Space', 'Computer Lab', 'Lecture Hall', 'Auditorium']

export function getResourceCategory(type, category) {
  if (category === RESOURCE_CATEGORIES.EQUIPMENT || category === RESOURCE_CATEGORIES.SPACES) {
    return category
  }
  if (EQUIPMENT_TYPES.includes(type)) return RESOURCE_CATEGORIES.EQUIPMENT
  if (SPACE_TYPES.includes(type)) return RESOURCE_CATEGORIES.SPACES
  return RESOURCE_CATEGORIES.SPACES // Default to spaces
}
