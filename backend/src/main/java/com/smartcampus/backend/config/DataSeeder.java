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

            seedResources();

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
                buildPcLab("PC Lab A405", "LAB-A405", "Main Building - A405", 60, 55, 1, 1, 1),
                buildPcLab("PC Lab A403", "LAB-A403", "Main Building - A403", 48, 45, 1, 1, 0),
                buildPcLab("PC Lab A404", "LAB-A404", "Main Building - A404", 52, 48, 1, 1, 0),
                buildPcLab("PC Lab F1304", "LAB-F1304", "New Building - F1304", 55, 53, 1, 0, 1),
                buildPcLab("PC Lab G605", "LAB-G605", "New Building - G605", 45, 41, 0, 1, 0),

                buildLectureHall("Lecture Hall F303", "LH-F303", "New Building - F303", 120, 1, 1, 1),
                buildLectureHall("Lecture Hall G606", "LH-G606", "New Building - G606", 100, 1, 1, 1),
                buildLectureHall("Lecture Hall B405", "LH-B405", "Main Building - B405", 110, 1, 1, 1),
                buildLectureHall("Lecture Hall B303", "LH-B303", "Main Building - B303", 90, 1, 1, 0),

                buildAuditorium("Main Building Auditorium", "AUD-MAIN", "Main Building Auditorium", 350, 1, 2),
                buildAuditorium("Colosium 1", "AUD-G1303", "New Building - G1303", 280, 1, 1),
                buildAuditorium("Colosium 2", "AUD-F1303", "New Building - F1303", 260, 1, 1),

                buildPhysical("SB-0001", "Smart Board A405", "PHY-SB-A405", "Smart Board", "Main Building - A405", "PC Lab A405", 1, "STANDARD"),
                buildPhysical("PCM-0001", "PC and Monitor Set A405", "PHY-PCM-A405", "PCs and Monitors", "Main Building - A405", "PC Lab A405", 2, "STANDARD"),
                buildPhysical("PRJ-0001", "Projector F303", "PHY-PRJ-F303", "Projector", "New Building - F303", "Lecture Hall F303", 1, "STANDARD"),
                buildPhysical("AUD-0001", "Audio System Main Auditorium", "PHY-AUD-MAIN", "Audio System", "Main Building Auditorium", "Main Building Auditorium", 1, "STANDARD"),
                buildPhysical("SB-0002", "Spare Smart Board", "PHY-SB-LOG-01", "Smart Board", "Logistic Room - Main Building 3rd Floor", "Storage", 3, "SPARE"),
                buildPhysical("PCM-0002", "Spare PC and Monitor Set", "PHY-PCM-LOG-01", "PCs and Monitors", "Logistic Room - Main Building 3rd Floor", "Storage", 4, "SPARE"),
                buildPhysical("PRJ-0002", "Portable Projector", "PHY-PRJ-LOG-01", "Projector", "Logistic Room - Main Building 3rd Floor", "Storage", 2, "SPARE"),
                buildPhysical("AUD-0002", "Portable Audio System", "PHY-AUD-LOG-01", "Audio System", "Logistic Room - Main Building 3rd Floor", "Storage", 5, "SPARE")
        );

        List<Resource> existingResources = resourceRepository.findAll();
        for (Resource resource : resources) {
            Resource existing = existingResources.stream()
                    .filter(saved -> saved.getCode() != null && saved.getCode().equalsIgnoreCase(resource.getCode()))
                    .findFirst()
                    .orElse(null);

            if (existing != null) {
                resource.setId(existing.getId());
            }

            resourceRepository.save(resource);
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

    private Resource buildPcLab(String name, String code, String location, int totalPcs, int workingPcs, int smartBoards, int projectors, int soundSystems) {
        return Resource.builder()
                .name(name)
                .code(code)
                .type("PC Lab")
                .category("SPACE")
                .location(location)
                .capacity(totalPcs)
                .status("AVAILABLE")
                .available(true)
                .description("Computer lab with tracked PC readiness and installed teaching equipment.")
                .amenities(List.of("PCs and Monitors", "Smart Board", "Projector", "Audio System"))
                .totalPcs(totalPcs)
                .workingPcs(workingPcs)
                .smartBoardCount(smartBoards)
                .workingSmartBoards(smartBoards)
                .projectorCount(projectors)
                .workingProjectors(projectors)
                .screenCount(0)
                .workingScreens(0)
                .soundSystemCount(soundSystems)
                .workingSoundSystems(soundSystems)
                .build();
    }

    private Resource buildLectureHall(String name, String code, String location, int capacity, int projectors, int screens, int soundSystems) {
        return Resource.builder()
                .name(name)
                .code(code)
                .type("Lecture Hall")
                .category("SPACE")
                .location(location)
                .capacity(capacity)
                .status("AVAILABLE")
                .available(true)
                .description("Lecture hall with tracked seating, projection, screens, and audio support.")
                .amenities(List.of("Projector", "Screen", "Audio System"))
                .totalPcs(0)
                .workingPcs(0)
                .smartBoardCount(0)
                .workingSmartBoards(0)
                .projectorCount(projectors)
                .workingProjectors(projectors)
                .screenCount(screens)
                .workingScreens(screens)
                .soundSystemCount(soundSystems)
                .workingSoundSystems(soundSystems)
                .build();
    }

    private Resource buildAuditorium(String name, String code, String location, int capacity, int projectors, int soundSystems) {
        return Resource.builder()
                .name(name)
                .code(code)
                .type("Auditorium")
                .category("SPACE")
                .location(location)
                .capacity(capacity)
                .status("AVAILABLE")
                .available(true)
                .description("Large event venue with tracked capacity and presentation equipment.")
                .amenities(List.of("Projector", "Audio System"))
                .totalPcs(0)
                .workingPcs(0)
                .smartBoardCount(0)
                .workingSmartBoards(0)
                .projectorCount(projectors)
                .workingProjectors(projectors)
                .screenCount(0)
                .workingScreens(0)
                .soundSystemCount(soundSystems)
                .workingSoundSystems(soundSystems)
                .build();
    }

    private Resource buildPhysical(String assetId, String name, String code, String type, String location, String assignedTo, int serviceOrder, String stockType) {
        return Resource.builder()
                .assetId(assetId)
                .name(name)
                .code(code)
                .type(type)
                .category("PHYSICAL_RESOURCE")
                .stockType(stockType)
                .location(location)
                .capacity(0)
                .status("WORKING")
                .available(true)
                .assignedTo(assignedTo)
                .serviceOrder(serviceOrder)
                .description("Tracked physical equipment with generated asset ID and service order.")
                .totalPcs(null)
                .workingPcs(null)
                .smartBoardCount(null)
                .workingSmartBoards(null)
                .projectorCount(null)
                .workingProjectors(null)
                .screenCount(null)
                .workingScreens(null)
                .soundSystemCount(null)
                .workingSoundSystems(null)
                .build();
    }

    private Ticket buildTicket(String title, String description, String category, String priority, String status, User user, User technician, String location) {
        LocalDateTime createdAt = LocalDateTime.now().minusDays(2);
        return Ticket.builder()
                .ticketCode(generateSeedTicketCode())
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

    private String generateSeedTicketCode() {
        long next = ticketRepository.count() + 16001;
        return "TKT" + next;
    }
}
