const GAMEMASTERS = [
  { id: 1, name: "John", trained_rooms: [2, 3, 5] },

  { id: 2, name: "Alice", trained_rooms: [4, 10] },

  { id: 3, name: "David", trained_rooms: [5] },

  { id: 4, name: "Emily", trained_rooms: [8, 6, 2, 7] },

  { id: 5, name: "Michael", trained_rooms: [9, 1, 4, 3, 11, 8, 6, 12] },

  { id: 6, name: "Sophia", trained_rooms: [7, 10] },

  { id: 7, name: "Daniel", trained_rooms: [8] },

  { id: 8, name: "Olivia", trained_rooms: [3, 9] },

  { id: 9, name: "Matthew", trained_rooms: [2, 6, 1, 7, 3, 4] },

  { id: 10, name: "Emma", trained_rooms: [5, 4] },

  { id: 11, name: "James", trained_rooms: [11, 6] },

  { id: 12, name: "Isabella", trained_rooms: [7, 4, 12] },

  { id: 13, name: "William", trained_rooms: [11, 12] },

  { id: 14, name: "Ava", trained_rooms: [9, 11, 10] },

  { id: 15, name: "Benjamin", trained_rooms: [8, 4] },

  { id: 16, name: "Mia", trained_rooms: [1, 3, 7, 5, 8] },

  { id: 17, name: "Ethan", trained_rooms: [4, 2] },

  { id: 18, name: "Charlotte", trained_rooms: [10] },

  { id: 19, name: "Alexandre", trained_rooms: [9, 2, 8] },

  { id: 20, name: "Harper", trained_rooms: [1, 12] },
];

const ROOMS = [
  { id: 1, name: "Le Braquage à la française" },

  { id: 2, name: "Le Braquage de casino" },

  { id: 3, name: "L'Enlèvement" },

  { id: 4, name: "Le Métro" },

  { id: 5, name: "Les Catacombes" },

  { id: 6, name: "Assassin's Creed" },

  { id: 7, name: "L'Avion" },

  { id: 8, name: "La Mission spatiale" },

  { id: 9, name: "Le Tremblement de terre" },

  { id: 10, name: "Le Cinéma hanté" },

  { id: 11, name: "Le Farwest" },

  { id: 12, name: "Mission secrète" },
];

const random_gamemaster_array = (size) =>
  GAMEMASTERS.sort(() => Math.random() - 0.5).slice(0, size);

const assignGamemasters = (rooms, gamemasters, usedGamemasters) => {
  const unassignableRooms = [];

  rooms.forEach((room) => {
    const availableGamemasters = gamemasters
      .filter(
        (gm) =>
          gm.trained_rooms.includes(room.id) && !usedGamemasters.has(gm.id)
      )
      .sort((a, b) => a.trained_rooms.length - b.trained_rooms.length);

    if (availableGamemasters.length === 0) {
      unassignableRooms.push(room);
    } else {
      const selectedGamemaster = availableGamemasters[0];
      room.assignedGamemaster = selectedGamemaster;
      usedGamemasters.add(selectedGamemaster.id);
    }
  });

  return unassignableRooms;
};

/**
 * Tente de réattribuer des Game Masters aux salles qui n'ont pas été attribuées
 * lors du premier passage, en trouvant une autre salle ayant un Game Master
 * formé pour la salle en question et en échangeant les deux Game Masters.
 *
 * @param {Array} rooms Liste des salles nécessitant un Game Master attribué.
 * @param {Array} gamemasters Liste de tous les Game Masters disponibles.
 * @param {Set} usedGamemasters Ensemble des IDs des Game Masters qui ont déjà
 * été attribués.
 *
 * @returns {Array} Liste des salles qui n'ont toujours pas de Game Master
 * attribué après l'étape de réattribution.
 */
