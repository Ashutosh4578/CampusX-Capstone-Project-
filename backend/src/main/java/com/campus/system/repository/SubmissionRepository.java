package com.campus.system.repository;
import com.campus.system.model.Submission; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface SubmissionRepository extends JpaRepository<Submission,Long>{ List<Submission> findByUsernameOrderBySubmittedAtDesc(String username); List<Submission> findByContestIdOrderByScoreDescSubmittedAtAsc(Long contestId); long countByUsername(String username); }
