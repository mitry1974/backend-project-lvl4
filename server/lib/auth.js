import TMError from './TMError';

export function verifyAdmin(request, reply, done) {
  if (request.currentUser.role !== 'admin') {
    request.log.error('verifyAdmin, User should has admin access rights!');
    done(new TMError('auth.userNotAdmin', '/session/new'));
  }
  done();
}

export async function verifyUserSelf(request, reply, done) {
  const { email } = request.params;
  if (request.currentUser.email !== email) {
    request.log.error('verifyUserSelf, User try to perform operation not on his own record!');
    done(new TMError('auth.userNotTheSame', '/'));
  }
  done();
}

export function verifyLoggedIn(request, reply, done) {
  if (request.currentUser.id === null) {
    request.log.error('verifyLoggedIn, User not logged in!');
    done(new TMError('auth.userNotLoggedIn', '/session/new'));
  }
  done();
}
