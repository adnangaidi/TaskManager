package com.gestion.taches.services;

import com.gestion.taches.models.Task;
import com.gestion.taches.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
      public TaskService(TaskRepository taskRepository) {
          this.taskRepository = taskRepository;
      }
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    public Task updateTask(Task task) {

        return taskRepository.save(task);
    }
    public void deleteTask(Long id) {
          taskRepository.deleteById(id);
    }

}
