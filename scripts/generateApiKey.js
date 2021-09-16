// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = () => {
  const apiKey = uuid.v4();
  console.log('Creating a new SSM Parameter for apiKey. Value:', apiKey);
  return apiKey;
};
