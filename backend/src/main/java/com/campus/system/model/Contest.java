package com.campus.system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="contests")
public class Contest {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String title;
 @Column(nullable=false) private String subject;
 @Column(length=2000) private String description;
 @Column(name="difficulty_level") private String level="Intermediate";
 private String status="UPCOMING";
 private Integer durationMinutes=60;
 private Integer maxScore=100;
 private String createdBy;
 private LocalDateTime startTime;
 private LocalDateTime endTime;
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public String getSubject(){return subject;} public void setSubject(String v){subject=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public String getLevel(){return level;} public void setLevel(String v){level=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public Integer getDurationMinutes(){return durationMinutes;} public void setDurationMinutes(Integer v){durationMinutes=v;}
 public Integer getMaxScore(){return maxScore;} public void setMaxScore(Integer v){maxScore=v;}
 public String getCreatedBy(){return createdBy;} public void setCreatedBy(String v){createdBy=v;}
 public LocalDateTime getStartTime(){return startTime;} public void setStartTime(LocalDateTime v){startTime=v;}
 public LocalDateTime getEndTime(){return endTime;} public void setEndTime(LocalDateTime v){endTime=v;}
}
