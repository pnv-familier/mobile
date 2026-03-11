import { useState } from "react";
import { Alert } from "react-native";
import { taskService } from "../services/task.service";

export const useCompleteTask = (taskId: string, onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const completeTask = async () => {
    setIsLoading(true);
    try {
      // TODO: Backend dev - uncomment when API is ready
      // await taskService.completeTask(taskId);
      
      Alert.alert("Success", "Task completed!");
      onSuccess?.();
    } catch (error) {
      Alert.alert("Error", "Failed to complete task");
      console.error("Complete task error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { completeTask, isLoading };
};
