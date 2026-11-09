package com.campus.system.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="submissions")
public class Submission {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Contest contest;
 @Column(nullable=false) private String username;
 @Column(length=20000, nullable=false) private String sourceCode;
 private String language="java"; private Integer score=0; private String status="PENDING";
 @Column(length=2000) private String feedback;
 private LocalDateTime submittedAt=LocalDateTime.now();
 public Long getId(){return id;} public Contest getContest(){return contest;} public void setContest(Contest v){contest=v;}
 public String getUsername(){return username;} public void setUsername(String v){username=v;}
 public String getSourceCode(){return sourceCode;} public void setSourceCode(String v){sourceCode=v;}
 public String getLanguage(){return language;} public void setLanguage(String v){language=v;}
 public Integer getScore(){return score;} public void setScore(Integer v){score=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getFeedback(){return feedback;} public void setFeedback(String v){feedback=v;}
 public LocalDateTime getSubmittedAt(){return submittedAt;}
}
