export const DRUNK_REPLY_hello = 'TGIF, biatch! Eindelijk kun je wat blijven plakken vanavond. Nu je toch met het veloke gaat.';
export const DRUNK_REPLY_hello_user = (name) => {
  return `Allez ${name}, hebde eindelijk u kaartje te pakken? Welkom bij het Antwaarps Veloken dat u van de groenplaats naar het zuid brengt.`;
};

export const DRUNK_REPLY_full = (bikes, address) => {

  const replies = [
    `Jupi jupi jupi! Ah de velokes? Denk dat er nog \`${bikes}\` zijn in ${address}.`,
    `Waren het nu \`${bikes}\` of \`${bikes * 2}\` velokes?`,
    `Wacht ze, oei tga wat moeilijk. Ik moet mij effe zetten. Ja eum \`${bikes}\`. * blurp *`,
  ];

  return replies[Math.floor(Math.random() * (replies.length - 0) + 0)];
}

export const DRUNK_REPLY_almost_empty = (bikes, address) => {
  return `Blijf nog maar effe plakken! Het rek is toch bekan leeg. Ik zie er maar \`${bikes}\``;
};

export const DRUNK_REPLY_empty = (address) => {
  return `Jeuj nog een pintje! Het rek is toch leeg van ${address}.`;
};

export const DRUNK_REPLY_no_stations = 'Al zat zeker? Zatlap. Chance da ge met het veloke gaat eh.';

export const DRUNK_REPLY_more_stations = (bikes, address) => {

  const replies = [
    `${address}: \`${bikes}\` velokes, zie ik dat nu dubbel?\n`,
    `Jupi jupi jupi! Ah de velokes? Denk dat er nog \`${bikes}\` zijn in ${address}.\n`,
    `Waren het er nu \`${bikes}\` of \`${bikes * 2}\`\n`,
    `Wacht ze, oei tga wat moeilijk. Ik moet mij effe zetten. Ja eum \`${bikes}\` in ${address}. * blurp *\n`,
    `Ga jij al naar huis? TGIF! Maar om naar dat ander feestje te geraken staan er nog \`${bikes}\` in het rek van ${address}.\n`
  ];

  return replies[Math.floor(Math.random() * (replies.length - 0) + 0)];

};

export default {
  DRUNK_REPLY_hello,
  DRUNK_REPLY_hello_user,
  DRUNK_REPLY_full,
  DRUNK_REPLY_almost_empty,
  DRUNK_REPLY_empty,
  DRUNK_REPLY_no_stations,
  DRUNK_REPLY_more_stations
};
