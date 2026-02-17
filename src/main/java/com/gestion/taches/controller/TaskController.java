package com.gestion.taches.controller;

import com.gestion.taches.models.Task;
import com.gestion.taches.services.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    private final TaskService taskService;
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    @GetMapping()
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping()
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }
    @PutMapping("/{id}")
    public Task updateTask(@RequestBody Task task) {
        return taskService.updateTask(task);
    }
    @DeleteMapping("{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
