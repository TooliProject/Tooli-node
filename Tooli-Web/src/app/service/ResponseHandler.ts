export class ResponseHandler {
  handleDefaultResponse(response: any, resolve: any, reject: any, resolveParameter?: any) {
    if (response && response.error) {
      if (response.error.message) {
        reject(response.error.message);
      } else {
        reject(response.error);
      }
    } else {
      if (resolveParameter) {
        resolve(resolveParameter);
      } else {
        resolve();
      }
    }
  }

  handleResponse(response: any, reject: any, next: () => void) {
    if (response && response.error) {
      if (response.error.message) {
        reject(response.error.message);
      } else {
        reject(response.error);
      }
    } else {
      next();
    }
  }
}
