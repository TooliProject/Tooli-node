import {MockListRepositoryService} from "../app/service/mock/mock-list-repository.service";
import {HttpListRepositoryService} from "../app/service/live/http-list-repository.service";

export const environment = {
  production: true,
  api_url: 'https://tooli.at/api/v1/',
  listRepositoryServiceType: HttpListRepositoryService,
  loginUrl: '/api/v1/sso/google/login?state=/lists'
};
