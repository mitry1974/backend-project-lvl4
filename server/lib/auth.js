import AuthorizationError from '../errors/AuthorizationError';

export async function verifyAdmin(request) {
  if (request.currentUser.role !== 'admin') {
    request.log.error('User should has admin rights!');
    throw new AuthorizationError();
  }
}

export async function verifyUserSelf(request) {
  const { email } = request.params;
  if (request.currentUser.email !== email) {
    request.log.error('User try to perform operation not on his own record!');
    throw new AuthorizationError();
  }
}

export async function verifyLoggedIn(request) {
  if (request.currentUser.id === null) {
    request.log.error('User not logged in!');
    throw new AuthorizationError();
  }
}
