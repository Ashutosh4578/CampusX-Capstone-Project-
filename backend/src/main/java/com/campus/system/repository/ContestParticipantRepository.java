package com.campus.system.repository;
import com.campus.system.model.ContestParticipant; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface ContestParticipantRepository extends JpaRepository<ContestParticipant,Long>{ boolean existsByContestIdAndUsername(Long contestId,String username); long countByContestId(Long contestId); List<ContestParticipant> findByUsername(String username); }
