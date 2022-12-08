import request from '@/utils/request.js';

export function getToken(client_id, client_secret, code) {
  return request({
    url: `/oauth2/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`,
    method: 'get'
  })
}