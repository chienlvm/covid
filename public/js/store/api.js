/**
 * api.js
 * Copy right 2020 by ChienLVM.co.ldt
 */
const axios = require('axios');
const _ = require('lodash');

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
const api = (config) => {
  return new Promise((resolve, reject) => {
    axios(config)
      .then((res) => {
        if (_.hasIn(res, 'data.error') || res.data.error === 'UNAUTHORIZED') {
          return Promise.reject(
            Object.assign({}, new Error(), { response: res })
          );
        }
        return Promise.resolve(res);
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        const hasErr = _.hasIn(err, 'response.data.error');
        if (hasErr) {
          console.log('loi');
        }
      });
  });
};

exports.defaults = {
  api,
};
