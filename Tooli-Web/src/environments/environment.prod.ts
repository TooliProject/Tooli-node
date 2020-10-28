import {MockListRepositoryService} from "../app/service/mock/mock-list-repository.service";
import {HttpListRepositoryService} from "../app/service/live/http-list-repository.service";
import {MockTaskRepositoryService} from "../app/service/mock/mock-task-repository.service";

export const environment = {
  production: true,
  api_url: 'https://server.rynkbit.com/apps/tooli/api/v1/',
  listRepositoryServiceType: HttpListRepositoryService,
  taskRepositoryServiceType: MockTaskRepositoryService,
  loginUrl: '/apps/tooli/api/v1/sso/google/login?state=/lists',
  path: '/apps/tooli/'
};
