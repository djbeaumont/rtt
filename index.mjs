import Fastify from 'fastify'
import dotenv from 'dotenv';

import { client } from './client.mjs';

dotenv.config();

const fastify = Fastify({
  logger: true
});

function getCurrentLocation(serviceDetail) {
  let departed = serviceDetail.origin[0].description;

  for (const location of serviceDetail.locations) {
    if (location.serviceLocation === 'AT_PLAT') {
      return `Train is at ${location.description}`;
    }

    if (location.realtimeDepartureActual) {
      departed = location.description;
    } else {
      return `Train is between ${departed} and ${location.description}`;
    }
  }
}

function getRealDestinationTime(serviceDetail) {
  // Why can we have multiple origins?
  const { tiploc } = serviceDetail.destination[0];
  const location = serviceDetail.locations.at(-1);

  if (location.tiploc !== tiploc) {
    throw new Error('Final location was not the same as destination!');
  }

  return location.realtimeArrival;
}

fastify.get('/', async () => {
  const departuresResponse = await client.getUpcomingDepartures('WYE');
  const next3CallingServices = departuresResponse.services.slice(0, 3);

  const services = [];
  for (const service of next3CallingServices) {
    const detailedService = await client.getServiceInformation(service.serviceUid, service.runDate);

    // Why can we have multiple destinations?
    const destination = service.locationDetail.destination[0];

    services.push({
      id: service.serviceUid,
      booked_departure_time: service.locationDetail.gbttBookedDeparture,
      real_departure_time: service.locationDetail.realtimeDeparture,
      current_location: getCurrentLocation(detailedService),
      destination: {
        name: destination.description,
        booked_time: destination.publicTime,
        real_time: getRealDestinationTime(detailedService),
      },
    });
  }

  return {
    services,
  };
});

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
