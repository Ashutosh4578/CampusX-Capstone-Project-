package com.campus.system.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="contest_participants", uniqueConstraints=@UniqueConstraint(columnNames={"contest_id","username"}))
public class ContestParticipant {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Contest contest;
 @Column(nullable=false) private String username;
 private LocalDateTime joinedAt=LocalDateTime.now();
 public Long getId(){return id;} public Contest getContest(){return contest;} public void setContest(Contest v){contest=v;}
 public String getUsername(){return username;} public void setUsername(String v){username=v;} public LocalDateTime getJoinedAt(){return joinedAt;}
}
