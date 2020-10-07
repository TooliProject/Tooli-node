import { Task } from 'src/app/entity/Task';

export interface TaskRepositoryService {
  findByListId(id: number): Promise<Task[]>
}
