const core = require('@actions/core');
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;

const checkInputParam = function (param, errMsg) {
  if (param == '') {
    core.setFailed(errMsg);
    throw errMsg;
  }
};

try {
  const apiKey = core.getInput('api-key');
  checkInputParam(apiKey, 'API Key is required');
  core.debug('api-key: ' + apiKey.substring(0, 5) + '...');

  const key = core.getInput('key');
  checkInputParam(key, 'User/account key is required');
  core.debug('key: ' + key);

  const trafficType = core.getInput('traffic-type');
  checkInputParam(key, 'traffic-type is required');
  core.debug('traffic-type: ' + key);

  const eventType = core.getInput('event-type');
  checkInputParam(eventType, 'event-type is required');
  core.debug('key: ' + eventType);

  const value = core.getInput('value');
  //checkInputParam(key, 'value is required');
  core.debug('value: ' + value);

  const properties = core.getInput('properties');
  //checkInputParam(key, 'properties is required');
  core.debug('properties: ' + properties);

  const events = core.getMultilineInput('events');

  var factory = SplitFactory({
    core: {
      authorizationKey: apiKey,
    },
  });
  var client = factory.client();

  const track = async function () {
    events.forEach((element) => {
      core.debug('Events: ' + element);
      const parsed = JSON.parse(element);
      const k = parsed.key | key;
      const tt = parsed.trafficType | trafficType;
      const ev = parsed.eventType | eventType;
      const val = parsed.value | null;
      const prop = parsed.properties | null;

      core.debug(k + tt + ev + val + prop);
      client.track(k, tt, ev, val, prop);
    });

    await client.destroy(); // flush impressions
    client = null;
  };

  track();
} catch (error) {
  core.setFailed(error.message);
}
