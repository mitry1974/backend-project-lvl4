import AuthorizationError from '../errors/AuthorizationError';
import AuthenticationError from '../errors/AutheticationError';

export async function verifyAdmin(request) {
  if (request.currentUser.role !== 'admin') {
    throw new AuthorizationError();
  }
}

export async function verifyUserSelf(request) {
  const { email } = request.params;
  if (request.currentUser.email !== email) {
    throw new AuthorizationError();
  }
}

export async function verifyLoggedIn(request) {
  if (request.currentUser.id === null) {
    throw new AuthorizationError();
  }
}
