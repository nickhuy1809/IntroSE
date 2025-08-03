import { useLocalStorage } from './useLocalStorage';

export function usePomodoroTasks() {
  const [tasks, setTasks] = useLocalStorage('pomodoro_tasks', []);
  const [currentTaskIndex, setCurrentTaskIndex] = useLocalStorage('pomodoro_current_task_index', -1);

  // Add a new task to the queue
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Add multiple tasks at once
  const addTasks = (newTasks) => {
    setTasks([...tasks, ...newTasks]);
  };

  // Replace all tasks with a new set
  const setTaskList = (newTasks) => {
    setTasks(newTasks);
    if (currentTaskIndex >= newTasks.length) {
      setCurrentTaskIndex(-1);
    }
  };

  // Get the current task
  const getCurrentTask = () => {
    if (currentTaskIndex >= 0 && currentTaskIndex < tasks.length) {
      return tasks[currentTaskIndex];
    }
    return null;
  };

  // Mark the current task as complete and move to the next one
  const completeCurrentTask = () => {
    if (currentTaskIndex >= 0 && currentTaskIndex < tasks.length) {
      const newTasks = [...tasks];
      newTasks[currentTaskIndex] = {
        ...newTasks[currentTaskIndex],
        completed: true,
      };
      setTasks(newTasks);
      
      // Move to the next uncompleted task
      const nextIndex = newTasks.findIndex((task, index) => index > currentTaskIndex && !task.completed);
      setCurrentTaskIndex(nextIndex !== -1 ? nextIndex : -1);
    }
  };

  // Get all tasks
  const getAllTasks = () => tasks;

  // Get incomplete tasks
  const getIncompleteTasks = () => tasks.filter(task => !task.completed);

  // Set specific task as current
  const setCurrentTask = (index) => {
    if (index >= -1 && index < tasks.length) {
      setCurrentTaskIndex(index);
    }
  };

  // Reset all tasks completion status
  const resetTasks = () => {
    const resetTaskList = tasks.map(task => ({
      ...task,
      completed: false
    }));
    setTasks(resetTaskList);
    setCurrentTaskIndex(resetTaskList.length > 0 ? 0 : -1);
  };

  // Remove a task by index
  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    
    // Adjust current task index if needed
    if (index === currentTaskIndex) {
      setCurrentTaskIndex(newTasks.length > 0 ? 0 : -1);
    } else if (index < currentTaskIndex && currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  return {
    tasks,
    currentTaskIndex,
    addTask,
    addTasks,
    setTaskList,
    getCurrentTask,
    completeCurrentTask,
    getAllTasks,
    getIncompleteTasks,
    setCurrentTask,
    resetTasks,
    removeTask
  };
}
