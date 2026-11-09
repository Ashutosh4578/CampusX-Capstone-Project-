
package com.campus.system.config;

import com.campus.system.model.Contest;
import com.campus.system.model.ContestParticipant;
import com.campus.system.model.Submission;
import com.campus.system.model.User;

import com.campus.system.repository.ContestRepository;
import com.campus.system.repository.ContestParticipantRepository;
import com.campus.system.repository.SubmissionRepository;
import com.campus.system.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DemoDataInitializer {

    @Bean
    CommandLineRunner seedCampusData(
            ContestRepository contestRepo,
            UserRepository userRepo,
            ContestParticipantRepository participantRepo,
            SubmissionRepository submissionRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // 1. Demo users
            addUser(userRepo, passwordEncoder, "admin", "Admin@123", "ADMIN");
            addUser(userRepo, passwordEncoder, "faculty1", "Faculty@123", "FACULTY");
            addUser(userRepo, passwordEncoder, "faculty2", "Faculty@123", "FACULTY");

            addUser(userRepo, passwordEncoder, "student1", "Student@123", "STUDENT");
            addUser(userRepo, passwordEncoder, "student2", "Student@123", "STUDENT");
            addUser(userRepo, passwordEncoder, "student3", "Student@123", "STUDENT");
            addUser(userRepo, passwordEncoder, "student4", "Student@123", "STUDENT");
            addUser(userRepo, passwordEncoder, "student5", "Student@123", "STUDENT");

            // 2. Five contests
            LocalDateTime now = LocalDateTime.now();

            addContest(contestRepo, "DSA Gauntlet", "DSA",
                    "Arrays, strings, trees and problem-solving fundamentals.",
                    "Intermediate", 90, now.minusMinutes(10));

            addContest(contestRepo, "Full Stack Sprint", "FSD",
                    "Build a clean interface and understand API integration.",
                    "Beginner", 60, now.plusDays(1));

            addContest(contestRepo, "Database Showdown", "DBMS",
                    "SQL queries, normalization and database transactions.",
                    "Intermediate", 75, now.plusDays(3));

            addContest(contestRepo, "Network Warriors", "CN",
                    "TCP/IP, DNS, routing and networking fundamentals.",
                    "Advanced", 90, now.plusDays(5));

            addContest(contestRepo, "Cloud Computing Arena", "CC",
                    "Cloud architecture, virtualization and deployment.",
                    "Intermediate", 60, now.plusDays(7));

            // 3. Seed student progress
            Contest dsa = getContest(contestRepo, "DSA Gauntlet");
            Contest fsd = getContest(contestRepo, "Full Stack Sprint");
            Contest dbms = getContest(contestRepo, "Database Showdown");
            Contest cn = getContest(contestRepo, "Network Warriors");
            Contest cc = getContest(contestRepo, "Cloud Computing Arena");

            seedStudent(
                    "student1",
                    List.of(dsa, fsd, dbms, cn, cc),
                    new int[]{95, 88, 92, 84, 96},
                    participantRepo, submissionRepo
            );

            seedStudent(
                    "student2",
                    List.of(dsa, fsd, dbms, cn, cc),
                    new int[]{82, 91, 78, 89, 85},
                    participantRepo, submissionRepo
            );

            seedStudent(
                    "student3",
                    List.of(dsa, fsd, dbms, cn, cc),
                    new int[]{76, 72, 85, 80, 74},
                    participantRepo, submissionRepo
            );

            seedStudent(
                    "student4",
                    List.of(dsa, fsd, dbms, cn, cc),
                    new int[]{68, 81, 70, 75, 79},
                    participantRepo, submissionRepo
            );

            seedStudent(
                    "student5",
                    List.of(dsa, fsd, dbms, cn, cc),
                    new int[]{55, 65, 62, 71, 60},
                    participantRepo, submissionRepo
            );
        };
    }

    private void addUser(
            UserRepository repo,
            PasswordEncoder encoder,
            String username,
            String password,
            String role
    ) {
        if (repo.findByUsername(username).isPresent()) {
            return;
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(password));
        user.setRole(role);

        repo.save(user);
    }

    private void addContest(
            ContestRepository repo,
            String title,
            String subject,
            String description,
            String level,
            int duration,
            LocalDateTime start
    ) {
        boolean exists = repo.findAll().stream()
                .anyMatch(c -> c.getTitle().equalsIgnoreCase(title));

        if (exists) return;

        Contest contest = new Contest();
        contest.setTitle(title);
        contest.setSubject(subject);
        contest.setDescription(description);
        contest.setLevel(level);
        contest.setDurationMinutes(duration);
        contest.setMaxScore(100);
        contest.setCreatedBy("campusx-demo");
        contest.setStartTime(start);
        contest.setStatus(
                start.isAfter(LocalDateTime.now()) ? "UPCOMING" : "LIVE"
        );

        repo.save(contest);
    }

    private Contest getContest(ContestRepository repo, String title) {
        return repo.findAll().stream()
                .filter(c -> c.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Demo contest not found: " + title
                ));
    }

    private void seedStudent(
            String username,
            List<Contest> contests,
            int[] scores,
            ContestParticipantRepository participantRepo,
            SubmissionRepository submissionRepo
    ) {
        // Avoid duplicate demo submissions on subsequent restarts.
        if (submissionRepo.countByUsername(username) > 0) {
            return;
        }

        for (int i = 0; i < contests.size(); i++) {
            Contest contest = contests.get(i);

            // Add contest participation
            if (!participantRepo.existsByContestIdAndUsername(
                    contest.getId(), username)) {

                ContestParticipant participant = new ContestParticipant();
                participant.setContest(contest);
                participant.setUsername(username);
                participantRepo.save(participant);
            }

            // Add evaluated demo submission
            Submission submission = new Submission();
            submission.setContest(contest);
            submission.setUsername(username);
            submission.setLanguage("java");
            submission.setScore(scores[i]);
            submission.setStatus("EVALUATED");
            submission.setSourceCode(
                    "public class DemoSolution {\n" +
                    "    public static void main(String[] args) {\n" +
                    "        int score = " + scores[i] + ";\n" +
                    "        System.out.println(score);\n" +
                    "    }\n" +
                    "}"
            );
            submission.setFeedback(
                    "Demo submission: sample evaluated progress data."
            );

            submissionRepo.save(submission);
        }
    }
}
