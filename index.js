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

const random_gamemaster_array = size => GAMEMASTERS.sort(() => Math.random() - 0.5).slice(0, size);

const assignGamemastersStrict = (sessions, gamemasters, usedGamemasters) => {
    const unassignableRooms = [];

    sessions.forEach(session => {
        const availableGamemasters = gamemasters.filter(
            gm => gm.trained_rooms.includes(session.room.id) && !usedGamemasters.has(gm.id)
        );

        if (availableGamemasters.length === 0) {
            unassignableRooms.push(session.room);
        } else {
            const selectedGamemaster = availableGamemasters[0];
            session.assignedGamemaster = selectedGamemaster;
            usedGamemasters.add(selectedGamemaster.id);
        }
    });

    return unassignableRooms;
};

const assignGamemastersFallback = (sessions, gamemasters, usedGamemasters) => {
    sessions.forEach(session => {
        if (!session.assignedGamemaster) {
            const availableGamemasters = gamemasters.filter(gm => !usedGamemasters.has(gm.id));

            if (availableGamemasters.length > 0) {
                const selectedGamemaster = availableGamemasters[0];
                session.assignedGamemaster = selectedGamemaster;
                usedGamemasters.add(selectedGamemaster.id);
                console.log(
                    `Fallback : Aucun GM formé pour la salle "${session.room.name}". Assignation d'un GM non formé (${selectedGamemaster.name}).`
                );
            } else {
                console.log(`Impossible d'assigner un GM pour la salle : "${session.room.name}"`);
            }
        }
    });
};

const main = () => {
    const gamemasters = random_gamemaster_array(GAMEMASTERS.length);
    const sessions = ROOMS.map(room => ({ room, assignedGamemaster: null }));
    const usedGamemasters = new Set();

    const unassignableRooms = assignGamemastersStrict(sessions, gamemasters, usedGamemasters);

    if (unassignableRooms.length > 0) {
        console.log("Certaines salles n'ont pas pu être attribuées avec des GMs formés :");
        unassignableRooms.forEach(room => console.log(`- ${room.name}`));
    }
    
    // Solution 1 Proposé des GameMaster non formé mais disponible:
    assignGamemastersFallback(sessions, gamemasters, usedGamemasters);
    // Solution 2: ajouté des priorités pour chaque room et assigner en fonction des priorités
    // solution non codé

    console.log("Résultat des attributions :");
    sessions.forEach(session => {
        if (session.assignedGamemaster) {
            console.log(
                `Salle: ${session.room.name} - GM: ${session.assignedGamemaster.name} ${
                    !session.assignedGamemaster.trained_rooms.includes(session.room.id)
                        ? "(Fallback)"
                        : ""
                }`
            );
        } else {
            console.log(`Salle: ${session.room.name} - Non attribuée`);
        }
    });
};

main();
