package com.gestion.taches.models;

import com.gestion.taches.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, max = 100, message = "Le titre doit contenir entre 3 et 100 caractères")
    @Column(nullable = false, length = 100)
    private String title;

    @NotBlank(message = "La description est obligatoire")
    @Size(min = 5, max = 500, message = "La description doit contenir entre 5 et 500 caractères")
    @Column(nullable = false, length = 500)
    private String description;

    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.EN_COURS;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "due_date")
    @Temporal(TemporalType.DATE)
    private Date dueDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Constructeur personnalisé sans id (pour la création)
    public Task(String title, String description, TaskStatus status, Date dueDate) {
        this.title = title;
        this.description = description;
        this.status = status != null ? status : TaskStatus.EN_COURS;
        this.dueDate = dueDate;
    }

    // Méthode utilitaire pour vérifier si la tâche est en retard
    public boolean isOverdue() {
        if (dueDate == null || status == TaskStatus.TERMINE) {
            return false;
        }
        return dueDate.before(new Date());
    }

    // Méthode pour marquer comme terminée
    public void markAsCompleted() {
        this.status = TaskStatus.TERMINE;
    }

    // Méthode pour suspendre
    public void suspend() {
        this.status = TaskStatus.SUSPENDU;
    }

    // Méthode pour reprendre
    public void resume() {
        this.status = TaskStatus.EN_COURS;
    }
}