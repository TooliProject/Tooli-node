// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {MockListRepositoryService} from "../app/service/mock/mock-list-repository.service";
import {HttpListRepositoryService} from "../app/service/live/http-list-repository.service";

export const environment = {
  production: true,
  api_url: 'http://localhost:3000/api/v1/',
  listRepositoryServiceType: HttpListRepositoryService,
  loginUrl: '/api/v1/sso/google/login?state=/lists',
  path: '/'
};
