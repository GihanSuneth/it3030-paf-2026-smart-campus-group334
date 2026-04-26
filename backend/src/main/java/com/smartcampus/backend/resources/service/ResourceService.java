package com.smartcampus.backend.resources.service;

import com.smartcampus.backend.resources.model.Resource;
import com.smartcampus.backend.resources.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.List;

@Service// The ResourceService class is responsible for managing resources in the smart campus system. It provides methods to create, retrieve, update, and delete resources, as well as to enrich resource data with default values and generate unique identifiers. The service interacts with the ResourceRepository to perform database operations and contains business logic to ensure that resources are properly categorized, assigned, and maintained based on their type and status.
@RequiredArgsConstructor
public class ResourceService {
    private static final String LOGISTIC_ROOM = "Logistic Room - Main Building 3rd Floor";

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {// The getAllResources method retrieves a list of all resources available in the smart campus system. It interacts with the ResourceRepository to fetch all Resource entities from the MongoDB database and returns them as a list. This method is typically used to display all resources to users or administrators within the application.
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
        if (resourceDetails.getTotalPcs() != null) {
            resource.setTotalPcs(resourceDetails.getTotalPcs());
        }
        if (resourceDetails.getWorkingPcs() != null) {
            resource.setWorkingPcs(resourceDetails.getWorkingPcs());
        }
        if (resourceDetails.getSmartBoardCount() != null) {
            resource.setSmartBoardCount(resourceDetails.getSmartBoardCount());
        }
        if (resourceDetails.getWorkingSmartBoards() != null) {
            resource.setWorkingSmartBoards(resourceDetails.getWorkingSmartBoards());
        }
        if (resourceDetails.getProjectorCount() != null) {
            resource.setProjectorCount(resourceDetails.getProjectorCount());
        }
        if (resourceDetails.getWorkingProjectors() != null) {
            resource.setWorkingProjectors(resourceDetails.getWorkingProjectors());
        }
        if (resourceDetails.getScreenCount() != null) {
            resource.setScreenCount(resourceDetails.getScreenCount());
        }
        if (resourceDetails.getWorkingScreens() != null) {
            resource.setWorkingScreens(resourceDetails.getWorkingScreens());
        }
        if (resourceDetails.getSoundSystemCount() != null) {
            resource.setSoundSystemCount(resourceDetails.getSoundSystemCount());
        }
        if (resourceDetails.getWorkingSoundSystems() != null) {
            resource.setWorkingSoundSystems(resourceDetails.getWorkingSoundSystems());
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
            resource.setTotalPcs(null);
            resource.setWorkingPcs(null);
            resource.setSmartBoardCount(null);
            resource.setWorkingSmartBoards(null);
            resource.setProjectorCount(null);
            resource.setWorkingProjectors(null);
            resource.setScreenCount(null);
            resource.setWorkingScreens(null);
            resource.setSoundSystemCount(null);
            resource.setWorkingSoundSystems(null);

            if (!hasText(resource.getAssetId())) {
                resource.setAssetId(generateEquipmentId(resource.getType()));
            }

            if (!hasText(resource.getCode())) {
                resource.setCode(resource.getAssetId());
            }

            if (!hasText(resource.getStatus())) {
                resource.setStatus("WORKING");
            }
        } else {
            resource.setAssetId(null);
            resource.setStockType(null);
            resource.setAvailable(resource.getAvailable() == null ? true : resource.getAvailable());
            resource.setAssignedTo(null);
            resource.setServiceOrder(null);

            if (!hasText(resource.getCode()) && hasText(resource.getLocation())) {
                resource.setCode(generateSpaceCode(resource.getLocation()));
            }

            if (!hasText(resource.getStatus())) {
                resource.setStatus("AVAILABLE");
            }

            normalizeSpaceMetrics(resource);
        }

        if (resource.getAvailable() == null) {
            resource.setAvailable(isAvailableStatus(resource));
        }
        if (!isAvailableStatus(resource)) {
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

    private boolean isAvailableStatus(Resource resource) {
        if ("PHYSICAL_RESOURCE".equalsIgnoreCase(resource.getCategory())) {
            return "WORKING".equalsIgnoreCase(resource.getStatus());
        }
        return "AVAILABLE".equalsIgnoreCase(resource.getStatus());
    }

    private void normalizeSpaceMetrics(Resource resource) {
        resource.setCapacity(normalizeNumber(resource.getCapacity()));
        resource.setTotalPcs(normalizeNumber(resource.getTotalPcs()));
        resource.setSmartBoardCount(normalizeNumber(resource.getSmartBoardCount()));
        resource.setProjectorCount(normalizeNumber(resource.getProjectorCount()));
        resource.setScreenCount(normalizeNumber(resource.getScreenCount()));
        resource.setSoundSystemCount(normalizeNumber(resource.getSoundSystemCount()));

        resource.setWorkingPcs(clampWorking(resource.getWorkingPcs(), resource.getTotalPcs()));
        resource.setWorkingSmartBoards(clampWorking(resource.getWorkingSmartBoards(), resource.getSmartBoardCount()));
        resource.setWorkingProjectors(clampWorking(resource.getWorkingProjectors(), resource.getProjectorCount()));
        resource.setWorkingScreens(clampWorking(resource.getWorkingScreens(), resource.getScreenCount()));
        resource.setWorkingSoundSystems(clampWorking(resource.getWorkingSoundSystems(), resource.getSoundSystemCount()));
    }

    private Integer normalizeNumber(Integer value) {
        if (value == null || value < 0) {
            return 0;
        }
        return value;
    }

    private Integer clampWorking(Integer working, Integer total) {
        int safeTotal = normalizeNumber(total);
        int safeWorking = normalizeNumber(working);
        return Math.min(safeWorking, safeTotal);
    }
}
