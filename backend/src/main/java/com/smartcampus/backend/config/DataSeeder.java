package com.smartcampus.backend.config;

import com.smartcampus.backend.resources.model.Resource;
import com.smartcampus.backend.resources.repository.ResourceRepository;
import com.smartcampus.backend.tickets.model.Ticket;
import com.smartcampus.backend.tickets.repository.TicketRepository;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final TicketRepository ticketRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            if (userRepository.count() <= 3) {
                seedUsers();
            }

            if (resourceRepository.count() <= 4) {
                seedResources();
            }

            if (ticketRepository.count() == 0) {
                seedTickets();
            }
        };
    }

    private void seedUsers() {
        List<User> users = new ArrayList<>();

        users.add(buildUser("admin", "admin@campus.local", "admin", "ADMIN", "System Administration", "IT Services", null, null));

        users.add(buildUser("user", "user@campus.local", "user", "USER", "Academic Affairs", "Staff", null, null));
        users.add(buildUser("nirmala.perera", "nirmala.perera@campus.local", "staff1", "USER", "Computer Science", "Staff", null, null));
        users.add(buildUser("sahan.silva", "sahan.silva@campus.local", "staff2", "USER", "Information Systems", "Staff", null, null));
        users.add(buildUser("dilani.fernando", "dilani.fernando@campus.local", "staff3", "USER", "Business School", "Staff", null, null));
        users.add(buildUser("kasun.jayasinghe", "kasun.jayasinghe@campus.local", "staff4", "USER", "Engineering Faculty", "Staff", null, null));

        users.add(buildUser("amal.student", "amal.student@campus.local", "student1", "USER", "Computing", "Student", "IT2023001", "Y2S2"));
        users.add(buildUser("nethmi.student", "nethmi.student@campus.local", "student2", "USER", "Engineering", "Student", "EN2023007", "Y3S1"));
        users.add(buildUser("raveen.student", "raveen.student@campus.local", "student3", "USER", "Business Analytics", "Student", "BA2024012", "Y1S2"));

        users.add(buildUser("technician", "technician@campus.local", "technician", "TECHNICIAN", "IT Infrastructure", "Technical Services", null, null));
        users.add(buildUser("kavindu.tech", "kavindu.tech@campus.local", "tech2", "TECHNICIAN", "Audio Visual", "Technical Services", null, null));
        users.add(buildUser("hasini.tech", "hasini.tech@campus.local", "tech3", "TECHNICIAN", "Facilities Support", "Technical Services", null, null));
        users.add(buildUser("rashmi.tech", "rashmi.tech@campus.local", "tech4", "TECHNICIAN", "Device Maintenance", "Technical Services", null, null));

        for (User user : users) {
            userRepository.findByEmailIgnoreCase(user.getEmail())
                    .orElseGet(() -> userRepository.save(user));
        }
    }

    private void seedResources() {
        List<Resource> resources = List.of(
                buildSpace("PC Lab A405", "LAB-A405", "PC Lab", "SPACE", "Main Building - A405", 60, List.of("Smart Board", "Projector", "Audio System", "PCs and Monitors")),
                buildSpace("PC Lab A403", "LAB-A403", "PC Lab", "SPACE", "Main Building - A403", 48, List.of("Smart Board", "Projector", "PCs and Monitors")),
                buildSpace("PC Lab A404", "LAB-A404", "PC Lab", "SPACE", "Main Building - A404", 52, List.of("Smart Board", "Projector", "PCs and Monitors")),
                buildSpace("PC Lab F1304", "LAB-F1304", "PC Lab", "SPACE", "New Building - F1304", 55, List.of("Smart Board", "Audio System", "PCs and Monitors")),
                buildSpace("PC Lab G605", "LAB-G605", "PC Lab", "SPACE", "New Building - G605", 45, List.of("Projector", "PCs and Monitors")),

                buildSpace("Lecture Hall F303", "LH-F303", "Lecture Hall", "SPACE", "New Building - F303", 120, List.of("Smart Board", "Projector", "Audio System")),
                buildSpace("Lecture Hall G606", "LH-G606", "Lecture Hall", "SPACE", "New Building - G606", 100, List.of("Projector", "Audio System")),
                buildSpace("Lecture Hall B405", "LH-B405", "Lecture Hall", "SPACE", "Main Building - B405", 110, List.of("Smart Board", "Projector")),
                buildSpace("Lecture Hall B303", "LH-B303", "Lecture Hall", "SPACE", "Main Building - B303", 90, List.of("Projector")),

                buildSpace("Main Building Auditorium", "AUD-MAIN", "Auditorium", "SPACE", "Main Building Auditorium", 350, List.of("Smart Board", "Projector", "Audio System")),
                buildSpace("Colosium 1", "AUD-G1303", "Auditorium", "SPACE", "New Building - G1303", 280, List.of("Projector", "Audio System")),
                buildSpace("Colosium 2", "AUD-F1303", "Auditorium", "SPACE", "New Building - F1303", 260, List.of("Projector", "Audio System")),

                buildPhysical("SB-0001", "Smart Board A405", "PHY-SB-A405", "Smart Board", "PHYSICAL_RESOURCE", "Main Building - A405", "PC Lab A405", 1),
                buildPhysical("PCM-0001", "PC and Monitor Set A405", "PHY-PCM-A405", "PCs and Monitors", "PHYSICAL_RESOURCE", "Main Building - A405", "PC Lab A405", 2),
                buildPhysical("PRJ-0001", "Projector F303", "PHY-PRJ-F303", "Projector", "PHYSICAL_RESOURCE", "New Building - F303", "Lecture Hall F303", 1),
                buildPhysical("AUD-0001", "Audio System Main Auditorium", "PHY-AUD-MAIN", "Audio System", "PHYSICAL_RESOURCE", "Main Building Auditorium", "Main Building Auditorium", 1),
                buildPhysical("SB-0002", "Spare Smart Board", "PHY-SB-LOG-01", "Smart Board", "PHYSICAL_RESOURCE", "Logistic Room - Main Building 3rd Floor", "Storage", 3),
                buildPhysical("PCM-0002", "Spare PC and Monitor Set", "PHY-PCM-LOG-01", "PCs and Monitors", "PHYSICAL_RESOURCE", "Logistic Room - Main Building 3rd Floor", "Storage", 4),
                buildPhysical("PRJ-0002", "Portable Projector", "PHY-PRJ-LOG-01", "Projector", "PHYSICAL_RESOURCE", "Logistic Room - Main Building 3rd Floor", "Storage", 2),
                buildPhysical("AUD-0002", "Portable Audio System", "PHY-AUD-LOG-01", "Audio System", "PHYSICAL_RESOURCE", "Logistic Room - Main Building 3rd Floor", "Storage", 5)
        );

        List<Resource> existingResources = resourceRepository.findAll();
        for (Resource resource : resources) {
            boolean exists = existingResources.stream().anyMatch(existing -> existing.getCode().equalsIgnoreCase(resource.getCode()));
            if (!exists) {
                resourceRepository.save(resource);
            }
        }
    }

    private void seedTickets() {
        User defaultUser = userRepository.findByEmailIgnoreCase("user@campus.local")
                .orElse(null);
        User studentUser = userRepository.findByEmailIgnoreCase("amal.student@campus.local")
                .orElse(null);
        User firstTechnician = userRepository.findByEmailIgnoreCase("technician@campus.local")
                .orElse(null);
        User secondTechnician = userRepository.findByEmailIgnoreCase("kavindu.tech@campus.local")
                .orElse(null);

        if (defaultUser == null || studentUser == null || firstTechnician == null || secondTechnician == null) {
            return;
        }

        List<Ticket> tickets = List.of(
                buildTicket("Projector flickering in Lecture Hall F303", "The ceiling projector intermittently cuts out during lectures.", "TECHNICAL", "HIGH", "TECHNICIAN_ASSIGNED", defaultUser, firstTechnician, "New Building - F303"),
                buildTicket("Audio system not working in Main Auditorium", "No audio output from the main mixer during rehearsal.", "FACILITY", "URGENT", "UNDER_REVIEW", studentUser, null, "Main Building Auditorium"),
                buildTicket("PC Lab A404 monitor issue", "Several monitors in row 3 are not powering on.", "TECHNICAL", "MEDIUM", "RESOLVED", defaultUser, secondTechnician, "Main Building - A404"),
                buildTicket("Smart board alignment issue in B405", "Touch calibration is off by a few centimeters.", "TECHNICAL", "LOW", "CREATED", studentUser, null, "Main Building - B405")
        );

        for (Ticket ticket : tickets) {
            boolean exists = ticketRepository.findAll().stream().anyMatch(existing -> existing.getTitle().equalsIgnoreCase(ticket.getTitle()));
            if (!exists) {
                ticketRepository.save(ticket);
            }
        }
    }

    private User buildUser(String name, String email, String password, String role, String department, String faculty, String regNo, String academicYear) {
        return User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .department(department)
                .faculty(faculty)
                .regNo(regNo)
                .academicYear(academicYear)
                .purpose("Seeded development account")
                .isApproved(true)
                .build();
    }

    private Resource buildSpace(String name, String code, String type, String category, String location, int capacity, List<String> amenities) {
        return Resource.builder()
                .name(name)
                .code(code)
                .type(type)
                .category(category)
                .location(location)
                .capacity(capacity)
                .status("ACTIVE")
                .available(true)
                .description("Seeded " + type + " resource for booking flow validation.")
                .amenities(amenities)
                .build();
    }

    private Resource buildPhysical(String assetId, String name, String code, String type, String category, String location, String assignedTo, int serviceOrder) {
        return Resource.builder()
                .assetId(assetId)
                .name(name)
                .code(code)
                .type(type)
                .category(category)
                .location(location)
                .capacity(0)
                .status("ACTIVE")
                .available(true)
                .assignedTo(assignedTo)
                .serviceOrder(serviceOrder)
                .description("Tracked physical resource with generated asset ID.")
                .build();
    }

    private Ticket buildTicket(String title, String description, String category, String priority, String status, User user, User technician, String location) {
        LocalDateTime createdAt = LocalDateTime.now().minusDays(2);
        return Ticket.builder()
                .title(title)
                .description(description)
                .category(category)
                .priority(priority)
                .status(status)
                .userId(user.getId())
                .userName(user.getName())
                .technicianId(technician == null ? null : technician.getId())
                .technicianName(technician == null ? null : technician.getName())
                .location(location)
                .createdAt(createdAt)
                .updatedAt(createdAt.plusHours(5))
                .resolutionNotes("RESOLVED".equals(status) ? "Replaced faulty display cable and verified output." : null)
                .comments(new ArrayList<>())
                .build();
    }
}
