package com.campus.system.repository;
import com.campus.system.model.Contest; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface ContestRepository extends JpaRepository<Contest,Long>{ List<Contest> findAllByOrderByStartTimeAsc(); }
