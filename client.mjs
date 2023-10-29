const RTT_BASE_PATH = 'https://api.rtt.io/api/v1';


let token;
function getToken() {
  if (token) {
    return token;
  }
  token = Buffer.from(`${process.env.RTT_USERNAME}:${process.env.RTT_PASSWORD}`).toString('base64');
  return token;
}

async function getResponse(path) {
  const headers = {
    accept: 'application/json',
    authorization: `Basic ${getToken()}`,
  };

  const rttResponse = await fetch(RTT_BASE_PATH + path, { headers });
  if (rttResponse.status !== 200) {
    throw new Error('RTT error: ' + await rttResponse.text());
  }

  return await rttResponse.json();
}

async function getUpcomingDepartures(station) {
  return await getResponse(`/json/search/${station}`);
}

async function getServiceInformation(serviceUid, date) {
  const match = date.match(/([\d]{4})-([\d]{2})-([\d]{2})/);
  if (!match) {
    throw new Error('Could not parse service date: ' + date);
  }

  const [, year, month, day] = match;
  return await getResponse(`/json/service/${serviceUid}/${year}/${month}/${day}`);
}

export const client = {
  getUpcomingDepartures,
  getServiceInformation,
};
