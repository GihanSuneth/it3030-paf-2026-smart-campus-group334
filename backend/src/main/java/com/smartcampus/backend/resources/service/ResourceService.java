package com.smartcampus.backend.resources.service;

import com.smartcampus.backend.resources.model.Resource;
import com.smartcampus.backend.resources.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {
    private static final String LOGISTIC_ROOM = "Logistic Room - Main Building 3rd Floor";

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource createResource(Resource resource) {
        enrichResource(resource, null);
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resourceDetails) {
        Resource resource = getResourceById(id);

        if (hasText(resourceDetails.getName())) {
            resource.setName(resourceDetails.getName());
        }
        if (hasText(resourceDetails.getType())) {
            resource.setType(resourceDetails.getType());
        }
        if (hasText(resourceDetails.getCategory())) {
            resource.setCategory(resourceDetails.getCategory());
        }
        if (hasText(resourceDetails.getStockType())) {
            resource.setStockType(resourceDetails.getStockType());
        }
        if (hasText(resourceDetails.getLocation())) {
            resource.setLocation(resourceDetails.getLocation());
        }
        if (resourceDetails.getCapacity() > 0 || "PHYSICAL_RESOURCE".equalsIgnoreCase(resource.getCategory())) {
            resource.setCapacity(resourceDetails.getCapacity());
        }
        if (hasText(resourceDetails.getStatus())) {
            resource.setStatus(resourceDetails.getStatus());
        }
        if (resourceDetails.getAvailable() != null) {
            resource.setAvailable(resourceDetails.getAvailable());
        }
        if (resourceDetails.getServiceOrder() != null) {
            resource.setServiceOrder(resourceDetails.getServiceOrder());
        }
        if (hasText(resourceDetails.getAssignedTo())) {
            resource.setAssignedTo(resourceDetails.getAssignedTo());
        }
        if (hasText(resourceDetails.getDescription())) {
            resource.setDescription(resourceDetails.getDescription());
        }
        if (resourceDetails.getAmenities() != null && !resourceDetails.getAmenities().isEmpty()) {
            resource.setAmenities(resourceDetails.getAmenities());
        }

        enrichResource(resource, id);
        return resourceRepository.save(resource);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    private void enrichResource(Resource resource, String existingId) {
        if (!hasText(resource.getCategory())) {
            resource.setCategory(isPhysicalResource(resource.getType()) ? "PHYSICAL_RESOURCE" : "SPACE");
        }

        if ("PHYSICAL_RESOURCE".equalsIgnoreCase(resource.getCategory())) {
            if (!hasText(resource.getStockType())) {
                resource.setStockType("STANDARD");
            }

            if ("SPARE".equalsIgnoreCase(resource.getStockType())) {
                resource.setLocation(LOGISTIC_ROOM);
                if (!hasText(resource.getAssignedTo())) {
                    resource.setAssignedTo("Storage");
                }
            } else if (!hasText(resource.getAssignedTo())) {
                resource.setAssignedTo(resource.getLocation());
            }

            resource.setCapacity(0);

            if (!hasText(resource.getAssetId())) {
                resource.setAssetId(generateEquipmentId(resource.getType()));
            }

            if (!hasText(resource.getCode())) {
                resource.setCode(resource.getAssetId());
            }
        } else {
            resource.setAssetId(null);
            resource.setStockType(null);
            resource.setAvailable(resource.getAvailable() == null ? true : resource.getAvailable());
            resource.setAssignedTo(null);

            if (!hasText(resource.getCode()) && hasText(resource.getLocation())) {
                resource.setCode(generateSpaceCode(resource.getLocation()));
            }
        }

        if (!hasText(resource.getStatus())) {
            resource.setStatus("ACTIVE");
        }
        if (resource.getAvailable() == null) {
            resource.setAvailable("ACTIVE".equalsIgnoreCase(resource.getStatus()));
        }
        if (!"ACTIVE".equalsIgnoreCase(resource.getStatus())) {
            resource.setAvailable(false);
        }

        if (existingId != null) {
            resource.setId(existingId);
        }
    }

    private boolean isPhysicalResource(String type) {
        if (!hasText(type)) {
            return false;
        }
        String normalized = type.toLowerCase(Locale.ROOT);
        return normalized.contains("smart board")
                || normalized.contains("projector")
                || normalized.contains("audio system")
                || normalized.contains("pcs and monitors");
    }

    private String generateEquipmentId(String type) {
        String prefix = switch (type) {
            case "Smart Board" -> "SB";
            case "PCs and Monitors" -> "PCM";
            case "Projector" -> "PRJ";
            case "Audio System" -> "AUD";
            default -> "EQ";
        };

        long next = resourceRepository.findAll().stream()
                .map(Resource::getAssetId)
                .filter(this::hasText)
                .filter(assetId -> assetId.startsWith(prefix + "-"))
                .count() + 1;

        return "%s-%04d".formatted(prefix, next);
    }

    private String generateSpaceCode(String location) {
        String[] parts = location.split(" - ");
        return parts[parts.length - 1].replaceAll("\\s+", "").toUpperCase(Locale.ROOT);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
