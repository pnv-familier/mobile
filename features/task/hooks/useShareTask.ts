import { useState } from "react";
import { Alert } from "react-native";
import { taskService } from "../services/task.service";
import { TaskStatus } from "../types";

export const useShareTask = (taskId: string, onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const shareTask = async (postContent: string) => {
    setIsLoading(true);
    try {
      // TODO: Backend dev - uncomment when API is ready
      // await taskService.shareTask(taskId, postContent);
      
      Alert.alert("Success", "Post shared to Family Space!");
      onSuccess?.();
    } catch (error) {
      Alert.alert("Error", "Failed to share post");
      console.error("Share task error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { shareTask, isLoading };
};
