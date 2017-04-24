export const REPLY_hello = 'Eindelijk dat kaartje te pakken! Welkom bij het Antwaarps veloke dat u van de groenplaats naar het zuid brengt.';
export const REPLY_hello_user = (name) => {
  return `Allez ${name}, hebde eindelijk u kaartje te pakken? Welkom bij het Antwaarps Veloken dat u van de groenplaats naar het zuid brengt.`;
};

export const REPLY_full = (bikes, address) => {

  const replies = [
    `Op het gemakske, er zijn \`${bikes}\` velokes in het rek van ${address}.`,
    `Chill, er zijn \`${bikes}\` velokes in het rek van ${address}.`,
    `Amai, in het rek van ${address} zijn er nog \`${bikes}\` velokes.`,
    `Geen stress! In het rek van ${address} zijn er nog \`${bikes}\` velokes.`
  ];

  return replies[Math.floor(Math.random() * (replies.length - 0) + 0)];
}

export const REPLY_almost_empty = (bikes, address) => {
  return `Haast u! Er zijn nog maar \`${bikes}\` velokes in het rek van ${address}.`;
};

export const REPLY_empty = (address) => {
  return `Tis weer van dat! Er zijn geen velokes meer in ${address}.`;
};

export const REPLY_no_stations = 'Daar zijn geen stations. Probeer een ander adres.';

export const REPLY_more_stations = (bikes, address) => {
  return `${address}: \`${bikes}\` velokes\n`;
};

export default {
  REPLY_hello,
  REPLY_hello_user,
  REPLY_full,
  REPLY_almost_empty,
  REPLY_empty,
  REPLY_no_stations,
  REPLY_more_stations
};