const reassignGamemasters = (rooms, gamemasters, usedGamemasters) => {
  const unassignableRooms = rooms.filter((room) => !room.assignedGamemaster);

  for (let room of unassignableRooms) {
    for (let otherRoom of rooms) {
      const gmAssigned = otherRoom.assignedGamemaster;

      if (
        gmAssigned &&
        gmAssigned.trained_rooms.includes(room.id) &&
        room !== otherRoom
      ) {
        const availableReplacement = gamemasters.find(
          (gm) =>
            gm.trained_rooms.includes(otherRoom.id) &&
            !usedGamemasters.has(gm.id) &&
            gm.id !== gmAssigned.id
        );

        if (availableReplacement) {
          console.log(
            `Échange : GM "${gmAssigned.name}" de la salle "${otherRoom.name}" vers "${room.name}", remplacé par "${availableReplacement.name}".`
          );

          room.assignedGamemaster = gmAssigned;
          otherRoom.assignedGamemaster = availableReplacement;

          usedGamemasters.add(availableReplacement.id);
          break;
        }
      }
    }
  }

  return rooms.filter((room) => !room.assignedGamemaster);
};

/**
 * Fonction Fallback pour attribuer un Game Master non formé à une salle si aucun Game Master formé n'est disponible.
 *
 * @param {Array} rooms Liste des salles qui nécessitent l'attribution d'un Game Master.
 * @param {Array} gamemasters Liste de tous les Game Masters disponibles.
 * @param {Set} usedGamemasters Ensemble des IDs des Game Masters qui ont déjà été attribués.
 */
const assignGamemastersFallback = (rooms, gamemasters, usedGamemasters) => {
  rooms.forEach((room) => {
    if (!room.assignedGamemaster) {
      const availableGamemasters = gamemasters.filter(
        (gm) => !usedGamemasters.has(gm.id)
      );

      if (availableGamemasters.length > 0) {
        const selectedGamemaster = availableGamemasters[0];
        room.assignedGamemaster = selectedGamemaster;
        usedGamemasters.add(selectedGamemaster.id);
        console.log(
          `Fallback : Aucun GM formé pour la salle "${room.name}". Assignation d'un GM non formé (${selectedGamemaster.name}).`
        );
      } else {
        console.log(
          `Impossible d'assigner un GM pour la salle : "${room.name}"`
        );
      }
    }
  });
};

const main = () => {
  const gamemasters = random_gamemaster_array(ROOMS.length);
  const sessions = ROOMS.map((room) => ({ room }));
  const rooms = ROOMS.slice();

  const usedGamemasters = new Set();

  // Attribution des Game Masters formés de façon stricte
  console.log("Attribution des Game Masters...");
  const unassignableRooms = assignGamemasters(
    rooms,
    gamemasters,
    usedGamemasters
  );

  if (unassignableRooms.length > 0) {
    console.log(
      "Certaines salles n'ont pas pu être attribuées avec des GMs formés :"
    );
    unassignableRooms.forEach((room) => console.log(`- ${room.name}`));
  }
  // Ici on rajoute une étape qui regarde si on peut réassigner les GMs formés pour optimiser
  console.log("Réassignation pour optimiser...");
  const remainingUnassignableRooms = reassignGamemasters(
    rooms,
    gamemasters,
    usedGamemasters
  );

  if (remainingUnassignableRooms.length > 0) {
    console.log(
      "Certaines salles n'ont pas pu être attribuées après optimisation :"
    );
    assignGamemastersFallback(
      remainingUnassignableRooms,
      gamemasters,
      usedGamemasters
    );
  } else {
    console.log("Toutes les salles ont été attribuées après optimisation !");
  }

  sessions.forEach((session) => {
    const room = rooms.find((r) => r.id === session.room.id);
    session.room.assignedGamemaster = room.assignedGamemaster;
  });

  // Affichage du Resutlat des attributions
  console.log("\nRésultat des attributions :");
  sessions.forEach((session) => {
    if (session.room.assignedGamemaster) {
      console.log(
        `Salle: ${session.room.name} - GM: ${
          session.room.assignedGamemaster.name
        } ${
          !session.room.assignedGamemaster.trained_rooms.includes(
            session.room.id
          )
            ? "à former (Fallback)"
            : ""
        }`
      );
    } else {
      console.log(`Salle: ${session.room.name} - Non attribuée`);
    }
  });

  // Dernier message pour indiquer si toutes les salles ont pu être attribuées ou non
  console.log(
    `${
      rooms.every((room) => room.assignedGamemaster)
        ? "Toutes les salles ont pu être attribuées !"
        : "Certaines salles n'ont pas pu être attribuées !"
    } `
  );
};

main();
