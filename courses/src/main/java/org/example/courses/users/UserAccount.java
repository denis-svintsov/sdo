package org.example.courses.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "users")
public class UserAccount {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "department_id")
    private String departmentId;

    @Column(name = "status")
    private String status;

    @Column(name = "specialization")
    private String specialization;
}
