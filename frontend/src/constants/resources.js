export const RESOURCE_CATEGORIES = {
  EQUIPMENT: 'EQUIPMENT',
  SPACES: 'SPACES'
}

export const EQUIPMENT_TYPES = ['Audio System', 'Projector', 'Smart Board']
export const SPACE_TYPES = ['Innovation Space', 'Computer Lab', 'Lecture Hall', 'Auditorium']

export function getResourceCategory(type) {
  if (EQUIPMENT_TYPES.includes(type)) return RESOURCE_CATEGORIES.EQUIPMENT
  if (SPACE_TYPES.includes(type)) return RESOURCE_CATEGORIES.SPACES
  return RESOURCE_CATEGORIES.SPACES // Default to spaces
}
